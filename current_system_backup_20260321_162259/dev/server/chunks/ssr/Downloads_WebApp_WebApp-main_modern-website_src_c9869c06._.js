module.exports = [
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/smart-translation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>smartTranslate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/translations-new.js [app-ssr] (ecmascript)");
;
function smartTranslate(key, language = 'en', industry, defaultText, vars) {
    try {
        // Split the key into parts (e.g., 'tailor.orders.title' -> ['tailor', 'orders', 'title'])
        const keyParts = key.split('.');
        // Try to find the translation in the translations object
        let translation = null;
        // FIRST: Try universal section for ANY key (most efficient and future-proof)
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].universal && __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].universal[key]) {
            translation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].universal[key];
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
                if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"][key]) {
                    translation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"][key];
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
            translation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].universal[key];
        }
        // If not found in universal, try industry-specific sections (tailor, retail, etc.)
        if (!translation && keyParts.length >= 1) {
            const industrySection = keyParts[0]; // e.g., 'tailor', 'retail', etc.
            if (__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"][industrySection]) {
                // For industry-specific sections, the full key is stored (e.g., "tailor.jobs")
                // So we look for the complete key, not navigate through parts
                translation = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$translations$2d$new$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"][industrySection][key];
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
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$smart$2d$translation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/smart-translation.js [app-ssr] (ecmascript)");
'use client';
;
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useLanguage = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
const LanguageProvider = ({ children, industry = 'retail' })=>{
    const [currentLanguage, setCurrentLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('en');
    const supportedLanguages = [
        'en',
        'sw',
        'ha',
        'yo',
        'ig',
        'zu',
        'xh',
        'af',
        'tw',
        'rw',
        'lg'
    ];
    const nativeNames = {
        en: 'English',
        sw: 'Kiswahili',
        ha: 'Hausa',
        yo: 'Yorùbá',
        ig: 'Igbo',
        zu: 'isiZulu',
        xh: 'isiXhosa',
        af: 'Afrikaans',
        tw: 'Twi',
        rw: 'Kinyarwanda',
        lg: 'Luganda'
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedLanguage = localStorage.getItem('beezee_language');
        if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);
    const setLanguage = (lang)=>{
        if (supportedLanguages.includes(lang)) {
            setCurrentLanguage(lang);
            localStorage.setItem('beezee_language', lang);
        }
    };
    const t = (key, defaultText, vars)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$smart$2d$translation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(key, currentLanguage, industry, defaultText, vars);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            currentLanguage,
            setLanguage,
            t,
            isRTL: false,
            supportedLanguages,
            nativeNames
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/LanguageContext.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
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
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/usePWAInstall.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePWAInstall",
    ()=>usePWAInstall
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const usePWAInstall = ()=>{
    const [installPrompt, setInstallPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isInstalled, setIsInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInstalling, setIsInstalling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if app is already installed
        const checkIfInstalled = ()=>{
            // Check if running in standalone mode (already installed PWA)
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
            }
            // Check if app is in iOS standalone mode
            if ('standalone' in window.navigator && window.navigator.standalone) {
                setIsInstalled(true);
            }
        };
        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e)=>{
            e.preventDefault();
            setInstallPrompt(e);
        };
        // Listen for app installed event
        const handleAppInstalled = ()=>{
            setIsInstalled(true);
            setInstallPrompt(null);
        };
        checkIfInstalled();
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        return ()=>{
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);
    const install = async ()=>{
        if (!installPrompt || isInstalled) {
            return false;
        }
        setIsInstalling(true);
        try {
            // Show the install prompt
            const result = await installPrompt.prompt();
            // Wait for the user's response
            const choiceResult = await result.userChoice;
            if (choiceResult.outcome === 'accepted') {
                setIsInstalled(true);
                setInstallPrompt(null);
                setIsInstalling(false);
                return true;
            } else {
                setIsInstalling(false);
                return false;
            }
        } catch (error) {
            console.error('PWA installation failed:', error);
            setIsInstalling(false);
            return false;
        }
    };
    const skipInstall = ()=>{
        setInstallPrompt(null);
    };
    return {
        canInstall: !!installPrompt && !isInstalled,
        isInstalled,
        isInstalling,
        install,
        skipInstall
    };
};
}),
];

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_c9869c06._.js.map