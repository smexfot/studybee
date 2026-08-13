// ════════════════════════════════════════════════════════════════════════
//  StudyPanda / JituVault — Central Worker (Pages / Vercel Compatible)
//  Saare PW (PhysicsWallah) API calls is worker se hote hain.
// ════════════════════════════════════════════════════════════════════════

// ─── CHANGE YAHAN KARO (token expire hone par bas ye update karo) ─────────
const PW_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODYxOTgyNDgsImV4cCI6MTc4NjgwMzA0OC45LCJkYXRhIjp7Il9pZCI6IjY3ZWRhZDEzM2QyYjI5ZDgyYTNkOTNlOSIsInVzZXJuYW1lIjoiOTU0ODc1OTk4NyIsImZpcnN0TmFtZSI6IlNtZXgiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwib25lUm9sZXMiOltdLCJ0eXBlIjoiVVNFUiJ9LCJqdGkiOiIyc0J0cjd2QlFEZU9LaDJaM3BoM2tRXzY3ZWRhZDEzM2QyYjI5ZDgyYTNkOTNlOSJ9._O31_H7-zBlnlbaLeHliQfijJ19sODcU1wYcUGV8BD8";

// ─── PW API base + static device headers
const PW_BASE = "https://api.penpencil.co";
const PW_STATIC_HEADERS = {
    "Accept-Encoding": "gzip",
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 11; SM-A707F Build/RP1A.200720.012)",
    "client-id": "ADMIN",
    "client-type": "MOBILE",
    "client-version": "538",
    "content-type": "application/json",
    "device-meta": JSON.stringify({
        APP_VERSION: "538",
        APP_VERSION_NAME: "15.32.0",
        DEVICE_MAKE: "Samsung",
        DEVICE_MODEL: "SM-A707F",
        OS_VERSION: "11",
        PACKAGE_NAME: "xyz.penpencil.physicswala",
        network: "wifi_data",
        carrier: "UNDEFINED",
    }),
    "referer": "https://android.pw.live",
};

const BATCHES_JSON_URL = "https://rarestudy.github.io/rarestudy/batches.json";
const CACHE_TTL_SECONDS = 60 * 60; // 1 hour

function generateRandomId() {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function pwHeaders() {
    return {
        ...PW_STATIC_HEADERS,
        authorization: `Bearer ${PW_TOKEN}`,
        randomid: generateRandomId(),
    };
}

const ALLOWED_ORIGINS = [
    "https://studybeepro.site",
    "https://studypanda.in"
];

function getCorsHeaders(request) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    return {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin" 
    };
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "content-type": "application/json", ...extraHeaders },
    });
}

async function fetchPW(path) {
    const res = await fetch(`${PW_BASE}${path}`, { headers: pwHeaders() });
    const data = await res.json().catch(() => ({ success: false, error: "Invalid PW response" }));
    return { ok: res.ok, status: res.status, data };
}

// Memory cache object map for Serverless fallback 
const memoryCache = new Map();

async function withCache(request, cacheable, handler) {
    const cacheKey = request.url;

    // 1. Serve from cache if valid (Create a fresh Response object from string)
    if (cacheable && memoryCache.has(cacheKey)) {
        const cachedItem = memoryCache.get(cacheKey);
        if (Date.now() < cachedItem.expiry) {
            return new Response(cachedItem.bodyText, {
                status: cachedItem.status,
                headers: cachedItem.headers
            });
        } else {
            memoryCache.delete(cacheKey);
        }
    }

    // 2. Fetch fresh data if not in cache
    const response = await handler();

    // 3. Save to cache as raw string, NOT as a Response object stream
    if (cacheable && response.status === 200) {
        const clone = response.clone();
        const bodyText = await clone.text(); // Read stream immediately
        
        // Extract headers into a simple object
        const headersObj = {};
        clone.headers.forEach((val, key) => {
            headersObj[key] = val;
        });

        memoryCache.set(cacheKey, {
            bodyText: bodyText,
            status: clone.status,
            headers: headersObj,
            expiry: Date.now() + (CACHE_TTL_SECONDS * 1000)
        });
    }

    return response;
}

