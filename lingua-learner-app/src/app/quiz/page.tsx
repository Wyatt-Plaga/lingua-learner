'use client'; // Likely needed for interactivity

import React, { useState, useEffect } from 'react';
import { generateQuiz } from '@/services/api'; // Import the service function
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, BookOpen, Brain, Loader2, AlertCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [showingMnemonic, setShowingMnemonic] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch quiz question using the API service
  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      setError(null);
      setUserAnswer('');
      setFeedback('');
      setFeedbackType(null);
      setShowingMnemonic(false);
      
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
  }, [questionsAnswered]); // Reload when questionsAnswered changes

  const handleAnswerSubmit = () => {
    if (!currentQuestion || !userAnswer) return;
    
    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setFeedback('Correct!');
      setFeedbackType('correct');
      setCorrectAnswers(prev => prev + 1);
      
      // Show mnemonic if available
      if (currentQuestion.mnemonic) {
        setShowingMnemonic(true);
      }
      
      // Will load next question after delay if we have a mnemonic
      if (!currentQuestion.mnemonic) {
        setTimeout(() => {
          setQuestionsAnswered(prev => prev + 1);
        }, 1500);
      }
    } else {
      setFeedback(`Incorrect. The correct answer is "${currentQuestion.correctAnswer}".`);
      setFeedbackType('incorrect');
    }
  };

  const handleNextQuestion = () => {
    setQuestionsAnswered(prev => prev + 1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // If not mounted yet, return null to prevent hydration issues
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Language Quiz
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span>Score: {correctAnswers}/{questionsAnswered}</span>
            <Progress value={(correctAnswers / Math.max(1, questionsAnswered)) * 100} className="w-24 h-2" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <p className="text-lg text-slate-600 dark:text-slate-300">Preparing your question...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start"
            >
              <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Error Loading Quiz</h3>
                <p className="text-red-600 dark:text-red-300">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => setQuestionsAnswered(prev => prev + 1)}
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : currentQuestion ? (
            <motion.div
              key={`question-${questionsAnswered}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="text-2xl">Question</CardTitle>
                  <CardDescription className="text-base md:text-lg font-medium text-slate-700 dark:text-slate-200">
                    {currentQuestion.question}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <RadioGroup 
                    value={userAnswer}
                    className="space-y-4" 
                    onValueChange={setUserAnswer}
                    disabled={!!feedbackType}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <motion.div 
                        key={option}
                        variants={itemVariants}
                        className={`flex items-center space-x-2 rounded-lg border p-4 transition-all duration-200 
                          ${userAnswer === option ? 'border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}
                          ${feedbackType && (option === currentQuestion.correctAnswer) ? 'border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-900/20' : ''}
                          ${feedbackType === 'incorrect' && userAnswer === option ? 'border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-900/20' : ''}
                          hover:bg-slate-50 dark:hover:bg-slate-800/50`}
                      >
                        <RadioGroupItem 
                          value={option} 
                          id={`option-${index}`}
                          disabled={!!feedbackType}
                        />
                        <Label 
                          htmlFor={`option-${index}`}
                          className="w-full cursor-pointer font-medium"
                        >
                          {option}
                        </Label>
                        
                        {/* Show indicators for correct/incorrect after submission */}
                        {feedbackType && option === currentQuestion.correctAnswer && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                        )}
                        {feedbackType === 'incorrect' && userAnswer === option && (
                          <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                        )}
                      </motion.div>
                    ))}
                  </RadioGroup>
                </CardContent>
                
                <CardFooter className="flex flex-col items-start pt-2 pb-6">
                  {/* Feedback area */}
                  <AnimatePresence>
                    {feedback && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`w-full mb-4 p-4 rounded-lg 
                          ${feedbackType === 'correct' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : ''}
                          ${feedbackType === 'incorrect' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : ''}`}
                      >
                        <div className="flex items-start">
                          {feedbackType === 'correct' ? (
                            <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">{feedback}</p>
                            
                            {/* Mnemonic content */}
                            {showingMnemonic && currentQuestion.mnemonic && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex items-start"
                              >
                                <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                  <span className="font-medium text-blue-600 dark:text-blue-400">Mnemonic:</span> {currentQuestion.mnemonic}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="w-full flex justify-end">
                    {feedbackType === 'correct' && showingMnemonic ? (
                      <Button 
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Next Question
                      </Button>
                    ) : !feedbackType ? (
                      <Button 
                        onClick={handleAnswerSubmit}
                        disabled={!userAnswer}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                      >
                        Submit Answer
                      </Button>
                    ) : null}
                    
                    {feedbackType === 'incorrect' && (
                      <Button 
                        onClick={handleNextQuestion}
                        variant="outline"
                        className="border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      >
                        Skip to Next Question
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              key="no-question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className="text-lg text-slate-600 dark:text-slate-300">No quiz questions available.</p>
              <Button 
                onClick={() => setQuestionsAnswered(prev => prev + 1)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 