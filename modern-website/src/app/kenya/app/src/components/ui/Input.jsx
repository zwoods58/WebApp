import { forwardRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Input Component - BeeZee Design System
 * 
 * Types:
 * - text (default)
 * - tel
 * - number
 * - email
 * - date
 * 
 * States:
 * - error: Shows error message with icon
 * - success: Shows success state
 * - disabled: Disabled state
 */

const Input = forwardRef(({ 
  label,
  error,
  success,
  helperText,
  prefix,
  suffix,
  type = 'text',
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const inputClasses = `
    input
    ${error ? 'input-error' : ''}
    ${success ? 'input-success' : ''}
    ${prefix ? 'pl-10' : ''}
    ${suffix ? 'pr-10' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-small font-medium text-neutral-700 mb-2">
          {label}
          {props.required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
            {prefix}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
          {...props}
        />
        
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
            {suffix}
          </div>
        )}
        
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-danger-500">
            <AlertCircle size={20} />
          </div>
        )}
        
        {success && !error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-success-500">
            <CheckCircle2 size={20} />
          </div>
        )}
      </div>
      
      {error && (
        <p id="error-message" className="mt-2 text-small text-danger-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id="helper-text" className="mt-2 text-small text-neutral-600">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;


