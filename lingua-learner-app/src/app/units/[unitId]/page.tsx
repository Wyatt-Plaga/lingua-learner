'use client'; // May need client-side features later

import React, { useState, useEffect } from 'react';
import { getVoiceResponse } from '@/services/api'; // Import the voice API service
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BookOpen, MessageSquare, BookCheck, Pencil, Volume, ArrowLeft, Send, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

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
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Placeholder - Fetch actual unit data based on unitId later
  const unitData = {
    title: `Unit ${unitId}: ${
      unitId === '1' ? 'Greetings & Basic Phrases' :
      unitId === '2' ? 'Food & Dining' :
      unitId === '3' ? 'Travel & Transportation' :
      unitId === '4' ? 'Shopping & Numbers' :
      'Custom Unit'
    }`,
    description: 'This unit contains essential vocabulary and phrases to help you navigate everyday conversations.',
    difficulty: unitId === '3' ? 'Intermediate' : 'Beginner',
    progress: 35,
    vocabulary: [
      { term: 'hello', translation: 'hola', notes: 'Used as a greeting' },
      { term: 'goodbye', translation: 'adiós', notes: 'Used when parting' },
      { term: 'please', translation: 'por favor', notes: 'Used when making requests' },
      { term: 'thank you', translation: 'gracias', notes: 'Used to express gratitude' },
      { term: 'yes', translation: 'sí', notes: 'Affirmative response' },
      { term: 'no', translation: 'no', notes: 'Negative response' },
      { term: 'excuse me', translation: 'perdón', notes: 'Used to get attention or apologize' },
      { term: 'good morning', translation: 'buenos días', notes: 'Morning greeting' },
    ],
    grammarPoints: [
      { title: 'Basic Sentence Structure', description: 'Learn how to form simple sentences.' },
      { title: 'Present Tense Verbs', description: 'Conjugation of regular verbs in the present tense.' },
    ],
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
      
      const aiMessage: Message = { sender: 'ai', text: response.aiTextResponse || 'I understand. Let\'s practice more!' };
      setConversation((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error("Failed to get voice response:", err);
      const message = err instanceof Error ? err.message : 'Failed to get AI response.';
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
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
      <div className="w-full px-6 md:px-8 lg:px-12">
        {/* Unit header with back button */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Link href="/units" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {unitData.title}
            </motion.h1>
            <span className={`ml-4 text-xs px-2 py-1 rounded-full 
              ${unitData.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
               'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
              {unitData.difficulty}
            </span>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            {unitData.description}
          </p>
        </div>

        {/* Tabs for different unit sections */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="vocabulary" className="flex items-center justify-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Vocabulary</span>
              <span className="sm:hidden">Vocab</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center justify-center">
              <BookCheck className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="grammar" className="flex items-center justify-center">
              <Pencil className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Grammar</span>
              <span className="sm:hidden">Grammar</span>
            </TabsTrigger>
            <TabsTrigger value="conversation" className="flex items-center justify-center">
              <Volume className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Conversation</span>
              <span className="sm:hidden">Talk</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Vocabulary Tab */}
            <TabsContent value="vocabulary" className="mt-0">
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Vocabulary List
                  </CardTitle>
                  <CardDescription>
                    Master these key words and phrases to build your foundation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-1"
                  >
                    {unitData.vocabulary.map((item, index) => (
                      <motion.div 
                        key={index}
                        variants={itemVariants}
                        className="group"
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium">{item.term}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{item.translation}</p>
                          </div>
                          <div className="hidden group-hover:block text-sm italic text-slate-500 dark:text-slate-400">
                            {item.notes}
                          </div>
                        </div>
                        {index < unitData.vocabulary.length - 1 && (
                          <Separator className="my-1" />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab('quiz')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Practice in Quiz
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookCheck className="h-5 w-5 mr-2 text-purple-600" />
                    Interactive Quiz
                  </CardTitle>
                  <CardDescription>
                    Test your knowledge with these personalized questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="text-center">
                    <BookCheck className="h-20 w-20 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Quiz Loading</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                      Our AI is generating personalized quiz questions based on this unit's vocabulary.
                    </p>
                    <Link href="/quiz">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Go to Quiz Page
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Grammar Tab */}
            <TabsContent value="grammar" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pencil className="h-5 w-5 mr-2 text-green-600" />
                    Grammar Points
                  </CardTitle>
                  <CardDescription>
                    Key grammatical concepts to master in this unit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {unitData.grammarPoints.map((point, index) => (
                      <motion.div 
                        key={index}
                        variants={itemVariants}
                        className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <h3 className="font-medium text-lg mb-1">{point.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300">{point.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab('conversation')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Practice in Conversation
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Conversation Tab */}
            <TabsContent value="conversation" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Volume className="h-5 w-5 mr-2 text-blue-600" />
                    AI Conversation Practice
                  </CardTitle>
                  <CardDescription>
                    Practice what you've learned in a natural conversation with our AI tutor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-4 bg-white dark:bg-slate-800">
                    <AnimatePresence>
                      {conversation.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col h-full items-center justify-center text-center p-6"
                        >
                          <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Start a Conversation</h3>
                          <p className="text-slate-500 dark:text-slate-400 max-w-md">
                            Practice your language skills by chatting with our AI tutor. 
                            Try using vocabulary from this unit!
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-4"
                        >
                          {conversation.map((msg, index) => (
                            <motion.div 
                              key={index} 
                              variants={itemVariants}
                              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                  msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                }`}
                              >
                                {msg.text}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Loading indicator for typing */}
                      {isSending && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start mt-4"
                        >
                          <div className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 flex items-start rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                      placeholder="Type your message..."
                      disabled={isSending}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isSending || !userInput.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" /> Send
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
} 