import { useState, useCallback } from 'react';
import { SignupData } from '@/types/signup';

export interface ValidationError {
  field: keyof SignupData;
  message: string;
}

export interface ValidationState {
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

const VALIDATION_RULES: ValidationRules = {
  country: {
    required: true,
    pattern: /^(KE|ZA|NG|GH|UG|RW|TZ)$/i,
    custom: (value: string) => {
      const supportedCountries = ['KE', 'ZA', 'NG', 'GH', 'UG', 'RW', 'TZ'];
      if (!supportedCountries.includes(value.toUpperCase())) {
        return 'Country not supported. Please select from available options.';
      }
      return null;
    }
  },
  industry: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  industrySector: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    custom: (value: string) => {
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
        return 'Name can only contain letters and spaces.';
      }
      return null;
    }
  },
  businessName: {
    required: false,
    minLength: 2,
    maxLength: 100,
    custom: (value: string) => {
      if (value && value.length > 0 && !/^[a-zA-Z0-9\s&'-]+$/.test(value.trim())) {
        return 'Business name can only contain letters, numbers, spaces, and basic punctuation.';
      }
      return null;
    }
  },
  phoneNumber: {
    required: true,
    custom: (value: string) => {
      const phoneRegex = {
        KE: /^\+254\d{9}$/,
        ZA: /^\+27\d{9}$/,
        NG: /^\+234\d{10}$/,
        GH: /^\+233\d{9}$/,
        UG: /^\+256\d{9}$/,
        RW: /^\+250\d{9}$/,
        TZ: /^\+255\d{9}$/
      };

      const isValid = Object.values(phoneRegex).some(regex => regex.test(value));
      if (!isValid) {
        return 'Invalid phone format. Supported formats: +254XXXXXXXXX (KE), +27XXXXXXXXX (ZA), +234XXXXXXXXXXX (NG), +233XXXXXXXXX (GH), +256XXXXXXXXX (UG), +250XXXXXXXXX (RW), +255XXXXXXXXX (TZ)';
      }
      return null;
    }
  },
  dailyTarget: {
    required: false,
    custom: (value: number) => {
      if (value && (value < 0 || value > 10000000)) {
        return 'Daily target must be between 0 and 10,000,000';
      }
      return null;
    }
  },
  currency: {
    required: false,
    pattern: /^[A-Z]{3}$/
  },
  inviteCode: {
    required: false,
    maxLength: 20
  },
  pin: {
    required: true,
    pattern: /^\d{6}$/,
    custom: (value: string) => {
      if (!/^\d{6}$/.test(value)) {
        return 'PIN must be exactly 6 digits.';
      }
      return null;
    }
  },
  isDataSynced: {
    required: false
  },
  lastSyncTime: {
    required: false
  }
};

export function useSignupValidation() {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: [],
    isValid: false,
    isDirty: false
  });

  const validateField = useCallback((field: keyof SignupData, value: any): string | null => {
    const rules = VALIDATION_RULES[field];
    if (!rules) return null;

    // Required field validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Length validations
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters.`;
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must not exceed ${rules.maxLength} characters.`;
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      const fieldDisplayName = field === 'pin' ? 'PIN' : field.charAt(0).toUpperCase() + field.slice(1);
      return `${fieldDisplayName} format is invalid.`;
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, []);

  const validateForm = useCallback((formData: Partial<SignupData>): ValidationState => {
    const errors: ValidationError[] = [];

    // Validate each field
    Object.keys(formData).forEach((field) => {
      const fieldKey = field as keyof SignupData;
      const value = formData[fieldKey];
      const error = validateField(fieldKey, value);
      
      if (error) {
        errors.push({
          field: fieldKey,
          message: error
        });
      }
    });

    const isValid = errors.length === 0;
    const isDirty = true;

    const newState = { errors, isValid, isDirty };
    setValidationState(newState);
    return newState;
  }, [validateField]);

  const validateStep = useCallback((step: number, formData: Partial<SignupData>): ValidationState => {
    const stepFields: { [key: number]: (keyof SignupData)[] } = {
      1: [], // Welcome step - no validation needed
      2: ['country'],
      3: ['industry'],
      4: ['industrySector'],
      5: ['name', 'phoneNumber'], // businessName is optional
      6: ['pin'], // PIN setup step
      7: ['dailyTarget'], // Daily target step
      8: [] // Account summary - no validation needed
    };

    const fieldsToValidate = stepFields[step] || [];
    const stepData: Partial<SignupData> = {};
    
    fieldsToValidate.forEach(field => {
      const value = formData[field];
      if (value !== undefined && value !== null) {
        (stepData as any)[field] = value;
      }
    });

    return validateForm(stepData);
  }, [validateForm]);

  const validatePINConfirmation = useCallback((pin: string, confirmPin: string): string | null => {
    if (pin.length !== 6) {
      return 'PIN must be exactly 6 digits.';
    }

    if (!/^\d{6}$/.test(pin)) {
      return 'PIN must contain only numbers.';
    }

    if (confirmPin.length !== 6) {
      return 'Please confirm your PIN.';
    }

    if (pin !== confirmPin) {
      return 'PINs do not match. Please try again.';
    }

    return null;
  }, []);

  const clearErrors = useCallback(() => {
    setValidationState({
      errors: [],
      isValid: false,
      isDirty: false
    });
  }, []);

  const clearFieldError = useCallback((field: keyof SignupData) => {
    setValidationState(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.field !== field)
    }));
  }, []);

  const getFieldError = useCallback((field: keyof SignupData): string | null => {
    const error = validationState.errors.find(error => error.field === field);
    return error ? error.message : null;
  }, [validationState.errors]);

  return {
    validationState,
    validateField,
    validateForm,
    validateStep,
    validatePINConfirmation,
    clearErrors,
    clearFieldError,
    getFieldError
  };
}
