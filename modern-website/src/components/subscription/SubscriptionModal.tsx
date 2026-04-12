'use client';

import { KenyaSubscriptionModal } from './KenyaSubscriptionModal';
import { NigeriaSubscriptionModal } from './NigeriaSubscriptionModal';
import { GhanaSubscriptionModal } from './GhanaSubscriptionModal';
import { CoteIvoireSubscriptionModal } from './CoteIvoireSubscriptionModal';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: string;
  onSuccess?: () => void;
}

export function SubscriptionModal({ isOpen, onClose, country, onSuccess }: SubscriptionModalProps) {
  const countryCode = country?.toUpperCase();
  
  switch (countryCode) {
    case 'KE':
      return <KenyaSubscriptionModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />;
    case 'NG':
      return <NigeriaSubscriptionModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />;
    case 'GH':
      return <GhanaSubscriptionModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />;
    case 'CI':
      return <CoteIvoireSubscriptionModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />;
    default:
      console.warn(`No subscription modal found for ${country}, using Kenya modal as fallback`);
      return <KenyaSubscriptionModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />;
  }
}
