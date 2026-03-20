// TypeScript interfaces for admin panel metrics and data

export interface CountryUserStats {
  country_code: string;
  country_name: string;
  user_count: number;
  active_users: number;
  inactive_users: number;
  percentage: number;
}

export interface IndustryUserStats {
  industry_code: string;
  industry_name: string;
  user_count: number;
  percentage: number;
}

export interface CountryRevenueStats {
  country_code: string;
  country_name: string;
  currency: string;
  revenue: number;
  revenue_usd: number;
  user_count: number;
  arpu: number;
}

export interface MRRBreakdown {
  total_mrr: number;
  new_mrr: number;
  expansion_mrr: number;
  churned_mrr: number;
  net_mrr_growth: number;
}

export interface BeehiveRequest {
  id: string;
  business_id: string;
  country: string;
  industry: string;
  title: string;
  description: string;
  category: string;
  status: string;
  upvotes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface BeehiveStats {
  total_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  total_votes: number;
  total_comments: number;
  top_categories: { category: string; count: number }[];
}

export interface CountryLTVStats {
  country_code: string;
  country_name: string;
  ltv: number;
  avg_lifespan_months: number;
  arpu: number;
}

export interface ConversionMetrics {
  trial_to_paid_rate: number;
  weekly_conversion_rate: number;
  monthly_conversion_rate: number;
  conversion_by_country: { country: string; rate: number }[];
  avg_days_to_convert: number;
}

export interface ChurnMetrics {
  weekly_churn_rate: number;
  monthly_churn_rate: number;
  quarterly_churn_rate: number;
  churn_by_country: { country: string; rate: number }[];
}

export interface DashboardMetrics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  total_revenue: number;
  mrr: number;
  arpu: number;
  ltv: number;
  trial_to_paid_conversion: number;
  weekly_churn_rate: number;
  users_by_country: CountryUserStats[];
  revenue_by_country: CountryRevenueStats[];
  top_beehive_requests: BeehiveRequest[];
  beehive_stats: BeehiveStats;
}

export interface TableStats {
  table_name: string;
  row_count: number;
  last_updated: string;
  size_bytes: number;
}

export interface UserData {
  id: string;
  email: string | null;
  phone: string | null;
  country: string;
  status: string;
  joinedAt: string;
}

export const COUNTRY_NAMES: Record<string, string> = {
  KE: 'Kenya',
  NG: 'Nigeria',
  ZA: 'South Africa',
  GH: 'Ghana',
  UG: 'Uganda',
  RW: 'Rwanda',
  TZ: 'Tanzania',
};

export const INDUSTRY_NAMES: Record<string, string> = {
  RT: 'Retail',
  SL: 'Salon',
  RP: 'Repairs',
  FD: 'Food',
  TA: 'Tailor',
  TR: 'Transport',
  FL: 'Freelance',
};

export const CURRENCY_MAP: Record<string, string> = {
  KE: 'KES',
  NG: 'NGN',
  ZA: 'ZAR',
  GH: 'GHS',
  UG: 'UGX',
  RW: 'RWF',
  TZ: 'TZS',
};
