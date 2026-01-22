/**
 * SMS Provider Abstraction
 * 
 * Strategy pattern for swapping SMS providers per country.
 * Kenya → Africa's Talking
 * Nigeria → Termii
 * South Africa → Twilio (or WhatsApp)
 */

import type { CountryCode } from "./country-config.ts";
import { getCountryConfig } from "./country-config.ts";

export interface SMSProvider {
    send(to: string, message: string): Promise<boolean>;
}

/**
 * Africa's Talking Provider (Kenya)
 */
const AfricasTalkingProvider: SMSProvider = {
    async send(to: string, message: string) {
        const apiKey = Deno.env.get("AT_API_KEY");
        const username = Deno.env.get("AT_USERNAME");

        if (!apiKey || !username) {
            console.error('Africa\'s Talking credentials not configured');
            return false;
        }

        try {
            const isSandbox = username === "sandbox";
            const baseUrl = isSandbox
                ? "https://api.sandbox.africastalking.com/version1/messaging"
                : "https://api.africastalking.com/version1/messaging";

            const response = await fetch(baseUrl, {
                method: "POST",
                headers: {
                    "ApiKey": apiKey,
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    username,
                    to,
                    message,
                    from: isSandbox ? "sandbox" : "Beezee"
                })
            });

            const result = await response.json();
            return response.ok && result.SMSMessageData?.Recipients?.length > 0;
        } catch (error) {
            console.error('Africa\'s Talking send failed:', error);
            return false;
        }
    }
};

/**
 * Termii Provider (Nigeria)
 */
const TermiiProvider: SMSProvider = {
    async send(to: string, message: string) {
        const apiKey = Deno.env.get("TERMII_API_KEY");

        if (!apiKey) {
            console.error('Termii credentials not configured');
            return false;
        }

        try {
            const response = await fetch("https://api.ng.termii.com/api/sms/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to,
                    from: "Beezee",
                    sms: message,
                    type: "plain",
                    api_key: apiKey,
                    channel: "generic"
                })
            });

            const result = await response.json();
            return response.ok && result.message_id;
        } catch (error) {
            console.error('Termii send failed:', error);
            return false;
        }
    }
};

/**
 * Twilio Provider (South Africa)
 */
const TwilioProvider: SMSProvider = {
    async send(to: string, message: string) {
        const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
        const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
        const fromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

        if (!accountSid || !authToken || !fromNumber) {
            console.error('Twilio credentials not configured');
            return false;
        }

        try {
            const auth = btoa(`${accountSid}:${authToken}`);
            const response = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Basic ${auth}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        To: to,
                        From: fromNumber,
                        Body: message
                    })
                }
            );

            return response.ok;
        } catch (error) {
            console.error('Twilio send failed:', error);
            return false;
        }
    }
};

/**
 * WhatsApp Cloud API Provider
 */
const WhatsAppProvider: SMSProvider = {
    async send(to: string, message: string) {
        const token = Deno.env.get("WHATSAPP_TOKEN");
        const phoneId = Deno.env.get("WHATSAPP_PHONE_ID") || "989385247587073";
        const templateName = Deno.env.get("WHATSAPP_TEMPLATE_NAME") || "hello_world";

        if (!token) {
            console.error('[WhatsAppProvider] Token not configured');
            return false;
        }

        const cleanTo = to.replace('+', '');
        const codeMatch = message.match(/is: (\d+)/);
        const code = codeMatch ? codeMatch[1] : "";

        try {
            console.log(`[WhatsAppProvider] Sending to ${cleanTo} using template ${templateName}`);

            const payload: any = {
                messaging_product: "whatsapp",
                to: cleanTo,
                type: "template",
                template: {
                    name: templateName,
                    language: { code: "en_US" }
                }
            };

            // Only add components if we have a code AND it's not the hello_world template
            if (code && templateName !== 'hello_world') {
                payload.template.components = [
                    {
                        type: "body",
                        parameters: [
                            { type: "text", text: code }
                        ]
                    }
                ];
            }

            const response = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(`[WhatsAppProvider] Meta API Status: ${response.status}`);
            console.log(`[WhatsAppProvider] Meta API Response:`, JSON.stringify(result));

            if (!response.ok) {
                console.error(`[WhatsAppProvider] Meta API Error:`, result.error?.message || 'Unknown error');
                return false;
            }

            return true;
        } catch (error) {
            console.error('[WhatsAppProvider] Exception:', error);
            return false;
        }
    }
};

/**
 * Get SMS provider for country
 */
function getProvider(countryCode: CountryCode): SMSProvider {
    const config = getCountryConfig(countryCode);

    switch (config.smsProvider) {
        case 'africastalking':
            return AfricasTalkingProvider;
        case 'termii':
            return TermiiProvider;
        case 'twilio':
            return TwilioProvider;
        case 'whatsapp':
            return WhatsAppProvider;
        default:
            throw new Error(`Unknown SMS provider: ${config.smsProvider}`);
    }
}

/**
 * Send verification SMS
 * 
 * @param phone - Full phone number with country code
 * @param countryCode - Country code (KE, NG, ZA)
 * @param code - 6-digit verification code
 * @returns Success boolean
 */
export async function sendVerificationSMS(
    phone: string,
    countryCode: CountryCode,
    code: string
): Promise<boolean> {
    const provider = getProvider(countryCode);
    const message = `Your Beezee security code is: ${code}. Valid for 10 minutes. Do not share this code.`;

    console.log(`Sending SMS to ${phone} via ${countryCode} provider`);
    return await provider.send(phone, message);
}

/**
 * Twilio Verify Provider
 */
export const TwilioVerify = {
    async startVerification(to: string, channel: 'sms' | 'whatsapp' = 'whatsapp'): Promise<boolean> {
        const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
        const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
        const serviceSid = Deno.env.get("TWILIO_VERIFY_SERVICE_SID");

        if (!accountSid || !authToken || !serviceSid) {
            console.error('[TwilioVerify] Credentials not configured');
            return false;
        }

        try {
            const auth = btoa(`${accountSid}:${authToken}`);
            // Ensure E.164 format (must start with +)
            const formattedTo = to.startsWith('+') ? to : `+${to}`;

            console.log(`[TwilioVerify] Starting verification for ${formattedTo} via ${channel}`);

            const response = await fetch(
                `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Basic ${auth}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        To: formattedTo,
                        Channel: channel
                    })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                console.error('[TwilioVerify] Start failed:', JSON.stringify(result));
                return false;
            }
            return true;
        } catch (error) {
            console.error('[TwilioVerify] Start Exception:', error);
            return false;
        }
    },

    async checkVerification(to: string, code: string): Promise<boolean> {
        const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
        const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
        const serviceSid = Deno.env.get("TWILIO_VERIFY_SERVICE_SID");

        if (!accountSid || !authToken || !serviceSid) return false;

        try {
            const auth = btoa(`${accountSid}:${authToken}`);
            // Ensure E.164 format (must start with +)
            const formattedTo = to.startsWith('+') ? to : `+${to}`;

            const response = await fetch(
                `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Basic ${auth}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        To: formattedTo,
                        Code: code
                    })
                }
            );

            const result = await response.json();
            if (!response.ok) {
                console.error('[TwilioVerify] Check failed:', JSON.stringify(result));
                return false;
            }
            return result.status === 'approved';
        } catch (error) {
            console.error('[TwilioVerify] Check Exception:', error);
            return false;
        }
    }
};
