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
"[project]/Desktop/space style/src/app/api/images/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$space__style$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/space style/node_modules/next/server.js [app-route] (ecmascript)");
;
const styleSearchTerms = {
    '미드센추리 모던': 'mid century modern interior',
    'Mid-Century Modern': 'mid century modern interior',
    '스칸디나비안': 'scandinavian interior design',
    'Scandinavian': 'scandinavian interior design',
    '인더스트리얼': 'industrial loft interior',
    'Industrial': 'industrial loft interior',
    '미니멀리즘': 'minimalist interior design',
    'Minimalism': 'minimalist interior design',
    '보헤미안': 'bohemian interior decor',
    'Bohemian': 'bohemian interior decor',
    '내추럴': 'natural interior design',
    'Natural': 'natural interior design'
};
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const style = searchParams.get('style');
        if (!style) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$space__style$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            images: []
        });
        const accessKey = process.env.UNSPLASH_ACCESS_KEY;
        if (!accessKey) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$space__style$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            images: []
        });
        const searchQuery = styleSearchTerms[style] || `${style} interior design`;
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=4&orientation=landscape`, {
            headers: {
                Authorization: `Client-ID ${accessKey}`
            }
        });
        if (!response.ok) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$space__style$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            images: []
        });
        const data = await response.json();
        const images = data.results.map((photo)=>({
                id: photo.id,
                url: photo.urls.regular,
                thumb: photo.urls.thumb,
                alt: photo.alt_description || `${style} interior`,
                credit: {
                    name: photo.user.name,
                    link: photo.user.links.html
                }
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$space__style$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            images
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$space__style$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            images: []
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__34842bd3._.js.map