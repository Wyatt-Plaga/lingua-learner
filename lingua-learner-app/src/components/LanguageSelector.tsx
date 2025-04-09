'use client'; // Needed for state and event handling

import React from 'react'; // Removed useState as state is managed by parent
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" // Import shadcn Select components

// Define props for the component
interface LanguageSelectorProps {
    value: string; // Current selected value
    onValueChange: (value: string) => void; // Callback function
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onValueChange }) => {
  // Placeholder language options
  const languages = [
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' }, // Added more options
    { value: 'it', label: 'Italian' },
    // Add more languages as needed
  ];

  // No internal state or handler needed now, parent controls it

  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Choose a language to learn" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector; 