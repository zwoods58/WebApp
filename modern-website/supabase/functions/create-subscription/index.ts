/// <reference path="./deno-types.d.ts" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

// Country configuration types
type MobileMoneyConfig = {
  currency: string;
  amount: number;
  method: string;
  channels: string[];
};

type BankTransferConfig = {
  currency: string;
  amount: number;
  method: string;
  chargeType: string;
};

type CountryConfig = MobileMoneyConfig | BankTransferConfig;

// Country configuration
const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  KE: { currency: 'KES', amount: 200, method: 'initialize', channels: ['mobileMoney'] },
  GH: { currency: 'GHS', amount: 20, method: 'initialize', channels: ['mobileMoney'] },
  CI: { currency: 'XOF', amount: 1000, method: 'initialize', channels: ['mobileMoney'] },
  NG: { currency: 'NGN', amount: 500, method: 'charge', chargeType: 'BANK_TRANSFER' }
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { 
      user_id, 
      user_email, 
      user_phone,
      user_name,
      country,
      business_id,
      industry
    } = requestBody;

    // Validation
    if (!user_id || !user_email || !country || !user_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = COUNTRY_CONFIG[country as keyof typeof COUNTRY_CONFIG];
    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Unsupported country' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const KYSHI_SECRET_KEY = Deno.env.get('KYSHI_SECRET_KEY');
    const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL');

    // Generate reference
    const reference = `SUB-${country}-${user_id.slice(-8)}-${Date.now()}`;

    console.log(`🔄 Creating subscription for ${user_email} in ${country}`);

    if (country === 'NG') {
      // Nigeria: Bank Transfer
      const bankTransferBody = {
        email: user_email,
        amount: config.amount,
        localCurrency: config.currency,
        reference: reference,
        chargeType: 'chargeType' in config ? config.chargeType : 'BANK_TRANSFER',
        expiresAt: new Date(Date.now() + 4 * 60 * 1000).toISOString() // 4 hours from now
      };

      const headers: Record<string, string> = {
        'x-api-key': KYSHI_SECRET_KEY || '',
        'Content-Type': 'application/json'
      };

      interface KyshiResponse {
      success: boolean;
      message?: string;
      accountNumber?: string;
      accountName?: string;
      bankName?: string;
      amount?: number;
      reference?: string;
      subscriptionId?: string;
      authorizationUrl?: string;
      checkoutUrl?: string;
    }

    const response = await fetch(`https://api.kyshi.co/v1/transactions/charge`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bankTransferBody)
      });

      const data: KyshiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize bank transfer');
      }

      // Insert subscription record
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id,
          user_email,
          user_phone,
          user_name,
          country,
          amount: config.amount,
          currency: config.currency,
          payment_method: 'bank_transfer',
          status: 'pending',
          kyshi_reference: reference,
          bank_account_number: data.accountNumber || '',
          bank_account_name: data.accountName || '',
          bank_name: data.bankName || '',
          bank_account_expires_at: new Date(Date.now() + 4 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error('Failed to create subscription record');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          accountNumber: data.accountNumber,
          accountName: data.accountName,
          bankName: data.bankName,
          amount: config.amount,
          reference: reference,
          subscriptionId: data.subscriptionId
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else {
      // Kenya, Ghana, Côte d'Ivoire: Mobile Money
      const mobileMoneyBody = {
        email: user_email,
        amount: config.amount,
        localCurrency: config.currency,
        reference: reference,
        channels: 'channels' in config ? config.channels : [],
        redirectUrl: `${APP_URL}/subscription/callback?reference=${reference}`
      };

      // Add phone if provided
      if (user_phone) {
        (mobileMoneyBody as any).phoneNumber = user_phone;
      }

      const headers: Record<string, string> = {
        'x-api-key': KYSHI_SECRET_KEY || '',
        'Content-Type': 'application/json'
      };

      const response = await fetch(`https://api.kyshi.co/v1/transactions/initialize`, {
        method: 'POST',
        headers,
        body: JSON.stringify(mobileMoneyBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize mobile money transaction');
      }

      // Insert subscription record
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id,
          user_email,
          user_phone,
          user_name,
          country,
          amount: config.amount,
          currency: config.currency,
          payment_method: 'mobile_money',
          status: 'pending',
          kyshi_reference: reference,
          kyshi_checkout_url: data.authorizationUrl || data.checkoutUrl,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error('Failed to create subscription record');
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          authorizationUrl: (data.authorizationUrl || data.checkoutUrl) || '',
          reference: reference,
          subscriptionId: data.subscriptionId || ''
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('❌ Create subscription error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
