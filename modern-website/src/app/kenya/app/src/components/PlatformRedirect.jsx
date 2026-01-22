import React, { useEffect, useState } from 'react';
import { useCountryStore, PLATFORM_CONFIG } from '../store/countryStore';

const PlatformRedirect = ({ children }) => {
  const { userCountry, activeCountry, requiresNativeApp, getPlatformInfo, redirectToPlatform } = useCountryStore();
  const [showRedirect, setShowRedirect] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem('beezee_redirect_shown');
    const targetCountry = userCountry || activeCountry;

    if (targetCountry && requiresNativeApp() && !hasShown && !dismissed) {
      setShowRedirect(true);
      // Mark as shown immediately so we don't flash it again on reload if they just dismiss
      // But user wants it 'once'. If we mark it shown here, and they refresh without clicking, it won't show again.
      // Better to mark shown on dismiss/action.
    }
    setChecked(true);
  }, [userCountry, activeCountry, requiresNativeApp, dismissed]);

  const handleRedirect = () => {
    localStorage.setItem('beezee_redirect_shown', 'true');
    redirectToPlatform();
    setShowRedirect(false); // Optional, since we redirect
  };

  const handleDismiss = () => {
    localStorage.setItem('beezee_redirect_shown', 'true');
    setDismissed(true);
    setShowRedirect(false);
  };

  const handleContinuePWA = () => {
    localStorage.setItem('beezee_redirect_shown', 'true');
    setDismissed(true);
    setShowRedirect(false);
  };

  // If we haven't checked yet, show nothing (loading)
  if (!checked) return null;

  // If showing redirect, BLOCK the children (app)
  if (showRedirect) {
    const platformInfo = getPlatformInfo();
    const currentCountry = userCountry || activeCountry;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Native App Available
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              For the best experience in {currentCountry?.name || 'your country'},
              we recommend downloading our native app with:
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6 text-left">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">
                  {currentCountry?.currency?.symbol || 'Local currency'} integration
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">
                  AMX UI language control
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">
                  Native performance
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRedirect}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Download {currentCountry?.name || 'Native'} App
              </button>

              <button
                onClick={handleContinuePWA}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Continue with Web App
              </button>

              <button
                onClick={handleDismiss}
                className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>

            {/* Platform Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {platformInfo.platformName} • Enhanced features available
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise render app
  return children;
};


export default PlatformRedirect;
