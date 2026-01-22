import { Link } from 'react-router-dom';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ShoppingCart, DollarSign, Car, Package, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCountryStore } from '../store/countryStore';
import PendingBadge from './PendingBadge';

/**
 * Recent Transactions List Component
 * Shows transactions grouped by date
 */
export default function RecentTransactionsList({ transactions = [], maxItems = 5 }) {
  const { t } = useTranslation();
  const groupedTransactions = groupTransactionsByDate(transactions.slice(0, maxItems), t);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="recent-transactions-section">
      <div className="recent-transactions-header">
        <h2 className="recent-transactions-title">{t('dashboard.recentTransactions', 'Recent Activity')}</h2>
        <Link to="/dashboard/transactions" className="recent-transactions-see-all">
          {t('dashboard.viewAll', 'See All')}
          <ChevronRight size={14} strokeWidth={3} />
        </Link>
      </div>

      {Object.entries(groupedTransactions).map(([dateLabel, dayTransactions]) => (
        <div key={dateLabel}>
          <div className="transaction-date-divider">{dateLabel}</div>
          {dayTransactions.map((transaction) => (
            <TransactionCard key={transaction.id || transaction.offline_id || `offline_${transaction.created_at}`} transaction={transaction} />
          ))}
        </div>
      ))}
    </div>
  );
}

function TransactionCard({ transaction }) {
  const { t } = useTranslation();
  const { formatCurrency } = useCountryStore();
  const categoryIcon = getCategoryIcon(transaction.category);
  const categoryClass = getCategoryClass(transaction.category);
  const transactionDate = parseISO(transaction.date);
  const time = format(transactionDate, 'h:mm a');
  const isPending = transaction.synced === false || transaction.pending === true || transaction.offline_id;

  return (
    <div className={`transaction-card ${isPending ? 'opacity-75' : ''}`}>
      <div className="transaction-card-left">
        <div className={`transaction-icon-container ${categoryClass} ${isPending ? 'opacity-60' : ''}`}>
          {categoryIcon}
        </div>
        <div className="transaction-details">
          <div className="transaction-description flex items-center gap-2">
            {transaction.description}
            {isPending && <PendingBadge />}
          </div>
          <div className="transaction-metadata">
            <span className="cat-tag">{t(`categories.${transaction.category?.toLowerCase()}`, transaction.category)}</span>
            <span className="dot">•</span>
            <span>{time}</span>
          </div>
        </div>
      </div>
      <div className={`transaction-amount ${transaction.type}`}>
        {transaction.type === 'income' ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  );
}

function groupTransactionsByDate(transactions, t) {
  const groups = {};

  transactions.forEach((transaction) => {
    const date = parseISO(transaction.date);
    let label;

    if (isToday(date)) {
      label = t('common.today', 'Today');
    } else if (isYesterday(date)) {
      label = t('common.yesterday', 'Yesterday');
    } else {
      label = format(date, 'd MMMM');
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(transaction);
  });

  return groups;
}

function getCategoryIcon(category) {
  const size = 20;
  const icons = {
    Sales: <DollarSign size={size} />,
    Food: <ShoppingCart size={size} />,
    Transport: <Car size={size} />,
    Other: <Package size={size} />,
  };
  return icons[category] || icons.Other;
}

function getCategoryClass(category) {
  const classes = {
    Sales: 'income',
    Food: 'expense',
    Transport: 'expense',
    Other: 'other',
  };
  return classes[category] || classes.Other;
}
