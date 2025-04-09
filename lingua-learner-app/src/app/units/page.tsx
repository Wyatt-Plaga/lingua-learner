'use client'; // Needed for state and event handling

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, BookmarkPlus, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function UnitExplorerPage() {
  const [viewType, setViewType] = useState<'pre-made' | 'custom'>('pre-made');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Placeholder data - replace with actual data fetching later
  const preMadeUnits = [
    { 
      id: 1, 
      title: 'Greetings & Basic Phrases', 
      description: 'Learn essential greetings and introductory phrases.',
      difficulty: 'Beginner',
      words: 25,
      estimatedTime: '2-3 hours'
    },
    { 
      id: 2, 
      title: 'Food & Dining', 
      description: 'Vocabulary for restaurants, food items, and ordering meals.',
      difficulty: 'Beginner',
      words: 35,
      estimatedTime: '3-4 hours'
    },
    { 
      id: 3, 
      title: 'Travel & Transportation', 
      description: 'Essential phrases for navigating public transport and asking for directions.',
      difficulty: 'Intermediate',
      words: 40,
      estimatedTime: '4-5 hours'
    },
    { 
      id: 4, 
      title: 'Shopping & Numbers', 
      description: 'Learn numbers, currency terms, and phrases for shopping.',
      difficulty: 'Beginner',
      words: 30,
      estimatedTime: '3-4 hours'
    },
  ];

  const customUnits = [
    { 
      id: 101, 
      title: 'My Travel Vocabulary', 
      description: 'Personal collection of travel-related words and phrases.',
      difficulty: 'Custom',
      words: 18,
      estimatedTime: 'Variable',
      createdAt: '2 days ago'
    },
  ];

  // Filter units based on search query
  const filteredPreMadeUnits = preMadeUnits.filter(unit => 
    unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCustomUnits = customUnits.filter(unit => 
    unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Unit Explorer
            </h1>
          </div>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            Explore curated learning units or create your own custom topics. Each unit contains vocabulary, 
            interactive exercises, and AI-powered conversation practice.
          </p>
        </motion.div>

        <div className="mb-8 w-full max-w-3xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search units..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        <Tabs defaultValue="pre-made" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger 
              value="pre-made"
              onClick={() => setViewType('pre-made')}
              className="flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Pre-made Units
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              onClick={() => setViewType('custom')}
              className="flex items-center"
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Custom Units
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="pre-made" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                  Pre-made Learning Units
                </h2>
                <div className="text-sm text-slate-500">
                  {filteredPreMadeUnits.length} {filteredPreMadeUnits.length === 1 ? 'unit' : 'units'} available
                </div>
              </div>

              {filteredPreMadeUnits.length > 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredPreMadeUnits.map((unit) => (
                    <motion.div key={unit.id} variants={itemVariants}>
                      <Link href={`/units/${unit.id}`} className="block h-full">
                        <Card className="h-full border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">{unit.title}</CardTitle>
                              <span className={`text-xs px-2 py-1 rounded-full 
                                ${unit.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                 unit.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                                {unit.difficulty}
                              </span>
                            </div>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              {unit.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                              <span className="mr-4">{unit.words} words</span>
                              <span>{unit.estimatedTime}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="ghost" 
                              className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Start Learning <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No pre-made units found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                  Your Custom Units
                </h2>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" /> Create New Unit
                </Button>
              </div>
              
              {filteredCustomUnits.length > 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredCustomUnits.map((unit) => (
                    <motion.div key={unit.id} variants={itemVariants}>
                      <Link href={`/units/${unit.id}`} className="block h-full">
                        <Card className="h-full border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">{unit.title}</CardTitle>
                              <span className="text-xs text-slate-500">Created {unit.createdAt}</span>
                            </div>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              {unit.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                              <span className="mr-4">{unit.words} words</span>
                              <span>{unit.estimatedTime}</span>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <Button 
                              variant="ghost" 
                              className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Continue Learning <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-4">
                    <Plus className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Create your first custom unit</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Build your own personalized learning materials with specific vocabulary and phrases relevant to your interests.
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" /> Create New Unit
                  </Button>
                </div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
} 