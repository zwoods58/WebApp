
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface CountryStats {
    code: string;
    name: string;
    userCount: number;
    revenue: number;
    currency: string;
    color: string;
}

export interface UserData {
    id: string;
    email: string | null;
    phone: string | null;
    country: string;
    status: string;
    joinedAt: string;
}

export const useAdminData = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CountryStats[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Users
            // Note: Direct access to auth.users is not possible from client.
            // We rely on 'users' table or 'profiles' table if available.
            // Based on codebase, there is a 'users' table.
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*');

            // 2. Fetch Subscriptions/Revenue
            const { data: subsData, error: subsError } = await supabase
                .from('subscriptions')
                .select('*');

            if (usersError || subsError) {
                console.error('Error fetching data:', usersError || subsError);
                setStats([]);
                setUsers([]);
                setTotalRevenue(0);
                setTotalUsers(0);
                return;
            }

            // Process Real Data
            processRealData(usersData, subsData);

        } catch (err) {
            console.error('Exception fetching data:', err);
            setStats([]);
            setUsers([]);
            setTotalRevenue(0);
            setTotalUsers(0);
        } finally {
            setLoading(false);
        }
    };

    const processRealData = (usersData: any[], subsData: any[]) => {
        // If no data available, return empty state
        if ((!usersData || usersData.length === 0) && (!subsData || subsData.length === 0)) {
            setStats([]);
            setUsers([]);
            setTotalRevenue(0);
            setTotalUsers(0);
            return;
        }

        // Identify country from phone number if not in user record
        const processedUsers = usersData.map(u => {
            let country = 'Unknown';
            const phone = u.whatsapp_number || u.phone_number || '';
            if (phone.startsWith('+234') || phone.startsWith('234')) country = 'Nigeria';
            else if (phone.startsWith('+254') || phone.startsWith('254')) country = 'Kenya';
            else if (phone.startsWith('+27') || phone.startsWith('27')) country = 'South Africa';

            return {
                id: u.id,
                email: u.email,
                phone: phone,
                country,
                status: u.subscription_status || 'free',
                joinedAt: u.created_at
            };
        });

        setUsers(processedUsers);
        setTotalUsers(processedUsers.length);

        // Calculate revenue from subscriptions
        // Group by country
        const countryMap: Record<string, CountryStats> = {
            'Nigeria': { code: 'NG', name: 'Nigeria', userCount: 0, revenue: 0, currency: 'NGN', color: '#10B981' },
            'Kenya': { code: 'KE', name: 'Kenya', userCount: 0, revenue: 0, currency: 'KES', color: '#EF4444' },
            'South Africa': { code: 'ZA', name: 'South Africa', userCount: 0, revenue: 0, currency: 'ZAR', color: '#F59E0B' },
            'Unknown': { code: 'UN', name: 'Other', userCount: 0, revenue: 0, currency: 'USD', color: '#6B7280' }
        };

        processedUsers.forEach(u => {
            if (countryMap[u.country]) {
                countryMap[u.country].userCount++;
            } else {
                countryMap['Unknown'].userCount++;
            }
        });

        if (subsData) {
            let grandTotal = 0;
            subsData.forEach(sub => {
                // Find user country
                const user = processedUsers.find(u => u.id === sub.user_id);
                const country = user ? user.country : 'Unknown';
                const amount = Number(sub.amount) || 0;

                // Normalize revenue to USD for total (approximate rates)
                // 1 USD = 1500 NGN, 130 KES, 19 ZAR
                let usdAmount = 0;
                if (sub.currency === 'NGN') usdAmount = amount / 1500;
                else if (sub.currency === 'KES') usdAmount = amount / 130;
                else if (sub.currency === 'ZAR') usdAmount = amount / 19;
                else usdAmount = amount; // assume USD

                grandTotal += usdAmount;

                if (countryMap[country]) {
                    countryMap[country].revenue += amount; // Keep local currency? Or normalize? 
                    // For the chart comparison, we should probably normalize, but displaying is tricky.
                    // Let's store raw local revenue for display, and maybe a normalized score for charts?
                    // For simplicity in this demo, we'll just track user counts mostly, and revenue if available.
                }
            });
            setTotalRevenue(grandTotal);
        }

        setStats(Object.values(countryMap).filter(c => c.userCount > 0));
    };

    return { loading, stats, users, totalUsers, totalRevenue };
};
