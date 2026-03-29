module.exports = [
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useLanguageSafe.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLanguageSafe",
    ()=>useLanguageSafe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-ssr] (ecmascript)");
;
const useLanguageSafe = ()=>{
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    } catch (error) {
        return {
            t: (key, fallback)=>fallback || key,
            currentLanguage: 'en',
            setLanguage: ()=>{},
            availableLanguages: [
                'en'
            ]
        };
    }
};
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIndustryData",
    ()=>useIndustryData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
;
// Operation type detection based on metadata and data structure
const detectOperationType = (data, dataType)=>{
    // Transaction-based operations
    if (dataType === 'transactions') {
        if (data.metadata?.inventory_item_id) return 'inventory_sale';
        if (data.metadata?.credit_id) return 'credit_payment';
        if (data.metadata?.appointment_id || data.metadata?.service_name) return 'appointment_completion';
        if (data.category?.includes('appointment')) return 'appointment_completion';
        if (data.category === 'payment') return 'payment';
        if (data.category === 'sale') return 'sale';
        if (data.description?.toLowerCase().includes('payment for credit')) return 'credit_payment';
        if (data.description?.toLowerCase().includes('payment for') && data.metadata?.service_name) return 'appointment_completion';
    }
    // Direct data operations
    if (dataType === 'inventory') {
        console.log('🔍 Inventory operation detected:', data);
        return 'inventory_update';
    }
    if (dataType === 'credit') {
        // Check if this is a payment update (paid_amount changing)
        if (data.paid_amount !== undefined || data.status !== undefined) return 'credit_payment';
        return 'credit_update';
    }
    if (dataType === 'appointments') return 'appointment_update';
    if (dataType === 'services') return 'service_update';
    console.log('🔍 Default operation type for:', dataType, data);
    return 'general';
};
// Cross-invalidation based on operation type
const invalidateRelatedQueries = (queryClient, industry, country, operationType)=>{
    console.log(`🔄 Cross-invalidating queries for operation: ${operationType}`);
    const baseKeys = [
        [
            industry,
            country,
            'transactions'
        ],
        [
            industry,
            country,
            'inventory'
        ],
        [
            industry,
            country,
            'credit'
        ],
        [
            industry,
            country,
            'appointments'
        ],
        [
            industry,
            country,
            'services'
        ]
    ];
    switch(operationType){
        case 'inventory_sale':
            console.log('📦 Inventory sale - invalidating transactions and inventory');
            queryClient.invalidateQueries([
                industry,
                country,
                'transactions'
            ]);
            queryClient.invalidateQueries([
                industry,
                country,
                'inventory'
            ]);
            break;
        case 'credit_payment':
        case 'payment':
            console.log('💳 Credit payment - invalidating credit and transactions');
            queryClient.invalidateQueries([
                industry,
                country,
                'credit'
            ]);
            queryClient.invalidateQueries([
                industry,
                country,
                'transactions'
            ]);
            break;
        case 'appointment_completion':
        case 'appointment_update':
            console.log('📅 Appointment operation - invalidating appointments, services, and transactions');
            queryClient.invalidateQueries([
                industry,
                country,
                'appointments'
            ]);
            queryClient.invalidateQueries([
                industry,
                country,
                'services'
            ]);
            queryClient.invalidateQueries([
                industry,
                country,
                'transactions'
            ]);
            break;
        case 'inventory_update':
            console.log('📦 Inventory update - invalidating inventory');
            queryClient.invalidateQueries([
                industry,
                country,
                'inventory'
            ]);
            break;
        case 'credit_update':
            console.log('💳 Credit update - invalidating credit and transactions');
            queryClient.invalidateQueries([
                industry,
                country,
                'credit'
            ]);
            queryClient.invalidateQueries([
                industry,
                country,
                'transactions'
            ]);
            break;
        case 'service_update':
            console.log('🔧 Service update - invalidating services and appointments');
            queryClient.invalidateQueries([
                industry,
                country,
                'services'
            ]);
            queryClient.invalidateQueries([
                industry,
                country,
                'appointments'
            ]);
            break;
        case 'sale':
        default:
            console.log('💰 General operation - invalidating transactions');
            // For general operations, invalidate transactions and related data
            queryClient.invalidateQueries([
                industry,
                country,
                'transactions'
            ]);
            break;
    }
};
function useIndustryData(industry, country, dataType) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const isClient = ("TURBOPACK compile-time value", "undefined") !== 'undefined';
    // localStorage persistence keys
    const storageKey = `beezee_${industry}_${country}_${dataType}`;
    // Load initial data from localStorage if available
    const getInitialData = ()=>{
        if ("TURBOPACK compile-time truthy", 1) return [];
        //TURBOPACK unreachable
        ;
    };
    // Save data to localStorage when it changes
    const saveToLocalStorage = (data)=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    };
    // Query - reading data
    const { data, isLoading, isPaused: isQueryPaused, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            industry,
            country,
            dataType
        ],
        queryFn: async ()=>{
            // Check if Supabase is properly configured
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(dataType).select('*').eq('industry', industry).order('created_at', {
                    ascending: false
                });
                if (error) {
                    console.error(`Supabase error fetching ${dataType}:`, {
                        error,
                        details: error.details,
                        hint: error.hint,
                        code: error.code,
                        message: error.message,
                        industry
                    });
                    throw error;
                }
                console.log(`✅ Successfully fetched ${data?.length || 0} ${dataType}`);
                // Save to localStorage for offline persistence
                saveToLocalStorage(data || []);
                return data || [];
            } catch (err) {
                console.error(`Failed to fetch ${dataType}:`, {
                    error: err,
                    industry,
                    supabaseUrl: ("TURBOPACK compile-time truthy", 1) ? 'configured' : "TURBOPACK unreachable",
                    anonKey: ("TURBOPACK compile-time truthy", 1) ? 'configured' : "TURBOPACK unreachable"
                });
                throw err;
            }
        },
        enabled: isClient && !!industry && !!country,
        initialData: getInitialData(),
        networkMode: 'offlineFirst',
        staleTime: 5 * 60 * 1000,
        gcTime: 7 * 24 * 60 * 60 * 1000,
        retry: 3
    });
    // Mutation - adding data (NO onError rollback!)
    const mutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            industry,
            country,
            dataType
        ],
        mutationFn: async (newItem)=>{
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(dataType).insert({
                ...newItem,
                industry,
                country,
                created_at: new Date().toISOString()
            }).select().single();
            if (error) throw error;
            return data;
        },
        // Optimistic update - show item immediately
        onMutate: async (newItem)=>{
            await queryClient.cancelQueries({
                queryKey: [
                    industry,
                    country,
                    dataType
                ]
            });
            const previousData = queryClient.getQueryData([
                industry,
                country,
                dataType
            ]);
            const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const optimisticItem = {
                ...newItem,
                id: tempId,
                created_at: new Date().toISOString(),
                pendingSync: true
            };
            queryClient.setQueryData([
                industry,
                country,
                dataType
            ], (old = [])=>{
                const newItems = [
                    optimisticItem,
                    ...old
                ];
                // Save optimistic data to localStorage
                saveToLocalStorage(newItems);
                return newItems;
            });
            return {
                previousData,
                optimisticItem,
                tempId
            };
        },
        // ❌ REMOVED onError - Let TanStack Query handle failures and queue offline mutations
        // The mutation will automatically go into isPaused state and retry when online
        // ✅ Keep onSuccess - Replace temp ID with real data + cross-invalidate related queries
        onSuccess: (result, variables, context)=>{
            // Detect operation type and invalidate related queries
            const operationType = detectOperationType(variables, dataType);
            console.log(`🔄 ${dataType} operation successful: ${operationType} - invalidating related queries`);
            // Invalidate related queries for UI synchronization
            invalidateRelatedQueries(queryClient, industry, country, operationType);
            if (context?.optimisticItem) {
                queryClient.setQueryData([
                    industry,
                    country,
                    dataType
                ], (old = [])=>{
                    const items = old;
                    // Find and replace the optimistic item
                    const index = items.findIndex((item)=>item.id === context.optimisticItem?.id);
                    if (index !== -1) {
                        const newItems = [
                            ...items
                        ];
                        newItems[index] = {
                            ...result,
                            pendingSync: false
                        };
                        // Save to localStorage
                        saveToLocalStorage(newItems);
                        return newItems;
                    }
                    // Fallback: just add the real item
                    const updatedItems = [
                        result,
                        ...items.filter((i)=>!i.id?.toString().startsWith('temp_'))
                    ];
                    saveToLocalStorage(updatedItems);
                    return updatedItems;
                });
            }
        },
        networkMode: 'offlineFirst',
        retry: 3
    });
    const deleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            industry,
            country,
            dataType,
            'delete'
        ],
        mutationFn: async (id)=>{
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(dataType).delete().eq('id', id);
            if (error) throw error;
            return {
                success: true
            };
        },
        onMutate: async (id)=>{
            await queryClient.cancelQueries({
                queryKey: [
                    industry,
                    country,
                    dataType
                ]
            });
            const previousData = queryClient.getQueryData([
                industry,
                country,
                dataType
            ]);
            queryClient.setQueryData([
                industry,
                country,
                dataType
            ], (old = [])=>{
                const newItems = old.filter((item)=>item.id !== id);
                // Save to localStorage after optimistic delete
                saveToLocalStorage(newItems);
                return newItems;
            });
            return {
                previousData
            };
        },
        // ❌ REMOVED onError - Let TanStack Query handle offline failures
        onSuccess: (id)=>{
            console.log(`🔄 ${dataType} delete operation successful - invalidating related queries`);
            // Save updated data to localStorage after delete
            const currentData = queryClient.getQueryData([
                industry,
                country,
                dataType
            ]) || [];
            saveToLocalStorage(currentData);
            // For delete operations, invalidate the current data type and related queries
            invalidateRelatedQueries(queryClient, industry, country, dataType + '_update');
            queryClient.invalidateQueries({
                queryKey: [
                    industry,
                    country,
                    dataType
                ]
            });
        },
        networkMode: 'offlineFirst',
        retry: 3
    });
    const updateMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            industry,
            country,
            dataType,
            'update'
        ],
        mutationFn: async ({ id, updates })=>{
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(dataType).update(updates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        onMutate: async ({ id, updates })=>{
            await queryClient.cancelQueries({
                queryKey: [
                    industry,
                    country,
                    dataType
                ]
            });
            const previousData = queryClient.getQueryData([
                industry,
                country,
                dataType
            ]);
            // Optimistic update
            queryClient.setQueryData([
                industry,
                country,
                dataType
            ], (old = [])=>{
                const items = old;
                const index = items.findIndex((item)=>item.id === id);
                if (index !== -1) {
                    const newItems = [
                        ...items
                    ];
                    newItems[index] = {
                        ...newItems[index],
                        ...updates,
                        updated_at: new Date().toISOString()
                    };
                    // Save optimistic update to localStorage
                    saveToLocalStorage(newItems);
                    return newItems;
                }
                return items;
            });
            return {
                previousData
            };
        },
        onSuccess: (result, variables, context)=>{
            // Detect operation type and invalidate related queries
            const operationType = detectOperationType(variables.updates || variables, dataType);
            console.log(`🔄 ${dataType} update operation successful: ${operationType} - invalidating related queries`);
            console.log('🔍 Update variables:', variables);
            console.log('🔍 Detected operation type:', operationType);
            // Invalidate related queries for UI synchronization
            invalidateRelatedQueries(queryClient, industry, country, operationType);
            queryClient.setQueryData([
                industry,
                country,
                dataType
            ], (old = [])=>{
                const items = old;
                const index = items.findIndex((item)=>item.id === variables.id);
                if (index !== -1) {
                    const newItems = [
                        ...items
                    ];
                    newItems[index] = {
                        ...result,
                        updated_at: new Date().toISOString()
                    };
                    console.log(`✅ Updated ${dataType} item at index ${index}`);
                    // Save to localStorage
                    saveToLocalStorage(newItems);
                    return newItems;
                }
                return items;
            });
        },
        networkMode: 'offlineFirst',
        retry: 3
    });
    return {
        data: data || [],
        isLoading,
        error,
        isPaused: isQueryPaused || mutation.isPaused || deleteMutation.isPaused || updateMutation.isPaused,
        addItem: mutation.mutate,
        deleteItem: deleteMutation.mutate,
        updateItem: updateMutation.mutate,
        isAdding: mutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUpdating: updateMutation.isPending,
        refetch
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTransactionsTanStack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTransactionsTanStack",
    ()=>useTransactionsTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)");
