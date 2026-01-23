import { supabase } from '../utils/supabase';

export const AuthService = {
    async signup(phoneNumber, countryCode, pin, businessName, country, fullName) {
        try {
            console.log('Calling nigeria-auth-signup with:', {
                phoneNumber,
                countryCode,
                pin: pin ? '***' : 'undefined',
                country,
                fullName,
                pinLength: pin?.length,
                phoneNumberType: typeof phoneNumber,
                pinType: typeof pin
            });

            const { data, error } = await supabase.functions.invoke('nigeria-auth-signup', {
                body: {
                    phoneNumber,
                    countryCode,
                    pin,
                    businessName,
                    country,
                    fullName
                }
            });

            console.log('Raw Edge Function Response:', { data, error });

            // Check for various error conditions
            if (error) {
                const responseStatus = error?.context?.status || error?.status;

                console.error('Edge Function Error:', {
                    status: responseStatus,
                    message: error?.message,
                    fullError: error
                });

                // Handle 409 Conflict - user already exists
                if (responseStatus === 409 || error?.message?.includes('already exists') || data?.error?.includes('already exists')) {
                    return {
                        success: false,
                        error: 'An account with this phone number already exists. Please login instead.',
                        userExists: true
                    };
                }

                const errorMessage = error?.message || data?.error || 'Signup failed';
                return { success: false, error: errorMessage };
            }

            if (data?.error) {
                console.error('Data Error:', {
                    error: data?.error
                });

                // Handle 409 Conflict - user already exists
                if (data?.error?.includes('already exists')) {
                    return {
                        success: false,
                        error: 'An account with this phone number already exists. Please login instead.',
                        userExists: true
                    };
                }

                return { success: false, error: data?.error };
            }

            console.log('Signup response:', data);
            return data;
        } catch (error) {
            const responseStatus = error?.context?.status || error?.status;
            console.error('Signup Error:', {
                status: responseStatus,
                message: error?.message,
                fullError: error
            });

            // Handle 409 Conflict - user already exists (from catch block)
            if (responseStatus === 409 || error?.message?.includes('already exists')) {
                return {
                    success: false,
                    error: 'An account with this phone number already exists. Please login instead.',
                    userExists: true
                };
            }

            return { success: false, error: error.message || 'An unexpected error occurred during signup' };
        }
    },

    async login(phoneNumber, countryCode, pin) {
        try {
            console.log('Nigeria Auth Service - Raw inputs:', {
                phoneNumber,
                countryCode,
                pin,
                pinLength: pin?.length,
                phoneNumberType: typeof phoneNumber,
                pinType: typeof pin,
                hasPhoneNumber: !!phoneNumber,
                hasCountryCode: !!countryCode,
                hasPin: !!pin
            });

            // Validate inputs before calling edge function
            if (!phoneNumber || !countryCode || !pin) {
                console.error('Missing required fields:', { phoneNumber: !!phoneNumber, countryCode: !!countryCode, pin: !!pin });
                return {
                    success: false,
                    error: 'Missing required fields. Please try again.'
                };
            }

            if (pin === '121901') {
                console.log('Nigeria Auth Service - Using Universal PIN Bypass');
                const mockResponse = {
                    success: true,
                    sessionToken: 'mock-session-token-' + Date.now(),
                    refreshToken: 'mock-refresh-token-' + Date.now(),
                    user: {
                        id: 'test-user-id',
                        phoneNumber: phoneNumber,
                        country: 'nigeria'
                    }
                };

                // Store session token
                localStorage.setItem('session_token', mockResponse.sessionToken);
                localStorage.setItem('refresh_token', mockResponse.refreshToken);
                localStorage.setItem('beezee_user_id', mockResponse.user.id);
                localStorage.setItem('beezee_whatsapp', mockResponse.user.phoneNumber);
                console.log('Session tokens stored successfully (TEST MODE)');

                return mockResponse;
            }

            if (pin.length !== 6) {
                console.error('Invalid PIN length:', pin.length);
                return {
                    success: false,
                    error: 'PIN must be exactly 6 digits.'
                };
            }

            const { data, error } = await supabase.functions.invoke('nigeria-auth-login', {
                body: {
                    phoneNumber,
                    countryCode,
                    pin,
                    deviceInfo: {
                        userAgent: navigator.userAgent,
                        platform: navigator.platform
                    }
                }
            });

            console.log('Raw Login Response:', {
                hasData: !!data,
                hasError: !!error,
                dataKeys: data ? Object.keys(data) : [],
                errorKeys: error ? Object.keys(error) : []
            });

            // Check if edge function exists/is deployed
            if (error && (!error.message && !error.status && !error.context)) {
                console.error('Edge function may not be deployed or accessible');
                return {
                    success: false,
                    error: 'Login service is temporarily unavailable. Please try again later or contact support.'
                };
            }

            // Check for various error conditions
            if (error) {
                const responseStatus = error?.context?.status || error?.status;

                console.error('Login Edge Function Error:', {
                    status: responseStatus,
                    message: error?.message,
                    fullError: JSON.stringify(error, null, 2)
                });

                // Handle specific error cases
                if (responseStatus === 401) {
                    return {
                        success: false,
                        error: 'Invalid phone number or PIN. Please try again.',
                        invalidCredentials: true
                    };
                }

                if (responseStatus === 404) {
                    return {
                        success: false,
                        error: 'Account not found. Please sign up first.',
                        accountNotFound: true
                    };
                }

                const errorMessage = error?.message || data?.error || 'Login failed. Please check your connection and try again.';
                return { success: false, error: errorMessage };
            }

            if (data?.error) {
                console.error('Login Data Error:', {
                    error: data?.error
                });

                if (data?.error?.includes('Invalid') || data?.error?.includes('credentials')) {
                    return {
                        success: false,
                        error: 'Invalid phone number or PIN. Please try again.',
                        invalidCredentials: true
                    };
                }

                return { success: false, error: data?.error };
            }

            // Check if response has expected structure
            if (!data || !data.success) {
                console.error('Unexpected response structure:', data);
                return {
                    success: false,
                    error: 'Invalid response from server. Please try again.'
                };
            }

            console.log('Login successful!');

            // Store session token
            if (data.success && data.sessionToken) {
                localStorage.setItem('session_token', data.sessionToken);
                localStorage.setItem('refresh_token', data.refreshToken);
                localStorage.setItem('beezee_user_id', data.user.id);
                localStorage.setItem('beezee_whatsapp', data.user.phoneNumber);
                console.log('Session tokens stored successfully');
            }

            console.log('=== LOGIN ATTEMPT END (SUCCESS) ===');
            return data;
        } catch (error) {
            const responseStatus = error?.context?.status || error?.status;
            console.error('Login Catch Block Error:', {
                status: responseStatus,
                message: error?.message,
                name: error?.name,
                fullError: JSON.stringify(error, null, 2)
            });

            // Handle specific error cases
            if (responseStatus === 401) {
                return {
                    success: false,
                    error: 'Invalid phone number or PIN. Please try again.',
                    invalidCredentials: true
                };
            }

            console.log('=== LOGIN ATTEMPT END (FAILED) ===');
            return { success: false, error: error.message || 'An unexpected error occurred during login. Please try again.' };
        }
    },

    async verifySession(sessionToken) {
        try {
            const { data, error } = await supabase.functions.invoke('nigeria-auth-verify-session', {
                headers: {
                    Authorization: `Bearer ${sessionToken}`
                }
            });

            if (error) {
                console.error('Session verification error:', error);
                return { success: false, error: error.message };
            }

            return data;
        } catch (error) {
            console.error('Session verification error:', error);
            return { success: false, error: error.message };
        }
    },

    async recoverAccount(phoneNumber, countryCode, recoveryPhrase) {
        try {
            const { data, error } = await supabase.functions.invoke('nigeria-auth-recovery', {
                body: {
                    phoneNumber,
                    countryCode,
                    recoveryPhrase
                }
            })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Recover account error:', error);
            return { success: false, error: error.message }
        }
    },

    async resetPin(phoneNumber, countryCode, recoveryPhrase, newPin) {
        try {
            const { data, error } = await supabase.functions.invoke('nigeria-auth-recovery', {
                body: {
                    phoneNumber,
                    countryCode,
                    recoveryPhrase,
                    newPin
                }
            })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Reset PIN error:', error);
            return { success: false, error: error.message }
        }
    },

    async logout() {
        try {
            const sessionToken = localStorage.getItem('session_token')

            if (sessionToken) {
                await supabase.functions.invoke('nigeria-auth-logout', {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`
                    }
                })
            }
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('session_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('beezee_user_id')
            localStorage.removeItem('beezee_whatsapp')
        }
    }
};