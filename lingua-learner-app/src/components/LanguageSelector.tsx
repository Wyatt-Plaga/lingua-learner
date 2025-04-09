'use client'; // Needed for state and event handling

import React, { useState } from 'react';
// Import shadcn components later (e.g., Select)

// No props needed for now, so remove the interface
// interface LanguageSelectorProps {
// }

const LanguageSelector: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  // Placeholder language options
  const languages = [
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    // Add more languages as needed
  ];

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    // Add logic to handle language selection (e.g., update global state, navigate)
    console.log('Selected language:', event.target.value);
  };

  return (
    <div>
      <label htmlFor="language-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Select a language:
      </label>
      {/* Basic HTML select for now, replace with shadcn component later */}
      <select
        id="language-select"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="" disabled>Choose a language</option>
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      {selectedLanguage && <p className="mt-2">You selected: {selectedLanguage}</p>}
    </div>
  );
};

export default LanguageSelector; 