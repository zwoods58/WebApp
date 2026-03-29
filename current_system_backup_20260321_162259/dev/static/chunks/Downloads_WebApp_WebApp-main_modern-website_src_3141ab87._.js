(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/RefreshContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RefreshProvider",
    ()=>RefreshProvider,
    "useRefreshContext",
    ()=>useRefreshContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const RefreshContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useRefreshContext() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "a5c4382cb7bf64a587070f9f7e2456b914d180b6885745af42e9b54438b50a75") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a5c4382cb7bf64a587070f9f7e2456b914d180b6885745af42e9b54438b50a75";
    }
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(RefreshContext);
    if (!context) {
        throw new Error("useRefreshContext must be used within a RefreshProvider");
    }
    return context;
}
_s(useRefreshContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function RefreshProvider(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "a5c4382cb7bf64a587070f9f7e2456b914d180b6885745af42e9b54438b50a75") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a5c4382cb7bf64a587070f9f7e2456b914d180b6885745af42e9b54438b50a75";
    }
    const { children } = t0;
    const [refreshHandler, setRefreshHandler] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "RefreshProvider[registerRefreshHandler]": (handler)=>{
                setRefreshHandler({
                    "RefreshProvider[registerRefreshHandler > setRefreshHandler()]": ()=>handler
                }["RefreshProvider[registerRefreshHandler > setRefreshHandler()]"]);
            }
        })["RefreshProvider[registerRefreshHandler]"];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const registerRefreshHandler = t1;
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "RefreshProvider[unregisterRefreshHandler]": ()=>{
                setRefreshHandler(null);
            }
        })["RefreshProvider[unregisterRefreshHandler]"];
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const unregisterRefreshHandler = t2;
    let t3;
    if ($[3] !== refreshHandler) {
        t3 = ({
            "RefreshProvider[triggerRefresh]": async ()=>{
                if (refreshHandler) {
                    await refreshHandler();
                }
            }
        })["RefreshProvider[triggerRefresh]"];
        $[3] = refreshHandler;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const triggerRefresh = t3;
    let t4;
    if ($[5] !== triggerRefresh) {
        t4 = {
            registerRefreshHandler,
            unregisterRefreshHandler,
            triggerRefresh
        };
        $[5] = triggerRefresh;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== children || $[8] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RefreshContext.Provider, {
            value: t4,
            children: children
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/RefreshContext.tsx",
            lineNumber: 95,
            columnNumber: 10
        }, this);
        $[7] = children;
        $[8] = t4;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    return t5;
}
_s1(RefreshProvider, "0rxF97kSrL0wCN2u63ZLy0/CekI=");
_c = RefreshProvider;
var _c;
__turbopack_context__.k.register(_c, "RefreshProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/global/AppLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$RefreshContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/RefreshContext.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function AppLayout(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "5e3a158d75ed467ec67a15bc0f70f668839948745b1c3db2d1f3efaa14588f65") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5e3a158d75ed467ec67a15bc0f70f668839948745b1c3db2d1f3efaa14588f65";
    }
    const { children } = t0;
    let t1;
    if ($[1] !== children) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$RefreshContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RefreshProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/global/AppLayout.tsx",
            lineNumber: 22,
            columnNumber: 10
        }, this);
        $[1] = children;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    return t1;
}
_c = AppLayout;
var _c;
__turbopack_context__.k.register(_c, "AppLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useGlobalRefresh.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGlobalRefresh",
    ()=>useGlobalRefresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useGlobalRefresh() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "d4479e9a1b1742296dd6bb3fe61648e56bdaf26e84b8ae230411f68b37880340") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d4479e9a1b1742296dd6bb3fe61648e56bdaf26e84b8ae230411f68b37880340";
    }
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let t0;
    if ($[1] !== router) {
        t0 = ({
            "useGlobalRefresh[performGlobalRefresh]": async (t1)=>{
                const options = t1 === undefined ? {} : t1;
                const { clearCache: t2, refetchData: t3, showNotification: t4 } = options;
                const clearCache = t2 === undefined ? true : t2;
                const refetchData = t3 === undefined ? true : t3;
                const showNotification = t4 === undefined ? true : t4;
                ;
                try {
                    console.log("\uD83D\uDD04 Performing global refresh...");
                    if (clearCache) {
                        if ("caches" in window) {
                            ;
                            try {
                                const cacheNames = await caches.keys();
                                await Promise.all(cacheNames.map(_useGlobalRefreshPerformGlobalRefreshCacheNamesMap));
                                console.log("\u2705 Cache cleared");
                            } catch (t6) {
                                const error_0 = t6;
                                console.warn("\u26A0\uFE0F Failed to clear cache:", error_0);
                            }
                        }
                        const keysToClear = [
                            "cached_inventory",
                            "cached_sales",
                            "cached_customers"
                        ];
                        keysToClear.forEach(_useGlobalRefreshPerformGlobalRefreshKeysToClearForEach);
                    }
                    if (refetchData) {
                        router.refresh();
                        const refreshEvent = new CustomEvent("globalDataRefresh", {
                            detail: {
                                timestamp: Date.now(),
                                source: "pull-to-refresh"
                            }
                        });
                        window.dispatchEvent(refreshEvent);
                    }
                    if (showNotification) {
                        console.log("\uD83D\uDCF1 App refreshed successfully");
                    }
                    return {
                        success: true,
                        message: "Global refresh completed"
                    };
                } catch (t5) {
                    const error = t5;
                    console.error("\u274C Global refresh failed:", error);
                    if (showNotification) {
                        console.log("\u274C Failed to refresh app");
                    }
                    return {
                        success: false,
                        message: "Global refresh failed",
                        error
                    };
                }
            }
        })["useGlobalRefresh[performGlobalRefresh]"];
        $[1] = router;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    const performGlobalRefresh = t0;
    const performSoftRefresh = _useGlobalRefreshPerformSoftRefresh;
    const performHardRefresh = _useGlobalRefreshPerformHardRefresh;
    let t1;
    if ($[3] !== performGlobalRefresh) {
        t1 = {
            performGlobalRefresh,
            performSoftRefresh,
            performHardRefresh
        };
        $[3] = performGlobalRefresh;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    return t1;
}
_s(useGlobalRefresh, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
function _useGlobalRefreshPerformHardRefresh() {
    window.location.reload();
    console.log("\uD83D\uDD04 Hard refresh triggered");
}
function _useGlobalRefreshPerformSoftRefresh() {
    const refreshEvent_0 = new CustomEvent("softDataRefresh", {
        detail: {
            timestamp: Date.now()
        }
    });
    window.dispatchEvent(refreshEvent_0);
    console.log("\uD83D\uDD04 Soft refresh triggered");
}
function _useGlobalRefreshPerformGlobalRefreshKeysToClearForEach(key) {
    ;
    try {
        localStorage.removeItem(key);
    } catch (t0) {
        const error_1 = t0;
        console.warn(`Failed to clear ${key}:`, error_1);
    }
}
function _useGlobalRefreshPerformGlobalRefreshCacheNamesMap(cacheName) {
    return caches.delete(cacheName);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/components/ServiceWorkerRegistration.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ServiceWorkerRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ServiceWorkerRegistration() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "7a3e657525daf5a7d6b64c186e9168730985f3cae26fa50343b5f8e15ba2c1bb") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7a3e657525daf5a7d6b64c186e9168730985f3cae26fa50343b5f8e15ba2c1bb";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = [];
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(_ServiceWorkerRegistrationUseEffect, t0);
    return null;
}
_s(ServiceWorkerRegistration, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ServiceWorkerRegistration;
function _ServiceWorkerRegistrationUseEffect() {
    if ("serviceWorker" in navigator && ("TURBOPACK compile-time value", "object") !== "undefined") {
        navigator.serviceWorker.register("/sw.js").then(_ServiceWorkerRegistrationUseEffectAnonymous).catch(_ServiceWorkerRegistrationUseEffectAnonymous2);
        navigator.serviceWorker.addEventListener("message", _ServiceWorkerRegistrationUseEffectNavigatorServiceWorkerAddEventListener);
        const handleOnline = _ServiceWorkerRegistrationUseEffectHandleOnline;
        const handleOffline = _ServiceWorkerRegistrationUseEffectHandleOffline;
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return ()=>{
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }
}
function _ServiceWorkerRegistrationUseEffectHandleOffline() {
    console.log("\uD83D\uDCF5 Network connection lost");
    window.dispatchEvent(new CustomEvent("network-status-change", {
        detail: {
            isOnline: false
        }
    }));
}
function _ServiceWorkerRegistrationUseEffectHandleOnline() {
    console.log("\uD83C\uDF10 Network connection restored");
    window.dispatchEvent(new CustomEvent("network-status-change", {
        detail: {
            isOnline: true
        }
    }));
}
function _ServiceWorkerRegistrationUseEffectNavigatorServiceWorkerAddEventListener(event) {
    if (event.data && event.data.type === "SYNC_STATUS_UPDATE") {
        window.dispatchEvent(new CustomEvent("sync-status-update", {
            detail: event.data.payload
        }));
    }
}
function _ServiceWorkerRegistrationUseEffectAnonymous2(error) {
    console.log("\u2139\uFE0F Service Worker not registered (offline mode will still work):", error.message);
}
function _ServiceWorkerRegistrationUseEffectAnonymous(registration) {
    console.log("\u2705 Service Worker registered successfully:", registration.scope);
    registration.addEventListener("updatefound", {
        "ServiceWorkerRegistration[useEffect() > (anonymous)() > registration.addEventListener()]": ()=>{
            const newWorker = registration.installing;
            if (newWorker) {
                newWorker.addEventListener("statechange", {
                    "ServiceWorkerRegistration[useEffect() > (anonymous)() > registration.addEventListener() > newWorker.addEventListener()]": ()=>{
                        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                            console.log("\uD83D\uDD04 New service worker available, refresh to update");
                        }
                    }
                }["ServiceWorkerRegistration[useEffect() > (anonymous)() > registration.addEventListener() > newWorker.addEventListener()]"]);
            }
        }
    }["ServiceWorkerRegistration[useEffect() > (anonymous)() > registration.addEventListener()]"]);
}
var _c;
__turbopack_context__.k.register(_c, "ServiceWorkerRegistration");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/query-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "queryClient",
    ()=>queryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$persist$2d$client$2d$core$2f$build$2f$modern$2f$persist$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/query-persist-client-core/build/modern/persist.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$sync$2d$storage$2d$persister$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/query-sync-storage-persister/build/modern/index.js [app-client] (ecmascript)");
;
;
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            networkMode: 'offlineFirst',
            staleTime: 5 * 60 * 1000,
            gcTime: 7 * 24 * 60 * 60 * 1000,
            retry: 3
        },
        mutations: {
            networkMode: 'offlineFirst',
            retry: 3
        }
    }
});
// Persistence setup
if ("TURBOPACK compile-time truthy", 1) {
    const persister = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$sync$2d$storage$2d$persister$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSyncStoragePersister"])({
        storage: window.localStorage,
        key: 'BLACKBOOK_OFFLINE_CACHE'
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$persist$2d$client$2d$core$2f$build$2f$modern$2f$persist$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistQueryClient"])({
        queryClient,
        persister,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        dehydrateOptions: {
            shouldDehydrateQuery: (query)=>{
                return query.state.status === 'success' // Don't persist errors
                ;
            }
        }
    });
