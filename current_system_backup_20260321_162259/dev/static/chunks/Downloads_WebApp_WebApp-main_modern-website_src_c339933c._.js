(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/smart-translation.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>smartTranslate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/translations-new.js [app-client] (ecmascript)");
;
function smartTranslate(key, language = 'en', industry, defaultText, vars) {
    try {
        // Split the key into parts (e.g., 'tailor.orders.title' -> ['tailor', 'orders', 'title'])
        const keyParts = key.split('.');
        // Try to find the translation in the translations object
        let translation = null;
        // FIRST: Try universal section for ANY key (most efficient and future-proof)
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].universal && __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].universal[key]) {
            translation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].universal[key];
            // Apply language selection
            if (translation && typeof translation === 'object' && !Array.isArray(translation)) {
                if (language in translation) {
                    let translatedText = translation[language];
                    // Handle variable interpolation
                    if (vars && typeof translatedText === 'string') {
                        for (const [varKey, varValue] of Object.entries(vars)){
                            translatedText = translatedText.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue));
                        }
                    }
                    return translatedText;
                }
                // Fallback to English if target language not available
                if ('en' in translation) {
                    let translatedText = translation.en;
                    // Handle variable interpolation
                    if (vars && typeof translatedText === 'string') {
                        for (const [varKey, varValue] of Object.entries(vars)){
                            translatedText = translatedText.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue));
                        }
                    }
                    return translatedText;
                }
            }
        }
        // SECOND: Try main translations object for prefixed keys (backward compatibility)
        if (!translation && keyParts.length >= 2) {
            const universalPrefixes = [
                'nav.',
                'common.',
                'greeting.',
                'home.',
                'target.',
                'share.',
                'country.',
                'staff_performance.',
                'business.',
                'alert.'
            ];
            if (universalPrefixes.some((prefix)=>key.startsWith(prefix))) {
                if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][key]) {
                    translation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][key];
                    // Apply language selection
                    if (translation && typeof translation === 'object' && !Array.isArray(translation)) {
                        if (language in translation) {
                            let translatedText = translation[language];
                            // Handle variable interpolation
                            if (vars && typeof translatedText === 'string') {
                                for (const [varKey, varValue] of Object.entries(vars)){
                                    translatedText = translatedText.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue));
                                }
                            }
                            return translatedText;
                        }
                        // Fallback to English if target language not available
                        if ('en' in translation) {
                            let translatedText = translation.en;
                            // Handle variable interpolation
                            if (vars && typeof translatedText === 'string') {
                                for (const [varKey, varValue] of Object.entries(vars)){
                                    translatedText = translatedText.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue));
                                }
                            }
                            return translatedText;
                        }
                    }
                }
            }
        }
        // Also try universal section for modal and form keys that don't have prefixes
        const modalAndFormKeys = [
            'addItemModalTitle',
            'itemName',
            'enterItemName',
            'category',
            'selectCategory',
            'costPrice',
            'sellingPrice',
            'quantity',
            'lowStockAlert',
            'alertWhenBelow',
            'units',
            'cancel',
            'save',
            'add',
            'edit',
            'delete',
            'search',
            'searchItems',
            'noItemsYet',
            'inventoryEmptyDescription',
            'addItemButton',
            'stock',
            'stockSubtitle',
            'totalProducts',
            'runningLowLabel',
            'quickActions',
            'addItem',
            'stockTake',
            'inventory',
            'sell',
            'sellSubtitle',
            'retailMode',
            'quickItems',
            'allProducts',
            'available',
            'inStock',
            'currentSale',
            'total',
            'clearSale',
            'paymentMethod',
            'customerName',
            'searchCustomers',
            'dueDate',
            'amountPaid',
            'balanceDue',
            'completeSale',
            'paid',
            'credit',
            'partial',
            'today',
            'tomorrow',
            'thisWeek',
            'nextWeek',
            'each',
            'noResults',
            'tryDifferentSearch',
            'noItemsAdded',
            'addFirstItemToStart',
            'trackItems',
            'viewMore',
            'fullCashPaymentConfirmed',
            'dailyTarget',
            'moneyIn',
            'moneyOut',
            'startingCash',
            'welcomeBack',
            'achieved',
            'of',
            'nav.home',
            'nav.more',
            'home.starting_cash',
            'common.money_in',
            'common.money_out',
            'home.quick_actions',
            'common.record_income',
            'common.record_expense',
            'common.count_cash',
            'common.reconcile_cash',
            'common.end_day',
            'common.close_day_fresh',
            'common.view_all',
            'common.expected',
            'common.actual',
            'common.difference',
            'common.who_owes_you',
            'common.no_outstanding_credit',
            'greeting.welcome_back',
            'target.achieved',
            'target.of'
        ];
        // Try universal section for modal and form keys
        if (!translation && modalAndFormKeys.includes(key)) {
            translation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].universal[key];
        }
        // If not found in universal, try industry-specific sections (tailor, retail, etc.)
        if (!translation && keyParts.length >= 1) {
            const industrySection = keyParts[0]; // e.g., 'tailor', 'retail', etc.
            if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][industrySection]) {
                // For industry-specific sections, the full key is stored (e.g., "tailor.jobs")
                // So we look for the complete key, not navigate through parts
                translation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][industrySection][key];
            }
        }
        // If translation is found and is an object with language keys
        if (translation && typeof translation === 'object' && !Array.isArray(translation)) {
            // Check if the language exists in the translation
            if (language in translation) {
                let translatedText = translation[language];
                // Handle variable interpolation
                if (vars && typeof translatedText === 'string') {
                    for (const [varKey, varValue] of Object.entries(vars)){
                        translatedText = translatedText.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue));
                    }
                }
                return translatedText;
            }
            // Fallback to English if target language not available
            if ('en' in translation) {
                let translatedText = translation.en;
                // Handle variable interpolation
                if (vars && typeof translatedText === 'string') {
                    for (const [varKey, varValue] of Object.entries(vars)){
                        translatedText = translatedText.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue));
                    }
                }
                return translatedText;
            }
        }
        // If no translation found, return default text or key
        return defaultText || key;
    } catch (error) {
        console.error('Translation error:', error);
        return defaultText || key;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$smart$2d$translation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/smart-translation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useLanguage = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "e6846e0f95a972617c348f4e0ddd59986cf801827bbed168566bfc471a6b6fd8") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e6846e0f95a972617c348f4e0ddd59986cf801827bbed168566bfc471a6b6fd8";
    }
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
_s(useLanguage, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const LanguageProvider = (t0)=>{
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "e6846e0f95a972617c348f4e0ddd59986cf801827bbed168566bfc471a6b6fd8") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e6846e0f95a972617c348f4e0ddd59986cf801827bbed168566bfc471a6b6fd8";
    }
    const { children, industry: t1 } = t0;
    const industry = t1 === undefined ? "retail" : t1;
    const [currentLanguage, setCurrentLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("en");
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [
            "en",
            "sw",
            "ha",
            "yo",
            "ig",
            "zu",
            "xh",
            "af",
            "tw",
            "rw",
            "lg"
        ];
        $[1] = t2;
    } else {
        t2 = $[1];
    }
    const supportedLanguages = t2;
    let t3;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = {
            en: "English",
            sw: "Kiswahili",
            ha: "Hausa",
            yo: "Yor\xF9b\xE1",
            ig: "Igbo",
            zu: "isiZulu",
            xh: "isiXhosa",
            af: "Afrikaans",
            tw: "Twi",
            rw: "Kinyarwanda",
            lg: "Luganda"
        };
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    const nativeNames = t3;
    let t4;
    let t5;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ()=>{
            const savedLanguage = localStorage.getItem("beezee_language");
            if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
                setCurrentLanguage(savedLanguage);
            }
        };
        t5 = [];
        $[3] = t4;
        $[4] = t5;
    } else {
        t4 = $[3];
        t5 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t4, t5);
    let t6;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = (lang)=>{
            if (supportedLanguages.includes(lang)) {
                setCurrentLanguage(lang);
                localStorage.setItem("beezee_language", lang);
            }
        };
        $[5] = t6;
    } else {
        t6 = $[5];
    }
    const setLanguage = t6;
    let t7;
    if ($[6] !== currentLanguage || $[7] !== industry) {
        t7 = (key, defaultText, vars)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$smart$2d$translation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(key, currentLanguage, industry, defaultText, vars);
        $[6] = currentLanguage;
        $[7] = industry;
        $[8] = t7;
    } else {
        t7 = $[8];
    }
    const t = t7;
    let t8;
    if ($[9] !== currentLanguage || $[10] !== t) {
        t8 = {
            currentLanguage,
            setLanguage,
            t,
            isRTL: false,
            supportedLanguages,
            nativeNames
        };
        $[9] = currentLanguage;
        $[10] = t;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] !== children || $[13] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
            value: t8,
            children: children
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx",
            lineNumber: 133,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[12] = children;
        $[13] = t8;
        $[14] = t9;
    } else {
        t9 = $[14];
    }
    return t9;
};
_s1(LanguageProvider, "FxMgwpBn5Oxu6gaxIG8+q7oe268=");
_c = LanguageProvider;
var _c;
__turbopack_context__.k.register(_c, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/usePWAInstall.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePWAInstall",
    ()=>usePWAInstall
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const usePWAInstall = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "e95cbb8a43db073d393ce2a8c56843116b7cf74a8c355eb568a7a87851940f73") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e95cbb8a43db073d393ce2a8c56843116b7cf74a8c355eb568a7a87851940f73";
    }
    const [installPrompt, setInstallPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isInstalled, setIsInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInstalling, setIsInstalling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ()=>{
            const checkIfInstalled = ()=>{
                if (window.matchMedia("(display-mode: standalone)").matches) {
                    setIsInstalled(true);
                }
                if ("standalone" in window.navigator && window.navigator.standalone) {
                    setIsInstalled(true);
                }
            };
            const handleBeforeInstallPrompt = (e)=>{
                e.preventDefault();
                setInstallPrompt(e);
            };
            const handleAppInstalled = ()=>{
                setIsInstalled(true);
                setInstallPrompt(null);
            };
            checkIfInstalled();
            window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.addEventListener("appinstalled", handleAppInstalled);
            return ()=>{
                window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
                window.removeEventListener("appinstalled", handleAppInstalled);
            };
        };
        t1 = [];
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    let t2;
    if ($[3] !== installPrompt || $[4] !== isInstalled) {
        t2 = async ()=>{
            if (!installPrompt || isInstalled) {
                return false;
            }
            setIsInstalling(true);
            ;
            try {
                const result = await installPrompt.prompt();
                const choiceResult = await result.userChoice;
                if (choiceResult.outcome === "accepted") {
                    setIsInstalled(true);
                    setInstallPrompt(null);
                    setIsInstalling(false);
                    return true;
                } else {
                    setIsInstalling(false);
                    return false;
                }
            } catch (t3) {
                const error = t3;
                console.error("PWA installation failed:", error);
                setIsInstalling(false);
                return false;
            }
        };
        $[3] = installPrompt;
        $[4] = isInstalled;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    const install = t2;
    let t3;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ()=>{
            setInstallPrompt(null);
        };
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const skipInstall = t3;
    const t4 = !!installPrompt && !isInstalled;
    let t5;
    if ($[7] !== install || $[8] !== isInstalled || $[9] !== isInstalling || $[10] !== t4) {
        t5 = {
            canInstall: t4,
            isInstalled,
            isInstalling,
            install,
            skipInstall
        };
        $[7] = install;
        $[8] = isInstalled;
        $[9] = isInstalling;
        $[10] = t4;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    return t5;
};
_s(usePWAInstall, "XUT0GHRXxLi9ndWtoZJV4HWj2Bk=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_c339933c._.js.map