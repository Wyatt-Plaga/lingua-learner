import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define expected response structure (can be flexible)
interface GrammarResponse {
  reply: string;
  // potentially add corrections, explanations etc.
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Context could include known grammar rules, target language, etc.
    const { userInput, context } = body;

    if (!userInput) {
      return NextResponse.json({ error: 'Missing user input' }, { status: 400 });
    }

    console.log('API /api/grammar received input:', userInput, 'Context:', context);

    // --- OpenAI API Call ---    
    const systemPrompt = `You are an AI language tutor. The user provides input they want checked or explained regarding grammar. Context (like target language or known concepts) might be provided. Provide a helpful explanation, correction, or conversational response. Keep responses concise and clear for a language learner. Target Language (if known): ${context?.targetLanguage || 'not specified'}.`;
    
    const userMessage = `User Input: "${userInput}"\nContext: ${JSON.stringify(context || {})}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        // Not requesting JSON here, as response is conversational text
        temperature: 0.5, 
      });

      const aiResponse = completion.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('OpenAI response content is empty.');
      }

      console.log("OpenAI Grammar response:", aiResponse);

      const responseData: GrammarResponse = {
        reply: aiResponse.trim(),
      };

      return NextResponse.json(responseData);

    } catch (openaiError) {
      console.error("OpenAI API call failed (grammar):", openaiError);
      return NextResponse.json({ error: 'Failed to get grammar response from AI.' }, { status: 500 });
    }
    // --- End OpenAI API Call ---

  } catch (error) {
    console.error("Error in /api/grammar:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 