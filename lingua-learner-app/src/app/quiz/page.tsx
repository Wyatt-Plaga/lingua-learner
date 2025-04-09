'use client'; // Likely needed for interactivity

import React, { useState, useEffect } from 'react';
import { generateQuiz } from '@/services/api'; // Import the service function

// Placeholder for the structure of a quiz question fetched from the API
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  mnemonic?: string; // Optional mnemonic detail
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quiz question using the API service
  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Example: Request a quiz for these words
        const wordsForQuiz = ['hello', 'goodbye', 'thanks'];
        console.log('Requesting quiz for words:', wordsForQuiz);
        const quizData = await generateQuiz(wordsForQuiz);
        console.log('Received quiz data from API:', quizData);
        setCurrentQuestion(quizData);
      } catch (err) {
        console.error("Failed to fetch quiz question:", err);
        const message = err instanceof Error ? err.message : 'Could not fetch quiz question.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, []); // Load once on component mount

  const handleAnswerSubmit = () => {
    if (!currentQuestion) return;
    if (userAnswer === currentQuestion.correctAnswer) {
      setFeedback(`Correct! ${currentQuestion.mnemonic ? 'Mnemonic: ' + currentQuestion.mnemonic : ''}`);
      // Add logic to load next question
    } else {
      setFeedback('Incorrect. Try again!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Time!</h1>

      {isLoading && <p>Loading quiz question...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && currentQuestion ? (
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Question:</h2>
          <p className="mb-4">{currentQuestion.question}</p>

          <div className="mb-4 space-y-2">
            {currentQuestion.options.map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  id={`option-${option}`}
                  name="quizOption"
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor={`option-${option}`}>{option}</label>
              </div>
            ))}
          </div>

          <button
            onClick={handleAnswerSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={!userAnswer}
          >
            Submit Answer
          </button>

          {feedback && <p className="mt-4 text-sm italic">{feedback}</p>}
        </div>
      ) : (
        !isLoading && !error && <p>No quiz question loaded.</p>
      )}
    </div>
  );
} 