;
function useTransactionsTanStack(options = {}) {
    // Default to Kenya and retail if not specified
    const industry = options.industry || 'retail';
    const country = options.country || 'ke';
    // Use the new TanStack Query hook
    const { data, isLoading, addItem, deleteItem, isAdding, isDeleting, isPaused, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, 'transactions');
    // Filter data based on options (basic implementation)
    let filteredData = data || [];
    if (options.category) {
        filteredData = filteredData.filter((t)=>t.category === options.category);
    }
    if (options.paymentMethod) {
        filteredData = filteredData.filter((t)=>t.payment_method === options.paymentMethod);
    }
    if (options.startDate) {
        filteredData = filteredData.filter((t)=>new Date(t.transaction_date) >= new Date(options.startDate));
    }
    if (options.endDate) {
        filteredData = filteredData.filter((t)=>new Date(t.transaction_date) <= new Date(options.endDate));
    }
    return {
        data: filteredData,
        isLoading,
        isPaused,
        addTransaction: addItem,
        deleteTransaction: deleteItem,
        isAdding: isAdding || isDeleting,
        error,
        refetch
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useExpensesTanStack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useExpensesTanStack",
    ()=>useExpensesTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)");
;
function useExpensesTanStack(options = {}) {
    // Default to Kenya and retail if not specified
    const industry = options.industry || 'retail';
    const country = options.country || 'ke';
    // Use the new TanStack Query hook
    const { data, isLoading, addItem, deleteItem, isAdding, isPaused } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, 'expenses');
    // Filter data based on options (basic implementation)
    let filteredData = data || [];
    if (options.category) {
        filteredData = filteredData.filter((e)=>e.category === options.category);
    }
    if (options.vendorName) {
        filteredData = filteredData.filter((e)=>e.supplier?.toLowerCase().includes(options.vendorName.toLowerCase()));
    }
    if (options.paymentMethod) {
        filteredData = filteredData.filter((e)=>e.payment_method === options.paymentMethod);
    }
    if (options.isRecurring !== undefined) {
        filteredData = filteredData.filter((e)=>e.is_recurring === options.isRecurring);
    }
    if (options.startDate) {
        filteredData = filteredData.filter((e)=>new Date(e.expense_date) >= new Date(options.startDate));
    }
    if (options.endDate) {
        filteredData = filteredData.filter((e)=>new Date(e.expense_date) <= new Date(options.endDate));
    }
    return {
        data: filteredData,
        isLoading,
        isOffline: isPaused,
        addExpense: addItem,
        deleteExpense: deleteItem,
        isPending: isAdding,
        // Keep the same interface as the original hook
        error: null,
        refetch: ()=>{}
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useCreditTanStack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreditTanStack",
    ()=>useCreditTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)");
;
function useCreditTanStack(options = {}) {
    // Default to Kenya and retail if not specified
    const industry = options.industry || 'retail';
    const country = options.country || 'ke';
    // Use the new TanStack Query hook
    const { data, isLoading, addItem, deleteItem, updateItem, isAdding, isPaused, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, 'credit');
    // Filter data based on options (basic implementation)
    let filteredData = data || [];
    if (options.status) {
        filteredData = filteredData.filter((c)=>c.status === options.status);
    }
    if (options.customerName) {
        filteredData = filteredData.filter((c)=>c.customer_name?.toLowerCase().includes(options.customerName.toLowerCase()));
    }
    if (options.customerPhone) {
        filteredData = filteredData.filter((c)=>c.customer_phone === options.customerPhone);
    }
    if (options.startDate) {
        filteredData = filteredData.filter((c)=>new Date(c.due_date) >= new Date(options.startDate));
    }
    if (options.endDate) {
        filteredData = filteredData.filter((c)=>new Date(c.due_date) <= new Date(options.endDate));
    }
    return {
        data: filteredData,
        isLoading,
        isOffline: isPaused,
        addCredit: addItem,
        deleteCredit: deleteItem,
        updateCredit: updateItem,
        isPending: isAdding,
        // Keep the same interface as the original hook
        error: null,
        refetch
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useInventoryTanStack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInventoryTanStack",
    ()=>useInventoryTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)");
;
function useInventoryTanStack(options = {}) {
    // Default to Kenya and retail if not specified
    const industry = options.industry || 'retail';
    const country = options.country || 'ke';
    // Use the new TanStack Query hook
    const { data, isLoading, addItem, deleteItem, updateItem, isAdding, isPaused, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, 'inventory');
    // Filter data based on options (basic implementation)
    let filteredData = data || [];
    if (options.category) {
        filteredData = filteredData.filter((i)=>i.category === options.category);
    }
    if (options.supplierName) {
        filteredData = filteredData.filter((i)=>i.supplier_name?.toLowerCase().includes(options.supplierName.toLowerCase()));
    }
    if (options.lowStock) {
        filteredData = filteredData.filter((i)=>i.quantity <= i.threshold);
    }
    if (options.outOfStock) {
        filteredData = filteredData.filter((i)=>i.quantity === 0);
    }
    return {
        data: filteredData,
        isLoading,
        isOffline: isPaused,
        addInventory: addItem,
        deleteInventory: deleteItem,
        updateInventory: updateItem,
        isPending: isAdding,
        // Keep the same interface as the original hook
        error: null,
        refetch
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useServicesTanStack",
    ()=>useServicesTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)");
;
function useServicesTanStack(options = {}) {
    // Default to Kenya and retail if not specified
    const industry = options.industry || 'retail';
    const country = options.country || 'ke';
    // Use the new TanStack Query hook
    const { data, isLoading, addItem, deleteItem, updateItem, isAdding, isPaused } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, 'services');
    // Filter data based on options (basic implementation)
    let filteredData = data || [];
    if (options.category) {
        filteredData = filteredData.filter((s)=>s.category === options.category);
    }
    if (options.isActive !== undefined) {
        filteredData = filteredData.filter((s)=>s.is_active === options.isActive);
    }
    if (options.requiresAppointment !== undefined) {
        filteredData = filteredData.filter((s)=>s.requires_appointment === options.requiresAppointment);
    }
    return {
        data: filteredData,
        isLoading,
        isOffline: isPaused,
        addService: addItem,
        deleteService: deleteItem,
        updateService: updateItem,
        isPending: isAdding,
        // Keep the same interface as the original hook
        error: null,
        refetch: ()=>{}
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppointmentsTanStack",
    ()=>useAppointmentsTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)");
;
function useAppointmentsTanStack(options = {}) {
    // Default to Kenya and retail if not specified
    const industry = options.industry || 'retail';
    const country = options.country || 'ke';
    // Use the new TanStack Query hook
    const { data, isLoading, addItem, deleteItem, updateItem, isAdding, isPaused } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, 'appointments');
    // Filter data based on options (basic implementation)
    let filteredData = data || [];
    if (options.status) {
        filteredData = filteredData.filter((a)=>a.status === options.status);
    }
    if (options.customerName) {
        filteredData = filteredData.filter((a)=>a.customer_name?.toLowerCase().includes(options.customerName.toLowerCase()));
    }
    if (options.customerPhone) {
        filteredData = filteredData.filter((a)=>a.customer_contact === options.customerPhone);
    }
    if (options.serviceType) {
        filteredData = filteredData.filter((a)=>a.service_name === options.serviceType);
    }
    if (options.startDate) {
        filteredData = filteredData.filter((a)=>new Date(a.appointment_date) >= new Date(options.startDate));
    }
    if (options.endDate) {
        filteredData = filteredData.filter((a)=>new Date(a.appointment_date) <= new Date(options.endDate));
    }
    return {
        data: filteredData,
        isLoading,
        isOffline: isPaused,
        addAppointment: addItem,
        deleteAppointment: deleteItem,
        updateAppointment: updateItem,
        isPending: isAdding,
        // Keep the same interface as the original hook
        error: null,
        refetch: ()=>{}
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTargetsTanStack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTargetsTanStack",
    ()=>useTargetsTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)");
;
function useTargetsTanStack(options = {}) {
    // Default to Kenya and retail if not specified
    const industry = options.industry || 'retail';
    const country = options.country || 'ke';
    // Use the new TanStack Query hook
    const { data, isLoading, addItem, deleteItem, isAdding, isPaused } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, 'targets');
    // Filter data based on options (basic implementation)
    let filteredData = data || [];
    if (options.targetType) {
        filteredData = filteredData.filter((t)=>t.target_type === options.targetType);
    }
    if (options.status) {
        filteredData = filteredData.filter((t)=>t.status === options.status);
    }
    if (options.period) {
        filteredData = filteredData.filter((t)=>t.period === options.period);
    }
    if (options.startDate) {
        filteredData = filteredData.filter((t)=>new Date(t.start_date) >= new Date(options.startDate));
    }
    if (options.endDate) {
        filteredData = filteredData.filter((t)=>new Date(t.end_date) <= new Date(options.endDate));
    }
    return {
        data: filteredData,
        isLoading,
        isOffline: isPaused,
        addTarget: addItem,
        deleteTarget: deleteItem,
        isPending: isAdding,
        // Keep the same interface as the original hook
        error: null,
        refetch: ()=>{}
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBeehiveTanStack.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBeehiveTanStack",
    ()=>useBeehiveTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)");
;
function useBeehiveTanStack(options = {}) {
    // Default to Kenya and retail if not specified
    const industry = options.industry || 'retail';
    const country = options.country || 'ke';
    // Use the new TanStack Query hook for requests
    const { data, isLoading, addItem, deleteItem, isAdding, isDeleting, isPaused, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, 'beehive');
    // Filter data based on options (basic implementation)
    let filteredData = data || [];
    if (options.status) {
        filteredData = filteredData.filter((b)=>b.status === options.status);
    }
    if (options.category) {
        filteredData = filteredData.filter((b)=>b.category === options.category);
    }
    if (options.isFeatured !== undefined) {
        filteredData = filteredData.filter((b)=>b.is_featured === options.isFeatured);
    }
    if (options.priority) {
        filteredData = filteredData.filter((b)=>b.priority === options.priority);
    }
    return {
        data: filteredData,
        isLoading,
        isPaused,
        addRequest: addItem,
        deleteRequest: deleteItem,
        isAdding: isAdding || isDeleting,
        error,
        refetch
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignupValidation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSignupValidation",
    ()=>useSignupValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const VALIDATION_RULES = {
    country: {
        required: true,
        pattern: /^(KE|ZA|NG|GH|UG|RW|TZ)$/i,
        custom: (value)=>{
            const supportedCountries = [
                'KE',
                'ZA',
                'NG',
                'GH',
                'UG',
                'RW',
                'TZ'
            ];
            if (!supportedCountries.includes(value.toUpperCase())) {
                return 'Country not supported. Please select from available options.';
            }
            return null;
        }
    },
    industry: {
        required: true,
        minLength: 2,
        maxLength: 50
    },
    industrySector: {
        required: true,
        minLength: 2,
        maxLength: 50
    },
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        custom: (value)=>{
            if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                return 'Name can only contain letters and spaces.';
            }
            return null;
        }
    },
    businessName: {
        required: false,
        minLength: 2,
        maxLength: 100,
        custom: (value)=>{
            if (value && value.length > 0 && !/^[a-zA-Z0-9\s&'-]+$/.test(value.trim())) {
                return 'Business name can only contain letters, numbers, spaces, and basic punctuation.';
            }
            return null;
        }
    },
    phoneNumber: {
        required: true,
        custom: (value)=>{
            const phoneRegex = {
                KE: /^\+254\d{9}$/,
                ZA: /^\+27\d{9}$/,
                NG: /^\+234\d{10}$/,
                GH: /^\+233\d{9}$/,
                UG: /^\+256\d{9}$/,
                RW: /^\+250\d{9}$/,
                TZ: /^\+255\d{9}$/
            };
            const isValid = Object.values(phoneRegex).some((regex)=>regex.test(value));
            if (!isValid) {
                return 'Invalid phone format. Supported formats: +254XXXXXXXXX (KE), +27XXXXXXXXX (ZA), +234XXXXXXXXXXX (NG), +233XXXXXXXXX (GH), +256XXXXXXXXX (UG), +250XXXXXXXXX (RW), +255XXXXXXXXX (TZ)';
            }
            return null;
        }
    },
    dailyTarget: {
        required: false,
        custom: (value)=>{
            if (value && (value < 0 || value > 10000000)) {
                return 'Daily target must be between 0 and 10,000,000';
            }
            return null;
        }
    },
    currency: {
        required: false,
        pattern: /^[A-Z]{3}$/
    },
    inviteCode: {
        required: false,
        maxLength: 20
    },
    pin: {
        required: true,
        pattern: /^\d{6}$/,
        custom: (value)=>{
            if (!/^\d{6}$/.test(value)) {
                return 'PIN must be exactly 6 digits.';
            }
            return null;
        }
    },
    isDataSynced: {
        required: false
    },
    lastSyncTime: {
        required: false
    }
};
function useSignupValidation() {
    const [validationState, setValidationState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        errors: [],
        isValid: false,
        isDirty: false
    });
    const validateField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((field, value)=>{
        const rules = VALIDATION_RULES[field];
        if (!rules) return null;
        // Required field validation
        if (rules.required && (!value || typeof value === 'string' && value.trim() === '')) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        }
        // Skip other validations if field is empty and not required
        if (!value || typeof value === 'string' && value.trim() === '') {
            return null;
        }
        // Length validations
        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters.`;
        }
        if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} must not exceed ${rules.maxLength} characters.`;
        }
        // Pattern validation
        if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
            const fieldDisplayName = field === 'pin' ? 'PIN' : field.charAt(0).toUpperCase() + field.slice(1);
            return `${fieldDisplayName} format is invalid.`;
        }
        // Custom validation
        if (rules.custom) {
            return rules.custom(value);
        }
        return null;
    }, []);
    const validateForm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((formData)=>{
        const errors = [];
        // Validate each field
        Object.keys(formData).forEach((field)=>{
            const fieldKey = field;
            const value = formData[fieldKey];
            const error = validateField(fieldKey, value);
            if (error) {
                errors.push({
                    field: fieldKey,
                    message: error
                });
            }
        });
        const isValid = errors.length === 0;
        const isDirty = true;
        const newState = {
            errors,
            isValid,
            isDirty
        };
        setValidationState(newState);
        return newState;
    }, [
        validateField
    ]);
    const validateStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((step, formData)=>{
        const stepFields = {
            1: [],
            2: [
                'country'
            ],
            3: [
                'industry'
            ],
            4: [
                'industrySector'
            ],
            5: [
                'name',
                'phoneNumber'
            ],
            6: [
                'pin'
            ],
            7: [
                'dailyTarget'
            ],
            8: [] // Account summary - no validation needed
        };
        const fieldsToValidate = stepFields[step] || [];
        const stepData = {};
        fieldsToValidate.forEach((field)=>{
            const value = formData[field];
            if (value !== undefined && value !== null) {
                stepData[field] = value;
            }
        });
        return validateForm(stepData);
    }, [
        validateForm
    ]);
    const validatePINConfirmation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((pin, confirmPin)=>{
        if (pin.length !== 6) {
            return 'PIN must be exactly 6 digits.';
        }
        if (!/^\d{6}$/.test(pin)) {
            return 'PIN must contain only numbers.';
        }
        if (confirmPin.length !== 6) {
            return 'Please confirm your PIN.';
        }
        if (pin !== confirmPin) {
            return 'PINs do not match. Please try again.';
        }
        return null;
    }, []);
    const clearErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setValidationState({
            errors: [],
            isValid: false,
            isDirty: false
        });
    }, []);
    const clearFieldError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((field)=>{
        setValidationState((prev)=>({
                ...prev,
                errors: prev.errors.filter((error)=>error.field !== field)
            }));
    }, []);
    const getFieldError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((field)=>{
        const error = validationState.errors.find((error)=>error.field === field);
        return error ? error.message : null;
    }, [
        validationState.errors
    ]);
    return {
        validationState,
        validateField,
        validateForm,
        validateStep,
        validatePINConfirmation,
        clearErrors,
        clearFieldError,
        getFieldError
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBusinessCreation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBusinessCreation",
    ()=>useBusinessCreation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseContext$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabaseContext.ts [app-ssr] (ecmascript)");
;
;
function useBusinessCreation() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        loading: false,
        error: null,
        result: null
    });
    const createBusinessWithPIN = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (signupData)=>{
        setState((prev)=>({
                ...prev,
                loading: true,
                error: null
            }));
        try {
            console.log('🔧 Creating business with PIN in database:', {
                ...signupData,
                pinLength: signupData.pin?.length,
                pinSet: !!signupData.pin,
                pinValue: signupData.pin ? '***' : 'none'
            });
            // Prepare business data with PIN for server-side hashing
            const businessData = {
                phoneNumber: signupData.phoneNumber,
                businessName: signupData.businessName || signupData.name + "'s Business",
                country: signupData.country.toUpperCase(),
                industry: signupData.industry,
                industrySector: signupData.industrySector,
                dailyTarget: signupData.dailyTarget,
                currency: signupData.currency,
                inviteCode: signupData.inviteCode,
                name: signupData.name,
                pin: signupData.pin // PIN will be hashed server-side
            };
            // Call server-side API endpoint to create business with PIN hashing
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(businessData)
            });
            const result = await response.json();
            if (!result.success) {
                console.error('❌ API error:', result.error);
                const errorResult = {
                    success: false,
                    existingUser: result.existingUser || false,
                    error: result.error || 'Failed to create business',
                    data: null
                };
                setState((prev)=>({
                        ...prev,
                        loading: false,
                        error: result.error,
                        result: errorResult
                    }));
                return errorResult;
            }
            const business = result.data.business;
            const session = result.data.session;
            console.log('✅ Business created successfully with PIN hash:', {
                id: business.id,
                business_name: business.business_name,
                country: business.country,
                industry: business.industry,
                home_currency: business.home_currency
            });
            // Set business context for RLS policies
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseContext$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setBusinessContext"])(business.id, business.country, business.industry);
                console.log('✅ Business context set during signup');
            } catch (contextError) {
                console.error('⚠️ Failed to set business context during signup:', contextError);
            // Don't fail signup if context setting fails - it will be set on redirect
            }
            const successResult = {
                success: true,
                existingUser: false,
                error: null,
                data: {
                    business: business,
                    userId: business.id,
                    session: session
                }
            };
            setState((prev)=>({
                    ...prev,
                    loading: false,
                    result: successResult
                }));
            return successResult;
        } catch (err) {
            console.error('💥 Unexpected error:', err);
            const errorResult = {
                success: false,
                existingUser: false,
                error: err instanceof Error ? err.message : 'Unexpected error occurred',
                data: null
            };
            setState((prev)=>({
                    ...prev,
                    loading: false,
                    error: err instanceof Error ? err.message : 'Unexpected error occurred',
                    result: errorResult
                }));
            return errorResult;
        }
    }, []);
    const checkDuplicatePhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (phoneNumber)=>{
        try {
            console.log('🔍 Checking for duplicate phone:', phoneNumber);
            const response = await fetch('/api/auth/check-phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber
                })
            });
            const result = await response.json();
            if (!response.ok) {
                console.error('❌ Error checking phone:', result.error);
                return {
                    exists: false,
                    error: result.error || 'Failed to check phone number'
                };
            }
            console.log('✅ Phone check result:', result);
            return {
                exists: result.exists
            };
        } catch (err) {
            console.error('💥 Error checking phone:', err);
            return {
                exists: false,
                error: 'Network error while checking phone number'
            };
        }
    }, []);
    const verifyPINForLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (phoneNumber, pin)=>{
        try {
            console.log('🔐 Verifying PIN for login:', {
                phoneNumber,
                pinLength: pin.length
            });
            const response = await fetch('/api/auth/verify-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber,
                    pin
                })
            });
            const result = await response.json();
            if (!result.success) {
                console.error('❌ PIN verification failed:', result.error);
                return {
                    success: false,
                    error: result.error || 'Invalid PIN'
                };
            }
            console.log('✅ PIN verification successful');
            return {
                success: true,
                business: result.business
            };
        } catch (err) {
            console.error('💥 Error verifying PIN:', err);
            return {
                success: false,
                error: 'Network error during PIN verification'
            };
        }
    }, []);
    const resetState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setState({
            loading: false,
            error: null,
            result: null
        });
    }, []);
    return {
        state,
        createBusinessWithPIN,
        checkDuplicatePhone,
        verifyPINForLogin,
        resetState
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignup.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSignup",
    ()=>useSignup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignupValidation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignupValidation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBusinessCreation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBusinessCreation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/currency.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
function useSignup() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { signInAfterSignup } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    const [signupState, setSignupState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        currentStep: 1,
        formData: {
            country: '',
            industry: '',
            industrySector: '',
            name: '',
            businessName: '',
            phoneNumber: '',
            dailyTarget: 0,
            currency: 'KES',
            inviteCode: '',
            pin: ''
        },
        isComplete: false,
        businessId: null,
        pinSetupStep: 'create'
    });
    const { validateStep, validatePINConfirmation, getFieldError, clearFieldError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignupValidation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSignupValidation"])();
    const { state: creationState, createBusinessWithPIN, checkDuplicatePhone } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBusinessCreation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBusinessCreation"])();
    // Auto-update currency when country changes
    const updateFormData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((field, value)=>{
        setSignupState((prev)=>{
            const updated = {
                ...prev,
                formData: {
                    ...prev.formData,
                    [field]: value
                }
            };
            // Auto-update currency when country changes
            if (field === 'country' && value) {
                updated.formData.currency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrency"])(value);
            }
            return updated;
        });
        // Clear field error when user starts typing
        if (getFieldError(field)) {
            clearFieldError(field);
        }
    }, [
        getFieldError,
        clearFieldError
    ]);
    const nextStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (signupState.currentStep < 8) {
            setSignupState((prev)=>({
                    ...prev,
                    currentStep: prev.currentStep + 1
                }));
        }
    }, [
        signupState.currentStep
    ]);
    const prevStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (signupState.currentStep > 1) {
            setSignupState((prev)=>({
                    ...prev,
                    currentStep: prev.currentStep - 1
                }));
            // Reset PIN setup step when going back from PIN confirmation
            if (signupState.currentStep === 6 && signupState.pinSetupStep === 'confirm') {
                setSignupState((prev)=>({
                        ...prev,
                        pinSetupStep: 'create'
                    }));
            }
        }
    }, [
        signupState.currentStep,
        signupState.pinSetupStep
    ]);
    const goToStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((step)=>{
        if (step >= 1 && step <= 8) {
            setSignupState((prev)=>({
                    ...prev,
                    currentStep: step
                }));
        }
    }, []);
    const handlePINSetup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((pin)=>{
        console.log('🔐 PIN setup completed - storing PIN and advancing to next step:', pin);
        updateFormData('pin', pin);
        setSignupState((prev)=>({
                ...prev,
                pinSetupStep: 'complete'
            }));
        // Auto-advance to next step after successful PIN setup
        setTimeout(()=>{
            nextStep();
        }, 500);
    }, [
        updateFormData,
        nextStep
    ]);
    const handlePINConfirmation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((pin, confirmPin)=>{
        const error = validatePINConfirmation(pin, confirmPin);
        if (error) {
            // PIN doesn't match or is invalid
            console.error('❌ PIN confirmation failed:', error);
            return false;
        }
        // PINs match and are valid
        updateFormData('pin', pin);
        setSignupState((prev)=>({
                ...prev,
                pinSetupStep: 'complete'
            }));
        // Auto-advance to next step after successful PIN confirmation
        setTimeout(()=>{
            nextStep();
        }, 500);
        return true;
    }, [
        validatePINConfirmation,
        updateFormData,
        nextStep
    ]);
    const validateCurrentStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const validation = validateStep(signupState.currentStep, signupState.formData);
        return validation.isValid;
    }, [
        signupState.currentStep,
        signupState.formData,
        validateStep
    ]);
    const handleComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // Validate final step
        const validation = validateStep(8, signupState.formData);
        if (!validation.isValid) {
            console.error('❌ Final validation failed:', validation.errors);
            return;
        }
        // Create complete profile
        const completeProfile = {
            country: signupState.formData.country || '',
            industry: signupState.formData.industry || '',
            industrySector: signupState.formData.industrySector || '',
            name: signupState.formData.name || '',
            businessName: signupState.formData.businessName || '',
            phoneNumber: signupState.formData.phoneNumber || '',
            dailyTarget: Number(signupState.formData.dailyTarget) || 0,
            currency: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrency"])(signupState.formData.country || ''),
            inviteCode: signupState.formData.inviteCode,
            pin: signupState.formData.pin || ''
        };
        try {
            console.log('🚀 Starting signup process with PIN:', {
                pinLength: completeProfile.pin?.length,
                pinSet: !!completeProfile.pin,
                pinHash: completeProfile.pin ? '***' : 'none'
            });
            const result = await createBusinessWithPIN(completeProfile);
            if (result.success && result.data?.business && result.data?.session) {
                console.log('✅ Business created successfully');
                const business = result.data.business;
                const session = result.data.session;
                setSignupState((prev)=>({
                        ...prev,
                        isComplete: true,
                        businessId: business.id
                    }));
                // Establish authentication state immediately
                const authResult = await signInAfterSignup(business, session);
                if (authResult.error) {
                    console.error('❌ Failed to establish auth state after signup:', authResult.error);
                    return;
                }
                // Navigate to dashboard using Next.js router
                const country = business.country.toLowerCase();
                const industry = business.industry.toLowerCase();
                console.log('🎯 Navigating to dashboard:', {
                    country,
                    industry
                });
                router.push(`/Beezee-App/app/${country}/${industry}`);
            } else {
                console.error('❌ Business creation failed:', result.error);
            // Error will be handled by the creation state
            }
        } catch (error) {
            console.error('💥 Signup error:', error);
        // Error will be handled by the creation state
        }
    }, [
        signupState.formData,
        createBusinessWithPIN,
        validateStep,
        signInAfterSignup,
        router
    ]);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setSignupState({
            currentStep: 1,
            formData: {
                country: '',
                industry: '',
                industrySector: '',
                name: '',
                businessName: '',
                phoneNumber: '',
                dailyTarget: 0,
                currency: 'KES',
                inviteCode: '',
                pin: ''
            },
            isComplete: false,
            businessId: null,
            pinSetupStep: 'create'
        });
    }, []);
    // Check for duplicate phone when phone number is entered
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const phoneNumber = signupState.formData.phoneNumber;
        if (phoneNumber && phoneNumber.length >= 12) {
            const timer = setTimeout(async ()=>{
                const result = await checkDuplicatePhone(phoneNumber);
                if (result.exists) {
                    console.log('⚠️ Phone number already exists:', phoneNumber);
                // Could show a warning or prevent progression
                }
            }, 1000); // Debounce for 1 second
            return ()=>clearTimeout(timer);
        }
    }, [
        signupState.formData.phoneNumber,
        checkDuplicatePhone
    ]);
    return {
        ...signupState,
        nextStep,
        prevStep,
        goToStep,
        updateFormData,
        handlePINSetup,
        handlePINConfirmation,
        handleComplete,
        reset,
        validateCurrentStep,
        creationState
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useRealtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBusinessRealtime",
    ()=>useBusinessRealtime,
    "useCreditRealtime",
    ()=>useCreditRealtime,
    "useExpensesRealtime",
    ()=>useExpensesRealtime,
    "useInventoryRealtime",
    ()=>useInventoryRealtime,
    "useRealtime",
    ()=>useRealtime,
    "useTargetsRealtime",
    ()=>useTargetsRealtime,
    "useTransactionsRealtime",
    ()=>useTransactionsRealtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabaseAdmin.ts [app-ssr] (ecmascript)");
;
;
// Debounce function to prevent excessive calls
const debounce = (func, delay)=>{
    let timeoutId;
    return (...args)=>{
        clearTimeout(timeoutId);
        timeoutId = setTimeout(()=>func(...args), delay);
    };
};
// Global registry to prevent duplicate subscriptions
const globalSubscriptions = new Map();
function useRealtime({ subscriptions, enabled = true }) {
    const channelsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const subscribeToTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((options)=>{
        if (!enabled) return null;
        const { table, filter, event = '*', callback, businessId, userId } = options;
        let channelName = `${table}_changes`;
        if (businessId) channelName += `_${businessId}`;
        if (userId) channelName += `_${userId}`;
        // Check if subscription already exists globally
        if (globalSubscriptions.has(channelName)) {
            console.log(`📡 Using existing subscription for ${table}`);
            return globalSubscriptions.get(channelName);
        }
        const channel = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseAdmin"].channel(channelName).on('postgres_changes', {
            event,
            schema: 'public',
            table,
            filter
        }, (payload)=>{
            console.log(`🔄 Real-time update on ${table}:`, payload);
            // Only call callback for INSERT events - UPDATE and DELETE don't need full refresh
            // This dramatically reduces the number of refreshes
            if (callback && payload.eventType === 'INSERT') {
                callback(payload);
            } else if (callback && payload.eventType === 'DELETE') {
                // Only handle DELETE if it's critical data
                callback(payload);
            }
        // Skip UPDATE events entirely - they cause excessive refreshes
        }).subscribe();
        console.log(`📡 Created new subscription for ${table}`);
        globalSubscriptions.set(channelName, channel);
        return channel;
    }, [
        enabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) return;
        // Clear existing channels from this hook instance
        channelsRef.current.forEach((channel)=>{
            // Only remove if not used by other instances (check global count)
            const isUsedElsewhere = Array.from(globalSubscriptions.values()).filter((c)=>c === channel).length > 1;
            if (!isUsedElsewhere) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseAdmin"].removeChannel(channel);
                // Remove from global registry by finding the key
                for (const [key, value] of globalSubscriptions.entries()){
                    if (value === channel) {
                        globalSubscriptions.delete(key);
                        break;
                    }
                }
            }
        });
        channelsRef.current = [];
        // Create new subscriptions
        const newChannels = subscriptions.map((options)=>subscribeToTable(options)).filter(Boolean);
        channelsRef.current = newChannels;
        return ()=>{
            // Cleanup channels on unmount - but keep them in global registry
            channelsRef.current = [];
        };
    }, [
        subscriptions,
        enabled,
        subscribeToTable
    ]);
    const unsubscribeAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        channelsRef.current.forEach((channel)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseAdmin"].removeChannel(channel);
            // Remove from global registry by finding the key
            for (const [key, value] of globalSubscriptions.entries()){
                if (value === channel) {
                    globalSubscriptions.delete(key);
                    break;
                }
            }
        });
        channelsRef.current = [];
    }, []);
    return {
        unsubscribeAll,
        isSubscribed: channelsRef.current.length > 0
    };
}
function useExpensesRealtime(businessId, onExpenseChange) {
    const subscriptions = [];
    if (businessId) {
        // Debounce the callback to prevent excessive fetches
        const debouncedCallback = debounce(onExpenseChange || (()=>{}), 2000);
        subscriptions.push({
            table: 'expenses',
            filter: `business_id=eq.${businessId}`,
            callback: debouncedCallback
        });
    }
    return useRealtime({
        subscriptions,
        enabled: !!businessId
    });
}
function useTransactionsRealtime(businessId, onTransactionChange) {
    const subscriptions = [];
    if (businessId) {
        // Debounce the callback to prevent excessive fetches
        const debouncedCallback = debounce(onTransactionChange || (()=>{}), 2000);
        subscriptions.push({
            table: 'transactions',
            filter: `business_id=eq.${businessId}`,
            callback: debouncedCallback
        });
    }
    return useRealtime({
        subscriptions,
        enabled: !!businessId
    });
}
function useInventoryRealtime(businessId, onInventoryChange) {
    const subscriptions = [];
    if (businessId) {
        // Debounce the callback to prevent excessive fetches
        const debouncedCallback = debounce(onInventoryChange || (()=>{}), 2000);
        subscriptions.push({
            table: 'inventory',
            filter: `business_id=eq.${businessId}`,
            callback: debouncedCallback
        });
    }
    return useRealtime({
        subscriptions,
        enabled: !!businessId
    });
}
function useCreditRealtime(businessId, onCreditChange) {
    const subscriptions = [];
    if (businessId) {
        // Debounce the callback to prevent excessive fetches
        const debouncedCallback = debounce(onCreditChange || (()=>{}), 2000);
        subscriptions.push({
            table: 'credit',
            filter: `business_id=eq.${businessId}`,
            callback: debouncedCallback
        });
    }
    return useRealtime({
        subscriptions,
        enabled: !!businessId
    });
}
function useTargetsRealtime(businessId, onTargetChange) {
    const subscriptions = [];
    if (businessId) {
        // Debounce the callback to prevent excessive fetches
        const debouncedCallback = debounce(onTargetChange || (()=>{}), 2000);
        subscriptions.push({
            table: 'targets',
            filter: `business_id=eq.${businessId}`,
            callback: debouncedCallback
        });
    }
    return useRealtime({
        subscriptions,
        enabled: !!businessId
    });
}
function useBusinessRealtime(businessId, onBusinessChange) {
    const subscriptions = [];
    if (businessId) {
        // Debounce the callback to prevent excessive fetches
        const debouncedCallback = debounce(onBusinessChange || (()=>{}), 2000);
        subscriptions.push({
            table: 'businesses',
            filter: `id=eq.${businessId}`,
            callback: debouncedCallback
        });
    }
    return useRealtime({
        subscriptions,
        enabled: !!businessId
    });
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTourTrigger.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePageTour",
    ()=>usePageTour,
    "useTourTrigger",
    ()=>useTourTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$IndustryTour$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function useTourTrigger(options = {}) {
    const { industry: tourIndustry = 'retail', country: tourCountry = 'ke', startTour, isTourActive } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$IndustryTour$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTour"])();
    const { industry = tourIndustry, country = tourCountry, autoStart = false, delay = 2000 } = options;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if tour was already completed
        const tourCompleted = localStorage.getItem('beezee-industry-tour-completed');
        // Auto-start tour if conditions are met
        if (autoStart && !tourCompleted && !isTourActive) {
            const timer = setTimeout(()=>{
                startTour();
            }, delay);
            return ()=>clearTimeout(timer);
        }
    }, [
        autoStart,
        delay,
        isTourActive,
        startTour
    ]);
    const shouldShowTourForPage = (currentPage)=>{
        // Define which pages should show tour steps
        const validPages = [
            'dashboard',
            'cash',
            'credit',
            'stock',
            'services',
            'beehive',
            'reports',
            'more'
        ];
        return validPages.includes(currentPage);
    };
    const getRelevantSteps = (currentPage)=>{
        // Filter steps based on current page
        const pageSteps = {
            dashboard: [
                'welcome',
                'daily-target',
                'buzz-insights',
                'quick-add'
            ],
            cash: [
                'cash-overview',
                'add-transaction'
            ],
            credit: [
                'credit-overview',
                'add-credit'
            ],
            stock: industry === 'retail' ? [
                'inventory-overview',
                'add-product'
            ] : industry === 'services' ? [
                'services-overview',
                'add-service'
            ] : industry === 'restaurant' ? [
                'inventory-overview',
                'add-ingredient'
            ] : [],
            services: industry === 'services' ? [
                'services-overview',
                'add-service'
            ] : [],
            beehive: [
                'beehive-overview'
            ],
            reports: [
                'reports-overview'
            ],
            more: [
                'more-overview'
            ]
        };
        return pageSteps[currentPage] || [];
    };
    return {
        startTour,
        isTourActive,
        shouldShowTourForPage,
        getRelevantSteps,
        industry,
        country
    };
}
function usePageTour(pageName) {
    const { startTour, isTourActive, shouldShowTourForPage, getRelevantSteps } = useTourTrigger();
    const startPageTour = ()=>{
        if (shouldShowTourForPage(pageName)) {
            startTour();
        }
    };
    const getPageSteps = ()=>{
        return getRelevantSteps(pageName);
    };
    return {
        startPageTour,
        isTourActive,
        shouldShowTour: shouldShowTourForPage(pageName),
        pageSteps: getPageSteps()
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/usePullToRefresh.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePullToRefresh",
    ()=>usePullToRefresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function usePullToRefresh({ onRefresh, threshold = 80, debounceMs = 100, disabled = false }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        shouldRefresh: false
    });
    const startY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const currentY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const debounceTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const resetState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setState({
            isPulling: false,
            isRefreshing: false,
            pullDistance: 0,
            shouldRefresh: false
        });
    }, []);
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (disabled) return;
        const touch = e.touches[0];
        startY.current = touch.clientY;
        currentY.current = touch.clientY;
        // Only start pull to refresh if we're at the top of the container
        if (containerRef.current) {
            const scrollTop = containerRef.current.scrollTop;
            if (scrollTop > 0) return;
        }
        setState((prev)=>({
                ...prev,
                isPulling: true,
                pullDistance: 0,
                shouldRefresh: false
            }));
    }, [
        disabled
    ]);
    const handleTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (disabled || !state.isPulling) return;
        const touch = e.touches[0];
        currentY.current = touch.clientY;
        const deltaY = currentY.current - startY.current;
        // Only allow pulling down (negative deltaY)
        if (deltaY > 0) return;
        const pullDistance = Math.abs(deltaY);
        const shouldRefresh = pullDistance >= threshold;
        setState((prev)=>({
                ...prev,
                pullDistance: Math.min(pullDistance, threshold * 1.5),
                shouldRefresh
            }));
        // Prevent default scrolling when pulling down
        if (pullDistance > 10) {
            e.preventDefault();
        }
    }, [
        disabled,
        state.isPulling,
        threshold
    ]);
    const handleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (disabled || !state.isPulling) return;
        if (state.shouldRefresh && !state.isRefreshing) {
            setState((prev)=>({
                    ...prev,
                    isRefreshing: true,
                    pullDistance: threshold
                }));
            try {
                await onRefresh();
            } catch (error) {
                console.error('Pull to refresh failed:', error);
            } finally{
                // Reset after a short delay to show completion
                setTimeout(()=>{
                    resetState();
                }, 500);
            }
        } else {
            resetState();
        }
    }, [
        disabled,
        state.isPulling,
        state.shouldRefresh,
        state.isRefreshing,
        threshold,
        onRefresh,
        resetState
    ]);
    // Mouse event handlers for desktop
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (disabled) return;
        const mouse = e;
        startY.current = mouse.clientY;
        currentY.current = mouse.clientY;
        // Only start pull to refresh if we're at the top of the container
        if (containerRef.current) {
            const scrollTop = containerRef.current.scrollTop;
            if (scrollTop > 0) return;
        }
        setState((prev)=>({
                ...prev,
                isPulling: true,
                pullDistance: 0,
                shouldRefresh: false
            }));
    }, [
        disabled
    ]);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (disabled || !state.isPulling) return;
        const mouse = e;
        currentY.current = mouse.clientY;
        const deltaY = currentY.current - startY.current;
        // Only allow pulling down (positive deltaY for mouse)
        if (deltaY < 0) return;
        const pullDistance = Math.abs(deltaY);
        const shouldRefresh = pullDistance >= threshold;
        setState((prev)=>({
                ...prev,
                pullDistance: Math.min(pullDistance, threshold * 1.5),
                shouldRefresh
            }));
        // Prevent default scrolling when pulling down
        if (pullDistance > 10) {
            e.preventDefault();
        }
    }, [
        disabled,
        state.isPulling,
        threshold
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (disabled || !state.isPulling) return;
        if (state.shouldRefresh && !state.isRefreshing) {
            setState((prev)=>({
                    ...prev,
                    isRefreshing: true,
                    pullDistance: threshold
                }));
            try {
                await onRefresh();
            } catch (error) {
                console.error('Pull to refresh failed:', error);
            } finally{
                // Reset after a short delay to show completion
                setTimeout(()=>{
                    resetState();
                }, 500);
            }
        } else {
            resetState();
        }
    }, [
        disabled,
        state.isPulling,
        state.shouldRefresh,
        state.isRefreshing,
        threshold,
        onRefresh,
        resetState
    ]);
    // Add touch and mouse event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const element = containerRef.current;
        if (!element || disabled) return;
        // Touch events
        element.addEventListener('touchstart', handleTouchStart, {
            passive: false
        });
        element.addEventListener('touchmove', handleTouchMove, {
            passive: false
        });
        element.addEventListener('touchend', handleTouchEnd);
        // Mouse events for desktop
        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseup', handleMouseUp);
        element.addEventListener('mouseleave', handleMouseUp);
        return ()=>{
            // Touch events
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
            // Mouse events
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseup', handleMouseUp);
            element.removeEventListener('mouseleave', handleMouseUp);
        };
    }, [
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        disabled
    ]);
    // Debounce pull distance updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = null;
        }
        debounceTimer.current = setTimeout(()=>{
        // Debounced updates can be handled here if needed
        }, debounceMs);
        return ()=>{
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [
        state.pullDistance,
        debounceMs
    ]);
    return {
        containerRef,
        ...state,
        resetState
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIndustryData",
    ()=>useIndustryData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabase.ts [app-ssr] (ecmascript)");
"use client";
;
;
function useIndustryData({ industry, dataType, businessId }) {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Map dataType to actual table names
    const tableNameMap = {
        transactions: 'transactions',
        expenses: 'expenses',
        credit: 'credit',
        inventory: 'inventory',
        targets: 'targets'
    };
    const tableName = tableNameMap[dataType];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchData = async ()=>{
            if (!businessId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                let query = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(tableName).select('*').eq('business_id', businessId);
                // Add ordering based on data type
                if (dataType === 'transactions') {
                    query = query.order('transaction_date', {
                        ascending: false
                    });
                } else if (dataType === 'expenses') {
                    query = query.order('expense_date', {
                        ascending: false
                    });
                } else if (dataType === 'credit') {
                    query = query.order('date_given', {
                        ascending: false
                    });
                } else {
                    query = query.order('created_at', {
                        ascending: false
                    });
                }
                const { data, error: dbError } = await query;
                if (dbError) {
                    console.error(`❌ Error fetching ${dataType}:`, dbError);
                    throw dbError;
                }
                setItems(data || []);
                console.log(`✅ Loaded ${data?.length || 0} ${dataType}`);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
                setError(errorMessage);
                console.error(`❌ Error fetching ${dataType}:`, err);
            } finally{
                setLoading(false);
            }
        };
        fetchData();
    }, [
        industry,
        dataType,
        businessId,
        tableName
    ]);
    const create = async (data)=>{
        if (!businessId) {
            throw new Error('Business ID required for creating items');
        }
        try {
            const newItem = {
                business_id: businessId,
                industry,
                created_at: new Date().toISOString(),
                ...data
            };
            const { data: result, error: dbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(tableName).insert([
                newItem
            ]).select().single();
            if (dbError) {
                console.error(`❌ Error creating ${dataType}:`, dbError);
                throw dbError;
            }
            setItems((prev)=>[
                    result,
                    ...prev
                ]);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
            setError(errorMessage);
            throw err;
        }
    };
    const update = async (id, data)=>{
        try {
            const updateData = {
                updated_at: new Date().toISOString(),
                ...data
            };
            const { data: result, error: dbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(tableName).update(updateData).eq('id', id).select().single();
            if (dbError) {
                console.error(`❌ Error updating ${dataType}:`, dbError);
                throw dbError;
            }
            setItems((prev)=>prev.map((item)=>item.id === id ? result : item));
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
            setError(errorMessage);
            throw err;
        }
    };
    const remove = async (id)=>{
        try {
            const { error: dbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(tableName).delete().eq('id', id);
            if (dbError) {
                console.error(`❌ Error deleting ${dataType}:`, dbError);
                throw dbError;
            }
            setItems((prev)=>prev.filter((item)=>item.id !== id));
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
            setError(errorMessage);
            throw err;
        }
    };
    return {
        items,
        loading,
        error,
        create,
        update,
        remove
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useNotifications.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNotifications",
    ()=>useNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabaseAdmin.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-ssr] (ecmascript)");
;
;
;
function useNotifications() {
    const { business } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchNotifications = async ()=>{
        if (!business?.id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').select('*').eq('business_id', business.id).order('created_at', {
                ascending: false
            });
            if (fetchError) throw fetchError;
            setNotifications(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
        } finally{
            setLoading(false);
        }
    };
    const markAsRead = async (notificationId)=>{
        try {
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').update({
                read: true
            }).eq('id', notificationId);
            if (updateError) throw updateError;
            setNotifications((prev)=>prev.map((notif)=>notif.id === notificationId ? {
                        ...notif,
                        read: true
                    } : notif));
        } catch (err) {
            console.error('Error marking notification as read:', err);
            throw err;
        }
    };
    const markAllAsRead = async ()=>{
        if (!business?.id) return;
        try {
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').update({
                read: true
            }).eq('business_id', business.id).eq('read', false);
            if (updateError) throw updateError;
            setNotifications((prev)=>prev.map((notif)=>({
                        ...notif,
                        read: true
                    })));
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            throw err;
        }
    };
    const deleteNotification = async (notificationId)=>{
        try {
            const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').delete().eq('id', notificationId);
            if (deleteError) throw deleteError;
            setNotifications((prev)=>prev.filter((notif)=>notif.id !== notificationId));
        } catch (err) {
            console.error('Error deleting notification:', err);
            throw err;
        }
    };
    const clearAll = async ()=>{
        if (!business?.id) return;
        try {
            const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').delete().eq('business_id', business.id);
            if (deleteError) throw deleteError;
            setNotifications([]);
        } catch (err) {
            console.error('Error clearing all notifications:', err);
            throw err;
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchNotifications();
    }, [
        business?.id
    ]);
    const unreadCount = notifications.filter((n)=>!n.read).length;
    return {
        notifications,
        loading,
        error,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        refresh: fetchNotifications
    };
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOffline",
    ()=>useOffline,
    "useTransactionsOld",
    ()=>useTransactionsOld
]);
// Export all hooks from a single index file
// Old hooks removed - replaced with TanStack Query versions
// Core hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useLanguageSafe$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useLanguageSafe.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-ssr] (ecmascript)");
// New TanStack Query hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTransactionsTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTransactionsTanStack.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useExpensesTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useExpensesTanStack.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useCreditTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useCreditTanStack.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useInventoryTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useInventoryTanStack.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTargetsTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTargetsTanStack.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBeehiveTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBeehiveTanStack.ts [app-ssr] (ecmascript)");
// Signup hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignup.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignupValidation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignupValidation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBusinessCreation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBusinessCreation.ts [app-ssr] (ecmascript)");
// Real-time hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useRealtime.ts [app-ssr] (ecmascript)");
// Utility hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useToast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTourTrigger$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTourTrigger.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$usePullToRefresh$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/usePullToRefresh.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useGlobalRefresh$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useGlobalRefresh.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-ssr] (ecmascript)"); // Alias for compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useNotifications.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const useOffline = ()=>({
        isOnline: true,
        isOffline: false
    });
const useTransactionsOld = ()=>({
        data: [],
        isLoading: false,
        error: null
    });
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-ssr] (ecmascript) <export useServicesTanStack as useServices>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useServices",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useServicesTanStack"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-ssr] (ecmascript)");
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-ssr] (ecmascript) <export useAppointmentsTanStack as useAppointments>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppointments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppointmentsTanStack"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-ssr] (ecmascript)");
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/transportAnalytics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
];

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_47ca5f61._.js.map