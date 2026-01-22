'use client';

import { useEffect, useState } from 'react';

export default function SouthAfricaAppPage() {
    const [App, setApp] = useState<any>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        import('../src/App.jsx').then((mod) => {
            setApp(() => mod.default);
        });
    }, []);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading South Africa App...</p>
                </div>
            </div>
        );
    }

    if (!App) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading South Africa App...</p>
                </div>
            </div>
        );
    }

    return <App />;
}
