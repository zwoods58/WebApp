(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/transportAnalytics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeTransportTransactions",
    ()=>analyzeTransportTransactions
]);
function analyzeTransportTransactions(transactions) {
    // Filter for transport transactions - safe with empty array
    const transportTransactions = transactions.filter((t)=>t.category === 'transport_trip' && t.metadata?.service_name);
    // Calculate popular services
    const serviceStats = new Map();
    transportTransactions.forEach((transaction)=>{
        const serviceName = transaction.metadata?.service_name || 'Unknown Service';
        const current = serviceStats.get(serviceName) || {
            trips: 0,
            revenue: 0
        };
        serviceStats.set(serviceName, {
            trips: current.trips + 1,
            revenue: current.revenue + transaction.amount
        });
    });
    const popularServices = Array.from(serviceStats.entries()).map(([service_name, stats])=>({
            service_name,
            ...stats
        })).sort((a, b)=>b.trips - a.trips);
    // Calculate profitable areas (from location metadata)
    const areaStats = new Map();
    transportTransactions.forEach((transaction)=>{
        const location = transaction.metadata?.location;
        if (location) {
            const current = areaStats.get(location) || {
                revenue: 0,
                trips: 0
            };
            areaStats.set(location, {
                revenue: current.revenue + transaction.amount,
                trips: current.trips + 1
            });
        }
    });
    const profitableAreas = Array.from(areaStats.entries()).map(([location, stats])=>({
            location,
            ...stats
        })).sort((a, b)=>b.revenue - a.revenue);
    // Calculate totals
    const totalTrips = transportTransactions.length;
    const totalRevenue = transportTransactions.reduce((sum, t)=>sum + t.amount, 0);
    const avgTripRevenue = totalTrips > 0 ? totalRevenue / totalTrips : 0;
    return {
        popularServices,
        profitableAreas,
        totalTrips,
        totalRevenue,
        avgTripRevenue
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=6c7f9_WebApp_WebApp-main_modern-website_src_utils_transportAnalytics_ts_0c4dc534._.js.map