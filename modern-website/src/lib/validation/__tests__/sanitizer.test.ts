import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  sanitizeHtml,
  sanitizePhone,
  escapeSpecialChars,
  sanitizeObject,
  sanitizeMetadata,
  sanitizeUserContent,
  sanitizeAmount,
  isValidEmail,
  isValidUrl
} from '../sanitizer';

describe('sanitizeString', () => {
  it('should trim whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
    expect(sanitizeString('\n\thello\t\n')).toBe('hello');
  });

  it('should normalize multiple spaces', () => {
    expect(sanitizeString('hello    world')).toBe('hello world');
    expect(sanitizeString('hello\n\n\nworld')).toBe('hello world');
  });

  it('should remove null bytes', () => {
    expect(sanitizeString('hello\0world')).toBe('helloworld');
  });

  it('should normalize unicode', () => {
    const input = 'café'; // Different unicode representations
    const result = sanitizeString(input);
    expect(result).toBe('café');
  });

  it('should handle empty strings', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('should handle non-string input', () => {
    expect(sanitizeString(123 as any)).toBe('');
    expect(sanitizeString(null as any)).toBe('');
    expect(sanitizeString(undefined as any)).toBe('');
  });
});

describe('sanitizeHtml', () => {
  it('should strip HTML tags', () => {
    expect(sanitizeHtml('<p>Hello</p>')).toBe('Hello');
    expect(sanitizeHtml('<div><span>Test</span></div>')).toBe('Test');
  });

  it('should prevent XSS attacks', () => {
    const xssAttempts = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert("xss")>',
      '<a href="javascript:alert(\'xss\')">Click</a>',
      '<iframe src="evil.com"></iframe>'
    ];

    xssAttempts.forEach(xss => {
      const result = sanitizeHtml(xss);
      expect(result).not.toContain('<script');
      expect(result).not.toContain('<img');
      expect(result).not.toContain('<iframe');
      expect(result).not.toContain('javascript:');
    });
  });

  it('should escape special HTML characters', () => {
    const input = '<>&"\'';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should handle nested HTML', () => {
    const input = '<div><p><span>Nested</span></p></div>';
    const result = sanitizeHtml(input);
    expect(result).toBe('Nested');
  });

  it('should handle empty strings', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});

describe('sanitizePhone', () => {
  it('should remove non-numeric characters except +', () => {
    expect(sanitizePhone('+254-712-345-678')).toBe('+254712345678');
    expect(sanitizePhone('+254 712 345 678')).toBe('+254712345678');
    expect(sanitizePhone('(254) 712-345-678')).toBe('254712345678'); // No + in input
  });

  it('should keep + only at the beginning', () => {
    expect(sanitizePhone('254+712+345+678')).toBe('+254712345678');
  });

  it('should handle phone numbers without +', () => {
    expect(sanitizePhone('254712345678')).toBe('254712345678');
  });

  it('should handle empty strings', () => {
    expect(sanitizePhone('')).toBe('');
  });

  it('should handle non-string input', () => {
    expect(sanitizePhone(123 as any)).toBe('');
  });
});

describe('escapeSpecialChars', () => {
  it('should escape backslashes', () => {
    expect(escapeSpecialChars('hello\\world')).toBe('hello\\\\world');
  });

  it('should escape quotes', () => {
    expect(escapeSpecialChars("hello'world")).toBe("hello\\'world");
    expect(escapeSpecialChars('hello"world')).toBe('hello\\"world');
  });

  it('should escape newlines and tabs', () => {
    expect(escapeSpecialChars('hello\nworld')).toBe('hello\\nworld');
    expect(escapeSpecialChars('hello\tworld')).toBe('hello\\tworld');
    expect(escapeSpecialChars('hello\rworld')).toBe('hello\\rworld');
  });

  it('should escape null bytes', () => {
    expect(escapeSpecialChars('hello\0world')).toBe('hello\\0world');
  });

  it('should handle empty strings', () => {
    expect(escapeSpecialChars('')).toBe('');
  });
});

