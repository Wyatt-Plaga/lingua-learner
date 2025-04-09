// Service functions to interact with the backend API routes

const API_BASE_URL = '/api'; // Assuming API routes are served from the same origin

/**
 * Helper function to handle fetch requests and JSON parsing
 */
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Attempt to parse error body, otherwise use status text
      let errorBody;
      try {
        errorBody = await response.json();
      } catch {
        // Ignore parsing error
      }
      console.error(`API Error (${response.status}):`, errorBody || response.statusText);
      throw new Error(errorBody?.error || `Request failed with status ${response.status}`);
    }

    // Check if response has content before parsing JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return; // Return undefined for empty responses (e.g., 204 No Content)

  } catch (error) {
    console.error(`Fetch API (${endpoint}) failed:`, error);
    throw error; // Re-throw the error for the caller to handle
  }
}

// --- API Service Functions ---

/**
 * Fetches a quiz question based on provided words.
 * Corresponds to POST /api/quiz
 */
export async function generateQuiz(words: string[]) {
  return fetchApi('/quiz', {
    method: 'POST',
    body: JSON.stringify({ words }),
  });
}

/**
 * Sends user input for grammar checking/conversation.
 * Corresponds to POST /api/grammar
 */
export async function getGrammarResponse(userInput: string, context?: unknown) {
  return fetchApi('/grammar', {
    method: 'POST',
    body: JSON.stringify({ userInput, context }),
  });
}

/**
 * Sends user text for voice chat interaction.
 * Corresponds to POST /api/voice
 */
export async function getVoiceResponse(userText: string, knownVocabulary?: string[], knownGrammar?: unknown) {
  return fetchApi('/voice', {
    method: 'POST',
    body: JSON.stringify({ userText, knownVocabulary, knownGrammar }),
  });
}

/**
 * Requests suggestions for a new unit based on user context.
 * Corresponds to POST /api/units/generate
 */
export async function generateUnitSuggestion(userContext?: unknown) {
  return fetchApi('/units/generate', {
    method: 'POST',
    body: JSON.stringify({ userContext }),
  });
}

// TODO: Add functions for interacting with Supabase directly (e.g., fetching/saving units, progress) if needed
// These might live in a separate `supabase.ts` service file later. 