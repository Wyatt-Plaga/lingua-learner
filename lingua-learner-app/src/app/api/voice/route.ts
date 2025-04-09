import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define expected response structure
interface VoiceResponse {
  aiTextResponse: string;
}

// TODO: Potentially import Text-to-Speech (TTS) service if needed later

export async function POST(req: NextRequest) {
  try {
    // TODO: Parse request body (expecting user speech text, known vocab/grammar context)
    const body = await req.json();
    const { userText, knownVocabulary, knownGrammar } = body; // Assuming these are sent

    if (!userText) {
      return NextResponse.json({ error: 'Missing user text' }, { status: 400 });
    }

    const contextSummary = `User knows vocabulary: ${knownVocabulary?.join(', ') || 'none specified'}. User knows grammar: ${JSON.stringify(knownGrammar || 'none specified')}.`;
    console.log('API /api/voice received text:', userText, 'Context:', contextSummary);

    // --- OpenAI API Call ---    
    const systemPrompt = `You are an AI language practice partner. Engage in a simple, natural conversation with the user based on their input. Consider the user's known vocabulary and grammar (provided in context) to keep the conversation appropriate for their level. Keep your responses relatively short and encourage the user to continue.`;

    const userMessage = `User Input: "${userText}"\nContext: ${contextSummary}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('OpenAI response content is empty.');
      }

      console.log("OpenAI Voice response (text):", aiResponse);

      const responseData: VoiceResponse = {
        aiTextResponse: aiResponse.trim(),
      };

      return NextResponse.json(responseData);

    } catch (openaiError) {
      console.error("OpenAI API call failed (voice):", openaiError);
      return NextResponse.json({ error: 'Failed to get voice response from AI.' }, { status: 500 });
    }
    // --- End OpenAI API Call ---

  } catch (error) {
    console.error("Error in /api/voice:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 