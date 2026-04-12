#!/usr/bin/env ts-node

/**
 * Currency Diagnostic Script
 * Tests different parameter variations for NGN, GHS, XOF to identify why they're failing
 */

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_API_URL = 'https://api.kyshi.co/v1';

interface TestVariation {
  name: string;
  body: any;
}

interface TestResult {
  country: string;
  currency: string;
  variation: string;
  success: boolean;
  statusCode: number;
  response: any;
  planCode?: string;
}

const CURRENCY_TESTS = [
  {
    country: 'Nigeria',
    code: 'NG',
    currency: 'NGN',
    variations: [
      {
        name: 'Standard (major units)',
        body: {
          name: 'Beezee Weekly Nigeria',
          description: 'Weekly subscription for Beezee - Nigeria',
          interval: 'weekly',
          amount: 500,
          localCurrency: 'NGN'
        }
      },
      {
        name: 'Minor units (kobo)',
        body: {
          name: 'Beezee Weekly Nigeria',
          description: 'Weekly subscription for Beezee - Nigeria',
          interval: 'weekly',
          amount: 50000, // 500 NGN = 50000 kobo
          localCurrency: 'NGN'
        }
      },
      {
        name: 'With all optional fields',
        body: {
          name: 'Beezee Weekly Nigeria',
          description: 'Weekly subscription for Beezee - Nigeria',
          interval: 'weekly',
          amount: 500,
          localCurrency: 'NGN',
          sendInvoices: false,
          sendSms: false,
          hostedPage: false
        }
      },
      {
        name: 'Lower amount (100 NGN)',
        body: {
          name: 'Beezee Weekly Nigeria',
          description: 'Weekly subscription for Beezee - Nigeria',
          interval: 'weekly',
          amount: 100,
          localCurrency: 'NGN'
        }
      }
    ]
  },
  {
    country: 'Ghana',
    code: 'GH',
    currency: 'GHS',
    variations: [
      {
        name: 'Standard (major units)',
        body: {
          name: 'Beezee Weekly Ghana',
          description: 'Weekly subscription for Beezee - Ghana',
          interval: 'weekly',
          amount: 20,
          localCurrency: 'GHS'
        }
      },
      {
        name: 'Minor units (pesewas)',
        body: {
          name: 'Beezee Weekly Ghana',
          description: 'Weekly subscription for Beezee - Ghana',
          interval: 'weekly',
          amount: 2000, // 20 GHS = 2000 pesewas
          localCurrency: 'GHS'
        }
      },
      {
        name: 'With all optional fields',
        body: {
          name: 'Beezee Weekly Ghana',
          description: 'Weekly subscription for Beezee - Ghana',
          interval: 'weekly',
          amount: 20,
          localCurrency: 'GHS',
          sendInvoices: false,
          sendSms: false,
          hostedPage: false
        }
      },
      {
        name: 'Minimum amount (1 GHS)',
        body: {
          name: 'Beezee Weekly Ghana',
          description: 'Weekly subscription for Beezee - Ghana',
          interval: 'weekly',
          amount: 1,
          localCurrency: 'GHS'
        }
      }
    ]
  },
  {
    country: 'Côte d\'Ivoire',
    code: 'CI',
    currency: 'XOF',
    variations: [
      {
        name: 'Standard (whole units)',
        body: {
          name: 'Beezee Weekly Côte d\'Ivoire',
          description: 'Weekly subscription for Beezee - Côte d\'Ivoire',
          interval: 'weekly',
          amount: 1000,
          localCurrency: 'XOF'
        }
      },
      {
        name: 'Lower amount (500 XOF)',
        body: {
          name: 'Beezee Weekly Côte d\'Ivoire',
          description: 'Weekly subscription for Beezee - Côte d\'Ivoire',
          interval: 'weekly',
          amount: 500,
          localCurrency: 'XOF'
        }
      },
      {
        name: 'With all optional fields',
        body: {
          name: 'Beezee Weekly Côte d\'Ivoire',
          description: 'Weekly subscription for Beezee - Côte d\'Ivoire',
          interval: 'weekly',
          amount: 1000,
          localCurrency: 'XOF',
          sendInvoices: false,
          sendSms: false,
          hostedPage: false
        }
      },
      {
        name: 'Minimum amount (100 XOF)',
        body: {
          name: 'Beezee Weekly Côte d\'Ivoire',
          description: 'Weekly subscription for Beezee - Côte d\'Ivoire',
          interval: 'weekly',
          amount: 100,
          localCurrency: 'XOF'
        }
      }
    ]
  }
];

