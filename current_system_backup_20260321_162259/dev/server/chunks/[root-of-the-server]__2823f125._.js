module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Downloads/WebApp/WebApp-main/modern-website/src/app/api/auth/signup/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$bcrypt$29$__ = __turbopack_context__.i("[externals]/bcrypt [external] (bcrypt, cjs, [project]/Downloads/WebApp/WebApp-main/modern-website/node_modules/bcrypt)");
;
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://zruprmhkcqhgzydjfhrk.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// Server-side admin client that bypasses RLS
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false
    }
});
async function POST(request) {
    try {
        const userData = await request.json();
        console.log('🔧 [API] Creating business in database with PIN:', userData);
        // Validate required fields
        if (!userData.phoneNumber || !userData.name || !userData.country || !userData.industry) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                existingUser: false,
                error: 'Missing required fields: phone, name, country, industry',
                data: null
            }, {
                status: 400
            });
        }
        // Validate PIN
        if (!userData.pin || userData.pin.length !== 6 || !/^\d{6}$/.test(userData.pin)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                existingUser: false,
                error: 'Invalid PIN. PIN must be exactly 6 digits.',
                data: null
            }, {
                status: 400
            });
        }
        // Hash the PIN with bcrypt
        const saltRounds = 12;
        let pinHash;
        try {
            console.log('🔐 Hashing PIN:', {
                pinLength: userData.pin.length,
                saltRounds,
                pinValue: userData.pin ? '***' : 'none'
            });
            pinHash = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$bcrypt$29$__["default"].hash(userData.pin, saltRounds);
            console.log('✅ PIN hashed successfully:', {
                hashLength: pinHash.length,
                hashPrefix: pinHash.substring(0, 7) + '...'
            });
        } catch (hashError) {
            console.error('❌ Error hashing PIN:', hashError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                existingUser: false,
                error: 'Failed to secure PIN',
                data: null
            }, {
                status: 500
            });
        }
        // Prepare business data for database insertion
        const businessData = {
            phone_number: userData.phoneNumber,
            business_name: userData.businessName || `${userData.name}'s Business`,
            country: userData.country.toUpperCase(),
            industry: userData.industry,
            settings: {
                currency: userData.currency,
                daily_target: userData.dailyTarget,
                invite_code: userData.inviteCode,
                user_name: userData.name,
                industry_sector: userData.industrySector
            },
            home_currency: userData.currency,
            pin_hash: pinHash,
            is_active: true
        };
        console.log('📝 [API] Inserting business data with hashed PIN');
        // Insert business into database (bypasses RLS with service role)
        const { data: business, error } = await supabaseAdmin.from('businesses').insert(businessData).select().single();
        if (error) {
            console.error('❌ [API] Database error:', error);
            // Check for unique constraint violation (phone already exists)
            if (error.code === '23505') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    existingUser: true,
                    error: 'A business with this phone number already exists',
                    data: null
                }, {
                    status: 409
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                existingUser: false,
                error: error.message || 'Failed to create business',
                data: null
            }, {
                status: 500
            });
        }
        console.log('✅ [API] Business created successfully with PIN hash:', {
            id: business.id,
            business_name: business.business_name,
            country: business.country,
            industry: business.industry,
            home_currency: business.home_currency
        });
        // Remove PIN hash from response for security
        const { pin_hash: _, ...businessResponse } = business;
        // Create session data for immediate authentication
        const sessionData = {
            businessId: business.id,
            businessName: business.business_name,
            country: business.country,
            industry: business.industry,
            phone: business.phone_number,
            timestamp: Date.now()
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            existingUser: false,
            error: null,
            data: {
                business: businessResponse,
                session: sessionData
            }
        });
    } catch (err) {
        console.error('💥 [API] Unexpected error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$WebApp$2f$WebApp$2d$main$2f$modern$2d$website$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            existingUser: false,
            error: err instanceof Error ? err.message : 'Unexpected error occurred',
            data: null
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2823f125._.js.map