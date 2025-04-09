'use client'; // May need client-side features later

import React, { useState } from 'react';
import { getVoiceResponse } from '@/services/api'; // Import the voice API service

// Define the expected shape of the params object
interface UnitDetailPageProps {
  params: {
    unitId: string; // The dynamic segment from the URL
  };
}

// Structure for conversation messages
interface Message {
    sender: 'user' | 'ai';
    text: string;
}

// Component receives params as props
export default function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { unitId } = params;

  // State for voice chat interaction
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder - Fetch actual unit data based on unitId later
  const unitData = {
    title: `Details for Unit ${unitId}`,
    // Add other fetched data like vocabulary, grammar points etc.
  };

  // Handle sending user message to the voice API
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: Message = { sender: 'user', text: userInput };
    setConversation((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsSending(true);
    setError(null);

    try {
      // Placeholder context - replace with actual user data later
      const placeholderVocab = ['hello', 'goodbye', 'cat', 'dog'];
      const placeholderGrammar = { tense: 'present simple' };

      const response = await getVoiceResponse(userInput, placeholderVocab, placeholderGrammar);
      
      const aiMessage: Message = { sender: 'ai', text: response.aiTextResponse };
      setConversation((prev) => [...prev, aiMessage]);

    } catch (err) {
        console.error("Failed to get voice response:", err);
        const message = err instanceof Error ? err.message : 'Failed to get AI response.';
        setError(message);
        // Optional: Add error message to conversation?
        // setConversation((prev) => [...prev, { sender: 'ai', text: `Error: ${err.message}` }]);
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{unitData.title}</h1>

      {/* Placeholder sections based on implementation plan */}
      <section className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Vocabulary Display</h2>
        <p>Vocabulary list for unit {unitId} will appear here.</p>
        {/* Add vocabulary display component/logic */}
      </section>

      <section className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Quiz Interface</h2>
        <p>Quiz related to unit {unitId} will be presented here.</p>
        {/* Add Quiz component/logic */}
      </section>

      <section className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Grammar Conversation</h2>
        <p>Interactive grammar section for unit {unitId}.</p>
        {/* Add Grammar component/logic */}
      </section>

      <section className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Sentence Practice</h2>
        <p>Sentence building exercises for unit {unitId}.</p>
        {/* Add Sentence Practice component/logic */}
      </section>

      {/* --- Voice Chat Tool Section --- */}
      <section className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Voice Chat Tool</h2>
        <div className="h-64 overflow-y-auto border rounded p-2 mb-3 bg-gray-50 dark:bg-gray-800">
          {/* Display conversation history */}  
          {conversation.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                {msg.text}
              </span>
            </div>
          ))}
          {/* Display loading indicator */}  
          {isSending && (
             <div className="text-left">
                <span className="inline-block p-2 rounded-lg bg-gray-300 dark:bg-gray-600 animate-pulse">
                    ... thinking ...
                </span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()} // Send on Enter key
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-grow border rounded-l px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !userInput.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
         {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
        <p className="text-xs text-gray-500 mt-2">
            Practice speaking! Type your part of the conversation here. The AI will respond based on placeholder context for now.
        </p>
      </section>
    </div>
  );
} 