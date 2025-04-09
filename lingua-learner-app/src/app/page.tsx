import LanguageSelector from "@/components/LanguageSelector"; // We'll create this next

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Lingua Learner!</h1>
      <p className="mb-4">Please select the language you want to learn:</p>
      {/* Placeholder for LanguageSelector component */}
      <LanguageSelector />
      {/* <p className="mt-4">[LanguageSelector component will go here]</p> */}
    </div>
  );
}
