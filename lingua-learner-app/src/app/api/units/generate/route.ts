import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define expected structure for the generated content (matching DB schema)
interface UnitContent {
  vocabulary: { word: string; translation: string; }[];
  grammarPoints: { point: string; explanation: string; }[];
  // Add other sections like dialogues, exercises as needed
}

interface GeneratedUnitResponse {
  title: string;
  content: UnitContent;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Context could include target language, current level, topics of interest etc.
    const { userContext } = body;

    console.log('API /api/units/generate received context:', userContext);

    // --- OpenAI API Call ---    
    const systemPrompt = `You are an AI curriculum designer for a language learning app. Based on the provided user context (e.g., target language, current level, topics of interest, recently learned concepts), generate a suggestion for a *new* language learning unit. Provide a concise title and structured content including vocabulary (word, translation) and grammar points (point, explanation). Respond ONLY with a valid JSON object following this structure: { "title": "string", "content": { "vocabulary": [{ "word": "string", "translation": "string" }], "grammarPoints": [{ "point": "string", "explanation": "string" }] } }. Ensure the vocabulary and grammar are relevant to the potential user context and form a coherent learning unit.`;

    const userMessage = `User Context: ${JSON.stringify(userContext || { targetLanguage: 'Unknown', level: 'Beginner' })}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8, // Higher temperature for more creative unit ideas
      });

      const jsonResponse = completion.choices[0]?.message?.content;

      if (!jsonResponse) {
        throw new Error('OpenAI response content is empty.');
      }

      console.log("Raw OpenAI JSON response (unit generation):", jsonResponse);

      // Parse the JSON response from OpenAI
      let suggestedUnit: GeneratedUnitResponse;
      try {
          suggestedUnit = JSON.parse(jsonResponse) as GeneratedUnitResponse;
          // Basic validation
          if (!suggestedUnit.title || !suggestedUnit.content || !Array.isArray(suggestedUnit.content.vocabulary) || !Array.isArray(suggestedUnit.content.grammarPoints)) {
              throw new Error('Invalid JSON structure received from OpenAI for unit suggestion');
          }
      } catch (parseError) {
          console.error("Failed to parse OpenAI JSON response (unit generation):", parseError);
          throw new Error('Failed to parse valid JSON from OpenAI response for unit suggestion.');
      }

      // For now, just return the suggestion
      return NextResponse.json(suggestedUnit);

    } catch (openaiError) {
      console.error("OpenAI API call failed (unit generation):", openaiError);
      return NextResponse.json({ error: 'Failed to generate unit suggestion from AI.' }, { status: 500 });
    }
    // --- End OpenAI API Call ---

  } catch (error) {
    console.error("Error in /api/units/generate:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 