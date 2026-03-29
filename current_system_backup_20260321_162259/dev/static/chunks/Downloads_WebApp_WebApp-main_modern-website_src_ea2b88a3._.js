(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/data/industries.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getIndustryById",
    ()=>getIndustryById,
    "getSectorById",
    ()=>getSectorById,
    "getSectorsByIndustry",
    ()=>getSectorsByIndustry,
    "industries",
    ()=>industries
]);
const industries = [
    {
        id: 'retail',
        name: 'Retail',
        icon: '🏪',
        sectors: [
            {
                id: 'general_store',
                name: 'General Store',
                description: 'Convenience store with various household items'
            },
            {
                id: 'electronics',
                name: 'Electronics',
                description: 'Gadgets, phones, computers and accessories'
            },
            {
                id: 'clothing',
                name: 'Clothing & Fashion',
                description: 'Apparel, shoes and fashion accessories'
            },
            {
                id: 'grocery',
                name: 'Grocery & Food',
                description: 'Food items, beverages and household essentials'
            }
        ]
    },
    {
        id: 'food',
        name: 'Food',
        icon: '🍽️',
        sectors: [
            {
                id: 'restaurant',
                name: 'Restaurant',
                description: 'Full-service dining establishment'
            },
            {
                id: 'cafe',
                name: 'Cafe & Coffee Shop',
                description: 'Coffee, light meals and snacks'
            },
            {
                id: 'bakery',
                name: 'Bakery',
                description: 'Fresh bread, pastries and baked goods'
            },
            {
                id: 'food_truck',
                name: 'Food Truck',
                description: 'Mobile food service business'
            }
        ]
    },
    {
        id: 'transport',
        name: 'Transport',
        icon: '🚗',
        sectors: [
            {
                id: 'taxi',
                name: 'Taxi Service',
                description: 'Passenger transportation services'
            },
            {
                id: 'delivery',
                name: 'Delivery Service',
                description: 'Package and goods delivery'
            },
            {
                id: 'logistics',
                name: 'Logistics & Hauling',
                description: 'Freight and cargo transportation'
            },
            {
                id: 'rental',
                name: 'Vehicle Rental',
                description: 'Car and vehicle rental services'
            }
        ]
    },
    {
        id: 'salon',
        name: 'Salon',
        icon: '💇',
        sectors: [
            {
                id: 'barber',
                name: 'Barber Shop',
                description: 'Men\'s grooming and hair services'
            },
            {
                id: 'hair_stylist',
                name: 'Hair Stylist',
                description: 'Professional hair styling and treatment'
            },
            {
                id: 'nails',
                name: 'Nail Salon',
                description: 'Manicure, pedicure and nail art'
            },
            {
                id: 'beauty_salon',
                name: 'Beauty Salon',
                description: 'Full-service beauty and wellness treatments'
            }
        ]
    },
    {
        id: 'tailor',
        name: 'Tailor',
        icon: '🧵',
        sectors: [
            {
                id: 'clothing_tailor',
                name: 'Clothing Tailor',
                description: 'Custom-made clothing and alterations'
            },
            {
                id: 'alterations',
                name: 'Alterations & Repairs',
                description: 'Clothing modifications and repairs'
            },
            {
                id: 'custom_designs',
                name: 'Custom Designs',
                description: 'Bespoke clothing design services'
            },
            {
                id: 'uniforms',
                name: 'Uniforms & Workwear',
                description: 'Professional and corporate uniforms'
            }
        ]
    },
    {
        id: 'repairs',
        name: 'Repairs',
        icon: '🔧',
        sectors: [
            {
                id: 'electronics_repair',
                name: 'Electronics Repair',
                description: 'Device and gadget repair services'
            },
            {
                id: 'phone_repair',
                name: 'Phone Repair',
                description: 'Mobile phone and tablet repairs'
            },
            {
                id: 'appliance_repair',
                name: 'Appliance Repair',
                description: 'Home appliance maintenance and repair'
            },
            {
                id: 'general_repair',
                name: 'General Repairs',
                description: 'Multi-purpose repair services'
            }
        ]
    },
    {
        id: 'freelance',
        name: 'Freelance',
        icon: '💻',
        sectors: [
            {
                id: 'consulting',
                name: 'Consulting',
                description: 'Business and professional consulting services'
            },
            {
                id: 'design',
                name: 'Design Services',
                description: 'Graphic, web and creative design'
            },
            {
                id: 'development',
                name: 'Development',
                description: 'Software and web development'
            },
            {
                id: 'writing',
                name: 'Writing & Content',
                description: 'Content creation and writing services'
            },
            {
                id: 'real_estate',
                name: 'Real Estate',
                description: 'Property sales and management'
            },
            {
                id: 'virtual_assistant',
                name: 'Virtual Assistant',
                description: 'Remote administrative and support services'
            }
        ]
    }
];
const getIndustryById = (id)=>{
    return industries.find((industry)=>industry.id === id);
};
const getSectorsByIndustry = (industryId)=>{
    const industry = getIndustryById(industryId);
    return industry?.sectors || [];
};
const getSectorById = (industryId, sectorId)=>{
    const sectors = getSectorsByIndustry(industryId);
    return sectors.find((sector)=>sector.id === sectorId);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndustrySectorStep",
    ()=>IndustrySectorStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/data/industries.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function IndustrySectorStep(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(40);
    if ($[0] !== "af70ef0cbe74f7e808fcc8e422c827716bc1d46d7b60a806b01b97a9fc391fac") {
        for(let $i = 0; $i < 40; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "af70ef0cbe74f7e808fcc8e422c827716bc1d46d7b60a806b01b97a9fc391fac";
    }
    const { industry, selectedSector, onSelect, onNext, onPrev } = t0;
    let t1;
    let t2;
    let t3;
    let t4;
    if ($[1] !== industry || $[2] !== onSelect || $[3] !== selectedSector) {
        const sectors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorsByIndustry"])(industry);
        let t5;
        if ($[8] !== industry) {
            t5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIndustryById"])(industry);
            $[8] = industry;
            $[9] = t5;
        } else {
            t5 = $[9];
        }
        const industryData = t5;
        const industryName = industryData?.name || industry;
        let t6;
        if ($[10] !== onSelect) {
            t6 = ({
                "IndustrySectorStep[handleSectorSelect]": (sectorId)=>{
                    onSelect(sectorId);
                }
            })["IndustrySectorStep[handleSectorSelect]"];
            $[10] = onSelect;
            $[11] = t6;
        } else {
            t6 = $[11];
        }
        const handleSectorSelect = t6;
        t3 = "py-12";
        let t7;
        let t8;
        if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
            t7 = {
                opacity: 0,
                y: 20
            };
            t8 = {
                opacity: 1,
                y: 0
            };
            $[12] = t7;
            $[13] = t8;
        } else {
            t7 = $[12];
            t8 = $[13];
        }
        const t9 = industryData?.icon || "\uD83C\uDFE2";
        let t10;
        if ($[14] !== t9) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-20 h-20 bg-[var(--powder-light)]/30 rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-3xl",
                    children: t9
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                    lineNumber: 80,
                    columnNumber: 152
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                lineNumber: 80,
                columnNumber: 13
            }, this);
            $[14] = t9;
            $[15] = t10;
        } else {
            t10 = $[15];
        }
        let t11;
        if ($[16] !== industryName) {
            t11 = industryName.toLowerCase();
            $[16] = industryName;
            $[17] = t11;
        } else {
            t11 = $[17];
        }
        let t12;
        if ($[18] !== t11) {
            t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-3xl font-bold text-[var(--text-1)] mb-4 tracking-[-0.02em]",
                children: [
                    "What type of ",
                    t11,
                    " business?"
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                lineNumber: 96,
                columnNumber: 13
            }, this);
            $[18] = t11;
            $[19] = t12;
        } else {
            t12 = $[19];
        }
        let t13;
        if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
            t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[var(--text-2)] max-w-md mx-auto",
                children: "Choose your specific sector to personalize your experience"
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                lineNumber: 104,
                columnNumber: 13
            }, this);
            $[20] = t13;
        } else {
            t13 = $[20];
        }
        if ($[21] !== t10 || $[22] !== t12) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: t7,
                animate: t8,
                className: "text-center mb-8",
                children: [
                    t10,
                    t12,
                    t13
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                lineNumber: 110,
                columnNumber: 12
            }, this);
            $[21] = t10;
            $[22] = t12;
            $[23] = t4;
        } else {
            t4 = $[23];
        }
        t1 = "grid gap-6 mb-8";
        t2 = sectors.length > 0 ? sectors.map({
            "IndustrySectorStep[sectors.map()]": (sector, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                    initial: {
                        opacity: 0,
                        x: -20
                    },
                    animate: {
                        opacity: 1,
                        x: 0
                    },
                    transition: {
                        delay: index * 0.1
                    },
                    onClick: {
                        "IndustrySectorStep[sectors.map() > <motion.button>.onClick]": ()=>handleSectorSelect(sector.id)
                    }["IndustrySectorStep[sectors.map() > <motion.button>.onClick]"],
                    className: `p-6 rounded-xl border-2 transition-all flex items-center gap-4 ${selectedSector === sector.id ? "border-[var(--powder-dark)] bg-[var(--powder-light)]/20 shadow-lg" : "border-[var(--border)] hover:border-[var(--powder-mid)] hover:shadow-md"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-14 h-14 bg-[var(--glass-bg)] rounded-xl flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xl",
                                children: "🏢"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                                lineNumber: 129,
                                columnNumber: 420
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                            lineNumber: 129,
                            columnNumber: 328
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xl font-bold text-[var(--text-1)]",
                                    children: sector.name
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                                    lineNumber: 129,
                                    columnNumber: 496
                                }, this),
                                sector.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-[var(--text-2)] mt-1",
                                    children: sector.description
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                                    lineNumber: 129,
                                    columnNumber: 594
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                            lineNumber: 129,
                            columnNumber: 462
                        }, this),
                        selectedSector === sector.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                scale: 0
                            },
                            animate: {
                                scale: 1
                            },
                            transition: {
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[var(--powder-dark)] font-bold text-xl",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                                lineNumber: 137,
                                columnNumber: 12
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                            lineNumber: 129,
                            columnNumber: 711
                        }, this)
                    ]
                }, sector.id, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                    lineNumber: 119,
                    columnNumber: 63
                }, this)
        }["IndustrySectorStep[sectors.map()]"]) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-[var(--text-2)]",
                    children: "No specific sectors available for this industry."
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                    lineNumber: 138,
                    columnNumber: 82
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-[var(--text-3)] mt-2",
                    children: "You can proceed with the general industry selection."
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
                    lineNumber: 138,
                    columnNumber: 174
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
            lineNumber: 138,
            columnNumber: 47
        }, this);
        $[1] = industry;
        $[2] = onSelect;
        $[3] = selectedSector;
        $[4] = t1;
        $[5] = t2;
        $[6] = t3;
        $[7] = t4;
    } else {
        t1 = $[4];
        t2 = $[5];
        t3 = $[6];
        t4 = $[7];
    }
    let t5;
    if ($[24] !== t1 || $[25] !== t2) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: t2
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
            lineNumber: 154,
            columnNumber: 10
        }, this);
        $[24] = t1;
        $[25] = t2;
        $[26] = t5;
    } else {
        t5 = $[26];
    }
    let t6;
    if ($[27] !== onPrev) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onPrev,
            className: "flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all active:scale-[0.98]",
            children: "Back"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
            lineNumber: 163,
            columnNumber: 10
        }, this);
        $[27] = onPrev;
        $[28] = t6;
    } else {
        t6 = $[28];
    }
    const t7 = !selectedSector;
    let t8;
    if ($[29] !== onNext || $[30] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onNext,
            disabled: t7,
            className: "flex-1 px-6 py-3 bg-[var(--powder-dark)] text-white font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]",
            children: "Next"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
            lineNumber: 172,
            columnNumber: 10
        }, this);
        $[29] = onNext;
        $[30] = t7;
        $[31] = t8;
    } else {
        t8 = $[31];
    }
    let t9;
    if ($[32] !== t6 || $[33] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4",
            children: [
                t6,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
            lineNumber: 181,
            columnNumber: 10
        }, this);
        $[32] = t6;
        $[33] = t8;
        $[34] = t9;
    } else {
        t9 = $[34];
    }
    let t10;
    if ($[35] !== t3 || $[36] !== t4 || $[37] !== t5 || $[38] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t3,
            children: [
                t4,
                t5,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx",
            lineNumber: 190,
            columnNumber: 11
        }, this);
        $[35] = t3;
        $[36] = t4;
        $[37] = t5;
        $[38] = t9;
        $[39] = t10;
    } else {
        t10 = $[39];
    }
    return t10;
}
_c = IndustrySectorStep;
var _c;
__turbopack_context__.k.register(_c, "IndustrySectorStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LiveAccountSummary",
    ()=>LiveAccountSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/data/industries.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function LiveAccountSummary(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(30);
    if ($[0] !== "c5681c33144eb58e99fe9bb75dcf92144439ef6ebb84a721195f54f75dea2921") {
        for(let $i = 0; $i < 30; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c5681c33144eb58e99fe9bb75dcf92144439ef6ebb84a721195f54f75dea2921";
    }
    const { data, currentStep, isVisible } = t0;
    if (!isVisible) {
        return null;
    }
    let t1;
    if ($[1] !== data) {
        t1 = ({
            "LiveAccountSummary[getCompletionPercentage]": ()=>{
                const fields = [
                    "country",
                    "industry",
                    "industrySector",
                    "name",
                    "businessName",
                    "phoneNumber",
                    "dailyTarget"
                ];
                const completedFields = fields.filter({
                    "LiveAccountSummary[getCompletionPercentage > fields.filter()]": (field)=>data[field]
                }["LiveAccountSummary[getCompletionPercentage > fields.filter()]"]);
                return Math.round(completedFields.length / fields.length * 100);
            }
        })["LiveAccountSummary[getCompletionPercentage]"];
        $[1] = data;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const getCompletionPercentage = t1;
    let t2;
    if ($[3] !== data.country) {
        t2 = ({
            "LiveAccountSummary[getCountryDisplay]": ()=>{
                if (!data.country) {
                    return "";
                }
                const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCountryConfig"])(data.country);
                return config.name;
            }
        })["LiveAccountSummary[getCountryDisplay]"];
        $[3] = data.country;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const getCountryDisplay = t2;
    let t3;
    if ($[5] !== data.industry) {
        t3 = ({
            "LiveAccountSummary[getIndustryDisplay]": ()=>{
                if (!data.industry) {
                    return "";
                }
                const industry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIndustryById"])(data.industry);
                return industry?.name || "";
            }
        })["LiveAccountSummary[getIndustryDisplay]"];
        $[5] = data.industry;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const getIndustryDisplay = t3;
    let t4;
    if ($[7] !== data.industry || $[8] !== data.industrySector) {
        t4 = ({
            "LiveAccountSummary[getSectorDisplay]": ()=>{
                if (!data.industry || !data.industrySector) {
                    return "";
                }
                const sector = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorById"])(data.industry, data.industrySector);
                return sector?.name || "";
            }
        })["LiveAccountSummary[getSectorDisplay]"];
        $[7] = data.industry;
        $[8] = data.industrySector;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    const getSectorDisplay = t4;
    let t5;
    if ($[10] !== data.country || $[11] !== data.dailyTarget) {
        t5 = ({
            "LiveAccountSummary[getDailyTargetDisplay]": ()=>{
                if (!data.dailyTarget || !data.country) {
                    return "";
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(data.dailyTarget, data.country);
            }
        })["LiveAccountSummary[getDailyTargetDisplay]"];
        $[10] = data.country;
        $[11] = data.dailyTarget;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    const getDailyTargetDisplay = t5;
    let t6;
    if ($[13] !== currentStep || $[14] !== data.businessName || $[15] !== data.country || $[16] !== data.dailyTarget || $[17] !== data.industry || $[18] !== data.industrySector || $[19] !== data.name || $[20] !== data.phoneNumber || $[21] !== getCompletionPercentage || $[22] !== getCountryDisplay || $[23] !== getDailyTargetDisplay || $[24] !== getIndustryDisplay || $[25] !== getSectorDisplay || $[26] !== isVisible) {
        t6 = isVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: -20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            exit: {
                opacity: 0,
                y: -20
            },
            className: "bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--border)] p-4 shadow-sm",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-semibold text-[var(--text-1)]",
                                        children: "Business Profile"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                        lineNumber: 128,
                                        columnNumber: 236
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-[var(--text-2)]",
                                        children: [
                                            getCompletionPercentage(),
                                            "% Complete"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                        lineNumber: 128,
                                        columnNumber: 316
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 128,
                                columnNumber: 195
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-24 h-1.5 bg-white/20 rounded-full overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: "h-full bg-[var(--powder-dark)]",
                                    initial: {
                                        width: 0
                                    },
                                    animate: {
                                        width: `${getCompletionPercentage()}%`
                                    },
                                    transition: {
                                        duration: 0.5,
                                        ease: "easeOut"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 128,
                                    columnNumber: 480
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 128,
                                columnNumber: 411
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                        lineNumber: 128,
                        columnNumber: 139
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                            data.country && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--text-1)]",
                                    children: getCountryDisplay()
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 135,
                                    columnNumber: 187
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 135,
                                columnNumber: 85
                            }, this),
                            data.industry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--text-1)]",
                                    children: getIndustryDisplay()
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 135,
                                    columnNumber: 381
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 135,
                                columnNumber: 279
                            }, this),
                            data.industrySector && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--text-1)]",
                                    children: getSectorDisplay()
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 135,
                                    columnNumber: 582
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 135,
                                columnNumber: 480
                            }, this),
                            data.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--text-1)]",
                                    children: data.name
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 135,
                                    columnNumber: 771
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 135,
                                columnNumber: 669
                            }, this),
                            data.businessName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--text-1)]",
                                    children: data.businessName
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 135,
                                    columnNumber: 959
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 135,
                                columnNumber: 857
                            }, this),
                            data.phoneNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--text-1)]",
                                    children: data.phoneNumber
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 135,
                                    columnNumber: 1154
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 135,
                                columnNumber: 1052
                            }, this),
                            data.dailyTarget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 px-2 py-1 bg-[var(--powder-light)]/20 rounded-full text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--text-1)]",
                                    children: getDailyTargetDisplay()
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 135,
                                    columnNumber: 1348
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                lineNumber: 135,
                                columnNumber: 1246
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                        lineNumber: 135,
                        columnNumber: 30
                    }, this),
                    currentStep === 6 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        transition: {
                            delay: 0.3
                        },
                        className: "mt-3 p-2 bg-[var(--powder-light)]/20 border border-[var(--border)] rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-[var(--powder-dark)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--powder-dark)] font-bold",
                                    children: "✓"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 141,
                                    columnNumber: 169
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-medium",
                                    children: "Profile complete! Ready to start your business journey."
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                                    lineNumber: 141,
                                    columnNumber: 231
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                            lineNumber: 141,
                            columnNumber: 102
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                        lineNumber: 135,
                        columnNumber: 1454
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
                lineNumber: 128,
                columnNumber: 104
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
            lineNumber: 119,
            columnNumber: 23
        }, this);
        $[13] = currentStep;
        $[14] = data.businessName;
        $[15] = data.country;
        $[16] = data.dailyTarget;
        $[17] = data.industry;
        $[18] = data.industrySector;
        $[19] = data.name;
        $[20] = data.phoneNumber;
        $[21] = getCompletionPercentage;
        $[22] = getCountryDisplay;
        $[23] = getDailyTargetDisplay;
        $[24] = getIndustryDisplay;
        $[25] = getSectorDisplay;
        $[26] = isVisible;
        $[27] = t6;
    } else {
        t6 = $[27];
    }
    let t7;
    if ($[28] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t6
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx",
            lineNumber: 162,
            columnNumber: 10
        }, this);
        $[28] = t6;
        $[29] = t7;
    } else {
        t7 = $[29];
    }
    return t7;
}
_c = LiveAccountSummary;
var _c;
__turbopack_context__.k.register(_c, "LiveAccountSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HybridDailyTarget",
    ()=>HybridDailyTarget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/currency.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function HybridDailyTarget(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(51);
    if ($[0] !== "d292de17bc00bb8fdfa68747fb4d7081388cd10a8ccf26ef6c9ada54a1824101") {
        for(let $i = 0; $i < 51; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d292de17bc00bb8fdfa68747fb4d7081388cd10a8ccf26ef6c9ada54a1824101";
    }
    const { country, selectedTarget, onSelect, onNext, onPrev } = t0;
    const [showCustomInput, setShowCustomInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customValue, setCustomValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [customError, setCustomError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    let handleComplete;
    let t1;
    let t2;
    let t3;
    let t4;
    let t5;
    if ($[1] !== country || $[2] !== customError || $[3] !== customValue || $[4] !== onNext || $[5] !== onSelect || $[6] !== selectedTarget || $[7] !== showCustomInput) {
        const quickOptions = [
            {
                value: 500,
                label: "Starter",
                description: "Great for beginning"
            },
            {
                value: 800,
                label: "Growing",
                description: "For expanding business"
            },
            {
                value: 1000,
                label: "Established",
                description: "Steady daily target"
            },
            {
                value: 1500,
                label: "Ambitious",
                description: "High growth goal"
            }
        ];
        const handleQuickOptionSelect = {
            "HybridDailyTarget[handleQuickOptionSelect]": (value)=>{
                setShowCustomInput(false);
                setCustomError("");
                onSelect(value.toString());
            }
        }["HybridDailyTarget[handleQuickOptionSelect]"];
        let t6;
        if ($[14] !== selectedTarget) {
            t6 = ({
                "HybridDailyTarget[handleCustomInputClick]": ()=>{
                    setShowCustomInput(true);
                    setCustomValue(selectedTarget || "");
                    setCustomError("");
                }
            })["HybridDailyTarget[handleCustomInputClick]"];
            $[14] = selectedTarget;
            $[15] = t6;
        } else {
            t6 = $[15];
        }
        const handleCustomInputClick = t6;
        let t7;
        if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
            t7 = ({
                "HybridDailyTarget[handleCustomValueChange]": (value_0)=>{
                    setCustomValue(value_0);
                    setCustomError("");
                }
            })["HybridDailyTarget[handleCustomValueChange]"];
            $[16] = t7;
        } else {
            t7 = $[16];
        }
        const handleCustomValueChange = t7;
        let t8;
        if ($[17] !== country || $[18] !== customValue || $[19] !== onSelect) {
            t8 = ({
                "HybridDailyTarget[handleCustomValueSubmit]": ()=>{
                    const numValue = parseInt(customValue);
                    if (!numValue || numValue <= 0) {
                        setCustomError("Please enter a valid amount");
                        return;
                    }
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDailyTarget"])(numValue, country)) {
                        setCustomError("Amount seems unusual for your country");
                        return;
                    }
                    onSelect(numValue.toString());
                    setShowCustomInput(false);
                    setCustomError("");
                }
            })["HybridDailyTarget[handleCustomValueSubmit]"];
            $[17] = country;
            $[18] = customValue;
            $[19] = onSelect;
            $[20] = t8;
        } else {
            t8 = $[20];
        }
        const handleCustomValueSubmit = t8;
        let t9;
        if ($[21] !== country || $[22] !== customValue || $[23] !== onSelect) {
            t9 = ({
                "HybridDailyTarget[handleCustomValueSave]": ()=>{
                    const numValue_0 = parseInt(customValue);
                    if (!numValue_0 || numValue_0 <= 0) {
                        setCustomError("Please enter a valid amount");
                        return false;
                    }
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDailyTarget"])(numValue_0, country)) {
                        setCustomError("Amount seems unusual for your country");
                        return false;
                    }
                    onSelect(numValue_0.toString());
                    setCustomError("");
                    return true;
                }
            })["HybridDailyTarget[handleCustomValueSave]"];
            $[21] = country;
            $[22] = customValue;
            $[23] = onSelect;
            $[24] = t9;
        } else {
            t9 = $[24];
        }
        const handleCustomValueSave = t9;
        let t10;
        if ($[25] !== customValue || $[26] !== handleCustomValueSave || $[27] !== onNext || $[28] !== selectedTarget || $[29] !== showCustomInput) {
            t10 = ({
                "HybridDailyTarget[handleComplete]": ()=>{
                    if (showCustomInput && customValue) {
                        const saved = handleCustomValueSave();
                        if (!saved) {
                            return;
                        }
                    }
                    if (!selectedTarget) {
                        return;
                    }
                    onNext();
                }
            })["HybridDailyTarget[handleComplete]"];
            $[25] = customValue;
            $[26] = handleCustomValueSave;
            $[27] = onNext;
            $[28] = selectedTarget;
            $[29] = showCustomInput;
            $[30] = t10;
        } else {
            t10 = $[30];
        }
        handleComplete = t10;
        t3 = "py-12";
        let t11;
        let t12;
        if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
            t11 = {
                opacity: 0,
                y: 20
            };
            t12 = {
                opacity: 1,
                y: 0
            };
            $[31] = t11;
            $[32] = t12;
        } else {
            t11 = $[31];
            t12 = $[32];
        }
        if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
            t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: t11,
                animate: t12,
                className: "text-center mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-20 h-20 bg-[var(--powder-light)]/30 rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-2xl font-bold",
                            children: "$"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                            lineNumber: 189,
                            columnNumber: 220
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                        lineNumber: 189,
                        columnNumber: 81
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl font-bold text-[var(--text-1)] mb-4 tracking-[-0.02em]",
                        children: "What is your daily goal?"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                        lineNumber: 189,
                        columnNumber: 271
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[var(--text-2)] max-w-md mx-auto mb-8",
                        children: "Set a target to help track your progress"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                        lineNumber: 189,
                        columnNumber: 380
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                lineNumber: 189,
                columnNumber: 12
            }, this);
            $[33] = t4;
        } else {
            t4 = $[33];
        }
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-4 mb-6",
            children: quickOptions.map({
                "HybridDailyTarget[quickOptions.map()]": (option, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                        initial: {
                            opacity: 0,
                            scale: 0.9
                        },
                        animate: {
                            opacity: 1,
                            scale: 1
                        },
                        transition: {
                            delay: index * 0.1
                        },
                        onClick: {
                            "HybridDailyTarget[quickOptions.map() > <motion.button>.onClick]": ()=>handleQuickOptionSelect(option.value)
                        }["HybridDailyTarget[quickOptions.map() > <motion.button>.onClick]"],
                        className: `p-6 rounded-xl border-2 transition-all ${selectedTarget === option.value.toString() && !showCustomInput ? "border-[var(--powder-dark)] bg-[var(--powder-light)]/20" : "border-[var(--border)] hover:border-[var(--powder-mid)]"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[var(--powder-dark)] font-bold",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                        lineNumber: 205,
                                        columnNumber: 379
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl font-bold text-[var(--text-1)]",
                                        children: option.value
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                        lineNumber: 205,
                                        columnNumber: 441
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                lineNumber: 205,
                                columnNumber: 318
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-medium text-[var(--text-1)] mb-1",
                                children: option.label
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                lineNumber: 205,
                                columnNumber: 526
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-[var(--text-2)]",
                                children: option.description
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                lineNumber: 205,
                                columnNumber: 609
                            }, this),
                            selectedTarget === option.value.toString() && !showCustomInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    scale: 0
                                },
                                animate: {
                                    scale: 1
                                },
                                transition: {
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                },
                                className: "flex justify-center mt-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[var(--powder-dark)] font-bold",
                                    children: "✓"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                    lineNumber: 213,
                                    columnNumber: 51
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                lineNumber: 205,
                                columnNumber: 748
                            }, this)
                        ]
                    }, option.value, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                        lineNumber: 195,
                        columnNumber: 69
                    }, this)
            }["HybridDailyTarget[quickOptions.map()]"])
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 194,
            columnNumber: 10
        }, this);
        t1 = "mb-8";
        t2 = !showCustomInput && !quickOptions.some({
            "HybridDailyTarget[quickOptions.some()]": (option_0)=>option_0.value.toString() === selectedTarget
        }["HybridDailyTarget[quickOptions.some()]"]) && selectedTarget ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "p-4 rounded-xl border-2 border-[var(--powder-dark)] bg-[var(--powder-light)]/20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-[var(--text-2)] mb-1",
                                    children: "Your custom daily target"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                    lineNumber: 224,
                                    columnNumber: 156
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xl font-bold text-[var(--text-1)]",
                                    children: selectedTarget
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                    lineNumber: 224,
                                    columnNumber: 237
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                            lineNumber: 224,
                            columnNumber: 151
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-10 h-10 rounded-full bg-[var(--powder-dark)] text-white flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white font-bold",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                lineNumber: 224,
                                columnNumber: 429
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                            lineNumber: 224,
                            columnNumber: 321
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                    lineNumber: 224,
                    columnNumber: 100
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleCustomInputClick,
                    className: "text-sm text-[var(--powder-dark)] hover:text-[var(--powder-darker)] transition-colors mt-2",
                    children: "Change amount"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                    lineNumber: 224,
                    columnNumber: 488
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 218,
            columnNumber: 70
        }, this) : !showCustomInput ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            transition: {
                delay: 0.4
            },
            onClick: handleCustomInputClick,
            className: "w-full p-4 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--powder-mid)] transition-all flex items-center justify-center gap-3 text-[var(--text-2)] hover:text-[var(--text-1)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium",
                children: "Enter custom amount"
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                lineNumber: 230,
                columnNumber: 256
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 224,
            columnNumber: 689
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "p-4 rounded-xl border-2 border-[var(--powder-dark)] bg-[var(--powder-light)]/20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-[var(--text-1)] mb-2",
                            children: "Custom daily target"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                            lineNumber: 236,
                            columnNumber: 122
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    value: customValue,
                                    onChange: {
                                        "HybridDailyTarget[<input>.onChange]": (e)=>handleCustomValueChange(e.target.value)
                                    }["HybridDailyTarget[<input>.onChange]"],
                                    placeholder: "Enter amount",
                                    className: "flex-1 px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all",
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                    lineNumber: 236,
                                    columnNumber: 248
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCustomValueSubmit,
                                    className: "px-6 py-3 bg-[var(--powder-dark)] text-white font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all",
                                    children: "Set"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                                    lineNumber: 238,
                                    columnNumber: 306
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                            lineNumber: 236,
                            columnNumber: 220
                        }, this),
                        customError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 text-sm text-red-500",
                            children: customError
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                            lineNumber: 238,
                            columnNumber: 506
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                    lineNumber: 236,
                    columnNumber: 100
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCustomValueSave,
                            className: "text-sm text-[var(--powder-dark)] hover:text-[var(--powder-darker)] transition-colors",
                            children: "Save"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                            lineNumber: 238,
                            columnNumber: 603
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "HybridDailyTarget[<button>.onClick]": ()=>setShowCustomInput(false)
                            }["HybridDailyTarget[<button>.onClick]"],
                            className: "text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                            lineNumber: 238,
                            columnNumber: 754
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
                    lineNumber: 238,
                    columnNumber: 575
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 230,
            columnNumber: 331
        }, this);
        $[1] = country;
        $[2] = customError;
        $[3] = customValue;
        $[4] = onNext;
        $[5] = onSelect;
        $[6] = selectedTarget;
        $[7] = showCustomInput;
        $[8] = handleComplete;
        $[9] = t1;
        $[10] = t2;
        $[11] = t3;
        $[12] = t4;
        $[13] = t5;
    } else {
        handleComplete = $[8];
        t1 = $[9];
        t2 = $[10];
        t3 = $[11];
        t4 = $[12];
        t5 = $[13];
    }
    let t6;
    if ($[34] !== t1 || $[35] !== t2) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: t2
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 264,
            columnNumber: 10
        }, this);
        $[34] = t1;
        $[35] = t2;
        $[36] = t6;
    } else {
        t6 = $[36];
    }
    let t7;
    if ($[37] !== onPrev) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onPrev,
            className: "flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all active:scale-[0.98]",
            children: "Back"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 273,
            columnNumber: 10
        }, this);
        $[37] = onPrev;
        $[38] = t7;
    } else {
        t7 = $[38];
    }
    const t8 = !selectedTarget;
    let t9;
    if ($[39] !== handleComplete || $[40] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleComplete,
            disabled: t8,
            className: "flex-1 px-6 py-3 bg-[var(--powder-dark)] text-white font-bold rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-[var(--powder-dark)]/20",
            children: "START USING BEEZEE"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 282,
            columnNumber: 10
        }, this);
        $[39] = handleComplete;
        $[40] = t8;
        $[41] = t9;
    } else {
        t9 = $[41];
    }
    let t10;
    if ($[42] !== t7 || $[43] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4",
            children: [
                t7,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 291,
            columnNumber: 11
        }, this);
        $[42] = t7;
        $[43] = t9;
        $[44] = t10;
    } else {
        t10 = $[44];
    }
    let t11;
    if ($[45] !== t10 || $[46] !== t3 || $[47] !== t4 || $[48] !== t5 || $[49] !== t6) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t3,
            children: [
                t4,
                t5,
                t6,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx",
            lineNumber: 300,
            columnNumber: 11
        }, this);
        $[45] = t10;
        $[46] = t3;
        $[47] = t4;
        $[48] = t5;
        $[49] = t6;
        $[50] = t11;
    } else {
        t11 = $[50];
    }
    return t11;
}
_s(HybridDailyTarget, "us1xiWE/CthYLSywt6z18hb1hXA=");
_c = HybridDailyTarget;
var _c;
__turbopack_context__.k.register(_c, "HybridDailyTarget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountSummaryPreview",
    ()=>AccountSummaryPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/utils/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/data/industries.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function AccountSummaryPreview(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(84);
    if ($[0] !== "cbf1eeebeba581f898a21ef52e66eca3e83e6ab66e84c0f069c57633ee0166a8") {
        for(let $i = 0; $i < 84; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cbf1eeebeba581f898a21ef52e66eca3e83e6ab66e84c0f069c57633ee0166a8";
    }
    const { formData, onComplete, onPrev, isLoading: t1, error: t2 } = t0;
    const isLoading = t1 === undefined ? false : t1;
    const error = t2 === undefined ? null : t2;
    let t3;
    if ($[1] !== formData) {
        t3 = ({
            "AccountSummaryPreview[getCompletionPercentage]": ()=>{
                const fields = [
                    "country",
                    "industry",
                    "industrySector",
                    "name",
                    "businessName",
                    "phoneNumber",
                    "dailyTarget"
                ];
                const completedFields = fields.filter({
                    "AccountSummaryPreview[getCompletionPercentage > fields.filter()]": (field)=>formData[field]
                }["AccountSummaryPreview[getCompletionPercentage > fields.filter()]"]);
                return Math.round(completedFields.length / fields.length * 100);
            }
        })["AccountSummaryPreview[getCompletionPercentage]"];
        $[1] = formData;
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    const getCompletionPercentage = t3;
    let t4;
    if ($[3] !== formData.country) {
        t4 = ({
            "AccountSummaryPreview[getCountryDisplay]": ()=>{
                if (!formData.country) {
                    return "";
                }
                const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCountryConfig"])(formData.country);
                return `${config.flag} ${config.name}`;
            }
        })["AccountSummaryPreview[getCountryDisplay]"];
        $[3] = formData.country;
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    const getCountryDisplay = t4;
    let t5;
    if ($[5] !== formData.industry) {
        t5 = ({
            "AccountSummaryPreview[getIndustryDisplay]": ()=>{
                if (!formData.industry) {
                    return "";
                }
                const industry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIndustryById"])(formData.industry);
                return `${industry?.icon} ${industry?.name}`;
            }
        })["AccountSummaryPreview[getIndustryDisplay]"];
        $[5] = formData.industry;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    const getIndustryDisplay = t5;
    let t6;
    if ($[7] !== formData.industry || $[8] !== formData.industrySector) {
        t6 = ({
            "AccountSummaryPreview[getSectorDisplay]": ()=>{
                if (!formData.industry || !formData.industrySector) {
                    return "";
                }
                const sector = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorById"])(formData.industry, formData.industrySector);
                return sector?.name || "";
            }
        })["AccountSummaryPreview[getSectorDisplay]"];
        $[7] = formData.industry;
        $[8] = formData.industrySector;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    const getSectorDisplay = t6;
    let t7;
    if ($[10] !== formData.country || $[11] !== formData.dailyTarget) {
        t7 = ({
            "AccountSummaryPreview[getDailyTargetDisplay]": ()=>{
                if (!formData.dailyTarget || !formData.country) {
                    return "";
                }
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$utils$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrencyWithSymbol"])(Number(formData.dailyTarget), formData.country);
            }
        })["AccountSummaryPreview[getDailyTargetDisplay]"];
        $[10] = formData.country;
        $[11] = formData.dailyTarget;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    const getDailyTargetDisplay = t7;
    const renderSummaryItem = _AccountSummaryPreviewRenderSummaryItem;
    let t8;
    let t9;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = {
            opacity: 0,
            y: 20
        };
        t9 = {
            opacity: 1,
            y: 0
        };
        $[13] = t8;
        $[14] = t9;
    } else {
        t8 = $[13];
        t9 = $[14];
    }
    let t10;
    let t11;
    let t12;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-20 h-20 bg-[var(--powder-light)]/30 rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-2xl font-bold",
                children: "✓"
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                lineNumber: 142,
                columnNumber: 150
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 142,
            columnNumber: 11
        }, this);
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-3xl font-bold text-[var(--text-1)] mb-4 tracking-[-0.02em]",
            children: "Review Your Business Profile"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 143,
            columnNumber: 11
        }, this);
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[var(--text-2)] max-w-md mx-auto mb-4",
            children: "Here's a summary of your business information. Make sure everything looks correct before you get started."
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 144,
            columnNumber: 11
        }, this);
        $[15] = t10;
        $[16] = t11;
        $[17] = t12;
    } else {
        t10 = $[15];
        t11 = $[16];
        t12 = $[17];
    }
    let t13;
    if ($[18] !== getCompletionPercentage) {
        t13 = getCompletionPercentage();
        $[18] = getCompletionPercentage;
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-sm text-[var(--text-2)]",
            children: [
                t13,
                "% Complete"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 163,
            columnNumber: 11
        }, this);
        $[20] = t13;
        $[21] = t14;
    } else {
        t14 = $[21];
    }
    let t15;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = {
            width: 0
        };
        $[22] = t15;
    } else {
        t15 = $[22];
    }
    let t16;
    if ($[23] !== getCompletionPercentage) {
        t16 = getCompletionPercentage();
        $[23] = getCompletionPercentage;
        $[24] = t16;
    } else {
        t16 = $[24];
    }
    const t17 = `${t16}%`;
    let t18;
    if ($[25] !== t17) {
        t18 = {
            width: t17
        };
        $[25] = t17;
        $[26] = t18;
    } else {
        t18 = $[26];
    }
    let t19;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = {
            duration: 0.5,
            ease: "easeOut"
        };
        $[27] = t19;
    } else {
        t19 = $[27];
    }
    let t20;
    if ($[28] !== t18) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-24 h-2 bg-[var(--bg2)] rounded-full overflow-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "h-full bg-[var(--powder-dark)]",
                initial: t15,
                animate: t18,
                transition: t19
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                lineNumber: 209,
                columnNumber: 82
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 209,
            columnNumber: 11
        }, this);
        $[28] = t18;
        $[29] = t20;
    } else {
        t20 = $[29];
    }
    let t21;
    if ($[30] !== t14 || $[31] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: t8,
            animate: t9,
            className: "text-center mb-8",
            children: [
                t10,
                t11,
                t12,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-2 mb-8",
                    children: [
                        t14,
                        t20
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                    lineNumber: 217,
                    columnNumber: 93
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 217,
            columnNumber: 11
        }, this);
        $[30] = t14;
        $[31] = t20;
        $[32] = t21;
    } else {
        t21 = $[32];
    }
    let t22;
    if ($[33] !== formData.country || $[34] !== getCountryDisplay) {
        t22 = renderSummaryItem("Country", getCountryDisplay(), !!formData.country);
        $[33] = formData.country;
        $[34] = getCountryDisplay;
        $[35] = t22;
    } else {
        t22 = $[35];
    }
    let t23;
    if ($[36] !== formData.industry || $[37] !== getIndustryDisplay) {
        t23 = renderSummaryItem("Industry", getIndustryDisplay(), !!formData.industry);
        $[36] = formData.industry;
        $[37] = getIndustryDisplay;
        $[38] = t23;
    } else {
        t23 = $[38];
    }
    let t24;
    if ($[39] !== formData.industrySector || $[40] !== getSectorDisplay) {
        t24 = renderSummaryItem("Sector", getSectorDisplay(), !!formData.industrySector);
        $[39] = formData.industrySector;
        $[40] = getSectorDisplay;
        $[41] = t24;
    } else {
        t24 = $[41];
    }
    const t25 = formData.name || "";
    const t26 = !!formData.name;
    let t27;
    if ($[42] !== t25 || $[43] !== t26) {
        t27 = renderSummaryItem("Name", t25, t26);
        $[42] = t25;
        $[43] = t26;
        $[44] = t27;
    } else {
        t27 = $[44];
    }
    const t28 = formData.businessName || "Optional";
    const t29 = !!formData.businessName;
    let t30;
    if ($[45] !== t28 || $[46] !== t29) {
        t30 = renderSummaryItem("Business Name", t28, t29);
        $[45] = t28;
        $[46] = t29;
        $[47] = t30;
    } else {
        t30 = $[47];
    }
    const t31 = formData.phoneNumber || "";
    const t32 = !!formData.phoneNumber;
    let t33;
    if ($[48] !== t31 || $[49] !== t32) {
        t33 = renderSummaryItem("Phone Number", t31, t32);
        $[48] = t31;
        $[49] = t32;
        $[50] = t33;
    } else {
        t33 = $[50];
    }
    let t34;
    if ($[51] !== formData.dailyTarget || $[52] !== getDailyTargetDisplay) {
        t34 = renderSummaryItem("Daily Target", getDailyTargetDisplay(), !!formData.dailyTarget);
        $[51] = formData.dailyTarget;
        $[52] = getDailyTargetDisplay;
        $[53] = t34;
    } else {
        t34 = $[53];
    }
    let t35;
    if ($[54] !== t22 || $[55] !== t23 || $[56] !== t24 || $[57] !== t27 || $[58] !== t30 || $[59] !== t33 || $[60] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 mb-8 max-w-2xl mx-auto",
            children: [
                t22,
                t23,
                t24,
                t27,
                t30,
                t33,
                t34
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 295,
            columnNumber: 11
        }, this);
        $[54] = t22;
        $[55] = t23;
        $[56] = t24;
        $[57] = t27;
        $[58] = t30;
        $[59] = t33;
        $[60] = t34;
        $[61] = t35;
    } else {
        t35 = $[61];
    }
    let t36;
    let t37;
    let t38;
    if ($[62] === Symbol.for("react.memo_cache_sentinel")) {
        t36 = {
            opacity: 0
        };
        t37 = {
            opacity: 1
        };
        t38 = {
            delay: 0.3
        };
        $[62] = t36;
        $[63] = t37;
        $[64] = t38;
    } else {
        t36 = $[62];
        t37 = $[63];
        t38 = $[64];
    }
    let t39;
    if ($[65] === Symbol.for("react.memo_cache_sentinel")) {
        t39 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: t36,
            animate: t37,
            transition: t38,
            className: "p-4 bg-system-blue/10 border border-glass-border rounded-xl max-w-2xl mx-auto mb-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-system-blue",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[var(--powder-dark)] font-bold",
                        children: "✓"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                        lineNumber: 330,
                        columnNumber: 221
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium",
                        children: "Your business profile is complete! You're all set to start managing your business with BeeZee."
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                        lineNumber: 330,
                        columnNumber: 283
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                lineNumber: 330,
                columnNumber: 163
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 330,
            columnNumber: 11
        }, this);
        $[65] = t39;
    } else {
        t39 = $[65];
    }
    let t40;
    if ($[66] !== error) {
        t40 = error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 10
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "p-4 bg-red-500/10 border border-red-500/30 rounded-xl max-w-2xl mx-auto mb-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-red-400",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm font-medium",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                    lineNumber: 343,
                    columnNumber: 151
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                lineNumber: 343,
                columnNumber: 97
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 337,
            columnNumber: 20
        }, this);
        $[66] = error;
        $[67] = t40;
    } else {
        t40 = $[67];
    }
    let t41;
    if ($[68] !== onPrev) {
        t41 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onPrev,
            className: "flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all",
            children: "Back"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 351,
            columnNumber: 11
        }, this);
        $[68] = onPrev;
        $[69] = t41;
    } else {
        t41 = $[69];
    }
    let t42;
    if ($[70] !== isLoading) {
        t42 = isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                    lineNumber: 359,
                    columnNumber: 25
                }, this),
                "Creating Business..."
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: "START USING BEEZEE"
        }, void 0, false);
        $[70] = isLoading;
        $[71] = t42;
    } else {
        t42 = $[71];
    }
    let t43;
    if ($[72] !== isLoading || $[73] !== onComplete || $[74] !== t42) {
        t43 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onComplete,
            disabled: isLoading,
            className: "flex-1 px-6 py-3 bg-[var(--powder-dark)] text-white font-bold rounded-xl hover:bg-[var(--powder-mid)] transition-all active:scale-[0.98] shadow-lg shadow-[var(--powder-dark)]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100",
            children: t42
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 367,
            columnNumber: 11
        }, this);
        $[72] = isLoading;
        $[73] = onComplete;
        $[74] = t42;
        $[75] = t43;
    } else {
        t43 = $[75];
    }
    let t44;
    if ($[76] !== t41 || $[77] !== t43) {
        t44 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4 max-w-xs mx-auto",
            children: [
                t41,
                t43
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 377,
            columnNumber: 11
        }, this);
        $[76] = t41;
        $[77] = t43;
        $[78] = t44;
    } else {
        t44 = $[78];
    }
    let t45;
    if ($[79] !== t21 || $[80] !== t35 || $[81] !== t40 || $[82] !== t44) {
        t45 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-12",
            children: [
                t21,
                t35,
                t39,
                t40,
                t44
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
            lineNumber: 386,
            columnNumber: 11
        }, this);
        $[79] = t21;
        $[80] = t35;
        $[81] = t40;
        $[82] = t44;
        $[83] = t45;
    } else {
        t45 = $[83];
    }
    return t45;
}
_c = AccountSummaryPreview;
function _AccountSummaryPreviewRenderSummaryItem(label, value, isCompleted) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            x: -20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        className: `flex items-center gap-4 p-4 rounded-xl border-2 ${isCompleted ? "border-[var(--powder-dark)] bg-[var(--powder-light)]/20" : "border-[var(--border)] bg-white/5"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 text-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-[var(--text-2)] mb-1",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                        lineNumber: 404,
                        columnNumber: 215
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `text-base font-medium ${isCompleted ? "text-[var(--text-1)]" : "text-[var(--text-2)]"}`,
                        children: value || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "italic",
                            children: "Not set"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                            lineNumber: 404,
                            columnNumber: 395
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                        lineNumber: 404,
                        columnNumber: 279
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                lineNumber: 404,
                columnNumber: 181
            }, this),
            isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[var(--powder-dark)] font-bold",
                children: "✓"
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
                lineNumber: 404,
                columnNumber: 463
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx",
        lineNumber: 398,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "AccountSummaryPreview");
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
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PINSetup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function PINSetup(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(36);
    if ($[0] !== "efc5199264c14cbcae0cf8db8d7053eb9e0c2900432908f624002a07542fe0bc") {
        for(let $i = 0; $i < 36; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "efc5199264c14cbcae0cf8db8d7053eb9e0c2900432908f624002a07542fe0bc";
    }
    const { onPINComplete, onCancel, isLoading: t1, error } = t0;
    const isLoading = t1 === undefined ? false : t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [
            "",
            "",
            "",
            "",
            "",
            ""
        ];
        $[1] = t2;
    } else {
        t2 = $[1];
    }
    const [pin, setPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t2);
    let t3;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = [
            "",
            "",
            "",
            "",
            "",
            ""
        ];
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    const [confirmPin, setConfirmPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t3);
    const [showPin, setShowPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmPin, setShowConfirmPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("create");
    let t4;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = [];
        $[3] = t4;
    } else {
        t4 = $[3];
    }
    const inputRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(t4);
    let t5;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = [];
        $[4] = t5;
    } else {
        t5 = $[4];
    }
    const confirmInputRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(t5);
    let t6;
    let t7;
    if ($[5] !== pin || $[6] !== step) {
        t6 = ({
            "PINSetup[useEffect()]": ()=>{
                if (step === "create" && pin.every(_PINSetupUseEffectPinEvery)) {
                    setStep("confirm");
                }
            }
        })["PINSetup[useEffect()]"];
        t7 = [
            pin,
            step
        ];
        $[5] = pin;
        $[6] = step;
        $[7] = t6;
        $[8] = t7;
    } else {
        t6 = $[7];
        t7 = $[8];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t6, t7);
    let t8;
    if ($[9] !== confirmPin || $[10] !== error || $[11] !== isLoading || $[12] !== onCancel || $[13] !== onPINComplete || $[14] !== pin || $[15] !== showConfirmPin || $[16] !== showPin || $[17] !== step) {
        const handlePinChange = {
            "PINSetup[handlePinChange]": (index, value, t9)=>{
                const isConfirm = t9 === undefined ? false : t9;
                if (value.length > 1) {
                    return;
                }
                const targetArray = isConfirm ? confirmPin : pin;
                const targetSet = isConfirm ? setConfirmPin : setPin;
                const newPin = [
                    ...targetArray
                ];
                newPin[index] = value;
                targetSet(newPin);
                if (value && index < 5) {
                    const refs = isConfirm ? confirmInputRefs : inputRefs;
                    refs.current[index + 1]?.focus();
                }
            }
        }["PINSetup[handlePinChange]"];
        const handleKeyDown = {
            "PINSetup[handleKeyDown]": (index_0, e, t10)=>{
                const isConfirm_0 = t10 === undefined ? false : t10;
                const targetArray_0 = isConfirm_0 ? confirmPin : pin;
                if (e.key === "Backspace" && !targetArray_0[index_0] && index_0 > 0) {
                    const refs_0 = isConfirm_0 ? confirmInputRefs : inputRefs;
                    refs_0.current[index_0 - 1]?.focus();
                }
            }
        }["PINSetup[handleKeyDown]"];
        let t11;
        if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
            t11 = ({
                "PINSetup[handlePaste]": (e_0, t12)=>{
                    const isConfirm_1 = t12 === undefined ? false : t12;
                    e_0.preventDefault();
                    const pastedData = e_0.clipboardData.getData("text").slice(0, 6);
                    const digits = pastedData.replace(/\D/g, "");
                    const targetSet_0 = isConfirm_1 ? setConfirmPin : setPin;
                    const newPin_0 = digits.split("").concat(Array(6 - digits.length).fill(""));
                    targetSet_0(newPin_0);
                    const refs_1 = isConfirm_1 ? confirmInputRefs : inputRefs;
                    const lastIndex = Math.min(digits.length - 1, 5);
                    refs_1.current[lastIndex]?.focus();
                }
            })["PINSetup[handlePaste]"];
            $[19] = t11;
        } else {
            t11 = $[19];
        }
        const handlePaste = t11;
        let t12;
        if ($[20] !== confirmPin || $[21] !== onPINComplete || $[22] !== pin) {
            t12 = ({
                "PINSetup[handleSubmit]": ()=>{
                    const pinString = pin.join("");
                    const confirmPinString = confirmPin.join("");
                    if (pinString.length !== 6) {
                        return;
                    }
                    if (confirmPinString.length !== 6) {
                        return;
                    }
                    if (pinString !== confirmPinString) {
                        return;
                    }
                    console.log("\uD83D\uDD10 PIN setup completed - triggering business creation:", pinString);
                    onPINComplete(pinString);
                }
            })["PINSetup[handleSubmit]"];
            $[20] = confirmPin;
            $[21] = onPINComplete;
            $[22] = pin;
            $[23] = t12;
        } else {
            t12 = $[23];
        }
        const handleSubmit = t12;
        let t13;
        if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
            t13 = ({
                "PINSetup[handleClear]": (t14)=>{
                    const isConfirm_2 = t14 === undefined ? false : t14;
                    const targetSet_1 = isConfirm_2 ? setConfirmPin : setPin;
                    targetSet_1([
                        "",
                        "",
                        "",
                        "",
                        "",
                        ""
                    ]);
                    const refs_2 = isConfirm_2 ? confirmInputRefs : inputRefs;
                    refs_2.current[0]?.focus();
                }
            })["PINSetup[handleClear]"];
            $[24] = t13;
        } else {
            t13 = $[24];
        }
        const handleClear = t13;
        let t14;
        if ($[25] !== pin) {
            t14 = pin.every(_PINSetupPinEvery);
            $[25] = pin;
            $[26] = t14;
        } else {
            t14 = $[26];
        }
        const isPinComplete = t14;
        let t15;
        if ($[27] !== confirmPin) {
            t15 = confirmPin.every(_PINSetupConfirmPinEvery);
            $[27] = confirmPin;
            $[28] = t15;
        } else {
            t15 = $[28];
        }
        const isConfirmPinComplete = t15;
        let t16;
        if ($[29] !== confirmPin || $[30] !== isConfirmPinComplete || $[31] !== isPinComplete || $[32] !== pin) {
            t16 = isPinComplete && isConfirmPinComplete && pin.join("") === confirmPin.join("");
            $[29] = confirmPin;
            $[30] = isConfirmPinComplete;
            $[31] = isPinComplete;
            $[32] = pin;
            $[33] = t16;
        } else {
            t16 = $[33];
        }
        const pinsMatch = t16;
        let t17;
        let t18;
        if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
            t17 = {
                opacity: 0,
                y: 20
            };
            t18 = {
                opacity: 1,
                y: 0
            };
            $[34] = t17;
            $[35] = t18;
        } else {
            t17 = $[34];
            t18 = $[35];
        }
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: t17,
            animate: t18,
            className: "w-full max-w-md mx-auto",
            children: [
                step === "create" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                        size: 32,
                                        className: "text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                        lineNumber: 227,
                                        columnNumber: 193
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 227,
                                    columnNumber: 61
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold text-gray-900 mb-2",
                                    children: "Create Your PIN"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 227,
                                    columnNumber: 240
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600",
                                    children: "Choose a 6-digit PIN for secure access to your account"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 227,
                                    columnNumber: 314
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                            lineNumber: 227,
                            columnNumber: 32
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-gray-700",
                                            children: "Enter 6-digit PIN"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                            lineNumber: 227,
                                            columnNumber: 490
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: {
                                                "PINSetup[<button>.onClick]": ()=>setShowPin(!showPin)
                                            }["PINSetup[<button>.onClick]"],
                                            className: "text-gray-500 hover:text-gray-700",
                                            children: showPin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 229,
                                                columnNumber: 103
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 229,
                                                columnNumber: 126
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                            lineNumber: 227,
                                            columnNumber: 568
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 227,
                                    columnNumber: 434
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 justify-center",
                                    children: pin.map({
                                        "PINSetup[pin.map()]": (digit_2, index_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                ref: {
                                                    "PINSetup[pin.map() > <input>.ref]": (el)=>{
                                                        inputRefs.current[index_1] = el;
                                                    }
                                                }["PINSetup[pin.map() > <input>.ref]"],
                                                type: showPin ? "text" : "password",
                                                inputMode: "numeric",
                                                pattern: "[0-9]",
                                                maxLength: 1,
                                                value: digit_2,
                                                onChange: {
                                                    "PINSetup[pin.map() > <input>.onChange]": (e_1)=>handlePinChange(index_1, e_1.target.value)
                                                }["PINSetup[pin.map() > <input>.onChange]"],
                                                onKeyDown: {
                                                    "PINSetup[pin.map() > <input>.onKeyDown]": (e_2)=>handleKeyDown(index_1, e_2)
                                                }["PINSetup[pin.map() > <input>.onKeyDown]"],
                                                onPaste: {
                                                    "PINSetup[pin.map() > <input>.onPaste]": (e_3)=>handlePaste(e_3)
                                                }["PINSetup[pin.map() > <input>.onPaste]"],
                                                className: "w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors",
                                                disabled: isLoading
                                            }, `pin-${index_1}`, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 230,
                                                columnNumber: 60
                                            }, this)
                                    }["PINSetup[pin.map()]"])
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 229,
                                    columnNumber: 159
                                }, this),
                                isPinComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        scale: 0.8
                                    },
                                    animate: {
                                        opacity: 1,
                                        scale: 1
                                    },
                                    className: "flex items-center justify-center text-green-600",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 20,
                                            className: "mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                            lineNumber: 247,
                                            columnNumber: 74
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-medium",
                                            children: "PIN entered"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                            lineNumber: 247,
                                            columnNumber: 110
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 241,
                                    columnNumber: 63
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                            lineNumber: 227,
                            columnNumber: 407
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                onCancel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onCancel,
                                    disabled: isLoading,
                                    className: "flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 247,
                                    columnNumber: 227
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: {
                                        "PINSetup[<button>.onClick]": ()=>handleClear(false)
                                    }["PINSetup[<button>.onClick]"],
                                    disabled: isLoading,
                                    className: "flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50",
                                    children: "Clear"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 247,
                                    columnNumber: 437
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                            lineNumber: 247,
                            columnNumber: 186
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            className: "bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16,
                                    className: "mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 253,
                                    columnNumber: 102
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 253,
                                    columnNumber: 134
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                            lineNumber: 249,
                            columnNumber: 227
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                    lineNumber: 223,
                    columnNumber: 108
                }, this),
                step === "confirm" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        x: 50
                    },
                    animate: {
                        opacity: 1,
                        x: 0
                    },
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold text-gray-900 mb-2",
                                    children: "Confirm Your PIN"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 259,
                                    columnNumber: 61
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600",
                                    children: "Re-enter your PIN to confirm"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 259,
                                    columnNumber: 136
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                            lineNumber: 259,
                            columnNumber: 32
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-gray-700",
                                            children: "Confirm 6-digit PIN"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                            lineNumber: 259,
                                            columnNumber: 286
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: {
                                                "PINSetup[<button>.onClick]": ()=>setShowConfirmPin(!showConfirmPin)
                                            }["PINSetup[<button>.onClick]"],
                                            className: "text-gray-500 hover:text-gray-700",
                                            children: showConfirmPin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 261,
                                                columnNumber: 110
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                size: 20
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 261,
                                                columnNumber: 133
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                            lineNumber: 259,
                                            columnNumber: 366
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 259,
                                    columnNumber: 230
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 justify-center",
                                    children: confirmPin.map({
                                        "PINSetup[confirmPin.map()]": (digit_3, index_2)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                ref: {
                                                    "PINSetup[confirmPin.map() > <input>.ref]": (el_0)=>{
                                                        confirmInputRefs.current[index_2] = el_0;
                                                    }
                                                }["PINSetup[confirmPin.map() > <input>.ref]"],
                                                type: showConfirmPin ? "text" : "password",
                                                inputMode: "numeric",
                                                pattern: "[0-9]",
                                                maxLength: 1,
                                                value: digit_3,
                                                onChange: {
                                                    "PINSetup[confirmPin.map() > <input>.onChange]": (e_4)=>handlePinChange(index_2, e_4.target.value, true)
                                                }["PINSetup[confirmPin.map() > <input>.onChange]"],
                                                onKeyDown: {
                                                    "PINSetup[confirmPin.map() > <input>.onKeyDown]": (e_5)=>handleKeyDown(index_2, e_5, true)
                                                }["PINSetup[confirmPin.map() > <input>.onKeyDown]"],
                                                onPaste: {
                                                    "PINSetup[confirmPin.map() > <input>.onPaste]": (e_6)=>handlePaste(e_6, true)
                                                }["PINSetup[confirmPin.map() > <input>.onPaste]"],
                                                className: `w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 transition-colors ${digit_3 ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"} ${!pinsMatch && isConfirmPinComplete ? "border-red-500 ring-2 ring-red-200" : ""}`,
                                                disabled: isLoading
                                            }, `confirm-${index_2}`, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 262,
                                                columnNumber: 67
                                            }, this)
                                    }["PINSetup[confirmPin.map()]"])
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 261,
                                    columnNumber: 166
                                }, this),
                                isConfirmPinComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        scale: 0.8
                                    },
                                    animate: {
                                        opacity: 1,
                                        scale: 1
                                    },
                                    className: `flex items-center justify-center ${pinsMatch ? "text-green-600" : "text-red-600"}`,
                                    children: pinsMatch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 20,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 279,
                                                columnNumber: 125
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: "PINs match!"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 279,
                                                columnNumber: 161
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                size: 20,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 279,
                                                columnNumber: 225
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: "PINs don't match"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                                lineNumber: 279,
                                                columnNumber: 257
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 273,
                                    columnNumber: 77
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                            lineNumber: 259,
                            columnNumber: 203
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: {
                                        "PINSetup[<button>.onClick]": ()=>setStep("create")
                                    }["PINSetup[<button>.onClick]"],
                                    disabled: isLoading,
                                    className: "flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50",
                                    children: "Back"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 279,
                                    columnNumber: 370
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleSubmit,
                                    disabled: !pinsMatch || isLoading,
                                    className: "flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                        lineNumber: 281,
                                        columnNumber: 502
                                    }, this) : "Create PIN"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 281,
                                    columnNumber: 210
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                            lineNumber: 279,
                            columnNumber: 342
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            className: "bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 16,
                                    className: "mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 285,
                                    columnNumber: 102
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                                    lineNumber: 285,
                                    columnNumber: 134
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                            lineNumber: 281,
                            columnNumber: 647
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
                    lineNumber: 253,
                    columnNumber: 225
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx",
            lineNumber: 223,
            columnNumber: 10
        }, this);
        $[9] = confirmPin;
        $[10] = error;
        $[11] = isLoading;
        $[12] = onCancel;
        $[13] = onPINComplete;
        $[14] = pin;
        $[15] = showConfirmPin;
        $[16] = showPin;
        $[17] = step;
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    return t8;
}
_s(PINSetup, "WR6DXkR/SpBVkP4cmKiXQS0AXLw=");
_c = PINSetup;
function _PINSetupConfirmPinEvery(digit_1) {
    return digit_1 !== "";
}
function _PINSetupPinEvery(digit_0) {
    return digit_0 !== "";
}
function _PINSetupUseEffectPinEvery(digit) {
    return digit !== "";
}
var _c;
__turbopack_context__.k.register(_c, "PINSetup");
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
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$usePWAInstall$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/usePWAInstall.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const SignupPWAInstallModal = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(21);
    if ($[0] !== "6740816ac89fa0d7d8970587bb3d11e3db319ec37cb07813ec9f028f92ec85ae") {
        for(let $i = 0; $i < 21; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "6740816ac89fa0d7d8970587bb3d11e3db319ec37cb07813ec9f028f92ec85ae";
    }
    const { isOpen, onClose, onContinue } = t0;
    const { canInstall, isInstalling, install, skipInstall } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$usePWAInstall$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePWAInstall"])();
    let t1;
    if ($[1] !== install || $[2] !== onContinue) {
        t1 = async ()=>{
            const success = await install();
            if (success) {
                setTimeout(()=>{
                    onContinue();
                }, 2000);
            }
        };
        $[1] = install;
        $[2] = onContinue;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    const handleInstall = t1;
    let t2;
    if ($[4] !== onClose || $[5] !== onContinue || $[6] !== skipInstall) {
        t2 = ()=>{
            skipInstall();
            onClose();
            onContinue();
        };
        $[4] = onClose;
        $[5] = onContinue;
        $[6] = skipInstall;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    const handleSkip = t2;
    let t3;
    if ($[8] !== onClose || $[9] !== onContinue) {
        t3 = ()=>{
            onClose();
            onContinue();
        };
        $[8] = onClose;
        $[9] = onContinue;
        $[10] = t3;
    } else {
        t3 = $[10];
    }
    const handleContinue = t3;
    if (!canInstall && isOpen) {
        handleContinue();
        return null;
    }
    let t4;
    if ($[11] !== canInstall || $[12] !== handleContinue || $[13] !== handleInstall || $[14] !== handleSkip || $[15] !== isInstalling || $[16] !== isOpen || $[17] !== onClose) {
        t4 = isOpen && canInstall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                    className: "fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                    lineNumber: 83,
                    columnNumber: 36
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 flex items-center justify-center pointer-events-none z-[110] p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            scale: 0.9,
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            scale: 1,
                            opacity: 1,
                            y: 0
                        },
                        exit: {
                            scale: 0.95,
                            opacity: 0,
                            y: 10
                        },
                        transition: {
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                        },
                        className: "w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl pointer-events-auto border border-gray-100 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 active:scale-95 transition-all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 20,
                                    strokeWidth: 2.5
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                    lineNumber: 105,
                                    columnNumber: 319
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                lineNumber: 105,
                                columnNumber: 140
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-10 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-8 flex justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                        size: 40,
                                                        strokeWidth: 1.5
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                        lineNumber: 105,
                                                        columnNumber: 560
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 463
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                    animate: {
                                                        scale: [
                                                            1,
                                                            1.2,
                                                            1
                                                        ],
                                                        rotate: [
                                                            0,
                                                            10,
                                                            -10,
                                                            0
                                                        ]
                                                    },
                                                    transition: {
                                                        duration: 3,
                                                        repeat: Infinity
                                                    },
                                                    className: "absolute -top-2 -right-2 bg-white p-2 rounded-xl shadow-lg text-blue-600",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                        size: 20
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 105
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 606
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                            lineNumber: 105,
                                            columnNumber: 437
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                        lineNumber: 105,
                                        columnNumber: 395
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-3xl font-bold text-gray-900 mb-4 tracking-[-0.02em]",
                                        children: "Install BeeZee App"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                        lineNumber: 111,
                                        columnNumber: 154
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-600 text-lg leading-relaxed mb-8",
                                        children: [
                                            "Get the full BeeZee experience on your device",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 111,
                                                columnNumber: 353
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-blue-600",
                                                children: "Install for faster access and offline features"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 111,
                                                columnNumber: 359
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                        lineNumber: 111,
                                        columnNumber: 250
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-3 gap-4 mb-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                            className: "w-6 h-6 text-blue-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 631
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 536
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-700 font-medium",
                                                        children: "Lightning Fast"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 678
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 111,
                                                columnNumber: 507
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                                                            className: "w-6 h-6 text-green-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 876
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 780
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-700 font-medium",
                                                        children: "Works Offline"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 925
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 111,
                                                columnNumber: 751
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                                            className: "w-6 h-6 text-purple-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 1123
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 1026
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-700 font-medium",
                                                        children: "Home Screen"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 1173
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 111,
                                                columnNumber: 997
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                        lineNumber: 111,
                                        columnNumber: 462
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleInstall,
                                                disabled: isInstalling,
                                                className: "w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                                                children: isInstalling ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                            animate: {
                                                                rotate: 360
                                                            },
                                                            transition: {
                                                                duration: 1,
                                                                repeat: Infinity,
                                                                ease: "linear"
                                                            },
                                                            className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 1588
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "Installing..."
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                            lineNumber: 117,
                                                            columnNumber: 121
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "INSTALL APP"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 111,
                                                columnNumber: 1276
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleSkip,
                                                className: "w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]",
                                                children: "SKIP, CONTINUE TO SIGNUP"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 117,
                                                columnNumber: 167
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleContinue,
                                                className: "w-full py-3 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm",
                                                children: "Continue without installing"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 117,
                                                columnNumber: 354
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                        lineNumber: 111,
                                        columnNumber: 1249
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-8 flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 117,
                                                columnNumber: 586
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-mono font-black text-gray-300 tracking-widest uppercase",
                                                children: "SECURE • FAST • RELIABLE"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                                lineNumber: 117,
                                                columnNumber: 656
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                        lineNumber: 117,
                                        columnNumber: 525
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                                lineNumber: 105,
                                columnNumber: 361
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                        lineNumber: 89,
                        columnNumber: 189
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
                    lineNumber: 89,
                    columnNumber: 93
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true);
        $[11] = canInstall;
        $[12] = handleContinue;
        $[13] = handleInstall;
        $[14] = handleSkip;
        $[15] = isInstalling;
        $[16] = isOpen;
        $[17] = onClose;
        $[18] = t4;
    } else {
        t4 = $[18];
    }
    let t5;
    if ($[19] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            children: t4
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx",
            lineNumber: 131,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[19] = t4;
        $[20] = t5;
    } else {
        t5 = $[20];
    }
    return t5;
};
_s(SignupPWAInstallModal, "nJQmBrBFpBMVs1m1bTcXXHrg/5o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$usePWAInstall$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePWAInstall"]
    ];
});
_c = SignupPWAInstallModal;
const __TURBOPACK__default__export__ = SignupPWAInstallModal;
var _c;
__turbopack_context__.k.register(_c, "SignupPWAInstallModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignupPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/building.js [app-client] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/lucide-react/dist/esm/icons/log-in.js [app-client] (ecmascript) <export default as LogIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$BusinessProfileContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/BusinessProfileContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$signup$2f$IndustrySectorStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/IndustrySectorStep.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$signup$2f$LiveAccountSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/LiveAccountSummary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$signup$2f$HybridDailyTarget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/HybridDailyTarget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$signup$2f$AccountSummaryPreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/signup/AccountSummaryPreview.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/data/industries.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/contexts/UnifiedAuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/hooks/useSignup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$auth$2f$PINSetup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/PINSetup.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$auth$2f$SignupPWAInstallModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/src/components/auth/SignupPWAInstallModal.tsx [app-client] (ecmascript)");
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
;
;
;
;
;
;
// Helper function to get flag emoji or fallback
const getFlagDisplay = (country)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl border-2 border-blue-500/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-5xl leading-none",
                role: "img",
                "aria-label": `${country.name} flag`,
                children: country.flag
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute bottom-1 right-1 text-xs font-bold text-blue-600 bg-white/80 px-1 rounded",
                children: country.code
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
        lineNumber: 32,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
