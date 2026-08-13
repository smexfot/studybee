export async function onRequest(context) {
    // Ye variable Cloudflare dashboard me set karna: AROLINKS_API_TOKEN
    const apiToken = context.env.AROLINKS_API_TOKEN; 

    // Front-end se URL aayegi jaha redirect karna hai
    const requestBody = await context.request.json();
    const returnUrl = requestBody.returnUrl;
    
    // Unique Session Key (Like your old logic)
    const sessionToken = 'SB_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const finalReturnUrl = `${returnUrl}?verify=${sessionToken}`;
    
    const apiUrl = `https://vplink.in/api?api=${apiToken}&url=${encodeURIComponent(finalReturnUrl)}&format=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if(data.status === 'success' && data.shortenedUrl) {
            return new Response(JSON.stringify({ 
                shortenedUrl: data.shortenedUrl, 
                sessionToken: sessionToken 
            }), { 
                headers: { "Content-Type": "application/json" } 
            });
        } else {
            throw new Error("AroLinks API failed.");
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to create short link" }), { status: 500 });
    }
} 
 
