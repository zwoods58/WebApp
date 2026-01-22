import Button from './Button';

/**
 * EmptyState Component - BeeZee Design System
 * 
 * Friendly empty states with illustrations
 */

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  illustration,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
      {/* Icon or Illustration */}
      {illustration ? (
        <div className="mb-6 text-8xl">{illustration}</div>
      ) : Icon ? (
        <div className="mb-6 p-6 bg-neutral-100 rounded-full">
          <Icon size={64} className="text-neutral-400" />
        </div>
      ) : null}
      
      {/* Title */}
      {title && (
        <h3 className="text-h2 font-bold text-neutral-900 mb-2">
          {title}
        </h3>
      )}
      
      {/* Description */}
      {description && (
        <p className="text-body text-neutral-600 mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {/* Action */}
      {(action || (actionLabel && onAction)) && (
        action || (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}