const routes = [
    {
        method: "GET",
        pattern: /^\/api\/batches$/,
        cacheable: true,
        handler: async () => {
            const res = await fetch(BATCHES_JSON_URL);
            const data = await res.json().catch(() => []);
            return jsonResponse(data);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/batch\/([^/]+)\/details$/,
        cacheable: true,
        handler: async (m) => {
            const [batchId] = m;
            const { ok, status, data } = await fetchPW(`/v3/batches/${batchId}/details`);
            return jsonResponse(data, ok ? 200 : status);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/batch\/([^/]+)\/subject\/([^/]+)\/topics$/,
        cacheable: true,
        handler: async (m, url) => {
            const [batchId, subjectId] = m;
            const page = url.searchParams.get("page") || "1";
            const { ok, status, data } = await fetchPW(
                `/v2/batches/${batchId}/subject/${subjectId}/topics?page=${page}`
            );
            return jsonResponse(data, ok ? 200 : status);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/batch\/([^/]+)\/subject\/([^/]+)\/contents$/,
        cacheable: true,
        handler: async (m, url) => {
            const [batchId, subjectSlug] = m;
            const tag = url.searchParams.get("tag") || "";
            const contentType = url.searchParams.get("contentType") || "";
            const page = url.searchParams.get("page") || "1";
            const { ok, status, data } = await fetchPW(
                `/v2/batches/${batchId}/subject/${subjectSlug}/contents?tag=${encodeURIComponent(tag)}&contentType=${encodeURIComponent(contentType)}&page=${page}`
            );
            return jsonResponse(data, ok ? 200 : status);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/batch\/([^/]+)\/subject\/([^/]+)\/schedule\/([^/]+)$/,
        cacheable: true,
        handler: async (m) => {
            const [batchId, subjectId, scheduleId] = m;
            const { ok, status, data } = await fetchPW(
                `/v1/batches/${batchId}/subject/${subjectId}/schedule/${scheduleId}/schedule-details`
            );
            return jsonResponse(data, ok ? 200 : status);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/batch\/([^/]+)\/live$/,
        cacheable: false,
        handler: async (m) => {
            const [batchId] = m;
            const { ok, status, data } = await fetchPW(`/v2/batches/${batchId}/todays-schedule`);
            return jsonResponse(data, ok ? 200 : status);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/batch\/([^/]+)\/announcements$/,
        cacheable: true,
        handler: async (m, url) => {
            const [batchId] = m;
            const page = url.searchParams.get("page") || "1";
            const { ok, status, data } = await fetchPW(`/v1/batches/${batchId}/announcement?page=${page}`);
            return jsonResponse(data, ok ? 200 : status);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/batch\/([^/]+)\/test-filters$/,
        cacheable: true,
        handler: async (m) => {
            const [batchId] = m;
            const { ok, status, data } = await fetchPW(
                `/v3/test-service/tests/filters?batchId=${batchId}&isSubjective=false&isPurchased=false`
            );
            return jsonResponse(data, ok ? 200 : status);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/batch\/([^/]+)\/tests$/,
        cacheable: false,
        handler: async (m, url) => {
            const [batchId] = m;
            const categoryId = url.searchParams.get("categoryId") || "";
            const categorySectionId = url.searchParams.get("categorySectionId") || "";
            const { ok, status, data } = await fetchPW(
                `/v3/test-service/tests?testType=All&testStatus=All&attemptStatus=All&batchId=${batchId}&isSubjective=false&categoryId=${categoryId}&categorySectionId=${categorySectionId}&isPurchased=true`
            );
            return jsonResponse(data, ok ? 200 : status);
        },
    },
    {
        method: "GET",
        pattern: /^\/api\/test\/([^/]+)\/syllabus$/,
        cacheable: true,
        handler: async (m) => {
            const [testId] = m;
            const { ok, status, data } = await fetchPW(`/v3/test-service/tests/${testId}/instructions`);
            return jsonResponse(data, ok ? 200 : status);
        },
    },
];

// --- Serverless Export Methods ---

export async function onRequestOptions(context) {
    const corsHeaders = getCorsHeaders(context.request);
    return new Response(null, { headers: corsHeaders });
}

export async function onRequest(context) {
    const { request } = context;
    const corsHeaders = getCorsHeaders(request);
    const url = new URL(request.url);
    
    let response;
    let routeFound = false;

    let activePath = url.pathname;
    
    // Fallback normalizer in case of nested functions deployment
    if (activePath.includes('.js')) {
        activePath = activePath.split('.js')[0];
    }

    for (const route of routes) {
        if (request.method !== route.method) continue;
        
        const match = activePath.match(route.pattern);
        if (!match) continue;

        routeFound = true;
        const params = match.slice(1);
        try {
            response = await withCache(request, route.cacheable, () => route.handler(params, url));
        } catch (err) {
            response = jsonResponse({ success: false, error: err.message || "Worker error" }, 500);
        }
        break;
    }

    if (!routeFound) {
        response = jsonResponse({ success: false, error: "Route not found" }, 404);
    }

    const finalResponse = new Response(response.body, response);
    Object.entries(corsHeaders).forEach(([key, value]) => {
        finalResponse.headers.set(key, value);
    });

    return finalResponse;
}
