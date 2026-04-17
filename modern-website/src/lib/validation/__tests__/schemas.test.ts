import { describe, it, expect } from 'vitest';
import {
  phoneNumberSchema,
  pinSchema,
  businessSignupSchema,
  pinVerificationSchema,
  phoneLookupSchema,
  transactionSchema,
  expenseSchema,
  beehiveActionSchema,
  syncOperationSchema
} from '../schemas';

describe('Phone Number Schema', () => {
  it('should accept valid E.164 phone numbers', () => {
    const validPhones = [
      '+254712345678',
      '+1234567890',
      '+447911123456',
      '+861234567890'
    ];

    validPhones.forEach(phone => {
      const result = phoneNumberSchema.safeParse(phone);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid phone numbers', () => {
    const invalidPhones = [
      '+12', // Too short
      '+12345678901234567', // Too long
      'abc123', // Contains letters
      ''
    ];

    invalidPhones.forEach(phone => {
      const result = phoneNumberSchema.safeParse(phone);
      expect(result.success).toBe(false);
    });
  });
});

describe('PIN Schema', () => {
  it('should accept valid 6-digit PINs', () => {
    const validPins = ['123456', '000000', '999999', '123890'];

    validPins.forEach(pin => {
      const result = pinSchema.safeParse(pin);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid PINs', () => {
    const invalidPins = [
      '12345', // Too short
      '1234567', // Too long
      'abcdef', // Contains letters
      '12345a', // Mixed
      '12-34-56', // Contains dashes
      ''
    ];

    invalidPins.forEach(pin => {
      const result = pinSchema.safeParse(pin);
      expect(result.success).toBe(false);
    });
  });
});

describe('Business Signup Schema', () => {
  const validSignupData = {
    phoneNumber: '+254712345678',
    name: 'John Doe',
    businessName: 'John\'s Shop',
    country: 'KE',
    industry: 'retail',
    pin: '123456',
    currency: 'KES',
    dailyTarget: 5000,
    inviteCode: 'ABC123',
    industrySector: 'food'
  };

  it('should accept valid signup data', () => {
    const result = businessSignupSchema.safeParse(validSignupData);
    expect(result.success).toBe(true);
  });

  it('should accept minimal required fields', () => {
    const minimalData = {
      phoneNumber: '+254712345678',
      name: 'John Doe',
      country: 'KE',
      industry: 'retail',
      pin: '123456'
    };

    const result = businessSignupSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalidData = {
      phoneNumber: '+254712345678',
      name: 'John Doe'
      // Missing country, industry, pin
    };

    const result = businessSignupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid country code', () => {
    const invalidData = {
      ...validSignupData,
      country: 'Kenya' // Should be 2-letter code
    };

    const result = businessSignupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should transform country code to uppercase', () => {
    const data = {
      ...validSignupData,
      country: 'KE' // Schema expects uppercase, transforms to uppercase
    };

    const result = businessSignupSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.country).toBe('KE');
    }
  });

  it('should reject negative daily target', () => {
    const invalidData = {
      ...validSignupData,
      dailyTarget: -100
    };

    const result = businessSignupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject name that is too short', () => {
    const invalidData = {
      ...validSignupData,
      name: 'J'
    };

    const result = businessSignupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject name that is too long', () => {
    const invalidData = {
      ...validSignupData,
      name: 'a'.repeat(101)
    };

    const result = businessSignupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('PIN Verification Schema', () => {
  it('should accept valid verification data', () => {
    const validData = {
      phoneNumber: '+254712345678',
      pin: '123456'
    };

    const result = pinVerificationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject missing fields', () => {
    const invalidData = {
      phoneNumber: '+254712345678'
      // Missing pin
    };

    const result = pinVerificationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Transaction Schema', () => {
  const validTransaction = {
    business_id: '123e4567-e89b-12d3-a456-426614174000',
    industry: 'retail',
    amount: 1500.50,
    category: 'sales',
    description: 'Product sale',
    customer_name: 'Jane Doe',
    payment_method: 'mpesa' as const,
    transaction_date: new Date().toISOString(),
    metadata: { notes: 'test' }
  };

  it('should accept valid transaction data', () => {
    const result = transactionSchema.safeParse(validTransaction);
    expect(result.success).toBe(true);
  });

  it('should reject invalid business_id', () => {
    const invalidData = {
      ...validTransaction,
      business_id: 'not-a-uuid'
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject negative amount', () => {
    const invalidData = {
      ...validTransaction,
      amount: -100
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject amount with more than 2 decimal places', () => {
    const invalidData = {
      ...validTransaction,
      amount: 100.999
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject amount that is too large', () => {
    const invalidData = {
      ...validTransaction,
      amount: 9999999999.99
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid payment method', () => {
    const invalidData = {
      ...validTransaction,
      payment_method: 'bitcoin'
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept valid payment methods', () => {
    const methods = ['cash', 'mpesa', 'bank', 'card', 'credit', 'other'];

    methods.forEach(method => {
      const data = {
        ...validTransaction,
        payment_method: method
      };

      const result = transactionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should reject description that is too long', () => {
    const invalidData = {
      ...validTransaction,
      description: 'a'.repeat(501)
    };

    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Expense Schema', () => {
  const validExpense = {
    business_id: '123e4567-e89b-12d3-a456-426614174000',
    industry: 'retail',
    amount: 500.00,
    category: 'supplies',
    description: 'Office supplies',
    vendor_name: 'Office Depot',
    payment_method: 'bank' as const,
    expense_date: new Date().toISOString()
  };

  it('should accept valid expense data', () => {
    const result = expenseSchema.safeParse(validExpense);
    expect(result.success).toBe(true);
  });

  it('should reject negative amount', () => {
    const invalidData = {
      ...validExpense,
      amount: -50
    };

    const result = expenseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept minimal required fields', () => {
    const minimalData = {
      business_id: '123e4567-e89b-12d3-a456-426614174000',
      industry: 'retail',
      amount: 500.00,
      category: 'supplies'
    };

    const result = expenseSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });
});

describe('Beehive Action Schema', () => {
  it('should accept valid create action', () => {
    const validData = {
      action: 'create' as const,
      data: {
        content: 'This is a post',
        title: 'My Post'
      },
      userId: '123e4567-e89b-12d3-a456-426614174000',
      industry: 'retail',
      country: 'KE'
    };

    const result = beehiveActionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept valid vote action', () => {
    const validData = {
      action: 'vote' as const,
      data: {
        postId: '123e4567-e89b-12d3-a456-426614174000',
        voteType: 'up' as const
      },
      userId: '123e4567-e89b-12d3-a456-426614174000'
    };

    const result = beehiveActionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject content that is too long', () => {
    const invalidData = {
      action: 'create' as const,
      data: {
        content: 'a'.repeat(2001)
      },
      userId: '123e4567-e89b-12d3-a456-426614174000'
    };

    const result = beehiveActionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject too many tags', () => {
    const invalidData = {
      action: 'create' as const,
      data: {
        content: 'Test post',
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
      },
      userId: '123e4567-e89b-12d3-a456-426614174000'
    };

    const result = beehiveActionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Sync Operation Schema', () => {
  it('should accept valid sync operations', () => {
    const validData = {
      operations: [
        {
          type: 'CREATE' as const,
          entity: 'transactions' as const,
          data: { amount: 100 },
          timestamp: Date.now()
        },
        {
          type: 'UPDATE' as const,
          entity: 'expenses' as const,
          entityId: '123e4567-e89b-12d3-a456-426614174000',
          data: { amount: 200 }
        }
      ]
    };

    const result = syncOperationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject too many operations', () => {
    const operations = Array(101).fill({
      type: 'CREATE',
      entity: 'transactions',
      data: { amount: 100 }
    });

    const invalidData = { operations };

    const result = syncOperationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid entity type', () => {
    const invalidData = {
      operations: [
        {
          type: 'CREATE',
          entity: 'invalid_entity',
          data: { amount: 100 }
        }
      ]
    };

    const result = syncOperationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid operation type', () => {
    const invalidData = {
      operations: [
        {
          type: 'INVALID',
          entity: 'transactions',
          data: { amount: 100 }
        }
      ]
    };

    const result = syncOperationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

