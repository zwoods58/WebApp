'use client';

import React from 'react';
import { Smartphone, Info } from 'lucide-react';
import { getMobileMoneyConfig } from '@/lib/mobile-money-config';

interface CountryPaymentProvidersProps {
  countryCode: string;
  className?: string;
}

const CountryPaymentProviders: React.FC<CountryPaymentProvidersProps> = ({
  countryCode,
  className = ''
}) => {
  const countryData = getMobileMoneyConfig(countryCode);

  if (!countryData) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Country Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">
              {countryData.name} Mobile Money Providers
            </h3>
            <p className="text-sm text-gray-600">
              Currency: {countryData.currency} | Weekly payments
            </p>
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countryData.providers.map((provider, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${provider.color} bg-white`}
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">{provider.name}</h4>
              <p className="text-sm text-gray-600">{provider.description}</p>
              
              <div className="flex items-start gap-2 pt-2">
                <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-700">
                  <p className="font-medium mb-1">How to pay:</p>
                  <p>{provider.instructions}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* General Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Mobile Money Payment Process</h4>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Click "Renew Now" or "Complete Payment" on your subscription</li>
          <li>You'll be redirected to a secure payment page</li>
          <li>Choose your preferred mobile money provider</li>
          <li>Follow the on-screen instructions to complete payment</li>
          <li>You'll receive a confirmation SMS once payment is successful</li>
          <li>Your subscription will be automatically updated</li>
        </ol>
      </div>

      {/* Support Information */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>For payment issues, contact your mobile money provider directly:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            {countryData.providers.map((provider, index) => (
              <li key={index}>
                {provider.name}: {provider.supportNumber}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CountryPaymentProviders;
