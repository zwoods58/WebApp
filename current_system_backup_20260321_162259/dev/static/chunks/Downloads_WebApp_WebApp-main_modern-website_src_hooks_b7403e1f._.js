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
]);

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_hooks_b7403e1f._.js.map