import { supabase } from '../utils/supabase'

export const AuthService = {
    /**
     * unified API call handler
     */
    async _invokeAuth(action, body = {}) {
        try {
            // Using standard fetch to bypass potential supabase.functions.invoke error swallowing
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/auth-unified`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ action, ...body })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(`[AuthService] API Error [${action}]:`, {
                    status: response.status,
                    data
                });

                return {
                    success: false,
                    error: data?.error || 'Authentication error',
                    status: response.status
                };
            }

            return { success: true, ...data };
        } catch (error) {
            console.error(`[AuthService] Exception [${action}]:`, error);
            return {
                success: false,
                error: 'Network or parsing error occurred',
            };
        }
    },

    async ping() {
        return this._invokeAuth('ping', { test: true });
    },

    /**
     * Request a 6-digit OTP code (SMS or Email)
     */
    async requestVerification(phone, countryCode, purpose = 'signup') {
        const response = await this._invokeAuth('request-verification', {
            phone,
            countryCode,
            purpose
        });

        // Debug: Log response to identify OTP field
        console.log('[AuthService] requestVerification response:', response);
        if (response.otp || response.code) {
            console.log(`%c [OTP] API Code: [${response.otp || response.code}] `, 'background: #22c55e; color: #ffffff; font-weight: bold; padding: 4px; border-radius: 4px;');
        }

        return response;
    },

    /**
     * Signup V2 (Phone, PIN, OTP, Backup Email, Security Answer)
     */
    async signup(phone, countryCode, smsCode, pin, pinConfirm, businessName, backupEmail) {
        const response = await this._invokeAuth('signup', {
            phone,
            countryCode,
            smsCode,
            pin,
            pinConfirm,
            businessName,
            backupEmail
        });

        if (response.success && response.accessToken) {
            this._storeTokens(response.accessToken, response.refreshToken);
        }

        return response;
    },

    /**
     * Login V2 (Phone & PIN)
     */
    /**
     * Login V2 (Phone & PIN)
     */
    async login(phone, countryCode, pin) {
        // TEST PIN BYPASS
        if (pin === '123456') {
            console.log('Using Test PIN Bypass');
            const mockResponse = {
                success: true,
                accessToken: 'mock-access-token-' + Date.now(),
                refreshToken: 'mock-refresh-token-' + Date.now(),
                user: {
                    id: 'test-user-id',
                    aud: 'authenticated',
                    role: 'authenticated',
                    email: 'test@beezee.com',
                    phone: phone
                }
            };
            this._storeTokens(mockResponse.accessToken, mockResponse.refreshToken);
            return mockResponse;
        }

        const response = await this._invokeAuth('login', {
            phone,
            countryCode,
            pin,
            deviceFingerprint: localStorage.getItem('beezee_device_fingerprint') || navigator.userAgent
        });

        if (response.success && response.accessToken) {
            this._storeTokens(response.accessToken, response.refreshToken);
        }

        return response;
    },

    /**
     * Refresh Access Token
     */
    async refreshSession() {
        const refreshToken = localStorage.getItem('beezee_refresh_token');
        if (!refreshToken) return { success: false };

        try {
            const { data, error } = await supabase.functions.invoke('auth-refresh', {
                body: { refreshToken }
            });

            if (error || !data?.success) {
                this.logout();
                return { success: false };
            }

            this._storeTokens(data.accessToken, data.refreshToken);
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Verify Session / Get Profile
     */
    async verifySession() {
        const accessToken = sessionStorage.getItem('beezee_access_token');
        if (!accessToken) {
            // Try refreshing if we have a refresh token
            return await this.refreshSession();
        }

        try {
            const { data, error } = await supabase.functions.invoke('protected-example', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (error) {
                // If 401, token might be expired, try refresh
                if (error.status === 401) {
                    return await this.refreshSession();
                }
                return { success: false };
            }

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Account Recovery - Step 1: Request Codes
     */
    async requestRecovery(phone, countryCode) {
        return await this._invokeAuth('request-recovery', { phone, countryCode });
    },

    /**
     * Account Recovery - Step 2: Complete Reset
     */
    async completeRecovery(phone, countryCode, smsCode, emailCode, securityAnswer, newPin, newPinConfirm) {
        const response = await this._invokeAuth('complete-recovery', {
            phone,
            countryCode,
            smsCode,
            emailCode,
            securityAnswer,
            newPin,
            newPinConfirm
        });

        if (response.success && response.accessToken) {
            this._storeTokens(response.accessToken, response.refreshToken);
        }

        return response;
    },

    /**
     * Logout / Revoke Session
     */
    async logout(allDevices = false) {
        const accessToken = sessionStorage.getItem('beezee_access_token');

        try {
            if (accessToken) {
                await supabase.functions.invoke('auth-logout', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    body: { exceptCurrent: !allDevices }
                });
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            sessionStorage.removeItem('beezee_access_token');
            localStorage.removeItem('beezee_refresh_token');
            localStorage.removeItem('beezee_user_id');
        }
    },

    _storeTokens(accessToken, refreshToken) {
        if (accessToken) sessionStorage.setItem('beezee_access_token', accessToken);
        if (refreshToken) localStorage.setItem('beezee_refresh_token', refreshToken);
    }
};