// Country data with enhanced configuration
const countries = [
    {
        code: 'KE',
        name: 'Kenya',
        flag: '🇰🇪',
        flagAlt: 'KE'
    },
    {
        code: 'ZA',
        name: 'South Africa',
        flag: '🇿🇦',
        flagAlt: 'ZA'
    },
    {
        code: 'NG',
        name: 'Nigeria',
        flag: '🇳🇬',
        flagAlt: 'NG'
    },
    {
        code: 'GH',
        name: 'Ghana',
        flag: '🇬🇭',
        flagAlt: 'GH'
    },
    {
        code: 'UG',
        name: 'Uganda',
        flag: '🇺🇬',
        flagAlt: 'UG'
    },
    {
        code: 'RW',
        name: 'Rwanda',
        flag: '🇷🇼',
        flagAlt: 'RW'
    },
    {
        code: 'TZ',
        name: 'Tanzania',
        flag: '🇹🇿',
        flagAlt: 'TZ'
    }
];
function BeezeeSignupContent() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(40);
    if ($[0] !== "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26") {
        for(let $i = 0; $i < 40; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$BusinessProfileContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBusinessProfile"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"])();
    const signup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignup"])();
    const [showPWAInstallModal, setShowPWAInstallModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasSeenPWAInstallModal, setHasSeenPWAInstallModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ({
            "BeezeeSignupContent[useEffect()]": ()=>{
                const seenModal = localStorage.getItem("beezee_seen_pwa_install_modal");
                if (seenModal) {
                    setHasSeenPWAInstallModal(true);
                }
            }
        })["BeezeeSignupContent[useEffect()]"];
        t1 = [];
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    const { currentStep, formData, updateFormData, nextStep, prevStep, handlePINSetup, handleComplete } = signup;
    let t2;
    if ($[3] !== currentStep || $[4] !== hasSeenPWAInstallModal || $[5] !== nextStep) {
        t2 = ({
            "BeezeeSignupContent[handleNextStep]": ()=>{
                if (currentStep === 1 && !hasSeenPWAInstallModal) {
                    setShowPWAInstallModal(true);
                    localStorage.setItem("beezee_seen_pwa_install_modal", "true");
                    setHasSeenPWAInstallModal(true);
                } else {
                    nextStep();
                }
            }
        })["BeezeeSignupContent[handleNextStep]"];
        $[3] = currentStep;
        $[4] = hasSeenPWAInstallModal;
        $[5] = nextStep;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const handleNextStep = t2;
    let t3;
    if ($[7] !== nextStep) {
        t3 = ({
            "BeezeeSignupContent[handleContinueAfterPWA]": ()=>{
                setShowPWAInstallModal(false);
                nextStep();
            }
        })["BeezeeSignupContent[handleContinueAfterPWA]"];
        $[7] = nextStep;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    const handleContinueAfterPWA = t3;
    let t4;
    if ($[9] !== currentStep || $[10] !== formData || $[11] !== handleComplete || $[12] !== handleNextStep || $[13] !== handlePINSetup || $[14] !== nextStep || $[15] !== prevStep || $[16] !== signup.creationState || $[17] !== updateFormData) {
        t4 = ({
            "BeezeeSignupContent[renderStep]": ()=>{
                switch(currentStep){
                    case 1:
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WelcomeStep, {
                                onNext: handleNextStep
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                lineNumber: 163,
                                columnNumber: 22
                            }, this);
                        }
                    case 2:
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CountrySelection, {
                                selected: formData.country || "",
                                onSelect: {
                                    "BeezeeSignupContent[renderStep > <CountrySelection>.onSelect]": (country_0)=>updateFormData("country", country_0)
                                }["BeezeeSignupContent[renderStep > <CountrySelection>.onSelect]"],
                                onNext: nextStep,
                                onPrev: prevStep
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                lineNumber: 167,
                                columnNumber: 22
                            }, this);
                        }
                    case 3:
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IndustrySelection, {
                                selected: formData.industry || "",
                                onSelect: {
                                    "BeezeeSignupContent[renderStep > <IndustrySelection>.onSelect]": (industry_0)=>updateFormData("industry", industry_0)
                                }["BeezeeSignupContent[renderStep > <IndustrySelection>.onSelect]"],
                                onNext: nextStep,
                                onPrev: prevStep
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                lineNumber: 173,
                                columnNumber: 22
                            }, this);
                        }
                    case 4:
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$signup$2f$IndustrySectorStep$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IndustrySectorStep"], {
                                industry: formData.industry || "",
                                selectedSector: formData.industrySector || "",
                                onSelect: {
                                    "BeezeeSignupContent[renderStep > <IndustrySectorStep>.onSelect]": (sector)=>updateFormData("industrySector", sector)
                                }["BeezeeSignupContent[renderStep > <IndustrySectorStep>.onSelect]"],
                                onNext: nextStep,
                                onPrev: prevStep
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                lineNumber: 179,
                                columnNumber: 22
                            }, this);
                        }
                    case 5:
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BasicInfo, {
                                formData: formData,
                                onChange: updateFormData,
                                onNext: nextStep,
                                onPrev: prevStep
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                lineNumber: 185,
                                columnNumber: 22
                            }, this);
                        }
                    case 6:
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-12",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$auth$2f$PINSetup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    onPINComplete: handlePINSetup,
                                    onCancel: prevStep,
                                    isLoading: signup.creationState.loading,
                                    error: signup.creationState.error || undefined
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                    lineNumber: 189,
                                    columnNumber: 45
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                lineNumber: 189,
                                columnNumber: 22
                            }, this);
                        }
                    case 7:
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$signup$2f$HybridDailyTarget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HybridDailyTarget"], {
                                country: formData.country || "",
                                selectedTarget: formData.dailyTarget?.toString() || "",
                                onSelect: {
                                    "BeezeeSignupContent[renderStep > <HybridDailyTarget>.onSelect]": (target)=>updateFormData("dailyTarget", Number(target))
                                }["BeezeeSignupContent[renderStep > <HybridDailyTarget>.onSelect]"],
                                onNext: nextStep,
                                onPrev: prevStep
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                lineNumber: 193,
                                columnNumber: 22
                            }, this);
                        }
                    case 8:
                        {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$signup$2f$AccountSummaryPreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountSummaryPreview"], {
                                formData: formData,
                                onComplete: handleComplete,
                                onPrev: prevStep,
                                isLoading: signup.creationState.loading,
                                error: signup.creationState.error
                            }, void 0, false, {
                                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                                lineNumber: 199,
                                columnNumber: 22
                            }, this);
                        }
                    default:
                        {
                            return null;
                        }
                }
            }
        })["BeezeeSignupContent[renderStep]"];
        $[9] = currentStep;
        $[10] = formData;
        $[11] = handleComplete;
        $[12] = handleNextStep;
        $[13] = handlePINSetup;
        $[14] = nextStep;
        $[15] = prevStep;
        $[16] = signup.creationState;
        $[17] = updateFormData;
        $[18] = t4;
    } else {
        t4 = $[18];
    }
    const renderStep = t4;
    const t5 = currentStep >= 2 && currentStep <= 8;
    let t6;
    if ($[19] !== currentStep || $[20] !== formData || $[21] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$signup$2f$LiveAccountSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LiveAccountSummary"], {
            data: formData,
            currentStep: currentStep,
            isVisible: t5
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 225,
            columnNumber: 10
        }, this);
        $[19] = currentStep;
        $[20] = formData;
        $[21] = t5;
        $[22] = t6;
    } else {
        t6 = $[22];
    }
    let t10;
    let t7;
    let t8;
    let t9;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = {
            opacity: 0,
            x: 20
        };
        t8 = {
            opacity: 1,
            x: 0
        };
        t9 = {
            opacity: 0,
            x: -20
        };
        t10 = {
            duration: 0.3
        };
        $[23] = t10;
        $[24] = t7;
        $[25] = t8;
        $[26] = t9;
    } else {
        t10 = $[23];
        t7 = $[24];
        t8 = $[25];
        t9 = $[26];
    }
    let t11;
    if ($[27] !== renderStep) {
        t11 = renderStep();
        $[27] = renderStep;
        $[28] = t11;
    } else {
        t11 = $[28];
    }
    let t12;
    if ($[29] !== currentStep || $[30] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 container mx-auto px-6 py-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "wait",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: t7,
                    animate: t8,
                    exit: t9,
                    transition: t10,
                    className: "max-w-4xl mx-auto",
                    children: t11
                }, currentStep, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 273,
                    columnNumber: 92
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                lineNumber: 273,
                columnNumber: 63
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 273,
            columnNumber: 11
        }, this);
        $[29] = currentStep;
        $[30] = t11;
        $[31] = t12;
    } else {
        t12 = $[31];
    }
    let t13;
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = ({
            "BeezeeSignupContent[<SignupPWAInstallModal>.onClose]": ()=>setShowPWAInstallModal(false)
        })["BeezeeSignupContent[<SignupPWAInstallModal>.onClose]"];
        $[32] = t13;
    } else {
        t13 = $[32];
    }
    let t14;
    if ($[33] !== handleContinueAfterPWA || $[34] !== showPWAInstallModal) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$components$2f$auth$2f$SignupPWAInstallModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            isOpen: showPWAInstallModal,
            onClose: t13,
            onContinue: handleContinueAfterPWA
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 291,
            columnNumber: 11
        }, this);
        $[33] = handleContinueAfterPWA;
        $[34] = showPWAInstallModal;
        $[35] = t14;
    } else {
        t14 = $[35];
    }
    let t15;
    if ($[36] !== t12 || $[37] !== t14 || $[38] !== t6) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex flex-col",
            children: [
                t6,
                t12,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 300,
            columnNumber: 11
        }, this);
        $[36] = t12;
        $[37] = t14;
        $[38] = t6;
        $[39] = t15;
    } else {
        t15 = $[39];
    }
    return t15;
}
_s(BeezeeSignupContent, "Z4EP5p1nQja/FZ0yI91ynM8vttQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$BusinessProfileContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBusinessProfile"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$UnifiedAuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnifiedAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$hooks$2f$useSignup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignup"]
    ];
});
_c = BeezeeSignupContent;
// Welcome Step Component
function WelcomeStep(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26";
    }
    const { onNext } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-24 h-24 flex items-center justify-center mx-auto mb-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "/beezee-logo.png",
                alt: "BeeZee Logo",
                width: 96,
                height: 96,
                className: "h-24 w-auto"
            }, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                lineNumber: 325,
                columnNumber: 83
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 325,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    let t3;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = {
            opacity: 0,
            y: 20
        };
        t3 = {
            opacity: 1,
            y: 0
        };
        $[2] = t2;
        $[3] = t3;
    } else {
        t2 = $[2];
        t3 = $[3];
    }
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex flex-col justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: t2,
                animate: t3,
                className: "max-w-2xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold text-[var(--text-1)] mb-6 tracking-[-0.02em]",
                        children: "Get Started"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                        lineNumber: 349,
                        columnNumber: 131
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xl text-[var(--text-2)] mb-8 leading-relaxed",
                        children: "Join thousands of African entrepreneurs managing their business with ease."
                    }, void 0, false, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                        lineNumber: 349,
                        columnNumber: 227
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                lineNumber: 349,
                columnNumber: 63
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 349,
            columnNumber: 10
        }, this);
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    let t5;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 356,
            columnNumber: 10
        }, this);
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    let t6;
    if ($[6] !== onNext) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onNext,
            className: "bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-4 px-8 rounded-xl font-semibold hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all flex items-center justify-center gap-3",
            children: [
                "Sign Up",
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 363,
            columnNumber: 10
        }, this);
        $[6] = onNext;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    let t7;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/Beezee-App/auth/login",
            className: "bg-[var(--glass-bg)] border border-[var(--border)] text-[var(--text-1)] py-4 px-8 rounded-xl font-semibold hover:bg-[var(--border)] transition-all flex items-center justify-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogIn$3e$__["LogIn"], {
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 371,
                    columnNumber: 244
                }, this),
                "Login"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 371,
            columnNumber: 10
        }, this);
        $[8] = t7;
    } else {
        t7 = $[8];
    }
    let t8;
    if ($[9] !== t6) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-12 text-center min-h-screen flex flex-col",
            children: [
                t1,
                t4,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-4 justify-center",
                        children: [
                            t6,
                            t7
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                        lineNumber: 378,
                        columnNumber: 102
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 378,
                    columnNumber: 80
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 378,
            columnNumber: 10
        }, this);
        $[9] = t6;
        $[10] = t8;
    } else {
        t8 = $[10];
    }
    return t8;
}
_c1 = WelcomeStep;
// Country Selection Component
function CountrySelection(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(19);
    if ($[0] !== "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26") {
        for(let $i = 0; $i < 19; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26";
    }
    const { selected, onSelect, onNext, onPrev } = t0;
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-3xl font-bold text-[var(--text-1)] mb-4 text-center",
            children: "Select Your Country"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 405,
            columnNumber: 10
        }, this);
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[var(--text-2)] text-center mb-8",
            children: "Choose where your business operates"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 406,
            columnNumber: 10
        }, this);
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    let t3;
    if ($[3] !== onSelect || $[4] !== selected) {
        t3 = countries.map({
            "CountrySelection[countries.map()]": (country)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "CountrySelection[countries.map() > <button>.onClick]": ()=>onSelect(country.code)
                    }["CountrySelection[countries.map() > <button>.onClick]"],
                    className: `p-4 rounded-xl border-2 transition-all ${selected === country.code ? "border-[var(--powder-dark)] bg-[var(--powder-light)]" : "border-[var(--border)] hover:border-[var(--powder-mid)]"}`,
                    children: [
                        getFlagDisplay(country),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 text-sm font-medium text-[var(--text-1)]",
                            children: country.name
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                            lineNumber: 418,
                            columnNumber: 290
                        }, this)
                    ]
                }, country.code, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 416,
                    columnNumber: 55
                }, this)
        }["CountrySelection[countries.map()]"]);
        $[3] = onSelect;
        $[4] = selected;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8",
            children: t3
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 428,
            columnNumber: 10
        }, this);
        $[6] = t3;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== onPrev) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onPrev,
            className: "flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all",
            children: "Back"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 436,
            columnNumber: 10
        }, this);
        $[8] = onPrev;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    const t6 = !selected;
    let t7;
    if ($[10] !== onNext || $[11] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onNext,
            disabled: t6,
            className: "flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            children: "Next"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 445,
            columnNumber: 10
        }, this);
        $[10] = onNext;
        $[11] = t6;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== t5 || $[14] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4",
            children: [
                t5,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 454,
            columnNumber: 10
        }, this);
        $[13] = t5;
        $[14] = t7;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    let t9;
    if ($[16] !== t4 || $[17] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-12",
            children: [
                t1,
                t2,
                t4,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 463,
            columnNumber: 10
        }, this);
        $[16] = t4;
        $[17] = t8;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    return t9;
}
_c2 = CountrySelection;
// Industry Selection Component
function IndustrySelection(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(19);
    if ($[0] !== "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26") {
        for(let $i = 0; $i < 19; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26";
    }
    const { selected, onSelect, onNext, onPrev } = t0;
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-3xl font-bold text-[var(--text-1)] mb-4 text-center",
            children: "Choose Your Industry"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 491,
            columnNumber: 10
        }, this);
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[var(--text-2)] text-center mb-8",
            children: "Select the category that best describes your business"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 492,
            columnNumber: 10
        }, this);
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    let t3;
    if ($[3] !== onSelect || $[4] !== selected) {
        t3 = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$data$2f$industries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["industries"].map({
            "IndustrySelection[industries.map()]": (industry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "IndustrySelection[industries.map() > <button>.onClick]": ()=>onSelect(industry.id)
                    }["IndustrySelection[industries.map() > <button>.onClick]"],
                    className: `p-6 rounded-xl border-2 transition-all text-left ${selected === industry.id ? "border-[var(--powder-dark)] bg-[var(--powder-light)]" : "border-[var(--border)] hover:border-[var(--powder-mid)]"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-2xl mb-2",
                            children: industry.icon
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                            lineNumber: 504,
                            columnNumber: 276
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "font-semibold text-[var(--text-1)] mb-1",
                            children: industry.name
                        }, void 0, false, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                            lineNumber: 504,
                            columnNumber: 328
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-[var(--text-3)]",
                            children: [
                                "Manage your ",
                                industry.name.toLowerCase(),
                                " business efficiently"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                            lineNumber: 504,
                            columnNumber: 406
                        }, this)
                    ]
                }, industry.id, true, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 502,
                    columnNumber: 58
                }, this)
        }["IndustrySelection[industries.map()]"]);
        $[3] = onSelect;
        $[4] = selected;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8",
            children: t3
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 514,
            columnNumber: 10
        }, this);
        $[6] = t3;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== onPrev) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onPrev,
            className: "flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all",
            children: "Back"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 522,
            columnNumber: 10
        }, this);
        $[8] = onPrev;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    const t6 = !selected;
    let t7;
    if ($[10] !== onNext || $[11] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onNext,
            disabled: t6,
            className: "flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            children: "Next"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 531,
            columnNumber: 10
        }, this);
        $[10] = onNext;
        $[11] = t6;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== t5 || $[14] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4",
            children: [
                t5,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 540,
            columnNumber: 10
        }, this);
        $[13] = t5;
        $[14] = t7;
        $[15] = t8;
    } else {
        t8 = $[15];
    }
    let t9;
    if ($[16] !== t4 || $[17] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-12",
            children: [
                t1,
                t2,
                t4,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 549,
            columnNumber: 10
        }, this);
        $[16] = t4;
        $[17] = t8;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    return t9;
}
_c3 = IndustrySelection;
// Basic Info Component
function BasicInfo(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(43);
    if ($[0] !== "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26") {
        for(let $i = 0; $i < 43; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26";
    }
    const { formData, onChange, onNext, onPrev } = t0;
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-3xl font-bold text-[var(--text-1)] mb-4 text-center",
            children: "Tell us about yourself"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 577,
            columnNumber: 10
        }, this);
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[var(--text-2)] text-center mb-8",
            children: "Basic information to set up your account"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 578,
            columnNumber: 10
        }, this);
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 587,
                    columnNumber: 99
                }, this),
                "Your name"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 587,
            columnNumber: 10
        }, this);
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const t4 = formData.name || "";
    let t5;
    if ($[4] !== onChange) {
        t5 = ({
            "BasicInfo[<input>.onChange]": (e)=>onChange("name", e.target.value)
        })["BasicInfo[<input>.onChange]"];
        $[4] = onChange;
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    let t6;
    if ($[6] !== t4 || $[7] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t3,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: t4,
                    onChange: t5,
                    className: "w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]",
                    placeholder: "John Doe"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 605,
                    columnNumber: 19
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 605,
            columnNumber: 10
        }, this);
        $[6] = t4;
        $[7] = t5;
        $[8] = t6;
    } else {
        t6 = $[8];
    }
    let t7;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 614,
                    columnNumber: 99
                }, this),
                "Business name (optional)"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 614,
            columnNumber: 10
        }, this);
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    const t8 = formData.businessName || "";
    let t9;
    if ($[10] !== onChange) {
        t9 = ({
            "BasicInfo[<input>.onChange]": (e_0)=>onChange("businessName", e_0.target.value)
        })["BasicInfo[<input>.onChange]"];
        $[10] = onChange;
        $[11] = t9;
    } else {
        t9 = $[11];
    }
    let t10;
    if ($[12] !== t8 || $[13] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: t8,
                    onChange: t9,
                    className: "w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]",
                    placeholder: "Acme Corporation"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 632,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 632,
            columnNumber: 11
        }, this);
        $[12] = t8;
        $[13] = t9;
        $[14] = t10;
    } else {
        t10 = $[14];
    }
    let t11;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 641,
                    columnNumber: 100
                }, this),
                "Phone number"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 641,
            columnNumber: 11
        }, this);
        $[15] = t11;
    } else {
        t11 = $[15];
    }
    const t12 = formData.phoneNumber || "";
    let t13;
    if ($[16] !== onChange) {
        t13 = ({
            "BasicInfo[<input>.onChange]": (e_1)=>onChange("phoneNumber", e_1.target.value)
        })["BasicInfo[<input>.onChange]"];
        $[16] = onChange;
        $[17] = t13;
    } else {
        t13 = $[17];
    }
    let t14;
    if ($[18] !== t12 || $[19] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t11,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "tel",
                    value: t12,
                    onChange: t13,
                    className: "w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]",
                    placeholder: "+254 700 000 000"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 659,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 659,
            columnNumber: 11
        }, this);
        $[18] = t12;
        $[19] = t13;
        $[20] = t14;
    } else {
        t14 = $[20];
    }
    let t15;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 668,
                    columnNumber: 100
                }, this),
                "Invite code (optional)"
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 668,
            columnNumber: 11
        }, this);
        $[21] = t15;
    } else {
        t15 = $[21];
    }
    const t16 = formData.inviteCode || "";
    let t17;
    if ($[22] !== onChange) {
        t17 = ({
            "BasicInfo[<input>.onChange]": (e_2)=>onChange("inviteCode", e_2.target.value)
        })["BasicInfo[<input>.onChange]"];
        $[22] = onChange;
        $[23] = t17;
    } else {
        t17 = $[23];
    }
    let t18;
    if ($[24] !== t16 || $[25] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t15,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: t16,
                    onChange: t17,
                    className: "w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]",
                    placeholder: "Enter invite code if you have one"
                }, void 0, false, {
                    fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                    lineNumber: 686,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 686,
            columnNumber: 11
        }, this);
        $[24] = t16;
        $[25] = t17;
        $[26] = t18;
    } else {
        t18 = $[26];
    }
    let t19;
    if ($[27] !== t10 || $[28] !== t14 || $[29] !== t18 || $[30] !== t6) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6 mb-8",
            children: [
                t6,
                t10,
                t14,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 695,
            columnNumber: 11
        }, this);
        $[27] = t10;
        $[28] = t14;
        $[29] = t18;
        $[30] = t6;
        $[31] = t19;
    } else {
        t19 = $[31];
    }
    let t20;
    if ($[32] !== onPrev) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onPrev,
            className: "flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all",
            children: "Back"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 706,
            columnNumber: 11
        }, this);
        $[32] = onPrev;
        $[33] = t20;
    } else {
        t20 = $[33];
    }
    const t21 = !formData.name || !formData.phoneNumber;
    let t22;
    if ($[34] !== onNext || $[35] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onNext,
            disabled: t21,
            className: "flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            children: "Next"
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 715,
            columnNumber: 11
        }, this);
        $[34] = onNext;
        $[35] = t21;
        $[36] = t22;
    } else {
        t22 = $[36];
    }
    let t23;
    if ($[37] !== t20 || $[38] !== t22) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4",
            children: [
                t20,
                t22
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 724,
            columnNumber: 11
        }, this);
        $[37] = t20;
        $[38] = t22;
        $[39] = t23;
    } else {
        t23 = $[39];
    }
    let t24;
    if ($[40] !== t19 || $[41] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-12",
            children: [
                t1,
                t2,
                t19,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 733,
            columnNumber: 11
        }, this);
        $[40] = t19;
        $[41] = t23;
        $[42] = t24;
    } else {
        t24 = $[42];
    }
    return t24;
}
_c4 = BasicInfo;
function SignupPage() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "95b8d950a170702d47e96575d970c916e49c235a5506a9c2248e6a8a1c92ba26";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$src$2f$contexts$2f$BusinessProfileContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BusinessProfileProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BeezeeSignupContent, {}, void 0, false, {
                fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
                lineNumber: 752,
                columnNumber: 35
            }, this)
        }, void 0, false, {
            fileName: "[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/Beezee-App/auth/signup/page.tsx",
            lineNumber: 752,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c5 = SignupPage;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "BeezeeSignupContent");
__turbopack_context__.k.register(_c1, "WelcomeStep");
__turbopack_context__.k.register(_c2, "CountrySelection");
__turbopack_context__.k.register(_c3, "IndustrySelection");
__turbopack_context__.k.register(_c4, "BasicInfo");
__turbopack_context__.k.register(_c5, "SignupPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_src_ea2b88a3._.js.map