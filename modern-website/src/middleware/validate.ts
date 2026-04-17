import { NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

/**
 * Format Zod validation errors into a user-friendly structure
 */
export function formatValidationErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });
  
  return formatted;
}

/**
 * Handle validation errors and return a standardized error response
 */
export function handleValidationError(error: ZodError) {
  const details = formatValidationErrors(error);
  
  // Log validation failures for security monitoring
  console.warn('⚠️ Validation failed:', {
    timestamp: new Date().toISOString(),
    errorCount: error.issues.length,
    fields: Object.keys(details)
  });
  
  return NextResponse.json(
    {
      success: false,
      error: 'Invalid input data',
      details
    },
    { status: 400 }
  );
}

/**
 * Validate request body against a Zod schema
 * Returns parsed data if valid, or throws with formatted error
 */
export function validateRequestBody<T>(
  schema: ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: ZodError } {
  const result = schema.safeParse(body);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error
    };
  }
  
  return {
    success: true,
    data: result.data
  };
}

/**
 * Middleware factory for validating API requests
 * Usage in API routes:
 * 
 * const validation = validateRequest(mySchema, body);
 * if (!validation.success) {
 *   return handleValidationError(validation.error);
 * }
 * const data = validation.data;
 */
export function validateRequest<T>(
  schema: ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: ZodError } {
  return validateRequestBody(schema, body);
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 400,
  details?: Record<string, any>
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details })
    },
    { status: statusCode }
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      error: null,
      data
    },
    { status: statusCode }
  );
}

