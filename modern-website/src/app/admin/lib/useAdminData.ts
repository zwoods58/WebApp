
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
    const [isMockData, setIsMockData] = useState(false);

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
                console.error('Error fetching data, falling back to mock:', usersError || subsError);
                useMockData();
                return;
            }

            // Process Real Data
            processRealData(usersData, subsData);

        } catch (err) {
            console.error('Exception fetching data:', err);
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const processRealData = (usersData: any[], subsData: any[]) => {
        // Implement processing logic here
        // For now, if no data returned (RLS empty), use mock
        if ((!usersData || usersData.length === 0) && (!subsData || subsData.length === 0)) {
            useMockData();
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

    const useMockData = () => {
        setIsMockData(true);
        setStats([
            { code: 'NG', name: 'Nigeria', userCount: 1250, revenue: 15400000, currency: 'NGN', color: '#10B981' }, // ~ $10k
            { code: 'KE', name: 'Kenya', userCount: 850, revenue: 1200000, currency: 'KES', color: '#EF4444' }, // ~ $9k
            { code: 'ZA', name: 'South Africa', userCount: 620, revenue: 218000, currency: 'ZAR', color: '#F59E0B' }, // ~ $11k
        ]);
        setTotalUsers(2720);
        setTotalRevenue(30540); // USD Approx

        setUsers([
            { id: '1', email: 'user1@example.com', phone: '+234 801 234 5678', country: 'Nigeria', status: 'active', joinedAt: '2024-01-10T10:00:00Z' },
            { id: '2', email: 'user2@example.com', phone: '+254 712 345 678', country: 'Kenya', status: 'trial', joinedAt: '2024-01-11T14:30:00Z' },
            { id: '3', email: 'user3@example.com', phone: '+27 61 234 5678', country: 'South Africa', status: 'expired', joinedAt: '2023-12-05T09:15:00Z' },
            { id: '4', email: 'ade.b@example.ng', phone: '+234 809 111 2222', country: 'Nigeria', status: 'active', joinedAt: '2024-01-12T08:00:00Z' },
            { id: '5', email: 'john.k@example.ke', phone: '+254 722 000 111', country: 'Kenya', status: 'active', joinedAt: '2024-01-09T16:45:00Z' },
        ]);
    };

    return { loading, stats, users, totalUsers, totalRevenue, isMockData };
};
