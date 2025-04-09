'use client'; // Needed for state and event handling

import React, { useState } from 'react';

export default function UnitExplorerPage() {
  const [viewType, setViewType] = useState<'pre-made' | 'custom'>('pre-made');

  // Placeholder data - replace with actual data fetching later
  const preMadeUnits = [
    { id: 1, title: 'Pre-made Unit 1: Greetings' },
    { id: 2, title: 'Pre-made Unit 2: Basic Phrases' },
  ];

  const customUnits = [
    { id: 101, title: 'Custom Unit 1: Travel Vocabulary' },
  ];

  const unitsToShow = viewType === 'pre-made' ? preMadeUnits : customUnits;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Unit Explorer</h1>

      <div className="mb-4">
        <button
          onClick={() => setViewType('pre-made')}
          className={`px-4 py-2 mr-2 rounded ${viewType === 'pre-made' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pre-made Units
        </button>
        <button
          onClick={() => setViewType('custom')}
          className={`px-4 py-2 rounded ${viewType === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Custom Units
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">
          {viewType === 'pre-made' ? 'Pre-made Units' : 'Custom Units'}
        </h2>
        {unitsToShow.length > 0 ? (
          <ul>
            {unitsToShow.map((unit) => (
              <li key={unit.id} className="mb-1 p-2 border rounded hover:bg-gray-100">
                {/* Link to unit detail page later: /units/[unitId] */}
                {unit.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No {viewType === 'pre-made' ? 'pre-made' : 'custom'} units found.</p>
        )}
      </div>
    </div>
  );
} 