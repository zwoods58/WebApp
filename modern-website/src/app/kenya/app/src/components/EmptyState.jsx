import { FileText, TrendingUp, Bell, Inbox } from 'lucide-react';
import { 
  TransactionsEmptyIllustration, 
  ReportsEmptyIllustration, 
  NotificationsEmptyIllustration, 
  InboxEmptyIllustration 
} from './EmptyStateIllustrations';

/**
 * Empty State Component
 * Shows encouraging empty states for different scenarios
 */
export default function EmptyState({
  type = 'transactions',
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}) {
  const getDefaultContent = () => {
    switch (type) {
      case 'transactions':
        return {
          illustration: <TransactionsEmptyIllustration />,
          title: title || 'Start tracking your business!',
          description: description || 'Record your first sale or expense to see your business grow here',
          actionLabel: actionLabel || 'Record First Transaction',
        };
      case 'reports':
        return {
          illustration: <ReportsEmptyIllustration />,
          title: title || 'No transactions yet',
          description: description || 'Start recording transactions to see your business insights here',
          actionLabel: actionLabel || 'Add Your First Transaction',
        };
      case 'notifications':
        return {
          illustration: <NotificationsEmptyIllustration />,
          title: title || "You're all caught up!",
          description: description || 'No new notifications right now',
          actionLabel: null,
        };
      case 'inbox':
        return {
          illustration: <InboxEmptyIllustration />,
          title: title || 'Nothing here yet',
          description: description || 'Your items will appear here',
          actionLabel: actionLabel || 'Get Started',
        };
      default:
        return {
          illustration: <TransactionsEmptyIllustration />,
          title: title || 'No items found',
          description: description || 'Get started by adding your first item',
          actionLabel: actionLabel || 'Add Item',
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state-illustration">
        {illustration || content.illustration}
      </div>

      <h2 className="empty-state-title">
        {content.title}
      </h2>

      <p className="empty-state-description">
        {content.description}
      </p>

      {content.actionLabel && onAction && (
        <button
          onClick={onAction}
          className="empty-state-action-button"
          aria-label={content.actionLabel}
        >
          {content.actionLabel}
        </button>
      )}
    </div>
  );
}

