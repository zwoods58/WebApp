/**
 * Country Configuration
 */

export type SMSProviderType = 'africastalking' | 'termii' | 'twilio' | 'whatsapp' | 'twilio-verify';

export const COUNTRY_CONFIG = {
    KE: {
        name: 'Kenya',
        smsProvider: 'twilio-verify' as SMSProviderType,
        phoneRegex: /^254\d{9}$/,
        phoneFormat: '254XXXXXXXXX',
        phoneExample: '254712345678',
        currency: 'KES',
        currencySymbol: 'KSh',
        taxIdLabel: 'KRA PIN',
        taxIdRegex: /^[A-Z]\d{9}[A-Z]$/,
        smsFrom: 'Beezee'
    },
    NG: {
        name: 'Nigeria',
        smsProvider: 'termii' as SMSProviderType,
        phoneRegex: /^234\d{10}$/,
        phoneFormat: '234XXXXXXXXXX',
        phoneExample: '2348012345678',
        currency: 'NGN',
        currencySymbol: 'N',
        taxIdLabel: 'TIN',
        taxIdRegex: /^\d{10}$/,
        smsFrom: 'Beezee'
    },
    ZA: {
        name: 'South Africa',
        smsProvider: 'twilio-verify' as SMSProviderType,
        phoneRegex: /^27\d{9}$/,
        phoneFormat: '27XXXXXXXXX',
        phoneExample: '27821234567',
        currency: 'ZAR',
        currencySymbol: 'R',
        taxIdLabel: 'Tax Reference Number',
        taxIdRegex: /^\d{10}$/,
        smsFrom: 'Beezee'
    },
    CI: {
        name: "Cote d'Ivoire",
        smsProvider: null as unknown as SMSProviderType,
        phoneRegex: /^\+225[0-9]{8,10}$/,
        phoneFormat: '+225XXXXXXXX',
        phoneExample: '+2250709123456',
        currency: 'XOF',
        currencySymbol: 'CFA',
        taxIdLabel: 'IDU',
        taxIdRegex: /^[A-Z0-9]{10,15}$/,
        smsFrom: 'Beezee'
    }
} as const;

export type CountryCode = keyof typeof COUNTRY_CONFIG;

/**
 * Validate phone number for specific country
 */
export function validatePhone(phone: string, countryCode: CountryCode): boolean {
    const config = COUNTRY_CONFIG[countryCode];
    return config.phoneRegex.test(phone);
}

/**
 * Get country config by code
 */
export function getCountryConfig(countryCode: CountryCode) {
    return COUNTRY_CONFIG[countryCode];
}