describe('sanitizeObject', () => {
  it('should sanitize all string values', () => {
    const input = {
      name: '  John  ',
      email: '  john@example.com  ',
      age: 30
    };

    const result = sanitizeObject(input);
    expect(result.name).toBe('John');
    expect(result.email).toBe('john@example.com');
    expect(result.age).toBe(30);
  });

  it('should sanitize nested objects', () => {
    const input = {
      user: {
        name: '  John  ',
        address: {
          street: '  Main St  '
        }
      }
    };

    const result = sanitizeObject(input);
    expect(result.user.name).toBe('John');
    expect(result.user.address.street).toBe('Main St');
  });

  it('should sanitize arrays', () => {
    const input = {
      names: ['  John  ', '  Jane  ', '  Bob  ']
    };

    const result = sanitizeObject(input);
    expect(result.names).toEqual(['John', 'Jane', 'Bob']);
  });

  it('should sanitize HTML when option is enabled', () => {
    const input = {
      content: '<script>alert("xss")</script>Hello'
    };

    const result = sanitizeObject(input, { sanitizeHtml: true });
    expect(result.content).not.toContain('<script');
  });

  it('should respect max depth', () => {
    const deepObject = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: '  test  '
            }
          }
        }
      }
    };

    const result = sanitizeObject(deepObject, { maxDepth: 2 });
    // Should stop sanitizing after level 2
    expect(result.level1.level2).toBeDefined();
  });

  it('should handle null and undefined', () => {
    expect(sanitizeObject(null as any)).toBe(null);
    expect(sanitizeObject(undefined as any)).toBe(undefined);
  });

  it('should sanitize object keys', () => {
    const input: Record<string, any> = {
      '  name  ': 'John'
    };

    const result = sanitizeObject(input);
    expect(result['name']).toBe('John');
    expect(result['  name  ']).toBeUndefined();
  });
});

describe('sanitizeMetadata', () => {
  it('should sanitize valid metadata', () => {
    const input = {
      notes: '  Important note  ',
      tags: ['  tag1  ', '  tag2  ']
    };

    const result = sanitizeMetadata(input);
    expect(result.notes).toBe('Important note');
    expect(result.tags).toEqual(['tag1', 'tag2']);
  });

  it('should throw error if metadata exceeds size limit', () => {
    const largeMetadata = {
      data: 'x'.repeat(15000) // 15KB
    };

    expect(() => sanitizeMetadata(largeMetadata, { maxSizeKB: 10 }))
      .toThrow('Metadata size');
  });

  it('should sanitize HTML in metadata', () => {
    const input = {
      content: '<script>alert("xss")</script>Test'
    };

    const result = sanitizeMetadata(input);
    expect(result.content).not.toContain('<script');
  });

  it('should respect max depth', () => {
    const deepMetadata = {
      level1: {
        level2: {
          level3: {
            level4: '  test  '
          }
        }
      }
    };

    const result = sanitizeMetadata(deepMetadata, { maxDepth: 2 });
    expect(result.level1.level2).toBeDefined();
  });
});

describe('sanitizeUserContent', () => {
  it('should sanitize user-generated content', () => {
    const input = '<p>Hello <script>alert("xss")</script> World</p>';
    const result = sanitizeUserContent(input);
    
    expect(result).not.toContain('<script');
    expect(result).not.toContain('<p>');
  });

  it('should truncate content exceeding max length', () => {
    const longContent = 'a'.repeat(3000);
    const result = sanitizeUserContent(longContent, 2000);
    
    expect(result.length).toBe(2000);
  });

  it('should handle empty content', () => {
    expect(sanitizeUserContent('')).toBe('');
  });

  it('should use default max length', () => {
    const longContent = 'a'.repeat(3000);
    const result = sanitizeUserContent(longContent);
    
    expect(result.length).toBeLessThanOrEqual(2000);
  });
});

describe('sanitizeAmount', () => {
  it('should sanitize valid amounts', () => {
    expect(sanitizeAmount(100)).toBe(100);
    expect(sanitizeAmount(100.5)).toBe(100.5);
    expect(sanitizeAmount(100.99)).toBe(100.99);
  });

  it('should convert string amounts to numbers', () => {
    expect(sanitizeAmount('100')).toBe(100);
    expect(sanitizeAmount('100.50')).toBe(100.5);
  });

  it('should round to 2 decimal places', () => {
    expect(sanitizeAmount(100.999)).toBe(101);
    expect(sanitizeAmount(100.123)).toBe(100.12);
  });

  it('should throw error for negative amounts', () => {
    expect(() => sanitizeAmount(-100)).toThrow('must be positive');
  });

  it('should throw error for invalid amounts', () => {
    expect(() => sanitizeAmount('abc')).toThrow('must be a valid number');
    expect(() => sanitizeAmount(NaN)).toThrow('must be a valid number');
    expect(() => sanitizeAmount(Infinity)).toThrow('must be a valid number');
  });

  it('should handle zero', () => {
    expect(sanitizeAmount(0)).toBe(0);
  });
});

