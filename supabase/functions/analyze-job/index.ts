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
    const { jobDescription } = await req.json();
    console.log('Analyzing job description...');

    if (!jobDescription) {
      throw new Error('Job description is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Call Lovable AI for fraud detection
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert at detecting fraudulent job postings. Analyze job descriptions for red flags like:
- Unrealistic salary promises
- Vague job requirements
- Poor grammar and spelling
- Requests for personal information or payment
- Too-good-to-be-true promises
- Lack of company details
- Suspicious contact information

Respond with a JSON object containing:
{
  "isLegit": boolean,
  "confidence": number (0-1),
  "reasoning": string
}`
          },
          {
            role: 'user',
            content: `Analyze this job description:\n\n${jobDescription}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Lovable AI error:', error);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('AI response:', content);

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      isLegit: true,
      confidence: 0.5,
      reasoning: 'Unable to parse AI response'
    };

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-job:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
