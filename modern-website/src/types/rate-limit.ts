export type RateLimitType = 
  | 'signup'
  | 'pin_verify'
  | 'pin_reset_request'
  | 'pin_reset_verify'
  | 'pin_reset_complete'
  | 'forgot_pin_phone'
  | 'forgot_pin_answers'
  | 'transactions'
  | 'inventory'
  | 'services'
  | 'appointments'
  | 'credit'
  | 'beehive';

export interface RateLimitConfig {
  maxAttempts: number;
  windowSeconds: number;
  progressive?: boolean;
  lockoutSeconds?: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  lockoutUntil?: Date;
  escalationLevel?: number;
  message?: string;
}

export interface FailedPinRecord {
  phoneNumber: string;
  attempts: number;
  lockoutUntil: Date | null;
  escalationLevel: number;
}

export const DEFAULT_RATE_LIMITS: Record<RateLimitType, RateLimitConfig> = {
  signup: {
    maxAttempts: 10,
    windowSeconds: 900, // 15 minutes
    progressive: false,
  },
  pin_verify: {
    maxAttempts: 15,
    windowSeconds: 900,
    progressive: true,
    lockoutSeconds: [0, 30, 60, 300, 900, 3600, 86400],
  },
  pin_reset_request: {
    maxAttempts: 5,
    windowSeconds: 900,
    progressive: false,
  },
  pin_reset_verify: {
    maxAttempts: 5,
    windowSeconds: 900,
    progressive: true,
    lockoutSeconds: [0, 30, 60, 300],
  },
  pin_reset_complete: {
    maxAttempts: 5,
    windowSeconds: 900,
    progressive: false,
  },
  forgot_pin_phone: {
    maxAttempts: 10,
    windowSeconds: 900,
    progressive: false,
  },
  forgot_pin_answers: {
    maxAttempts: 5,
    windowSeconds: 900,
    progressive: true,
    lockoutSeconds: [0, 60, 300, 900],
  },
    transactions: {
    maxAttempts: 1000,
    windowSeconds: 60,
    progressive: false,
  },
  inventory: {
    maxAttempts: 1000,
    windowSeconds: 60,
    progressive: false,
  },
  services: {
    maxAttempts: 1000,
    windowSeconds: 60,
    progressive: false,
  },
  appointments: {
    maxAttempts: 1000,
    windowSeconds: 60,
    progressive: false,
  },
  credit: {
    maxAttempts: 1000,
    windowSeconds: 60,
    progressive: false,
  },
  beehive: {
    maxAttempts: 1000,
    windowSeconds: 60,
    progressive: false,
  },
};

