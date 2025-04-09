'use client'; // Needs to be client component for state

import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, BookOpen, MessageSquare, Brain } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Callback for the selector component
  const handleLanguageSelect = (languageValue: string) => {
    console.log("HomePage received language:", languageValue);
    setSelectedLanguage(languageValue);
  };

  // Get language name from code
  const getLanguageName = (code: string) => {
    const languages = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'it': 'Italian'
    };
    return languages[code as keyof typeof languages] || code;
  };

  // Placeholder action for the button
  const handleStartLearning = () => {
    const selectedLanguageLabel = getLanguageName(selectedLanguage);
    alert(`Starting to learn ${selectedLanguageLabel}! (Navigation not implemented yet)`);
    // TODO: Implement navigation to the relevant units page, possibly passing the language
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // If not mounted yet, return null to prevent hydration issues
  if (!mounted) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 w-full">
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        {/* Hero Section */}
        <motion.div 
          className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex-1 max-w-2xl">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-600">Lingua Learner</h2>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Master a new language with AI
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              An interactive journey to fluency. Learn naturally through conversations, personalized lessons, and AI-powered guidance.
            </p>
            
            <div className="space-y-8">
              <div className="flex flex-col">
                <LanguageSelector 
                  value={selectedLanguage} 
                  onValueChange={handleLanguageSelect} 
                />
                
                {selectedLanguage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <Button 
                      size="lg" 
                      onClick={handleStartLearning} 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Start Learning {getLanguageName(selectedLanguage)}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex-1 hidden lg:block">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-70"></div>
              {/* This would ideally be replaced with a proper illustration */}
              <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <img 
                  src="/images/language-learning-illustration.svg" 
                  alt="Language Learning" 
                  className="w-full h-auto"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="text-center py-4">
                  <p className="text-slate-800 dark:text-slate-200 text-lg font-medium">Interactive Learning Experience</p>
                  <p className="text-slate-500 dark:text-slate-400">Powered by conversational AI</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Features Section */}
        <motion.div 
          className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-fit mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customized Units</h3>
            <p className="text-slate-600 dark:text-slate-300">Pre-made and custom learning units adapted to your proficiency level.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-fit mb-4">
              <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Conversations</h3>
            <p className="text-slate-600 dark:text-slate-300">Practice with AI-powered conversations that adapt to your learning style.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit mb-4">
              <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Progress</h3>
            <p className="text-slate-600 dark:text-slate-300">Track your learning journey with detailed progress analytics.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
