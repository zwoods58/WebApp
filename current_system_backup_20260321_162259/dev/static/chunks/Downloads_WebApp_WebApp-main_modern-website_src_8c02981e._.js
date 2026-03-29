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
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflineErrorBoundary",
    ()=>OfflineErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-client] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
"use client";
;
;
;
class OfflineErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
    maxRetries = 3;
    retryTimeouts = [];
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            isOffline: !navigator.onLine,
            isRetrying: false,
            retryCount: 0,
            serviceWorkerStatus: 'supported',
            environment: this.getEnvironmentInfo()
        };
    }
    componentDidMount() {
        // Listen for online/offline events
        window.addEventListener('online', this.handleConnectionChange);
        window.addEventListener('offline', this.handleConnectionChange);
        // Listen for custom network events
        window.addEventListener('network-status-change', this.handleCustomNetworkChange);
        window.addEventListener('connection-status-check', this.handleConnectionCheck);
        // Check service worker availability
        this.checkServiceWorkerAvailability();
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            isOffline: !navigator.onLine
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('🚨 OfflineErrorBoundary caught an error:', error);
        console.error('Error Info:', errorInfo);
        // Check if error is network-related
        const isNetworkError = this.isNetworkError(error);
        this.setState({
            error,
            errorInfo,
            isOffline: isNetworkError || !navigator.onLine
        });
    }
    componentWillUnmount() {
        window.removeEventListener('online', this.handleConnectionChange);
        window.removeEventListener('offline', this.handleConnectionChange);
        window.removeEventListener('network-status-change', this.handleCustomNetworkChange);
        window.removeEventListener('connection-status-check', this.handleConnectionCheck);
        // Clear any pending timeouts
        this.retryTimeouts.forEach((timeout)=>clearTimeout(timeout));
    }
    // Get environment information
    getEnvironmentInfo = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        const isNetworkIP = /^192\.168\./.test(hostname) || /^10\./.test(hostname);
        const isProduction = !isLocalhost && !isNetworkIP;
        const isHTTPS = window.location.protocol === 'https:';
        return {
            isLocalhost,
            isNetworkIP,
            isProduction,
            isHTTPS
        };
    };
    // Check service worker availability and status
    checkServiceWorkerAvailability = async ()=>{
        if (!('serviceWorker' in navigator)) {
            this.setState({
                serviceWorkerStatus: 'not-supported'
            });
            return;
        }
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration && registration.active) {
                this.setState({
                    serviceWorkerStatus: 'active'
                });
            } else {
                this.setState({
                    serviceWorkerStatus: 'inactive'
                });
            }
        } catch (error) {
            console.warn('Service worker check failed:', error);
            this.setState({
                serviceWorkerStatus: 'error'
            });
        }
    };
    // Enhanced network error detection
    isNetworkError = (error)=>{
        const networkErrorMessages = [
            'Failed to fetch',
            'NetworkError',
            'network error',
            'fetch failed',
            'connection',
            'offline',
            'timeout',
            'ECONNREFUSED',
            'ENOTFOUND',
            'ERR_INTERNET_DISCONNECTED',
            'ERR_NAME_NOT_RESOLVED',
            'ERR_CONNECTION_REFUSED',
            'ERR_NETWORK_CHANGED',
            'ERR_SOCKET_TIMEOUT'
        ];
        return networkErrorMessages.some((msg)=>error.message.toLowerCase().includes(msg.toLowerCase()));
    };
    handleConnectionChange = ()=>{
        const isOffline = !navigator.onLine;
        this.setState({
            isOffline
        });
        // If we come back online and had an error, try to recover
        if (!isOffline && this.state.hasError) {
            console.log('🌐 Connection restored, attempting recovery...');
            this.handleRetry();
        }
        // Re-check service worker when connection changes
        this.checkServiceWorkerAvailability();
    };
    handleCustomNetworkChange = (event)=>{
        const customEvent = event;
        const isOffline = !customEvent.detail.isOnline;
        this.setState({
            isOffline
        });
        if (!isOffline && this.state.hasError) {
            console.log('🌐 Custom network event: connection restored');
            this.handleRetry();
        }
    };
    handleConnectionCheck = (event)=>{
        const customEvent = event;
        const isOffline = !customEvent.detail.isOnline;
        this.setState({
            isOffline
        });
    };
    handleRetry = ()=>{
        console.log('🔄 Retrying after error...');
        this.setState((prevState)=>{
            const newRetryCount = prevState.retryCount + 1;
            if (newRetryCount <= this.maxRetries) {
                return {
                    hasError: false,
                    error: null,
                    errorInfo: null,
                    isOffline: prevState.isOffline,
                    isRetrying: false,
                    retryCount: newRetryCount,
                    serviceWorkerStatus: prevState.serviceWorkerStatus,
                    environment: prevState.environment
                };
            } else {
                console.log('❌ Max retries reached, showing offline screen');
                return {
                    ...prevState,
                    retryCount: 0
                };
            }
        });
    };
    handleGoHome = ()=>{
        // Navigate to home page without full page reload
        if ("TURBOPACK compile-time truthy", 1) {
            window.location.hash = '#/';
            this.handleRetry();
        }
    };
    renderOfflineScreen = ()=>{
        if (this.props.fallback) {
            return this.props.fallback;
        }
        const { environment, serviceWorkerStatus } = this.state;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-3xl border border-gray-200 shadow-lg p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                                className: "w-10 h-10 text-gray-600"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                lineNumber: 228,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 227,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-gray-900 mb-3",
                            children: "You're Offline"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 232,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 mb-6",
                            children: "It looks like you've lost your internet connection. Some features may not work properly until you're back online."
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 237,
                            columnNumber: 25
                        }, this),
                        (environment.isNetworkIP || environment.isProduction) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                                            className: "w-4 h-4 text-blue-600"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                            lineNumber: 245,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium text-blue-800",
                                            children: "Network Access"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                            lineNumber: 246,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                    lineNumber: 244,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-blue-700",
                                    children: environment.isNetworkIP ? "Local network access detected. Service worker functionality may be limited." : environment.isProduction && !environment.isHTTPS ? "Production requires HTTPS for full offline functionality." : "Production environment with HTTPS enabled."
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                    lineNumber: 248,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 243,
                            columnNumber: 29
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 rounded-xl p-4 mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-2 h-2 rounded-full ${serviceWorkerStatus === 'active' ? 'bg-green-500' : serviceWorkerStatus === 'inactive' ? 'bg-yellow-500' : serviceWorkerStatus === 'error' ? 'bg-red-500' : serviceWorkerStatus === 'not-supported' ? 'bg-gray-500' : 'bg-blue-500'}`
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                        lineNumber: 262,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-600",
                                        children: [
                                            "Service Worker: ",
                                            serviceWorkerStatus
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                        lineNumber: 269,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                lineNumber: 261,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 260,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 rounded-xl p-4 mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-2 h-2 rounded-full ${this.state.isOffline ? 'bg-red-500' : 'bg-green-500'}`
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                        lineNumber: 278,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-600",
                                        children: this.state.isOffline ? 'Disconnected' : 'Connected'
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                        lineNumber: 279,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                lineNumber: 277,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 276,
                            columnNumber: 25
                        }, this),
                        this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-red-50 border border-red-200 rounded-xl p-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "w-4 h-4 text-red-600"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                            lineNumber: 289,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium text-red-800",
                                            children: "Error Details"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                            lineNumber: 290,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                    lineNumber: 288,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-red-700 break-all",
                                    children: this.state.error.message
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                    lineNumber: 292,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 287,
                            columnNumber: 29
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleRetry,
                                    disabled: this.state.retryCount >= this.maxRetries,
                                    className: "w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                            lineNumber: 305,
                                            columnNumber: 33
                                        }, this),
                                        this.state.retryCount >= this.maxRetries ? 'Max Retries Reached' : 'Try Again'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                    lineNumber: 300,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleGoHome,
                                    className: "w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                            lineNumber: 313,
                                            columnNumber: 33
                                        }, this),
                                        "Go to Home"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                                    lineNumber: 309,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 299,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500 text-center mt-6",
                            children: "Try checking your internet connection or refresh the page when you're back online."
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                            lineNumber: 319,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                    lineNumber: 225,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
                lineNumber: 224,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx",
            lineNumber: 223,
            columnNumber: 13
        }, this);
    };
    render() {
        if (this.state.hasError || this.state.isOffline) {
            return this.renderOfflineScreen();
        }
        return this.props.children;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConnectionStatus",
    ()=>ConnectionStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-client] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// src/components/ConnectionStatus.tsx
