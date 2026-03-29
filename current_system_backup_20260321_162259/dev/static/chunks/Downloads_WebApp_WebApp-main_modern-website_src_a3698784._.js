(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ProtectedRoute.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProtectedRoute",
    ()=>ProtectedRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ProtectedRoute(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(16);
    if ($[0] !== "b1e8e912daba6ed7efa4b7af2e8941bd4b38035d1692565a183c5a257dc16b61") {
        for(let $i = 0; $i < 16; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b1e8e912daba6ed7efa4b7af2e8941bd4b38035d1692565a183c5a257dc16b61";
    }
    const { children, requiredCountry, requiredIndustry } = t0;
    const { business, loading, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isStabilizing, setIsStabilizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    let t1;
    let t2;
    if ($[1] !== business || $[2] !== isAuthenticated || $[3] !== loading || $[4] !== requiredCountry || $[5] !== requiredIndustry || $[6] !== router) {
        t1 = ({
            "ProtectedRoute[useEffect()]": ()=>{
                console.log("\uD83D\uDEE1\uFE0F ProtectedRoute check:", {
                    loading,
                    isAuthenticated,
                    business: business ? {
                        id: business.id,
                        country: business.country,
                        industry: business.industry
                    } : null,
                    requiredCountry,
                    requiredIndustry,
                    pathname: ("TURBOPACK compile-time truthy", 1) ? window.location.pathname : "TURBOPACK unreachable"
                });
                if (loading) {
                    console.log("\u23F3 Still loading auth/business data, waiting...");
                    return;
                }
                if (!isAuthenticated || !business) {
                    console.log("\uD83D\uDEAA Not authenticated, redirecting to login");
                    router.push("/Beezee-App/auth/login");
                    return;
                }
                if (requiredCountry && business.country.toLowerCase() !== requiredCountry.toLowerCase()) {
                    console.log("\uD83C\uDF0D Country mismatch, redirecting to correct route");
                    router.push(`/Beezee-App/app/${business.country}/${business.industry}`);
                    return;
                }
                if (requiredIndustry && business.industry.toLowerCase() !== requiredIndustry.toLowerCase()) {
                    console.log("\uD83C\uDFED Industry mismatch, redirecting to correct route");
                    router.push(`/Beezee-App/app/${business.country}/${business.industry}`);
                    return;
                }
                console.log("\u2705 Authentication and route validation passed");
                setIsStabilizing(false);
            }
        })["ProtectedRoute[useEffect()]"];
        t2 = [
            business,
            loading,
            isAuthenticated,
            requiredCountry,
            requiredIndustry,
            router
        ];
        $[1] = business;
        $[2] = isAuthenticated;
        $[3] = loading;
        $[4] = requiredCountry;
        $[5] = requiredIndustry;
        $[6] = router;
        $[7] = t1;
        $[8] = t2;
    } else {
        t1 = $[7];
        t2 = $[8];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    if (loading || isStabilizing) {
        let t3;
        if ($[9] !== children) {
            t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "opacity-60 pointer-events-none",
                children: children
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ProtectedRoute.tsx",
                lineNumber: 89,
                columnNumber: 12
            }, this);
            $[9] = children;
            $[10] = t3;
        } else {
            t3 = $[10];
        }
        let t4;
        if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ProtectedRoute.tsx",
                            lineNumber: 97,
                            columnNumber: 184
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium text-gray-700",
                            children: "Loading..."
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ProtectedRoute.tsx",
                            lineNumber: 97,
                            columnNumber: 283
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ProtectedRoute.tsx",
                    lineNumber: 97,
                    columnNumber: 108
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ProtectedRoute.tsx",
                lineNumber: 97,
                columnNumber: 12
            }, this);
            $[11] = t4;
        } else {
            t4 = $[11];
        }
        let t5;
        if ($[12] !== t3) {
            t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative min-h-screen",
                children: [
                    t3,
                    t4
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ProtectedRoute.tsx",
                lineNumber: 104,
                columnNumber: 12
            }, this);
            $[12] = t3;
            $[13] = t5;
        } else {
            t5 = $[13];
        }
        return t5;
    }
    if (!isAuthenticated || !business) {
        return null;
    }
    if (requiredCountry && business.country.toLowerCase() !== requiredCountry.toLowerCase() || requiredIndustry && business.industry.toLowerCase() !== requiredIndustry.toLowerCase()) {
        return null;
    }
    let t3;
    if ($[14] !== children) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
        $[14] = children;
        $[15] = t3;
    } else {
        t3 = $[15];
    }
    return t3;
}
_s(ProtectedRoute, "3I+4hW33SmUpWsxTJytNOgpyTQw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProtectedRoute;
var _c;
__turbopack_context__.k.register(_c, "ProtectedRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CountryIndustryLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$ProtectedRoute$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/ProtectedRoute.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
;
;
function CountryIndustryLayout(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "23e5dc8069cb6a539b6634a8ed254e90c0396298fa467f94d6268c17e6363cc6") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "23e5dc8069cb6a539b6634a8ed254e90c0396298fa467f94d6268c17e6363cc6";
    }
    const { children, params } = t0;
    const { country, industry } = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].use(params);
    let t1;
    if ($[1] !== children || $[2] !== country || $[3] !== industry) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$ProtectedRoute$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProtectedRoute"], {
            requiredCountry: country,
            requiredIndustry: industry,
            children: children
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/app/[country]/[industry]/layout.tsx",
            lineNumber: 24,
            columnNumber: 10
        }, this);
        $[1] = children;
        $[2] = country;
        $[3] = industry;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    return t1;
}
_c = CountryIndustryLayout;
var _c;
__turbopack_context__.k.register(_c, "CountryIndustryLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_a3698784._.js.map