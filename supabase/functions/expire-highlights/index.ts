import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('⏰ Running highlight expiration check...');
    
    // Executar função de expiração
    const { data, error } = await supabase.rpc('expire_old_highlights');
    
    if (error) {
      console.error('❌ Error running expiration function:', error);
      throw error;
    }
    
    // Buscar quantos foram expirados
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { count } = await supabase
      .from('ads_highlight')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'expirado')
      .gte('updated_at', yesterday.toISOString());
    
    console.log(`✅ Expired ${count || 0} highlights in the last 24 hours`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        expired_count: count || 0,
        timestamp: new Date().toISOString(),
        message: `Successfully expired ${count || 0} highlights`,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    console.error('❌ Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
