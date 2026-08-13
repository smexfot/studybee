export async function onRequestGet(context) {
    const { request } = context;
    const url = new URL(request.url);

    // 1. Allowed Origins List
    const allowedOrigins = [
        "https://studybeepro.site",
        "https://learnbyakp.online",
        "https://studybeeclone.pages.dev"
    ];

    const origin = request.headers.get("Origin");
    const corsOrigin = allowedOrigins.includes(origin) ? origin : "*"; // Fallback to * if testing locally

    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // 2. Extract Query Parameters
    const contentId = url.searchParams.get('content_id') || '17513';
    const courseId = url.searchParams.get('course_id') || '1';
    const action = url.searchParams.get('action'); 
    const classType = url.searchParams.get('type') || '1'; 

    // 3. Tokens Setup
    const defaultToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0NzE5ODgsImFwcF9pZCI6IjE3NzA5ODEzNDciLCJkZXZpY2VfaWQiOiI2Y2ZhZDI2Zi00NjE5LTRjOTAtOWRjOS0zN2U2MTZiYzNlN2IiLCJwbGF0Zm9ybSI6IjMiLCJ1c2VyX3R5cGUiOjEsImlhdCI6MTc4NDk3MTEwNywiZXhwIjoxNzg3NTYzMTA3fQ.3WxRLkxbJx_F3no34NmAUyBLvJu7A5CUB6m91h39-2M";

    const courseTokens = {
        "62": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDI3NTQ3LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiZTljOTBlNWUtNDU0Yy00NGY3LWE5YzItYzU1NDExZDIwOTc0IiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODQ4NzUxODksImV4cCI6MTc4NzQ2NzE4OX0.RcgWOPC92YiSC5Azy32MUapOexaKwq9NSA6Jz5vXJIE",
        "101": defaultToken,
        "102": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNzUwOTYsImFwcF9pZCI6IjE3NzA5ODEzNDciLCJkZXZpY2VfaWQiOiI2Y2ZhZDI2Zi00NjE5LTRjOTAtOWRjOS0zN2U2MTZiYzNlN2IiLCJwbGF0Zm9ybSI6IjMiLCJ1c2VyX3R5cGUiOjEsImlhdCI6MTc4NTAwNTEzNCwiZXhwIjoxNzg3NTk3MTM0fQ.prL-vebSvfgp8GQqDfq68jFpsHz5AUdLPswZ-BLOYWg",
        "103": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozODUyMDIwLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUwMDM2NjQsImV4cCI6MTc4NzU5NTY2NH0.mxUBpdVl1Vx07_KljQouKg8gURuGo8AU6WGtmjzv2kA",
        "104": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNTgzMTU0LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUyODYxMjIsImV4cCI6MTc4Nzg3ODEyMn0.6mSllwb-SelbSnnwDOt0hWUS_PAQMg67erD32Xblnwo",
        "105": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0Mjk1OTQsImFwcF9pZCI6IjE3NzA5ODEzNDciLCJkZXZpY2VfaWQiOiI2Y2ZhZDI2Zi00NjE5LTRjOTAtOWRjOS0zN2U2MTZiYzNlN2IiLCJwbGF0Zm9ybSI6IjMiLCJ1c2VyX3R5cGUiOjEsImlhdCI6MTc4NTA2NzczMywiZXhwIjoxNzg3NjU5NzMzfQ.4C_aNA1oMAtVnyRu2rUpGnW_zlrG8XxN_Fxn0rkn1uM",
        "106": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNzUwOTYsImFwcF9pZCI6IjE3NzA5ODEzNDciLCJkZXZpY2VfaWQiOiI2Y2ZhZDI2Zi00NjE5LTRjOTAtOWRjOS0zN2U2MTZiYzNlN2IiLCJwbGF0Zm9ybSI6IjMiLCJ1c2VyX3R5cGUiOjEsImlhdCI6MTc4NTAwNTEzNCwiZXhwIjoxNzg3NTk3MTM0fQ.prL-vebSvfgp8GQqDfq68jFpsHz5AUdLPswZ-BLOYWg",
        "107": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMzQzNTg3LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUwMzE0NDAsImV4cCI6MTc4NzYyMzQ0MH0.nb9a_CSY4w6zyB2s4TJzYzH72Yx0TwOV9j1LNeB01Ik",
        "108": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNzcxNjkxLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUwNzI2MDEsImV4cCI6MTc4NzY2NDYwMX0.uThEfTArbWC8lN4lLdzE08X63VyLPwuaV67D6CvEAdA",
        "109": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNjI1OTY1LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODQ5OTU1MTYsImV4cCI6MTc4NzU4NzUxNn0.3cZFtXkpUka4Lg__0O8tmktZiHvZguDN6wA-L7P61nA",
        "110": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MTk2MzYsImFwcF9pZCI6IjE3NzA5ODEzNDciLCJkZXZpY2VfaWQiOiI2Y2ZhZDI2Zi00NjE5LTRjOTAtOWRjOS0zN2U2MTZiYzNlN2IiLCJwbGF0Zm9ybSI6IjMiLCJ1c2VyX3R5cGUiOjEsImlhdCI6MTc4NDk3MDU4OSwiZXhwIjoxNzg3NTYyNTg5fQ.lILkioglqveDbSaob4qwZ_3GrzKD4PH_ulv7l3SZ4Qg",
        "111": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MDM1NTksImFwcF9pZCI6IjE3NzA5ODEzNDciLCJkZXZpY2VfaWQiOiI2Y2ZhZDI2Zi00NjE5LTRjOTAtOWRjOS0zN2U2MTZiYzNlN2IiLCJwbGF0Zm9ybSI6IjMiLCJ1c2VyX3R5cGUiOjEsImlhdCI6MTc4NDk5NjU1MywiZXhwIjoxNzg3NTg4NTUzfQ.XtkJgki4ZsBV1tsrfTimxqDk-P6hUN29drvM6Y84EEA",
        "112": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjk2MTg3LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUwNDcxMTUsImV4cCI6MTc4NzYzOTExNX0.odqkdHM0P2MSJKvkafb-o1XzANaMlOZS80E-435d2fc",
        "122": ",,entertoken,,",
        "123": ",,entertoken,,",
        "124": ",,entertoken,,",
        "176": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMjMxMjc4LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUxNjk2MDIsImV4cCI6MTc4Nzc2MTYwMn0.irk4P2dx60p-dFlPOuoTk6RbPylxFVl-BV0_m_S-_vQ",
        "177": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNDczMTIzLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUwNTI4NzIsImV4cCI6MTc4NzY0NDg3Mn0.PeD8_c_sFCilzXinno5OzPPjkZfvEZ5y0DpAGXHU7K0",
        "178": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNzc3Nzg1LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODQ5NjYxNTQsImV4cCI6MTc4NzU1ODE1NH0.6MmycnegLX4knA2Q3dsSmr_mUAdyf9hLkJHKpmrrpjs",
        "179": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNzM1MTU4LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODU0MDUwOTIsImV4cCI6MTc4Nzk5NzA5Mn0.nfE4My7H92qskdZmKRSUBxq-ZWRuiPVeZHtBq9F1Ekw",
        "183": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNDI5NzExLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUwNDI0NjAsImV4cCI6MTc4NzYzNDQ2MH0.ZrfJerhoBxOA8--Xd3NBaTIUPOlHN4fnu7z1V2XLFaI",
        "190": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNzU2MjkyLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODQ5ODAzNjYsImV4cCI6MTc4NzU3MjM2Nn0.RXuZo3vCr2H7BEosH6Uf3o73NL9nr4qixHMIE4h8a5Q",
        "191": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTYyNjA5LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODQ5ODE2MzQsImV4cCI6MTc4NzU3MzYzNH0.jhmCmE9llvk6dC24tGWjHL73CthY2G1DD_9SEAI8VkY",
        "192": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MDMwMDUyLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUwNjg0NTQsImV4cCI6MTc4NzY2MDQ1NH0.4s6sSTVh3W9PFPZirXQrrT1g9v0-2MGRHq4hCOZvYOc",
        "193": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNTA1MjExLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUwNDkyNjYsImV4cCI6MTc4NzY0MTI2Nn0.InGlkSik5_LiTO44Y2UjUsRXEO3-094MXOE5dFpd5qU",
        "197": ",,entertoken,,",
        "78": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNDk3MjM0LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODQ5Njg2NjQsImV4cCI6MTc4NzU2MDY2NH0.m0PBIg7I1modaKVBkGHzLZFU2oyC610G-M8rXCdJcY8",
        "55": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMTY3NzQ4LCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODQ5OTIyODMsImV4cCI6MTc4NzU4NDI4M30.9-e1nD1RyfMLBpw8i2DKcstKAZ0cKYnsS2QI43DW5xA",
        "58": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNDc2NDcwLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODQ5ODM3NzMsImV4cCI6MTc4NzU3NTc3M30.cOf1xYBkKy8Xm5St0RNbuG5fvtwK0D4XEmZ9lMqmC7A",
        "64": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMDY3NzMwLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUzMzAwODAsImV4cCI6MTc4NzkyMjA4MH0.Qy2NSDXsQ5rQ9GB16nfKea0L-ZigYjqUT-TD0AI0NJ8",
        "53": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMzk3ODkwLCJhcHBfaWQiOiIxNzcwOTgxMzQ3IiwiZGV2aWNlX2lkIjoiNmNmYWQyNmYtNDYxOS00YzkwLTlkYzktMzdlNjE2YmMzZTdiIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODUxNDk5MDUsImV4cCI6MTc4Nzc0MTkwNX0.A3Nz3CGFcIC1pefP-0uqJ1YlodlVVZswwDuc8LLQ0L4",
        "NEW_ID_6": ",,entertoken,,",
        "NEW_ID_7": ",,entertoken,,",
        "NEW_ID_8": ",,entertoken,,",
        "NEW_ID_9": ",,entertoken,,",
        "NEW_ID_10": ",,entertoken,,"
    };

    let currentToken = courseTokens[courseId];
    if (!currentToken || currentToken === ",,entertoken,,") {
        currentToken = defaultToken;
    }

    const headers = {
        "accept": "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-GB,en;q=0.5",
        "app_id": "1770981347",
        "authorization": `Bearer ${currentToken}`,
        "cache-control": "no-cache",
        "content-type": "application/json",
        "origin": "https://nexttoppers.com",
        "platform": "3",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://nexttoppers.com/",
        "sec-ch-ua": '"Chromium";v="146", "Not-A.Brand";v="24", "Brave";v="146"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36",
        "user_id": "3537962",
        "version": "1"
    };

    // 4. Handle "classes" action
    if (action === 'classes') {
        try {
            const classesApiUrl = 'https://course.nexttoppers.com/course/classes';
            
            const classesResponse = await fetch(classesApiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    type: classType, 
                    page: "1",
                    limit: "50",
                    course_id: courseId
                })
            });

            if (!classesResponse.ok) {
                return new Response(JSON.stringify({
                    error: `API Error: ${classesResponse.status}`,
                    message: classesResponse.statusText
                }), {
                    status: classesResponse.status,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            const classesData = await classesResponse.json();
            
            return new Response(JSON.stringify(classesData, null, 2), {
                headers: { 
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        } catch (error) {
            return new Response(JSON.stringify({
                error: 'Classes Request failed',
                details: error.message,
                courseId: courseId
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }

    // 5. Decryption Helper for Content Details
    async function decryptData(encryptedData) {
        const algorithm = 'AES-CBC';
        const secretKey = new TextEncoder().encode('Ch@tS3cr3tK3y!16');
        const iv = new TextEncoder().encode('Ch@tIV#16Bytes!!');
        try {
            const binaryData = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                secretKey,
                { name: algorithm },
                false,
                ['decrypt']
            );
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: algorithm, iv: iv },
                cryptoKey,
                binaryData
            );
            const decryptedText = new TextDecoder().decode(decryptedBuffer);
            return JSON.parse(decryptedText);
        } catch (error) {
            return { error: 'Decryption failed', details: error.message };
        }
    }

    // 6. Handle default Content Details fetch
    try {
        const apiUrl = `https://course.nexttoppers.com/course/content-details?content_id=${contentId}&course_id=${courseId}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            return new Response(JSON.stringify({
                error: `API Error: ${response.status}`,
                message: response.statusText
            }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        const data = await response.json();
        
        if (data && data.data) {
            // Decrypt Data
            const decryptedData = await decryptData(data.data);
            let drmDetails = null;

            // ==========================================
            // NEW LOGIC: Check for DRM Video
            // ==========================================
            if ((decryptedData.is_drm == 1 || decryptedData.is_drm === '1') && decryptedData.vdc_id) {
                const drmApiUrl = `https://api.videocrypt.com/getVideoDetailsDrm`;
                const drmHeaders = {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'accesskey': 'WEU1QzAxMjZVRzlLUVJKTjNCTDc=',
                    'account-id': '10004141',
                    'content-type': 'application/json',
                    'device-id': '71d3548555586126ed7071102e663619',
                    'device-name': '1',
                    'device-type': '1',
                    'origin': 'https://nexttoppers.com',
                    'referer': 'https://nexttoppers.com/',
                    'secretkey': 'QVZNditHMENJZDFGYlIvUUt1VG9Zd081WEhqZm44dERQMzdKTnFaNA==',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Mobile Safari/537.36',
                    'user-id': '3875028',
                    'version': '1'
                };

                const drmPayload = {
                    name: decryptedData.vdc_id,
                    flag: 1
                };

                try {
                    const drmResponse = await fetch(drmApiUrl, {
                        method: 'POST',
                        headers: drmHeaders,
                        body: JSON.stringify(drmPayload)
                    });
                    drmDetails = await drmResponse.json();
                } catch (drmErr) {
                    drmDetails = { error: 'Failed to fetch DRM info', details: drmErr.message };
                }
            }

            return new Response(JSON.stringify({
                contentId: contentId,
                courseId: courseId,
                decryptedData: decryptedData,
                drm_details: drmDetails, // Normal video hoga to yeh null aayega, DRM hua to data aa jayega
                originalResponse: data
            }, null, 2), {
                headers: { 
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        } else {
            return new Response(JSON.stringify({
                contentId: contentId,
                courseId: courseId,
                message: 'No encrypted data found',
                response: data
            }, null, 2), {
                headers: { 
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Request failed',
            details: error.message,
            contentId: contentId,
            courseId: courseId
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}

export async function onRequestOptions(context) {
    const { request } = context;
    const allowedOrigins = [
        "https://studybeepro.site",
        "https://learnbyakp.online",
        "https://studybeeclone.pages.dev"
    ];

    const origin = request.headers.get("Origin");
    const corsOrigin = allowedOrigins.includes(origin) ? origin : "*";

    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": corsOrigin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}
