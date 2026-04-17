import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import {
  isOriginAllowed,
  addCorsHeaders,
  handlePreflight,
  withCors
} from '../cors';

describe('CORS Middleware', () => {
  describe('isOriginAllowed', () => {
    it('should allow localhost origins in development', () => {
      const origins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000'
      ];

      origins.forEach(origin => {
        expect(isOriginAllowed(origin)).toBe(true);
      });
    });

    it('should reject null or undefined origins', () => {
      expect(isOriginAllowed(null)).toBe(false);
      expect(isOriginAllowed('')).toBe(false);
    });

    it('should reject unauthorized origins', () => {
      const unauthorizedOrigins = [
        'http://evil.com',
        'https://malicious-site.com',
        'http://phishing.com'
      ];

      unauthorizedOrigins.forEach(origin => {
        expect(isOriginAllowed(origin)).toBe(false);
      });
    });

    it('should allow production URL from environment', () => {
      // Production URL should be allowed
      const productionUrl = process.env.NEXT_PUBLIC_SITE_URL;
      if (productionUrl) {
        expect(isOriginAllowed(productionUrl)).toBe(true);
      }
    });
  });

  describe('addCorsHeaders', () => {
    it('should add CORS headers for allowed origin', () => {
      const response = new NextResponse();
      const origin = 'http://localhost:3000';

      const result = addCorsHeaders(response, origin);

      expect(result.headers.get('Access-Control-Allow-Origin')).toBe(origin);
      expect(result.headers.get('Access-Control-Allow-Credentials')).toBe('true');
      expect(result.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(result.headers.get('Access-Control-Allow-Headers')).toContain('Authorization');
      expect(result.headers.get('Access-Control-Max-Age')).toBe('86400');
    });

    it('should not set origin header for unauthorized origin', () => {
      const response = new NextResponse();
      const origin = 'http://evil.com';

      const result = addCorsHeaders(response, origin);

      expect(result.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });

    it('should handle null origin', () => {
      const response = new NextResponse();

      const result = addCorsHeaders(response, null);

      expect(result.headers.get('Access-Control-Allow-Origin')).toBeNull();
      expect(result.headers.get('Access-Control-Allow-Methods')).toBeTruthy();
    });
  });

  describe('handlePreflight', () => {
    it('should return 204 status for OPTIONS request', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      const response = handlePreflight(request);

      expect(response.status).toBe(204);
      expect(response.headers.get('Content-Length')).toBe('0');
    });

    it('should include CORS headers in preflight response', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });

      const response = handlePreflight(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBeTruthy();
      expect(response.headers.get('Access-Control-Max-Age')).toBe('86400');
    });
  });

  describe('withCors wrapper', () => {
    it('should handle OPTIONS request automatically', async () => {
      const handler = async (req: NextRequest) => {
        return NextResponse.json({ message: 'test' });
      };

      const wrappedHandler = withCors(handler);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });

      const response = await wrappedHandler(request);

      expect(response.status).toBe(204);
    });

    it('should add CORS headers to regular requests', async () => {
      const handler = async (req: NextRequest) => {
        return NextResponse.json({ message: 'test' });
      };

      const wrappedHandler = withCors(handler);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          'Origin': 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      });

      const response = await wrappedHandler(request);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
      expect(response.headers.get('Access-Control-Allow-Credentials')).toBe('true');
    });

    it('should execute handler for non-OPTIONS requests', async () => {
      let handlerCalled = false;
      const handler = async (req: NextRequest) => {
        handlerCalled = true;
        return NextResponse.json({ message: 'success' });
      };

      const wrappedHandler = withCors(handler);

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          'Origin': 'http://localhost:3000'
        }
      });

      await wrappedHandler(request);

      expect(handlerCalled).toBe(true);
    });
  });

  describe('Allowed Methods', () => {
    it('should allow all standard HTTP methods', () => {
      const response = new NextResponse();
      const result = addCorsHeaders(response, 'http://localhost:3000');

      const allowedMethods = result.headers.get('Access-Control-Allow-Methods');
      
      expect(allowedMethods).toContain('GET');
      expect(allowedMethods).toContain('POST');
      expect(allowedMethods).toContain('PUT');
      expect(allowedMethods).toContain('PATCH');
      expect(allowedMethods).toContain('DELETE');
      expect(allowedMethods).toContain('OPTIONS');
    });
  });

  describe('Allowed Headers', () => {
    it('should allow necessary headers', () => {
      const response = new NextResponse();
      const result = addCorsHeaders(response, 'http://localhost:3000');

      const allowedHeaders = result.headers.get('Access-Control-Allow-Headers');
      
      expect(allowedHeaders).toContain('Authorization');
      expect(allowedHeaders).toContain('Content-Type');
      expect(allowedHeaders).toContain('X-CSRF-Token');
      expect(allowedHeaders).toContain('X-Requested-With');
    });
  });

  describe('Security Tests', () => {
    it('should not allow credentials without proper origin', () => {
      const response = new NextResponse();
      const result = addCorsHeaders(response, 'http://evil.com');

      // Should not set origin, therefore credentials won't work
      expect(result.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });

    it('should cache preflight for 24 hours', () => {
      const response = new NextResponse();
      const result = addCorsHeaders(response, 'http://localhost:3000');

      expect(result.headers.get('Access-Control-Max-Age')).toBe('86400');
    });
  });
});

describe('CORS Integration Tests', () => {
  it('should handle complete CORS flow', async () => {
    // 1. Preflight request
    const preflightRequest = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });

    const preflightResponse = handlePreflight(preflightRequest);
    expect(preflightResponse.status).toBe(204);
    expect(preflightResponse.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');

    // 2. Actual request
    const handler = async (req: NextRequest) => {
      return NextResponse.json({ success: true });
    };

    const wrappedHandler = withCors(handler);

    const actualRequest = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber: '+254712345678' })
    });

    const actualResponse = await wrappedHandler(actualRequest);
    expect(actualResponse.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });
});

