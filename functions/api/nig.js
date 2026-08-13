// functions/api/api.js

export async function onRequestGet(context) {
    const { request } = context;
    const url = new URL(request.url);

    const overviewId = url.searchParams.get("overview");
    const contentId = url.searchParams.get("content");
    const folderId = url.searchParams.get("folder") || "0";
    const testInstructionsId = url.searchParams.get("test_instructions");
    const testDataId = url.searchParams.get("test_data");
    const testResultId = url.searchParams.get("test_result");
    const attemptMode = url.searchParams.get("attempt_mode") || "live";

    let authToken = request.headers.get("Authorization");

    // iOS Aggressive Cache ko rokne ke liye Headers
    const responseHeaders = {
        "Content-Type": "application/json", 
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    };

    if (!authToken || authToken.trim() === "Bearer null") {
        authToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0NzE5ODgsImFwcF9pZCI6IjE3NzA5ODEzNDciLCJkZXZpY2VfaWQiOiI2Y2ZhZDI2Zi00NjE5LTRjOTAtOWRjOS0zN2U2MTZiYzNlN2IiLCJwbGF0Zm9ybSI6IjMiLCJ1c2VyX3R5cGUiOjEsImlhdCI6MTc4NDk3MTEwNywiZXhwIjoxNzg3NTYzMTA3fQ.3WxRLkxbJx_F3no34NmAUyBLvJu7A5CUB6m91h39-2M";
    }

    const apiHeaders = {
        "accept": "application/json, text/plain, */*",
        "app_id": "1770981347",
        "authorization": authToken,
        "content-type": "application/json",
        "platform": "3",
        "user_id": "0",
        "version": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
    };

    try {
        let response;
        
        if (overviewId) {
            response = await fetch("https://course.nexttoppers.com/course/course-details", {
                method: "POST", headers: apiHeaders, body: JSON.stringify({ course_id: overviewId, parent_id: "0" })
            });
        } else if (contentId) {
            response = await fetch("https://course.nexttoppers.com/course/all-content", {
                method: "POST", headers: apiHeaders, body: JSON.stringify({ course_id: contentId, folder_id: folderId, page: "1", limit: "1000", keyword: "", parent_course_id: "0" })
            });
        } else if (testInstructionsId) {
            if (authToken.includes("3WxRLkxbJx_F3no34NmAUyBLvJu7A5CUB6m91h39-2M")) { 
               return new Response(JSON.stringify({ success: false, responseCode: 401, message: "Please Login to access Test", data: {} }), { status: 401, headers: responseHeaders });
            }
            response = await fetch(`https://test.nexttoppers.com/test/get-test-instructions?test_id=${testInstructionsId}&attempt_mode=${attemptMode}`, {
                method: "GET", headers: apiHeaders
            });
        } else if (testDataId) {
             if (authToken.includes("3WxRLkxbJx_F3no34NmAUyBLvJu7A5CUB6m91h39-2M")) { 
               return new Response(JSON.stringify({ success: false, responseCode: 401, message: "Please Login to access Test", data: {} }), { status: 401, headers: responseHeaders });
            }
            response = await fetch(`https://test.nexttoppers.com/test/get-test-data?test_id=${testDataId}&attempt_mode=${attemptMode}`, {
                method: "GET", headers: apiHeaders
            });
        } else if (testResultId) {
             if (authToken.includes("3WxRLkxbJx_F3no34NmAUyBLvJu7A5CUB6m91h39-2M")) { 
               return new Response(JSON.stringify({ success: false, responseCode: 401, message: "Please Login to access Test", data: {} }), { status: 401, headers: responseHeaders });
            }
            response = await fetch(`https://test.nexttoppers.com/test/result?test_id=${testResultId}`, {
                method: "GET", headers: apiHeaders
            });
        } else {
            return new Response(JSON.stringify({ success: false, error: "Invalid GET Request Format" }), { status: 400, headers: responseHeaders });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { headers: responseHeaders });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error", details: error.message }), { status: 500, headers: responseHeaders });
    }
}

export async function onRequestPost(context) {
    const { request } = context;
    const url = new URL(request.url);
    const corsHeaders = { 
        "Access-Control-Allow-Origin": "*", 
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate"
    };

    if (url.searchParams.get("submit") === "true") {
        const authToken = request.headers.get("Authorization");

        if (!authToken || authToken === "Bearer null") {
            return new Response(JSON.stringify({ success: false, responseCode: 401, message: "Unauthorized", data: {} }), { status: 401, headers: corsHeaders });
        }

        const apiHeaders = {
            "accept": "application/json, text/plain, */*",
            "app_id": "1770981347",
            "authorization": authToken,
            "content-type": "application/json",
            "platform": "3",
            "user_id": "0", 
            "version": "1"
        };

        try {
            const body = await request.text(); 
            const response = await fetch("https://test.nexttoppers.com/test/submit", {
                method: "POST", headers: apiHeaders, body: body
            });
            const data = await response.json();
            return new Response(JSON.stringify(data), { headers: corsHeaders });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: "Submit Failed" }), { status: 500, headers: corsHeaders });
        }
    }

    try {
        const body = await request.json();
        const { action, ...payload } = body; 
        const AUTH_API_URL = "https://chutapi.smexfot.workers.dev";
        let targetUrl = "";

        if (action === "check_user") {
            targetUrl = `${AUTH_API_URL}/api/check-user`;
        } else if (action === "verify_otp") {
            targetUrl = `${AUTH_API_URL}/api/verify-otp`;
        } else {
            return new Response(JSON.stringify({ success: false, error: "Unknown Security Action" }), { status: 400, headers: corsHeaders });
        }

        const response = await fetch(targetUrl, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), { headers: corsHeaders });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500, headers: corsHeaders });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization", 
        }
    });
}
