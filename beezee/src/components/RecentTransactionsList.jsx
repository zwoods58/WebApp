import { Link } from 'react-router-dom';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { formatCurrency } from '../utils/i18n';
import { ShoppingCart, DollarSign, Car, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
        <h2 className="recent-transactions-title">{t('dashboard.recentTransactions', 'Recent Transactions')}</h2>
        <Link to="/dashboard/transactions" className="recent-transactions-see-all">
          {t('dashboard.viewAll', 'See All')} <span>→</span>
        </Link>
      </div>

      {Object.entries(groupedTransactions).map(([dateLabel, dayTransactions]) => (
        <div key={dateLabel}>
          <div className="transaction-date-divider">{dateLabel}</div>
          {dayTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ))}
    </div>
  );
}

function TransactionCard({ transaction }) {
  const { t } = useTranslation();
  const categoryIcon = getCategoryIcon(transaction.category);
  const categoryClass = getCategoryClass(transaction.category);
  const transactionDate = parseISO(transaction.date);
  const time = format(transactionDate, 'h:mm a');

  return (
    <div className="transaction-card">
      <div className="transaction-card-left">
        <div className={`transaction-icon-container ${categoryClass}`}>
          {categoryIcon}
        </div>
        <div className="transaction-details">
          <div className="transaction-description">{transaction.description}</div>
          <div className="transaction-metadata">
            {t(`categories.${transaction.category?.toLowerCase()}`, transaction.category)} • {time}
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
      label = t('common.today', 'TODAY').toUpperCase();
    } else if (isYesterday(date)) {
      label = t('common.yesterday', 'YESTERDAY').toUpperCase();
    } else {
      label = format(date, 'dd MMMM').toUpperCase();
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(transaction);
  });

  return groups;
}

function getCategoryIcon(category) {
  const icons = {
    Sales: <DollarSign size={24} />,
    Food: <ShoppingCart size={24} />,
    Transport: <Car size={24} />,
    Other: <Package size={24} />,
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
