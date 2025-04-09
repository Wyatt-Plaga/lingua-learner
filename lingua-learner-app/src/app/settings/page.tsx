'use client';

import React, { useState, useEffect } from 'react';
import { getUserProgress } from '@/services/supabase';
import { createClient } from '@/lib/supabase/client'; // Import client creator
import { type User } from '@supabase/supabase-js'; // Import User type

// ... (keep ProgressEntry interface)
interface ProgressEntry {
  id: number;
  user_id: string;
  unit_id: number;
  completion_status: boolean;
  progress_percent: number;
}


export default function SettingsPage() {
  // State for user, profile, and progress
  const [user, setUser] = useState<User | null>(null);
  const [progressData, setProgressData] = useState<ProgressEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [totalUnits, setTotalUnits] = useState(10); // Comment out for now
  const totalUnits = 10; // Use simple const for placeholder
  const supabase = createClient(); // Create client instance

  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      setError(null);
      
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError("Could not retrieve user session.");
          setIsLoading(false);
          return;
      }

      if (!session?.user) {
          console.log("No active user session found.");
          setUser(null);
          setError("Please log in to view your settings and progress.");
          setProgressData([]); // Clear progress if no user
          setIsLoading(false);
          return;
      }

      const currentUser = session.user;
      setUser(currentUser);
      console.log("Current user:", currentUser.id, currentUser.email);

      // Fetch progress for the logged-in user
      try {
        const data = await getUserProgress(currentUser.id);
        setProgressData(data || []); 

        // TODO: Fetch total number of units dynamically later
        // setTotalUnits(fetchedTotalUnits); // Keep commented

      } catch (err) { // Use unknown
        console.error("Failed to fetch settings page data:", err);
        const message = err instanceof Error ? err.message : 'Could not load progress data.';
        setError(message);
        setProgressData([]); 
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();

  }, [supabase]); // Re-run if supabase client instance changes (though it shouldn't here)

  // Calculate progress summary
  // ... (keep calculations: completedUnitsCount, overallPercentage)
  const completedUnitsCount = progressData?.filter(p => p.completion_status).length ?? 0;
  const overallPercentage = progressData && progressData.length > 0
     ? Math.round(progressData.reduce((sum, p) => sum + p.progress_percent, 0) / progressData.length)
     : 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings & Profile</h1>

      {/* Profile Information Section */}
      <section className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">User Profile</h2>
        {user ? (
           <>
             <p><strong>Email:</strong> {user.email}</p>
             <p><strong>User ID:</strong> {user.id}</p>
            {/* Add more profile fields later */}
           </>
        ) : (
            <p>Not logged in.</p>
        )}
      </section>

      {/* Progress Tracking Section */}
      <section className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">Progress Tracking</h2>
        {isLoading && <p>Loading progress...</p>}
        {!isLoading && error && <p className="text-red-500">Error: {error}</p>}
        {!isLoading && !error && !user && <p>Log in to see your progress.</p>} 
        {!isLoading && !error && user && progressData && progressData.length > 0 && (
          <>
            <p>
              <strong>Units Completed:</strong> {completedUnitsCount} / {totalUnits} (placeholder total)
            </p>
            <p>
              <strong>Overall Progress (Avg %):</strong> {overallPercentage}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-3">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
          </>
        )}
        {!isLoading && !error && user && (!progressData || progressData.length === 0) && (
             <p>No progress data found yet.</p>
         )}
      </section>

      {/* ... Customization Options Section ... */}
      <section className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">Customization</h2>
        <p>App customization options will go here.</p>
      </section>
    </div>
  );
}
