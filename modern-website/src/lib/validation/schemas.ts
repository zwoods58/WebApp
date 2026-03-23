import { z } from 'zod';

/**
 * Phone number validation schema
 * Accepts E.164 format: +[country code][number]
 * Example: +254712345678
 */
export const phoneNumberSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must not exceed 15 digits')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format. Use format: +254712345678');

/**
 * PIN validation schema
 * Must be exactly 6 digits
 */
export const pinSchema = z.string()
  .length(6, 'PIN must be exactly 6 digits')
  .regex(/^\d{6}$/, 'PIN must contain only digits');

/**
 * Business signup validation schema
 */
export const businessSignupSchema = z.object({
  phoneNumber: phoneNumberSchema,
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must not exceed 100 characters')
    .trim()
    .optional(),
  country: z.string()
    .length(2, 'Country code must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Country code must be uppercase letters')
    .transform(val => val.toUpperCase()),
  industry: z.string()
    .min(2, 'Industry must be at least 2 characters')
    .max(50, 'Industry must not exceed 50 characters'),
  pin: pinSchema,
  currency: z.string()
    .length(3, 'Currency code must be 3 characters')
    .regex(/^[A-Z]{3}$/, 'Currency code must be uppercase letters')
    .optional(),
  dailyTarget: z.number()
    .min(0, 'Daily target must be positive')
    .max(999999999.99, 'Daily target is too large')
    .optional(),
  inviteCode: z.string()
    .max(20, 'Invite code must not exceed 20 characters')
    .optional(),
  industrySector: z.string()
    .max(50, 'Industry sector must not exceed 50 characters')
    .optional(),
  securityQuestions: z.object({
    questionId: z.string().uuid(),
    answer: z.string().min(1).max(100)
  }).optional()
});

/**
 * PIN verification schema
 */
export const pinVerificationSchema = z.object({
  phoneNumber: phoneNumberSchema,
  pin: pinSchema
});

/**
 * Phone lookup schema
 */
export const phoneLookupSchema = z.object({
  phoneNumber: phoneNumberSchema
});

/**
 * Transaction validation schema
 */
export const transactionSchema = z.object({
  business_id: z.string().uuid('Invalid business ID'),
  industry: z.string().min(2).max(50),
  amount: z.number()
    .positive('Amount must be positive')
    .max(999999999.99, 'Amount is too large')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must not exceed 50 characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  customer_name: z.string()
    .max(100, 'Customer name must not exceed 100 characters')
    .optional(),
  customer_phone: z.string()
    .max(20, 'Customer phone must not exceed 20 characters')
    .optional(),
  payment_method: z.enum(['cash', 'mpesa', 'bank', 'card', 'credit', 'other'])
    .optional(),
  transaction_date: z.union([
    z.string().datetime('Invalid date format'),
    z.date()
  ]).optional(),
  metadata: z.record(z.string(), z.any())
    .optional()
});

/**
 * Expense validation schema
 */
export const expenseSchema = z.object({
  business_id: z.string().uuid('Invalid business ID'),
  industry: z.string().min(2).max(50),
  amount: z.number()
    .positive('Amount must be positive')
    .max(999999999.99, 'Amount is too large')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must not exceed 50 characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  vendor_name: z.string()
    .max(100, 'Vendor name must not exceed 100 characters')
    .optional(),
  supplier_phone: z.string()
    .max(20, 'Supplier phone must not exceed 20 characters')
    .optional(),
  payment_method: z.enum(['cash', 'mpesa', 'bank', 'card', 'credit', 'other'])
    .optional(),
  expense_date: z.union([
    z.string().datetime('Invalid date format'),
    z.date()
  ]).optional(),
  metadata: z.record(z.string(), z.any())
    .optional()
});

/**
 * Beehive action validation schema
 */
export const beehiveActionSchema = z.object({
  action: z.enum([
    'create', 'list', 'vote', 'comment', 'listComments', 
    'deletePost', 'deleteComment', 'updatePost'
  ]),
  data: z.object({
    content: z.string()
      .min(1, 'Content cannot be empty')
      .max(2000, 'Content must not exceed 2000 characters')
      .optional(),
    title: z.string()
      .max(200, 'Title must not exceed 200 characters')
      .optional(),
    postId: z.string().uuid('Invalid post ID').optional(),
    commentId: z.string().uuid('Invalid comment ID').optional(),
    voteType: z.enum(['up', 'down']).optional(),
    category: z.string().max(50).optional(),
    tags: z.array(z.string().max(30)).max(5, 'Maximum 5 tags allowed').optional()
  }).optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  industry: z.string().max(50).optional(),
  country: z.string().length(2).optional()
});

/**
 * Sync operation validation schema
 */
export const syncOperationSchema = z.object({
  operations: z.array(
    z.object({
      type: z.enum(['CREATE', 'UPDATE', 'DELETE']),
      entity: z.enum([
        'transactions', 'inventory', 'credit', 'expenses', 
        'services', 'appointments', 'targets', 'beehive'
      ]),
      entityId: z.string().uuid('Invalid entity ID').optional(),
      data: z.record(z.string(), z.any()).optional(),
      timestamp: z.number().optional()
    })
  ).max(100, 'Maximum 100 operations per sync request')
});

/**
 * Reset code validation schema (for future PIN reset feature)
 */
export const resetCodeSchema = z.string()
  .length(6, 'Reset code must be exactly 6 digits')
  .regex(/^\d{6}$/, 'Reset code must contain only digits');

/**
 * PIN reset request schema (for future use)
 */
export const pinResetRequestSchema = z.object({
  phoneNumber: phoneNumberSchema
});

/**
 * PIN reset verification schema (for future use)
 */
export const pinResetVerificationSchema = z.object({
  phoneNumber: phoneNumberSchema,
  resetCode: resetCodeSchema,
  newPin: pinSchema
});

/**
 * Security answer validation schema
 */
export const securityAnswerSchema = z.object({
  questionId: z.string().uuid('Invalid question ID'),
  answer: z.string()
    .min(1, 'Answer cannot be empty')
    .max(100, 'Answer must not exceed 100 characters')
    .trim()
});

/**
 * Security questions setup schema
 */
export const securityQuestionsSetupSchema = z.object({
  questionId: z.string().uuid('Invalid question ID'),
  answer: z.string().min(1).max(100).trim()
});

/**
 * Forgot PIN verify answers schema
 */
export const forgotPINVerifySchema = z.object({
  phoneNumber: phoneNumberSchema,
  answers: z.array(securityAnswerSchema)
    .length(1, 'Answer is required')
});
