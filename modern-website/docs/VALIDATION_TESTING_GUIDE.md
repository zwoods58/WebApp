# Validation Testing Guide

This guide explains how to run and understand the validation tests for Phase 1: Input Validation & Sanitization.

## Test Structure

```
src/
├── lib/validation/__tests__/
│   ├── schemas.test.ts          # Zod schema validation tests
│   └── sanitizer.test.ts        # Sanitization utility tests
└── app/api/__tests__/
    ├── auth.test.ts              # Auth API integration tests
    └── transactions.test.ts      # Transaction/Expense API tests
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test schemas.test.ts
npm test sanitizer.test.ts
npm test auth.test.ts
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests with UI
```bash
npm run test:ui
```

## Test Categories

### 1. Schema Validation Tests (`schemas.test.ts`)

**Phone Number Validation**
- ✅ Accepts valid E.164 format (+254712345678)
- ❌ Rejects missing + prefix
- ❌ Rejects too short/long numbers
- ❌ Rejects letters and special characters

**PIN Validation**
- ✅ Accepts exactly 6 digits
- ❌ Rejects too short/long PINs
- ❌ Rejects non-numeric characters

**Business Signup Validation**
- ✅ Accepts complete valid data
- ✅ Accepts minimal required fields
- ❌ Rejects missing required fields
- ✅ Transforms country code to uppercase
- ❌ Rejects invalid country/currency codes
- ❌ Rejects negative daily targets
- ❌ Rejects names that are too short/long

**Transaction/Expense Validation**
- ✅ Accepts valid transaction data
- ❌ Rejects invalid UUIDs
- ❌ Rejects negative amounts
- ❌ Rejects amounts with >2 decimal places
- ❌ Rejects invalid payment methods
- ❌ Rejects descriptions >500 characters

**Beehive Action Validation**
- ✅ Accepts valid create/vote actions
- ❌ Rejects content >2000 characters
- ❌ Rejects >5 tags

**Sync Operation Validation**
- ✅ Accepts valid sync operations
- ❌ Rejects >100 operations per request
- ❌ Rejects invalid entity/operation types

### 2. Sanitization Tests (`sanitizer.test.ts`)

**String Sanitization**
- ✅ Trims whitespace
- ✅ Normalizes multiple spaces
- ✅ Removes null bytes
- ✅ Normalizes unicode

**HTML Sanitization**
- ✅ Strips HTML tags
- ✅ Prevents XSS attacks (15+ payloads tested)
- ✅ Escapes special characters
- ✅ Handles nested HTML

**Phone Sanitization**
- ✅ Removes dashes, spaces, parentheses
- ✅ Keeps + only at beginning

**Object Sanitization**
- ✅ Sanitizes all string values
- ✅ Handles nested objects
- ✅ Sanitizes arrays
- ✅ Respects max depth
- ✅ Sanitizes object keys

**Metadata Sanitization**
- ✅ Enforces size limits (10KB default)
- ✅ Sanitizes HTML in metadata
- ✅ Respects max depth

**Amount Sanitization**
- ✅ Converts strings to numbers
- ✅ Rounds to 2 decimal places
- ❌ Rejects negative amounts
- ❌ Rejects NaN/Infinity

**Security Tests**
- ✅ Prevents 15+ XSS attack vectors
- ✅ Escapes SQL injection attempts
- ✅ Removes null byte injections
- ✅ Sanitizes nested malicious objects

### 3. Integration Tests (`auth.test.ts`, `transactions.test.ts`)

**Auth API Tests**
- ✅ Validates signup data format
- ✅ Validates PIN verification
- ✅ Validates phone lookup
- ✅ Tests error responses (400, 409, 500)
- ✅ Tests PIN hashing
- ✅ Tests security (XSS, SQL injection)

**Transaction/Expense API Tests**
- ✅ Validates transaction data
- ✅ Validates expense data
- ✅ Tests amount validation
- ✅ Tests payment method validation
- ✅ Tests metadata size limits
- ✅ Tests XSS/SQL injection prevention

## Test Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| Validation Schemas | 95%+ |
| Sanitization Utils | 95%+ |
| API Routes | 80%+ |
| Overall | 85%+ |

## Common Test Patterns

### Testing Valid Input
```typescript
it('should accept valid data', () => {
  const result = schema.safeParse(validData);
  expect(result.success).toBe(true);
});
```

### Testing Invalid Input
```typescript
it('should reject invalid data', () => {
  const result = schema.safeParse(invalidData);
  expect(result.success).toBe(false);
});
```

### Testing Sanitization
```typescript
it('should sanitize XSS', () => {
  const malicious = '<script>alert("xss")</script>';
  const sanitized = sanitizeHtml(malicious);
  expect(sanitized).not.toContain('<script>');
});
```

### Testing Error Messages
```typescript
it('should return helpful error message', () => {
  const result = schema.safeParse(invalidData);
  if (!result.success) {
    expect(result.error.issues[0].message).toContain('must be');
  }
});
```

## Security Test Payloads

### XSS Payloads Tested
```javascript
'<script>alert("XSS")</script>'
'<img src=x onerror=alert("XSS")>'
'<svg onload=alert("XSS")>'
'<iframe src="javascript:alert(\'XSS\')">'
'<body onload=alert("XSS")>'
'<input onfocus=alert("XSS") autofocus>'
// ... and 10 more variants
```

### SQL Injection Payloads Tested
```javascript
"'; DROP TABLE users--"
"1' OR '1'='1"
"admin'--"
"' OR 1=1--"
"'; DELETE FROM users WHERE '1'='1"
```

### Null Byte Injection
```javascript
'hello\0world'
'test\0@example.com'
```

## Manual Testing Checklist

### Auth Endpoints

**POST /api/auth/signup**
- [ ] Valid signup → 200 with business data
- [ ] Invalid phone → 400 with error details
- [ ] Invalid PIN → 400 with error details
- [ ] Missing fields → 400 with error details
- [ ] Duplicate phone → 409 conflict
- [ ] XSS in name → sanitized
- [ ] SQL injection → escaped

**POST /api/auth/verify-pin**
- [ ] Valid credentials → 200 with business
- [ ] Invalid phone → 400
- [ ] Invalid PIN → 400
- [ ] Wrong PIN → 401 unauthorized
- [ ] Non-existent phone → 404

**POST /api/auth/lookup-business**
- [ ] Valid phone → 200 with business
- [ ] Invalid phone → 400
- [ ] Non-existent phone → 404

**POST /api/auth/check-phone**
- [ ] Existing phone → 200 with exists: true
- [ ] New phone → 200 with exists: false
- [ ] Invalid phone → 400

### Data Endpoints

**POST /api/transactions**
- [ ] Valid transaction → 200
- [ ] Invalid business_id → 400
- [ ] Negative amount → 400
- [ ] Invalid payment method → 400
- [ ] XSS in description → sanitized
- [ ] Large metadata → 400

**POST /api/expenses**
- [ ] Valid expense → 200
- [ ] Invalid business_id → 400
- [ ] Negative amount → 400
- [ ] XSS in vendor name → sanitized

### User Content Endpoints

**POST /api/beehive**
- [ ] Valid post → 200
- [ ] XSS in content → sanitized
- [ ] XSS in title → sanitized
- [ ] Content >2000 chars → sanitized/truncated

**POST /api/offline/sync**
- [ ] Valid operations → 200
- [ ] Invalid operations array → 400
- [ ] XSS in operation data → sanitized

## Debugging Failed Tests

### View Detailed Error Messages
```bash
npm test -- --reporter=verbose
```

### Run Single Test
```typescript
it.only('should test specific case', () => {
  // This test will run alone
});
```

### Skip Flaky Tests Temporarily
```typescript
it.skip('flaky test', () => {
  // This test will be skipped
});
```

### Add Debug Logging
```typescript
it('should debug issue', () => {
  const result = schema.safeParse(data);
  console.log('Result:', result);
  console.log('Errors:', result.success ? null : result.error.issues);
});
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: npm test

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

### Pre-commit Hook
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }
  }
}
```

## Next Steps

1. **Fix Build Errors** - Resolve unrelated import errors in test pages
2. **Run All Tests** - Execute `npm test` to verify all tests pass
3. **Check Coverage** - Aim for 85%+ overall coverage
4. **Manual Testing** - Test each endpoint with Postman/curl
5. **Deploy to Staging** - Test in staging environment
6. **Monitor Logs** - Watch for validation errors in production

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Zod Documentation](https://zod.dev/)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

## Support

For issues or questions about the tests:
1. Check test output for specific error messages
2. Review the validation schemas in `src/lib/validation/schemas.ts`
3. Review sanitization logic in `src/lib/validation/sanitizer.ts`
4. Check API route implementations for proper validation usage
