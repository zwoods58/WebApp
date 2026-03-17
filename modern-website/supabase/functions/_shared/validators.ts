/**
 * Input Validation Schemas
 * 
 * Zod schemas for all authentication endpoints.
 * Ensures consistent data structures across Kenya, Nigeria, and South Africa.
 */

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// ═══════════════════════════════════════════════════════════════
// WEAK PIN BLACKLIST
// Common patterns that must be rejected
// ═══════════════════════════════════════════════════════════════

const WEAK_PINS = [
    '000000', '111111', '222222', '333333', '444444',
    '555555', '666666', '777777', '888888', '999999',
    '123456', '654321', '123123', '111222', '121212',
    '112233', '123321', '696969'
];

// ═══════════════════════════════════════════════════════════════
// BASE VALIDATION RULES
// ═══════════════════════════════════════════════════════════════

const phoneSchema = z.string()
    .regex(/^\d{10,15}$/, "Phone must be 10-15 digits");

const pinSchema = z.string()
    .length(6, "PIN must be exactly 6 digits")
    .regex(/^\d{6}$/, "PIN must contain only numbers")
    .refine(pin => !WEAK_PINS.includes(pin), "PIN is too weak - choose a different PIN");

const emailSchema = z.string()
    .email("Invalid email address")
    .toLowerCase()
    .trim();

const countryCodeSchema = z.enum(['KE', 'NG', 'ZA']);

const deviceFingerprintSchema = z.string().min(10);

const smsCodeSchema = z.string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be numeric");

// ═══════════════════════════════════════════════════════════════
// REQUEST SCHEMAS FOR EACH ENDPOINT
// ═══════════════════════════════════════════════════════════════

/**
 * Request verification code (SMS or Email)
 */
export const RequestVerificationSchema = z.object({
    action: z.literal('request-verification'),
    phone: phoneSchema,
    countryCode: countryCodeSchema,
    purpose: z.enum(['signup', 'recovery'])
});

/**
 * Signup - Create new account
 */
export const SignupRequestSchema = z.object({
    action: z.literal('signup'),
    phone: phoneSchema,
    countryCode: countryCodeSchema,
    smsCode: smsCodeSchema,
    pin: pinSchema,
    pinConfirm: pinSchema,
    businessName: z.string().min(2).max(255).trim(),
    backupEmail: emailSchema,
    deviceFingerprint: deviceFingerprintSchema.optional()
}).refine(data => data.pin === data.pinConfirm, {
    message: "PINs do not match",
    path: ["pinConfirm"]
});

/**
 * Login - Authenticate existing user
 */
export const LoginRequestSchema = z.object({
    action: z.literal('login'),
    phone: phoneSchema,
    countryCode: countryCodeSchema,
    pin: pinSchema,
    deviceFingerprint: deviceFingerprintSchema.optional()
});

/**
 * Request recovery codes (SMS + Email)
 */
export const RequestRecoverySchema = z.object({
    action: z.literal('request-recovery'),
    phone: phoneSchema,
    countryCode: countryCodeSchema
});

/**
 * Complete recovery - Reset PIN with multi-factor verification
 */
export const CompleteRecoverySchema = z.object({
    action: z.literal('complete-recovery'),
    phone: phoneSchema,
    countryCode: countryCodeSchema,
    smsCode: smsCodeSchema,
    emailCode: smsCodeSchema,
    securityAnswer: z.string().min(2).trim(),  // Business name
    newPin: pinSchema,
    newPinConfirm: pinSchema,
    deviceFingerprint: deviceFingerprintSchema.optional()
}).refine(data => data.newPin === data.newPinConfirm, {
    message: "PINs do not match",
    path: ["newPinConfirm"]
});

/**
 * Refresh access token
 */
export const RefreshTokenSchema = z.object({
    refreshToken: z.string().uuid()
});

/**
 * Revoke session(s)
 */
export const RevokeSessionSchema = z.object({
    sessionId: z.string().uuid().optional(),  // If not provided, revoke all
    exceptCurrent: z.boolean().optional()
});

/**
 * Combined auth request schema (union of all actions)
 */
export const AuthRequestSchema = z.discriminatedUnion('action', [
    RequestVerificationSchema,
    SignupRequestSchema,
    LoginRequestSchema,
    RequestRecoverySchema,
    CompleteRecoverySchema
]);

export type AuthRequest = z.infer<typeof AuthRequestSchema>;