'use client';
;
;
;
;
;
;
function ConnectionStatus() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(28);
    if ($[0] !== "13aa7846cceefdf85bb7f63716d41f2d36aeb5c009358129de62bbe188822065") {
        for(let $i = 0; $i < 28; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "13aa7846cceefdf85bb7f63716d41f2d36aeb5c009358129de62bbe188822065";
    }
    const [isOnline, setIsOnline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [pendingCount, setPendingCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showOfflinePopup, setShowOfflinePopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showOnlinePopup, setShowOnlinePopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    let t0;
    let t1;
    if ($[1] !== isOnline || $[2] !== queryClient) {
        t0 = ({
            "ConnectionStatus[useEffect()]": ()=>{
                setIsOnline(navigator.onLine);
                const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].subscribe({
                    "ConnectionStatus[useEffect() > onlineManager.subscribe()]": ()=>{
                        const wasOnline = isOnline;
                        const nowOnline = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].isOnline();
                        setIsOnline(nowOnline);
                        if (wasOnline && !nowOnline) {
                            setShowOfflinePopup(true);
                            setShowOnlinePopup(false);
                            setTimeout({
                                "ConnectionStatus[useEffect() > onlineManager.subscribe() > setTimeout()]": ()=>setShowOfflinePopup(false)
                            }["ConnectionStatus[useEffect() > onlineManager.subscribe() > setTimeout()]"], 3000);
                        } else {
                            if (!wasOnline && nowOnline) {
                                setShowOnlinePopup(true);
                                setShowOfflinePopup(false);
                                setTimeout({
                                    "ConnectionStatus[useEffect() > onlineManager.subscribe() > setTimeout()]": ()=>setShowOnlinePopup(false)
                                }["ConnectionStatus[useEffect() > onlineManager.subscribe() > setTimeout()]"], 3000);
                            }
                        }
                    }
                }["ConnectionStatus[useEffect() > onlineManager.subscribe()]"]);
                const updatePendingCount = {
                    "ConnectionStatus[useEffect() > updatePendingCount]": ()=>{
                        const mutations = queryClient.getMutationCache().getAll();
                        const paused = mutations.filter(_ConnectionStatusUseEffectUpdatePendingCountMutationsFilter).length;
                        setPendingCount(paused);
                    }
                }["ConnectionStatus[useEffect() > updatePendingCount]"];
                updatePendingCount();
                const unsubscribeMutations = queryClient.getMutationCache().subscribe(updatePendingCount);
                const handleOnline = {
                    "ConnectionStatus[useEffect() > handleOnline]": ()=>{
                        console.log("\uD83C\uDF10 Browser reports online");
                        setIsOnline(true);
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].setOnline(true);
                    }
                }["ConnectionStatus[useEffect() > handleOnline]"];
                const handleOffline = {
                    "ConnectionStatus[useEffect() > handleOffline]": ()=>{
                        console.log("\uD83D\uDCF4 Browser reports offline");
                        setIsOnline(false);
                        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].setOnline(false);
                    }
                }["ConnectionStatus[useEffect() > handleOffline]"];
                window.addEventListener("online", handleOnline);
                window.addEventListener("offline", handleOffline);
                return ()=>{
                    unsubscribe();
                    unsubscribeMutations();
                    window.removeEventListener("online", handleOnline);
                    window.removeEventListener("offline", handleOffline);
                };
            }
        })["ConnectionStatus[useEffect()]"];
        t1 = [
            queryClient,
            isOnline
        ];
        $[1] = isOnline;
        $[2] = queryClient;
        $[3] = t0;
        $[4] = t1;
    } else {
        t0 = $[3];
        t1 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    let t2;
    if ($[5] !== showOfflinePopup) {
        t2 = showOfflinePopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: -100
            },
            animate: {
                opacity: 1,
                y: 0
            },
            exit: {
                opacity: 0,
                y: -100
            },
            className: "fixed top-20 left-0 right-0 z-[70] flex justify-center pointer-events-none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    scale: 0.8,
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
                transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                },
                className: "bg-red-500 text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            rotate: [
                                0,
                                10,
                                -10,
                                0
                            ]
                        },
                        transition: {
                            duration: 2,
                            repeat: Infinity
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                            size: 24
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                            lineNumber: 123,
                            columnNumber: 12
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 118,
                        columnNumber: 121
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xl font-bold mb-1",
                                children: "Offline Mode"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                                lineNumber: 123,
                                columnNumber: 75
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm opacity-90",
                                children: "Changes will sync when connected"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                                lineNumber: 123,
                                columnNumber: 133
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 123,
                        columnNumber: 46
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            scale: [
                                1,
                                1.2,
                                1
                            ]
                        },
                        transition: {
                            duration: 1,
                            repeat: Infinity
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                            size: 20,
                            className: "animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                            lineNumber: 128,
                            columnNumber: 12
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 123,
                        columnNumber: 213
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                lineNumber: 105,
                columnNumber: 95
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 96,
            columnNumber: 30
        }, this);
        $[5] = showOfflinePopup;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t2
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 136,
            columnNumber: 10
        }, this);
        $[7] = t2;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] !== showOnlinePopup) {
        t4 = showOnlinePopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: -100
            },
            animate: {
                opacity: 1,
                y: 0
            },
            exit: {
                opacity: 0,
                y: -100
            },
            className: "fixed top-20 left-0 right-0 z-[70] flex justify-center pointer-events-none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    scale: 0.8,
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
                transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                },
                className: "bg-green-500 text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 pointer-events-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            rotate: [
                                0,
                                15,
                                -15,
                                0
                            ]
                        },
                        transition: {
                            duration: 1.5,
                            repeat: Infinity
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                            size: 24
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                            lineNumber: 171,
                            columnNumber: 12
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 166,
                        columnNumber: 123
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xl font-bold mb-1",
                                children: "Connection Restored"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                                lineNumber: 171,
                                columnNumber: 72
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm opacity-90",
                                children: "You're back online"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                                lineNumber: 171,
                                columnNumber: 137
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 171,
                        columnNumber: 43
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: {
                            scale: [
                                1,
                                1.3,
                                1
                            ]
                        },
                        transition: {
                            duration: 0.8,
                            repeat: 2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-6 h-6 bg-white/30 rounded-full flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-3 h-3 bg-white rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                                lineNumber: 176,
                                columnNumber: 95
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                            lineNumber: 176,
                            columnNumber: 12
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 171,
                        columnNumber: 203
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                lineNumber: 153,
                columnNumber: 95
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 144,
            columnNumber: 29
        }, this);
        $[9] = showOnlinePopup;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    let t5;
    if ($[11] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t4
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 184,
            columnNumber: 10
        }, this);
        $[11] = t4;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== isOnline) {
        t6 = !isOnline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                scale: 0.8
            },
            animate: {
                opacity: 1,
                scale: 1
            },
            exit: {
                opacity: 0,
                scale: 0.8
            },
            className: "pointer-events-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                        size: 12,
                        className: "text-red-600"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 201,
                        columnNumber: 174
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium text-red-700",
                        children: "Offline"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 201,
                        columnNumber: 220
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                lineNumber: 201,
                columnNumber: 40
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 192,
            columnNumber: 23
        }, this);
        $[13] = isOnline;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    let t7;
    if ($[15] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t6
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 209,
            columnNumber: 10
        }, this);
        $[15] = t6;
        $[16] = t7;
    } else {
        t7 = $[16];
    }
    let t8;
    if ($[17] !== pendingCount) {
        t8 = pendingCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                scale: 0.8
            },
            animate: {
                opacity: 1,
                scale: 1
            },
            exit: {
                opacity: 0,
                scale: 0.8
            },
            className: "pointer-events-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 12,
                        className: "text-amber-600 animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 226,
                        columnNumber: 178
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium text-amber-700",
                        children: pendingCount
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                        lineNumber: 226,
                        columnNumber: 244
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                lineNumber: 226,
                columnNumber: 40
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 217,
            columnNumber: 30
        }, this);
        $[17] = pendingCount;
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    let t9;
    if ($[19] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t8
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 234,
            columnNumber: 10
        }, this);
        $[19] = t8;
        $[20] = t9;
    } else {
        t9 = $[20];
    }
    let t10;
    if ($[21] !== t7 || $[22] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed top-4 right-4 z-[60] pointer-events-none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 items-center",
                children: [
                    t7,
                    t9
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
                lineNumber: 242,
                columnNumber: 75
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx",
            lineNumber: 242,
            columnNumber: 11
        }, this);
        $[21] = t7;
        $[22] = t9;
        $[23] = t10;
    } else {
        t10 = $[23];
    }
    let t11;
    if ($[24] !== t10 || $[25] !== t3 || $[26] !== t5) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t3,
                t5,
                t10
            ]
        }, void 0, true);
        $[24] = t10;
        $[25] = t3;
        $[26] = t5;
        $[27] = t11;
    } else {
        t11 = $[27];
    }
    return t11;
}
_s(ConnectionStatus, "EECq6IllSqTT9MHSwlLPj1/m+5c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
_c = ConnectionStatus;
function _ConnectionStatusUseEffectUpdatePendingCountMutationsFilter(m) {
    return m.state.isPaused;
}
var _c;
__turbopack_context__.k.register(_c, "ConnectionStatus");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$OfflineErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/OfflineErrorBoundary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$ConnectionStatus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ConnectionStatus.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function AppLayout(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "c5927167c02eefee1fa3fb16fbcb554478b623226293aa030c210512390741c0") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c5927167c02eefee1fa3fb16fbcb554478b623226293aa030c210512390741c0";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$ConnectionStatus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConnectionStatus"], {}, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/global/AppLayout.tsx",
            lineNumber: 24,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== children) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$OfflineErrorBoundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfflineErrorBoundary"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$RefreshContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RefreshProvider"], {
                children: [
                    t1,
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/global/AppLayout.tsx",
                lineNumber: 31,
                columnNumber: 32
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/global/AppLayout.tsx",
            lineNumber: 31,
            columnNumber: 10
        }, this);
        $[2] = children;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    return t2;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function ServiceWorkerRegistration() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServiceWorkerRegistration.useEffect": ()=>{
            // Register service worker with enhanced network and production support
            if ('serviceWorker' in navigator && ("TURBOPACK compile-time value", "object") !== 'undefined') {
                const registerServiceWorker = {
                    "ServiceWorkerRegistration.useEffect.registerServiceWorker": async ()=>{
                        try {
                            console.log('🔧 [SW] Attempting service worker registration...');
                            // Detect current environment - enhanced for HTTPS/ngrok support
                            const isLocalhost_0 = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                            const isNetworkIP_0 = /^192\.168\./.test(window.location.hostname) || /^10\./.test(window.location.hostname);
                            const isNgrok_0 = window.location.hostname.includes('.ngrok') || window.location.hostname.includes('.ngrok-free.dev');
                            const isHTTPS_0 = window.location.protocol === 'https:';
                            const isProduction_0 = !isLocalhost_0 && !isNetworkIP_0 && !isNgrok_0;
                            console.log('🌐 [SW] Environment detected:', {
                                isLocalhost: isLocalhost_0,
                                isNetworkIP: isNetworkIP_0,
                                isNgrok: isNgrok_0,
                                isProduction: isProduction_0,
                                isHTTPS: isHTTPS_0,
                                hostname: window.location.hostname,
                                protocol: window.location.protocol
                            });
                            // Enhanced scope detection for different environments
                            let scope = '/';
                            let swPath = '/sw.js';
                            // For ngrok, network IPs, and production domains, use Beezee-App subpath
                            if (isNgrok_0 || isNetworkIP_0 || isProduction_0) {
                                // For production domains, use Beezee-App subpath
                                scope = '/Beezee-App/';
                                swPath = '/Beezee-App/sw.js';
                                console.log('🔧 [SW] Using Beezee-App subpath for ngrok/network/production:', {
                                    scope,
                                    swPath
                                });
                            }
                            console.log('🔧 [SW] Registration config:', {
                                scope,
                                swPath,
                                environment: {
                                    isLocalhost: isLocalhost_0,
                                    isNetworkIP: isNetworkIP_0,
                                    isNgrok: isNgrok_0,
                                    isProduction: isProduction_0,
                                    isHTTPS: isHTTPS_0
                                }
                            });
                            // Register service worker with enhanced configuration
                            const registration = await navigator.serviceWorker.register(swPath, {
                                scope: scope,
                                type: 'classic'
                            });
                            console.log('✅ [SW] Service Worker registered successfully:', registration.scope);
                            console.log('📱 [SW] Active worker:', registration.active?.state);
                            console.log('🔄 [SW] Installing worker:', registration.installing?.state);
                            // Check for service worker updates
                            registration.addEventListener('updatefound', {
                                "ServiceWorkerRegistration.useEffect.registerServiceWorker": ()=>{
                                    const newWorker = registration.installing;
                                    if (newWorker) {
                                        console.log('🔄 [SW] New service worker found, installing...');
                                        newWorker.addEventListener('statechange', {
                                            "ServiceWorkerRegistration.useEffect.registerServiceWorker": ()=>{
                                                console.log('📊 [SW] Worker state changed to:', newWorker.state);
                                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                                    // New service worker is available, show update notification
                                                    console.log('🆕 [SW] New service worker available, refresh to update');
                                                    // Notify user about update
                                                    if (window.confirm('A new version of BeeZee is available. Would you like to update?')) {
                                                        newWorker.postMessage({
                                                            type: 'SKIP_WAITING'
                                                        });
                                                        window.location.reload();
                                                    }
                                                }
                                            }
                                        }["ServiceWorkerRegistration.useEffect.registerServiceWorker"]);
                                    }
                                }
                            }["ServiceWorkerRegistration.useEffect.registerServiceWorker"]);
                            // Handle initial service worker state
                            if (registration.active) {
                                console.log('✅ [SW] Service Worker already active:', registration.active.state);
                            } else if (registration.installing) {
                                console.log('🔧 [SW] Service Worker installing...');
                            } else {
                                console.log('⏳ [SW] Service Worker waiting to install...');
                            }
                            return registration;
                        } catch (error) {
                            // Enhanced error handling for different environments
                            console.error('❌ [SW] Service Worker registration failed:', error);
                            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                            const isHTTPS = window.location.protocol === 'https:';
                            const isNetworkIP = /^192\.168\./.test(window.location.hostname) || /^10\./.test(window.location.hostname);
                            const isNgrok = window.location.hostname.includes('.ngrok') || window.location.hostname.includes('.ngrok-free.dev');
                            const isProduction = !isLocalhost && !isNetworkIP && !isNgrok;
                            // Try alternative registration paths for network/production environments
                            if (!isLocalhost && (isNetworkIP || isProduction)) {
                                console.log('� [SW] Trying alternative service worker registration...');
                                try {
                                    // Try registering from the Beezee-App subpath
                                    const altRegistration = await navigator.serviceWorker.register('/Beezee-App/sw.js', {
                                        scope: '/Beezee-App/'
                                    });
                                    console.log('✅ [SW] Alternative registration successful:', altRegistration.scope);
                                    return altRegistration;
                                } catch (altError) {
                                    console.log('❌ [SW] Alternative registration also failed:', altError);
                                }
                            }
                            if (isNgrok) {
                                console.log('🌐 [SW] Ngrok environment detected - service worker should work with HTTPS');
                                console.log('💡 [SW] Ngrok provides HTTPS which is required for service workers');
                            } else if (isNetworkIP) {
                                console.log('📡 [SW] Network IP detected - service worker functionality limited');
                                console.log('💡 [SW] For development: Use HTTPS or localhost for full offline functionality');
                                console.log('🔧 [SW] Production: Ensure HTTPS is properly configured');
                            } else if (isProduction && !isHTTPS) {
                                console.log('🔒 [SW] HTTPS required for service worker in production');
                                console.log('💡 [SW] Service worker will not work without HTTPS');
                            } else if (isProduction && isHTTPS) {
                                console.log('🔍 [SW] Production HTTPS detected - checking service worker compatibility');
                                console.log('💡 [SW] May need to check Content-Security-Policy headers');
                            } else {
                                console.log('ℹ️ [SW] Service Worker registration failed - offline mode will use client-side fallbacks');
                            }
                            // Initialize client-side offline fallbacks
                            initializeClientSideOffline();
                            // Don't throw the error, app should still work with fallbacks
                            return null;
                        }
                    }
                }["ServiceWorkerRegistration.useEffect.registerServiceWorker"];
                // Initialize client-side offline fallbacks
                const initializeClientSideOffline = {
                    "ServiceWorkerRegistration.useEffect.initializeClientSideOffline": ()=>{
                        console.log('🔧 [SW] Initializing client-side offline fallbacks...');
                        // Create a simple offline state manager
                        if (!window.beezeeOfflineManager) {
                            window.beezeeOfflineManager = {
                                isOffline: !navigator.onLine,
                                offlineQueue: [],
                                addToQueue (action) {
                                    this.offlineQueue.push({
                                        ...action,
                                        timestamp: Date.now()
                                    });
                                    console.log('📝 [Offline] Action queued:', action.type);
                                },
                                processQueue () {
                                    if (this.offlineQueue.length > 0 && navigator.onLine) {
                                        console.log('🔄 [Offline] Processing queue:', this.offlineQueue.length, 'actions');
                                    // Queue processing would be handled by the app
                                    }
                                }
                            };
                        }
                    }
                }["ServiceWorkerRegistration.useEffect.initializeClientSideOffline"];
                // Register the service worker
                registerServiceWorker();
                // Handle service worker messages
                navigator.serviceWorker.addEventListener('message', {
                    "ServiceWorkerRegistration.useEffect": (event)=>{
                        console.log('📨 [SW] Message from service worker:', event.data);
                        if (event.data && event.data.type === 'SYNC_STATUS_UPDATE') {
                            // Dispatch custom event for components to listen to
                            window.dispatchEvent(new CustomEvent('sync-status-update', {
                                detail: event.data.payload
                            }));
                        } else if (event.data && event.data.type === 'SYNC_COMPLETE') {
                            // Handle sync completion
                            console.log('🔄 [SW] Sync completed:', event.data);
                            window.dispatchEvent(new CustomEvent('sync-complete', {
                                detail: event.data
                            }));
                        }
                    }
                }["ServiceWorkerRegistration.useEffect"]);
                // Handle offline/online events with enhanced detection
                const handleOnline = {
                    "ServiceWorkerRegistration.useEffect.handleOnline": ()=>{
                        console.log('🌐 [SW] Network connection restored');
                        window.dispatchEvent(new CustomEvent('network-status-change', {
                            detail: {
                                isOnline: true,
                                timestamp: Date.now()
                            }
                        }));
                        // Trigger service worker to check for queued actions
                        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({
                                type: 'CHECK_SYNC_QUEUE'
                            });
                        }
                    }
                }["ServiceWorkerRegistration.useEffect.handleOnline"];
                const handleOffline = {
                    "ServiceWorkerRegistration.useEffect.handleOffline": ()=>{
                        console.log('📵 [SW] Network connection lost');
                        window.dispatchEvent(new CustomEvent('network-status-change', {
                            detail: {
                                isOnline: false,
                                timestamp: Date.now()
                            }
                        }));
                    }
                }["ServiceWorkerRegistration.useEffect.handleOffline"];
                // Add event listeners
                window.addEventListener('online', handleOnline);
                window.addEventListener('offline', handleOffline);
                // Periodic connection check (every 30 seconds)
                const connectionCheckInterval = setInterval({
                    "ServiceWorkerRegistration.useEffect.connectionCheckInterval": ()=>{
                        const isOnline = navigator.onLine;
                        const currentStatus = isOnline ? 'online' : 'offline';
                        console.log(`🔍 [SW] Periodic connection check: ${currentStatus}`);
                        // Notify components about connection status
                        window.dispatchEvent(new CustomEvent('connection-status-check', {
                            detail: {
                                isOnline,
                                timestamp: Date.now()
                            }
                        }));
                    }
                }["ServiceWorkerRegistration.useEffect.connectionCheckInterval"], 30000);
                // Cleanup event listeners
                return ({
                    "ServiceWorkerRegistration.useEffect": ()=>{
                        window.removeEventListener('online', handleOnline);
                        window.removeEventListener('offline', handleOffline);
                        clearInterval(connectionCheckInterval);
                    }
                })["ServiceWorkerRegistration.useEffect"];
            } else {
                console.log('❌ [SW] Service Worker not supported in this browser');
                console.log('ℹ️ [SW] Offline functionality will work with client-side fallbacks');
            }
        }
    }["ServiceWorkerRegistration.useEffect"], []);
    return null; // This component doesn't render anything
}
_s(ServiceWorkerRegistration, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ServiceWorkerRegistration;
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

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_8c02981e._.js.map