describe('isValidEmail', () => {
  it('should validate correct email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'test123@test-domain.com'
    ];

    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'test@',
      'test @example.com',
      'test@example',
      ''
    ];

    invalidEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(false);
    });
  });
});

describe('isValidUrl', () => {
  it('should validate correct URL formats', () => {
    const validUrls = [
      'https://example.com',
      'http://example.com',
      'https://www.example.com/path',
      'https://example.com:8080/path?query=value'
    ];

    validUrls.forEach(url => {
      expect(isValidUrl(url)).toBe(true);
    });
  });

  it('should reject invalid URL formats', () => {
    const invalidUrls = [
      'notaurl',
      'ftp://example.com', // Wrong protocol
      'example.com', // Missing protocol
      'javascript:alert("xss")',
      ''
    ];

    invalidUrls.forEach(url => {
      expect(isValidUrl(url)).toBe(false);
    });
  });
});

describe('XSS Prevention Tests', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert("XSS")>',
    '<iframe src="javascript:alert(\'XSS\')">',
    '<body onload=alert("XSS")>',
    '<input onfocus=alert("XSS") autofocus>',
    '<select onfocus=alert("XSS") autofocus>',
    '<textarea onfocus=alert("XSS") autofocus>',
    '<marquee onstart=alert("XSS")>',
    '<div style="background:url(javascript:alert(\'XSS\'))">',
    '"><script>alert(String.fromCharCode(88,83,83))</script>',
    '\';alert(String.fromCharCode(88,83,83))//\';',
    '<IMG SRC="javascript:alert(\'XSS\');">',
    '<IMG SRC=JaVaScRiPt:alert(\'XSS\')>',
    '<IMG SRC=`javascript:alert("XSS")`>'
  ];

  it('should prevent all common XSS attacks', () => {
    xssPayloads.forEach(payload => {
      const sanitized = sanitizeHtml(payload);
      
      // Should not contain dangerous tags or attributes
      expect(sanitized.toLowerCase()).not.toContain('<script');
      expect(sanitized.toLowerCase()).not.toContain('javascript:');
      expect(sanitized.toLowerCase()).not.toContain('onerror');
      expect(sanitized.toLowerCase()).not.toContain('onload');
      expect(sanitized.toLowerCase()).not.toContain('onfocus');
    });
  });

  it('should sanitize XSS in nested objects', () => {
    const maliciousObject = {
      name: '<script>alert("XSS")</script>John',
      bio: '<img src=x onerror=alert("XSS")>',
      nested: {
        content: '<iframe src="javascript:alert(\'XSS\')"></iframe>'
      }
    };

    const sanitized = sanitizeObject(maliciousObject, { sanitizeHtml: true });
    
    expect(sanitized.name).not.toContain('<script');
    expect(sanitized.bio).not.toContain('<img');
    expect(sanitized.nested.content).not.toContain('<iframe');
  });
});

describe('SQL Injection Prevention Tests', () => {
  const sqlInjectionPayloads = [
    "'; DROP TABLE users--",
    "1' OR '1'='1",
    "admin'--",
    "' OR 1=1--",
    "'; DELETE FROM users WHERE '1'='1",
    "' UNION SELECT * FROM users--"
  ];

  it('should escape SQL injection attempts', () => {
    sqlInjectionPayloads.forEach(payload => {
      const escaped = escapeSpecialChars(payload);
      
      // Should escape quotes
      expect(escaped).not.toBe(payload);
      expect(escaped).toContain("\\'");
    });
  });

  it('should sanitize SQL injection in objects', () => {
    const maliciousObject = {
      username: "  admin'--  ",
      password: "  ' OR '1'='1  "
    };

    const sanitized = sanitizeObject(maliciousObject);
    
    // Strings should be trimmed (but quotes remain - escaping happens at DB layer)
    expect(sanitized.username).toBe("admin'--");
    expect(sanitized.password).toBe("' OR '1'='1");
  });
});

describe('Null Byte Injection Prevention', () => {
  it('should remove null bytes from strings', () => {
    const input = 'hello\0world\0test';
    const result = sanitizeString(input);
    
    expect(result).not.toContain('\0');
    expect(result).toBe('helloworldtest');
  });

  it('should remove null bytes from objects', () => {
    const input = {
      name: 'John\0Doe',
      email: 'test\0@example.com'
    };

    const result = sanitizeObject(input);
    
    expect(result.name).not.toContain('\0');
    expect(result.email).not.toContain('\0');
  });
});

