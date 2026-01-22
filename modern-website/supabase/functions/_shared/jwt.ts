/**
 * Stateful JWT Management
 * 
 * Unlike standard JWT implementations, this implements "Stateful JWTs with Kill Switch".
 * Every token validation checks the database to ensure the session hasn't been revoked.
 * 
 * This allows instant remote logout of stolen devices.
 */

import { create, verify, decode, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import { hashSecret } from "./hasher.ts";

// JWT signing key (loaded from environment)
let JWT_SECRET_KEY: CryptoKey | null = null;

/**
 * Initialize JWT secret key from environment
 * Must be called before any JWT operations
 */
async function getJWTKey(): Promise<CryptoKey> {
    if (JWT_SECRET_KEY) return JWT_SECRET_KEY;

    const secret = Deno.env.get("JWT_SECRET");
    if (!secret) {
        throw new Error("JWT_SECRET not configured");
    }

    JWT_SECRET_KEY = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );

    return JWT_SECRET_KEY;
}

/**
 * Generate a new session with access + refresh tokens
 * 
 * Flow:
 * 1. Generate refresh token (30-day UUID)
 * 2. Hash refresh token (SHA-256) and store in DB
 * 3. Generate access token (15-min JWT)
 * 4. Return both tokens + session ID
 * 
 * @param supabase - Supabase client
 * @param userId - User UUID
 * @param fingerprint - Device fingerprint
 * @param deviceName - Human-readable device name
 * @returns Session data with tokens
 */
export async function generateSession(
    supabase: any,
    userId: string,
    fingerprint: string = 'unknown',
    deviceName: string = 'Unknown Device'
) {
    const key = await getJWTKey();

    // 1. Generate refresh token
    const refreshToken = crypto.randomUUID();
    const refreshTokenHash = await hashSecret(refreshToken);

    // 2. Create access token (15 minutes)
    const accessToken = await create({ alg: "HS256", typ: "JWT" }, {
        sub: userId,
        exp: getNumericDate(15 * 60), // 15 minutes from now
        iat: getNumericDate(0),
        type: 'access'
    }, key);

    // 3. Store session in DB
    const { data: session, error } = await supabase
        .from("user_sessions")
        .insert({
            user_id: userId,
            refresh_token_hash: refreshTokenHash,
            device_fingerprint: fingerprint,
            device_name: deviceName,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            revoked: false
        })
        .select()
        .single();

    if (error) {
        console.error('Failed to create session:', error);
        throw new Error('Failed to create session');
    }

    return {
        accessToken,
        refreshToken,
        sessionId: session.id,
        expiresIn: 15 * 60, // seconds
        refreshExpiresIn: 30 * 24 * 60 * 60 // seconds
    };
}

/**
 * Verify access token and check session status
 * 
 * THE STATEFUL CHECK (The Kill Switch):
 * 1. Verify JWT signature
 * 2. Check DB for active session
 * 3. If session revoked, reject immediately
 * 
 * @param token - Access token
 * @param supabase - Supabase client
 * @returns User ID if valid, throws error otherwise
 */
export async function verifyAccessToken(token: string, supabase: any): Promise<{ userId: string, sessionId: string }> {
    const key = await getJWTKey();

    try {
        // 1. Verify signature
        const payload = await verify(token, key);

        if (payload.type !== 'access') {
            throw new Error('Invalid token type');
        }

        const userId = payload.sub as string;

        // 2. Check session status in DB (THE KILL SWITCH)
        const { data: session, error } = await supabase
            .from("user_sessions")
            .select("id, revoked, expires_at")
            .eq("user_id", userId)
            .eq("revoked", false)
            .gte("expires_at", new Date().toISOString())
            .limit(1)
            .single();

        if (error || !session) {
            throw new Error('Session revoked or expired');
        }

        // 3. Update last_used timestamp
        await supabase
            .from("user_sessions")
            .update({ last_used: new Date().toISOString() })
            .eq("id", session.id);

        return { userId, sessionId: session.id };
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Unauthorized');
    }
}

/**
 * Refresh access token using refresh token
 * 
 * @param refreshToken - Refresh token UUID
 * @param supabase - Supabase client
 * @returns New access token
 */
export async function refreshAccessToken(refreshToken: string, supabase: any) {
    const key = await getJWTKey();
    const refreshTokenHash = await hashSecret(refreshToken);

    // 1. Find session by refresh token hash
    const { data: session, error } = await supabase
        .from("user_sessions")
        .select("user_id, revoked, expires_at")
        .eq("refresh_token_hash", refreshTokenHash)
        .eq("revoked", false)
        .gte("expires_at", new Date().toISOString())
        .single();

    if (error || !session) {
        throw new Error('Invalid refresh token');
    }

    // 2. Generate new access token
    const accessToken = await create({ alg: "HS256", typ: "JWT" }, {
        sub: session.user_id,
        exp: getNumericDate(15 * 60),
        iat: getNumericDate(0),
        type: 'access'
    }, key);

    // 3. Update last_used
    await supabase
        .from("user_sessions")
        .update({ last_used: new Date().toISOString() })
        .eq("refresh_token_hash", refreshTokenHash);

    return {
        accessToken,
        expiresIn: 15 * 60
    };
}

/**
 * Revoke session(s) - THE KILL SWITCH
 * 
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param sessionId - Specific session to revoke (optional)
 * @param exceptCurrent - Revoke all except current session ID
 * @param reason - Revocation reason
 */
export async function revokeSessions(
    supabase: any,
    userId: string,
    sessionId?: string,
    exceptCurrent?: string,
    reason: string = 'user_initiated'
) {
    if (sessionId) {
        // Revoke specific session
        await supabase
            .from("user_sessions")
            .update({
                revoked: true,
                revoked_at: new Date().toISOString(),
                revoked_reason: reason
            })
            .eq("id", sessionId)
            .eq("user_id", userId);
    } else if (exceptCurrent) {
        // Revoke all except current
        await supabase
            .from("user_sessions")
            .update({
                revoked: true,
                revoked_at: new Date().toISOString(),
                revoked_reason: reason
            })
            .eq("user_id", userId)
            .neq("id", exceptCurrent);
    } else {
        // Revoke ALL sessions
        await supabase
            .from("user_sessions")
            .update({
                revoked: true,
                revoked_at: new Date().toISOString(),
                revoked_reason: reason
            })
            .eq("user_id", userId);
    }
}
