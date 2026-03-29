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
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ServicesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useServicesTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useInventoryTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useInventoryTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTransactionsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useTransactionsTanStack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useToast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/universal/BottomNav.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
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
;
function ServicesPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const country = params.country || 'ke';
    const industry = params.industry || 'retail';
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    // Redirect retail users to stock page - retail doesn't use services
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServicesPage.useEffect": ()=>{
            if (industry === 'retail') {
                window.location.href = `/Beezee-App/app/${country}/${industry}/stock`;
            }
        }
    }["ServicesPage.useEffect"], [
        industry,
        country
    ]);
    const { business } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    // TanStack Query handles online/offline automatically
    const { showSuccess, showError, showWarning, showInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { data: services, isLoading, addService, updateService, deleteService: deleteServiceFn, isOffline, isPending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useServicesTanStack"])({
        industry
    });
    const { data: inventory, isLoading: inventoryLoading, addInventory: addInventoryItemFn, updateInventory: updateInventoryItemFn, isOffline: inventoryOffline } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useInventoryTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryTanStack"])({
        industry
    });
    const { data: transactions, isLoading: transactionsLoading, addTransaction, isPaused: transactionsOffline } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTransactionsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransactionsTanStack"])({
        industry
    });
    // Ensure services is always an array
    const safeServices = Array.isArray(services) ? services : [];
    const safeInventory = Array.isArray(inventory) ? inventory : [];
    // Debug inventory changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServicesPage.useEffect": ()=>{
            console.log('📦 Services page inventory updated:', {
                inventoryLength: safeInventory.length,
                inventoryItems: safeInventory.slice(0, 3),
                // First 3 items for debugging
                timestamp: new Date().toISOString()
            });
        }
    }["ServicesPage.useEffect"], [
        safeInventory
    ]);
    const addInventoryItem = industry === 'transport' ? ()=>{} : addInventoryItemFn;
    const updateInventoryItem = industry === 'transport' ? ()=>{} : updateInventoryItemFn;
    const deleteInventoryItem = industry === 'transport' ? ()=>{} : (id)=>console.log('Delete item:', id); // Simplified for TanStack version
    // Tab state for split screen (only show tabs for non-transport industries)
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('services');
    // Check if industry should show services tab (food and retail should not, transport only services)
    const shouldShowServicesTab = ![
        'food',
        'retail'
    ].includes(industry);
    const shouldShowInventoryTab = ![
        'transport'
    ].includes(industry); // Transport doesn't show inventory
    const pageTitle = shouldShowServicesTab ? t('services') : t('services.inventory_tab', 'Inventory');
    // Force inventory tab for food and retail industries
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServicesPage.useEffect": ()=>{
            if (!shouldShowServicesTab) {
                setActiveTab('inventory');
            }
        }
    }["ServicesPage.useEffect"], [
        shouldShowServicesTab
    ]);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterCategory, setFilterCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showServiceDetail, setShowServiceDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAddInventoryModal, setShowAddInventoryModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showKmModal, setShowKmModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // For transport KM input
    const [kmInput, setKmInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showEditModal, setShowEditModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // For editing service price
    const [showSellModal, setShowSellModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // For selling inventory
    const [selectedInventoryItem, setSelectedInventoryItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showEditInventoryModal, setShowEditInventoryModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // For editing inventory
    // Universal industry-specific categories and labels
    const industryConfig = {
        retail: {
            categories: [
                'all',
                'electronics',
                'clothing',
                'food',
                'beauty',
                'household',
                'toys'
            ],
            serviceLabel: 'products',
            itemLabel: 'product',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        },
        food: {
            categories: [
                'all',
                'appetizers',
                'mains',
                'desserts',
                'beverages',
                'sides',
                'specials'
            ],
            serviceLabel: 'dishes',
            itemLabel: 'dish',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        },
        transport: {
            categories: [
                'all',
                'local',
                'long_distance',
                'airport',
                'corporate',
                'special',
                'delivery'
            ],
            serviceLabel: 'trips',
            itemLabel: 'trip',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        },
        salon: {
            categories: [
                'all',
                'hair',
                'nails',
                'skincare',
                'wellness',
                'makeup',
                'massage'
            ],
            serviceLabel: 'services',
            itemLabel: 'service',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        },
        tailor: {
            categories: [
                'all',
                'fabrics',
                'threads',
                'zippers_fasteners',
                'buttons_accessories',
                'interfacing_linings',
                'elastic_trims',
                'measuring_tools',
                'cutting_tools',
                'sewing_tools',
                'patterns_templates',
                'dyes_chemicals',
                'packaging_materials',
                'other'
            ],
            serviceLabel: 'materials',
            itemLabel: 'material',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        },
        repairs: {
            categories: [
                'all',
                'electronics',
                'appliances',
                'vehicles',
                'phones',
                'computers',
                'general'
            ],
            serviceLabel: 'repairs',
            itemLabel: 'repair',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        },
        freelance: {
            categories: [
                'all',
                'web_design',
                'writing',
                'consulting',
                'design',
                'development',
                'marketing'
            ],
            serviceLabel: 'projects',
            itemLabel: 'project',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        }
    };
    const config = industryConfig[industry] || industryConfig.retail;
    const categories = config.categories;
    // Calculate summary statistics from real data
    const totalServices = safeServices.length;
    const availableServices = safeServices.filter((s)=>s.is_active).length;
    // Calculate total revenue from actual service prices (not reviews)
    const totalRevenue = safeServices.reduce((sum, s_0)=>sum + (s_0.price || 0), 0);
    // Calculate average service price for active services with proper formatting
    const averageServicePrice = availableServices > 0 ? totalRevenue / availableServices : 0;
    // Debug the calculations to identify formatting issues
    console.log('💰 Service Price Calculations:', {
        totalServices,
        availableServices,
        totalRevenue,
        averageServicePrice,
        servicePrices: safeServices.map((s_1)=>({
                name: s_1.service_name,
                price: s_1.price
            }))
    });
    // Calculate inventory statistics
    const totalInventoryItems = inventory.length;
    const lowStockItems = inventory.filter((item)=>item.threshold !== undefined && item.quantity <= item.threshold).length;
    const totalInventoryValue = inventory.reduce((sum_0, item_0)=>sum_0 + (item_0.selling_price || item_0.cost_price || 0) * item_0.quantity, 0);
    // Filter functions
    const filteredServices = safeServices.filter((service)=>{
        const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) || service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
        return matchesSearch && matchesCategory;
    });
    const filteredInventory = inventory.filter((item_1)=>{
        const matchesSearch_0 = item_1.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || item_1.category && item_1.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory_0 = filterCategory === 'all' || item_1.category === filterCategory;
        return matchesSearch_0 && matchesCategory_0;
    });
    const handleAddService = async (newService)=>{
        try {
            if (!business?.id) {
                console.error('No business ID found');
                return;
            }
            // Get currency from business country
            const currency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(business.country || country);
            await addService({
                ...newService,
                business_id: business.id,
                industry,
                currency,
                is_active: true
            });
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to add service:', error);
        }
    };
    const handleAddInventoryItem = async (newItem)=>{
        try {
            if (!business?.id) {
                alert('Please wait for business data to load or refresh the page to log in properly.');
                return;
            }
            // Get currency from business country
            const currency_0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(business.country || country);
            await addInventoryItem({
                ...newItem,
                business_id: business.id,
                industry,
                currency: currency_0
            });
            setShowAddInventoryModal(false);
        } catch (error_0) {
            console.error('Failed to add inventory item:', error_0);
            alert('Failed to add item. Please try again.');
        }
    };
    const handleUpdateService = async (serviceId, updates)=>{
        try {
            updateService({
                id: serviceId,
                updates
            });
            showSuccess('Service updated successfully');
        } catch (error_1) {
            console.error('Failed to update service:', error_1);
            showError('Failed to update service');
        }
    };
    const handleDeleteService = async (serviceId_0)=>{
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }
        try {
            await deleteServiceFn(serviceId_0);
            setShowServiceDetail(null);
        } catch (error_2) {
            console.error('Failed to delete service:', error_2);
        }
    };
    // Inventory item handlers
    const handleSellInventoryItem = (item_2)=>{
        setSelectedInventoryItem(item_2);
        setShowSellModal(true);
    };
    const handleSellSubmit = async (sellData)=>{
        if (!selectedInventoryItem || !business?.id) return;
        try {
            const quantity = parseInt(sellData.quantity);
            const totalPrice = quantity * (selectedInventoryItem.selling_price || selectedInventoryItem.cost_price || 0);
            // Create transaction for the sale
            const transactionData = {
                business_id: business.id,
                industry: industry,
                amount: totalPrice,
                category: 'inventory_sale',
                description: `${quantity} ${selectedInventoryItem.unit} ${selectedInventoryItem.item_name}`,
                customer_name: sellData.customerName || 'Walk-in Customer',
                payment_method: sellData.paymentMethod || 'cash',
                transaction_date: new Date().toISOString().split('T')[0],
                metadata: {
                    inventory_item_id: selectedInventoryItem.id,
                    item_name: selectedInventoryItem.item_name,
                    quantity_sold: quantity,
                    unit_price: selectedInventoryItem.selling_price || selectedInventoryItem.cost_price || 0,
                    total_price: totalPrice
                }
            };
            if (!isOffline) {
                // Try online first
                try {
                    console.log('📦 Starting inventory sale:', {
                        itemName: selectedInventoryItem.item_name,
                        currentQuantity: selectedInventoryItem.quantity,
                        quantityToSell: quantity
                    });
                    await addTransaction(transactionData);
                    console.log('✅ Transaction added successfully');
                    // Update inventory quantity
                    const updatedQuantity = selectedInventoryItem.quantity - quantity;
                    console.log('📉 Updating inventory quantity:', {
                        from: selectedInventoryItem.quantity,
                        to: updatedQuantity
                    });
                    await updateInventoryItem({
                        id: selectedInventoryItem.id,
                        updates: {
                            quantity: updatedQuantity
                        }
                    });
                    console.log('✅ Inventory updated successfully');
                    console.log(`💰 Sold ${quantity} ${selectedInventoryItem.unit} of ${selectedInventoryItem.item_name} for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalPrice, country)}`);
                } catch (onlineError) {
                    console.warn('⚠️ Online sale failed, using offline mode:', onlineError);
                    showInfo(t('services.sell_offline', 'Sale queued - will sync when you\'re back online'));
                    console.log(`✅ Sale queued for sync: ${quantity} ${selectedInventoryItem.unit} of ${selectedInventoryItem.item_name}`);
                }
            } else {
                // Offline mode - TanStack Query handles this automatically
                console.log('📴 Offline mode: TanStack Query will queue for later sync');
                showInfo(t('services.sell_offline_mode', 'Offline mode: Sale queued for sync'));
                console.log(`✅ Sale queued for sync: ${quantity} ${selectedInventoryItem.unit} of ${selectedInventoryItem.item_name}`);
            }
            // Close modal and reset selection
            setShowSellModal(false);
            setSelectedInventoryItem(null);
        } catch (error_3) {
            console.error('Failed to create inventory sale:', error_3);
            alert('Failed to complete sale. Please try again.');
        }
    };
    const handleEditInventoryItem = (item_3)=>{
        setSelectedInventoryItem(item_3);
        setShowEditInventoryModal(true);
    };
    const handleEditInventorySubmit = async (editData)=>{
        if (!selectedInventoryItem) return;
        try {
            const updates_0 = {
                item_name: editData.item_name,
                category: editData.category,
                quantity: parseFloat(editData.quantity),
                threshold: parseFloat(editData.threshold),
                unit: editData.unit,
                supplier: editData.supplier
            };
            // Only include price fields if they have values
            if (editData.cost_price && editData.cost_price !== '') {
                updates_0.cost_price = parseFloat(editData.cost_price);
            }
            if (editData.selling_price && editData.selling_price !== '') {
                updates_0.selling_price = parseFloat(editData.selling_price);
            }
            await updateInventoryItem({
                id: selectedInventoryItem.id,
                updates: updates_0
            });
            console.log('Inventory item updated successfully');
            // Close modal and reset selection
            setShowEditInventoryModal(false);
            setSelectedInventoryItem(null);
        } catch (error_4) {
            console.error('Failed to update inventory item:', error_4);
            alert('Failed to update item. Please try again.');
        }
    };
    const handleDeleteInventoryItem = async (itemId)=>{
        if (!confirm('Are you sure you want to delete this inventory item?')) {
            return;
        }
        try {
            await deleteInventoryItem(itemId);
            console.log('Inventory item deleted successfully');
        } catch (error_5) {
            console.error('Failed to delete inventory item:', error_5);
        }
    };
    const handleKmConfirm = async (km, useBase, tips, location)=>{
        const service_0 = safeServices.find((s_2)=>s_2.id === showKmModal);
        if (!service_0 || !business?.id) {
            console.error('Service or business not found');
            return;
        }
        try {
            // Calculate the fare
            const totalFare = useBase ? (service_0.price || 0) + (parseFloat(tips) || 0) : (parseFloat(km) || 0) * (service_0.price || 0) + (service_0.price || 0) + (parseFloat(tips) || 0);
            // Create the transaction
            const transactionData_0 = {
                business_id: business.id,
                industry: industry,
                amount: totalFare,
                category: 'transport_trip',
                description: location ? `${service_0.service_name} (${location})${useBase ? ' (Base only)' : ` (${km} km)`}${tips ? ' + tips' : ''}` : `${service_0.service_name}${useBase ? ' (Base only)' : ` (${km} km)`}${tips ? ' + tips' : ''}`,
                customer_name: 'Walk-in Customer',
                payment_method: 'cash',
                transaction_date: new Date().toISOString().split('T')[0],
                metadata: {
                    service_id: service_0.id,
                    service_name: service_0.service_name,
                    distance: parseFloat(km) || 0,
                    use_base_amount: useBase,
                    tips: parseFloat(tips) || 0,
                    location: location,
                    price_per_km: service_0.price || 0,
                    base_amount: service_0.price || 0,
                    calculated_fare: totalFare
                }
            };
            console.log('Creating transport transaction:', transactionData_0);
            if (!isOffline) {
                // Try online first
                try {
                    await addTransaction(transactionData_0);
                    console.log('Transport transaction created successfully');
                } catch (onlineError_0) {
                    console.warn('⚠️ Online transaction failed, using offline mode:', onlineError_0);
                    showInfo(t('services.transport_offline', 'Transport trip queued - will sync when you\'re back online'));
                    console.log(`✅ Transport trip queued for sync: ${service_0.service_name}`);
                }
            } else {
                // Offline mode - TanStack Query handles this automatically
                console.log('📴 Offline mode: TanStack Query will queue for later sync');
                showInfo(t('services.transport_offline_mode', 'Offline mode: Transport trip queued for sync'));
                console.log(`✅ Transport trip queued for sync: ${service_0.service_name}`);
            }
        } catch (error_6) {
            console.error('Failed to create transport transaction:', error_6);
            alert('Failed to complete trip. Please try again.');
        }
        setShowKmModal(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 pb-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                industry: industry,
                country: country
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 443,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 max-w-md mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "text-2xl font-bold text-gray-900 mb-6",
                        children: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                        lineNumber: 446,
                        columnNumber: 9
                    }, this),
                    shouldShowServicesTab && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            delay: 0.1
                        },
                        className: "mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-100 rounded-xl p-1 flex",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab('services'),
                                    className: `flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'services' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 469,
                                                columnNumber: 19
                                            }, this),
                                            t('services.services_tab', 'Services')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 468,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 467,
                                    columnNumber: 15
                                }, this),
                                shouldShowInventoryTab && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab('inventory'),
                                    className: `flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'inventory' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 475,
                                                columnNumber: 21
                                            }, this),
                                            t('services.inventory_tab', 'Inventory')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 474,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 473,
                                    columnNumber: 42
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 466,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                        lineNumber: 457,
                        columnNumber: 35
                    }, this),
                    shouldShowServicesTab && activeTab === 'services' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            x: activeTab === 'services' ? 0 : 20
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        exit: {
                            opacity: 0,
                            x: -20
                        },
                        transition: {
                            duration: 0.2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.1
                                },
                                className: "grid grid-cols-2 gap-3 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white p-4 rounded-xl border border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm text-gray-500 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                        className: "text-gray-600",
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                        lineNumber: 507,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('services.total_services')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 506,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-gray-900",
                                                children: totalServices
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 510,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500",
                                                children: [
                                                    availableServices,
                                                    " ",
                                                    t('services.available')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 511,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 505,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-orange-50 p-4 rounded-xl border border-orange-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm text-orange-700 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                        lineNumber: 516,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('services.low_stock')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 515,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-orange-600",
                                                children: lowStockItems
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 519,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-orange-500",
                                                children: t('services.products_need_restock')
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 520,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 496,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.2
                                },
                                className: "grid grid-cols-2 gap-3 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-green-50 p-4 rounded-xl border border-green-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm text-green-700 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                        lineNumber: 536,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Total Service Value"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 535,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold text-green-600",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalRevenue, country)
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 539,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 534,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-purple-50 p-4 rounded-xl border border-purple-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm text-purple-700 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                        lineNumber: 546,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Avg Price"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 545,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xl font-bold text-purple-600",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(Math.round(averageServicePrice * 100) / 100, country)
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 549,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 544,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.3
                                },
                                className: "mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAddModal(true),
                                    className: "w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 566,
                                            columnNumber: 17
                                        }, this),
                                        t('services.add_service')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 565,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 556,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.4
                                },
                                className: "mb-4 space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                size: 20,
                                                className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 582,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: t('services.search_services'),
                                                value: searchTerm,
                                                onChange: (e)=>setSearchTerm(e.target.value),
                                                className: "w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 583,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 581,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 overflow-x-auto",
                                        children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setFilterCategory(category),
                                                className: `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterCategory === category ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}`,
                                                children: category === 'all' ? t('services.all') : category.split('_').map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                            }, category, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 587,
                                                columnNumber: 45
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 586,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 572,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.6
                                },
                                className: "space-y-4",
                                children: filteredServices.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-xl p-8 text-center border border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400 mb-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                size: 48,
                                                className: "mx-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 605,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 604,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600",
                                            children: t('services.no_services_found')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 607,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500 mt-1",
                                            children: t('services.start_by_adding_first_service')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 608,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 603,
                                    columnNumber: 48
                                }, this) : filteredServices.map((service_1, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            x: -20
                                        },
                                        animate: {
                                            opacity: 1,
                                            x: 0
                                        },
                                        transition: {
                                            delay: 0.7 + index * 0.05
                                        },
                                        className: "bg-white rounded-xl border border-gray-200 overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                                            onClick: ()=>industry === 'transport' ? setShowKmModal(service_1.id) : setShowServiceDetail(service_1.id),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-semibold text-gray-900",
                                                                        children: service_1.service_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                        lineNumber: 623,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    !service_1.is_active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full",
                                                                        children: "Unavailable"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                        lineNumber: 624,
                                                                        columnNumber: 54
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 622,
                                                                columnNumber: 27
                                                            }, this),
                                                            service_1.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-600 mb-2",
                                                                children: service_1.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 628,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-4 text-sm text-gray-500",
                                                                children: service_1.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "flex items-center gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                            size: 14
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                            lineNumber: 631,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        service_1.duration,
                                                                        "min"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                    lineNumber: 630,
                                                                    columnNumber: 52
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 629,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                        lineNumber: 621,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-green-600",
                                                                children: (()=>{
                                                                    let displayPrice = 0;
                                                                    if (industry === 'transport') {
                                                                        // For transport, use base_amount from metadata or price
                                                                        displayPrice = service_1.metadata?.base_amount || service_1.price || 0;
                                                                    } else {
                                                                        // For non-transport industries like salon
                                                                        // First try direct price field
                                                                        if (service_1.price && service_1.price > 0) {
                                                                            displayPrice = service_1.price;
                                                                        } else if (service_1.metadata?.price) {
                                                                            displayPrice = service_1.metadata.price;
                                                                        } else if (service_1.metadata?.base_amount) {
                                                                            displayPrice = service_1.metadata.base_amount;
                                                                        } else if (service_1.metadata?.price_per_km) {
                                                                            displayPrice = service_1.metadata.price_per_km + (service_1.metadata.base_amount || 0);
                                                                        } else if (service_1.metadata) {
                                                                            const numericValues = Object.values(service_1.metadata).filter((val)=>typeof val === 'number' && val > 0);
                                                                            if (numericValues.length > 0) {
                                                                                displayPrice = numericValues[0];
                                                                            }
                                                                        } else if (service_1.price === 0) {
                                                                            displayPrice = 0; // This will show "0" indicating the service needs price update
                                                                        }
                                                                    }
                                                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(displayPrice, country);
                                                                })()
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 638,
                                                                columnNumber: 27
                                                            }, this),
                                                            service_1.price === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-orange-500 mt-1",
                                                                children: "Update price"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 677,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowServiceDetail(service_1.id),
                                                                        className: "p-2 rounded-lg hover:bg-gray-100 transition-colors",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                            size: 20,
                                                                            className: "text-gray-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                            lineNumber: 682,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                        lineNumber: 681,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    (service_1.price === 0 || industry !== 'transport') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowEditModal(service_1.id),
                                                                        className: "p-2 rounded-lg hover:bg-blue-50 transition-colors",
                                                                        title: "Edit price",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                            size: 16,
                                                                            className: "text-blue-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                            lineNumber: 685,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                        lineNumber: 684,
                                                                        columnNumber: 85
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleDeleteService(service_1.id),
                                                                        className: "p-2 rounded-lg hover:bg-red-50 transition-colors",
                                                                        title: "Delete service",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                            size: 16,
                                                                            className: "text-red-600"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                            lineNumber: 688,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                        lineNumber: 687,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 680,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                        lineNumber: 637,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 620,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 619,
                                            columnNumber: 21
                                        }, this)
                                    }, service_1.id, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 609,
                                        columnNumber: 82
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 594,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                        lineNumber: 483,
                        columnNumber: 63
                    }, this),
                    shouldShowInventoryTab && (!shouldShowServicesTab || activeTab === 'inventory') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            x: activeTab === 'inventory' ? 0 : 20
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        exit: {
                            opacity: 0,
                            x: -20
                        },
                        transition: {
                            duration: 0.2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.1
                                },
                                className: "grid grid-cols-2 gap-3 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white p-4 rounded-xl border border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm text-gray-500 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                                        className: "text-gray-600",
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                        lineNumber: 723,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('inventory.total_items')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 722,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-gray-900",
                                                children: totalInventoryItems
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 726,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-gray-500",
                                                children: t('inventory.left', 'in stock')
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 727,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 721,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-orange-50 p-4 rounded-xl border border-orange-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm text-orange-700 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                        lineNumber: 732,
                                                        columnNumber: 19
                                                    }, this),
                                                    t('inventory.low_stock')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 731,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-2xl font-bold text-orange-600",
                                                children: lowStockItems
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 735,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-orange-500",
                                                children: t('inventory.reorder_soon', 'items need restock')
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 736,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                        lineNumber: 730,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 712,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.2
                                },
                                className: "mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-green-50 p-4 rounded-xl border border-green-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-sm text-green-700 mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                    lineNumber: 752,
                                                    columnNumber: 19
                                                }, this),
                                                t('inventory.total_stock_value')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 751,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-2xl font-bold text-green-600",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalInventoryValue, country)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 755,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 750,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 741,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.3
                                },
                                className: "mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAddInventoryModal(true),
                                    disabled: !business?.id,
                                    className: "w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 772,
                                            columnNumber: 17
                                        }, this),
                                        business?.id ? t('inventory.add_new_item') : 'Loading business data...'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 771,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 762,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.4
                                },
                                className: "mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            size: 20,
                                            className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 788,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: t('inventory.search_items'),
                                            value: searchTerm,
                                            onChange: (e_0)=>setSearchTerm(e_0.target.value),
                                            className: "w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 789,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 787,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 778,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: 0.6
                                },
                                children: filteredInventory.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-xl p-8 text-center border border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-gray-400 mb-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                                size: 48,
                                                className: "mx-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                lineNumber: 805,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 804,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600",
                                            children: t('services.no_inventory_found', 'No inventory items found')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 807,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500 mt-1",
                                            children: t('services.start_by_adding_first_item', 'Start by adding your first inventory item')
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 808,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 803,
                                    columnNumber: 49
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: filteredInventory.map((item_4, index_0)=>{
                                        const isLowStock = item_4.threshold !== undefined && item_4.quantity <= item_4.threshold;
                                        const stockPercentage = item_4.threshold ? item_4.quantity / (item_4.threshold * 2) * 100 : 100;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                opacity: 0,
                                                x: -20
                                            },
                                            animate: {
                                                opacity: 1,
                                                x: 0
                                            },
                                            transition: {
                                                delay: 0.7 + index_0 * 0.05
                                            },
                                            className: `bg-white rounded-xl border border-gray-200 overflow-hidden ${isLowStock ? 'border-orange-200' : ''}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        isLowStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                            size: 18,
                                                                            className: "text-orange-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                            lineNumber: 825,
                                                                            columnNumber: 46
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "font-semibold text-gray-900",
                                                                                    children: item_4.item_name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                                    lineNumber: 827,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                item_4.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs text-gray-500",
                                                                                    children: item_4.category
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                                    lineNumber: 828,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                item_4.cost_price && item_4.selling_price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs text-gray-500 mt-1",
                                                                                    children: [
                                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item_4.cost_price, country),
                                                                                        " → ",
                                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item_4.selling_price, country)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                                    lineNumber: 829,
                                                                                    columnNumber: 79
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                            lineNumber: 826,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                    lineNumber: 824,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-right",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `font-bold text-lg ${isLowStock ? 'text-orange-600' : 'text-gray-900'}`,
                                                                            children: [
                                                                                item_4.quantity,
                                                                                " ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium text-gray-500",
                                                                                    children: item_4.unit
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                                    lineNumber: 837,
                                                                                    columnNumber: 51
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                            lineNumber: 836,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: [
                                                                                t('inventory.min'),
                                                                                ": ",
                                                                                item_4.threshold
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                            lineNumber: 839,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                    lineNumber: 835,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                            lineNumber: 823,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `h-full rounded-full transition-all duration-300 ${isLowStock ? 'bg-gradient-to-r from-orange-400 to-red-500' : stockPercentage > 50 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-yellow-400 to-orange-400'}`,
                                                                style: {
                                                                    width: `${Math.min(stockPercentage, 100)}%`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 847,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                            lineNumber: 846,
                                                            columnNumber: 27
                                                        }, this),
                                                        isLowStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 text-xs text-orange-600 font-bold flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                                                                    size: 14
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                    lineNumber: 853,
                                                                    columnNumber: 31
                                                                }, this),
                                                                t('inventory.running_low')
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                            lineNumber: 852,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                    lineNumber: 822,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-4 pb-4 flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleSellInventoryItem(item_4),
                                                            className: "flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                                    size: 16
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                    lineNumber: 861,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "Sell"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                            lineNumber: 860,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleEditInventoryItem(item_4),
                                                            className: "p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
                                                            title: "Edit item",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                                size: 16,
                                                                className: "text-gray-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 865,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                            lineNumber: 864,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleDeleteInventoryItem(item_4.id),
                                                            className: "p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors",
                                                            title: "Delete item",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                size: 16,
                                                                className: "text-red-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                                lineNumber: 868,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                            lineNumber: 867,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                                    lineNumber: 859,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, item_4.id, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                            lineNumber: 813,
                                            columnNumber: 22
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 809,
                                    columnNumber: 26
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                lineNumber: 794,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                        lineNumber: 699,
                        columnNumber: 93
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 445,
                columnNumber: 7
            }, this),
            showAddModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-4",
                            children: t('services.add_service')
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 881,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddServiceForm, {
                            onSubmit: handleAddService,
                            onCancel: ()=>setShowAddModal(false),
                            country: country,
                            industry: industry,
                            config: config
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 882,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 880,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 879,
                columnNumber: 24
            }, this),
            showAddInventoryModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-4",
                            children: t('services.add_inventory_item', 'Add Item')
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 888,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddInventoryForm, {
                            onSubmit: handleAddInventoryItem,
                            onCancel: ()=>setShowAddInventoryModal(false),
                            country: country,
                            industry: industry,
                            config: config,
                            t: t
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 889,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 887,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 886,
                columnNumber: 33
            }, this),
            showKmModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KmInputModal, {
                service: safeServices.find((s_3)=>s_3.id === showKmModal),
                onClose: ()=>setShowKmModal(null),
                onConfirm: handleKmConfirm,
                country: country
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 894,
                columnNumber: 23
            }, this),
            showEditModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditServiceModal, {
                service: safeServices.find((s_4)=>s_4.id === showEditModal),
                onClose: ()=>setShowEditModal(null),
                onUpdate: handleUpdateService,
                country: country,
                industry: industry
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 897,
                columnNumber: 25
            }, this),
            showSellModal && selectedInventoryItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl p-6 w-full max-w-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-gray-900 mb-4",
                            children: "Sell Item"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 902,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SellItemForm, {
                            item: selectedInventoryItem,
                            onSubmit: handleSellSubmit,
                            onCancel: ()=>{
                                setShowSellModal(false);
                                setSelectedInventoryItem(null);
                            },
                            t: t,
                            country: country
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 904,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 901,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 900,
                columnNumber: 50
            }, this),
            showEditInventoryModal && selectedInventoryItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-gray-900 mb-4",
                            children: "Edit Inventory Item"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 914,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditInventoryForm, {
                            item: selectedInventoryItem,
                            onSubmit: handleEditInventorySubmit,
                            onCancel: ()=>{
                                setShowEditInventoryModal(false);
                                setSelectedInventoryItem(null);
                            },
                            t: t,
                            country: country
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 916,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 913,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 912,
                columnNumber: 59
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$universal$2f$BottomNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                industry: industry,
                country: country
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 923,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
        lineNumber: 442,
        columnNumber: 10
    }, this);
}
_s(ServicesPage, "Byk8h6jXY8mxR2fGmK7ZoJP31Wk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useServicesTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useServicesTanStack"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useInventoryTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryTanStack"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useTransactionsTanStack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransactionsTanStack"]
    ];
});
_c = ServicesPage;
function EditServiceModal(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(51);
    if ($[0] !== "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e") {
        for(let $i = 0; $i < 51; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e";
    }
    const { service, onClose, onUpdate, country, industry } = t0;
    let t1;
    if ($[1] !== service.price) {
        t1 = service?.price ? service.price.toString() : "";
        $[1] = service.price;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] !== service.duration) {
        t2 = service?.duration ? service.duration.toString() : "";
        $[3] = service.duration;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const t3 = service?.description || "";
    let t4;
    if ($[5] !== t1 || $[6] !== t2 || $[7] !== t3) {
        t4 = {
            price: t1,
            duration: t2,
            description: t3
        };
        $[5] = t1;
        $[6] = t2;
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t4);
    let t5;
    if ($[9] !== formData.description || $[10] !== formData.duration || $[11] !== formData.price || $[12] !== industry || $[13] !== onClose || $[14] !== onUpdate || $[15] !== service.id || $[16] !== service.metadata) {
        t5 = ({
            "EditServiceModal[handleSubmit]": (e)=>{
                e.preventDefault();
                const updates = {
                    price: parseFloat(formData.price) || 0,
                    description: formData.description
                };
                if ((industry === "salon" || industry === "freelance") && formData.duration) {
                    updates.duration = parseInt(formData.duration);
                }
                updates.metadata = {
                    ...service?.metadata,
                    price: parseFloat(formData.price) || 0,
                    ...formData.duration && {
                        duration: parseInt(formData.duration)
                    }
                };
                onUpdate(service.id, updates);
                onClose();
            }
        })["EditServiceModal[handleSubmit]"];
        $[9] = formData.description;
        $[10] = formData.duration;
        $[11] = formData.price;
        $[12] = industry;
        $[13] = onClose;
        $[14] = onUpdate;
        $[15] = service.id;
        $[16] = service.metadata;
        $[17] = t5;
    } else {
        t5 = $[17];
    }
    const handleSubmit = t5;
    let t6;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-semibold text-gray-900 mb-4",
            children: "Edit Service"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1011,
            columnNumber: 10
        }, this);
        $[18] = t6;
    } else {
        t6 = $[18];
    }
    let t7;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Service Name"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1018,
            columnNumber: 10
        }, this);
        $[19] = t7;
    } else {
        t7 = $[19];
    }
    const t8 = service?.service_name || "";
    let t9;
    if ($[20] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: t8,
                    disabled: true,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1026,
                    columnNumber: 19
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1026,
            columnNumber: 10
        }, this);
        $[20] = t8;
        $[21] = t9;
    } else {
        t9 = $[21];
    }
    let t10;
    if ($[22] !== country) {
        t10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country);
        $[22] = country;
        $[23] = t10;
    } else {
        t10 = $[23];
    }
    let t11;
    if ($[24] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: [
                "Price (",
                t10,
                ")"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1042,
            columnNumber: 11
        }, this);
        $[24] = t10;
        $[25] = t11;
    } else {
        t11 = $[25];
    }
    let t12;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = ({
            "EditServiceModal[<input>.onChange]": (e_0)=>setFormData({
                    "EditServiceModal[<input>.onChange > setFormData()]": (prev)=>({
                            ...prev,
                            price: e_0.target.value
                        })
                }["EditServiceModal[<input>.onChange > setFormData()]"])
        })["EditServiceModal[<input>.onChange]"];
        $[26] = t12;
    } else {
        t12 = $[26];
    }
    let t13;
    if ($[27] !== formData.price) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            required: true,
            value: formData.price,
            onChange: t12,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            placeholder: "0.00",
            step: "0.01",
            min: "0"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1064,
            columnNumber: 11
        }, this);
        $[27] = formData.price;
        $[28] = t13;
    } else {
        t13 = $[28];
    }
    let t14;
    if ($[29] !== t11 || $[30] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t11,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1072,
            columnNumber: 11
        }, this);
        $[29] = t11;
        $[30] = t13;
        $[31] = t14;
    } else {
        t14 = $[31];
    }
    let t15;
    if ($[32] !== formData.duration || $[33] !== industry) {
        t15 = (industry === "salon" || industry === "freelance") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "block text-sm font-medium text-gray-700 mb-1",
                    children: industry === "salon" ? "Duration (minutes)" : "Duration (days)"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1081,
                    columnNumber: 70
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    value: formData.duration,
                    onChange: {
                        "EditServiceModal[<input>.onChange]": (e_1)=>setFormData({
                                "EditServiceModal[<input>.onChange > setFormData()]": (prev_0)=>({
                                        ...prev_0,
                                        duration: e_1.target.value
                                    })
                            }["EditServiceModal[<input>.onChange > setFormData()]"])
                    }["EditServiceModal[<input>.onChange]"],
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: industry === "freelance" ? "7" : "30",
                    step: "1"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1081,
                    columnNumber: 207
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1081,
            columnNumber: 65
        }, this);
        $[32] = formData.duration;
        $[33] = industry;
        $[34] = t15;
    } else {
        t15 = $[34];
    }
    let t16;
    if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Description"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1097,
            columnNumber: 11
        }, this);
        $[35] = t16;
    } else {
        t16 = $[35];
    }
    let t17;
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = ({
            "EditServiceModal[<textarea>.onChange]": (e_2)=>setFormData({
                    "EditServiceModal[<textarea>.onChange > setFormData()]": (prev_1)=>({
                            ...prev_1,
                            description: e_2.target.value
                        })
                }["EditServiceModal[<textarea>.onChange > setFormData()]"])
        })["EditServiceModal[<textarea>.onChange]"];
        $[36] = t17;
    } else {
        t17 = $[36];
    }
    let t18;
    if ($[37] !== formData.description) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t16,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    value: formData.description,
                    onChange: t17,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
                    rows: 3,
                    placeholder: "Describe your service..."
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1118,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1118,
            columnNumber: 11
        }, this);
        $[37] = formData.description;
        $[38] = t18;
    } else {
        t18 = $[38];
    }
    let t19;
    if ($[39] !== onClose) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onClose,
            className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1126,
            columnNumber: 11
        }, this);
        $[39] = onClose;
        $[40] = t19;
    } else {
        t19 = $[40];
    }
    let t20;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
            children: "Update Service"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1134,
            columnNumber: 11
        }, this);
        $[41] = t20;
    } else {
        t20 = $[41];
    }
    let t21;
    if ($[42] !== t19) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3 pt-2",
            children: [
                t19,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1141,
            columnNumber: 11
        }, this);
        $[42] = t19;
        $[43] = t21;
    } else {
        t21 = $[43];
    }
    let t22;
    if ($[44] !== handleSubmit || $[45] !== t14 || $[46] !== t15 || $[47] !== t18 || $[48] !== t21 || $[49] !== t9) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6",
                    children: [
                        t6,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-4",
                            children: [
                                t9,
                                t14,
                                t15,
                                t18,
                                t21
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 1149,
                            columnNumber: 214
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1149,
                    columnNumber: 189
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 1149,
                columnNumber: 107
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1149,
            columnNumber: 11
        }, this);
        $[44] = handleSubmit;
        $[45] = t14;
        $[46] = t15;
        $[47] = t18;
        $[48] = t21;
        $[49] = t9;
        $[50] = t22;
    } else {
        t22 = $[50];
    }
    return t22;
}
_s1(EditServiceModal, "L6Nfsmcvb682tVK7xLv1DuiGUcs=");
_c1 = EditServiceModal;
function SellItemForm(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(62);
    if ($[0] !== "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e") {
        for(let $i = 0; $i < 62; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e";
    }
    const { item, onSubmit, onCancel, country } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            quantity: "1",
            customerName: "",
            paymentMethod: "cash"
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const maxQuantity = item.quantity;
    const totalPrice = parseInt(formData.quantity || "0") * (item.selling_price || item.cost_price || 0);
    let t2;
    if ($[2] !== formData || $[3] !== onSubmit) {
        t2 = ({
            "SellItemForm[handleSubmit]": (e)=>{
                e.preventDefault();
                onSubmit(formData);
            }
        })["SellItemForm[handleSubmit]"];
        $[2] = formData;
        $[3] = onSubmit;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const handleSubmit = t2;
    let t3;
    if ($[5] !== item.item_name) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "font-medium text-gray-900",
            children: item.item_name
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1207,
            columnNumber: 10
        }, this);
        $[5] = item.item_name;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== item.quantity || $[8] !== item.unit) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm text-gray-500",
            children: [
                "Available: ",
                item.quantity,
                " ",
                item.unit
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1215,
            columnNumber: 10
        }, this);
        $[7] = item.quantity;
        $[8] = item.unit;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    const t5 = item.selling_price || item.cost_price || 0;
    let t6;
    if ($[10] !== country || $[11] !== t5) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(t5, country);
        $[10] = country;
        $[11] = t5;
        $[12] = t6;
    } else {
        t6 = $[12];
    }
    let t7;
    if ($[13] !== item.unit || $[14] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm font-medium text-green-600",
            children: [
                t6,
                " per ",
                item.unit
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1234,
            columnNumber: 10
        }, this);
        $[13] = item.unit;
        $[14] = t6;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] !== t3 || $[17] !== t4 || $[18] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-50 p-3 rounded-lg",
            children: [
                t3,
                t4,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1243,
            columnNumber: 10
        }, this);
        $[16] = t3;
        $[17] = t4;
        $[18] = t7;
        $[19] = t8;
    } else {
        t8 = $[19];
    }
    let t9;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Quantity"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1253,
            columnNumber: 10
        }, this);
        $[20] = t9;
    } else {
        t9 = $[20];
    }
    let t10;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = ({
            "SellItemForm[<input>.onChange]": (e_0)=>setFormData({
                    "SellItemForm[<input>.onChange > setFormData()]": (prev)=>({
                            ...prev,
                            quantity: e_0.target.value
                        })
                }["SellItemForm[<input>.onChange > setFormData()]"])
        })["SellItemForm[<input>.onChange]"];
        $[21] = t10;
    } else {
        t10 = $[21];
    }
    let t11;
    let t12;
    if ($[22] !== formData.quantity || $[23] !== maxQuantity) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            required: true,
            min: "1",
            max: maxQuantity,
            value: formData.quantity,
            onChange: t10,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            placeholder: "1"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1275,
            columnNumber: 11
        }, this);
        t12 = parseInt(formData.quantity) > maxQuantity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-red-500 text-xs mt-1",
            children: "Cannot exceed available quantity"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1276,
            columnNumber: 56
        }, this);
        $[22] = formData.quantity;
        $[23] = maxQuantity;
        $[24] = t11;
        $[25] = t12;
    } else {
        t11 = $[24];
        t12 = $[25];
    }
    let t13;
    if ($[26] !== t11 || $[27] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t9,
                t11,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1287,
            columnNumber: 11
        }, this);
        $[26] = t11;
        $[27] = t12;
        $[28] = t13;
    } else {
        t13 = $[28];
    }
    let t14;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Customer Name (Optional)"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1296,
            columnNumber: 11
        }, this);
        $[29] = t14;
    } else {
        t14 = $[29];
    }
    let t15;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = ({
            "SellItemForm[<input>.onChange]": (e_1)=>setFormData({
                    "SellItemForm[<input>.onChange > setFormData()]": (prev_0)=>({
                            ...prev_0,
                            customerName: e_1.target.value
                        })
                }["SellItemForm[<input>.onChange > setFormData()]"])
        })["SellItemForm[<input>.onChange]"];
        $[30] = t15;
    } else {
        t15 = $[30];
    }
    let t16;
    if ($[31] !== formData.customerName) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t14,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: formData.customerName,
                    onChange: t15,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "Enter customer name"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1317,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1317,
            columnNumber: 11
        }, this);
        $[31] = formData.customerName;
        $[32] = t16;
    } else {
        t16 = $[32];
    }
    let t17;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Payment Method"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1325,
            columnNumber: 11
        }, this);
        $[33] = t17;
    } else {
        t17 = $[33];
    }
    let t18;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = ({
            "SellItemForm[<select>.onChange]": (e_2)=>setFormData({
                    "SellItemForm[<select>.onChange > setFormData()]": (prev_1)=>({
                            ...prev_1,
                            paymentMethod: e_2.target.value
                        })
                }["SellItemForm[<select>.onChange > setFormData()]"])
        })["SellItemForm[<select>.onChange]"];
        $[34] = t18;
    } else {
        t18 = $[34];
    }
    let t19;
    let t20;
    let t21;
    let t22;
    if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "cash",
            children: "Cash"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1349,
            columnNumber: 11
        }, this);
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "card",
            children: "Card"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1350,
            columnNumber: 11
        }, this);
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "transfer",
            children: "Bank Transfer"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1351,
            columnNumber: 11
        }, this);
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "mobile_money",
            children: "Mobile Money"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1352,
            columnNumber: 11
        }, this);
        $[35] = t19;
        $[36] = t20;
        $[37] = t21;
        $[38] = t22;
    } else {
        t19 = $[35];
        t20 = $[36];
        t21 = $[37];
        t22 = $[38];
    }
    let t23;
    if ($[39] !== formData.paymentMethod) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t17,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    value: formData.paymentMethod,
                    onChange: t18,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    children: [
                        t19,
                        t20,
                        t21,
                        t22
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1365,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1365,
            columnNumber: 11
        }, this);
        $[39] = formData.paymentMethod;
        $[40] = t23;
    } else {
        t23 = $[40];
    }
    let t24;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm text-blue-700",
            children: "Total Amount"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1373,
            columnNumber: 11
        }, this);
        $[41] = t24;
    } else {
        t24 = $[41];
    }
    let t25;
    if ($[42] !== country || $[43] !== totalPrice) {
        t25 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalPrice, country);
        $[42] = country;
        $[43] = totalPrice;
        $[44] = t25;
    } else {
        t25 = $[44];
    }
    let t26;
    if ($[45] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-blue-50 p-3 rounded-lg",
            children: [
                t24,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-xl font-bold text-blue-600",
                    children: t25
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1389,
                    columnNumber: 59
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1389,
            columnNumber: 11
        }, this);
        $[45] = t25;
        $[46] = t26;
    } else {
        t26 = $[46];
    }
    let t27;
    if ($[47] !== onCancel) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onCancel,
            className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1397,
            columnNumber: 11
        }, this);
        $[47] = onCancel;
        $[48] = t27;
    } else {
        t27 = $[48];
    }
    const t28 = parseInt(formData.quantity) > maxQuantity || parseInt(formData.quantity) <= 0;
    let t29;
    if ($[49] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            disabled: t28,
            className: "flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed",
            children: "Sell Item"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1406,
            columnNumber: 11
        }, this);
        $[49] = t28;
        $[50] = t29;
    } else {
        t29 = $[50];
    }
    let t30;
    if ($[51] !== t27 || $[52] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3 pt-2",
            children: [
                t27,
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1414,
            columnNumber: 11
        }, this);
        $[51] = t27;
        $[52] = t29;
        $[53] = t30;
    } else {
        t30 = $[53];
    }
    let t31;
    if ($[54] !== handleSubmit || $[55] !== t13 || $[56] !== t16 || $[57] !== t23 || $[58] !== t26 || $[59] !== t30 || $[60] !== t8) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [
                t8,
                t13,
                t16,
                t23,
                t26,
                t30
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1423,
            columnNumber: 11
        }, this);
        $[54] = handleSubmit;
        $[55] = t13;
        $[56] = t16;
        $[57] = t23;
        $[58] = t26;
        $[59] = t30;
        $[60] = t8;
        $[61] = t31;
    } else {
        t31 = $[61];
    }
    return t31;
}
_s2(SellItemForm, "qG0Br3GWDSR0ooKiAH4Ce5s/j+A=");
_c2 = SellItemForm;
function EditInventoryForm(t0) {
    _s3();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(87);
    if ($[0] !== "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e") {
        for(let $i = 0; $i < 87; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e";
    }
    const { item, onSubmit, onCancel, country } = t0;
    const t1 = item.item_name || "";
    const t2 = item.category || "";
    let t3;
    if ($[1] !== item.quantity) {
        t3 = item.quantity?.toString() || "";
        $[1] = item.quantity;
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    let t4;
    if ($[3] !== item.threshold) {
        t4 = item.threshold?.toString() || "";
        $[3] = item.threshold;
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    const t5 = item.unit || "";
    let t6;
    if ($[5] !== item.cost_price) {
        t6 = item.cost_price?.toString() || "";
        $[5] = item.cost_price;
        $[6] = t6;
    } else {
        t6 = $[6];
    }
    let t7;
    if ($[7] !== item.selling_price) {
        t7 = item.selling_price?.toString() || "";
        $[7] = item.selling_price;
        $[8] = t7;
    } else {
        t7 = $[8];
    }
    const t8 = item.supplier || "";
    let t9;
    if ($[9] !== t1 || $[10] !== t2 || $[11] !== t3 || $[12] !== t4 || $[13] !== t5 || $[14] !== t6 || $[15] !== t7 || $[16] !== t8) {
        t9 = {
            item_name: t1,
            category: t2,
            quantity: t3,
            threshold: t4,
            unit: t5,
            cost_price: t6,
            selling_price: t7,
            supplier: t8
        };
        $[9] = t1;
        $[10] = t2;
        $[11] = t3;
        $[12] = t4;
        $[13] = t5;
        $[14] = t6;
        $[15] = t7;
        $[16] = t8;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t9);
    let t10;
    if ($[18] !== formData || $[19] !== onSubmit) {
        t10 = ({
            "EditInventoryForm[handleSubmit]": (e)=>{
                e.preventDefault();
                onSubmit(formData);
            }
        })["EditInventoryForm[handleSubmit]"];
        $[18] = formData;
        $[19] = onSubmit;
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    const handleSubmit = t10;
    let t11;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Item Name"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1529,
            columnNumber: 11
        }, this);
        $[21] = t11;
    } else {
        t11 = $[21];
    }
    let t12;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = ({
            "EditInventoryForm[<input>.onChange]": (e_0)=>setFormData({
                    "EditInventoryForm[<input>.onChange > setFormData()]": (prev)=>({
                            ...prev,
                            item_name: e_0.target.value
                        })
                }["EditInventoryForm[<input>.onChange > setFormData()]"])
        })["EditInventoryForm[<input>.onChange]"];
        $[22] = t12;
    } else {
        t12 = $[22];
    }
    let t13;
    if ($[23] !== formData.item_name) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t11,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    required: true,
                    value: formData.item_name,
                    onChange: t12,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "e.g., Shampoo"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1550,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1550,
            columnNumber: 11
        }, this);
        $[23] = formData.item_name;
        $[24] = t13;
    } else {
        t13 = $[24];
    }
    let t14;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Category"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1558,
            columnNumber: 11
        }, this);
        $[25] = t14;
    } else {
        t14 = $[25];
    }
    let t15;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = ({
            "EditInventoryForm[<input>.onChange]": (e_1)=>setFormData({
                    "EditInventoryForm[<input>.onChange > setFormData()]": (prev_0)=>({
                            ...prev_0,
                            category: e_1.target.value
                        })
                }["EditInventoryForm[<input>.onChange > setFormData()]"])
        })["EditInventoryForm[<input>.onChange]"];
        $[26] = t15;
    } else {
        t15 = $[26];
    }
    let t16;
    if ($[27] !== formData.category) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t14,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: formData.category,
                    onChange: t15,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "e.g., Hair Care"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1579,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1579,
            columnNumber: 11
        }, this);
        $[27] = formData.category;
        $[28] = t16;
    } else {
        t16 = $[28];
    }
    let t17;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Quantity"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1587,
            columnNumber: 11
        }, this);
        $[29] = t17;
    } else {
        t17 = $[29];
    }
    let t18;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = ({
            "EditInventoryForm[<input>.onChange]": (e_2)=>setFormData({
                    "EditInventoryForm[<input>.onChange > setFormData()]": (prev_1)=>({
                            ...prev_1,
                            quantity: e_2.target.value
                        })
                }["EditInventoryForm[<input>.onChange > setFormData()]"])
        })["EditInventoryForm[<input>.onChange]"];
        $[30] = t18;
    } else {
        t18 = $[30];
    }
    let t19;
    if ($[31] !== formData.quantity) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t17,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    required: true,
                    value: formData.quantity,
                    onChange: t18,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "10",
                    min: "0",
                    step: "1"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1608,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1608,
            columnNumber: 11
        }, this);
        $[31] = formData.quantity;
        $[32] = t19;
    } else {
        t19 = $[32];
    }
    let t20;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Min Stock"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1616,
            columnNumber: 11
        }, this);
        $[33] = t20;
    } else {
        t20 = $[33];
    }
    let t21;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = ({
            "EditInventoryForm[<input>.onChange]": (e_3)=>setFormData({
                    "EditInventoryForm[<input>.onChange > setFormData()]": (prev_2)=>({
                            ...prev_2,
                            threshold: e_3.target.value
                        })
                }["EditInventoryForm[<input>.onChange > setFormData()]"])
        })["EditInventoryForm[<input>.onChange]"];
        $[34] = t21;
    } else {
        t21 = $[34];
    }
    let t22;
    if ($[35] !== formData.threshold) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t20,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    required: true,
                    value: formData.threshold,
                    onChange: t21,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "2",
                    min: "0",
                    step: "1"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1637,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1637,
            columnNumber: 11
        }, this);
        $[35] = formData.threshold;
        $[36] = t22;
    } else {
        t22 = $[36];
    }
    let t23;
    if ($[37] !== t19 || $[38] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
                t19,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1645,
            columnNumber: 11
        }, this);
        $[37] = t19;
        $[38] = t22;
        $[39] = t23;
    } else {
        t23 = $[39];
    }
    let t24;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Unit"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1654,
            columnNumber: 11
        }, this);
        $[40] = t24;
    } else {
        t24 = $[40];
    }
    let t25;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t25 = ({
            "EditInventoryForm[<select>.onChange]": (e_4)=>setFormData({
                    "EditInventoryForm[<select>.onChange > setFormData()]": (prev_3)=>({
                            ...prev_3,
                            unit: e_4.target.value
                        })
                }["EditInventoryForm[<select>.onChange > setFormData()]"])
        })["EditInventoryForm[<select>.onChange]"];
        $[41] = t25;
    } else {
        t25 = $[41];
    }
    let t26;
    let t27;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "",
            children: "Select Unit"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1676,
            columnNumber: 11
        }, this);
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "pieces",
            children: "Pieces"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1677,
            columnNumber: 11
        }, this);
        $[42] = t26;
        $[43] = t27;
    } else {
        t26 = $[42];
        t27 = $[43];
    }
    let t28;
    if ($[44] !== formData.unit) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t24,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    required: true,
                    value: formData.unit,
                    onChange: t25,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    children: [
                        t26,
                        t27
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1686,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1686,
            columnNumber: 11
        }, this);
        $[44] = formData.unit;
        $[45] = t28;
    } else {
        t28 = $[45];
    }
    let t29;
    if ($[46] !== country) {
        t29 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country);
        $[46] = country;
        $[47] = t29;
    } else {
        t29 = $[47];
    }
    let t30;
    if ($[48] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: [
                "Cost Price (",
                t29,
                ")"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1702,
            columnNumber: 11
        }, this);
        $[48] = t29;
        $[49] = t30;
    } else {
        t30 = $[49];
    }
    let t31;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = ({
            "EditInventoryForm[<input>.onChange]": (e_5)=>setFormData({
                    "EditInventoryForm[<input>.onChange > setFormData()]": (prev_4)=>({
                            ...prev_4,
                            cost_price: e_5.target.value
                        })
                }["EditInventoryForm[<input>.onChange > setFormData()]"])
        })["EditInventoryForm[<input>.onChange]"];
        $[50] = t31;
    } else {
        t31 = $[50];
    }
    let t32;
    if ($[51] !== formData.cost_price) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            value: formData.cost_price,
            onChange: t31,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            placeholder: "0.00",
            step: "0.01",
            min: "0"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1724,
            columnNumber: 11
        }, this);
        $[51] = formData.cost_price;
        $[52] = t32;
    } else {
        t32 = $[52];
    }
    let t33;
    if ($[53] !== t30 || $[54] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t30,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1732,
            columnNumber: 11
        }, this);
        $[53] = t30;
        $[54] = t32;
        $[55] = t33;
    } else {
        t33 = $[55];
    }
    let t34;
    if ($[56] !== country) {
        t34 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country);
        $[56] = country;
        $[57] = t34;
    } else {
        t34 = $[57];
    }
    let t35;
    if ($[58] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: [
                "Selling Price (",
                t34,
                ")"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1749,
            columnNumber: 11
        }, this);
        $[58] = t34;
        $[59] = t35;
    } else {
        t35 = $[59];
    }
    let t36;
    if ($[60] === Symbol.for("react.memo_cache_sentinel")) {
        t36 = ({
            "EditInventoryForm[<input>.onChange]": (e_6)=>setFormData({
                    "EditInventoryForm[<input>.onChange > setFormData()]": (prev_5)=>({
                            ...prev_5,
                            selling_price: e_6.target.value
                        })
                }["EditInventoryForm[<input>.onChange > setFormData()]"])
        })["EditInventoryForm[<input>.onChange]"];
        $[60] = t36;
    } else {
        t36 = $[60];
    }
    let t37;
    if ($[61] !== formData.selling_price) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            value: formData.selling_price,
            onChange: t36,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            placeholder: "0.00",
            step: "0.01",
            min: "0"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1771,
            columnNumber: 11
        }, this);
        $[61] = formData.selling_price;
        $[62] = t37;
    } else {
        t37 = $[62];
    }
    let t38;
    if ($[63] !== t35 || $[64] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t35,
                t37
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1779,
            columnNumber: 11
        }, this);
        $[63] = t35;
        $[64] = t37;
        $[65] = t38;
    } else {
        t38 = $[65];
    }
    let t39;
    if ($[66] !== t33 || $[67] !== t38) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
                t33,
                t38
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1788,
            columnNumber: 11
        }, this);
        $[66] = t33;
        $[67] = t38;
        $[68] = t39;
    } else {
        t39 = $[68];
    }
    let t40;
    if ($[69] === Symbol.for("react.memo_cache_sentinel")) {
        t40 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Supplier"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1797,
            columnNumber: 11
        }, this);
        $[69] = t40;
    } else {
        t40 = $[69];
    }
    let t41;
    if ($[70] === Symbol.for("react.memo_cache_sentinel")) {
        t41 = ({
            "EditInventoryForm[<input>.onChange]": (e_7)=>setFormData({
                    "EditInventoryForm[<input>.onChange > setFormData()]": (prev_6)=>({
                            ...prev_6,
                            supplier: e_7.target.value
                        })
                }["EditInventoryForm[<input>.onChange > setFormData()]"])
        })["EditInventoryForm[<input>.onChange]"];
        $[70] = t41;
    } else {
        t41 = $[70];
    }
    let t42;
    if ($[71] !== formData.supplier) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t40,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: formData.supplier,
                    onChange: t41,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "e.g., Supplier Name"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 1818,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1818,
            columnNumber: 11
        }, this);
        $[71] = formData.supplier;
        $[72] = t42;
    } else {
        t42 = $[72];
    }
    let t43;
    if ($[73] !== onCancel) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onCancel,
            className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1826,
            columnNumber: 11
        }, this);
        $[73] = onCancel;
        $[74] = t43;
    } else {
        t43 = $[74];
    }
    let t44;
    if ($[75] === Symbol.for("react.memo_cache_sentinel")) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
            children: "Update Item"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1834,
            columnNumber: 11
        }, this);
        $[75] = t44;
    } else {
        t44 = $[75];
    }
    let t45;
    if ($[76] !== t43) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3 pt-2",
            children: [
                t43,
                t44
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1841,
            columnNumber: 11
        }, this);
        $[76] = t43;
        $[77] = t45;
    } else {
        t45 = $[77];
    }
    let t46;
    if ($[78] !== handleSubmit || $[79] !== t13 || $[80] !== t16 || $[81] !== t23 || $[82] !== t28 || $[83] !== t39 || $[84] !== t42 || $[85] !== t45) {
        t46 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [
                t13,
                t16,
                t23,
                t28,
                t39,
                t42,
                t45
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1849,
            columnNumber: 11
        }, this);
        $[78] = handleSubmit;
        $[79] = t13;
        $[80] = t16;
        $[81] = t23;
        $[82] = t28;
        $[83] = t39;
        $[84] = t42;
        $[85] = t45;
        $[86] = t46;
    } else {
        t46 = $[86];
    }
    return t46;
}
_s3(EditInventoryForm, "ZTZlFqtoEvixUxUe0rHJQ/AR6lc=");
_c3 = EditInventoryForm;
function AddInventoryForm(t0) {
    _s4();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(128);
    if ($[0] !== "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e") {
        for(let $i = 0; $i < 128; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e";
    }
    const { onSubmit, onCancel, country, industry, t } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            item_name: "",
            category: "",
            quantity: "",
            threshold: "",
            unit: "",
            cost_price: "",
            selling_price: "",
            supplier: ""
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    if ($[2] !== formData || $[3] !== onSubmit) {
        t2 = ({
            "AddInventoryForm[handleSubmit]": (e)=>{
                e.preventDefault();
                onSubmit({
                    ...formData,
                    quantity: parseFloat(formData.quantity),
                    threshold: parseFloat(formData.threshold),
                    cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
                    selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null
                });
            }
        })["AddInventoryForm[handleSubmit]"];
        $[2] = formData;
        $[3] = onSubmit;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const handleSubmit = t2;
    let t3;
    if ($[5] !== t) {
        t3 = t("item_name");
        $[5] = t;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: t3
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1927,
            columnNumber: 10
        }, this);
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = ({
            "AddInventoryForm[<input>.onChange]": (e_0)=>setFormData({
                    "AddInventoryForm[<input>.onChange > setFormData()]": (prev)=>({
                            ...prev,
                            item_name: e_0.target.value
                        })
                }["AddInventoryForm[<input>.onChange > setFormData()]"])
        })["AddInventoryForm[<input>.onChange]"];
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    const t6 = industry === "food" ? "e.g., Fresh Vegetables" : industry === "retail" ? "e.g., Premium Headphones" : industry === "transport" ? "e.g., Fuel Can" : industry === "freelance" ? "e.g., Software License" : "e.g., Item Name";
    let t7;
    if ($[10] !== formData.item_name || $[11] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            required: true,
            value: formData.item_name,
            onChange: t5,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
            placeholder: t6
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1950,
            columnNumber: 10
        }, this);
        $[10] = formData.item_name;
        $[11] = t6;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== t4 || $[14] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t4,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1959,
            columnNumber: 10
        }, this);
        $[13] = t4;
        $[14] = t7;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    let t9;
    if ($[16] !== t) {
        t9 = t("category");
        $[16] = t;
        $[17] = t9;
    } else {
        t9 = $[17];
    }
    let t10;
    if ($[18] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: t9
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 1976,
            columnNumber: 11
        }, this);
        $[18] = t9;
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    const t11 = formData.category;
    let t12;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = ({
            "AddInventoryForm[<input>.onChange]": (e_1)=>setFormData({
                    "AddInventoryForm[<input>.onChange > setFormData()]": (prev_0)=>({
                            ...prev_0,
                            category: e_1.target.value
                        })
                }["AddInventoryForm[<input>.onChange > setFormData()]"])
        })["AddInventoryForm[<input>.onChange]"];
        $[20] = t12;
    } else {
        t12 = $[20];
    }
    let t13;
    if ($[21] !== t) {
        t13 = t("enter_category", "Enter category");
        $[21] = t;
        $[22] = t13;
    } else {
        t13 = $[22];
    }
    let t14;
    if ($[23] !== formData.category || $[24] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            required: true,
            value: t11,
            onChange: t12,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
            placeholder: t13
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2007,
            columnNumber: 11
        }, this);
        $[23] = formData.category;
        $[24] = t13;
        $[25] = t14;
    } else {
        t14 = $[25];
    }
    let t15;
    if ($[26] !== t10 || $[27] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t10,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2016,
            columnNumber: 11
        }, this);
        $[26] = t10;
        $[27] = t14;
        $[28] = t15;
    } else {
        t15 = $[28];
    }
    let t16;
    if ($[29] !== t) {
        t16 = t("quantity");
        $[29] = t;
        $[30] = t16;
    } else {
        t16 = $[30];
    }
    let t17;
    if ($[31] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: t16
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2033,
            columnNumber: 11
        }, this);
        $[31] = t16;
        $[32] = t17;
    } else {
        t17 = $[32];
    }
    let t18;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = ({
            "AddInventoryForm[<input>.onChange]": (e_2)=>setFormData({
                    "AddInventoryForm[<input>.onChange > setFormData()]": (prev_1)=>({
                            ...prev_1,
                            quantity: e_2.target.value
                        })
                }["AddInventoryForm[<input>.onChange > setFormData()]"])
        })["AddInventoryForm[<input>.onChange]"];
        $[33] = t18;
    } else {
        t18 = $[33];
    }
    let t19;
    if ($[34] !== formData.quantity) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            required: true,
            value: formData.quantity,
            onChange: t18,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
            placeholder: "10"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2055,
            columnNumber: 11
        }, this);
        $[34] = formData.quantity;
        $[35] = t19;
    } else {
        t19 = $[35];
    }
    let t20;
    if ($[36] !== t17 || $[37] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t17,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2063,
            columnNumber: 11
        }, this);
        $[36] = t17;
        $[37] = t19;
        $[38] = t20;
    } else {
        t20 = $[38];
    }
    let t21;
    if ($[39] !== t) {
        t21 = t("inventory.min");
        $[39] = t;
        $[40] = t21;
    } else {
        t21 = $[40];
    }
    let t22;
    if ($[41] !== t) {
        t22 = t("stock", "Stock");
        $[41] = t;
        $[42] = t22;
    } else {
        t22 = $[42];
    }
    let t23;
    if ($[43] !== t21 || $[44] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: [
                t21,
                " ",
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2088,
            columnNumber: 11
        }, this);
        $[43] = t21;
        $[44] = t22;
        $[45] = t23;
    } else {
        t23 = $[45];
    }
    let t24;
    if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = ({
            "AddInventoryForm[<input>.onChange]": (e_3)=>setFormData({
                    "AddInventoryForm[<input>.onChange > setFormData()]": (prev_2)=>({
                            ...prev_2,
                            threshold: e_3.target.value
                        })
                }["AddInventoryForm[<input>.onChange > setFormData()]"])
        })["AddInventoryForm[<input>.onChange]"];
        $[46] = t24;
    } else {
        t24 = $[46];
    }
    let t25;
    if ($[47] !== formData.threshold) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            required: true,
            value: formData.threshold,
            onChange: t24,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
            placeholder: "5"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2111,
            columnNumber: 11
        }, this);
        $[47] = formData.threshold;
        $[48] = t25;
    } else {
        t25 = $[48];
    }
    let t26;
    if ($[49] !== t23 || $[50] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t23,
                t25
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2119,
            columnNumber: 11
        }, this);
        $[49] = t23;
        $[50] = t25;
        $[51] = t26;
    } else {
        t26 = $[51];
    }
    let t27;
    if ($[52] !== t20 || $[53] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
                t20,
                t26
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2128,
            columnNumber: 11
        }, this);
        $[52] = t20;
        $[53] = t26;
        $[54] = t27;
    } else {
        t27 = $[54];
    }
    let t28;
    if ($[55] !== t) {
        t28 = t("inventory.units");
        $[55] = t;
        $[56] = t28;
    } else {
        t28 = $[56];
    }
    let t29;
    if ($[57] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: t28
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2145,
            columnNumber: 11
        }, this);
        $[57] = t28;
        $[58] = t29;
    } else {
        t29 = $[58];
    }
    const t30 = formData.unit;
    let t31;
    if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
        t31 = ({
            "AddInventoryForm[<select>.onChange]": (e_4)=>setFormData({
                    "AddInventoryForm[<select>.onChange > setFormData()]": (prev_3)=>({
                            ...prev_3,
                            unit: e_4.target.value
                        })
                }["AddInventoryForm[<select>.onChange > setFormData()]"])
        })["AddInventoryForm[<select>.onChange]"];
        $[59] = t31;
    } else {
        t31 = $[59];
    }
    let t32;
    if ($[60] !== t) {
        t32 = t("select_category");
        $[60] = t;
        $[61] = t32;
    } else {
        t32 = $[61];
    }
    let t33;
    if ($[62] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "",
            children: t32
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2176,
            columnNumber: 11
        }, this);
        $[62] = t32;
        $[63] = t33;
    } else {
        t33 = $[63];
    }
    let t34;
    if ($[64] !== t) {
        t34 = t("inventory.pieces");
        $[64] = t;
        $[65] = t34;
    } else {
        t34 = $[65];
    }
    let t35;
    if ($[66] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
            value: "pieces",
            children: t34
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2192,
            columnNumber: 11
        }, this);
        $[66] = t34;
        $[67] = t35;
    } else {
        t35 = $[67];
    }
    let t36;
    if ($[68] !== formData.unit || $[69] !== t33 || $[70] !== t35) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            required: true,
            value: t30,
            onChange: t31,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
            children: [
                t33,
                t35
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2200,
            columnNumber: 11
        }, this);
        $[68] = formData.unit;
        $[69] = t33;
        $[70] = t35;
        $[71] = t36;
    } else {
        t36 = $[71];
    }
    let t37;
    if ($[72] !== t29 || $[73] !== t36) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t29,
                t36
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2210,
            columnNumber: 11
        }, this);
        $[72] = t29;
        $[73] = t36;
        $[74] = t37;
    } else {
        t37 = $[74];
    }
    let t38;
    if ($[75] !== t) {
        t38 = t("common.suppliers");
        $[75] = t;
        $[76] = t38;
    } else {
        t38 = $[76];
    }
    let t39;
    if ($[77] !== t38) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: t38
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2227,
            columnNumber: 11
        }, this);
        $[77] = t38;
        $[78] = t39;
    } else {
        t39 = $[78];
    }
    let t40;
    if ($[79] === Symbol.for("react.memo_cache_sentinel")) {
        t40 = ({
            "AddInventoryForm[<input>.onChange]": (e_5)=>setFormData({
                    "AddInventoryForm[<input>.onChange > setFormData()]": (prev_4)=>({
                            ...prev_4,
                            supplier: e_5.target.value
                        })
                }["AddInventoryForm[<input>.onChange > setFormData()]"])
        })["AddInventoryForm[<input>.onChange]"];
        $[79] = t40;
    } else {
        t40 = $[79];
    }
    let t41;
    if ($[80] !== formData.supplier) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            value: formData.supplier,
            onChange: t40,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
            placeholder: "Supplier name"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2249,
            columnNumber: 11
        }, this);
        $[80] = formData.supplier;
        $[81] = t41;
    } else {
        t41 = $[81];
    }
    let t42;
    if ($[82] !== t39 || $[83] !== t41) {
        t42 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t39,
                t41
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2257,
            columnNumber: 11
        }, this);
        $[82] = t39;
        $[83] = t41;
        $[84] = t42;
    } else {
        t42 = $[84];
    }
    let t43;
    if ($[85] !== t37 || $[86] !== t42) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
                t37,
                t42
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2266,
            columnNumber: 11
        }, this);
        $[85] = t37;
        $[86] = t42;
        $[87] = t43;
    } else {
        t43 = $[87];
    }
    let t44;
    if ($[88] !== country) {
        t44 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country);
        $[88] = country;
        $[89] = t44;
    } else {
        t44 = $[89];
    }
    let t45;
    if ($[90] !== t44) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: [
                "Cost Price (",
                t44,
                ")"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2283,
            columnNumber: 11
        }, this);
        $[90] = t44;
        $[91] = t45;
    } else {
        t45 = $[91];
    }
    let t46;
    if ($[92] === Symbol.for("react.memo_cache_sentinel")) {
        t46 = ({
            "AddInventoryForm[<input>.onChange]": (e_6)=>setFormData({
                    "AddInventoryForm[<input>.onChange > setFormData()]": (prev_5)=>({
                            ...prev_5,
                            cost_price: e_6.target.value
                        })
                }["AddInventoryForm[<input>.onChange > setFormData()]"])
        })["AddInventoryForm[<input>.onChange]"];
        $[92] = t46;
    } else {
        t46 = $[92];
    }
    let t47;
    if ($[93] !== formData.cost_price) {
        t47 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            step: "0.01",
            value: formData.cost_price,
            onChange: t46,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
            placeholder: "0.00"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2305,
            columnNumber: 11
        }, this);
        $[93] = formData.cost_price;
        $[94] = t47;
    } else {
        t47 = $[94];
    }
    let t48;
    if ($[95] !== t45 || $[96] !== t47) {
        t48 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t45,
                t47
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2313,
            columnNumber: 11
        }, this);
        $[95] = t45;
        $[96] = t47;
        $[97] = t48;
    } else {
        t48 = $[97];
    }
    let t49;
    if ($[98] !== country) {
        t49 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country);
        $[98] = country;
        $[99] = t49;
    } else {
        t49 = $[99];
    }
    let t50;
    if ($[100] !== t49) {
        t50 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: [
                "Selling Price (",
                t49,
                ")"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2330,
            columnNumber: 11
        }, this);
        $[100] = t49;
        $[101] = t50;
    } else {
        t50 = $[101];
    }
    let t51;
    if ($[102] === Symbol.for("react.memo_cache_sentinel")) {
        t51 = ({
            "AddInventoryForm[<input>.onChange]": (e_7)=>setFormData({
                    "AddInventoryForm[<input>.onChange > setFormData()]": (prev_6)=>({
                            ...prev_6,
                            selling_price: e_7.target.value
                        })
                }["AddInventoryForm[<input>.onChange > setFormData()]"])
        })["AddInventoryForm[<input>.onChange]"];
        $[102] = t51;
    } else {
        t51 = $[102];
    }
    let t52;
    if ($[103] !== formData.selling_price) {
        t52 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "number",
            step: "0.01",
            value: formData.selling_price,
            onChange: t51,
            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
            placeholder: "0.00"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2352,
            columnNumber: 11
        }, this);
        $[103] = formData.selling_price;
        $[104] = t52;
    } else {
        t52 = $[104];
    }
    let t53;
    if ($[105] !== t50 || $[106] !== t52) {
        t53 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t50,
                t52
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2360,
            columnNumber: 11
        }, this);
        $[105] = t50;
        $[106] = t52;
        $[107] = t53;
    } else {
        t53 = $[107];
    }
    let t54;
    if ($[108] !== t48 || $[109] !== t53) {
        t54 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
                t48,
                t53
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2369,
            columnNumber: 11
        }, this);
        $[108] = t48;
        $[109] = t53;
        $[110] = t54;
    } else {
        t54 = $[110];
    }
    let t55;
    if ($[111] !== onCancel) {
        t55 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onCancel,
            className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2378,
            columnNumber: 11
        }, this);
        $[111] = onCancel;
        $[112] = t55;
    } else {
        t55 = $[112];
    }
    let t56;
    if ($[113] !== t) {
        t56 = t("inventory.add_new_item");
        $[113] = t;
        $[114] = t56;
    } else {
        t56 = $[114];
    }
    let t57;
    if ($[115] !== t56) {
        t57 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            className: "flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors",
            children: t56
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2394,
            columnNumber: 11
        }, this);
        $[115] = t56;
        $[116] = t57;
    } else {
        t57 = $[116];
    }
    let t58;
    if ($[117] !== t55 || $[118] !== t57) {
        t58 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3 pt-2",
            children: [
                t55,
                t57
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2402,
            columnNumber: 11
        }, this);
        $[117] = t55;
        $[118] = t57;
        $[119] = t58;
    } else {
        t58 = $[119];
    }
    let t59;
    if ($[120] !== handleSubmit || $[121] !== t15 || $[122] !== t27 || $[123] !== t43 || $[124] !== t54 || $[125] !== t58 || $[126] !== t8) {
        t59 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [
                t8,
                t15,
                t27,
                t43,
                t54,
                t58
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2411,
            columnNumber: 11
        }, this);
        $[120] = handleSubmit;
        $[121] = t15;
        $[122] = t27;
        $[123] = t43;
        $[124] = t54;
        $[125] = t58;
        $[126] = t8;
        $[127] = t59;
    } else {
        t59 = $[127];
    }
    return t59;
}
_s4(AddInventoryForm, "qG0Br3GWDSR0ooKiAH4Ce5s/j+A=");
_c4 = AddInventoryForm;
function AddServiceForm(t0) {
    _s5();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(51);
    if ($[0] !== "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e") {
        for(let $i = 0; $i < 51; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e";
    }
    const { onSubmit, onCancel, country, industry } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            name: "",
            category: "",
            price: "",
            duration: "",
            pricePerKm: "",
            baseAmount: "",
            description: ""
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    if ($[2] !== formData.baseAmount || $[3] !== formData.price || $[4] !== formData.pricePerKm || $[5] !== industry) {
        t2 = ({
            "AddServiceForm[calculateTotalFare]": ()=>{
                if (industry === "transport") {
                    const pricePerKm = parseFloat(formData.pricePerKm) || 0;
                    const baseAmount = parseFloat(formData.baseAmount) || 0;
                    return pricePerKm + baseAmount;
                } else {
                    return parseFloat(formData.price) || 0;
                }
            }
        })["AddServiceForm[calculateTotalFare]"];
        $[2] = formData.baseAmount;
        $[3] = formData.price;
        $[4] = formData.pricePerKm;
        $[5] = industry;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const calculateTotalFare = t2;
    let t3;
    if ($[7] !== calculateTotalFare || $[8] !== formData.baseAmount || $[9] !== formData.category || $[10] !== formData.description || $[11] !== formData.duration || $[12] !== formData.name || $[13] !== formData.pricePerKm || $[14] !== industry || $[15] !== onSubmit) {
        t3 = ({
            "AddServiceForm[handleSubmit]": (e)=>{
                e.preventDefault();
                const serviceData = {
                    service_name: formData.name,
                    category: formData.category,
                    price: calculateTotalFare(),
                    description: formData.description
                };
                if (industry === "transport") {
                    serviceData.metadata = {
                        price_per_km: parseFloat(formData.pricePerKm) || 0,
                        base_amount: parseFloat(formData.baseAmount) || 0
                    };
                } else {
                    const calculatedPrice = calculateTotalFare();
                    serviceData.metadata = {
                        price: calculatedPrice
                    };
                    if (formData.duration) {
                        serviceData.duration = parseInt(formData.duration);
                        serviceData.metadata.duration = parseInt(formData.duration);
                    }
                }
                onSubmit(serviceData);
            }
        })["AddServiceForm[handleSubmit]"];
        $[7] = calculateTotalFare;
        $[8] = formData.baseAmount;
        $[9] = formData.category;
        $[10] = formData.description;
        $[11] = formData.duration;
        $[12] = formData.name;
        $[13] = formData.pricePerKm;
        $[14] = industry;
        $[15] = onSubmit;
        $[16] = t3;
    } else {
        t3 = $[16];
    }
    const handleSubmit = t3;
    let t4;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = {
            retail: "e.g., Premium Headphones",
            food: "e.g., Special Pasta Dish",
            transport: "e.g., Airport Transfer",
            salon: "e.g., Haircut & Styling",
            tailor: "e.g., Custom Suit Alteration",
            repairs: "e.g., Phone Screen Repair",
            freelance: "e.g., Website Design Project"
        };
        $[17] = t4;
    } else {
        t4 = $[17];
    }
    const placeholders = t4;
    const placeholder = placeholders[industry] || "e.g., Service Name";
    let t5;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Service Name"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2539,
            columnNumber: 10
        }, this);
        $[18] = t5;
    } else {
        t5 = $[18];
    }
    let t6;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "AddServiceForm[<input>.onChange]": (e_0)=>setFormData({
                    "AddServiceForm[<input>.onChange > setFormData()]": (prev)=>({
                            ...prev,
                            name: e_0.target.value
                        })
                }["AddServiceForm[<input>.onChange > setFormData()]"])
        })["AddServiceForm[<input>.onChange]"];
        $[19] = t6;
    } else {
        t6 = $[19];
    }
    let t7;
    if ($[20] !== formData.name || $[21] !== placeholder) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t5,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    required: true,
                    value: formData.name,
                    onChange: t6,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: placeholder
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2560,
                    columnNumber: 19
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2560,
            columnNumber: 10
        }, this);
        $[20] = formData.name;
        $[21] = placeholder;
        $[22] = t7;
    } else {
        t7 = $[22];
    }
    let t8;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Category"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2569,
            columnNumber: 10
        }, this);
        $[23] = t8;
    } else {
        t8 = $[23];
    }
    let t9;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = ({
            "AddServiceForm[<input>.onChange]": (e_1)=>setFormData({
                    "AddServiceForm[<input>.onChange > setFormData()]": (prev_0)=>({
                            ...prev_0,
                            category: e_1.target.value
                        })
                }["AddServiceForm[<input>.onChange > setFormData()]"])
        })["AddServiceForm[<input>.onChange]"];
        $[24] = t9;
    } else {
        t9 = $[24];
    }
    let t10;
    if ($[25] !== formData.category) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t8,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    required: true,
                    value: formData.category,
                    onChange: t9,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "Enter category"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2590,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2590,
            columnNumber: 11
        }, this);
        $[25] = formData.category;
        $[26] = t10;
    } else {
        t10 = $[26];
    }
    let t11;
    if ($[27] !== calculateTotalFare || $[28] !== country || $[29] !== formData.baseAmount || $[30] !== formData.duration || $[31] !== formData.price || $[32] !== formData.pricePerKm || $[33] !== industry) {
        t11 = industry === "transport" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                    children: [
                                        "Price per km (",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country),
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 2598,
                                    columnNumber: 110
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    required: true,
                                    value: formData.pricePerKm,
                                    onChange: {
                                        "AddServiceForm[<input>.onChange]": (e_2)=>setFormData({
                                                "AddServiceForm[<input>.onChange > setFormData()]": (prev_1)=>({
                                                        ...prev_1,
                                                        pricePerKm: e_2.target.value
                                                    })
                                            }["AddServiceForm[<input>.onChange > setFormData()]"])
                                    }["AddServiceForm[<input>.onChange]"],
                                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    placeholder: "0.00",
                                    step: "0.01"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 2598,
                                    columnNumber: 219
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 2598,
                            columnNumber: 105
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-1",
                                    children: [
                                        "Base Amount (",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country),
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 2605,
                                    columnNumber: 215
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    value: formData.baseAmount,
                                    onChange: {
                                        "AddServiceForm[<input>.onChange]": (e_3)=>setFormData({
                                                "AddServiceForm[<input>.onChange > setFormData()]": (prev_2)=>({
                                                        ...prev_2,
                                                        baseAmount: e_3.target.value
                                                    })
                                            }["AddServiceForm[<input>.onChange > setFormData()]"])
                                    }["AddServiceForm[<input>.onChange]"],
                                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    placeholder: "0.00",
                                    step: "0.01"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 2605,
                                    columnNumber: 323
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 2605,
                            columnNumber: 210
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2598,
                    columnNumber: 65
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-blue-50 border border-blue-200 rounded-lg p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium text-blue-900",
                                    children: "Total Fare:"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 2612,
                                    columnNumber: 333
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg font-bold text-blue-900",
                                    children: [
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country),
                                        " ",
                                        calculateTotalFare().toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                                    lineNumber: 2612,
                                    columnNumber: 403
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 2612,
                            columnNumber: 282
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-blue-600 mt-1",
                            children: [
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country),
                                " ",
                                formData.pricePerKm || "0",
                                " (per km) + ",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country),
                                " ",
                                formData.baseAmount || "0",
                                " (base amount)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 2612,
                            columnNumber: 522
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2612,
                    columnNumber: 216
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2598,
            columnNumber: 38
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-700 mb-1",
                            children: [
                                "Price (",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country),
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 2612,
                            columnNumber: 760
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            required: true,
                            value: formData.price || "",
                            onChange: {
                                "AddServiceForm[<input>.onChange]": (e_4)=>setFormData({
                                        "AddServiceForm[<input>.onChange > setFormData()]": (prev_3)=>({
                                                ...prev_3,
                                                price: e_4.target.value
                                            })
                                    }["AddServiceForm[<input>.onChange > setFormData()]"])
                            }["AddServiceForm[<input>.onChange]"],
                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            placeholder: "0.00"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 2612,
                            columnNumber: 862
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2612,
                    columnNumber: 755
                }, this),
                (industry === "salon" || industry === "freelance") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-700 mb-1",
                            children: industry === "salon" ? "Duration (min)" : "Duration (days)"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 2619,
                            columnNumber: 256
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            value: formData.duration || "",
                            onChange: {
                                "AddServiceForm[<input>.onChange]": (e_5)=>setFormData({
                                        "AddServiceForm[<input>.onChange > setFormData()]": (prev_4)=>({
                                                ...prev_4,
                                                duration: e_5.target.value
                                            })
                                    }["AddServiceForm[<input>.onChange > setFormData()]"])
                            }["AddServiceForm[<input>.onChange]"],
                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            placeholder: industry === "freelance" ? "7" : "30",
                            step: "1"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                            lineNumber: 2619,
                            columnNumber: 389
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2619,
                    columnNumber: 251
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2612,
            columnNumber: 715
        }, this);
        $[27] = calculateTotalFare;
        $[28] = country;
        $[29] = formData.baseAmount;
        $[30] = formData.duration;
        $[31] = formData.price;
        $[32] = formData.pricePerKm;
        $[33] = industry;
        $[34] = t11;
    } else {
        t11 = $[34];
    }
    let t12;
    if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Description"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2640,
            columnNumber: 11
        }, this);
        $[35] = t12;
    } else {
        t12 = $[35];
    }
    let t13;
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = ({
            "AddServiceForm[<textarea>.onChange]": (e_6)=>setFormData({
                    "AddServiceForm[<textarea>.onChange > setFormData()]": (prev_5)=>({
                            ...prev_5,
                            description: e_6.target.value
                        })
                }["AddServiceForm[<textarea>.onChange > setFormData()]"])
        })["AddServiceForm[<textarea>.onChange]"];
        $[36] = t13;
    } else {
        t13 = $[36];
    }
    let t14;
    if ($[37] !== formData.description) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t12,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    required: true,
                    value: formData.description,
                    onChange: t13,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
                    rows: 3,
                    placeholder: "Describe your service..."
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2661,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2661,
            columnNumber: 11
        }, this);
        $[37] = formData.description;
        $[38] = t14;
    } else {
        t14 = $[38];
    }
    let t15;
    if ($[39] !== onCancel) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onCancel,
            className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2669,
            columnNumber: 11
        }, this);
        $[39] = onCancel;
        $[40] = t15;
    } else {
        t15 = $[40];
    }
    let t16;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
            children: "Add Service"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2677,
            columnNumber: 11
        }, this);
        $[41] = t16;
    } else {
        t16 = $[41];
    }
    let t17;
    if ($[42] !== t15) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3 pt-2",
            children: [
                t15,
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2684,
            columnNumber: 11
        }, this);
        $[42] = t15;
        $[43] = t17;
    } else {
        t17 = $[43];
    }
    let t18;
    if ($[44] !== handleSubmit || $[45] !== t10 || $[46] !== t11 || $[47] !== t14 || $[48] !== t17 || $[49] !== t7) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [
                t7,
                t10,
                t11,
                t14,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2692,
            columnNumber: 11
        }, this);
        $[44] = handleSubmit;
        $[45] = t10;
        $[46] = t11;
        $[47] = t14;
        $[48] = t17;
        $[49] = t7;
        $[50] = t18;
    } else {
        t18 = $[50];
    }
    return t18;
}
_s5(AddServiceForm, "qG0Br3GWDSR0ooKiAH4Ce5s/j+A=");
_c5 = AddServiceForm;
// KM Input Modal for Transport Services
function KmInputModal(t0) {
    _s6();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(85);
    if ($[0] !== "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e") {
        for(let $i = 0; $i < 85; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "250cbfa8cb89cef4a82667b6e887c7eb594f5286dd7be3eaa46d8f8cff77e28e";
    }
    const { service, onClose, onConfirm, country } = t0;
    const [km, setKm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [useBaseOnly, setUseBaseOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tips, setTips] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [pickupLocation, setPickupLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [dropoffLocation, setDropoffLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    let t1;
    if ($[1] !== km || $[2] !== service.metadata?.base_amount || $[3] !== service.metadata?.price_per_km || $[4] !== tips || $[5] !== useBaseOnly) {
        t1 = ({
            "KmInputModal[calculateFare]": ()=>{
                if (useBaseOnly) {
                    return (service.metadata?.base_amount || 0) + (parseFloat(tips) || 0);
                }
                const kmValue = parseFloat(km) || 0;
                const pricePerKm = service.metadata?.price_per_km || 0;
                const baseAmount = service.metadata?.base_amount || 0;
                const tipsAmount = parseFloat(tips) || 0;
                return kmValue * pricePerKm + baseAmount + tipsAmount;
            }
        })["KmInputModal[calculateFare]"];
        $[1] = km;
        $[2] = service.metadata?.base_amount;
        $[3] = service.metadata?.price_per_km;
        $[4] = tips;
        $[5] = useBaseOnly;
        $[6] = t1;
    } else {
        t1 = $[6];
    }
    const calculateFare = t1;
    let t2;
    if ($[7] !== dropoffLocation || $[8] !== km || $[9] !== onClose || $[10] !== onConfirm || $[11] !== pickupLocation || $[12] !== tips || $[13] !== useBaseOnly) {
        t2 = ({
            "KmInputModal[handleSubmit]": ()=>{
                onConfirm(km, useBaseOnly, tips, `${pickupLocation} → ${dropoffLocation}`);
                onClose();
            }
        })["KmInputModal[handleSubmit]"];
        $[7] = dropoffLocation;
        $[8] = km;
        $[9] = onClose;
        $[10] = onConfirm;
        $[11] = pickupLocation;
        $[12] = tips;
        $[13] = useBaseOnly;
        $[14] = t2;
    } else {
        t2 = $[14];
    }
    const handleSubmit = t2;
    let t3;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                className: "text-blue-600",
                size: 24
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 2772,
                columnNumber: 93
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2772,
            columnNumber: 10
        }, this);
        $[15] = t3;
    } else {
        t3 = $[15];
    }
    let t4;
    if ($[16] !== service.service_name) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-lg font-semibold text-gray-900",
            children: service.service_name
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2779,
            columnNumber: 10
        }, this);
        $[16] = service.service_name;
        $[17] = t4;
    } else {
        t4 = $[17];
    }
    let t5;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-gray-600",
            children: "Calculate trip fare"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2787,
            columnNumber: 10
        }, this);
        $[18] = t5;
    } else {
        t5 = $[18];
    }
    let t6;
    if ($[19] !== t4) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3 mb-4",
            children: [
                t3,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        t4,
                        t5
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2794,
                    columnNumber: 60
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2794,
            columnNumber: 10
        }, this);
        $[19] = t4;
        $[20] = t6;
    } else {
        t6 = $[20];
    }
    let t7;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Distance (km)"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2802,
            columnNumber: 10
        }, this);
        $[21] = t7;
    } else {
        t7 = $[21];
    }
    let t8;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = ({
            "KmInputModal[<input>.onChange]": (e)=>setKm(e.target.value)
        })["KmInputModal[<input>.onChange]"];
        $[22] = t8;
    } else {
        t8 = $[22];
    }
    let t9;
    if ($[23] !== km || $[24] !== useBaseOnly) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    value: km,
                    onChange: t8,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "0.0",
                    step: "0.1",
                    disabled: useBaseOnly
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2818,
                    columnNumber: 19
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2818,
            columnNumber: 10
        }, this);
        $[23] = km;
        $[24] = useBaseOnly;
        $[25] = t9;
    } else {
        t9 = $[25];
    }
    let t10;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = ({
            "KmInputModal[<input>.onChange]": (e_0)=>setUseBaseOnly(e_0.target.checked)
        })["KmInputModal[<input>.onChange]"];
        $[26] = t10;
    } else {
        t10 = $[26];
    }
    let t11;
    if ($[27] !== useBaseOnly) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            id: "baseOnly",
            checked: useBaseOnly,
            onChange: t10,
            className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2836,
            columnNumber: 11
        }, this);
        $[27] = useBaseOnly;
        $[28] = t11;
    } else {
        t11 = $[28];
    }
    let t12;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "baseOnly",
            className: "text-sm text-gray-700",
            children: "Use base amount only"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2844,
            columnNumber: 11
        }, this);
        $[29] = t12;
    } else {
        t12 = $[29];
    }
    let t13;
    if ($[30] !== t11) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2",
            children: [
                t11,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2851,
            columnNumber: 11
        }, this);
        $[30] = t11;
        $[31] = t13;
    } else {
        t13 = $[31];
    }
    let t14;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Tips (optional)"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2859,
            columnNumber: 11
        }, this);
        $[32] = t14;
    } else {
        t14 = $[32];
    }
    let t15;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = ({
            "KmInputModal[<input>.onChange]": (e_1)=>setTips(e_1.target.value)
        })["KmInputModal[<input>.onChange]"];
        $[33] = t15;
    } else {
        t15 = $[33];
    }
    let t16;
    if ($[34] !== tips) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t14,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    value: tips,
                    onChange: t15,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "0.00",
                    step: "0.01"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2875,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2875,
            columnNumber: 11
        }, this);
        $[34] = tips;
        $[35] = t16;
    } else {
        t16 = $[35];
    }
    let t17;
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Pickup Location"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2883,
            columnNumber: 11
        }, this);
        $[36] = t17;
    } else {
        t17 = $[36];
    }
    let t18;
    if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = ({
            "KmInputModal[<input>.onChange]": (e_2)=>setPickupLocation(e_2.target.value)
        })["KmInputModal[<input>.onChange]"];
        $[37] = t18;
    } else {
        t18 = $[37];
    }
    let t19;
    if ($[38] !== pickupLocation) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t17,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: pickupLocation,
                    onChange: t18,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "e.g., Nairobi CBD"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2899,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2899,
            columnNumber: 11
        }, this);
        $[38] = pickupLocation;
        $[39] = t19;
    } else {
        t19 = $[39];
    }
    let t20;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "block text-sm font-medium text-gray-700 mb-1",
            children: "Drop-off Location"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2907,
            columnNumber: 11
        }, this);
        $[40] = t20;
    } else {
        t20 = $[40];
    }
    let t21;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = ({
            "KmInputModal[<input>.onChange]": (e_3)=>setDropoffLocation(e_3.target.value)
        })["KmInputModal[<input>.onChange]"];
        $[41] = t21;
    } else {
        t21 = $[41];
    }
    let t22;
    if ($[42] !== dropoffLocation) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t20,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: dropoffLocation,
                    onChange: t21,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    placeholder: "e.g., Airport Terminal 3"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2923,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2923,
            columnNumber: 11
        }, this);
        $[42] = dropoffLocation;
        $[43] = t22;
    } else {
        t22 = $[43];
    }
    let t23;
    if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-sm font-medium text-blue-900",
            children: "Total Fare:"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2931,
            columnNumber: 11
        }, this);
        $[44] = t23;
    } else {
        t23 = $[44];
    }
    let t24;
    if ($[45] !== country) {
        t24 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country);
        $[45] = country;
        $[46] = t24;
    } else {
        t24 = $[46];
    }
    let t25;
    if ($[47] !== calculateFare) {
        t25 = calculateFare().toFixed(2);
        $[47] = calculateFare;
        $[48] = t25;
    } else {
        t25 = $[48];
    }
    let t26;
    if ($[49] !== t24 || $[50] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between items-center",
            children: [
                t23,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-lg font-bold text-blue-900",
                    children: [
                        t24,
                        " ",
                        t25
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                    lineNumber: 2954,
                    columnNumber: 67
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2954,
            columnNumber: 11
        }, this);
        $[49] = t24;
        $[50] = t25;
        $[51] = t26;
    } else {
        t26 = $[51];
    }
    let t27;
    if ($[52] !== country || $[53] !== km || $[54] !== service.metadata?.base_amount || $[55] !== service.metadata?.price_per_km || $[56] !== tips || $[57] !== useBaseOnly) {
        t27 = !useBaseOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-xs text-blue-600 mt-1",
            children: [
                "(",
                km || "0",
                " km × ",
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country),
                " ",
                service.metadata?.price_per_km || 0,
                ") + ",
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country),
                " ",
                service.metadata?.base_amount || 0,
                tips && ` + ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country)} ${tips} tips`
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2963,
            columnNumber: 27
        }, this);
        $[52] = country;
        $[53] = km;
        $[54] = service.metadata?.base_amount;
        $[55] = service.metadata?.price_per_km;
        $[56] = tips;
        $[57] = useBaseOnly;
        $[58] = t27;
    } else {
        t27 = $[58];
    }
    let t28;
    if ($[59] !== country || $[60] !== tips || $[61] !== useBaseOnly) {
        t28 = useBaseOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-xs text-blue-600 mt-1",
            children: [
                "Base amount only",
                tips && ` + ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrency"])(country)} ${tips} tips`
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2976,
            columnNumber: 26
        }, this);
        $[59] = country;
        $[60] = tips;
        $[61] = useBaseOnly;
        $[62] = t28;
    } else {
        t28 = $[62];
    }
    let t29;
    if ($[63] !== t26 || $[64] !== t27 || $[65] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-blue-50 border border-blue-200 rounded-lg p-3",
            children: [
                t26,
                t27,
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2986,
            columnNumber: 11
        }, this);
        $[63] = t26;
        $[64] = t27;
        $[65] = t28;
        $[66] = t29;
    } else {
        t29 = $[66];
    }
    let t30;
    if ($[67] !== t13 || $[68] !== t16 || $[69] !== t19 || $[70] !== t22 || $[71] !== t29 || $[72] !== t9) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                t9,
                t13,
                t16,
                t19,
                t22,
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 2996,
            columnNumber: 11
        }, this);
        $[67] = t13;
        $[68] = t16;
        $[69] = t19;
        $[70] = t22;
        $[71] = t29;
        $[72] = t9;
        $[73] = t30;
    } else {
        t30 = $[73];
    }
    let t31;
    if ($[74] !== onClose) {
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClose,
            className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
            children: "Cancel"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 3009,
            columnNumber: 11
        }, this);
        $[74] = onClose;
        $[75] = t31;
    } else {
        t31 = $[75];
    }
    let t32;
    if ($[76] !== handleSubmit) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleSubmit,
            className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
            children: "Confirm Fare"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 3017,
            columnNumber: 11
        }, this);
        $[76] = handleSubmit;
        $[77] = t32;
    } else {
        t32 = $[77];
    }
    let t33;
    if ($[78] !== t31 || $[79] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3 mt-6",
            children: [
                t31,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 3025,
            columnNumber: 11
        }, this);
        $[78] = t31;
        $[79] = t32;
        $[80] = t33;
    } else {
        t33 = $[80];
    }
    let t34;
    if ($[81] !== t30 || $[82] !== t33 || $[83] !== t6) {
        t34 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-2xl shadow-xl max-w-md w-full p-6",
                children: [
                    t6,
                    t30,
                    t33
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
                lineNumber: 3034,
                columnNumber: 113
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/services/page.tsx",
            lineNumber: 3034,
            columnNumber: 11
        }, this);
        $[81] = t30;
        $[82] = t33;
        $[83] = t6;
        $[84] = t34;
    } else {
        t34 = $[84];
    }
    return t34;
}
_s6(KmInputModal, "TBRKWcQOkTbF7vQ3vW3XJMPjgb4=");
_c6 = KmInputModal;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "ServicesPage");
__turbopack_context__.k.register(_c1, "EditServiceModal");
__turbopack_context__.k.register(_c2, "SellItemForm");
__turbopack_context__.k.register(_c3, "EditInventoryForm");
__turbopack_context__.k.register(_c4, "AddInventoryForm");
__turbopack_context__.k.register(_c5, "AddServiceForm");
__turbopack_context__.k.register(_c6, "KmInputModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_d8c69cec._.js.map