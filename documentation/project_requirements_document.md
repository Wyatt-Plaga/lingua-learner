# Project Requirements Document (PRD)

---

## 1. Project Overview

This project is an interactive web application designed specifically for language learners. It leverages the ChatGPT API to provide dynamic, engaging, and personalized learning content. Users can choose a target language and work through a series of structured learning units that cover vocabulary, grammar, and key verbs. At the same time, they have the option to create custom units tailored to their specific learning preferences—ranging from a simple one-sentence overview to detailed specifications of vocabulary and grammar concepts.

The purpose of building this application is to offer an engaging, all-in-one platform that not only teaches language basics but also provides interactive tools such as vocabulary quizzes, practice sentence exercises, and even real-time voice chat sessions. These features make the learning process fun, adaptive, and highly personalized. The key objectives are to enable efficient language acquisition, track learner progress visibly, and ensure dynamic content generation that adapts to each user's learning journey. Success will be measured by user engagement, easy content navigation, seamless integration with ChatGPT for dynamic lessons, and the overall scalability of the platform.

---

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**
- A modern, interactive web application built using Next.js 14 with TypeScript.
- A home page that offers language selection and an introductory overview.
- A dashboard (Unit Explorer) that separates pre-made units and custom unit creation options.
- Detailed unit pages that include sections for vocabulary, grammar, practice sentences, and voice chat.
- Interactive vocabulary quiz tool that dynamically generates quiz questions using the ChatGPT API with JSON formatted responses (include mnemonics and etymology hints).
- A comprehensive grammar section that supports open-ended conversational practice with ChatGPT.
- A voice chat feature enabling real-time conversation using advanced voice mode, ensuring users practice only known vocabulary and grammar.
- User profile/settings page with clear progress tracking (completion percentages per unit).

**Out-of-Scope:**
- Advanced voice recognition or live pronunciation feedback will not be implemented in the initial version.
- Monetization strategies (such as subscriptions or in-app purchases) are not prioritized and will be considered in later phases.
- Multi-language support for the interface is not planned at launch; the application will be in English only.
- Detailed admin/instructor roles or permissions beyond simple learner profiles.

---

## 3. User Flow

When a new user visits the application, they are greeted by a clean and engaging home page that introduces the platform and its benefits for language learning. Here, the first step is language selection, where users choose the language they want to learn. Once the language is chosen, they are taken to a dashboard (Unit Explorer) that displays a collection of pre-made learning units along with an option to create custom units tailored to their needs.

After selecting a specific unit—either pre-made or custom—the user navigates to a detailed unit view. This page is divided into distinct sections including vocabulary lists, grammar explanations, sentence practice exercises, and a voice chat tool for real-time practice. When users decide to test their knowledge, they access an interactive quiz interface that communicates with the ChatGPT API to generate questions in a defined JSON structure, ensuring that the quiz content is both dynamic and closely aligned with their learning unit.

---

## 4. Core Features

- **Language Selection:** A clear interface on the home page to choose the target language.
- **Pre-Made Learning Units:** 20 structured units per language, each containing curated vocabulary, grammar concepts, and key verbs.
- **Custom Unit Creation:** Allow users to create personalized learning units, either starting from basic templates or by defining complete custom specifications.
- **Vocabulary Quiz Tool:** Interactive quizzes that generate dynamic questions via the ChatGPT API. The responses must include mnemonics, etymology details, and structured JSON formatted for rendering in the UI.
- **Comprehensive Grammar Section:** Open-ended conversational learning supported by ChatGPT, focusing on real-time grammar discussions.
- **Practice Sentence Exercises:** Tools to help users apply learned vocabulary and grammar in practical sentence constructions.
- **Voice Chat Feature:** Real-time conversation tool using ChatGPT’s advanced voice mode, providing contextual prompts based on the user's learned material (no voice recognition or live pronunciation feedback).
- **Progress Tracking on Profile/Settings Page:** Visual indicators of completion percentages for each unit and overall learning progress.

---

## 5. Tech Stack & Tools

- **Frontend:**
  - Next.js 14 (with the new App Router)
  - TypeScript for type safety and maintainability.
  - Tailwind CSS and shadcn components for styling and design consistency.
- **Backend & Storage:**
  - Supabase for authentication, database management, and file storage.
- **AI Integration:**
  - ChatGPT API to handle dynamic content generation (including quizzes, grammar explanations, practice sentences, and conversational support in both text and voice modes).
- **Additional Tools/Integration:**
  - Cursor for advanced IDE capabilities with real-time coding suggestions.
  - GPT 4o as the chosen OpenAI model for handling the interactive content generation within the application.

---

## 6. Non-Functional Requirements

- **Performance:** The application should load quickly (target load times under 2-3 seconds) and efficiently handle dynamic content generation for quizzes and interactive sessions.
- **Security:** Secure authentication and storage of user data using Supabase; ensure proper API key management and secure data transfer between the frontend and backend.
- **Scalability:** Design the database and application architecture to handle increasing user numbers and dynamic content requests without performance degradation.
- **Usability:** A clean and intuitive user interface that makes navigation between different sections seamless. The system should be responsive and accessible on both desktop and mobile devices.
- **Compliance:** Adhere to standard data privacy regulations. Ensure proper handling of user data and API interactions.

---

## 7. Constraints & Assumptions

- The application relies on the availability and performance of the ChatGPT API, particularly GPT 4o, for generating dynamic learning content.
- It is assumed that the target audience is primarily learners who are comfortable with an English interface.
- Voice chat feature does not include real-time voice recognition or pronunciation analysis, which may be developed in future iterations.
- Initial content is structured around 20 basic units per language, with future capability for additional, dynamically generated units using user progress data.
- The custom unit creation process assumes users are familiar with basic language learning concepts and are comfortable inputting detailed specifications if desired.

---

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits:** The ChatGPT API might have usage constraints, especially during high demand. A proper caching mechanism or rate limiting strategy should be considered.
- **Dynamic Content Formatting:** Ensuring that the JSON responses from the ChatGPT API are consistent and correctly parsed by the frontend can be a challenge. Establish strict guidelines and error handling routines to manage unexpected data formats.
- **User Data Scalability:** As the number of users grows, the performance of Supabase for database and authentication services must be monitored to prevent slowdowns.
- **Voice Chat Latency:** Real-time voice interaction can introduce delays. Although no live pronunciation feedback is provided, ensure that dialogue flows smoothly with minimal latency.
- **Future Feature Integrations:** While advanced features like pronunciation feedback and monetization are planned for future iterations, design the current system modularly to accommodate these expansions easily without major refactoring.

---

This PRD serves as the comprehensive guide to building the interactive language learning web application. The document covers every detail from high-level concepts to specific functionalities and technical implementations, ensuring a clear reference for subsequent technical documents and project iterations.