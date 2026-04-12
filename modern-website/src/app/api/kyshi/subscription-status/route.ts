import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Missing required parameter: email'
      }, { status: 400 });
    }

    console.log(`Fetching subscription status for: ${email}`);

    // Get customer by email
    const { data: customer, error: customerError } = await supabase
      .from('kyshi_customers')
      .select('*')
      .eq('email', email)
      .single();

    if (customerError || !customer) {
      console.error('Customer not found:', customerError);
      return NextResponse.json({
        success: false,
        message: 'Customer not found'
      }, { status: 404 });
    }

    // Get active subscriptions for this customer
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('kyshi_subscriptions')
      .select(`
        *,
        kyshi_plans!kyshi_subscriptions_plan_id_fkey (
          name,
          amount,
          currency,
          country_code,
          interval
        )
      `)
      .eq('customer_id', customer.id)
      .in('status', ['active', 'pending', 'past_due'])
      .order('created_at', { ascending: false });

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
      return NextResponse.json({
        success: false,
        message: 'Database error fetching subscriptions'
      }, { status: 500 });
    }

    // Get recent transactions for this customer
    const { data: transactions, error: transactionsError } = await supabase
      .from('kyshi_transactions')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return NextResponse.json({
        success: false,
        message: 'Database error fetching transactions'
      }, { status: 500 });
    }

    // Calculate subscription summary
    const activeSubscription = subscriptions?.find(sub => sub.status === 'active');
    const pendingSubscription = subscriptions?.find(sub => sub.status === 'pending');
    const pastDueSubscription = subscriptions?.find(sub => sub.status === 'past_due');

    const currentSubscription = activeSubscription || pendingSubscription || pastDueSubscription;

    let nextBillingDate = null;
    let daysUntilBilling = null;

    if (currentSubscription && currentSubscription.current_period_end) {
      nextBillingDate = currentSubscription.current_period_end;
      const today = new Date();
      const billingDate = new Date(currentSubscription.current_period_end);
      const diffTime = billingDate.getTime() - today.getTime();
      daysUntilBilling = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Calculate transaction summary
    const totalTransactions = transactions?.length || 0;
    const successfulTransactions = transactions?.filter(t => t.status === 'success').length || 0;
    const failedTransactions = transactions?.filter(t => t.status === 'failed').length || 0;
    const refundedTransactions = transactions?.filter(t => t.status === 'refunded').length || 0;

    const response = {
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        countryCode: customer.country_code,
        createdAt: customer.created_at
      },
      subscriptions: subscriptions || [],
      currentSubscription,
      subscriptionSummary: {
        totalSubscriptions: subscriptions?.length || 0,
        activeSubscriptions: subscriptions?.filter(s => s.status === 'active').length || 0,
        pendingSubscriptions: subscriptions?.filter(s => s.status === 'pending').length || 0,
        pastDueSubscriptions: subscriptions?.filter(s => s.status === 'past_due').length || 0,
        cancelledSubscriptions: subscriptions?.filter(s => s.status === 'cancelled').length || 0,
        nextBillingDate,
        daysUntilBilling
      },
      transactions: transactions || [],
      transactionSummary: {
        totalTransactions,
        successfulTransactions,
        failedTransactions,
        refundedTransactions,
        totalAmount: transactions?.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0) || 0
      }
    };

    console.log(`Retrieved subscription status for ${email}:`, {
      subscriptions: response.subscriptionSummary.totalSubscriptions,
      transactions: response.transactionSummary.totalTransactions
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch subscription status',
      error: error
    }, { status: 500 });
  }
}
