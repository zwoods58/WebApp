import React from 'react';
import { Home, FileText, MessageCircle, Settings } from 'lucide-react';

export default function BusinessTrackerApp() {
    const transactions = [
        {
            date: 'YESTERDAY',
            items: [
                { icon: '$', name: '3x Blue Ribbon Bread', category: 'Sales', time: '10:20 PM', amount: '+R54,00', positive: true },
                { icon: '$', name: '1x Coca-Cola (2L)', category: 'Sales', time: '8:50 PM', amount: '+R26,00', positive: true },
                { icon: '$', name: 'Airtime Sales', category: 'Sales', time: '5:50 PM', amount: '+R150,00', positive: true },
            ]
        },
        {
            date: '14 JANUARY',
            items: [
                { icon: '📦', name: 'Stock Restock: Bread', category: 'Inventory', time: '10:50 PM', amount: '-R450,00', positive: false },
            ]
        },
        {
            date: '13 JANUARY',
            items: [
                { icon: '📦', name: 'Transport', category: 'Operations', time: '10:50 PM', amount: '-R50,00', positive: false },
            ]
        }
    ];

    return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col overflow-hidden">
            {/* Top Card */}
            <div className="p-4">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        need to reduce daily expenses by R9 to break even.
                    </p>
                    <button className="text-gray-800 font-medium text-sm flex items-center">
                        Chat with your coach →
                    </button>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="flex-1 px-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                    <button className="text-blue-600 text-sm font-medium">View All →</button>
                </div>

                {/* Transaction List */}
                <div className="space-y-4">
                    {transactions.map((section, idx) => (
                        <div key={idx}>
                            <p className="text-xs font-semibold text-gray-400 mb-3">{section.date}</p>
                            <div className="space-y-3">
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex items-center gap-3 bg-white">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.positive ? 'bg-green-100' : 'bg-gray-100'
                                            }`}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.category} · {item.time}</p>
                                        </div>
                                        <p className={`font-bold text-sm ${item.positive ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {item.amount}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="border-t border-gray-200 mt-6">
                <div className="flex justify-around py-3">
                    <button className="flex flex-col items-center gap-1">
                        <Home className="w-6 h-6 text-gray-900" />
                        <span className="text-xs font-semibold text-gray-900">HOME</span>
                    </button>
                    <button className="flex flex-col items-center gap-1">
                        <FileText className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400">REPORTS</span>
                    </button>
                    <button className="flex flex-col items-center gap-1">
                        <MessageCircle className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400">COACH</span>
                    </button>
                    <button className="flex flex-col items-center gap-1">
                        <Settings className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400">SETTINGS</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
