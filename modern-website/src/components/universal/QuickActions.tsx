"use client";

import React from 'react';
import { Package, Calendar, Wrench } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface QuickActionsProps {
  industry: string;
  country: string;
  onAddInventory: () => void;
  onAddService: () => void;
  onAddAppointment: () => void;
}

export default function QuickActions({ 
  industry, 
  country, 
  onAddInventory, 
  onAddService, 
  onAddAppointment 
}: QuickActionsProps) {
  const { t } = useLanguage();

  const quickActions = [
    {
      id: 'inventory',
      icon: Package,
      label: t('quickActions.addInventory') || 'Add Inventory',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: onAddInventory,
    },
    {
      id: 'services',
      icon: Wrench,
      label: t('quickActions.addService') || 'Add Service',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: onAddService,
    },
    {
      id: 'appointments',
      icon: Calendar,
      label: t('quickActions.addAppointment') || 'Add Appointment',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: onAddAppointment,
    },
  ];

  return (
    <div className="mx-4 mb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          {t('quickActions.title') || 'Quick Actions'}
        </h3>
        
        {/* 1x3 Grid Layout - Mobile Friendly */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`
                  ${action.color}
                  flex flex-col items-center justify-center
                  p-4 rounded-xl
                  text-white
                  transition-all duration-200
                  transform active:scale-95
                  min-h-[88px] /* Minimum height for 44px touch target */
                  min-w-[44px]  /* Minimum width for 44px touch target */
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                `}
                aria-label={action.label}
              >
                <div className="mb-2">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
