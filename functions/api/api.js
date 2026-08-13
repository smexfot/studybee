// functions/api/api.js

export async function onRequestGet(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Frontend se aane wale parameters
    const overviewId = url.searchParams.get("overview");
    const contentId = url.searchParams.get("content");
    const folderId = url.searchParams.get("folder");
    const fetchMediaId = url.searchParams.get("fetch_media");
    const courseIdReq = url.searchParams.get("course_id"); // Media aur Live dono ke kaam aayega
    
    // NAYA: Live classes fetch karne ke parameters
    const action = url.searchParams.get("action");
    const type = url.searchParams.get("type");

    let targetUrl = "";

    // 🔒 Routing Logic (Saare original workers yahan hide hain)
    if (overviewId) {
        targetUrl = `https://contentnt.iownprince5.workers.dev/?overview=${overviewId}`;
    } else if (contentId) {
        targetUrl = `https://contentnt.iownprince5.workers.dev/?content=${contentId}&folder=${folderId || "0"}`;
    } else if (fetchMediaId) {
        targetUrl = `https://not.iownprince5.workers.dev/?content_id=${fetchMediaId}&course_id=${courseIdReq}`;
    } else if (action === "classes") {
        // NAYA: Live classes data fetch karne ka secure route
        targetUrl = `https://not.iownprince5.workers.dev/?action=${action}&type=${type}&course_id=${courseIdReq}`;
    } else {
        return new Response(JSON.stringify({ success: false, error: "Invalid GET Request Format" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const response = await fetch(targetUrl, { method: "GET" });
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                "X-Content-Type-Options": "nosniff",
                "Access-Control-Allow-Origin": "*", 
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
    }
}

export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { action, ...payload } = body; 

        // 🔒 AUTH API HIDE KI GAYI HAI
        const AUTH_API_URL = "https://chutapi.smexfot.workers.dev";
        let targetUrl = "";

        if (action === "check_user") {
            targetUrl = `${AUTH_API_URL}/api/check-user`;
        } else if (action === "verify_otp") {
            targetUrl = `${AUTH_API_URL}/api/verify-otp`;
        } else {
            return new Response(JSON.stringify({ success: false, error: "Unknown Security Action" }), { 
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                "X-Content-Type-Options": "nosniff",
                "Access-Control-Allow-Origin": "*",
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { 
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
}
