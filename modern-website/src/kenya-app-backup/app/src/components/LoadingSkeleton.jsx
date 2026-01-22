/**
 * Loading Skeleton Components
 * Shows skeleton screens while content loads
 */

export function Skeleton({ width, height, borderRadius = '12px', className = '' }) {
  return (
    <div
      className={`skeleton skeleton-shimmer ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-skeleton" aria-hidden="true">
      <Skeleton width="60%" height="20px" />
      <Skeleton width="100%" height="16px" className="mt-3" />
      <Skeleton width="80%" height="16px" className="mt-2" />
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="transaction-skeleton" aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton width="44px" height="44px" borderRadius="12px" />
        <div className="flex-1">
          <Skeleton width="60%" height="16px" />
          <Skeleton width="40%" height="12px" className="mt-2" />
        </div>
        <Skeleton width="80px" height="18px" />
      </div>
    </div>
  );
}

export function BalanceCardSkeleton() {
  return (
    <div className="balance-card-skeleton" aria-hidden="true">
      <Skeleton width="40%" height="16px" />
      <Skeleton width="70%" height="48px" className="mt-4" />
      <div className="flex gap-3 mt-5">
        <Skeleton width="50%" height="60px" borderRadius="12px" />
        <Skeleton width="50%" height="60px" borderRadius="12px" />
      </div>
      <Skeleton width="100%" height="32px" className="mt-5" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="list-skeleton" aria-hidden="true" style={{ margin: '0 var(--spacing-medium)' }}>
      {Array.from({ length: count }).map((_, index) => (
        <TransactionSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-hidden="true">
      <Skeleton width="200px" height="32px" />
      <BalanceCardSkeleton />
      <div className="flex gap-4 mt-6">
        <Skeleton width="50%" height="120px" borderRadius="20px" />
        <Skeleton width="50%" height="120px" borderRadius="20px" />
      </div>
      <div className="mt-6">
        <Skeleton width="150px" height="20px" className="mb-4" />
        <ListSkeleton count={5} />
      </div>
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="reports-skeleton" aria-hidden="true" style={{ padding: 'var(--spacing-medium)' }}>
      <Skeleton width="100px" height="32px" />
      <div className="flex gap-2 mt-4" style={{ overflowX: 'auto' }}>
        <Skeleton width="80px" height="36px" borderRadius="999px" />
        <Skeleton width="80px" height="36px" borderRadius="999px" />
        <Skeleton width="80px" height="36px" borderRadius="999px" />
        <Skeleton width="80px" height="36px" borderRadius="999px" />
      </div>
      <CardSkeleton />
      <CardSkeleton />
      <div className="mt-4">
        <Skeleton width="120px" height="24px" className="mb-3" />
        <Skeleton width="100%" height="200px" borderRadius="20px" />
      </div>
    </div>
  );
}

export function CoachSkeleton() {
  return (
    <div className="coach-skeleton" aria-hidden="true" style={{ padding: 'var(--spacing-medium)' }}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3" style={{ maxWidth: '75%' }}>
          <Skeleton width="44px" height="44px" borderRadius="12px" />
          <div className="flex-1">
            <Skeleton width="80%" height="16px" />
            <Skeleton width="60%" height="16px" className="mt-2" />
            <Skeleton width="50px" height="12px" className="mt-2" />
          </div>
        </div>
        <div className="flex items-start gap-3 justify-end" style={{ maxWidth: '75%', marginLeft: 'auto' }}>
          <div className="flex-1">
            <Skeleton width="70%" height="16px" />
            <Skeleton width="50px" height="12px" className="mt-2" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="settings-skeleton" aria-hidden="true" style={{ padding: 'var(--spacing-medium)' }}>
      <Skeleton width="120px" height="32px" />
      <Skeleton width="100%" height="200px" borderRadius="20px" className="mt-4" />
      <Skeleton width="100%" height="150px" borderRadius="20px" className="mt-4" />
      <Skeleton width="80px" height="16px" className="mt-6 mb-2" />
      <Skeleton width="100%" height="60px" borderRadius="16px" className="mb-2" />
      <Skeleton width="100%" height="60px" borderRadius="16px" />
    </div>
  );
}

