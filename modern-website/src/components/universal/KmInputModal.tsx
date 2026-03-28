"use client";

import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { formatCurrency, getCurrency } from '@/utils/currency';

interface KmInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (km: string, useBase: boolean, tips: string, location?: string) => void;
  service: any;
  country: string;
}

export default function KmInputModal({ isOpen, onClose, onConfirm, service, country }: KmInputModalProps) {
  const [km, setKm] = useState('');
  const [useBaseOnly, setUseBaseOnly] = useState(false);
  const [tips, setTips] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const calculateFare = () => {
    if (useBaseOnly) {
      return (service.metadata?.base_amount || 0) + (parseFloat(tips) || 0);
    }
    const kmValue = parseFloat(km) || 0;
    const pricePerKm = service.metadata?.price_per_km || 0;
    const baseAmount = service.metadata?.base_amount || 0;
    const tipsAmount = parseFloat(tips) || 0;
    return (kmValue * pricePerKm) + baseAmount + tipsAmount;
  };

  const handleSubmit = () => {
    onConfirm(km, useBaseOnly, tips, `${pickupLocation} → ${dropoffLocation}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 backdrop-fade transform-gpu"
        onClick={onClose}
        style={{ 
          willChange: 'opacity',
          transition: 'opacity 0.3s ease-out'
        }}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 scale-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{service.service_name}</h3>
              <p className="text-sm text-gray-600">Calculate trip fare</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.0"
                step="0.1"
                disabled={useBaseOnly}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="baseOnly"
                checked={useBaseOnly}
                onChange={(e) => setUseBaseOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="baseOnly" className="text-sm text-gray-700">
                Use base amount only
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tips (optional)
              </label>
              <input
                type="number"
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            {/* Location Tracking */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Nairobi CBD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drop-off Location
              </label>
              <input
                type="text"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Airport Terminal 3"
              />
            </div>

            {/* Fare Breakdown */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">Total Fare:</span>
                <span className="text-lg font-bold text-blue-900">
                  {getCurrency(country)} {calculateFare().toFixed(2)}
                </span>
              </div>
              {!useBaseOnly && (
                <div className="text-xs text-blue-600 mt-1">
                  ({km || '0'} km × {getCurrency(country)} {service.metadata?.price_per_km || 0}) + {getCurrency(country)} {service.metadata?.base_amount || 0}{tips && ` + ${getCurrency(country)} ${tips} tips`}
                </div>
              )}
              {useBaseOnly && (
                <div className="text-xs text-blue-600 mt-1">
                  Base amount only{tips && ` + ${getCurrency(country)} ${tips} tips`}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Confirm Trip
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
