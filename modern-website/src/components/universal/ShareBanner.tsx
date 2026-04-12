"use client";

import { useState } from 'react';
import { Share2, Users, Copy, Check } from 'lucide-react';

interface ShareBannerProps {
  industry: string;
  country: string;
}

export default function ShareBanner({ industry, country }: ShareBannerProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/Beezee-App/auth/signup?country=${country}&industry=${industry}`
    : '';

  const handleShare = async () => {
    const shareData = {
      title: 'Join me on BeeZee - Business Management App',
      text: `I'm using BeeZee to manage my ${industry} business. Sign up with my link!`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        // Native share on mobile
        await navigator.share(shareData);
        setShareCount(prev => prev + 1);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
        setShareCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 mx-4 -mt-2 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Share with 2+ friends</h3>
            <p className="text-xs text-white/80 mt-0.5">
              Get premium features when friends join
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {shareCount >= 2 && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {shareCount} shared
            </div>
          )}
          
          <button
            onClick={handleShare}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-200 flex items-center gap-1"
          >
            {showCopied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-white/80">Share Progress</span>
          <span className="font-medium">{Math.min(shareCount, 2)}/2 friends</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((shareCount / 2) * 100, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Reward message */}
      {shareCount >= 2 && (
        <div className="mt-3 bg-green-500/20 border border-green-400/30 rounded-lg p-2 text-center">
          <p className="text-xs font-medium text-green-100">
            🎉 Congratulations! You've unlocked premium features!
          </p>
        </div>
      )}
    </div>
  );
}
