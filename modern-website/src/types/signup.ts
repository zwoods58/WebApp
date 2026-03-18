export interface SignupData {
  country: string;
  industry: string;
  industrySector: string;
  name: string;
  businessName: string;
  phoneNumber: string;
  dailyTarget: number;
  currency: string; // Country currency (KES, ZAR, NGN, etc.)
  inviteCode?: string;
  businessId?: string; // Unique business ID in format COUNTRY-INDUSTRY-7DIGIT
  pin?: string; // User's 6-digit PIN for account security
  // Performance optimization flags
  isDataSynced: boolean;
  lastSyncTime: number;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  sectors: IndustrySector[];
}

export interface IndustrySector {
  id: string;
  name: string;
  description?: string;
}

export interface DailyTargetOption {
  value: number;
  label: string;
  description: string;
}

export type SignupStep = 1 | 2 | 3 | 4 | 5 | 6;
