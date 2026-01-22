import { ChevronLeft, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BeeZeeLogo from './BeeZeeLogo';

export default function PageHeader({
  title,
  showBack = false,
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  actionButtons = [],
  tabs = [],
  activeTab = '',
  onTabChange,
  dateRangeFilters = [],
  activeFilter = '',
  onFilterChange,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="reports-header-section pt-4">
      <div className="reports-title-row">
        {/* Logo or Back Button */}
        <div className="px-4">
          {showBack ? (
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 text-gray-400"
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
          ) : (
            <BeeZeeLogo />
          )}
        </div>

        {/* Title or Search */}
        <div className="flex items-center gap-2 flex-1">
          {!isSearchOpen ? (
            <h1 className="reports-title">{title}</h1>
          ) : (
            <div className="flex-1 flex items-center bg-gray-50 rounded-2xl px-3 py-1 animate-slide-right">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                autoFocus
                type="text"
                placeholder={t('common.search', 'Search...')}
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-bold flex-1 py-2"
              />
              <button onClick={() => { setIsSearchOpen(false); onSearchChange?.(''); }}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {showSearch && !isSearchOpen && (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-95 transition-transform"
            >
              <Search size={20} />
            </button>
          )}
          {actionButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={btn.className || "w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center text-white active:scale-95 transition-transform"}
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="reports-tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`reports-tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Date Range Filters */}
      {dateRangeFilters.length > 0 && (
        <div className="date-range-scroll">
          {dateRangeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange?.(filter.id)}
              className={`date-range-pill ${activeFilter === filter.id ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
