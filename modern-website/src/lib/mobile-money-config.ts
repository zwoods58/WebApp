// Mobile Money Configuration for Different Countries
export interface MobileMoneyProvider {
  name: string;
  code: string;
  description: string;
  instructions: string;
  ussdCode: string;
  supportNumber: string;
  color: string;
}

export interface CountryMobileMoneyConfig {
  name: string;
  currency: string;
  countryCode: string;
  providers: MobileMoneyProvider[];
  weeklyAmount: number;
  planCode: string;
}

export const MOBILE_MONEY_CONFIGS: Record<string, CountryMobileMoneyConfig> = {
  KE: {
    name: 'Kenya',
    currency: 'KES',
    countryCode: 'KE',
    weeklyAmount: 200,
    planCode: 'PLN__Lt82Xz0-p5-wD6',
    providers: [
      {
        name: 'M-PESA',
        code: 'mpesa',
        description: 'Safaricom mobile money service',
        instructions: 'Dial *150# and select Pay Bill',
        ussdCode: '*150#',
        supportNumber: '100 or 0722 000 000',
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      {
        name: 'Airtel Money',
        code: 'airtel_money',
        description: 'Airtel mobile money service',
        instructions: 'Dial *220# and select Send Money',
        ussdCode: '*220#',
        supportNumber: '100 or 0733 000 100',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      {
        name: 'T-Kash',
        code: 't_kash',
        description: 'Telkom mobile money service',
        instructions: 'Dial *160# and select Send Money',
        ussdCode: '*160#',
        supportNumber: '100 or 0712 000 000',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      }
    ]
  },

  GH: {
    name: 'Ghana',
    currency: 'GHS',
    countryCode: 'GH',
    weeklyAmount: 20,
    planCode: 'PLN_X3UucIk9yPbkOZ1',
    providers: [
      {
        name: 'MTN MoMo',
        code: 'mtn_momo',
        description: 'MTN mobile money service',
        instructions: 'Dial *170# and select Send Money',
        ussdCode: '*170#',
        supportNumber: '100 or 0554 300 000',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      {
        name: 'Vodafone Cash',
        code: 'vodafone_cash',
        description: 'Vodafone mobile money service',
        instructions: 'Dial *110# and select Send Money',
        ussdCode: '*110#',
        supportNumber: '100 or 0202 000 000',
        color: 'bg-red-100 text-red-800 border-red-200'
      },
      {
        name: 'AirtelTigo Money',
        code: 'airteltigo_money',
        description: 'AirtelTigo mobile money service',
        instructions: 'Dial *110# and select Send Money',
        ussdCode: '*110#',
        supportNumber: '100 or 0500 000 000',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      }
    ]
  },

  CI: {
    name: 'Côte d\'Ivoire',
    currency: 'XOF',
    countryCode: 'CI',
    weeklyAmount: 1000,
    planCode: 'PLN_I8yasoStOrABeQc',
    providers: [
      {
        name: 'MTN MoMo',
        code: 'mtn_momo',
        description: 'MTN mobile money service',
        instructions: 'Dial *155# and select Send Money',
        ussdCode: '*155#',
        supportNumber: '100 or 20 20 20 20',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      {
        name: 'Orange Money',
        code: 'orange_money',
        description: 'Orange mobile money service',
        instructions: 'Dial #144# and select Send Money',
        ussdCode: '#144#',
        supportNumber: '100 or 20 30 30 30',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      },
      {
        name: 'Moov Money',
        code: 'moov_money',
        description: 'Moov mobile money service',
        instructions: 'Dial *155# and select Send Money',
        ussdCode: '*155#',
        supportNumber: '100 or 20 40 40 40',
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      }
    ]
  }
};

// Helper functions
export const isMobileMoneyCountry = (countryCode: string): boolean => {
  return Object.keys(MOBILE_MONEY_CONFIGS).includes(countryCode.toUpperCase());
};

export const getMobileMoneyConfig = (countryCode: string): CountryMobileMoneyConfig | null => {
  return MOBILE_MONEY_CONFIGS[countryCode.toUpperCase()] || null;
};

export const getMobileMoneyProviders = (countryCode: string): MobileMoneyProvider[] => {
  const config = getMobileMoneyConfig(countryCode);
  return config ? config.providers : [];
};

export const getDefaultProvider = (countryCode: string): MobileMoneyProvider | null => {
  const providers = getMobileMoneyProviders(countryCode);
  return providers.length > 0 ? providers[0] : null;
};

export const getProviderByCode = (countryCode: string, providerCode: string): MobileMoneyProvider | null => {
  const providers = getMobileMoneyProviders(countryCode);
  return providers.find(p => p.code === providerCode) || null;
};

export const getWeeklyAmount = (countryCode: string): number => {
  const config = getMobileMoneyConfig(countryCode);
  return config ? config.weeklyAmount : 0;
};

export const getPlanCode = (countryCode: string): string | null => {
  const config = getMobileMoneyConfig(countryCode);
  return config ? config.planCode : null;
};

// Payment method mapping for API calls
export const getPaymentMethod = (countryCode: string): string => {
  return isMobileMoneyCountry(countryCode) ? 'mobile_money' : 'card';
};

// Channel configurations for payment processing
export const getPaymentChannels = (countryCode: string): string[] => {
  if (isMobileMoneyCountry(countryCode)) {
    return ['mobile_money'];
  }
  
  // Non-mobile money countries (like Nigeria)
  switch (countryCode.toUpperCase()) {
    case 'NG':
      return ['card', 'bank_transfer', 'ussd'];
    default:
      return ['card'];
  }
};
