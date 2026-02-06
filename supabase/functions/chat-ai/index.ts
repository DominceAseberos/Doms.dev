import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
const OPENROUTER_KEY = Deno.env.get("OPENROUTER_API_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { message, context, history, model } = await req.json();

        let responseData;

        if (model === "gemini") {
            // Gemini API call
            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ role: "user", parts: [{ text: context + "\n\nUser: " + message }] }],
                    }),
                }
            );

            if (!geminiResponse.ok) {
                throw new Error(`Gemini API error: ${geminiResponse.status}`);
            }

            responseData = await geminiResponse.json();
        } else {
            // OpenRouter API call (Mistral, DeepSeek, etc.)
            const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_KEY}`,
                    "Content-Type": "application/json",
                    "X-Title": "Portfolio Assistant",
                },
                body: JSON.stringify({
                    model: model,
                    messages: history,
                }),
            });

            if (!openRouterResponse.ok) {
                throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
            }

            responseData = await openRouterResponse.json();
        }

        return new Response(JSON.stringify(responseData), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Edge function error:", error);
        return new Response(
            JSON.stringify({ error: (error as Error).message || "Internal server error" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
