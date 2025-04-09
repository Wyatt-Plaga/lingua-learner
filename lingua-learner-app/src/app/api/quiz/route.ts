import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// Ensure OPENAI_API_KEY is set in your .env.local file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define expected structure for the API response
interface QuizResponse {
  question: string;
  options: string[];
  correctAnswer: string;
  mnemonic?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { words } = body;

    if (!words || !Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid words list' }, { status: 400 });
    }

    console.log('API /api/quiz received words:', words);

    // --- OpenAI API Call ---    
    const systemPrompt = `You are an AI assistant helping a user learn a language. Generate a multiple-choice quiz question about one of the following words: ${words.join(', ')}. Provide the question, 4 options (one correct), the correct answer, and an optional short mnemonic. Respond ONLY with a valid JSON object following this structure: { "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": "string", "mnemonic": "string" (optional) }.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Using GPT-4o as specified
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a quiz question for one of these words: ${words.join(', ')}` }
        ],
        response_format: { type: "json_object" }, // Request JSON output
        temperature: 0.7, // Adjust creativity vs determinism
      });

      const jsonResponse = completion.choices[0]?.message?.content;

      if (!jsonResponse) {
        throw new Error('OpenAI response content is empty.');
      }

      console.log("Raw OpenAI JSON response:", jsonResponse);

      // Parse the JSON response from OpenAI
      let quizData: QuizResponse;
      try {
          quizData = JSON.parse(jsonResponse) as QuizResponse;
          // Basic validation of the parsed structure
          if (!quizData.question || !Array.isArray(quizData.options) || quizData.options.length !== 4 || !quizData.correctAnswer) {
              throw new Error('Invalid JSON structure received from OpenAI');
          }
      } catch (parseError) {
          console.error("Failed to parse OpenAI JSON response:", parseError);
          throw new Error('Failed to parse valid JSON from OpenAI response.');
      }

      return NextResponse.json(quizData);

    } catch (openaiError) {
      console.error("OpenAI API call failed:", openaiError);
      return NextResponse.json({ error: 'Failed to generate quiz data from AI.' }, { status: 500 });
    }
    // --- End OpenAI API Call ---

  } catch (error) {
    // Handle body parsing errors or other unexpected issues
    console.error("Error in /api/quiz:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    // Check if it's our specific error or a generic one
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 