async function testVariation(
  country: string,
  currency: string,
  variation: TestVariation
): Promise<TestResult> {
  try {
    console.log(`   Testing: ${variation.name}...`);
    
    const response = await fetch(`${KYSHI_API_URL}/plans`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variation.body),
    });

    const data = await response.json();
    const success = response.ok && response.status >= 200 && response.status < 300;

    if (success) {
      console.log(`   ✅ SUCCESS! Plan code: ${data.data?.code}`);
    } else {
      console.log(`   ❌ Failed (${response.status}): ${data.message || 'Unknown error'}`);
    }

    return {
      country,
      currency,
      variation: variation.name,
      success,
      statusCode: response.status,
      response: data,
      planCode: data.data?.code
    };
  } catch (error) {
    console.log(`   🔥 Exception: ${error}`);
    return {
      country,
      currency,
      variation: variation.name,
      success: false,
      statusCode: 0,
      response: { error: String(error) }
    };
  }
}

async function runDiagnostics() {
  console.log('🔍 Kyshi Currency Diagnostics');
  console.log('Testing NGN, GHS, XOF with different parameter variations\n');
  console.log('═'.repeat(70));

  const allResults: TestResult[] = [];

  for (const test of CURRENCY_TESTS) {
    console.log(`\n🌍 ${test.country} (${test.currency})`);
    console.log('─'.repeat(70));

    for (const variation of test.variations) {
      const result = await testVariation(test.country, test.currency, variation);
      allResults.push(result);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('\n📊 DIAGNOSTIC SUMMARY\n');

  const successfulTests = allResults.filter(r => r.success);
  const failedTests = allResults.filter(r => !r.success);

  console.log(`✅ Successful variations: ${successfulTests.length}`);
  console.log(`❌ Failed variations: ${failedTests.length}\n`);

  if (successfulTests.length > 0) {
    console.log('✅ WORKING VARIATIONS:\n');
    successfulTests.forEach(r => {
      console.log(`   ${r.country} (${r.currency}) - ${r.variation}`);
      console.log(`   Plan Code: ${r.planCode}`);
      console.log('');
    });
  }

  if (failedTests.length > 0) {
    console.log('❌ FAILED VARIATIONS:\n');
    
    // Group by country
    const byCountry = failedTests.reduce((acc, r) => {
      if (!acc[r.country]) acc[r.country] = [];
      acc[r.country].push(r);
      return acc;
    }, {} as Record<string, TestResult[]>);

    Object.entries(byCountry).forEach(([country, results]) => {
      console.log(`   ${country}:`);
      results.forEach(r => {
        console.log(`      - ${r.variation}: ${r.statusCode} - ${r.response.message || 'Unknown'}`);
      });
      console.log('');
    });
  }

  // Recommendations
  console.log('═'.repeat(70));
  console.log('\n💡 RECOMMENDATIONS\n');

  if (successfulTests.length === 0) {
    console.log('⚠️  No variations worked for any currency.');
    console.log('   This suggests:');
    console.log('   1. Your test account may be limited to KES only');
    console.log('   2. These currencies need manual activation by Kyshi');
    console.log('   3. There may be account-level restrictions\n');
    console.log('📧 ACTION: Contact Kyshi support with the following:\n');
    console.log('   Subject: Unable to create plans for NGN, GHS, XOF');
    console.log('   Body: Include the error details above');
    console.log('   Email: support@kyshi.co\n');
  } else {
    console.log('✅ Some variations worked!');
    console.log('   Use the successful variations to create your plans.');
    console.log('   The working plan codes are listed above.\n');
  }

  // Generate curl commands for manual testing
  console.log('═'.repeat(70));
  console.log('\n🔧 MANUAL CURL TESTS (for verification)\n');
  
  CURRENCY_TESTS.forEach(test => {
    const firstVariation = test.variations[0];
    console.log(`# ${test.country} (${test.currency})`);
    console.log(`curl -X POST ${KYSHI_API_URL}/plans \\`);
    console.log(`  -H "x-api-key: ${KYSHI_SECRET_KEY}" \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '${JSON.stringify(firstVariation.body, null, 2).replace(/\n/g, '\n  ')}'`);
    console.log('');
  });

  console.log('═'.repeat(70));
}

// Validate environment
if (!KYSHI_SECRET_KEY) {
  console.error('❌ KYSHI_SECRET_KEY not found in environment');
  process.exit(1);
}

runDiagnostics().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
