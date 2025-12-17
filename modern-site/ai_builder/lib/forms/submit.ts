/**
 * Form Submission Handler
 * Handles form submissions from AI-generated contact forms
 */

export interface FormSubmission {
  name: string
  email: string
  phone?: string
  message: string
  subject?: string
  [key: string]: any // Allow additional fields
}

export interface FormSubmissionResult {
  success: boolean
  message: string
  submissionId?: string
}

/**
 * Submit form data to backend API
 */
export async function submitForm(
  formData: FormSubmission,
  projectId?: string
): Promise<FormSubmissionResult> {
  try {
    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        projectId,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Form submission failed')
    }

    const result = await response.json()
    return {
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      submissionId: result.id,
    }
  } catch (error: any) {
    console.error('Form submission error:', error)
    return {
      success: false,
      message: error.message || 'Failed to submit form. Please try again.',
    }
  }
}

/**
 * Validate form data
 */
export function validateForm(formData: FormSubmission): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!formData.name || formData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Please enter a valid email address')
  }

  if (!formData.message || formData.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}



