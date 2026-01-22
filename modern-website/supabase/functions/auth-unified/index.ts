/**
 * Unified Authentication Endpoint - ROBUST NATIVE EDITION
 * 
 * Uses Deno's native crypto.subtle for hashing (no BcryptJS/Argon2)
 * Ensures CORS headers on all status codes.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import { sendVerificationSMS, TwilioVerify } from "../_shared/sms.ts";
import { sendVerificationEmail } from "../_shared/email.ts";
import { getCountryConfig, type CountryCode } from "../_shared/country-config.ts";

// ═══════════════════════════════════════════════════════════════
// CORS & RESPONSE HELPERS
// ═══════════════════════════════════════════════════════════════

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Max-Age': '86400',
};

function createResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// NATIVE CRYPTO HASHING (PBKDF2)
// ═══════════════════════════════════════════════════════════════

async function hashPin(pin: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(pin),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        256
    );

    const hashArray = new Uint8Array(derivedBits);
    const combined = new Uint8Array(salt.length + hashArray.length);
    combined.set(salt);
    combined.set(hashArray, salt.length);

    return btoa(String.fromCharCode(...combined));
}

async function verifyPin(storedHash: string, providedPin: string): Promise<boolean> {
    try {
        const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));
        const salt = combined.slice(0, 16);
        const hash = combined.slice(16);

        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(providedPin),
            "PBKDF2",
            false,
            ["deriveBits"]
        );

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            256
        );

        const providedHash = new Uint8Array(derivedBits);
        if (hash.length !== providedHash.length) return false;

        let match = true;
        for (let i = 0; i < hash.length; i++) {
            if (hash[i] !== providedHash[i]) match = false;
        }
        return match;
    } catch {
        return false;
    }
}

async function hashSecret(secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashSecurityAnswer(answer: string): Promise<string> {
    const normalized = answer.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    return await hashSecret(normalized);
}

// ═══════════════════════════════════════════════════════════════
// JWT
// ═══════════════════════════════════════════════════════════════

let JWT_KEY: CryptoKey | null = null;
async function getJWTKey(): Promise<CryptoKey> {
    if (JWT_KEY) return JWT_KEY;
    const secret = Deno.env.get("JWT_SECRET");
    if (!secret) throw new Error("JWT_SECRET not configured");
    JWT_KEY = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );
    return JWT_KEY;
}

async function generateSession(supabase: any, userId: string, deviceFingerprint: string, userAgent: string) {
    const refreshToken = crypto.randomUUID();
    const { data: session, error } = await supabase
        .from('user_sessions')
        .insert({
            user_id: userId,
            device_fingerprint: deviceFingerprint,
            device_name: userAgent,
            refresh_token_hash: await hashSecret(refreshToken),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

    if (error) throw error;

    const key = await getJWTKey();
    const accessToken = await create(
        { alg: "HS256", typ: "JWT" },
        { sub: userId, session_id: session.id, exp: getNumericDate(60 * 60) },
        key
    );

    return { accessToken, refreshToken, expiresAt: session.expires_at };
}

// ═══════════════════════════════════════════════════════════════
// VALIDATORS
// ═══════════════════════════════════════════════════════════════

const phoneSchema = z.string().min(8).max(18).regex(/^\+?\d+$/, "Phone must contain only digits or start with +");
const pinSchema = z.string().length(6).regex(/^\d{6}$/);
const countryCodeSchema = z.enum(['KE', 'NG', 'ZA']);

const AuthRequestSchema = z.discriminatedUnion('action', [
    z.object({
        action: z.literal('request-verification'),
        phone: phoneSchema,
        countryCode: countryCodeSchema,
        purpose: z.enum(['signup', 'recovery'])
    }),
    z.object({
        action: z.literal('signup'),
        phone: phoneSchema,
        countryCode: countryCodeSchema,
        smsCode: z.string().length(6),
        pin: pinSchema,
        pinConfirm: pinSchema,
        businessName: z.string().min(1),
        backupEmail: z.string().min(1),
        deviceFingerprint: z.string().optional()
    }),
    z.object({
        action: z.literal('ping'),
        data: z.any().optional()
    }),
    z.object({
        action: z.literal('request-recovery'),
        phone: phoneSchema,
        countryCode: countryCodeSchema
    }),
    z.object({
        action: z.literal('complete-recovery'),
        phone: phoneSchema,
        countryCode: countryCodeSchema,
        smsCode: z.string().length(6),
        emailCode: z.string().length(6),
        securityAnswer: z.string().min(1),
        newPin: pinSchema,
        newPinConfirm: pinSchema
    }),
    z.object({
        action: z.literal('login'),
        phone: phoneSchema,
        countryCode: countryCodeSchema,
        pin: pinSchema,
        deviceFingerprint: z.string().optional()
    })
]);

// ═══════════════════════════════════════════════════════════════
// VERIFICATION HELPERS
// ═══════════════════════════════════════════════════════════════

async function validateVerificationCode(
    supabase: any,
    phoneOrEmail: string,
    code: string,
    purpose: string,
    countryCode?: CountryCode
): Promise<boolean> {
    console.log(`[AUTH] Checking code ${code} for ${phoneOrEmail} (${purpose})`);

    // 1. External Provider Check (Twilio Verify)
    if (countryCode) {
        const config = getCountryConfig(countryCode);
        if (config.smsProvider === 'twilio-verify') {
            // Special case for "Magic Code" on test numbers even with Twilio Verify
            // GLOBAL BYPASS ENABLED
            if (code === '123456') { // phoneOrEmail.endsWith('0000') && code === '123456') {
                return true;
            }
            console.log(`[AUTH] Verifying via Twilio Verify`);
            return await TwilioVerify.checkVerification(phoneOrEmail, code);
        }
    }

    // 2. Local DB Check
    const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('phone_or_email', phoneOrEmail)
        .eq('purpose', purpose)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.warn('[AUTH] Code check error:', error.message);
        return false;
    }

    if (!data || data.code !== code) {
        console.warn(`[AUTH] Code mismatch. Got ${code}, DB has ${data?.code}`);
        return false;
    }

    await supabase.from('verification_codes').update({ used: true }).eq('id', data.id);
    return true;
}

// ═══════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? '',
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ''
    );

    try {
        const body = await req.json();
        console.log('[AUTH] Request body:', JSON.stringify(body));

        const validated = AuthRequestSchema.parse(body);
        console.log('[AUTH] Action:', validated.action);

        // ACTION: ping
        if (validated.action === 'ping') {
            return createResponse({ success: true, pong: true, timestamp: new Date().toISOString() });
        }

        // ACTION: request-verification
        if (validated.action === 'request-verification') {
            const config = getCountryConfig(validated.countryCode);
            // GLOBAL TEST MODE ENABLED (Per User Request)
            const isTestNumber = true; // validated.phone.endsWith('0000');

            // PATH A: Twilio Verify (External)
            if (config.smsProvider === 'twilio-verify') {
                if (isTestNumber) {
                    console.log(`[AUTH] TEST MODE: Skipping Twilio for ${validated.phone}`);
                    return createResponse({
                        success: true,
                        message: 'Verification code sent (Test Mode: 123456)!',
                        debugCode: '123456'
                    });
                }

                const started = await TwilioVerify.startVerification(validated.phone);
                return createResponse({
                    success: started,
                    message: started ? 'Verification code sent via WhatsApp!' : 'Failed to send verification code'
                }, started ? 200 : 400);
            }

            // PATH B: Local DB Code Gen (Legacy/Other Providers)
            const code = isTestNumber ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

            console.log(`[AUTH] Generated code ${code} for ${validated.phone} (Test: ${isTestNumber})`);

            const { error } = await supabase.from('verification_codes').insert({
                phone_or_email: validated.phone,
                code,
                purpose: validated.purpose,
                expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
            });

            if (error) throw error;

            if (isTestNumber) {
                console.log(`[AUTH] TEST MODE: Skipping real SMS for ${validated.phone}`);
                return createResponse({
                    success: true,
                    message: 'Verification code sent (Test Mode: 123456)!',
                    debugCode: code
                });
            }

            // Real SMS SEND
            const sent = await sendVerificationSMS(validated.phone, validated.countryCode, code);
            if (!sent) {
                console.error(`[AUTH] Failed to send SMS to ${validated.phone}`);
            }

            return createResponse({
                success: true,
                message: 'Verification code sent!'
            });
        }

        // ACTION: request-recovery
        if (validated.action === 'request-recovery') {
            const { phone, countryCode } = validated;
            const isTestNumber = phone.endsWith('0000');

            const { data: user } = await supabase
                .from('business_users')
                .select('backup_email')
                .eq('phone_number', phone)
                .eq('country_code', countryCode)
                .single();

            if (!user) return createResponse({ error: 'User not found' }, 404);

            const code = isTestNumber ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

            await supabase.from('verification_codes').insert([
                { phone_or_email: phone, code, purpose: 'recovery', expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() },
                { phone_or_email: user.backup_email, code, purpose: 'recovery', expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() }
            ]);

            if (isTestNumber) {
                console.log(`[AUTH] TEST RECOVERY for ${phone}: 123456`);
                return createResponse({ success: true, message: 'Recovery code: 123456', debugCode: '123456' });
            }

            // Send Real SMS
            await sendVerificationSMS(phone, countryCode, code);

            // Send Real Email
            await sendVerificationEmail(user.backup_email, code, 'recovery');

            return createResponse({ success: true, message: 'Recovery codes sent to your phone and email.' });
        }

        // ACTION: complete-recovery
        if (validated.action === 'complete-recovery') {
            const { phone, countryCode, smsCode, emailCode, securityAnswer, newPin, newPinConfirm } = validated;

            if (newPin !== newPinConfirm) return createResponse({ error: 'New PINs do not match' }, 400);

            const { data: user } = await supabase
                .from('business_users')
                .select('*')
                .eq('phone_number', phone)
                .eq('country_code', countryCode)
                .single();

            if (!user) return createResponse({ error: 'User not found' }, 404);

            if ((await hashSecurityAnswer(securityAnswer)) !== user.security_answer_hash) {
                return createResponse({ error: 'Incorrect security answer' }, 401);
            }

            if (!await validateVerificationCode(supabase, phone, smsCode, 'recovery', countryCode)) {
                return createResponse({ error: 'Invalid SMS code' }, 401);
            }

            if (!await validateVerificationCode(supabase, user.backup_email, emailCode, 'recovery')) {
                return createResponse({ error: 'Invalid email code' }, 401);
            }

            await supabase.from('business_users').update({ pin_hash: await hashPin(newPin) }).eq('id', user.id);
            return createResponse({ success: true, message: 'PIN reset successful' });
        }

        // ACTION: signup
        if (validated.action === 'signup') {
            const { phone, countryCode, smsCode, pin, pinConfirm, businessName, backupEmail, deviceFingerprint } = validated;

            if (pin !== pinConfirm) {
                return createResponse({ error: 'PINs do not match' }, 400);
            }

            // Pass countryCode for Twilio Verify check
            const isCodeValid = await validateVerificationCode(supabase, phone, smsCode, 'signup', countryCode);
            if (!isCodeValid) {
                return createResponse({ error: 'Invalid or expired SMS code' }, 400);
            }

            console.log('[AUTH] Creating user...');
            const { data: user, error: userError } = await supabase
                .from('business_users')
                .insert({
                    phone_number: phone,
                    country_code: countryCode,
                    pin_hash: await hashPin(pin),
                    business_name: businessName,
                    backup_email: backupEmail,
                    security_answer_hash: await hashSecurityAnswer(businessName)
                })
                .select()
                .single();

            if (userError) {
                console.error('[AUTH] Signup DB Error:', userError);
                return createResponse({ error: `Signup failed: ${userError.message}` }, 400);
            }

            const session = await generateSession(
                supabase,
                user.id,
                deviceFingerprint || 'unknown',
                req.headers.get('user-agent') || 'unknown'
            );

            return createResponse({
                success: true,
                ...session,
                user: { id: user.id, phone: user.phone_number, businessName: user.business_name }
            });
        }

        // ACTION: login
        if (validated.action === 'login') {
            const { phone, countryCode, pin, deviceFingerprint } = validated;

            const { data: user, error } = await supabase
                .from('business_users')
                .select('*')
                .eq('phone_number', phone)
                .eq('country_code', countryCode)
                .single();

            if (error || !user) {
                return createResponse({ error: 'Invalid credentials' }, 401);
            }

            const isPinValid = await verifyPin(user.pin_hash, pin);
            if (!isPinValid) {
                return createResponse({ error: 'Invalid credentials' }, 401);
            }

            const session = await generateSession(
                supabase,
                user.id,
                deviceFingerprint || 'unknown',
                req.headers.get('user-agent') || 'unknown'
            );

            return createResponse({
                success: true,
                ...session,
                user: { id: user.id, phone: user.phone_number, businessName: user.business_name }
            });
        }

        return createResponse({ error: 'Invalid action' }, 400);

    } catch (e: any) {
        console.error('[AUTH] CRASH:', e);

        if (e.name === 'ZodError') {
            const msg = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
            return createResponse({ error: `Validation error: ${msg}`, details: e.errors }, 400);
        }

        return createResponse({ error: e.message || 'Internal server error' }, 500);
    }
});
