'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Globe, BookCheck, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type User } from '@supabase/supabase-js';
import AuthButton from './AuthButton';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Units', href: '/units', icon: BookOpen },
    { name: 'Quiz', href: '/quiz', icon: BookCheck },
  ];

  // If not mounted yet, return null to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm' 
          : 'bg-white dark:bg-slate-800'
      }`}
    >
      <div className="w-full px-6 md:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center space-x-2">
            <Globe className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lingua Learner
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Button - Desktop */}
          <div className="hidden md:flex">
            <AuthButton user={user} />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-slate-800 shadow-lg border-t border-slate-200 dark:border-slate-700"
        >
          <div className="px-4 py-4 space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Auth Button - Mobile */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <AuthButton user={user} />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
} 