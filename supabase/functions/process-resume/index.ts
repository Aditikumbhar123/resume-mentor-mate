import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing resume...');
    const formData = await req.formData();
    const resume = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!resume) {
      throw new Error('Resume file is required');
    }

    // For simplicity, we'll mock the resume processing
    // In production, you would extract text from PDF/DOCX and analyze it
    const resumeSummary = `Candidate with ${Math.floor(Math.random() * 10) + 2} years of experience. 
Skills include software development, problem-solving, and team collaboration. 
Has worked on multiple projects involving modern web technologies.`;

    console.log('Resume processed successfully');

    return new Response(
      JSON.stringify({
        summary: resumeSummary,
        processedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in process-resume:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
