"use client";

import React, { useState } from 'react';
import { Mic, Camera, Calendar, Package, Home, FileText, Users, Settings, X } from 'lucide-react';

const BeezeeAppHero = () => {
    const [showCoachTip, setShowCoachTip] = useState(true);

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pt-10 pb-20 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Header */}
                <div className="bg-white px-6 py-6 rounded-b-[2.5rem] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-inner overflow-hidden p-1.5">
                                <img src="/bezze.png" alt="BeeZee" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-black text-xl tracking-tight text-gray-900">BeeZee</span>
                        </div>
                        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                            <div className="w-5 h-[2px] bg-gray-300 rounded-full relative">
                                <div className="absolute -top-1.5 left-0 w-3 h-[2px] bg-gray-300 rounded-full" />
                                <div className="absolute top-1.5 left-0 w-4 h-[2px] bg-gray-300 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <p className="text-gray-400 text-[11px] font-medium tracking-wide flex items-center gap-1.5">
                            <span className="text-sm">👋</span> GOOD AFTERNOON, FRIEND
                        </p>
                        <div className="text-[10px] text-gray-300 font-mono uppercase tracking-[0.1em]">Friday, 16 January</div>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="mx-4 mt-8 bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Balance</span>
                        <button className="text-[10px] text-system-blue font-black tracking-widest px-2 py-0.5 bg-system-blue/5 rounded-full uppercase">Demo</button>
                    </div>
                    <div className="text-3xl font-black mb-6 tracking-tighter text-gray-900">R 270,00</div>

                    {/* Money In/Out */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100/50">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-green-600 text-[10px] font-black">↗</span>
                                </div>
                                <span className="text-[9px] text-green-700 font-black tracking-widest uppercase">IN</span>
                            </div>
                            <div className="font-extrabold text-[15px] text-gray-900">R 230k</div>
                        </div>

                        <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100/50">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                                    <span className="text-red-600 text-[10px] font-black">↘</span>
                                </div>
                                <span className="text-[9px] text-red-700 font-black tracking-widest uppercase">OUT</span>
                            </div>
                            <div className="font-extrabold text-[15px] text-gray-900">R 500k</div>
                        </div>
                    </div>
                </div>

                {/* Tool Selection */}
                <div className="px-6 mt-8 mb-4">
                    <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4">Executive Tools</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Mic, color: 'purple', label: 'Voice' },
                            { icon: Camera, color: 'orange', label: 'Scan' },
                            { icon: Calendar, color: 'green', label: 'Book' },
                            { icon: Package, color: 'blue', label: 'Stock' }
                        ].map((tool, i) => (
                            <button key={i} className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col items-center gap-3 border border-gray-100 hover:scale-[1.02] active:scale-95 transition-all">
                                <div className={`w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center`}>
                                    <tool.icon className="w-6 h-6 text-gray-900" />
                                </div>
                                <span className="font-bold text-[11px] text-gray-900 uppercase tracking-wide">{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Coach Tip */}
                {showCoachTip && (
                    <div className="mx-4 mt-6 mb-8 bg-gray-900 rounded-[2rem] p-5 shadow-2xl relative overflow-hidden group/tip">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-system-blue/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover/tip:bg-system-blue/40" />
                        <div className="flex gap-4 relative z-10">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex-shrink-0 flex items-center justify-center border border-white/5">
                                <div className="w-6 h-6 bg-system-blue rounded-full animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <div className="text-system-blue font-black text-[10px] mb-1 tracking-widest uppercase">Coach Analysis</div>
                                <div className="text-[11px] text-white/80 leading-relaxed font-medium text-left">
                                    Monthly spending is <span className="text-white font-bold">+13.7%</span> over target. Recommend shifting liquidity.
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCoachTip(false)}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modern Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                {[
                    { icon: Home, active: true },
                    { icon: FileText },
                    { icon: Users },
                    { icon: Settings }
                ].map((item, i) => (
                    <button key={i} className="flex flex-col items-center justify-center gap-1 transition-transform active:scale-90">
                        <item.icon className={`w-6 h-6 ${item.active ? 'text-gray-900' : 'text-gray-300'}`} />
                        {item.active && <div className="w-1 h-1 rounded-full bg-gray-900" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BeezeeAppHero;
