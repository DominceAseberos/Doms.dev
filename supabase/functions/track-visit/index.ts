import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Create Supabase client with SERVICE ROLE (secure, never exposed to client)
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Parse request body
        const { session_id, page_path, journey } = await req.json()

        // Validate required fields
        if (!session_id || !page_path) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: session_id, page_path' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Validate journey is an array
        if (journey && !Array.isArray(journey)) {
            return new Response(
                JSON.stringify({ error: 'journey must be an array' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Server-side validation: limit journey array size to prevent abuse
        const sanitizedJourney = journey ? journey.slice(-5) : []

        // Upsert the analytics data (using service role, bypasses RLS)
        const { error } = await supabaseClient
            .from('site_analytics')
            .upsert({
                session_id,
                page_path,
                journey: sanitizedJourney,
            }, { onConflict: 'session_id' })

        if (error) {
            console.error('[track-visit] Database error:', error)
            return new Response(
                JSON.stringify({ error: 'Failed to log visit' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (err) {
        console.error('[track-visit] Error:', err)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
