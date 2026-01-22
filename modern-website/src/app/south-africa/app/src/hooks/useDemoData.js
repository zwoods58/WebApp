import { useState, useEffect } from 'react';

const INITIAL_INVENTORY = [
    { id: '1', name: 'Blue Ribbon Bread', category: 'Food', price: 18.00, stock: 24, unit: 'loaves' },
    { id: '2', name: 'Ace Maize Meal (12.5kg)', category: 'Food', price: 95.00, stock: 10, unit: 'bags' },
    { id: '3', name: 'Coca-Cola (2L)', category: 'Beverages', price: 26.00, stock: 36, unit: 'bottles' },
    { id: '4', name: 'MTN Airtime', category: 'Digital', price: 10.00, stock: 100, unit: 'vouchers' },
    { id: '5', name: 'Sunlight Soap', category: 'Household', price: 12.00, stock: 45, unit: 'bars' }
];

const INITIAL_TRANSACTIONS = [
    { id: '1', type: 'income', amount: 54.00, description: '3x Blue Ribbon Bread', category: 'Sales', date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), method: 'Cash' }, // 30 mins ago
    { id: '2', type: 'income', amount: 26.00, description: '1x Coca-Cola (2L)', category: 'Sales', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), method: 'Card' }, // 2 hours ago
    { id: '3', type: 'expense', amount: 450.00, description: 'Stock Restock: Bread', category: 'Inventory', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), method: 'EFT' }, // Yesterday
    { id: '4', type: 'income', amount: 150.00, description: 'Airtime Sales', category: 'Sales', date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), method: 'Cash' },
    { id: '5', type: 'expense', amount: 50.00, description: 'Transport', category: 'Operations', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), method: 'Cash' }
];

const INITIAL_BOOKINGS = [
    { id: '1', client_name: 'Lerato Molefe', service: 'Plumbing Repair', appointment_date: new Date().toISOString().split('T')[0], appointment_time: '14:00', location: 'Soweto, Block D' },
    { id: '2', client_name: 'Thabo Mbeki', service: 'Electrical Consult', appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], appointment_time: '10:00', location: 'Sandton, 5th Ave' }
];

const INITIAL_TASKS = [
    { id: '1', title: 'Restock Maize Meal', completed: false, due_date: new Date().toISOString().split('T')[0] },
    { id: '2', title: 'Pay Electricity Bill', completed: true, due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] }
];

const INITIAL_COACH_SESSIONS = [
    { id: '1', role: 'assistant', content: "Hello! I'm your BeeZee AI assistant. Ask me anything about your finances or inventory.", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', role: 'user', content: "How is my business doing?", timestamp: new Date(Date.now() - 3500000).toISOString() },
    { id: '3', role: 'assistant', content: "Your business is doing well! Your total profit is R22,400 this month, which is up 15% from last month. Most of your revenue is coming from Blue Ribbon Bread sales.", timestamp: new Date(Date.now() - 3400000).toISOString() }
];

const INITIAL_VOICE_LOGS = [
    { id: '1', type: 'booking', success: true, confidence: 0.92, created_at: new Date(Date.now() - 172800000).toISOString(), raw_response: "Client: Lerato, Date: today, Time: 2pm, Service: Plumbing" },
    { id: '2', type: 'task', success: false, confidence: 0.45, error: "Cloud not clearly identify task title", created_at: new Date(Date.now() - 86400000).toISOString(), raw_response: "I need to... uh... bread... maybe?" }
];

const STORAGE_KEY = 'beezee_za_demo_data';

export function useDemoData() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const defaultData = {
            transactions: INITIAL_TRANSACTIONS,
            inventory: INITIAL_INVENTORY,
            bookings: INITIAL_BOOKINGS,
            tasks: INITIAL_TASKS,
            coachSessions: INITIAL_COACH_SESSIONS,
            voiceLogs: INITIAL_VOICE_LOGS
        };
        if (!saved) return defaultData;

        const parsed = JSON.parse(saved);
        return {
            ...defaultData,
            ...parsed
        };
    });

    const [loading, setLoading] = useState(false);

    // Persist on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const transactions = data.transactions;
    const inventory = data.inventory;
    const bookings = data.bookings;
    const tasks = data.tasks;
    const coachSessions = data.coachSessions;
    const voiceLogs = data.voiceLogs;

    // Derived Stats
    const stats = {
        totalIncome: transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0),
        totalExpenses: transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0),
        profit: 0,
        transactionCount: transactions.length,
        lowStockCount: inventory.filter(i => (i.stock || i.quantity || 0) < 10).length
    };
    stats.profit = stats.totalIncome - stats.totalExpenses;

    const addTransaction = (transaction) => {
        const newTx = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...transaction
        };

        setData(prev => ({
            ...prev,
            transactions: [newTx, ...prev.transactions]
        }));
        return Promise.resolve(newTx);
    };

    const addInventory = (item) => {
        const newItem = {
            id: Date.now().toString(),
            ...item
        };
        setData(prev => ({
            ...prev,
            inventory: [newItem, ...prev.inventory]
        }));
        return Promise.resolve(newItem);
    };

    const updateInventory = (id, updates) => {
        setData(prev => ({
            ...prev,
            inventory: prev.inventory.map(item => item.id === id ? { ...item, ...updates } : item)
        }));
        return Promise.resolve();
    };

    const deleteTransaction = (id) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== id)
        }));
        return Promise.resolve();
    };

    const deleteInventory = (id) => {
        setData(prev => ({
            ...prev,
            inventory: prev.inventory.filter(item => item.id !== id)
        }));
        return Promise.resolve();
    };

    const addBooking = (booking) => {
        const newBooking = { id: Date.now().toString(), ...booking };
        setData(prev => ({ ...prev, bookings: [...prev.bookings, newBooking] }));
        return Promise.resolve(newBooking);
    };

    const updateBooking = (id, updates) => {
        setData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
        return Promise.resolve();
    };

    const deleteBooking = (id) => {
        setData(prev => ({ ...prev, bookings: prev.bookings.filter(b => b.id !== id) }));
        return Promise.resolve();
    };

    const addTask = (task) => {
        const newTask = { id: Date.now().toString(), completed: false, ...task };
        setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
        return Promise.resolve(newTask);
    };

    const updateTask = (id, updates) => {
        setData(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
        return Promise.resolve();
    };

    const deleteTask = (id) => {
        setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
        return Promise.resolve();
    };

    const addCoachSession = (question, answer) => {
        const userMsg = { id: `user-${Date.now()}`, role: 'user', content: question, timestamp: new Date().toISOString() };
        const assistantMsg = { id: `assistant-${Date.now()}`, role: 'assistant', content: answer, timestamp: new Date().toISOString() };
        setData(prev => ({ ...prev, coachSessions: [...prev.coachSessions, userMsg, assistantMsg] }));
        return Promise.resolve();
    };

    const resetData = () => {
        setData({
            transactions: INITIAL_TRANSACTIONS,
            inventory: INITIAL_INVENTORY,
            bookings: INITIAL_BOOKINGS,
            tasks: INITIAL_TASKS,
            coachSessions: INITIAL_COACH_SESSIONS,
            voiceLogs: INITIAL_VOICE_LOGS
        });
    };

    return {
        transactions,
        inventory,
        bookings,
        tasks,
        coachSessions,
        voiceLogs,
        stats,
        addTransaction,
        addInventory,
        updateInventory,
        deleteInventory,
        deleteTransaction,
        addBooking,
        updateBooking,
        deleteBooking,
        addTask,
        updateTask,
        deleteTask,
        addCoachSession,
        resetData,
        loading
    };
}


