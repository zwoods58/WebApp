"use client";

import { useState, useEffect } from 'react';
import { Share2, Users, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface ShareBannerProps {
  industry: string;
  country: string;
}

interface BannerMessage {
  id: number;
  title: string;
  subtitle: string;
  reward: string;
  icon: React.ReactNode;
  gradient: string;
}

export default function ShareBanner({ industry, country }: ShareBannerProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/Beezee-App/auth/signup?country=${country}&industry=${industry}`
    : '';

  const bannerMessages: BannerMessage[] = [
    {
      id: 1,
      title: 'Share with 2+ friends',
      subtitle: 'Get premium features when friends join',
      reward: 'Unlock advanced analytics and reports',
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      id: 2,
      title: 'Grow your business network',
      subtitle: 'Connect with other business owners',
      reward: 'Get exclusive business tips and insights',
      icon: <Share2 className="w-5 h-5" />,
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 3,
      title: 'Build your team',
      subtitle: 'Invite team members to collaborate',
      reward: 'Get multi-user management features',
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-cyan-600 to-teal-600'
    }
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerMessages.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoRotating, bannerMessages.length]);

  // Pause auto-rotation on user interaction
  const handleManualNavigation = (index: number) => {
    setCurrentIndex(index);
    setIsAutoRotating(false);
    // Resume auto-rotation after 10 seconds
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

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

  const currentMessage = bannerMessages[currentIndex];

  return (
    <div className={`bg-gradient-to-r ${currentMessage.gradient} mx-4 -mt-2 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}>
      {/* Carousel indicators */}
      <div className="absolute top-2 right-2 flex gap-1">
        {bannerMessages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleManualNavigation(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => handleManualNavigation((currentIndex - 1 + bannerMessages.length) % bannerMessages.length)}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-1 rounded-full transition-all duration-200"
        aria-label="Previous message"
      >
        <ChevronLeft className="w-3 h-3" />
      </button>
      
      <button
        onClick={() => handleManualNavigation((currentIndex + 1) % bannerMessages.length)}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-1 rounded-full transition-all duration-200"
        aria-label="Next message"
      >
        <ChevronRight className="w-3 h-3" />
      </button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            {currentMessage.icon}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{currentMessage.title}</h3>
            <p className="text-xs text-white/80 mt-0.5">
              {currentMessage.subtitle}
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
      {shareCount >= 2 ? (
        <div className="mt-3 bg-green-500/20 border border-green-400/30 rounded-lg p-2 text-center">
          <p className="text-xs font-medium text-green-100">
            Congratulations! You've unlocked premium features!
          </p>
        </div>
      ) : (
        <div className="mt-3 bg-white/10 rounded-lg p-2 text-center">
          <p className="text-xs text-white/90">
            {currentMessage.reward}
          </p>
        </div>
      )}
    </div>
  );
}

