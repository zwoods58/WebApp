import { Download } from 'lucide-react';
import usePWAInstall from '../hooks/usePWAInstall';

export default function PWAInstallButton() {
  const { isInstallable, install } = usePWAInstall();

  if (!isInstallable) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      console.log('App installed successfully!');
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-20 right-4 bg-primary text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-primary-dark transition-colors z-50"
      aria-label="Install app"
    >
      <Download size={20} />
      <span className="font-medium">Install App</span>
    </button>
  );
}
