(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useLanguageSafe.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLanguageSafe",
    ()=>useLanguageSafe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-client] (ecmascript)");
;
const useLanguageSafe = ()=>{
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIndustryData",
    ()=>useIndustryData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabase.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const isClient = ("TURBOPACK compile-time value", "object") !== 'undefined';
    // localStorage persistence keys
    const storageKey = `beezee_${industry}_${country}_${dataType}`;
    // Load initial data from localStorage if available
    const getInitialData = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                console.log(`📦 Loaded ${parsed.length} ${dataType} from localStorage`);
                return parsed;
            }
        } catch (error) {
            console.warn(`Failed to load ${dataType} from localStorage:`, error);
        }
        return [];
    };
    // Save data to localStorage when it changes
    const saveToLocalStorage = (data)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
            console.log(`💾 Saved ${data.length} ${dataType} to localStorage`);
        } catch (error_0) {
            console.warn(`Failed to save ${dataType} to localStorage:`, error_0);
        }
    };
    // Query - reading data
    const { data: data_1, isLoading, isPaused: isQueryPaused, error: error_3, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            industry,
            country,
            dataType
        ],
        queryFn: {
            "useIndustryData.useQuery": async ()=>{
                // Check if Supabase is properly configured
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                try {
                    const { data: data_0, error: error_2 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from(dataType).select('*').eq('industry', industry).order('created_at', {
                        ascending: false
                    });
                    if (error_2) {
                        console.error(`Supabase error fetching ${dataType}:`, {
                            error: error_2,
                            details: error_2.details,
                            hint: error_2.hint,
                            code: error_2.code,
                            message: error_2.message,
                            industry
                        });
                        throw error_2;
                    }
                    console.log(`✅ Successfully fetched ${data_0?.length || 0} ${dataType}`);
                    // Save to localStorage for offline persistence
                    saveToLocalStorage(data_0 || []);
                    return data_0 || [];
                } catch (err) {
                    console.error(`Failed to fetch ${dataType}:`, {
                        error: err,
                        industry,
                        supabaseUrl: ("TURBOPACK compile-time truthy", 1) ? 'configured' : "TURBOPACK unreachable",
                        anonKey: ("TURBOPACK compile-time truthy", 1) ? 'configured' : "TURBOPACK unreachable"
                    });
                    throw err;
                }
            }
        }["useIndustryData.useQuery"],
        enabled: isClient && !!industry && !!country,
        initialData: getInitialData(),
        networkMode: 'offlineFirst',
        staleTime: 5 * 60 * 1000,
        gcTime: 7 * 24 * 60 * 60 * 1000,
        retry: 3
    });
    // Mutation - adding data (NO onError rollback!)
    const mutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            industry,
            country,
            dataType
        ],
        mutationFn: {
            "useIndustryData.useMutation[mutation]": async (newItem)=>{
                const { data: data_2, error: error_4 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from(dataType).insert({
                    ...newItem,
                    industry,
                    country,
                    created_at: new Date().toISOString()
                }).select().single();
                if (error_4) throw error_4;
                return data_2;
            }
        }["useIndustryData.useMutation[mutation]"],
        // Optimistic update - show item immediately
        onMutate: {
            "useIndustryData.useMutation[mutation]": async (newItem_0)=>{
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
                    ...newItem_0,
                    id: tempId,
                    created_at: new Date().toISOString(),
                    pendingSync: true // Visual indicator
                };
                queryClient.setQueryData([
                    industry,
                    country,
                    dataType
                ], {
                    "useIndustryData.useMutation[mutation]": (old = [])=>{
                        const newItems = [
                            optimisticItem,
                            ...old
                        ];
                        // Save optimistic data to localStorage
                        saveToLocalStorage(newItems);
                        return newItems;
                    }
                }["useIndustryData.useMutation[mutation]"]);
                return {
                    previousData,
                    optimisticItem,
                    tempId
                };
            }
        }["useIndustryData.useMutation[mutation]"],
        // ❌ REMOVED onError - Let TanStack Query handle failures and queue offline mutations
        // The mutation will automatically go into isPaused state and retry when online
        // ✅ Keep onSuccess - Replace temp ID with real data + cross-invalidate related queries
        onSuccess: {
            "useIndustryData.useMutation[mutation]": (result, variables, context)=>{
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
                    ], {
                        "useIndustryData.useMutation[mutation]": (old_0 = [])=>{
                            const items = old_0;
                            // Find and replace the optimistic item
                            const index = items.findIndex({
                                "useIndustryData.useMutation[mutation].index": (item)=>item.id === context.optimisticItem?.id
                            }["useIndustryData.useMutation[mutation].index"]);
                            if (index !== -1) {
                                const newItems_0 = [
                                    ...items
                                ];
                                newItems_0[index] = {
                                    ...result,
                                    pendingSync: false
                                };
                                // Save to localStorage
                                saveToLocalStorage(newItems_0);
                                return newItems_0;
                            }
                            // Fallback: just add the real item
                            const updatedItems = [
                                result,
                                ...items.filter({
                                    "useIndustryData.useMutation[mutation]": (i)=>!i.id?.toString().startsWith('temp_')
                                }["useIndustryData.useMutation[mutation]"])
                            ];
                            saveToLocalStorage(updatedItems);
                            return updatedItems;
                        }
                    }["useIndustryData.useMutation[mutation]"]);
                }
            }
        }["useIndustryData.useMutation[mutation]"],
        networkMode: 'offlineFirst',
        // ← This enables offline queue
        retry: 3
    });
    const deleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            industry,
            country,
            dataType,
            'delete'
        ],
        mutationFn: {
            "useIndustryData.useMutation[deleteMutation]": async (id)=>{
                const { error: error_5 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from(dataType).delete().eq('id', id);
                if (error_5) throw error_5;
                return {
                    success: true
                };
            }
        }["useIndustryData.useMutation[deleteMutation]"],
        onMutate: {
            "useIndustryData.useMutation[deleteMutation]": async (id_0)=>{
                await queryClient.cancelQueries({
                    queryKey: [
                        industry,
                        country,
                        dataType
                    ]
                });
                const previousData_0 = queryClient.getQueryData([
                    industry,
                    country,
                    dataType
                ]);
                queryClient.setQueryData([
                    industry,
                    country,
                    dataType
                ], {
                    "useIndustryData.useMutation[deleteMutation]": (old_1 = [])=>{
                        const newItems_1 = old_1.filter({
                            "useIndustryData.useMutation[deleteMutation].newItems_1": (item_0)=>item_0.id !== id_0
                        }["useIndustryData.useMutation[deleteMutation].newItems_1"]);
                        // Save to localStorage after optimistic delete
                        saveToLocalStorage(newItems_1);
                        return newItems_1;
                    }
                }["useIndustryData.useMutation[deleteMutation]"]);
                return {
                    previousData: previousData_0
                };
            }
        }["useIndustryData.useMutation[deleteMutation]"],
        // ❌ REMOVED onError - Let TanStack Query handle offline failures
        onSuccess: {
            "useIndustryData.useMutation[deleteMutation]": (id_1)=>{
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
            }
        }["useIndustryData.useMutation[deleteMutation]"],
        networkMode: 'offlineFirst',
        retry: 3
    });
    const updateMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationKey: [
            industry,
            country,
            dataType,
            'update'
        ],
        mutationFn: {
            "useIndustryData.useMutation[updateMutation]": async ({ id: id_2, updates })=>{
                const { data: data_3, error: error_6 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from(dataType).update(updates).eq('id', id_2).select().single();
                if (error_6) throw error_6;
                return data_3;
            }
        }["useIndustryData.useMutation[updateMutation]"],
        onMutate: {
            "useIndustryData.useMutation[updateMutation]": async ({ id: id_3, updates: updates_0 })=>{
                await queryClient.cancelQueries({
                    queryKey: [
                        industry,
                        country,
                        dataType
                    ]
                });
                const previousData_1 = queryClient.getQueryData([
                    industry,
                    country,
                    dataType
                ]);
                // Optimistic update
                queryClient.setQueryData([
                    industry,
                    country,
                    dataType
                ], {
                    "useIndustryData.useMutation[updateMutation]": (old_2 = [])=>{
                        const items_0 = old_2;
                        const index_0 = items_0.findIndex({
                            "useIndustryData.useMutation[updateMutation].index_0": (item_1)=>item_1.id === id_3
                        }["useIndustryData.useMutation[updateMutation].index_0"]);
                        if (index_0 !== -1) {
                            const newItems_2 = [
                                ...items_0
                            ];
                            newItems_2[index_0] = {
                                ...newItems_2[index_0],
                                ...updates_0,
                                updated_at: new Date().toISOString()
                            };
                            // Save optimistic update to localStorage
                            saveToLocalStorage(newItems_2);
                            return newItems_2;
                        }
                        return items_0;
                    }
                }["useIndustryData.useMutation[updateMutation]"]);
                return {
                    previousData: previousData_1
                };
            }
        }["useIndustryData.useMutation[updateMutation]"],
        onSuccess: {
            "useIndustryData.useMutation[updateMutation]": (result_0, variables_0, context_0)=>{
                // Detect operation type and invalidate related queries
                const operationType_0 = detectOperationType(variables_0.updates || variables_0, dataType);
                console.log(`🔄 ${dataType} update operation successful: ${operationType_0} - invalidating related queries`);
                console.log('🔍 Update variables:', variables_0);
                console.log('🔍 Detected operation type:', operationType_0);
                // Invalidate related queries for UI synchronization
                invalidateRelatedQueries(queryClient, industry, country, operationType_0);
                queryClient.setQueryData([
                    industry,
                    country,
                    dataType
                ], {
                    "useIndustryData.useMutation[updateMutation]": (old_3 = [])=>{
                        const items_1 = old_3;
                        const index_1 = items_1.findIndex({
                            "useIndustryData.useMutation[updateMutation].index_1": (item_2)=>item_2.id === variables_0.id
                        }["useIndustryData.useMutation[updateMutation].index_1"]);
                        if (index_1 !== -1) {
                            const newItems_3 = [
                                ...items_1
                            ];
                            newItems_3[index_1] = {
                                ...result_0,
                                updated_at: new Date().toISOString()
                            };
                            console.log(`✅ Updated ${dataType} item at index ${index_1}`);
                            // Save to localStorage
                            saveToLocalStorage(newItems_3);
                            return newItems_3;
                        }
                        return items_1;
                    }
                }["useIndustryData.useMutation[updateMutation]"]);
            }
        }["useIndustryData.useMutation[updateMutation]"],
        networkMode: 'offlineFirst',
        retry: 3
    });
    return {
        data: data_1 || [],
        isLoading,
        error: error_3,
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
_s(useIndustryData, "2uZCtpXH/0+/8WvQC3cfbFd9wZE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTransactionsTanStack.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTransactionsTanStack",
    ()=>useTransactionsTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useTransactionsTanStack(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(34);
    if ($[0] !== "5e8d691b5806f8ed69af97610dbadde963f49e88bb16429bfe01444bada9a980") {
        for(let $i = 0; $i < 34; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5e8d691b5806f8ed69af97610dbadde963f49e88bb16429bfe01444bada9a980";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const industry = options.industry || "retail";
    const country = options.country || "ke";
    const { data, isLoading, addItem, deleteItem, isAdding, isDeleting, isPaused, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, "transactions");
    let t2;
    if ($[3] !== data) {
        t2 = data || [];
        $[3] = data;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let filteredData = t2;
    if (options.category) {
        let t3;
        if ($[5] !== filteredData || $[6] !== options.category) {
            let t4;
            if ($[8] !== options.category) {
                t4 = ({
                    "useTransactionsTanStack[filteredData.filter()]": (t)=>t.category === options.category
                })["useTransactionsTanStack[filteredData.filter()]"];
                $[8] = options.category;
                $[9] = t4;
            } else {
                t4 = $[9];
            }
            t3 = filteredData.filter(t4);
            $[5] = filteredData;
            $[6] = options.category;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        filteredData = t3;
    }
    if (options.paymentMethod) {
        let t3;
        if ($[10] !== filteredData || $[11] !== options.paymentMethod) {
            let t4;
            if ($[13] !== options.paymentMethod) {
                t4 = ({
                    "useTransactionsTanStack[filteredData.filter()]": (t_0)=>t_0.payment_method === options.paymentMethod
                })["useTransactionsTanStack[filteredData.filter()]"];
                $[13] = options.paymentMethod;
                $[14] = t4;
            } else {
                t4 = $[14];
            }
            t3 = filteredData.filter(t4);
            $[10] = filteredData;
            $[11] = options.paymentMethod;
            $[12] = t3;
        } else {
            t3 = $[12];
        }
        filteredData = t3;
    }
    if (options.startDate) {
        let t3;
        if ($[15] !== filteredData || $[16] !== options.startDate) {
            let t4;
            if ($[18] !== options.startDate) {
                t4 = ({
                    "useTransactionsTanStack[filteredData.filter()]": (t_1)=>new Date(t_1.transaction_date) >= new Date(options.startDate)
                })["useTransactionsTanStack[filteredData.filter()]"];
                $[18] = options.startDate;
                $[19] = t4;
            } else {
                t4 = $[19];
            }
            t3 = filteredData.filter(t4);
            $[15] = filteredData;
            $[16] = options.startDate;
            $[17] = t3;
        } else {
            t3 = $[17];
        }
        filteredData = t3;
    }
    if (options.endDate) {
        let t3;
        if ($[20] !== filteredData || $[21] !== options.endDate) {
            let t4;
            if ($[23] !== options.endDate) {
                t4 = ({
                    "useTransactionsTanStack[filteredData.filter()]": (t_2)=>new Date(t_2.transaction_date) <= new Date(options.endDate)
                })["useTransactionsTanStack[filteredData.filter()]"];
                $[23] = options.endDate;
                $[24] = t4;
            } else {
                t4 = $[24];
            }
            t3 = filteredData.filter(t4);
            $[20] = filteredData;
            $[21] = options.endDate;
            $[22] = t3;
        } else {
            t3 = $[22];
        }
        filteredData = t3;
    }
    const t3 = filteredData;
    const t4 = isAdding || isDeleting;
    let t5;
    if ($[25] !== addItem || $[26] !== deleteItem || $[27] !== error || $[28] !== isLoading || $[29] !== isPaused || $[30] !== refetch || $[31] !== t3 || $[32] !== t4) {
        t5 = {
            data: t3,
            isLoading,
            isPaused,
            addTransaction: addItem,
            deleteTransaction: deleteItem,
            isAdding: t4,
            error,
            refetch
        };
        $[25] = addItem;
        $[26] = deleteItem;
        $[27] = error;
        $[28] = isLoading;
        $[29] = isPaused;
        $[30] = refetch;
        $[31] = t3;
        $[32] = t4;
        $[33] = t5;
    } else {
        t5 = $[33];
    }
    return t5;
}
_s(useTransactionsTanStack, "uRAm+CCzPYI6x3YRdnJ1uJemqu4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useExpensesTanStack.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useExpensesTanStack",
    ()=>useExpensesTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useExpensesTanStack(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(42);
    if ($[0] !== "fedb558b1711164703beba4297415fd63db0959d60ffe2cfc5a20b8b17f2f19f") {
        for(let $i = 0; $i < 42; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "fedb558b1711164703beba4297415fd63db0959d60ffe2cfc5a20b8b17f2f19f";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const industry = options.industry || "retail";
    const country = options.country || "ke";
    const { data, isLoading, addItem, deleteItem, isAdding, isPaused } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, "expenses");
    let t2;
    if ($[3] !== data) {
        t2 = data || [];
        $[3] = data;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let filteredData = t2;
    if (options.category) {
        let t3;
        if ($[5] !== filteredData || $[6] !== options.category) {
            let t4;
            if ($[8] !== options.category) {
                t4 = ({
                    "useExpensesTanStack[filteredData.filter()]": (e)=>e.category === options.category
                })["useExpensesTanStack[filteredData.filter()]"];
                $[8] = options.category;
                $[9] = t4;
            } else {
                t4 = $[9];
            }
            t3 = filteredData.filter(t4);
            $[5] = filteredData;
            $[6] = options.category;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        filteredData = t3;
    }
    if (options.vendorName) {
        let t3;
        if ($[10] !== filteredData || $[11] !== options.vendorName) {
            let t4;
            if ($[13] !== options.vendorName) {
                t4 = ({
                    "useExpensesTanStack[filteredData.filter()]": (e_0)=>e_0.supplier?.toLowerCase().includes(options.vendorName.toLowerCase())
                })["useExpensesTanStack[filteredData.filter()]"];
                $[13] = options.vendorName;
                $[14] = t4;
            } else {
                t4 = $[14];
            }
            t3 = filteredData.filter(t4);
            $[10] = filteredData;
            $[11] = options.vendorName;
            $[12] = t3;
        } else {
            t3 = $[12];
        }
        filteredData = t3;
    }
    if (options.paymentMethod) {
        let t3;
        if ($[15] !== filteredData || $[16] !== options.paymentMethod) {
            let t4;
            if ($[18] !== options.paymentMethod) {
                t4 = ({
                    "useExpensesTanStack[filteredData.filter()]": (e_1)=>e_1.payment_method === options.paymentMethod
                })["useExpensesTanStack[filteredData.filter()]"];
                $[18] = options.paymentMethod;
                $[19] = t4;
            } else {
                t4 = $[19];
            }
            t3 = filteredData.filter(t4);
            $[15] = filteredData;
            $[16] = options.paymentMethod;
            $[17] = t3;
        } else {
            t3 = $[17];
        }
        filteredData = t3;
    }
    if (options.isRecurring !== undefined) {
        let t3;
        if ($[20] !== filteredData || $[21] !== options.isRecurring) {
            let t4;
            if ($[23] !== options.isRecurring) {
                t4 = ({
                    "useExpensesTanStack[filteredData.filter()]": (e_2)=>e_2.is_recurring === options.isRecurring
                })["useExpensesTanStack[filteredData.filter()]"];
                $[23] = options.isRecurring;
                $[24] = t4;
            } else {
                t4 = $[24];
            }
            t3 = filteredData.filter(t4);
            $[20] = filteredData;
            $[21] = options.isRecurring;
            $[22] = t3;
        } else {
            t3 = $[22];
        }
        filteredData = t3;
    }
    if (options.startDate) {
        let t3;
        if ($[25] !== filteredData || $[26] !== options.startDate) {
            let t4;
            if ($[28] !== options.startDate) {
                t4 = ({
                    "useExpensesTanStack[filteredData.filter()]": (e_3)=>new Date(e_3.expense_date) >= new Date(options.startDate)
                })["useExpensesTanStack[filteredData.filter()]"];
                $[28] = options.startDate;
                $[29] = t4;
            } else {
                t4 = $[29];
            }
            t3 = filteredData.filter(t4);
            $[25] = filteredData;
            $[26] = options.startDate;
            $[27] = t3;
        } else {
            t3 = $[27];
        }
        filteredData = t3;
    }
    if (options.endDate) {
        let t3;
        if ($[30] !== filteredData || $[31] !== options.endDate) {
            let t4;
            if ($[33] !== options.endDate) {
                t4 = ({
                    "useExpensesTanStack[filteredData.filter()]": (e_4)=>new Date(e_4.expense_date) <= new Date(options.endDate)
                })["useExpensesTanStack[filteredData.filter()]"];
                $[33] = options.endDate;
                $[34] = t4;
            } else {
                t4 = $[34];
            }
            t3 = filteredData.filter(t4);
            $[30] = filteredData;
            $[31] = options.endDate;
            $[32] = t3;
        } else {
            t3 = $[32];
        }
        filteredData = t3;
    }
    const t3 = filteredData;
    let t4;
    if ($[35] !== addItem || $[36] !== deleteItem || $[37] !== isAdding || $[38] !== isLoading || $[39] !== isPaused || $[40] !== t3) {
        t4 = {
            data: t3,
            isLoading,
            isOffline: isPaused,
            addExpense: addItem,
            deleteExpense: deleteItem,
            isPending: isAdding,
            error: null,
            refetch: _temp
        };
        $[35] = addItem;
        $[36] = deleteItem;
        $[37] = isAdding;
        $[38] = isLoading;
        $[39] = isPaused;
        $[40] = t3;
        $[41] = t4;
    } else {
        t4 = $[41];
    }
    return t4;
}
_s(useExpensesTanStack, "YmGBHjKTD9KN+Ma/9IAg3hV5wg8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"]
    ];
});
function _temp() {}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useCreditTanStack.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreditTanStack",
    ()=>useCreditTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useCreditTanStack(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(39);
    if ($[0] !== "963a3ffc92a1478ad39bd624aaaa1b1308ab22aca3da4e8b6cfcb73835a14927") {
        for(let $i = 0; $i < 39; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "963a3ffc92a1478ad39bd624aaaa1b1308ab22aca3da4e8b6cfcb73835a14927";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const industry = options.industry || "retail";
    const country = options.country || "ke";
    const { data, isLoading, addItem, deleteItem, updateItem, isAdding, isPaused, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, "credit");
    let t2;
    if ($[3] !== data) {
        t2 = data || [];
        $[3] = data;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let filteredData = t2;
    if (options.status) {
        let t3;
        if ($[5] !== filteredData || $[6] !== options.status) {
            let t4;
            if ($[8] !== options.status) {
                t4 = ({
                    "useCreditTanStack[filteredData.filter()]": (c)=>c.status === options.status
                })["useCreditTanStack[filteredData.filter()]"];
                $[8] = options.status;
                $[9] = t4;
            } else {
                t4 = $[9];
            }
            t3 = filteredData.filter(t4);
            $[5] = filteredData;
            $[6] = options.status;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        filteredData = t3;
    }
    if (options.customerName) {
        let t3;
        if ($[10] !== filteredData || $[11] !== options.customerName) {
            let t4;
            if ($[13] !== options.customerName) {
                t4 = ({
                    "useCreditTanStack[filteredData.filter()]": (c_0)=>c_0.customer_name?.toLowerCase().includes(options.customerName.toLowerCase())
                })["useCreditTanStack[filteredData.filter()]"];
                $[13] = options.customerName;
                $[14] = t4;
            } else {
                t4 = $[14];
            }
            t3 = filteredData.filter(t4);
            $[10] = filteredData;
            $[11] = options.customerName;
            $[12] = t3;
        } else {
            t3 = $[12];
        }
        filteredData = t3;
    }
    if (options.customerPhone) {
        let t3;
        if ($[15] !== filteredData || $[16] !== options.customerPhone) {
            let t4;
            if ($[18] !== options.customerPhone) {
                t4 = ({
                    "useCreditTanStack[filteredData.filter()]": (c_1)=>c_1.customer_phone === options.customerPhone
                })["useCreditTanStack[filteredData.filter()]"];
                $[18] = options.customerPhone;
                $[19] = t4;
            } else {
                t4 = $[19];
            }
            t3 = filteredData.filter(t4);
            $[15] = filteredData;
            $[16] = options.customerPhone;
            $[17] = t3;
        } else {
            t3 = $[17];
        }
        filteredData = t3;
    }
    if (options.startDate) {
        let t3;
        if ($[20] !== filteredData || $[21] !== options.startDate) {
            let t4;
            if ($[23] !== options.startDate) {
                t4 = ({
                    "useCreditTanStack[filteredData.filter()]": (c_2)=>new Date(c_2.due_date) >= new Date(options.startDate)
                })["useCreditTanStack[filteredData.filter()]"];
                $[23] = options.startDate;
                $[24] = t4;
            } else {
                t4 = $[24];
            }
            t3 = filteredData.filter(t4);
            $[20] = filteredData;
            $[21] = options.startDate;
            $[22] = t3;
        } else {
            t3 = $[22];
        }
        filteredData = t3;
    }
    if (options.endDate) {
        let t3;
        if ($[25] !== filteredData || $[26] !== options.endDate) {
            let t4;
            if ($[28] !== options.endDate) {
                t4 = ({
                    "useCreditTanStack[filteredData.filter()]": (c_3)=>new Date(c_3.due_date) <= new Date(options.endDate)
                })["useCreditTanStack[filteredData.filter()]"];
                $[28] = options.endDate;
                $[29] = t4;
            } else {
                t4 = $[29];
            }
            t3 = filteredData.filter(t4);
            $[25] = filteredData;
            $[26] = options.endDate;
            $[27] = t3;
        } else {
            t3 = $[27];
        }
        filteredData = t3;
    }
    const t3 = filteredData;
    let t4;
    if ($[30] !== addItem || $[31] !== deleteItem || $[32] !== isAdding || $[33] !== isLoading || $[34] !== isPaused || $[35] !== refetch || $[36] !== t3 || $[37] !== updateItem) {
        t4 = {
            data: t3,
            isLoading,
            isOffline: isPaused,
            addCredit: addItem,
            deleteCredit: deleteItem,
            updateCredit: updateItem,
            isPending: isAdding,
            error: null,
            refetch
        };
        $[30] = addItem;
        $[31] = deleteItem;
        $[32] = isAdding;
        $[33] = isLoading;
        $[34] = isPaused;
        $[35] = refetch;
        $[36] = t3;
        $[37] = updateItem;
        $[38] = t4;
    } else {
        t4 = $[38];
    }
    return t4;
}
_s(useCreditTanStack, "VTq4JXMTUHociQym/+60+9BNwQU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useInventoryTanStack.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInventoryTanStack",
    ()=>useInventoryTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useInventoryTanStack(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(28);
    if ($[0] !== "7e69d0e5224cf4d109a27f3d48ff5ef40a21a6203475670d16a58b3523d9060b") {
        for(let $i = 0; $i < 28; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7e69d0e5224cf4d109a27f3d48ff5ef40a21a6203475670d16a58b3523d9060b";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const industry = options.industry || "retail";
    const country = options.country || "ke";
    const { data, isLoading, addItem, deleteItem, updateItem, isAdding, isPaused, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, "inventory");
    let t2;
    if ($[3] !== data) {
        t2 = data || [];
        $[3] = data;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let filteredData = t2;
    if (options.category) {
        let t3;
        if ($[5] !== filteredData || $[6] !== options.category) {
            let t4;
            if ($[8] !== options.category) {
                t4 = ({
                    "useInventoryTanStack[filteredData.filter()]": (i)=>i.category === options.category
                })["useInventoryTanStack[filteredData.filter()]"];
                $[8] = options.category;
                $[9] = t4;
            } else {
                t4 = $[9];
            }
            t3 = filteredData.filter(t4);
            $[5] = filteredData;
            $[6] = options.category;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        filteredData = t3;
    }
    if (options.supplierName) {
        let t3;
        if ($[10] !== filteredData || $[11] !== options.supplierName) {
            let t4;
            if ($[13] !== options.supplierName) {
                t4 = ({
                    "useInventoryTanStack[filteredData.filter()]": (i_0)=>i_0.supplier_name?.toLowerCase().includes(options.supplierName.toLowerCase())
                })["useInventoryTanStack[filteredData.filter()]"];
                $[13] = options.supplierName;
                $[14] = t4;
            } else {
                t4 = $[14];
            }
            t3 = filteredData.filter(t4);
            $[10] = filteredData;
            $[11] = options.supplierName;
            $[12] = t3;
        } else {
            t3 = $[12];
        }
        filteredData = t3;
    }
    if (options.lowStock) {
        let t3;
        if ($[15] !== filteredData) {
            t3 = filteredData.filter(_useInventoryTanStackFilteredDataFilter);
            $[15] = filteredData;
            $[16] = t3;
        } else {
            t3 = $[16];
        }
        filteredData = t3;
    }
    if (options.outOfStock) {
        let t3;
        if ($[17] !== filteredData) {
            t3 = filteredData.filter(_useInventoryTanStackFilteredDataFilter2);
            $[17] = filteredData;
            $[18] = t3;
        } else {
            t3 = $[18];
        }
        filteredData = t3;
    }
    const t3 = filteredData;
    let t4;
    if ($[19] !== addItem || $[20] !== deleteItem || $[21] !== isAdding || $[22] !== isLoading || $[23] !== isPaused || $[24] !== refetch || $[25] !== t3 || $[26] !== updateItem) {
        t4 = {
            data: t3,
            isLoading,
            isOffline: isPaused,
            addInventory: addItem,
            deleteInventory: deleteItem,
            updateInventory: updateItem,
            isPending: isAdding,
            error: null,
            refetch
        };
        $[19] = addItem;
        $[20] = deleteItem;
        $[21] = isAdding;
        $[22] = isLoading;
        $[23] = isPaused;
        $[24] = refetch;
        $[25] = t3;
        $[26] = updateItem;
        $[27] = t4;
    } else {
        t4 = $[27];
    }
    return t4;
}
_s(useInventoryTanStack, "VTq4JXMTUHociQym/+60+9BNwQU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"]
    ];
});
function _useInventoryTanStackFilteredDataFilter2(i_2) {
    return i_2.quantity === 0;
}
function _useInventoryTanStackFilteredDataFilter(i_1) {
    return i_1.quantity <= i_1.threshold;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useServicesTanStack",
    ()=>useServicesTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useServicesTanStack(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(28);
    if ($[0] !== "750c445f75d5bdf5c8b58e7946974501d4ade259a77d0e43af0545f977503922") {
        for(let $i = 0; $i < 28; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "750c445f75d5bdf5c8b58e7946974501d4ade259a77d0e43af0545f977503922";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const industry = options.industry || "retail";
    const country = options.country || "ke";
    const { data, isLoading, addItem, deleteItem, updateItem, isAdding, isPaused } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, "services");
    let t2;
    if ($[3] !== data) {
        t2 = data || [];
        $[3] = data;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let filteredData = t2;
    if (options.category) {
        let t3;
        if ($[5] !== filteredData || $[6] !== options.category) {
            let t4;
            if ($[8] !== options.category) {
                t4 = ({
                    "useServicesTanStack[filteredData.filter()]": (s)=>s.category === options.category
                })["useServicesTanStack[filteredData.filter()]"];
                $[8] = options.category;
                $[9] = t4;
            } else {
                t4 = $[9];
            }
            t3 = filteredData.filter(t4);
            $[5] = filteredData;
            $[6] = options.category;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        filteredData = t3;
    }
    if (options.isActive !== undefined) {
        let t3;
        if ($[10] !== filteredData || $[11] !== options.isActive) {
            let t4;
            if ($[13] !== options.isActive) {
                t4 = ({
                    "useServicesTanStack[filteredData.filter()]": (s_0)=>s_0.is_active === options.isActive
                })["useServicesTanStack[filteredData.filter()]"];
                $[13] = options.isActive;
                $[14] = t4;
            } else {
                t4 = $[14];
            }
            t3 = filteredData.filter(t4);
            $[10] = filteredData;
            $[11] = options.isActive;
            $[12] = t3;
        } else {
            t3 = $[12];
        }
        filteredData = t3;
    }
    if (options.requiresAppointment !== undefined) {
        let t3;
        if ($[15] !== filteredData || $[16] !== options.requiresAppointment) {
            let t4;
            if ($[18] !== options.requiresAppointment) {
                t4 = ({
                    "useServicesTanStack[filteredData.filter()]": (s_1)=>s_1.requires_appointment === options.requiresAppointment
                })["useServicesTanStack[filteredData.filter()]"];
                $[18] = options.requiresAppointment;
                $[19] = t4;
            } else {
                t4 = $[19];
            }
            t3 = filteredData.filter(t4);
            $[15] = filteredData;
            $[16] = options.requiresAppointment;
            $[17] = t3;
        } else {
            t3 = $[17];
        }
        filteredData = t3;
    }
    const t3 = filteredData;
    let t4;
    if ($[20] !== addItem || $[21] !== deleteItem || $[22] !== isAdding || $[23] !== isLoading || $[24] !== isPaused || $[25] !== t3 || $[26] !== updateItem) {
        t4 = {
            data: t3,
            isLoading,
            isOffline: isPaused,
            addService: addItem,
            deleteService: deleteItem,
            updateService: updateItem,
            isPending: isAdding,
            error: null,
            refetch: _temp
        };
        $[20] = addItem;
        $[21] = deleteItem;
        $[22] = isAdding;
        $[23] = isLoading;
        $[24] = isPaused;
        $[25] = t3;
        $[26] = updateItem;
        $[27] = t4;
    } else {
        t4 = $[27];
    }
    return t4;
}
_s(useServicesTanStack, "jGl8MomS6Tf35yKbDkExVwTVkAw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"]
    ];
});
function _temp() {}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppointmentsTanStack",
    ()=>useAppointmentsTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useAppointmentsTanStack(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(43);
    if ($[0] !== "5655c5f083d44e4e708c4f6e643372d9d25ed4742f74f1c2e49ec17e153f7f40") {
        for(let $i = 0; $i < 43; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5655c5f083d44e4e708c4f6e643372d9d25ed4742f74f1c2e49ec17e153f7f40";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const industry = options.industry || "retail";
    const country = options.country || "ke";
    const { data, isLoading, addItem, deleteItem, updateItem, isAdding, isPaused } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, "appointments");
    let t2;
    if ($[3] !== data) {
        t2 = data || [];
        $[3] = data;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let filteredData = t2;
    if (options.status) {
        let t3;
        if ($[5] !== filteredData || $[6] !== options.status) {
            let t4;
            if ($[8] !== options.status) {
                t4 = ({
                    "useAppointmentsTanStack[filteredData.filter()]": (a)=>a.status === options.status
                })["useAppointmentsTanStack[filteredData.filter()]"];
                $[8] = options.status;
                $[9] = t4;
            } else {
                t4 = $[9];
            }
            t3 = filteredData.filter(t4);
            $[5] = filteredData;
            $[6] = options.status;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        filteredData = t3;
    }
    if (options.customerName) {
        let t3;
        if ($[10] !== filteredData || $[11] !== options.customerName) {
            let t4;
            if ($[13] !== options.customerName) {
                t4 = ({
                    "useAppointmentsTanStack[filteredData.filter()]": (a_0)=>a_0.customer_name?.toLowerCase().includes(options.customerName.toLowerCase())
                })["useAppointmentsTanStack[filteredData.filter()]"];
                $[13] = options.customerName;
                $[14] = t4;
            } else {
                t4 = $[14];
            }
            t3 = filteredData.filter(t4);
            $[10] = filteredData;
            $[11] = options.customerName;
            $[12] = t3;
        } else {
            t3 = $[12];
        }
        filteredData = t3;
    }
    if (options.customerPhone) {
        let t3;
        if ($[15] !== filteredData || $[16] !== options.customerPhone) {
            let t4;
            if ($[18] !== options.customerPhone) {
                t4 = ({
                    "useAppointmentsTanStack[filteredData.filter()]": (a_1)=>a_1.customer_contact === options.customerPhone
                })["useAppointmentsTanStack[filteredData.filter()]"];
                $[18] = options.customerPhone;
                $[19] = t4;
            } else {
                t4 = $[19];
            }
            t3 = filteredData.filter(t4);
            $[15] = filteredData;
            $[16] = options.customerPhone;
            $[17] = t3;
        } else {
            t3 = $[17];
        }
        filteredData = t3;
    }
    if (options.serviceType) {
        let t3;
        if ($[20] !== filteredData || $[21] !== options.serviceType) {
            let t4;
            if ($[23] !== options.serviceType) {
                t4 = ({
                    "useAppointmentsTanStack[filteredData.filter()]": (a_2)=>a_2.service_name === options.serviceType
                })["useAppointmentsTanStack[filteredData.filter()]"];
                $[23] = options.serviceType;
                $[24] = t4;
            } else {
                t4 = $[24];
            }
            t3 = filteredData.filter(t4);
            $[20] = filteredData;
            $[21] = options.serviceType;
            $[22] = t3;
        } else {
            t3 = $[22];
        }
        filteredData = t3;
    }
    if (options.startDate) {
        let t3;
        if ($[25] !== filteredData || $[26] !== options.startDate) {
            let t4;
            if ($[28] !== options.startDate) {
                t4 = ({
                    "useAppointmentsTanStack[filteredData.filter()]": (a_3)=>new Date(a_3.appointment_date) >= new Date(options.startDate)
                })["useAppointmentsTanStack[filteredData.filter()]"];
                $[28] = options.startDate;
                $[29] = t4;
            } else {
                t4 = $[29];
            }
            t3 = filteredData.filter(t4);
            $[25] = filteredData;
            $[26] = options.startDate;
            $[27] = t3;
        } else {
            t3 = $[27];
        }
        filteredData = t3;
    }
    if (options.endDate) {
        let t3;
        if ($[30] !== filteredData || $[31] !== options.endDate) {
            let t4;
            if ($[33] !== options.endDate) {
                t4 = ({
                    "useAppointmentsTanStack[filteredData.filter()]": (a_4)=>new Date(a_4.appointment_date) <= new Date(options.endDate)
                })["useAppointmentsTanStack[filteredData.filter()]"];
                $[33] = options.endDate;
                $[34] = t4;
            } else {
                t4 = $[34];
            }
            t3 = filteredData.filter(t4);
            $[30] = filteredData;
            $[31] = options.endDate;
            $[32] = t3;
        } else {
            t3 = $[32];
        }
        filteredData = t3;
    }
    const t3 = filteredData;
    let t4;
    if ($[35] !== addItem || $[36] !== deleteItem || $[37] !== isAdding || $[38] !== isLoading || $[39] !== isPaused || $[40] !== t3 || $[41] !== updateItem) {
        t4 = {
            data: t3,
            isLoading,
            isOffline: isPaused,
            addAppointment: addItem,
            deleteAppointment: deleteItem,
            updateAppointment: updateItem,
            isPending: isAdding,
            error: null,
            refetch: _temp
        };
        $[35] = addItem;
        $[36] = deleteItem;
        $[37] = isAdding;
        $[38] = isLoading;
        $[39] = isPaused;
        $[40] = t3;
        $[41] = updateItem;
        $[42] = t4;
    } else {
        t4 = $[42];
    }
    return t4;
}
_s(useAppointmentsTanStack, "jGl8MomS6Tf35yKbDkExVwTVkAw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"]
    ];
});
function _temp() {}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTargetsTanStack.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTargetsTanStack",
    ()=>useTargetsTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useTargetsTanStack(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(37);
    if ($[0] !== "2a0c03692dbac54c17d9e3e85aaf1761c0c72d8a509507b8650f3b29897ddb6b") {
        for(let $i = 0; $i < 37; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2a0c03692dbac54c17d9e3e85aaf1761c0c72d8a509507b8650f3b29897ddb6b";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const industry = options.industry || "retail";
    const country = options.country || "ke";
    const { data, isLoading, addItem, deleteItem, isAdding, isPaused } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, "targets");
    let t2;
    if ($[3] !== data) {
        t2 = data || [];
        $[3] = data;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let filteredData = t2;
    if (options.targetType) {
        let t3;
        if ($[5] !== filteredData || $[6] !== options.targetType) {
            let t4;
            if ($[8] !== options.targetType) {
                t4 = ({
                    "useTargetsTanStack[filteredData.filter()]": (t)=>t.target_type === options.targetType
                })["useTargetsTanStack[filteredData.filter()]"];
                $[8] = options.targetType;
                $[9] = t4;
            } else {
                t4 = $[9];
            }
            t3 = filteredData.filter(t4);
            $[5] = filteredData;
            $[6] = options.targetType;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        filteredData = t3;
    }
    if (options.status) {
        let t3;
        if ($[10] !== filteredData || $[11] !== options.status) {
            let t4;
            if ($[13] !== options.status) {
                t4 = ({
                    "useTargetsTanStack[filteredData.filter()]": (t_0)=>t_0.status === options.status
                })["useTargetsTanStack[filteredData.filter()]"];
                $[13] = options.status;
                $[14] = t4;
            } else {
                t4 = $[14];
            }
            t3 = filteredData.filter(t4);
            $[10] = filteredData;
            $[11] = options.status;
            $[12] = t3;
        } else {
            t3 = $[12];
        }
        filteredData = t3;
    }
    if (options.period) {
        let t3;
        if ($[15] !== filteredData || $[16] !== options.period) {
            let t4;
            if ($[18] !== options.period) {
                t4 = ({
                    "useTargetsTanStack[filteredData.filter()]": (t_1)=>t_1.period === options.period
                })["useTargetsTanStack[filteredData.filter()]"];
                $[18] = options.period;
                $[19] = t4;
            } else {
                t4 = $[19];
            }
            t3 = filteredData.filter(t4);
            $[15] = filteredData;
            $[16] = options.period;
            $[17] = t3;
        } else {
            t3 = $[17];
        }
        filteredData = t3;
    }
    if (options.startDate) {
        let t3;
        if ($[20] !== filteredData || $[21] !== options.startDate) {
            let t4;
            if ($[23] !== options.startDate) {
                t4 = ({
                    "useTargetsTanStack[filteredData.filter()]": (t_2)=>new Date(t_2.start_date) >= new Date(options.startDate)
                })["useTargetsTanStack[filteredData.filter()]"];
                $[23] = options.startDate;
                $[24] = t4;
            } else {
                t4 = $[24];
            }
            t3 = filteredData.filter(t4);
            $[20] = filteredData;
            $[21] = options.startDate;
            $[22] = t3;
        } else {
            t3 = $[22];
        }
        filteredData = t3;
    }
    if (options.endDate) {
        let t3;
        if ($[25] !== filteredData || $[26] !== options.endDate) {
            let t4;
            if ($[28] !== options.endDate) {
                t4 = ({
                    "useTargetsTanStack[filteredData.filter()]": (t_3)=>new Date(t_3.end_date) <= new Date(options.endDate)
                })["useTargetsTanStack[filteredData.filter()]"];
                $[28] = options.endDate;
                $[29] = t4;
            } else {
                t4 = $[29];
            }
            t3 = filteredData.filter(t4);
            $[25] = filteredData;
            $[26] = options.endDate;
            $[27] = t3;
        } else {
            t3 = $[27];
        }
        filteredData = t3;
    }
    const t3 = filteredData;
    let t4;
    if ($[30] !== addItem || $[31] !== deleteItem || $[32] !== isAdding || $[33] !== isLoading || $[34] !== isPaused || $[35] !== t3) {
        t4 = {
            data: t3,
            isLoading,
            isOffline: isPaused,
            addTarget: addItem,
            deleteTarget: deleteItem,
            isPending: isAdding,
            error: null,
            refetch: _temp
        };
        $[30] = addItem;
        $[31] = deleteItem;
        $[32] = isAdding;
        $[33] = isLoading;
        $[34] = isPaused;
        $[35] = t3;
        $[36] = t4;
    } else {
        t4 = $[36];
    }
    return t4;
}
_s(useTargetsTanStack, "YmGBHjKTD9KN+Ma/9IAg3hV5wg8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"]
    ];
});
function _temp() {}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBeehiveTanStack.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBeehiveTanStack",
    ()=>useBeehiveTanStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useBeehiveTanStack(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(34);
    if ($[0] !== "5af02f42511568f3386ec58ab71ab6bd9ae82fe125be3ee3c9c9651e9067bb23") {
        for(let $i = 0; $i < 34; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5af02f42511568f3386ec58ab71ab6bd9ae82fe125be3ee3c9c9651e9067bb23";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const industry = options.industry || "retail";
    const country = options.country || "ke";
    const { data, isLoading, addItem, deleteItem, isAdding, isDeleting, isPaused, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"])(industry, country, "beehive");
    let t2;
    if ($[3] !== data) {
        t2 = data || [];
        $[3] = data;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    let filteredData = t2;
    if (options.status) {
        let t3;
        if ($[5] !== filteredData || $[6] !== options.status) {
            let t4;
            if ($[8] !== options.status) {
                t4 = ({
                    "useBeehiveTanStack[filteredData.filter()]": (b)=>b.status === options.status
                })["useBeehiveTanStack[filteredData.filter()]"];
                $[8] = options.status;
                $[9] = t4;
            } else {
                t4 = $[9];
            }
            t3 = filteredData.filter(t4);
            $[5] = filteredData;
            $[6] = options.status;
            $[7] = t3;
        } else {
            t3 = $[7];
        }
        filteredData = t3;
    }
    if (options.category) {
        let t3;
        if ($[10] !== filteredData || $[11] !== options.category) {
            let t4;
            if ($[13] !== options.category) {
                t4 = ({
                    "useBeehiveTanStack[filteredData.filter()]": (b_0)=>b_0.category === options.category
                })["useBeehiveTanStack[filteredData.filter()]"];
                $[13] = options.category;
                $[14] = t4;
            } else {
                t4 = $[14];
            }
            t3 = filteredData.filter(t4);
            $[10] = filteredData;
            $[11] = options.category;
            $[12] = t3;
        } else {
            t3 = $[12];
        }
        filteredData = t3;
    }
    if (options.isFeatured !== undefined) {
        let t3;
        if ($[15] !== filteredData || $[16] !== options.isFeatured) {
            let t4;
            if ($[18] !== options.isFeatured) {
                t4 = ({
                    "useBeehiveTanStack[filteredData.filter()]": (b_1)=>b_1.is_featured === options.isFeatured
                })["useBeehiveTanStack[filteredData.filter()]"];
                $[18] = options.isFeatured;
                $[19] = t4;
            } else {
                t4 = $[19];
            }
            t3 = filteredData.filter(t4);
            $[15] = filteredData;
            $[16] = options.isFeatured;
            $[17] = t3;
        } else {
            t3 = $[17];
        }
        filteredData = t3;
    }
    if (options.priority) {
        let t3;
        if ($[20] !== filteredData || $[21] !== options.priority) {
            let t4;
            if ($[23] !== options.priority) {
                t4 = ({
                    "useBeehiveTanStack[filteredData.filter()]": (b_2)=>b_2.priority === options.priority
                })["useBeehiveTanStack[filteredData.filter()]"];
                $[23] = options.priority;
                $[24] = t4;
            } else {
                t4 = $[24];
            }
            t3 = filteredData.filter(t4);
            $[20] = filteredData;
            $[21] = options.priority;
            $[22] = t3;
        } else {
            t3 = $[22];
        }
        filteredData = t3;
    }
    const t3 = filteredData;
    const t4 = isAdding || isDeleting;
    let t5;
    if ($[25] !== addItem || $[26] !== deleteItem || $[27] !== error || $[28] !== isLoading || $[29] !== isPaused || $[30] !== refetch || $[31] !== t3 || $[32] !== t4) {
        t5 = {
            data: t3,
            isLoading,
            isPaused,
            addRequest: addItem,
            deleteRequest: deleteItem,
            isAdding: t4,
            error,
            refetch
        };
        $[25] = addItem;
        $[26] = deleteItem;
        $[27] = error;
        $[28] = isLoading;
        $[29] = isPaused;
        $[30] = refetch;
        $[31] = t3;
        $[32] = t4;
        $[33] = t5;
    } else {
        t5 = $[33];
    }
    return t5;
}
_s(useBeehiveTanStack, "uRAm+CCzPYI6x3YRdnJ1uJemqu4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIndustryData"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignupValidation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSignupValidation",
    ()=>useSignupValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
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
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "303d7deb508a5c6f2d6fcd3d73b4fa472d7e961af5b89c4a0532d23883e837bd") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "303d7deb508a5c6f2d6fcd3d73b4fa472d7e961af5b89c4a0532d23883e837bd";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {
            errors: [],
            isValid: false,
            isDirty: false
        };
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const [validationState, setValidationState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t0);
    const validateField = _useSignupValidationValidateField;
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "useSignupValidation[validateForm]": (formData)=>{
                const errors = [];
                Object.keys(formData).forEach({
                    "useSignupValidation[validateForm > (anonymous)()]": (field_0)=>{
                        const fieldKey = field_0;
                        const value_0 = formData[fieldKey];
                        const error = validateField(fieldKey, value_0);
                        if (error) {
                            errors.push({
                                field: fieldKey,
                                message: error
                            });
                        }
                    }
                }["useSignupValidation[validateForm > (anonymous)()]"]);
                const isValid = errors.length === 0;
                const newState = {
                    errors,
                    isValid,
                    isDirty: true
                };
                setValidationState(newState);
                return newState;
            }
        })["useSignupValidation[validateForm]"];
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const validateForm = t1;
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "useSignupValidation[validateStep]": (step, formData_0)=>{
                const stepFields = {
                    1: [],
                    2: [
                        "country"
                    ],
                    3: [
                        "industry"
                    ],
                    4: [
                        "industrySector"
                    ],
                    5: [
                        "name",
                        "phoneNumber"
                    ],
                    6: [
                        "pin"
                    ],
                    7: [
                        "dailyTarget"
                    ],
                    8: []
                };
                const fieldsToValidate = stepFields[step] || [];
                const stepData = {};
                fieldsToValidate.forEach({
                    "useSignupValidation[validateStep > fieldsToValidate.forEach()]": (field_1)=>{
                        const value_1 = formData_0[field_1];
                        if (value_1 !== undefined && value_1 !== null) {
                            stepData[field_1] = value_1;
                        }
                    }
                }["useSignupValidation[validateStep > fieldsToValidate.forEach()]"]);
                return validateForm(stepData);
            }
        })["useSignupValidation[validateStep]"];
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const validateStep = t2;
    const validatePINConfirmation = _useSignupValidationValidatePINConfirmation;
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ({
            "useSignupValidation[clearErrors]": ()=>{
                setValidationState({
                    errors: [],
                    isValid: false,
                    isDirty: false
                });
            }
        })["useSignupValidation[clearErrors]"];
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const clearErrors = t3;
    let t4;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "useSignupValidation[clearFieldError]": (field_2)=>{
                setValidationState({
                    "useSignupValidation[clearFieldError > setValidationState()]": (prev)=>({
                            ...prev,
                            errors: prev.errors.filter({
                                "useSignupValidation[clearFieldError > setValidationState() > prev.errors.filter()]": (error_0)=>error_0.field !== field_2
                            }["useSignupValidation[clearFieldError > setValidationState() > prev.errors.filter()]"])
                        })
                }["useSignupValidation[clearFieldError > setValidationState()]"]);
            }
        })["useSignupValidation[clearFieldError]"];
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const clearFieldError = t4;
    let t5;
    if ($[6] !== validationState.errors) {
        t5 = ({
            "useSignupValidation[getFieldError]": (field_3)=>{
                const error_2 = validationState.errors.find({
                    "useSignupValidation[getFieldError > validationState.errors.find()]": (error_1)=>error_1.field === field_3
                }["useSignupValidation[getFieldError > validationState.errors.find()]"]);
                return error_2 ? error_2.message : null;
            }
        })["useSignupValidation[getFieldError]"];
        $[6] = validationState.errors;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const getFieldError = t5;
    let t6;
    if ($[8] !== getFieldError || $[9] !== validationState) {
        t6 = {
            validationState,
            validateField,
            validateForm,
            validateStep,
            validatePINConfirmation,
            clearErrors,
            clearFieldError,
            getFieldError
        };
        $[8] = getFieldError;
        $[9] = validationState;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    return t6;
}
_s(useSignupValidation, "0VlhAWWIVQ4szyllk91/xnLDodQ=");
function _useSignupValidationValidatePINConfirmation(pin, confirmPin) {
    if (pin.length !== 6) {
        return "PIN must be exactly 6 digits.";
    }
    if (!/^\d{6}$/.test(pin)) {
        return "PIN must contain only numbers.";
    }
    if (confirmPin.length !== 6) {
        return "Please confirm your PIN.";
    }
    if (pin !== confirmPin) {
        return "PINs do not match. Please try again.";
    }
    return null;
}
function _useSignupValidationValidateField(field, value) {
    const rules = VALIDATION_RULES[field];
    if (!rules) {
        return null;
    }
    if (rules.required && (!value || typeof value === "string" && value.trim() === "")) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    }
    if (!value || typeof value === "string" && value.trim() === "") {
        return null;
    }
    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters.`;
    }
    if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must not exceed ${rules.maxLength} characters.`;
    }
    if (rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
        const fieldDisplayName = field === "pin" ? "PIN" : field.charAt(0).toUpperCase() + field.slice(1);
        return `${fieldDisplayName} format is invalid.`;
    }
    if (rules.custom) {
        return rules.custom(value);
    }
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBusinessCreation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBusinessCreation",
    ()=>useBusinessCreation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseContext$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabaseContext.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useBusinessCreation() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        loading: false,
        error: null,
        result: null
    });
    const createBusinessWithPIN = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBusinessCreation.useCallback[createBusinessWithPIN]": async (signupData)=>{
            setState({
                "useBusinessCreation.useCallback[createBusinessWithPIN]": (prev)=>({
                        ...prev,
                        loading: true,
                        error: null
                    })
            }["useBusinessCreation.useCallback[createBusinessWithPIN]"]);
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
                    const errorResult_0 = {
                        success: false,
                        existingUser: result.existingUser || false,
                        error: result.error || 'Failed to create business',
                        data: null
                    };
                    setState({
                        "useBusinessCreation.useCallback[createBusinessWithPIN]": (prev_1)=>({
                                ...prev_1,
                                loading: false,
                                error: result.error,
                                result: errorResult_0
                            })
                    }["useBusinessCreation.useCallback[createBusinessWithPIN]"]);
                    return errorResult_0;
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
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseContext$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setBusinessContext"])(business.id, business.country, business.industry);
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
                setState({
                    "useBusinessCreation.useCallback[createBusinessWithPIN]": (prev_2)=>({
                            ...prev_2,
                            loading: false,
                            result: successResult
                        })
                }["useBusinessCreation.useCallback[createBusinessWithPIN]"]);
                return successResult;
            } catch (err) {
                console.error('💥 Unexpected error:', err);
                const errorResult = {
                    success: false,
                    existingUser: false,
                    error: err instanceof Error ? err.message : 'Unexpected error occurred',
                    data: null
                };
                setState({
                    "useBusinessCreation.useCallback[createBusinessWithPIN]": (prev_0)=>({
                            ...prev_0,
                            loading: false,
                            error: err instanceof Error ? err.message : 'Unexpected error occurred',
                            result: errorResult
                        })
                }["useBusinessCreation.useCallback[createBusinessWithPIN]"]);
                return errorResult;
            }
        }
    }["useBusinessCreation.useCallback[createBusinessWithPIN]"], []);
    const checkDuplicatePhone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBusinessCreation.useCallback[checkDuplicatePhone]": async (phoneNumber)=>{
            try {
                console.log('🔍 Checking for duplicate phone:', phoneNumber);
                const response_0 = await fetch('/api/auth/check-phone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phoneNumber
                    })
                });
                const result_0 = await response_0.json();
                if (!response_0.ok) {
                    console.error('❌ Error checking phone:', result_0.error);
                    return {
                        exists: false,
                        error: result_0.error || 'Failed to check phone number'
                    };
                }
                console.log('✅ Phone check result:', result_0);
                return {
                    exists: result_0.exists
                };
            } catch (err_0) {
                console.error('💥 Error checking phone:', err_0);
                return {
                    exists: false,
                    error: 'Network error while checking phone number'
                };
            }
        }
    }["useBusinessCreation.useCallback[checkDuplicatePhone]"], []);
    const verifyPINForLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBusinessCreation.useCallback[verifyPINForLogin]": async (phoneNumber_0, pin)=>{
            try {
                console.log('🔐 Verifying PIN for login:', {
                    phoneNumber: phoneNumber_0,
                    pinLength: pin.length
                });
                const response_1 = await fetch('/api/auth/verify-pin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phoneNumber: phoneNumber_0,
                        pin
                    })
                });
                const result_1 = await response_1.json();
                if (!result_1.success) {
                    console.error('❌ PIN verification failed:', result_1.error);
                    return {
                        success: false,
                        error: result_1.error || 'Invalid PIN'
                    };
                }
                console.log('✅ PIN verification successful');
                return {
                    success: true,
                    business: result_1.business
                };
            } catch (err_1) {
                console.error('💥 Error verifying PIN:', err_1);
                return {
                    success: false,
                    error: 'Network error during PIN verification'
                };
            }
        }
    }["useBusinessCreation.useCallback[verifyPINForLogin]"], []);
    const resetState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBusinessCreation.useCallback[resetState]": ()=>{
            setState({
                loading: false,
                error: null,
                result: null
            });
        }
    }["useBusinessCreation.useCallback[resetState]"], []);
    return {
        state,
        createBusinessWithPIN,
        checkDuplicatePhone,
        verifyPINForLogin,
        resetState
    };
}
_s(useBusinessCreation, "4HNpRsnfPeVD9ToGwiZxS7xINLw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignup.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSignup",
    ()=>useSignup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignupValidation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignupValidation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBusinessCreation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBusinessCreation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/currency.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function useSignup() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { signInAfterSignup } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    const [signupState, setSignupState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
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
    const { validateStep, validatePINConfirmation, getFieldError, clearFieldError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignupValidation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignupValidation"])();
    const { state: creationState, createBusinessWithPIN, checkDuplicatePhone } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBusinessCreation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBusinessCreation"])();
    // Auto-update currency when country changes
    const updateFormData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[updateFormData]": (field, value)=>{
            setSignupState({
                "useSignup.useCallback[updateFormData]": (prev)=>{
                    const updated = {
                        ...prev,
                        formData: {
                            ...prev.formData,
                            [field]: value
                        }
                    };
                    // Auto-update currency when country changes
                    if (field === 'country' && value) {
                        updated.formData.currency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(value);
                    }
                    return updated;
                }
            }["useSignup.useCallback[updateFormData]"]);
            // Clear field error when user starts typing
            if (getFieldError(field)) {
                clearFieldError(field);
            }
        }
    }["useSignup.useCallback[updateFormData]"], [
        getFieldError,
        clearFieldError
    ]);
    const nextStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[nextStep]": ()=>{
            if (signupState.currentStep < 8) {
                setSignupState({
                    "useSignup.useCallback[nextStep]": (prev_0)=>({
                            ...prev_0,
                            currentStep: prev_0.currentStep + 1
                        })
                }["useSignup.useCallback[nextStep]"]);
            }
        }
    }["useSignup.useCallback[nextStep]"], [
        signupState.currentStep
    ]);
    const prevStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[prevStep]": ()=>{
            if (signupState.currentStep > 1) {
                setSignupState({
                    "useSignup.useCallback[prevStep]": (prev_1)=>({
                            ...prev_1,
                            currentStep: prev_1.currentStep - 1
                        })
                }["useSignup.useCallback[prevStep]"]);
                // Reset PIN setup step when going back from PIN confirmation
                if (signupState.currentStep === 6 && signupState.pinSetupStep === 'confirm') {
                    setSignupState({
                        "useSignup.useCallback[prevStep]": (prev_2)=>({
                                ...prev_2,
                                pinSetupStep: 'create'
                            })
                    }["useSignup.useCallback[prevStep]"]);
                }
            }
        }
    }["useSignup.useCallback[prevStep]"], [
        signupState.currentStep,
        signupState.pinSetupStep
    ]);
    const goToStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[goToStep]": (step)=>{
            if (step >= 1 && step <= 8) {
                setSignupState({
                    "useSignup.useCallback[goToStep]": (prev_3)=>({
                            ...prev_3,
                            currentStep: step
                        })
                }["useSignup.useCallback[goToStep]"]);
            }
        }
    }["useSignup.useCallback[goToStep]"], []);
    const handlePINSetup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[handlePINSetup]": (pin)=>{
            console.log('🔐 PIN setup completed - storing PIN and advancing to next step:', pin);
            updateFormData('pin', pin);
            setSignupState({
                "useSignup.useCallback[handlePINSetup]": (prev_4)=>({
                        ...prev_4,
                        pinSetupStep: 'complete'
                    })
            }["useSignup.useCallback[handlePINSetup]"]);
            // Auto-advance to next step after successful PIN setup
            setTimeout({
                "useSignup.useCallback[handlePINSetup]": ()=>{
                    nextStep();
                }
            }["useSignup.useCallback[handlePINSetup]"], 500);
        }
    }["useSignup.useCallback[handlePINSetup]"], [
        updateFormData,
        nextStep
    ]);
    const handlePINConfirmation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[handlePINConfirmation]": (pin_0, confirmPin)=>{
            const error = validatePINConfirmation(pin_0, confirmPin);
            if (error) {
                // PIN doesn't match or is invalid
                console.error('❌ PIN confirmation failed:', error);
                return false;
            }
            // PINs match and are valid
            updateFormData('pin', pin_0);
            setSignupState({
                "useSignup.useCallback[handlePINConfirmation]": (prev_5)=>({
                        ...prev_5,
                        pinSetupStep: 'complete'
                    })
            }["useSignup.useCallback[handlePINConfirmation]"]);
            // Auto-advance to next step after successful PIN confirmation
            setTimeout({
                "useSignup.useCallback[handlePINConfirmation]": ()=>{
                    nextStep();
                }
            }["useSignup.useCallback[handlePINConfirmation]"], 500);
            return true;
        }
    }["useSignup.useCallback[handlePINConfirmation]"], [
        validatePINConfirmation,
        updateFormData,
        nextStep
    ]);
    const validateCurrentStep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[validateCurrentStep]": ()=>{
            const validation = validateStep(signupState.currentStep, signupState.formData);
            return validation.isValid;
        }
    }["useSignup.useCallback[validateCurrentStep]"], [
        signupState.currentStep,
        signupState.formData,
        validateStep
    ]);
    const handleComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[handleComplete]": async ()=>{
            // Validate final step
            const validation_0 = validateStep(8, signupState.formData);
            if (!validation_0.isValid) {
                console.error('❌ Final validation failed:', validation_0.errors);
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
                currency: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(signupState.formData.country || ''),
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
                    setSignupState({
                        "useSignup.useCallback[handleComplete]": (prev_6)=>({
                                ...prev_6,
                                isComplete: true,
                                businessId: business.id
                            })
                    }["useSignup.useCallback[handleComplete]"]);
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
            } catch (error_0) {
                console.error('💥 Signup error:', error_0);
            // Error will be handled by the creation state
            }
        }
    }["useSignup.useCallback[handleComplete]"], [
        signupState.formData,
        createBusinessWithPIN,
        validateStep,
        signInAfterSignup,
        router
    ]);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSignup.useCallback[reset]": ()=>{
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
        }
    }["useSignup.useCallback[reset]"], []);
    // Check for duplicate phone when phone number is entered
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSignup.useEffect": ()=>{
            const phoneNumber = signupState.formData.phoneNumber;
            if (phoneNumber && phoneNumber.length >= 12) {
                // Minimum length for international format
                const timer = setTimeout({
                    "useSignup.useEffect.timer": async ()=>{
                        const result_0 = await checkDuplicatePhone(phoneNumber);
                        if (result_0.exists) {
                            console.log('⚠️ Phone number already exists:', phoneNumber);
                        // Could show a warning or prevent progression
                        }
                    }
                }["useSignup.useEffect.timer"], 1000); // Debounce for 1 second
                return ({
                    "useSignup.useEffect": ()=>clearTimeout(timer)
                })["useSignup.useEffect"];
            }
        }
    }["useSignup.useEffect"], [
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
_s(useSignup, "4116RxVQGGPjWXSzytfQCyI2HGg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignupValidation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignupValidation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBusinessCreation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBusinessCreation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useRealtime.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabaseAdmin.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
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
    _s();
    const channelsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const subscribeToTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRealtime.useCallback[subscribeToTable]": (options)=>{
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
            const channel = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseAdmin"].channel(channelName).on('postgres_changes', {
                event,
                schema: 'public',
                table,
                filter
            }, {
                "useRealtime.useCallback[subscribeToTable].channel": (payload)=>{
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
                }
            }["useRealtime.useCallback[subscribeToTable].channel"]).subscribe();
            console.log(`📡 Created new subscription for ${table}`);
            globalSubscriptions.set(channelName, channel);
            return channel;
        }
    }["useRealtime.useCallback[subscribeToTable]"], [
        enabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRealtime.useEffect": ()=>{
            if (!enabled) return;
            // Clear existing channels from this hook instance
            channelsRef.current.forEach({
                "useRealtime.useEffect": (channel_0)=>{
                    // Only remove if not used by other instances (check global count)
                    const isUsedElsewhere = Array.from(globalSubscriptions.values()).filter({
                        "useRealtime.useEffect": (c)=>c === channel_0
                    }["useRealtime.useEffect"]).length > 1;
                    if (!isUsedElsewhere) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseAdmin"].removeChannel(channel_0);
                        // Remove from global registry by finding the key
                        for (const [key, value] of globalSubscriptions.entries()){
                            if (value === channel_0) {
                                globalSubscriptions.delete(key);
                                break;
                            }
                        }
                    }
                }
            }["useRealtime.useEffect"]);
            channelsRef.current = [];
            // Create new subscriptions
            const newChannels = subscriptions.map({
                "useRealtime.useEffect.newChannels": (options_0)=>subscribeToTable(options_0)
            }["useRealtime.useEffect.newChannels"]).filter(Boolean);
            channelsRef.current = newChannels;
            return ({
                "useRealtime.useEffect": ()=>{
                    // Cleanup channels on unmount - but keep them in global registry
                    channelsRef.current = [];
                }
            })["useRealtime.useEffect"];
        }
    }["useRealtime.useEffect"], [
        subscriptions,
        enabled,
        subscribeToTable
    ]);
    const unsubscribeAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRealtime.useCallback[unsubscribeAll]": ()=>{
            channelsRef.current.forEach({
                "useRealtime.useCallback[unsubscribeAll]": (channel_1)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseAdmin"].removeChannel(channel_1);
                    // Remove from global registry by finding the key
                    for (const [key_0, value_0] of globalSubscriptions.entries()){
                        if (value_0 === channel_1) {
                            globalSubscriptions.delete(key_0);
                            break;
                        }
                    }
                }
            }["useRealtime.useCallback[unsubscribeAll]"]);
            channelsRef.current = [];
        }
    }["useRealtime.useCallback[unsubscribeAll]"], []);
    return {
        unsubscribeAll,
        isSubscribed: channelsRef.current.length > 0
    };
}
_s(useRealtime, "kGEP9MyunX8TVR38z6q4TQTYoR8=");
function useExpensesRealtime(businessId, onExpenseChange) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145";
    }
    let subscriptions;
    if ($[1] !== businessId || $[2] !== onExpenseChange) {
        subscriptions = [];
        if (businessId) {
            const t0 = onExpenseChange || _temp;
            let t1;
            if ($[4] !== t0) {
                t1 = debounce(t0, 2000);
                $[4] = t0;
                $[5] = t1;
            } else {
                t1 = $[5];
            }
            const debouncedCallback = t1;
            const t2 = `business_id=eq.${businessId}`;
            let t3;
            if ($[6] !== debouncedCallback || $[7] !== t2) {
                t3 = {
                    table: "expenses",
                    filter: t2,
                    callback: debouncedCallback
                };
                $[6] = debouncedCallback;
                $[7] = t2;
                $[8] = t3;
            } else {
                t3 = $[8];
            }
            subscriptions.push(t3);
        }
        $[1] = businessId;
        $[2] = onExpenseChange;
        $[3] = subscriptions;
    } else {
        subscriptions = $[3];
    }
    const t0 = !!businessId;
    let t1;
    if ($[9] !== subscriptions || $[10] !== t0) {
        t1 = {
            subscriptions,
            enabled: t0
        };
        $[9] = subscriptions;
        $[10] = t0;
        $[11] = t1;
    } else {
        t1 = $[11];
    }
    return useRealtime(t1);
}
_s1(useExpensesRealtime, "B1VoQPuZt+TtMkXqIuGRq8Ay3iI=", false, function() {
    return [
        useRealtime
    ];
});
function _temp() {}
function useTransactionsRealtime(businessId, onTransactionChange) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145";
    }
    let subscriptions;
    if ($[1] !== businessId || $[2] !== onTransactionChange) {
        subscriptions = [];
        if (businessId) {
            const t0 = onTransactionChange || _temp2;
            let t1;
            if ($[4] !== t0) {
                t1 = debounce(t0, 2000);
                $[4] = t0;
                $[5] = t1;
            } else {
                t1 = $[5];
            }
            const debouncedCallback = t1;
            const t2 = `business_id=eq.${businessId}`;
            let t3;
            if ($[6] !== debouncedCallback || $[7] !== t2) {
                t3 = {
                    table: "transactions",
                    filter: t2,
                    callback: debouncedCallback
                };
                $[6] = debouncedCallback;
                $[7] = t2;
                $[8] = t3;
            } else {
                t3 = $[8];
            }
            subscriptions.push(t3);
        }
        $[1] = businessId;
        $[2] = onTransactionChange;
        $[3] = subscriptions;
    } else {
        subscriptions = $[3];
    }
    const t0 = !!businessId;
    let t1;
    if ($[9] !== subscriptions || $[10] !== t0) {
        t1 = {
            subscriptions,
            enabled: t0
        };
        $[9] = subscriptions;
        $[10] = t0;
        $[11] = t1;
    } else {
        t1 = $[11];
    }
    return useRealtime(t1);
}
_s2(useTransactionsRealtime, "B1VoQPuZt+TtMkXqIuGRq8Ay3iI=", false, function() {
    return [
        useRealtime
    ];
});
function _temp2() {}
function useInventoryRealtime(businessId, onInventoryChange) {
    _s3();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145";
    }
    let subscriptions;
    if ($[1] !== businessId || $[2] !== onInventoryChange) {
        subscriptions = [];
        if (businessId) {
            const t0 = onInventoryChange || _temp3;
            let t1;
            if ($[4] !== t0) {
                t1 = debounce(t0, 2000);
                $[4] = t0;
                $[5] = t1;
            } else {
                t1 = $[5];
            }
            const debouncedCallback = t1;
            const t2 = `business_id=eq.${businessId}`;
            let t3;
            if ($[6] !== debouncedCallback || $[7] !== t2) {
                t3 = {
                    table: "inventory",
                    filter: t2,
                    callback: debouncedCallback
                };
                $[6] = debouncedCallback;
                $[7] = t2;
                $[8] = t3;
            } else {
                t3 = $[8];
            }
            subscriptions.push(t3);
        }
        $[1] = businessId;
        $[2] = onInventoryChange;
        $[3] = subscriptions;
    } else {
        subscriptions = $[3];
    }
    const t0 = !!businessId;
    let t1;
    if ($[9] !== subscriptions || $[10] !== t0) {
        t1 = {
            subscriptions,
            enabled: t0
        };
        $[9] = subscriptions;
        $[10] = t0;
        $[11] = t1;
    } else {
        t1 = $[11];
    }
    return useRealtime(t1);
}
_s3(useInventoryRealtime, "B1VoQPuZt+TtMkXqIuGRq8Ay3iI=", false, function() {
    return [
        useRealtime
    ];
});
function _temp3() {}
function useCreditRealtime(businessId, onCreditChange) {
    _s4();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145";
    }
    let subscriptions;
    if ($[1] !== businessId || $[2] !== onCreditChange) {
        subscriptions = [];
        if (businessId) {
            const t0 = onCreditChange || _temp4;
            let t1;
            if ($[4] !== t0) {
                t1 = debounce(t0, 2000);
                $[4] = t0;
                $[5] = t1;
            } else {
                t1 = $[5];
            }
            const debouncedCallback = t1;
            const t2 = `business_id=eq.${businessId}`;
            let t3;
            if ($[6] !== debouncedCallback || $[7] !== t2) {
                t3 = {
                    table: "credit",
                    filter: t2,
                    callback: debouncedCallback
                };
                $[6] = debouncedCallback;
                $[7] = t2;
                $[8] = t3;
            } else {
                t3 = $[8];
            }
            subscriptions.push(t3);
        }
        $[1] = businessId;
        $[2] = onCreditChange;
        $[3] = subscriptions;
    } else {
        subscriptions = $[3];
    }
    const t0 = !!businessId;
    let t1;
    if ($[9] !== subscriptions || $[10] !== t0) {
        t1 = {
            subscriptions,
            enabled: t0
        };
        $[9] = subscriptions;
        $[10] = t0;
        $[11] = t1;
    } else {
        t1 = $[11];
    }
    return useRealtime(t1);
}
_s4(useCreditRealtime, "B1VoQPuZt+TtMkXqIuGRq8Ay3iI=", false, function() {
    return [
        useRealtime
    ];
});
function _temp4() {}
function useTargetsRealtime(businessId, onTargetChange) {
    _s5();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145";
    }
    let subscriptions;
    if ($[1] !== businessId || $[2] !== onTargetChange) {
        subscriptions = [];
        if (businessId) {
            const t0 = onTargetChange || _temp5;
            let t1;
            if ($[4] !== t0) {
                t1 = debounce(t0, 2000);
                $[4] = t0;
                $[5] = t1;
            } else {
                t1 = $[5];
            }
            const debouncedCallback = t1;
            const t2 = `business_id=eq.${businessId}`;
            let t3;
            if ($[6] !== debouncedCallback || $[7] !== t2) {
                t3 = {
                    table: "targets",
                    filter: t2,
                    callback: debouncedCallback
                };
                $[6] = debouncedCallback;
                $[7] = t2;
                $[8] = t3;
            } else {
                t3 = $[8];
            }
            subscriptions.push(t3);
        }
        $[1] = businessId;
        $[2] = onTargetChange;
        $[3] = subscriptions;
    } else {
        subscriptions = $[3];
    }
    const t0 = !!businessId;
    let t1;
    if ($[9] !== subscriptions || $[10] !== t0) {
        t1 = {
            subscriptions,
            enabled: t0
        };
        $[9] = subscriptions;
        $[10] = t0;
        $[11] = t1;
    } else {
        t1 = $[11];
    }
    return useRealtime(t1);
}
_s5(useTargetsRealtime, "B1VoQPuZt+TtMkXqIuGRq8Ay3iI=", false, function() {
    return [
        useRealtime
    ];
});
function _temp5() {}
function useBusinessRealtime(businessId, onBusinessChange) {
    _s6();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cca8e641702628b7870b8d8eb514407f63bf960d566f529c7051ee9c8dfd5145";
    }
    let subscriptions;
    if ($[1] !== businessId || $[2] !== onBusinessChange) {
        subscriptions = [];
        if (businessId) {
            const t0 = onBusinessChange || _temp6;
            let t1;
            if ($[4] !== t0) {
                t1 = debounce(t0, 2000);
                $[4] = t0;
                $[5] = t1;
            } else {
                t1 = $[5];
            }
            const debouncedCallback = t1;
            const t2 = `id=eq.${businessId}`;
            let t3;
            if ($[6] !== debouncedCallback || $[7] !== t2) {
                t3 = {
                    table: "businesses",
                    filter: t2,
                    callback: debouncedCallback
                };
                $[6] = debouncedCallback;
                $[7] = t2;
                $[8] = t3;
            } else {
                t3 = $[8];
            }
            subscriptions.push(t3);
        }
        $[1] = businessId;
        $[2] = onBusinessChange;
        $[3] = subscriptions;
    } else {
        subscriptions = $[3];
    }
    const t0 = !!businessId;
    let t1;
    if ($[9] !== subscriptions || $[10] !== t0) {
        t1 = {
            subscriptions,
            enabled: t0
        };
        $[9] = subscriptions;
        $[10] = t0;
        $[11] = t1;
    } else {
        t1 = $[11];
    }
    return useRealtime(t1);
}
_s6(useBusinessRealtime, "B1VoQPuZt+TtMkXqIuGRq8Ay3iI=", false, function() {
    return [
        useRealtime
    ];
});
function _temp6() {}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TourProvider",
    ()=>TourProvider,
    "useTour",
    ()=>useTour
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const TourContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useTour() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "d446db0ce8cb53303e41bd0dceda4ca8320841b64a9c284df3bd3497f30ded46") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d446db0ce8cb53303e41bd0dceda4ca8320841b64a9c284df3bd3497f30ded46";
    }
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TourContext);
    if (!context) {
        throw new Error("useTour must be used within a TourProvider");
    }
    return context;
}
_s(useTour, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const getIndustryTourSteps = (t, industry)=>{
    const baseSteps = [
        {
            id: 'welcome',
            title: t('tour.welcome_dashboard', 'Welcome to Your Dashboard!'),
            description: t('tour.dashboard_description', 'This is your business command center. Track everything that matters in one place.'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
            position: 'center',
            page: 'dashboard'
        },
        {
            id: 'daily-target',
            title: t('tour.set_daily_goal', 'Set Your Daily Goal'),
            description: t('tour.daily_goal_description', 'Aim high! Set a daily sales target to keep yourself motivated and track your progress.'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
            target: '.daily-target-section',
            position: 'bottom',
            page: 'dashboard'
        },
        {
            id: 'buzz-insights',
            title: t('tour.buzz_insights', 'Buzz Insights'),
            description: t('tour.buzz_description', 'Get smart insights about your business - low stock alerts, overdue payments, and quick summaries.'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
            target: '.buzz-section',
            position: 'bottom',
            page: 'dashboard'
        },
        {
            id: 'quick-add',
            title: t('tour.quick_add_money', 'Quick Add Money'),
            description: t('tour.quick_add_description', 'Tap these buttons to instantly record sales or expenses. It\'s that simple!'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
            target: '.money-in-button',
            position: 'top',
            page: 'dashboard'
        }
    ];
    const cashSteps = [
        {
            id: 'cash-overview',
            title: t('tour.track_cash_flow', 'Track Your Cash Flow'),
            description: t('tour.cash_flow_description', 'See all your money coming in and going out. Know your financial health at a glance.'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
            position: 'center',
            page: 'cash'
        },
        {
            id: 'add-transaction',
            title: t('tour.add_transactions', 'Add Transactions'),
            description: t('tour.transactions_description', 'Record every sale and expense. This helps you understand your business patterns.'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
            target: '.add-transaction-btn',
            position: 'bottom',
            page: 'cash'
        }
    ];
    const creditSteps = [
        {
            id: 'credit-overview',
            title: t('tour.manage_customer_credit', 'Manage Customer Credit'),
            description: t('tour.credit_description', 'Keep track of customers who owe you money. Never forget a payment again!'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
            position: 'center',
            page: 'credit'
        },
        {
            id: 'add-credit',
            title: t('tour.record_credit_sales', 'Record Credit Sales'),
            description: t('tour.credit_sales_description', 'When a customer buys on credit, record it here to stay organized.'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
            target: '.add-credit-btn',
            position: 'bottom',
            page: 'credit'
        }
    ];
    // Industry-specific steps
    let industrySteps = [];
    if (industry === 'retail') {
        industrySteps = [
            {
                id: 'inventory-overview',
                title: t('tour.manage_inventory', 'Manage Your Inventory'),
                description: t('tour.inventory_description', 'Keep track of your stock levels. Get alerts when items are running low.'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                position: 'center',
                page: 'stock'
            },
            {
                id: 'add-product',
                title: t('tour.add_product', 'Add New Product'),
                description: t('tour.add_product_description', 'Click here to add new products to your inventory.'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
                target: '.add-product-btn',
                position: 'bottom',
                page: 'stock'
            }
        ];
    } else if (industry === 'services') {
        industrySteps = [
            {
                id: 'services-overview',
                title: t('tour.manage_services', 'Manage Your Services'),
                description: t('tour.services_description', 'List all the services you offer. Help customers know what you provide.'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                position: 'center',
                page: 'services'
            },
            {
                id: 'add-service',
                title: t('tour.add_service', 'Add New Service'),
                description: t('tour.add_service_description', 'Click here to add a new service to your business offerings.'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
                target: '.add-service-btn',
                position: 'bottom',
                page: 'services'
            }
        ];
    } else if (industry === 'restaurant') {
        industrySteps = [
            {
                id: 'inventory-overview',
                title: t('tour.manage_ingredients', 'Manage Your Ingredients'),
                description: t('tour.ingredients_description', 'Track your ingredients and supplies. Never run out of what you need.'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                position: 'center',
                page: 'stock'
            },
            {
                id: 'add-ingredient',
                title: t('tour.add_ingredient', 'Add New Ingredient'),
                description: t('tour.add_ingredient_description', 'Add ingredients to your kitchen inventory.'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
                target: '.add-product-btn',
                position: 'bottom',
                page: 'stock'
            }
        ];
    } else if ([
        'salon',
        'transport',
        'tailor',
        'freelance'
    ].includes(industry)) {
        // Calendar industries get calendar tour steps
        const calendarSteps = [
            {
                id: 'calendar-overview',
                title: t('tour.manage_calendar', 'Manage Your Calendar'),
                description: t('tour.calendar_description', 'View and manage all your appointments in one place.'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
                position: 'center',
                page: 'calendar'
            },
            {
                id: 'add-appointment',
                title: t('tour.add_appointment', 'Add New Appointment'),
                description: t('tour.add_appointment_description', 'Schedule new appointments and manage your bookings.'),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"],
                target: '.add-appointment-btn',
                position: 'bottom',
                page: 'calendar'
            }
        ];
        // Add industry-specific steps first, then calendar
        if (industry === 'salon') {
            industrySteps = [
                {
                    id: 'services-overview',
                    title: t('tour.manage_services', 'Manage Your Services'),
                    description: t('tour.services_description', 'List all your salon services and pricing.'),
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                    position: 'center',
                    page: 'services'
                },
                ...calendarSteps
            ];
        } else if (industry === 'transport') {
            industrySteps = [
                {
                    id: 'services-overview',
                    title: t('tour.manage_trips', 'Manage Your Trips'),
                    description: t('tour.trips_description', 'List all your transport routes and services.'),
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                    position: 'center',
                    page: 'services'
                },
                ...calendarSteps
            ];
        } else if (industry === 'tailor') {
            industrySteps = [
                {
                    id: 'services-overview',
                    title: t('tour.manage_jobs', 'Manage Your Jobs'),
                    description: t('tour.jobs_description', 'Track all your tailoring jobs and measurements.'),
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                    position: 'center',
                    page: 'services'
                },
                ...calendarSteps
            ];
        } else if (industry === 'freelance') {
            industrySteps = [
                {
                    id: 'services-overview',
                    title: t('tour.manage_projects', 'Manage Your Projects'),
                    description: t('tour.projects_description', 'Track all your freelance projects and deliverables.'),
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                    position: 'center',
                    page: 'services'
                },
                ...calendarSteps
            ];
        }
    }
    const commonSteps = [
        {
            id: 'beehive-overview',
            title: t('tour.join_community', 'Join the Beehive'),
            description: t('tour.beehive_description', 'Connect with other business owners, share experiences, and get helpful tips.'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
            position: 'center',
            page: 'beehive'
        },
        {
            id: 'reports-overview',
            title: t('tour.view_reports', 'View Business Reports'),
            description: t('tour.reports_description', 'Get detailed insights into your business performance with comprehensive reports.'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
            position: 'center',
            page: 'reports'
        },
        {
            id: 'more-overview',
            title: t('tour.more_business_tools', 'More Business Tools'),
            description: t('tour.more_tools_description', 'Additional features to help you run your business like a pro!'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"],
            position: 'center',
            page: 'more'
        },
        {
            id: 'tour-complete',
            title: t('tour.all_set', 'You\'re All Set! 🎉'),
            description: t('tour.complete_description', 'You\'ve mastered the basics! Explore each feature and watch your business grow. Success awaits!'),
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
            position: 'center',
            page: 'complete'
        }
    ];
    return [
        ...baseSteps,
        ...cashSteps,
        ...creditSteps,
        ...industrySteps,
        ...commonSteps
    ];
};
function TourProvider(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(40);
    if ($[0] !== "d446db0ce8cb53303e41bd0dceda4ca8320841b64a9c284df3bd3497f30ded46") {
        for(let $i = 0; $i < 40; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d446db0ce8cb53303e41bd0dceda4ca8320841b64a9c284df3bd3497f30ded46";
    }
    const { children, industry, country } = t0;
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    let t1;
    if ($[1] !== industry || $[2] !== t) {
        t1 = getIndustryTourSteps(t, industry);
        $[1] = industry;
        $[2] = t;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    const tourSteps = t1;
    const [isTourActive, setIsTourActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const step = tourSteps[currentStep];
    const totalSteps = tourSteps.length;
    const isLastStep = currentStep === totalSteps - 1;
    const isFirstStep = currentStep === 0;
    let t2;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "TourProvider[startTour]": ()=>{
                setCurrentStep(0);
                setIsTourActive(true);
            }
        })["TourProvider[startTour]"];
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const startTour = t2;
    let t3;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ({
            "TourProvider[completeTour]": ()=>{
                setIsTourActive(false);
                localStorage.setItem("beezee-multi-page-tour-completed", "true");
            }
        })["TourProvider[completeTour]"];
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    const completeTour = t3;
    let t4;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "TourProvider[skipTour]": ()=>{
                setIsTourActive(false);
            }
        })["TourProvider[skipTour]"];
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    const skipTour = t4;
    let t5;
    if ($[7] !== isLastStep) {
        t5 = ({
            "TourProvider[nextStep]": ()=>{
                if (isLastStep) {
                    completeTour();
                } else {
                    setCurrentStep(_TourProviderNextStepSetCurrentStep);
                }
            }
        })["TourProvider[nextStep]"];
        $[7] = isLastStep;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    const nextStep = t5;
    let t6;
    if ($[9] !== isFirstStep) {
        t6 = ({
            "TourProvider[previousStep]": ()=>{
                if (!isFirstStep) {
                    setCurrentStep(_TourProviderPreviousStepSetCurrentStep);
                }
            }
        })["TourProvider[previousStep]"];
        $[9] = isFirstStep;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    const previousStep = t6;
    let t7;
    if ($[11] !== isTourActive || $[12] !== step.target) {
        t7 = ({
            "TourProvider[useEffect()]": ()=>{
                if (isTourActive && step.target) {
                    const targetElement = document.querySelector(step.target);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }
                }
            }
        })["TourProvider[useEffect()]"];
        $[11] = isTourActive;
        $[12] = step.target;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    let t8;
    if ($[14] !== currentStep || $[15] !== isTourActive || $[16] !== step.target) {
        t8 = [
            currentStep,
            isTourActive,
            step.target
        ];
        $[14] = currentStep;
        $[15] = isTourActive;
        $[16] = step.target;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t7, t8);
    const t9 = step?.page || "";
    let t10;
    if ($[18] !== country || $[19] !== currentStep || $[20] !== industry || $[21] !== isTourActive || $[22] !== nextStep || $[23] !== previousStep || $[24] !== t9 || $[25] !== totalSteps) {
        t10 = {
            isTourActive,
            currentStep,
            totalSteps,
            currentPage: t9,
            industry,
            country,
            startTour,
            completeTour,
            skipTour,
            nextStep,
            previousStep
        };
        $[18] = country;
        $[19] = currentStep;
        $[20] = industry;
        $[21] = isTourActive;
        $[22] = nextStep;
        $[23] = previousStep;
        $[24] = t9;
        $[25] = totalSteps;
        $[26] = t10;
    } else {
        t10 = $[26];
    }
    let t11;
    if ($[27] !== currentStep || $[28] !== isFirstStep || $[29] !== isLastStep || $[30] !== isTourActive || $[31] !== nextStep || $[32] !== previousStep || $[33] !== step || $[34] !== totalSteps) {
        t11 = isTourActive && step && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TourTooltip, {
            step: step,
            currentStep: currentStep,
            totalSteps: totalSteps,
            isFirstStep: isFirstStep,
            isLastStep: isLastStep,
            onNext: nextStep,
            onPrevious: previousStep,
            onSkip: skipTour,
            onComplete: completeTour
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 422,
            columnNumber: 35
        }, this);
        $[27] = currentStep;
        $[28] = isFirstStep;
        $[29] = isLastStep;
        $[30] = isTourActive;
        $[31] = nextStep;
        $[32] = previousStep;
        $[33] = step;
        $[34] = totalSteps;
        $[35] = t11;
    } else {
        t11 = $[35];
    }
    let t12;
    if ($[36] !== children || $[37] !== t10 || $[38] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TourContext.Provider, {
            value: t10,
            children: [
                children,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 437,
            columnNumber: 11
        }, this);
        $[36] = children;
        $[37] = t10;
        $[38] = t11;
        $[39] = t12;
    } else {
        t12 = $[39];
    }
    return t12;
}
_s1(TourProvider, "vtWMgogh859pIG/4JC6z7Pda9AI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c = TourProvider;
function _TourProviderPreviousStepSetCurrentStep(prev_0) {
    return prev_0 - 1;
}
function _TourProviderNextStepSetCurrentStep(prev) {
    return prev + 1;
}
function TourTooltip(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(67);
    if ($[0] !== "d446db0ce8cb53303e41bd0dceda4ca8320841b64a9c284df3bd3497f30ded46") {
        for(let $i = 0; $i < 67; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d446db0ce8cb53303e41bd0dceda4ca8320841b64a9c284df3bd3497f30ded46";
    }
    const { step, currentStep, totalSteps, isFirstStep, isLastStep, onNext, onPrevious, onSkip, onComplete } = t0;
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    let t1;
    let t2;
    let t3;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            opacity: 0
        };
        t2 = {
            opacity: 1
        };
        t3 = {
            opacity: 0
        };
        $[1] = t1;
        $[2] = t2;
        $[3] = t3;
    } else {
        t1 = $[1];
        t2 = $[2];
        t3 = $[3];
    }
    let t4;
    if ($[4] !== onSkip) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: t1,
            animate: t2,
            exit: t3,
            className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]",
            onClick: onSkip
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 509,
            columnNumber: 10
        }, this);
        $[4] = onSkip;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    let t6;
    let t7;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            scale: 0.8,
            opacity: 0
        };
        t6 = {
            scale: 1,
            opacity: 1
        };
        t7 = {
            scale: 0.8,
            opacity: 0
        };
        $[6] = t5;
        $[7] = t6;
        $[8] = t7;
    } else {
        t5 = $[6];
        t6 = $[7];
        t7 = $[8];
    }
    const t8 = step.page;
    let t9;
    if ($[9] !== t) {
        t9 = t("tour.step", "Step");
        $[9] = t;
        $[10] = t9;
    } else {
        t9 = $[10];
    }
    const t10 = currentStep + 1;
    let t11;
    if ($[11] !== t) {
        t11 = t("tour.of", "of");
        $[11] = t;
        $[12] = t11;
    } else {
        t11 = $[12];
    }
    let t12;
    if ($[13] !== step.page || $[14] !== t10 || $[15] !== t11 || $[16] !== t9 || $[17] !== totalSteps) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-[11px] font-medium text-[var(--text-3)] mb-2",
            children: [
                t8,
                " • ",
                t9,
                " ",
                t10,
                " ",
                t11,
                " ",
                totalSteps
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 559,
            columnNumber: 11
        }, this);
        $[13] = step.page;
        $[14] = t10;
        $[15] = t11;
        $[16] = t9;
        $[17] = totalSteps;
        $[18] = t12;
    } else {
        t12 = $[18];
    }
    let t13;
    if ($[19] !== currentStep || $[20] !== totalSteps) {
        let t14;
        if ($[22] !== currentStep) {
            t14 = ({
                "TourTooltip[Array.from()]": (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `h-1 flex-1 rounded-full transition-colors ${index <= currentStep ? "bg-[var(--powder-dark)]" : "bg-[var(--border)]"}`
                    }, index, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
                        lineNumber: 574,
                        columnNumber: 52
                    }, this)
            })["TourTooltip[Array.from()]"];
            $[22] = currentStep;
            $[23] = t14;
        } else {
            t14 = $[23];
        }
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: Array.from({
                length: totalSteps
            }, t14)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 581,
            columnNumber: 11
        }, this);
        $[19] = currentStep;
        $[20] = totalSteps;
        $[21] = t13;
    } else {
        t13 = $[21];
    }
    let t14;
    if ($[24] !== t12 || $[25] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1",
            children: [
                t12,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 592,
            columnNumber: 11
        }, this);
        $[24] = t12;
        $[25] = t13;
        $[26] = t14;
    } else {
        t14 = $[26];
    }
    let t15;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            size: 20,
            className: "text-[var(--text-3)]"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 601,
            columnNumber: 11
        }, this);
        $[27] = t15;
    } else {
        t15 = $[27];
    }
    let t16;
    if ($[28] !== onSkip) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onSkip,
            className: "ml-4 p-2 rounded-xl hover:bg-[var(--powder)]/10 transition-colors",
            children: t15
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 608,
            columnNumber: 11
        }, this);
        $[28] = onSkip;
        $[29] = t16;
    } else {
        t16 = $[29];
    }
    let t17;
    if ($[30] !== t14 || $[31] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between mb-4",
            children: [
                t14,
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 616,
            columnNumber: 11
        }, this);
        $[30] = t14;
        $[31] = t16;
        $[32] = t17;
    } else {
        t17 = $[32];
    }
    let t18;
    if ($[33] !== step.icon) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-12 h-12 sm:w-16 sm:h-16 bg-[var(--powder)]/15 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(step.icon, {
                size: 24,
                className: "text-[var(--powder-dark)]",
                strokeWidth: 2.5
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
                lineNumber: 625,
                columnNumber: 142
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 625,
            columnNumber: 11
        }, this);
        $[33] = step.icon;
        $[34] = t18;
    } else {
        t18 = $[34];
    }
    let t19;
    if ($[35] !== step.title) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg sm:text-xl font-bold text-[var(--text-1)] mb-2",
            children: step.title
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 633,
            columnNumber: 11
        }, this);
        $[35] = step.title;
        $[36] = t19;
    } else {
        t19 = $[36];
    }
    let t20;
    if ($[37] !== step.description) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm sm:text-base text-[var(--text-2)] leading-relaxed",
            children: step.description
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 641,
            columnNumber: 11
        }, this);
        $[37] = step.description;
        $[38] = t20;
    } else {
        t20 = $[38];
    }
    let t21;
    if ($[39] !== t18 || $[40] !== t19 || $[41] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center mb-4 sm:mb-6",
            children: [
                t18,
                t19,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 649,
            columnNumber: 11
        }, this);
        $[39] = t18;
        $[40] = t19;
        $[41] = t20;
        $[42] = t21;
    } else {
        t21 = $[42];
    }
    let t22;
    if ($[43] !== isFirstStep || $[44] !== onPrevious || $[45] !== t) {
        t22 = !isFirstStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onPrevious,
            className: "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--bg2)] transition-colors",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
                    lineNumber: 659,
                    columnNumber: 199
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-medium",
                    children: t("common.previous", "Previous")
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
                    lineNumber: 659,
                    columnNumber: 222
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 659,
            columnNumber: 27
        }, this);
        $[43] = isFirstStep;
        $[44] = onPrevious;
        $[45] = t;
        $[46] = t22;
    } else {
        t22 = $[46];
    }
    const t23 = isLastStep ? onComplete : onNext;
    const t24 = `flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--powder-dark)] text-white hover:bg-[var(--powder-darker)] transition-colors ${isFirstStep ? "col-span-2" : ""}`;
    let t25;
    if ($[47] !== isLastStep || $[48] !== t) {
        t25 = isLastStep ? t("tour.complete_tour", "Complete Tour") : t("common.next", "Next");
        $[47] = isLastStep;
        $[48] = t;
        $[49] = t25;
    } else {
        t25 = $[49];
    }
    let t26;
    if ($[50] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "font-medium",
            children: t25
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 680,
            columnNumber: 11
        }, this);
        $[50] = t25;
        $[51] = t26;
    } else {
        t26 = $[51];
    }
    let t27;
    if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
            size: 18
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 688,
            columnNumber: 11
        }, this);
        $[52] = t27;
    } else {
        t27 = $[52];
    }
    let t28;
    if ($[53] !== t23 || $[54] !== t24 || $[55] !== t26) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t23,
            className: t24,
            children: [
                t26,
                t27
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 695,
            columnNumber: 11
        }, this);
        $[53] = t23;
        $[54] = t24;
        $[55] = t26;
        $[56] = t28;
    } else {
        t28 = $[56];
    }
    let t29;
    if ($[57] !== t22 || $[58] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3",
            children: [
                t22,
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 705,
            columnNumber: 11
        }, this);
        $[57] = t22;
        $[58] = t28;
        $[59] = t29;
    } else {
        t29 = $[59];
    }
    let t30;
    if ($[60] !== t17 || $[61] !== t21 || $[62] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: t5,
            animate: t6,
            exit: t7,
            className: "fixed z-[82] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-1rem)] max-w-sm px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-strong rounded-3xl p-4 sm:p-6 shadow-float-lg",
                children: [
                    t17,
                    t21,
                    t29
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
                lineNumber: 714,
                columnNumber: 170
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx",
            lineNumber: 714,
            columnNumber: 11
        }, this);
        $[60] = t17;
        $[61] = t21;
        $[62] = t29;
        $[63] = t30;
    } else {
        t30 = $[63];
    }
    let t31;
    if ($[64] !== t30 || $[65] !== t4) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t4,
                t30
            ]
        }, void 0, true);
        $[64] = t30;
        $[65] = t4;
        $[66] = t31;
    } else {
        t31 = $[66];
    }
    return t31;
}
_s2(TourTooltip, "NOb/gJCLVjznRzrG0IpBeuqUR5k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c1 = TourTooltip;
var _c, _c1;
__turbopack_context__.k.register(_c, "TourProvider");
__turbopack_context__.k.register(_c1, "TourTooltip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTourTrigger.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePageTour",
    ()=>usePageTour,
    "useTourTrigger",
    ()=>useTourTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$IndustryTour$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/IndustryTour.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
function useTourTrigger(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "3dc2b2929ff8291b2ad2045080a2a9c82638745fd60ded618722be71cd0d83c3") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3dc2b2929ff8291b2ad2045080a2a9c82638745fd60ded618722be71cd0d83c3";
    }
    let t1;
    if ($[1] !== t0) {
        t1 = t0 === undefined ? {} : t0;
        $[1] = t0;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const options = t1;
    const { industry: t2, country: t3, startTour, isTourActive } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$IndustryTour$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTour"])();
    const tourIndustry = t2 === undefined ? "retail" : t2;
    const tourCountry = t3 === undefined ? "ke" : t3;
    const { industry: t4, country: t5, autoStart: t6, delay: t7 } = options;
    const industry = t4 === undefined ? tourIndustry : t4;
    const country = t5 === undefined ? tourCountry : t5;
    const autoStart = t6 === undefined ? false : t6;
    const delay = t7 === undefined ? 2000 : t7;
    let t8;
    let t9;
    if ($[3] !== autoStart || $[4] !== delay || $[5] !== isTourActive || $[6] !== startTour) {
        t8 = ({
            "useTourTrigger[useEffect()]": ()=>{
                const tourCompleted = localStorage.getItem("beezee-industry-tour-completed");
                if (autoStart && !tourCompleted && !isTourActive) {
                    const timer = setTimeout({
                        "useTourTrigger[useEffect() > setTimeout()]": ()=>{
                            startTour();
                        }
                    }["useTourTrigger[useEffect() > setTimeout()]"], delay);
                    return ()=>clearTimeout(timer);
                }
            }
        })["useTourTrigger[useEffect()]"];
        t9 = [
            autoStart,
            delay,
            isTourActive,
            startTour
        ];
        $[3] = autoStart;
        $[4] = delay;
        $[5] = isTourActive;
        $[6] = startTour;
        $[7] = t8;
        $[8] = t9;
    } else {
        t8 = $[7];
        t9 = $[8];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t8, t9);
    const shouldShowTourForPage = _useTourTriggerShouldShowTourForPage;
    let t10;
    if ($[9] !== industry) {
        t10 = ({
            "useTourTrigger[getRelevantSteps]": (currentPage_0)=>{
                const pageSteps = {
                    dashboard: [
                        "welcome",
                        "daily-target",
                        "buzz-insights",
                        "quick-add"
                    ],
                    cash: [
                        "cash-overview",
                        "add-transaction"
                    ],
                    credit: [
                        "credit-overview",
                        "add-credit"
                    ],
                    stock: industry === "retail" ? [
                        "inventory-overview",
                        "add-product"
                    ] : industry === "services" ? [
                        "services-overview",
                        "add-service"
                    ] : industry === "restaurant" ? [
                        "inventory-overview",
                        "add-ingredient"
                    ] : [],
                    services: industry === "services" ? [
                        "services-overview",
                        "add-service"
                    ] : [],
                    beehive: [
                        "beehive-overview"
                    ],
                    reports: [
                        "reports-overview"
                    ],
                    more: [
                        "more-overview"
                    ]
                };
                return pageSteps[currentPage_0] || [];
            }
        })["useTourTrigger[getRelevantSteps]"];
        $[9] = industry;
        $[10] = t10;
    } else {
        t10 = $[10];
    }
    const getRelevantSteps = t10;
    let t11;
    if ($[11] !== country || $[12] !== getRelevantSteps || $[13] !== industry || $[14] !== isTourActive || $[15] !== startTour) {
        t11 = {
            startTour,
            isTourActive,
            shouldShowTourForPage,
            getRelevantSteps,
            industry,
            country
        };
        $[11] = country;
        $[12] = getRelevantSteps;
        $[13] = industry;
        $[14] = isTourActive;
        $[15] = startTour;
        $[16] = t11;
    } else {
        t11 = $[16];
    }
    return t11;
}
_s(useTourTrigger, "pNG3pQrpfjdbD0vhiBAa4hTwpwc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$IndustryTour$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTour"]
    ];
});
// Hook for page-specific tour triggers
function _useTourTriggerShouldShowTourForPage(currentPage) {
    const validPages = [
        "dashboard",
        "cash",
        "credit",
        "stock",
        "services",
        "beehive",
        "reports",
        "more"
    ];
    return validPages.includes(currentPage);
}
function usePageTour(pageName) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "3dc2b2929ff8291b2ad2045080a2a9c82638745fd60ded618722be71cd0d83c3") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3dc2b2929ff8291b2ad2045080a2a9c82638745fd60ded618722be71cd0d83c3";
    }
    const { startTour, isTourActive, shouldShowTourForPage, getRelevantSteps } = useTourTrigger();
    let t0;
    if ($[1] !== pageName || $[2] !== shouldShowTourForPage || $[3] !== startTour) {
        t0 = ({
            "usePageTour[startPageTour]": ()=>{
                if (shouldShowTourForPage(pageName)) {
                    startTour();
                }
            }
        })["usePageTour[startPageTour]"];
        $[1] = pageName;
        $[2] = shouldShowTourForPage;
        $[3] = startTour;
        $[4] = t0;
    } else {
        t0 = $[4];
    }
    const startPageTour = t0;
    let t1;
    if ($[5] !== getRelevantSteps || $[6] !== pageName) {
        t1 = ({
            "usePageTour[getPageSteps]": ()=>getRelevantSteps(pageName)
        })["usePageTour[getPageSteps]"];
        $[5] = getRelevantSteps;
        $[6] = pageName;
        $[7] = t1;
    } else {
        t1 = $[7];
    }
    const getPageSteps = t1;
    let t2;
    if ($[8] !== pageName || $[9] !== shouldShowTourForPage) {
        t2 = shouldShowTourForPage(pageName);
        $[8] = pageName;
        $[9] = shouldShowTourForPage;
        $[10] = t2;
    } else {
        t2 = $[10];
    }
    let t3;
    if ($[11] !== getPageSteps) {
        t3 = getPageSteps();
        $[11] = getPageSteps;
        $[12] = t3;
    } else {
        t3 = $[12];
    }
    let t4;
    if ($[13] !== isTourActive || $[14] !== startPageTour || $[15] !== t2 || $[16] !== t3) {
        t4 = {
            startPageTour,
            isTourActive,
            shouldShowTour: t2,
            pageSteps: t3
        };
        $[13] = isTourActive;
        $[14] = startPageTour;
        $[15] = t2;
        $[16] = t3;
        $[17] = t4;
    } else {
        t4 = $[17];
    }
    return t4;
}
_s1(usePageTour, "T1XKhY912WS9m3WbbX4FVTssmPA=", false, function() {
    return [
        useTourTrigger
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/usePullToRefresh.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePullToRefresh",
    ()=>usePullToRefresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function usePullToRefresh({ onRefresh, threshold = 80, debounceMs = 100, disabled = false }) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        shouldRefresh: false
    });
    const startY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const currentY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const debounceTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const resetState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePullToRefresh.useCallback[resetState]": ()=>{
            setState({
                isPulling: false,
                isRefreshing: false,
                pullDistance: 0,
                shouldRefresh: false
            });
        }
    }["usePullToRefresh.useCallback[resetState]"], []);
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePullToRefresh.useCallback[handleTouchStart]": (e)=>{
            if (disabled) return;
            const touch = e.touches[0];
            startY.current = touch.clientY;
            currentY.current = touch.clientY;
            // Only start pull to refresh if we're at the top of the container
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                if (scrollTop > 0) return;
            }
            setState({
                "usePullToRefresh.useCallback[handleTouchStart]": (prev)=>({
                        ...prev,
                        isPulling: true,
                        pullDistance: 0,
                        shouldRefresh: false
                    })
            }["usePullToRefresh.useCallback[handleTouchStart]"]);
        }
    }["usePullToRefresh.useCallback[handleTouchStart]"], [
        disabled
    ]);
    const handleTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePullToRefresh.useCallback[handleTouchMove]": (e_0)=>{
            if (disabled || !state.isPulling) return;
            const touch_0 = e_0.touches[0];
            currentY.current = touch_0.clientY;
            const deltaY = currentY.current - startY.current;
            // Only allow pulling down (negative deltaY)
            if (deltaY > 0) return;
            const pullDistance = Math.abs(deltaY);
            const shouldRefresh = pullDistance >= threshold;
            setState({
                "usePullToRefresh.useCallback[handleTouchMove]": (prev_0)=>({
                        ...prev_0,
                        pullDistance: Math.min(pullDistance, threshold * 1.5),
                        shouldRefresh
                    })
            }["usePullToRefresh.useCallback[handleTouchMove]"]);
            // Prevent default scrolling when pulling down
            if (pullDistance > 10) {
                e_0.preventDefault();
            }
        }
    }["usePullToRefresh.useCallback[handleTouchMove]"], [
        disabled,
        state.isPulling,
        threshold
    ]);
    const handleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePullToRefresh.useCallback[handleTouchEnd]": async ()=>{
            if (disabled || !state.isPulling) return;
            if (state.shouldRefresh && !state.isRefreshing) {
                setState({
                    "usePullToRefresh.useCallback[handleTouchEnd]": (prev_1)=>({
                            ...prev_1,
                            isRefreshing: true,
                            pullDistance: threshold
                        })
                }["usePullToRefresh.useCallback[handleTouchEnd]"]);
                try {
                    await onRefresh();
                } catch (error) {
                    console.error('Pull to refresh failed:', error);
                } finally{
                    // Reset after a short delay to show completion
                    setTimeout({
                        "usePullToRefresh.useCallback[handleTouchEnd]": ()=>{
                            resetState();
                        }
                    }["usePullToRefresh.useCallback[handleTouchEnd]"], 500);
                }
            } else {
                resetState();
            }
        }
    }["usePullToRefresh.useCallback[handleTouchEnd]"], [
        disabled,
        state.isPulling,
        state.shouldRefresh,
        state.isRefreshing,
        threshold,
        onRefresh,
        resetState
    ]);
    // Mouse event handlers for desktop
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePullToRefresh.useCallback[handleMouseDown]": (e_1)=>{
            if (disabled) return;
            const mouse = e_1;
            startY.current = mouse.clientY;
            currentY.current = mouse.clientY;
            // Only start pull to refresh if we're at the top of the container
            if (containerRef.current) {
                const scrollTop_0 = containerRef.current.scrollTop;
                if (scrollTop_0 > 0) return;
            }
            setState({
                "usePullToRefresh.useCallback[handleMouseDown]": (prev_2)=>({
                        ...prev_2,
                        isPulling: true,
                        pullDistance: 0,
                        shouldRefresh: false
                    })
            }["usePullToRefresh.useCallback[handleMouseDown]"]);
        }
    }["usePullToRefresh.useCallback[handleMouseDown]"], [
        disabled
    ]);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePullToRefresh.useCallback[handleMouseMove]": (e_2)=>{
            if (disabled || !state.isPulling) return;
            const mouse_0 = e_2;
            currentY.current = mouse_0.clientY;
            const deltaY_0 = currentY.current - startY.current;
            // Only allow pulling down (positive deltaY for mouse)
            if (deltaY_0 < 0) return;
            const pullDistance_0 = Math.abs(deltaY_0);
            const shouldRefresh_0 = pullDistance_0 >= threshold;
            setState({
                "usePullToRefresh.useCallback[handleMouseMove]": (prev_3)=>({
                        ...prev_3,
                        pullDistance: Math.min(pullDistance_0, threshold * 1.5),
                        shouldRefresh: shouldRefresh_0
                    })
            }["usePullToRefresh.useCallback[handleMouseMove]"]);
            // Prevent default scrolling when pulling down
            if (pullDistance_0 > 10) {
                e_2.preventDefault();
            }
        }
    }["usePullToRefresh.useCallback[handleMouseMove]"], [
        disabled,
        state.isPulling,
        threshold
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePullToRefresh.useCallback[handleMouseUp]": async ()=>{
            if (disabled || !state.isPulling) return;
            if (state.shouldRefresh && !state.isRefreshing) {
                setState({
                    "usePullToRefresh.useCallback[handleMouseUp]": (prev_4)=>({
                            ...prev_4,
                            isRefreshing: true,
                            pullDistance: threshold
                        })
                }["usePullToRefresh.useCallback[handleMouseUp]"]);
                try {
                    await onRefresh();
                } catch (error_0) {
                    console.error('Pull to refresh failed:', error_0);
                } finally{
                    // Reset after a short delay to show completion
                    setTimeout({
                        "usePullToRefresh.useCallback[handleMouseUp]": ()=>{
                            resetState();
                        }
                    }["usePullToRefresh.useCallback[handleMouseUp]"], 500);
                }
            } else {
                resetState();
            }
        }
    }["usePullToRefresh.useCallback[handleMouseUp]"], [
        disabled,
        state.isPulling,
        state.shouldRefresh,
        state.isRefreshing,
        threshold,
        onRefresh,
        resetState
    ]);
    // Add touch and mouse event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePullToRefresh.useEffect": ()=>{
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
            return ({
                "usePullToRefresh.useEffect": ()=>{
                    // Touch events
                    element.removeEventListener('touchstart', handleTouchStart);
                    element.removeEventListener('touchmove', handleTouchMove);
                    element.removeEventListener('touchend', handleTouchEnd);
                    // Mouse events
                    element.removeEventListener('mousedown', handleMouseDown);
                    element.removeEventListener('mousemove', handleMouseMove);
                    element.removeEventListener('mouseup', handleMouseUp);
                    element.removeEventListener('mouseleave', handleMouseUp);
                }
            })["usePullToRefresh.useEffect"];
        }
    }["usePullToRefresh.useEffect"], [
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        disabled
    ]);
    // Debounce pull distance updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePullToRefresh.useEffect": ()=>{
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
                debounceTimer.current = null;
            }
            debounceTimer.current = setTimeout({
                "usePullToRefresh.useEffect": ()=>{
                // Debounced updates can be handled here if needed
                }
            }["usePullToRefresh.useEffect"], debounceMs);
            return ({
                "usePullToRefresh.useEffect": ()=>{
                    if (debounceTimer.current) {
                        clearTimeout(debounceTimer.current);
                    }
                }
            })["usePullToRefresh.useEffect"];
        }
    }["usePullToRefresh.useEffect"], [
        state.pullDistance,
        debounceMs
    ]);
    return {
        containerRef,
        ...state,
        resetState
    };
}
_s(usePullToRefresh, "mQZRO875Pwu0cUAB48p6G+k13+c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIndustryData",
    ()=>useIndustryData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabase.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useIndustryData({ industry, dataType, businessId }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Map dataType to actual table names
    const tableNameMap = {
        transactions: 'transactions',
        expenses: 'expenses',
        credit: 'credit',
        inventory: 'inventory',
        targets: 'targets'
    };
    const tableName = tableNameMap[dataType];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIndustryData.useEffect": ()=>{
            const fetchData = {
                "useIndustryData.useEffect.fetchData": async ()=>{
                    if (!businessId) {
                        setLoading(false);
                        return;
                    }
                    setLoading(true);
                    setError(null);
                    try {
                        let query = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from(tableName).select('*').eq('business_id', businessId);
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
                }
            }["useIndustryData.useEffect.fetchData"];
            fetchData();
        }
    }["useIndustryData.useEffect"], [
        industry,
        dataType,
        businessId,
        tableName
    ]);
    const create = async (data_0)=>{
        if (!businessId) {
            throw new Error('Business ID required for creating items');
        }
        try {
            const newItem = {
                business_id: businessId,
                industry,
                created_at: new Date().toISOString(),
                ...data_0
            };
            const { data: result, error: dbError_0 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from(tableName).insert([
                newItem
            ]).select().single();
            if (dbError_0) {
                console.error(`❌ Error creating ${dataType}:`, dbError_0);
                throw dbError_0;
            }
            setItems((prev)=>[
                    result,
                    ...prev
                ]);
            return result;
        } catch (err_0) {
            const errorMessage_0 = err_0 instanceof Error ? err_0.message : 'Failed to create item';
            setError(errorMessage_0);
            throw err_0;
        }
    };
    const update = async (id, data_1)=>{
        try {
            const updateData = {
                updated_at: new Date().toISOString(),
                ...data_1
            };
            const { data: result_0, error: dbError_1 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from(tableName).update(updateData).eq('id', id).select().single();
            if (dbError_1) {
                console.error(`❌ Error updating ${dataType}:`, dbError_1);
                throw dbError_1;
            }
            setItems((prev_0)=>prev_0.map((item)=>item.id === id ? result_0 : item));
            return result_0;
        } catch (err_1) {
            const errorMessage_1 = err_1 instanceof Error ? err_1.message : 'Failed to update item';
            setError(errorMessage_1);
            throw err_1;
        }
    };
    const remove = async (id_0)=>{
        try {
            const { error: dbError_2 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from(tableName).delete().eq('id', id_0);
            if (dbError_2) {
                console.error(`❌ Error deleting ${dataType}:`, dbError_2);
                throw dbError_2;
            }
            setItems((prev_1)=>prev_1.filter((item_0)=>item_0.id !== id_0));
            return true;
        } catch (err_2) {
            const errorMessage_2 = err_2 instanceof Error ? err_2.message : 'Failed to delete item';
            setError(errorMessage_2);
            throw err_2;
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
_s(useIndustryData, "3a4WGIUzx2hoS/cdRKLB8fOExE8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useNotifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNotifications",
    ()=>useNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/supabaseAdmin.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function useNotifications() {
    _s();
    const { business } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchNotifications = async ()=>{
        if (!business?.id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').select('*').eq('business_id', business.id).order('created_at', {
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
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').update({
                read: true
            }).eq('id', notificationId);
            if (updateError) throw updateError;
            setNotifications((prev)=>prev.map((notif)=>notif.id === notificationId ? {
                        ...notif,
                        read: true
                    } : notif));
        } catch (err_0) {
            console.error('Error marking notification as read:', err_0);
            throw err_0;
        }
    };
    const markAllAsRead = async ()=>{
        if (!business?.id) return;
        try {
            const { error: updateError_0 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').update({
                read: true
            }).eq('business_id', business.id).eq('read', false);
            if (updateError_0) throw updateError_0;
            setNotifications((prev_0)=>prev_0.map((notif_0)=>({
                        ...notif_0,
                        read: true
                    })));
        } catch (err_1) {
            console.error('Error marking all notifications as read:', err_1);
            throw err_1;
        }
    };
    const deleteNotification = async (notificationId_0)=>{
        try {
            const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').delete().eq('id', notificationId_0);
            if (deleteError) throw deleteError;
            setNotifications((prev_1)=>prev_1.filter((notif_1)=>notif_1.id !== notificationId_0));
        } catch (err_2) {
            console.error('Error deleting notification:', err_2);
            throw err_2;
        }
    };
    const clearAll = async ()=>{
        if (!business?.id) return;
        try {
            const { error: deleteError_0 } = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$supabaseAdmin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('notifications').delete().eq('business_id', business.id);
            if (deleteError_0) throw deleteError_0;
            setNotifications([]);
        } catch (err_3) {
            console.error('Error clearing all notifications:', err_3);
            throw err_3;
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useNotifications.useEffect": ()=>{
            fetchNotifications();
        }
    }["useNotifications.useEffect"], [
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
_s(useNotifications, "IVsvfFepWDh3pxoborJkTksKa6o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useLanguageSafe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useLanguageSafe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
// New TanStack Query hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTransactionsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTransactionsTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useExpensesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useExpensesTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useCreditTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useCreditTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useInventoryTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useInventoryTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTargetsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTargetsTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBeehiveTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBeehiveTanStack.ts [app-client] (ecmascript)");
// Signup hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignupValidation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignupValidation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useBusinessCreation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useBusinessCreation.ts [app-client] (ecmascript)");
// Real-time hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useRealtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useRealtime.ts [app-client] (ecmascript)");
// Utility hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useToast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTourTrigger$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTourTrigger.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$usePullToRefresh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/usePullToRefresh.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useGlobalRefresh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useGlobalRefresh.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useIndustryDataNew$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useIndustryDataNew.ts [app-client] (ecmascript)"); // Alias for compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useNotifications.ts [app-client] (ecmascript)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/utensils.js [app-client] (ecmascript) <export default as Utensils>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/car.js [app-client] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scissors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scissors$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/scissors.js [app-client] (ecmascript) <export default as Scissors>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/ruler.js [app-client] (ecmascript) <export default as Ruler>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/wrench.js [app-client] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/laptop.js [app-client] (ecmascript) <export default as Laptop>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$providers$2f$ToastProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/providers/ToastProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$BusinessProfileContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/BusinessProfileContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const industryLabels = {
    retail: {
        name: 'Retail',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
    },
    food: {
        name: 'Restaurant',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"]
    },
    transport: {
        name: 'Transport',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"]
    },
    salon: {
        name: 'Salon',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scissors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scissors$3e$__["Scissors"]
    },
    tailor: {
        name: 'Tailor',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__["Ruler"]
    },
    repairs: {
        name: 'Repairs',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"]
    },
    freelance: {
        name: 'Freelance',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__["Laptop"]
    }
};
function Header(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(41);
    if ($[0] !== "65e9ed253a67945368b4b2e96ecf1d304d861676bd2c41e9abdabe3faaf049ef") {
        for(let $i = 0; $i < 41; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "65e9ed253a67945368b4b2e96ecf1d304d861676bd2c41e9abdabe3faaf049ef";
    }
    const { industry, country } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { currentLanguage, setLanguage, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const [showLangSelector, setShowLangSelector] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { business } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    const { profile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$BusinessProfileContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBusinessProfile"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$providers$2f$ToastProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToastContext"])();
    let t1;
    if ($[1] !== industry) {
        t1 = industryLabels[industry] || {
            name: "Business",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
        };
        $[1] = industry;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const industryInfo = t1;
    const Icon = industryInfo.icon;
    const businessName = profile?.businessName || business?.business_name || "My Business";
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    let t2;
    if ($[3] !== country || $[4] !== industry || $[5] !== pathname) {
        t2 = pathname?.endsWith(`/${country}/${industry}`) || pathname?.endsWith(`/${country}/${industry}/`);
        $[3] = country;
        $[4] = industry;
        $[5] = pathname;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const isHomeDashboard = t2;
    let t3;
    if ($[7] !== country) {
        t3 = ({
            "Header[getCountryLanguages]": ()=>{
                const countryLanguages = {
                    "KE": [
                        {
                            code: "en",
                            name: "English",
                            nativeName: "English",
                            flag: "\uD83C\uDDEC\uD83C\uDDE7"
                        },
                        {
                            code: "sw",
                            name: "Swahili",
                            nativeName: "Kiswahili",
                            flag: "\uD83C\uDDF0\uD83C\uDDEA"
                        }
                    ],
                    "ZA": [
                        {
                            code: "en",
                            name: "English",
                            nativeName: "English",
                            flag: "\uD83C\uDDEC\uD83C\uDDE7"
                        },
                        {
                            code: "af",
                            name: "Afrikaans",
                            nativeName: "Afrikaans",
                            flag: "\uD83C\uDDFF\uD83C\uDDE6"
                        },
                        {
                            code: "zu",
                            name: "Zulu",
                            nativeName: "isiZulu",
                            flag: "\uD83C\uDDFF\uD83C\uDDE6"
                        },
                        {
                            code: "xh",
                            name: "Xhosa",
                            nativeName: "isiXhosa",
                            flag: "\uD83C\uDDFF\uD83C\uDDE6"
                        }
                    ],
                    "NG": [
                        {
                            code: "en",
                            name: "English",
                            nativeName: "English",
                            flag: "\uD83C\uDDEC\uD83C\uDDE7"
                        },
                        {
                            code: "yo",
                            name: "Yoruba",
                            nativeName: "Yor\xF9b\xE1",
                            flag: "\uD83C\uDDF3\uD83C\uDDEC"
                        },
                        {
                            code: "ig",
                            name: "Igbo",
                            nativeName: "Igbo",
                            flag: "\uD83C\uDDF3\uD83C\uDDEC"
                        },
                        {
                            code: "ha",
                            name: "Hausa",
                            nativeName: "Hausa",
                            flag: "\uD83C\uDDF3\uD83C\uDDEC"
                        }
                    ],
                    "GH": [
                        {
                            code: "en",
                            name: "English",
                            nativeName: "English",
                            flag: "\uD83C\uDDEC\uD83C\uDDED"
                        },
                        {
                            code: "tw",
                            name: "Twi",
                            nativeName: "Twi",
                            flag: "\uD83C\uDDEC\uD83C\uDDED"
                        }
                    ],
                    "UG": [
                        {
                            code: "en",
                            name: "English",
                            nativeName: "English",
                            flag: "\uD83C\uDDFA\uD83C\uDDEC"
                        },
                        {
                            code: "lg",
                            name: "Luganda",
                            nativeName: "Luganda",
                            flag: "\uD83C\uDDFA\uD83C\uDDEC"
                        }
                    ],
                    "RW": [
                        {
                            code: "en",
                            name: "English",
                            nativeName: "English",
                            flag: "\uD83C\uDDF7\uD83C\uDDFC"
                        },
                        {
                            code: "rw",
                            name: "Kinyarwanda",
                            nativeName: "Kinyarwanda",
                            flag: "\uD83C\uDDF7\uD83C\uDDFC"
                        }
                    ],
                    "TZ": [
                        {
                            code: "en",
                            name: "English",
                            nativeName: "English",
                            flag: "\uD83C\uDDF9\uD83C\uDDFF"
                        },
                        {
                            code: "sw",
                            name: "Swahili",
                            nativeName: "Kiswahili",
                            flag: "\uD83C\uDDF9\uD83C\uDDFF"
                        }
                    ]
                };
                const upperCountry = (country || "").toUpperCase();
                return countryLanguages[upperCountry] || countryLanguages.KE;
            }
        })["Header[getCountryLanguages]"];
        $[7] = country;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    const getCountryLanguages = t3;
    const availableLanguages = getCountryLanguages();
    availableLanguages.find({
        "Header[availableLanguages.find()]": (lang)=>lang.code === currentLanguage
    }["Header[availableLanguages.find()]"]) || availableLanguages[0];
    let t4;
    if ($[9] !== t) {
        t4 = ({
            "Header[getLanguageName]": (langCode)=>{
                const languageKeyMap = {
                    "en": "lang.english",
                    "sw": "lang.swahili",
                    "ha": "lang.hausa",
                    "yo": "lang.yoruba",
                    "ig": "lang.igbo",
                    "zu": "lang.zulu",
                    "xh": "lang.xhosa",
                    "af": "lang.afrikaans",
                    "tw": "lang.twi",
                    "rw": "lang.kinyarwanda",
                    "lg": "lang.luganda"
                };
                const key = languageKeyMap[langCode] || `lang.${langCode}`;
                return t(key, langCode.charAt(0).toUpperCase() + langCode.slice(1));
            }
        })["Header[getLanguageName]"];
        $[9] = t;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    const getLanguageName = t4;
    let t5;
    let t6;
    if ($[11] !== showLangSelector) {
        t5 = ({
            "Header[useEffect()]": ()=>{
                const handleClickOutside = {
                    "Header[useEffect() > handleClickOutside]": (event)=>{
                        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                            setShowLangSelector(false);
                        }
                    }
                }["Header[useEffect() > handleClickOutside]"];
                if (showLangSelector) {
                    document.addEventListener("mousedown", handleClickOutside);
                }
                return ()=>{
                    document.removeEventListener("mousedown", handleClickOutside);
                };
            }
        })["Header[useEffect()]"];
        t6 = [
            showLangSelector
        ];
        $[11] = showLangSelector;
        $[12] = t5;
        $[13] = t6;
    } else {
        t5 = $[12];
        t6 = $[13];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t5, t6);
    let t7;
    if ($[14] !== isHomeDashboard || $[15] !== router) {
        t7 = !isHomeDashboard && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: {
                "Header[<button>.onClick]": ()=>router.back()
            }["Header[<button>.onClick]"],
            className: "p-2.5 -ml-2 rounded-xl hover:bg-[var(--powder)]/10 active:scale-95 transition-all duration-200 no-select button-touch flex items-center text-[var(--powder-dark)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                size: 24,
                strokeWidth: 2.5
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                lineNumber: 277,
                columnNumber: 210
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 275,
            columnNumber: 30
        }, this);
        $[14] = isHomeDashboard;
        $[15] = router;
        $[16] = t7;
    } else {
        t7 = $[16];
    }
    const t8 = `flex items-center justify-center pointer-events-none ${!isHomeDashboard ? "flex-1" : ""}`;
    let t9;
    if ($[17] !== Icon) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            size: 20,
            className: "text-[var(--text-1)] mr-2",
            strokeWidth: 2.5
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 287,
            columnNumber: 10
        }, this);
        $[17] = Icon;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] !== businessName || $[20] !== isHomeDashboard) {
        t10 = isHomeDashboard && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-[var(--text-1)] font-medium text-sm",
            children: businessName
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 295,
            columnNumber: 30
        }, this);
        $[19] = businessName;
        $[20] = isHomeDashboard;
        $[21] = t10;
    } else {
        t10 = $[21];
    }
    let t11;
    if ($[22] !== t10 || $[23] !== t8 || $[24] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t8,
            children: [
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 304,
            columnNumber: 11
        }, this);
        $[22] = t10;
        $[23] = t8;
        $[24] = t9;
        $[25] = t11;
    } else {
        t11 = $[25];
    }
    let t12;
    if ($[26] !== showLangSelector) {
        t12 = ({
            "Header[<button>.onClick]": ()=>{
                setShowLangSelector(!showLangSelector);
            }
        })["Header[<button>.onClick]"];
        $[26] = showLangSelector;
        $[27] = t12;
    } else {
        t12 = $[27];
    }
    let t13;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
            size: 20,
            strokeWidth: 2.5
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 326,
            columnNumber: 11
        }, this);
        $[28] = t13;
    } else {
        t13 = $[28];
    }
    let t14;
    if ($[29] !== t12) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-1",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: t12,
                className: "p-2.5 -mr-2 rounded-xl hover:bg-[var(--powder)]/10 active:scale-95 transition-all duration-200 no-select button-touch text-[var(--powder)]",
                children: t13
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                lineNumber: 333,
                columnNumber: 52
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 333,
            columnNumber: 11
        }, this);
        $[29] = t12;
        $[30] = t14;
    } else {
        t14 = $[30];
    }
    let t15;
    if ($[31] !== t11 || $[32] !== t14 || $[33] !== t7) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "fixed top-0 left-0 right-0 z-[60] bg-[var(--bg)] safe-area-top",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md mx-auto px-5 h-16 flex items-center justify-between",
                children: [
                    t7,
                    t11,
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                lineNumber: 341,
                columnNumber: 94
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 341,
            columnNumber: 11
        }, this);
        $[31] = t11;
        $[32] = t14;
        $[33] = t7;
        $[34] = t15;
    } else {
        t15 = $[34];
    }
    const T0 = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"];
    const t16 = showLangSelector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        ref: dropdownRef,
        initial: {
            opacity: 0,
            scale: 0.95,
            y: -10
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -10
        },
        transition: {
            duration: 0.2
        },
        className: "fixed top-20 right-5 z-[90] glass-strong rounded-2xl shadow-float-lg p-2 min-w-[200px] max-h-[300px] overflow-y-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-3 py-2 mb-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-semibold text-[var(--text-3)] uppercase tracking-wider",
                        children: t("language.select")
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                        lineNumber: 364,
                        columnNumber: 189
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                    lineNumber: 364,
                    columnNumber: 157
                }, this),
                availableLanguages.map({
                    "Header[availableLanguages.map()]": (lang_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "Header[availableLanguages.map() > <button>.onClick]": ()=>{
                                    setLanguage(lang_0.code);
                                    setShowLangSelector(false);
                                }
                            }["Header[availableLanguages.map() > <button>.onClick]"],
                            className: `w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--powder)]/10 transition-colors ${currentLanguage === lang_0.code ? "bg-[var(--powder)]/20 text-[var(--powder-dark)]" : "text-[var(--text-1)]"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg",
                                    children: lang_0.flag
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                                    lineNumber: 370,
                                    columnNumber: 290
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-medium",
                                            children: getLanguageName(lang_0.code)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                                            lineNumber: 370,
                                            columnNumber: 360
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-[var(--text-3)]",
                                            children: lang_0.nativeName
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                                            lineNumber: 370,
                                            columnNumber: 433
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                                    lineNumber: 370,
                                    columnNumber: 336
                                }, this),
                                currentLanguage === lang_0.code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-2 h-2 bg-[var(--powder-dark)] rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                                    lineNumber: 370,
                                    columnNumber: 546
                                }, this)
                            ]
                        }, lang_0.code, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
                            lineNumber: 365,
                            columnNumber: 55
                        }, this)
                }["Header[availableLanguages.map()]"])
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 364,
            columnNumber: 135
        }, this)
    }, void 0, false, {
        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
        lineNumber: 350,
        columnNumber: 35
    }, this);
    let t17;
    if ($[35] !== T0 || $[36] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T0, {
            children: t16
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx",
            lineNumber: 374,
            columnNumber: 11
        }, this);
        $[35] = T0;
        $[36] = t16;
        $[37] = t17;
    } else {
        t17 = $[37];
    }
    let t18;
    if ($[38] !== t15 || $[39] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t15,
                t17
            ]
        }, void 0, true);
        $[38] = t15;
        $[39] = t17;
        $[40] = t18;
    } else {
        t18 = $[40];
    }
    return t18;
}
_s(Header, "qAJE8M06lGNf8KiMFoO9XYBpKhM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$BusinessProfileContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBusinessProfile"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$providers$2f$ToastProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToastContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-client] (ecmascript) <export useServicesTanStack as useServices>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useServices",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useServicesTanStack"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-client] (ecmascript)");
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-client] (ecmascript) <export useAppointmentsTanStack as useAppointments>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppointments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppointmentsTanStack"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-client] (ecmascript)");
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddAppointmentModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useServicesTanStack__as__useServices$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-client] (ecmascript) <export useServicesTanStack as useServices>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useAppointmentsTanStack__as__useAppointments$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-client] (ecmascript) <export useAppointmentsTanStack as useAppointments>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$providers$2f$ToastProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/providers/ToastProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function AddAppointmentModal({ isOpen, onClose, onSuccess, industry, country }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const { business } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    const { data: services } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useServicesTanStack__as__useServices$3e$__["useServices"])({
        industry,
        businessId: business?.id
    });
    const { addAppointment: addAppointment } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useAppointmentsTanStack__as__useAppointments$3e$__["useAppointments"])({
        industry,
        businessId: business?.id
    });
    const { showSuccess, showError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$providers$2f$ToastProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToastContext"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        customer_name: '',
        customer_contact: '',
        service_id: '',
        service_name: '',
        appointment_date: '',
        appointment_time: '',
        duration: 60,
        notes: ''
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Reset form when modal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddAppointmentModal.useEffect": ()=>{
            if (isOpen) {
                setFormData({
                    customer_name: '',
                    customer_contact: '',
                    service_id: '',
                    service_name: '',
                    appointment_date: '',
                    appointment_time: '',
                    duration: 60,
                    notes: ''
                });
                setErrors({});
            }
        }
    }["AddAppointmentModal.useEffect"], [
        isOpen
    ]);
    // Generate time slots (24-hour basis, 15-minute intervals)
    const generateTimeSlots = ()=>{
        const slots = [];
        for(let hour = 0; hour <= 23; hour++){
            for(let minute = 0; minute < 60; minute += 15){
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push(timeString);
            }
        }
        return slots;
    };
    const timeSlots = generateTimeSlots();
    // Get today's date in YYYY-MM-DD format
    const getTodayDate = ()=>{
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    const handleInputChange = (field, value)=>{
        setFormData((prev)=>({
                ...prev,
                [field]: value
            }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev_0)=>({
                    ...prev_0,
                    [field]: undefined
                }));
        }
    };
    const handleServiceChange = (serviceId)=>{
        const selectedService = services.find((s)=>s.id === serviceId);
        setFormData((prev_1)=>({
                ...prev_1,
                service_id: serviceId,
                service_name: selectedService?.service_name || '',
                duration: selectedService?.duration || 60
            }));
        if (errors.service_id) {
            setErrors((prev_2)=>({
                    ...prev_2,
                    service_id: undefined
                }));
        }
    };
    const validate = ()=>{
        const newErrors = {};
        if (!formData.customer_name.trim() || formData.customer_name.trim().length < 2) {
            newErrors.customer_name = t('calendar.error.customer_name', 'Customer name is required (min 2 characters)');
        }
        if (!formData.service_id) {
            newErrors.service_id = t('calendar.error.service', 'Please select a service');
        }
        if (!formData.appointment_date) {
            newErrors.appointment_date = t('calendar.error.date', 'Please select a date');
        } else {
            const selectedDate = new Date(formData.appointment_date);
            const today_0 = new Date();
            today_0.setHours(0, 0, 0, 0);
            if (selectedDate < today_0) {
                newErrors.appointment_date = t('calendar.error.past_date', 'Date cannot be in the past');
            }
        }
        if (!formData.appointment_time) {
            newErrors.appointment_time = t('calendar.error.time', 'Please select a time');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validate()) return;
        if (!business?.id) {
            showError(t('calendar.error.no_business', 'Business profile not found'));
            return;
        }
        // Find the selected service to get its price
        const selectedService_0 = services.find((s_0)=>s_0.id === formData.service_id);
        const servicePrice = selectedService_0?.price || 0;
        console.log('📅 Creating appointment:', {
            serviceName: selectedService_0?.service_name,
            servicePrice,
            customerName: formData.customer_name
        });
        setSubmitting(true);
        try {
            await addAppointment({
                business_id: business.id,
                industry,
                customer_name: formData.customer_name.trim(),
                customer_contact: formData.customer_contact.trim() || undefined,
                service_id: formData.service_id,
                service_name: formData.service_name,
                appointment_date: formData.appointment_date,
                appointment_time: formData.appointment_time,
                duration: formData.duration,
                notes: formData.notes.trim() || undefined,
                status: 'pending',
                metadata: {
                    price: servicePrice,
                    service_name: formData.service_name
                }
            });
            showSuccess(t('calendar.appointment_added', 'Appointment added successfully'));
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to add appointment:', error);
            showError(t('calendar.appointment_error', 'Failed to add appointment'));
        } finally{
            setSubmitting(false);
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    onClick: onClose,
                    className: "absolute inset-0 bg-black/20 backdrop-blur-xl"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.95,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.95,
                        y: 20
                    },
                    className: "relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-100/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-8 sm:w-16"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 242,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg sm:text-lg font-semibold text-black",
                                    children: t('calendar.add_appointment', 'Add Appointment')
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-gray-200/50 hover:bg-gray-300/50 flex items-center justify-center transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 16,
                                        className: "text-black"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                        lineNumber: 247,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-black mb-2",
                                            children: [
                                                t('calendar.customer_name', 'Customer Name'),
                                                " *"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "absolute left-3 top-1/2 -translate-y-1/2 text-black/50",
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.customer_name,
                                                    onChange: (e_0)=>handleInputChange('customer_name', e_0.target.value),
                                                    className: `w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border ${errors.customer_name ? 'border-red-500' : 'border-gray-300'} text-black placeholder-black/50 text-base sm:text-sm`,
                                                    placeholder: "John Doe"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this),
                                        errors.customer_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-red-500 flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 19
                                                }, this),
                                                errors.customer_name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 262,
                                            columnNumber: 40
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-black mb-2",
                                            children: t('calendar.customer_contact', 'Contact')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "absolute left-3 top-1/2 -translate-y-1/2 text-black/50",
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.customer_contact,
                                                    onChange: (e_1)=>handleInputChange('customer_contact', e_1.target.value),
                                                    className: "w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 text-black placeholder-black/50 text-base sm:text-sm",
                                                    placeholder: "+254 700 000 000"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 269,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-black mb-2",
                                            children: [
                                                t('calendar.select_service', 'Select Service'),
                                                " *"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: formData.service_id,
                                            onChange: (e_2)=>handleServiceChange(e_2.target.value),
                                            className: `w-full px-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border ${errors.service_id ? 'border-red-500' : 'border-gray-300'} text-black text-base sm:text-sm`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: t('calendar.select_service', 'Select Service')
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 285,
                                                    columnNumber: 17
                                                }, this),
                                                services.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: service.id,
                                                        children: [
                                                            service.service_name,
                                                            " ",
                                                            service.price ? `- ${service.price}` : ''
                                                        ]
                                                    }, service.id, true, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 53
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 284,
                                            columnNumber: 15
                                        }, this),
                                        errors.service_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-red-500 flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 19
                                                }, this),
                                                errors.service_id
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 290,
                                            columnNumber: 37
                                        }, this),
                                        services.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-black/50",
                                            children: t('calendar.no_services', 'No services available. Please add services first.')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 294,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-black mb-2",
                                            children: [
                                                t('calendar.select_date', 'Select Date'),
                                                " *"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 301,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    className: "absolute left-3 top-1/2 -translate-y-1/2 text-black/50",
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    value: formData.appointment_date,
                                                    onChange: (e_3)=>handleInputChange('appointment_date', e_3.target.value),
                                                    min: getTodayDate(),
                                                    className: `w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border ${errors.appointment_date ? 'border-red-500' : 'border-gray-300'} text-black text-base sm:text-sm`
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 304,
                                            columnNumber: 15
                                        }, this),
                                        errors.appointment_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-red-500 flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 309,
                                                    columnNumber: 19
                                                }, this),
                                                errors.appointment_date
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 308,
                                            columnNumber: 43
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 300,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-black mb-2",
                                            children: [
                                                t('calendar.select_time', 'Select Time'),
                                                " *"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 316,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "absolute left-3 top-1/2 -translate-y-1/2 text-black/50",
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: formData.appointment_time,
                                                    onChange: (e_4)=>handleInputChange('appointment_time', e_4.target.value),
                                                    className: `w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border ${errors.appointment_time ? 'border-red-500' : 'border-gray-300'} text-black text-base sm:text-sm`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: t('calendar.select_time', 'Select Time')
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                            lineNumber: 322,
                                                            columnNumber: 19
                                                        }, this),
                                                        timeSlots.map((time)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: time,
                                                                children: time
                                                            }, time, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 42
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 321,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 319,
                                            columnNumber: 15
                                        }, this),
                                        errors.appointment_time && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-red-500 flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 19
                                                }, this),
                                                errors.appointment_time
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 326,
                                            columnNumber: 43
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-black mb-2",
                                            children: t('calendar.duration_minutes', 'Duration (minutes)')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 334,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: formData.duration,
                                            onChange: (e_5)=>handleInputChange('duration', parseInt(e_5.target.value) || 60),
                                            min: "15",
                                            max: "480",
                                            step: "15",
                                            className: "w-full px-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 text-black text-base sm:text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 337,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 333,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-black mb-2",
                                            children: t('calendar.notes', 'Notes')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 342,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    className: "absolute left-3 top-3 text-black/50",
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    value: formData.notes,
                                                    onChange: (e_6)=>handleInputChange('notes', e_6.target.value),
                                                    rows: 3,
                                                    className: "w-full pl-10 pr-4 py-4 sm:py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-300 text-black placeholder-black/50 resize-none text-base sm:text-sm",
                                                    placeholder: t('calendar.notes_placeholder', 'Any special requests or notes...')
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 345,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row gap-3 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: onClose,
                                            className: "flex-1 px-6 py-4 sm:py-3 bg-gray-200/50 text-black font-medium rounded-xl hover:bg-gray-300/50 transition-colors text-base sm:text-sm",
                                            children: t('common.cancel', 'Cancel')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 353,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: submitting || services.length === 0,
                                            className: "flex-1 px-6 py-4 sm:py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm",
                                            children: submitting ? t('common.saving', 'Saving...') : t('calendar.book_appointment', 'Book Appointment')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                            lineNumber: 356,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                                    lineNumber: 352,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
            lineNumber: 216,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx",
        lineNumber: 215,
        columnNumber: 10
    }, this);
}
_s(AddAppointmentModal, "kLDJz2NSXa0RryEHIp4G1QiJUGc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useServicesTanStack__as__useServices$3e$__["useServices"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useAppointmentsTanStack__as__useAppointments$3e$__["useAppointments"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$providers$2f$ToastProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToastContext"]
    ];
});
_c = AddAppointmentModal;
var _c;
__turbopack_context__.k.register(_c, "AddAppointmentModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Calendar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useAppointmentsTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTransactionsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTransactionsTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useToast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/BottomNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$AddAppointmentModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/AddAppointmentModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
function Calendar({ industry, country }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const { business, loading: businessLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    // TanStack Query handles online/offline automatically
    const { showSuccess, showError, showWarning, showInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { data: appointments, isLoading, addAppointment, deleteAppointment, updateAppointment, isPending, isOffline } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppointmentsTanStack"])({
        businessId: business?.id,
        industry
    });
    const { data: services } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useServicesTanStack"])({
        businessId: business?.id,
        industry
    });
    const { addTransaction } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTransactionsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransactionsTanStack"])({
        businessId: business?.id,
        industry
    });
    // Show error if business is not available
    if (!businessLoading && !business) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-red-600 mb-4",
                        children: "Business information not available"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Please sign in to access the calendar"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
            lineNumber: 66,
            columnNumber: 12
        }, this);
    }
    // Helper functions
    const getTodayAppointments = ()=>{
        if (!appointments) return [];
        const today = new Date().toISOString().split('T')[0];
        return appointments.filter((apt)=>apt.appointment_date === today);
    };
    const getUpcomingAppointments = ()=>{
        if (!appointments) return [];
        const today_0 = new Date().toISOString().split('T')[0];
        return appointments.filter((apt_0)=>apt_0.appointment_date > today_0 && apt_0.status === 'pending');
    };
    const getAppointmentsByStatus = (status)=>{
        if (!appointments) return [];
        return appointments.filter((apt_1)=>apt_1.status === status);
    };
    const getServiceById = (id)=>{
        if (!services) return null;
        return services.find((s)=>s.id === id);
    };
    // State
    const [currentDate, setCurrentDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCancelModal, setShowCancelModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [appointmentToCancel, setAppointmentToCancel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Navigation
    const navigateMonth = (direction)=>{
        setCurrentDate((prev)=>new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    };
    const navigateToToday = ()=>{
        setCurrentDate(new Date());
    };
    // Get days in month
    const getDaysInMonth = (date)=>{
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (date_0)=>{
        return new Date(date_0.getFullYear(), date_0.getMonth(), 1).getDay();
    };
    // Filter appointments - add null check for appointments
    const filteredAppointments = (appointments || []).filter((apt_2)=>{
        const matchesSearch = !searchTerm || apt_2.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || apt_2.service_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || apt_2.status === filter;
        return matchesSearch && matchesFilter;
    });
    // Handle appointment actions
    const handleAddAppointment = async (appointmentData)=>{
        try {
            // Find the selected service to get its price
            const selectedService = services.find((s_0)=>s_0.id === appointmentData.service_id);
            const servicePrice = selectedService?.price || 0;
            console.log('📅 Creating appointment with price:', {
                serviceName: selectedService?.service_name,
                servicePrice,
                customerName: appointmentData.customer_name
            });
            // Add the appointment
            await addAppointment(appointmentData);
            // Create a transaction for the appointment booking to show in recent activities
            if (servicePrice && servicePrice > 0) {
                await addTransaction({
                    business_id: business?.id,
                    industry,
                    amount: servicePrice,
                    category: 'appointment_booking',
                    description: `Appointment booked: ${appointmentData.service_name || 'service'} - ${appointmentData.customer_name || 'Customer'}`,
                    customer_name: appointmentData.customer_name || 'Customer',
                    payment_method: 'pending',
                    transaction_date: appointmentData.appointment_date || new Date().toISOString().split('T')[0],
                    metadata: {
                        appointment_id: 'pending',
                        // Will be updated with real ID after appointment is created
                        service_name: appointmentData.service_name,
                        appointment_date: appointmentData.appointment_date,
                        appointment_time: appointmentData.appointment_time
                    }
                });
            }
            setShowAddModal(false);
            setSelectedDate(null);
        // TanStack Query handles refetching automatically
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };
    const handleCompleteAppointment = async (appointmentId)=>{
        try {
            if (!appointments) return;
            const appointment = appointments.find((apt_3)=>apt_3.id === appointmentId);
            if (!appointment || !business?.id) return;
            console.log('🔄 Starting appointment completion:', {
                appointmentId,
                serviceName: appointment.service_name,
                customerName: appointment.customer_name,
                price: appointment.metadata?.price,
                isOffline
            });
            // Update appointment status to completed
            updateAppointment({
                id: appointmentId,
                updates: {
                    status: 'completed',
                    updated_at: new Date().toISOString()
                }
            });
            // Create transaction for payment if price exists
            if (appointment.metadata?.price && appointment.metadata.price > 0) {
                const transactionData = {
                    business_id: business.id,
                    industry: industry,
                    amount: appointment.metadata.price,
                    category: 'service_payment',
                    description: `Payment for ${appointment.service_name || 'service'} - ${appointment.customer_name || 'Customer'}`,
                    customer_name: appointment.customer_name || 'Customer',
                    payment_method: 'cash',
                    transaction_date: new Date().toISOString().split('T')[0],
                    metadata: {
                        appointment_id: appointmentId,
                        service_name: appointment.service_name,
                        appointment_date: appointment.appointment_date,
                        appointment_time: appointment.appointment_time
                    }
                };
                console.log('💰 Creating service payment transaction:', transactionData);
                // TanStack Query handles online/offline automatically
                await addTransaction(transactionData);
                console.log('✅ Service payment transaction created successfully');
            } else {
                console.log('ℹ️ No price found for appointment, skipping transaction creation');
            }
            showSuccess(t('calendar.complete_success', 'Appointment completed successfully'));
        } catch (error_0) {
            console.error('Error completing appointment:', error_0);
            showError(t('calendar.complete_error', 'Failed to complete appointment. Please try again.'));
        }
    };
    const handleCancelAppointment = async (appointmentId_0, reason)=>{
        try {
            // Update appointment status to cancelled
            updateAppointment({
                id: appointmentId_0,
                updates: {
                    status: 'cancelled',
                    updated_at: new Date().toISOString(),
                    notes: reason ? `Cancelled: ${reason}` : undefined
                }
            });
            showSuccess('Appointment cancelled successfully');
            setShowCancelModal(false); // Close the modal after successful cancellation
            setAppointmentToCancel(null); // Clear the appointment to cancel
        } catch (error_1) {
            console.error('Error cancelling appointment:', error_1);
            showError('Failed to cancel appointment');
        }
    };
    const handleDeleteAppointment = async (appointmentId_1)=>{
        try {
            await deleteAppointment(appointmentId_1);
        // TanStack Query handles refetching automatically
        } catch (error_2) {
            console.error('Error deleting appointment:', error_2);
        }
    };
    // Get appointments for a specific date (exclude completed and cancelled from calendar view)
    const getAppointmentsForDate = (date_1)=>{
        return filteredAppointments.filter((apt_4)=>apt_4.appointment_date === date_1 && apt_4.status !== 'completed' && apt_4.status !== 'cancelled');
    };
    // Render calendar grid - Desktop view
    const renderCalendarGrid = ()=>{
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        // Empty cells for days before month starts
        for(let i = 0; i < firstDay; i++){
            days.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-16 sm:h-20 md:h-24 lg:h-28 border border-gray-200"
            }, `empty-${i}`, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 263,
                columnNumber: 17
            }, this));
        }
        // Days of the month
        for(let day = 1; day <= daysInMonth; day++){
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppointments = getAppointmentsForDate(dateStr);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            days.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `h-16 sm:h-20 md:h-24 lg:h-28 border border-gray-200 p-0.5 sm:p-1 md:p-2 cursor-pointer hover:bg-gray-50 ${isToday ? 'bg-blue-50' : ''} min-h-[60px] sm:min-h-[80px]`,
                onClick: ()=>setSelectedDate(dateStr),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs sm:text-sm md:text-base font-medium",
                        children: day
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 272,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-0.5 sm:space-y-1",
                        children: [
                            dayAppointments.slice(0, 1).map((_, i_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs bg-blue-100 text-blue-800 rounded px-0.5 sm:px-1 py-0.5 truncate",
                                    children: dayAppointments[i_0].service_name || 'Service'
                                }, i_0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                    lineNumber: 274,
                                    columnNumber: 71
                                }, this)),
                            dayAppointments.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-gray-500",
                                children: [
                                    "+",
                                    dayAppointments.length - 1,
                                    " more"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 277,
                                columnNumber: 44
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 273,
                        columnNumber: 11
                    }, this)
                ]
            }, day, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 271,
                columnNumber: 17
            }, this));
        }
        return days;
    };
    // Render mobile list view - for small screens
    const renderMobileCalendarList = ()=>{
        const daysInMonth_0 = getDaysInMonth(currentDate);
        const days_0 = [];
        for(let day_0 = 1; day_0 <= daysInMonth_0; day_0++){
            const dateStr_0 = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day_0).padStart(2, '0')}`;
            const dayAppointments_0 = getAppointmentsForDate(dateStr_0);
            const isToday_0 = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day_0).toDateString();
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day_0);
            const dayName = dayDate.toLocaleDateString('en-US', {
                weekday: 'short'
            });
            days_0.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `bg-white rounded-lg border p-4 cursor-pointer hover:bg-gray-50 ${isToday_0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`,
                onClick: ()=>setSelectedDate(dateStr_0),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-start mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg font-semibold",
                                                children: day_0
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-500",
                                                children: dayName
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this),
                                            isToday_0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "px-2 py-1 text-xs bg-blue-600 text-white rounded-full",
                                                children: "Today"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 302,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 299,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: dayDate.toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 304,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 298,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-right",
                                children: dayAppointments_0.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-xs rounded-full",
                                    children: dayAppointments_0.length
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                    lineNumber: 312,
                                    columnNumber: 48
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 311,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 297,
                        columnNumber: 11
                    }, this),
                    dayAppointments_0.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            dayAppointments_0.slice(0, 3).map((apt_5)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between p-2 bg-gray-50 rounded",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-medium truncate",
                                                    children: apt_5.customer_name || 'No customer'
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 321,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-600 truncate",
                                                    children: apt_5.service_name || 'Service'
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-500",
                                                    children: apt_5.appointment_time || 'All day'
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 323,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 320,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `px-2 py-1 text-xs rounded-full flex-shrink-0 ${apt_5.status === 'completed' ? 'bg-green-100 text-green-800' : apt_5.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`,
                                            children: apt_5.status || 'pending'
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 325,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, apt_5.id, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                    lineNumber: 319,
                                    columnNumber: 74
                                }, this)),
                            dayAppointments_0.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center text-xs text-gray-500 py-2",
                                children: [
                                    "+",
                                    dayAppointments_0.length - 3,
                                    " more appointments"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 329,
                                columnNumber: 48
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 318,
                        columnNumber: 44
                    }, this),
                    dayAppointments_0.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-gray-400 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm",
                                children: "No appointments"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 335,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setSelectedDate(dateStr_0);
                                    setShowAddModal(true);
                                },
                                className: "mt-2 text-xs text-blue-600 hover:text-blue-800",
                                children: "+ Add appointment"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 336,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 334,
                        columnNumber: 46
                    }, this)
                ]
            }, day_0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 296,
                columnNumber: 19
            }, this));
        }
        return days_0;
    };
    if (businessLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 351,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 352,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 350,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
            lineNumber: 349,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                industry: industry,
                country: country
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 py-6 pb-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row sm:items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xl sm:text-2xl font-bold text-gray-900",
                                        children: "Calendar"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 363,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: navigateToToday,
                                        className: "px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto",
                                        children: "Today"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 364,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 362,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center sm:justify-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>navigateMonth(-1),
                                                className: "p-2 hover:bg-gray-100 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 372,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 371,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-center sm:text-left",
                                                children: currentDate.toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 374,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>navigateMonth(1),
                                                className: "p-2 hover:bg-gray-100 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    size: 20
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 380,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 370,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAddModal(true),
                                        className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 385,
                                                columnNumber: 15
                                            }, this),
                                            "Add Appointment"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 384,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 369,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row sm:items-center gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 395,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: filter,
                                            onChange: (e_0)=>setFilter(e_0.target.value),
                                            className: "px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-auto",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: "All"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "scheduled",
                                                    children: "Scheduled"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "completed",
                                                    children: "Completed"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "cancelled",
                                                    children: "Cancelled"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 400,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                    lineNumber: 394,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 393,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 w-full sm:w-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search appointments...",
                                        value: searchTerm,
                                        onChange: (e_1)=>setSearchTerm(e_1.target.value),
                                        className: "px-3 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 407,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 405,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 392,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2",
                                children: [
                                    'S',
                                    'M',
                                    'T',
                                    'W',
                                    'T',
                                    'F',
                                    'S'
                                ].map((day_1, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center text-xs sm:text-sm font-medium text-gray-600 py-1",
                                        children: day_1
                                    }, index, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 414,
                                        columnNumber: 72
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 413,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-7 gap-0.5 sm:gap-1",
                                children: renderCalendarGrid()
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 418,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 412,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        size: 20,
                                        className: "text-orange-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 426,
                                        columnNumber: 13
                                    }, this),
                                    "Pending Appointments",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-normal text-gray-500",
                                        children: [
                                            "(",
                                            filteredAppointments.filter((apt_6)=>apt_6.status === 'pending').length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 428,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 425,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: filteredAppointments.filter((apt_7)=>apt_7.status === 'pending').length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400 mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                size: 48,
                                                className: "mx-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 435,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 434,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500 text-center",
                                            children: "No appointments found"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 437,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowAddModal(true),
                                            className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm",
                                            children: "Add First Appointment"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 438,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                    lineNumber: 433,
                                    columnNumber: 94
                                }, this) : filteredAppointments.sort((a, b)=>{
                                    const dateA = new Date(`${a.appointment_date} ${a.appointment_time || '00:00'}`);
                                    const dateB = new Date(`${b.appointment_date} ${b.appointment_time || '00:00'}`);
                                    return dateA.getTime() - dateB.getTime();
                                }).map((appointment_0)=>{
                                    // Show completed appointments in mini format
                                    if (appointment_0.status === 'completed') {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-green-200 bg-green-50 rounded-lg p-2 opacity-75",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                    size: 14,
                                                                    className: "text-green-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 452,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium text-green-800 truncate",
                                                                    children: appointment_0.customer_name || 'No customer'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 453,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "px-1 py-0.5 text-xs bg-green-100 text-green-700 rounded",
                                                                    children: "Completed"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 456,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                            lineNumber: 451,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-green-600 truncate",
                                                            children: [
                                                                appointment_0.service_name || 'Service',
                                                                " • ",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(appointment_0.appointment_date)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                            lineNumber: 460,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 449,
                                                columnNumber: 25
                                            }, this)
                                        }, appointment_0.id, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 448,
                                            columnNumber: 22
                                        }, this);
                                    }
                                    // Regular display for pending/cancelled appointments
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "font-medium text-gray-900 truncate",
                                                                    children: appointment_0.customer_name || 'No customer'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 473,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `px-2 py-1 text-xs rounded-full flex-shrink-0 ${appointment_0.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`,
                                                                    children: appointment_0.status || 'pending'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 476,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                            lineNumber: 472,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-600 flex items-center gap-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        children: appointment_0.service_name || 'Service'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                        lineNumber: 482,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 481,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-500 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                            lineNumber: 485,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(appointment_0.appointment_date),
                                                                        " at ",
                                                                        appointment_0.appointment_time || 'All day'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 484,
                                                                    columnNumber: 29
                                                                }, this),
                                                                appointment_0.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-sm text-gray-500 bg-gray-50 p-2 rounded",
                                                                    children: appointment_0.notes
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 488,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                            lineNumber: 480,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 471,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 sm:gap-1",
                                                    children: [
                                                        appointment_0.status === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleCompleteAppointment(appointment_0.id),
                                                                    className: "p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors",
                                                                    title: "Complete appointment",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                        size: 18
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                        lineNumber: 496,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 495,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setAppointmentToCancel(appointment_0.id);
                                                                        setShowCancelModal(true);
                                                                    },
                                                                    className: "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                                                                    title: "Cancel appointment",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                        size: 18
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                        lineNumber: 502,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                    lineNumber: 498,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDeleteAppointment(appointment_0.id),
                                                            className: "p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors",
                                                            title: "Delete appointment",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                                size: 18
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                            lineNumber: 505,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                    lineNumber: 493,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                            lineNumber: 470,
                                            columnNumber: 23
                                        }, this)
                                    }, appointment_0.id, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 469,
                                        columnNumber: 20
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 432,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 359,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showAddModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$AddAppointmentModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    isOpen: showAddModal,
                    onClose: ()=>{
                        setShowAddModal(false);
                        setSelectedDate(null);
                    },
                    onSuccess: ()=>{
                        setShowAddModal(false);
                        setSelectedDate(null);
                    // TanStack Query handles refetching automatically
                    },
                    industry: industry,
                    country: country
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                    lineNumber: 518,
                    columnNumber: 26
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 517,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showCancelModal && appointmentToCancel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                    onClick: ()=>setShowCancelModal(false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            scale: 0.9,
                            opacity: 0
                        },
                        animate: {
                            scale: 1,
                            opacity: 1
                        },
                        exit: {
                            scale: 0.9,
                            opacity: 0
                        },
                        className: "bg-white rounded-lg p-6 max-w-md w-full mx-4",
                        onClick: (e_2)=>e_2.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold mb-4",
                                children: "Cancel Appointment"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 547,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 mb-2",
                                        children: "Are you sure you want to cancel this appointment?"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 549,
                                        columnNumber: 17
                                    }, this),
                                    appointments && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 p-3 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium text-gray-900",
                                                children: appointments.find((apt_8)=>apt_8.id === appointmentToCancel)?.customer_name || 'Customer'
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 553,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-600",
                                                children: appointments.find((apt_9)=>apt_9.id === appointmentToCancel)?.service_name || 'Service'
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 556,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm text-gray-500",
                                                children: [
                                                    appointments.find((apt_10)=>apt_10.id === appointmentToCancel)?.appointment_date,
                                                    " at",
                                                    ' ',
                                                    appointments.find((apt_11)=>apt_11.id === appointmentToCancel)?.appointment_time
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                                lineNumber: 559,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 552,
                                        columnNumber: 34
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 548,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleCancelAppointment(appointmentToCancel),
                                        className: "flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium",
                                        children: "Yes, Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 566,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowCancelModal(false),
                                        className: "flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium",
                                        children: "No, Keep"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                        lineNumber: 569,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                                lineNumber: 565,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                        lineNumber: 537,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                    lineNumber: 530,
                    columnNumber: 52
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 529,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                industry: industry,
                country: country
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
                lineNumber: 577,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx",
        lineNumber: 356,
        columnNumber: 10
    }, this);
}
_s(Calendar, "vDeDqNx2RXpysH28XdydgqcT0sE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useAppointmentsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppointmentsTanStack"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useServicesTanStack"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTransactionsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransactionsTanStack"]
    ];
});
_c = Calendar;
var _c;
__turbopack_context__.k.register(_c, "Calendar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/calendar/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$Calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Calendar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// Industries that need calendar functionality
const CALENDAR_INDUSTRIES = [
    'salon',
    'transport',
    'tailor',
    'freelance',
    'repairs'
];
function CalendarPage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "5d5f18321d88507fe9e91f95da6fbab665c7dd1fb86e00b6cf6641e7ed0c1490") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5d5f18321d88507fe9e91f95da6fbab665c7dd1fb86e00b6cf6641e7ed0c1490";
    }
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const country = params.country || "ke";
    const industry = params.industry || "retail";
    let t0;
    let t1;
    if ($[1] !== country || $[2] !== industry) {
        t0 = ({
            "CalendarPage[useEffect()]": ()=>{
                if (!CALENDAR_INDUSTRIES.includes(industry)) {
                    window.location.href = `/Beezee-App/app/${country}/${industry}`;
                }
            }
        })["CalendarPage[useEffect()]"];
        t1 = [
            industry,
            country
        ];
        $[1] = country;
        $[2] = industry;
        $[3] = t0;
        $[4] = t1;
    } else {
        t0 = $[3];
        t1 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    if (!CALENDAR_INDUSTRIES.includes(industry)) {
        let t2;
        if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-[var(--bg1)] flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-[var(--text-3)])",
                    children: "Redirecting..."
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/calendar/page.tsx",
                    lineNumber: 44,
                    columnNumber: 91
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/calendar/page.tsx",
                lineNumber: 44,
                columnNumber: 12
            }, this);
            $[5] = t2;
        } else {
            t2 = $[5];
        }
        return t2;
    }
    let t2;
    if ($[6] !== country || $[7] !== industry) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$Calendar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            industry: industry,
            country: country
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/calendar/page.tsx",
            lineNumber: 53,
            columnNumber: 10
        }, this);
        $[6] = country;
        $[7] = industry;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_s(CalendarPage, "oVl/CosACDqoQXSsHMBk26cu/Mw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = CalendarPage;
var _c;
__turbopack_context__.k.register(_c, "CalendarPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_cca39588._.js.map