// Connection monitoring is now handled by connection-manager.ts
// This prevents duplicate event listeners and conflicts
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/providers/QueryProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/lib/query-client.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function QueryProvider(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(3);
    if ($[0] !== "6c3000406dd578d4b54df0e04082af1ffa0e8f419efb2c5367e1ebda19b9d102") {
        for(let $i = 0; $i < 3; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6c3000406dd578d4b54df0e04082af1ffa0e8f419efb2c5367e1ebda19b9d102";
    }
    const { children } = t0;
    let t1;
    if ($[1] !== children) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$lib$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryClient"],
            children: children
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/providers/QueryProvider.tsx",
            lineNumber: 23,
            columnNumber: 10
        }, this);
        $[1] = children;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    return t1;
}
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/components/BodyWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BodyWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$global$2f$AppLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/global/AppLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useGlobalRefresh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useGlobalRefresh.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$app$2f$components$2f$ServiceWorkerRegistration$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/components/ServiceWorkerRegistration.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$providers$2f$QueryProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/providers/QueryProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function BodyWrapper(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "a98127b5ddcf0785909bab6cda4c85cb949b689e17ff567bff445669ea7f75db") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a98127b5ddcf0785909bab6cda4c85cb949b689e17ff567bff445669ea7f75db";
    }
    const { children, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useGlobalRefresh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGlobalRefresh"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    let t2;
    let t3;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = ({
            "BodyWrapper[useEffect()]": ()=>{
                setIsClient(true);
            }
        })["BodyWrapper[useEffect()]"];
        t3 = [];
        $[1] = t2;
        $[2] = t3;
    } else {
        t2 = $[1];
        t3 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    pathname?.startsWith("/Beezee-App");
    let t4;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$app$2f$components$2f$ServiceWorkerRegistration$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/components/BodyWrapper.tsx",
            lineNumber: 49,
            columnNumber: 10
        }, this);
        $[3] = t4;
    } else {
        t4 = $[3];
    }
    const t5 = `${className} ${isClient ? "hydrated" : ""}`;
    let t6;
    if ($[4] !== children) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$global$2f$AppLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/components/BodyWrapper.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, this);
        $[4] = children;
        $[5] = t6;
    } else {
        t6 = $[5];
    }
    let t7;
    if ($[6] !== t5 || $[7] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$providers$2f$QueryProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                        className: t5,
                        suppressHydrationWarning: true,
                        children: t6
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/components/BodyWrapper.tsx",
                        lineNumber: 65,
                        columnNumber: 31
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/components/BodyWrapper.tsx",
                    lineNumber: 65,
                    columnNumber: 16
                }, this)
            ]
        }, void 0, true);
        $[6] = t5;
        $[7] = t6;
        $[8] = t7;
    } else {
        t7 = $[8];
    }
    return t7;
}
_s(BodyWrapper, "MUZJEuldk/gEvAtaC6f8ByIfaec=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useGlobalRefresh$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGlobalRefresh"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = BodyWrapper;
var _c;
__turbopack_context__.k.register(_c, "BodyWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_3141ab87._.js.map