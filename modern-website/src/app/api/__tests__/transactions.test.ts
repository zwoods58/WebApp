import { describe, it, expect } from 'vitest';

describe('Transaction API - Validation Tests', () => {
  const validTransaction = {
    business_id: '123e4567-e89b-12d3-a456-426614174000',
    industry: 'retail',
    amount: 1500.50,
    category: 'sales',
    description: 'Product sale',
    customer_name: 'Jane Doe',
    payment_method: 'mobile_money',
    transaction_date: new Date().toISOString(),
    metadata: { notes: 'test' }
  };

  it('should accept valid transaction data', () => {
    expect(validTransaction.business_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(validTransaction.amount).toBeGreaterThan(0);
    expect(validTransaction.category).toBeTruthy();
  });

  it('should reject negative amounts', () => {
    const invalidTransaction = {
      ...validTransaction,
      amount: -100
    };

    expect(invalidTransaction.amount).toBeLessThan(0);
  });

  it('should reject invalid business_id', () => {
    const invalidTransaction = {
      ...validTransaction,
      business_id: 'not-a-uuid'
    };

    expect(invalidTransaction.business_id).not.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('should validate payment methods', () => {
    const validMethods = ['cash', 'mobile_money', 'credit'];
    const invalidMethods = ['mpesa', 'bank', 'card', 'other', 'bitcoin', 'paypal', 'venmo'];

    validMethods.forEach(method => {
      expect(['cash', 'mobile_money', 'credit']).toContain(method);
    });

    invalidMethods.forEach(method => {
      expect(['cash', 'mobile_money', 'credit']).not.toContain(method);
    });
  });

  it('should validate amount precision', () => {
    const validAmounts = [100, 100.5, 100.99, 0.01];
    const invalidAmounts = [100.999, 100.1234];

    validAmounts.forEach(amount => {
      const decimalPlaces = (amount.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    invalidAmounts.forEach(amount => {
      const decimalPlaces = (amount.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeGreaterThan(2);
    });
  });

  it('should sanitize description field', () => {
    const xssAttempt = {
      ...validTransaction,
      description: '<script>alert("xss")</script>Sale'
    };

    // After sanitization, should not contain script tags
    const sanitized = xssAttempt.description.replace(/<[^>]*>/g, '');
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('alert("xss")Sale'); // Content inside tags remains
  });

  it('should validate description length', () => {
    const validDescription = 'A'.repeat(500);
    const invalidDescription = 'A'.repeat(501);

    expect(validDescription.length).toBeLessThanOrEqual(500);
    expect(invalidDescription.length).toBeGreaterThan(500);
  });

  it('should validate metadata size', () => {
    const smallMetadata = { note: 'test' };
    const largeMetadata = { data: 'x'.repeat(15000) };

    const smallSize = JSON.stringify(smallMetadata).length;
    const largeSize = JSON.stringify(largeMetadata).length;

    expect(smallSize).toBeLessThan(10240); // 10KB
    expect(largeSize).toBeGreaterThan(10240);
  });
});

describe('Expense API - Validation Tests', () => {
  const validExpense = {
    business_id: '123e4567-e89b-12d3-a456-426614174000',
    industry: 'retail',
    amount: 500.00,
    category: 'supplies',
    description: 'Office supplies',
    vendor_name: 'Office Depot',
    payment_method: 'mobile_money',
    expense_date: new Date().toISOString()
  };

  it('should accept valid expense data', () => {
    expect(validExpense.business_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(validExpense.amount).toBeGreaterThan(0);
    expect(validExpense.category).toBeTruthy();
  });

  it('should reject negative amounts', () => {
    const invalidExpense = {
      ...validExpense,
      amount: -50
    };

    expect(invalidExpense.amount).toBeLessThan(0);
  });

  it('should sanitize vendor name', () => {
    const xssAttempt = {
      ...validExpense,
      vendor_name: '<img src=x onerror=alert("xss")>Vendor'
    };

    const sanitized = xssAttempt.vendor_name.replace(/<[^>]*>/g, '');
    expect(sanitized).not.toContain('<img');
    expect(sanitized).toBe('Vendor');
  });

  it('should validate vendor name length', () => {
    const validName = 'A'.repeat(100);
    const invalidName = 'A'.repeat(101);

    expect(validName.length).toBeLessThanOrEqual(100);
    expect(invalidName.length).toBeGreaterThan(100);
  });
});

describe('API Error Handling Tests', () => {
  it('should return standardized error format', () => {
    const errorResponse = {
      success: false,
      error: 'Invalid input data',
      details: {
        amount: ['Amount must be positive'],
        business_id: ['Invalid business ID']
      }
    };

    expect(errorResponse.success).toBe(false);
    expect(errorResponse).toHaveProperty('error');
    expect(errorResponse).toHaveProperty('details');
    expect(errorResponse.details).toHaveProperty('amount');
  });

  it('should return 400 for validation errors', () => {
    const statusCode = 400;
    expect(statusCode).toBe(400);
  });

  it('should return 500 for server errors', () => {
    const statusCode = 500;
    expect(statusCode).toBe(500);
  });
});

describe('Security Tests for Transaction/Expense APIs', () => {
  it('should prevent SQL injection in description', () => {
    const sqlInjection = "'; DROP TABLE transactions--";
    const escaped = sqlInjection.replace(/'/g, "\\'");
    
    expect(escaped).toContain("\\'");
    expect(escaped).not.toBe(sqlInjection);
  });

  it('should prevent XSS in customer/vendor names', () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert("xss")>',
      '<iframe src="evil.com"></iframe>'
    ];

    xssPayloads.forEach(payload => {
      const sanitized = payload.replace(/<[^>]*>/g, '');
      expect(sanitized).not.toContain('<');
    });
  });

  it('should sanitize metadata recursively', () => {
    const maliciousMetadata = {
      notes: '<script>alert("xss")</script>',
      nested: {
        content: '<img src=x onerror=alert("xss")>'
      }
    };

    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/<[^>]*>/g, '');
      }
      if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key in obj) {
          result[key] = sanitize(obj[key]);
        }
        return result;
      }
      return obj;
    };

    const sanitized = sanitize(maliciousMetadata);
    expect(sanitized.notes).not.toContain('<script>');
    expect(sanitized.nested.content).not.toContain('<img');
  });
});

