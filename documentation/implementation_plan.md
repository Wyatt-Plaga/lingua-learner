# Implementation plan

Below is the step-by-step implementation plan broken into five phases. Please ensure to review your project directory before executing new initializations to avoid redundancy.

---

## Phase 1: Environment Setup

1. **Prevalidation:** Check if the current directory is already initialized as a project (e.g., look for an existing package.json or app folder). (Project Summary)
2. **Node.js Verification:** Verify installation of Node.js. If missing or outdated, install Node.js v20.2.1. 
   - **Validation:** Run `node -v` to ensure the correct version. (Project Summary)
3. **Initialize Next.js 14 Project:** Use the Next.js 14 starter with TypeScript. (Tech Stack: Frontend)
   - Run: `npx create-next-app@14 --typescript my-language-app`
   - **Validation:** Confirm the creation of a new project directory named `my-language-app` with an `app` folder. (Tech Stack: Frontend)
4. **Install Tailwind CSS & shadcn:** Follow the Tailwind CSS and shadcn documentation to integrate these UI libraries into your project. (Tech Stack: Frontend)
   - **Validation:** Check that Tailwind CSS is processing your CSS and that shadcn components are rendering in the UI. (Project Summary)
5. **Cursor IDE Setup (if using Cursor):**
   - Create a `cursor_metrics.md` file in the project root. (Cursor Rules)
   - Prevalidation: Check if a `.cursor` directory exists; if not, create it. (Cursor Rules)
6. **Create MCP Configuration for Cursor:**
   - In the project root, create a file at `.cursor/mcp.json` if it does not exist. (Cursor Rules)
   - Add the following configuration, choosing based on your OS:
     - **For macOS:**
       ```json
       { "mcpServers": { "supabase": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-postgres", "<connection-string>"] } } }
       ```
     - **For Windows:**
       ```json
       { "mcpServers": { "supabase": { "command": "cmd", "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-postgres", "<connection-string>"] } } }
       ```
7. **Display Supabase Connection Info:**
   - Provide the following link for obtaining the connection string:
     - https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp
   - **Note:** After obtaining the connection string, replace `<connection-string>` in the configuration above accordingly.
8. **MCP Connection Validation:**
   - Navigate to Settings → MCP in Cursor and verify that the status displays as green (active). (Cursor Rules)

---

## Phase 2: Frontend Development

9. **Home Page (Language Selection):**
   - Create a new file at `/app/page.tsx` to serve as the Home Page which allows language selection. (Project Summary: Home Page)
10. **Language Selection UI Component:**
    - Create a React component at `/components/LanguageSelector.tsx` using shadcn and Tailwind CSS. (Project Summary: Language Selection)
    - Include a dropdown/select input listing available languages.
    - **Validation:** Render the component in the Home Page and ensure it updates state on change.
11. **Unit Explorer Dashboard:**
    - Create a page at `/app/units/page.tsx` to serve as the dashboard displaying both pre-made and custom units. (Project Summary: Unit Explorer)
    - **Validation:** Verify that switching between pre-made and custom units updates the view accordingly.
12. **Unit Detail Page:**
    - Create `/app/units/[unitId]/page.tsx` to view details of an individual unit.
    - Add sections for vocabulary display, quiz interface, grammar conversation, sentence practice, and voice chat tool.
    - **Validation:** Ensure dynamic routing works and that unit details load based on `unitId`.
13. **Quiz Interface Component:**
    - Create `/app/quiz/page.tsx` to display interactive quizzes. (Project Summary: Quiz Interface)
    - Integrate an interactive UI that will later call the backend for quiz generation via ChatGPT API. (ChatGPT API Usage: Quiz)
    - **Validation:** Simulate a quiz question and check that the JSON structure is correctly processed.
14. **Settings/Profile Page:**
    - Create `/app/settings/page.tsx` to display user progress tracking and customization options. (Project Summary: Settings/Profile Page)
    - **Validation:** Ensure progress status (e.g., unit completion and overall percentage) is shown correctly.
15. **UI Consistency Check:**
    - Validate that shadcn UI components and Tailwind CSS styles are consistently applied across pages.

---

## Phase 3: Backend Development

16. **Supabase Setup:**
    - Ensure your Supabase project is live and obtain the connection string from the link provided above.
    - **Validation:** Ensure connection with the Supabase dashboard.
17. **Database Schema for Units:**
    - Define a table called `units` in Postgres with the following columns:
      - `id` (serial primary key)
      - `language` (text)
      - `unit_type` (text, values: 'pre-made' or 'custom')
      - `title` (text)
      - `content` (jsonb, for structured data such as vocabulary, grammar points, etc.)
      - `created_by` (uuid, nullable for pre-made)
    - **Validation:** Run schema SQL in Supabase SQL Editor and verify table creation. (Tech Stack: Backend & Storage)
18. **Database Schema for Progress Tracking:**
    - Define a table named `progress` with columns:
      - `id` (serial primary key)
      - `user_id` (uuid, foreign key to Supabase auth user table)
      - `unit_id` (integer, foreign key to `units.id`)
      - `completion_status` (boolean)
      - `progress_percent` (numeric)
    - **Validation:** Execute the SQL command in Supabase and check the schema in Postgres. (Tech Stack: Backend & Storage)
19. **Setting Up API Endpoints (Next.js Serverless):**
    - In the `/app/api/` directory, create endpoints for the following:
      - **Quiz Generation:** `POST /api/quiz` that accepts a list of words and returns a JSON with a question and mnemonic details using the ChatGPT API. (ChatGPT API: Quiz)
      - **Grammar Conversation:** `POST /api/grammar` for open-ended grammar interactions. (ChatGPT API: Grammar)
      - **Voice Chat:** `POST /api/voice` to provide conversational AI responses, considering the known vocabulary and grammar. (ChatGPT API: Voice Chat)
      - **Unit Generation:** `POST /api/units/generate` to allow ChatGPT to suggest new units based on user vocabulary/grammar. (ChatGPT API: Content Generation)
    - **Validation:** Use tools like Postman or curl to test that each endpoint responds with the expected JSON format.
20. **Supabase MCP Execution:**
    - Use the Supabase MCP server configuration from Phase 1 to deploy the defined schema. (Tech Stack: Backend & Storage)
    - **Validation:** Confirm that the tables and relations are visible in the Supabase dashboard.

---

## Phase 4: Integration

21. **Integrate Frontend with API Endpoints:**
    - In frontend components (e.g., `/services/api.ts`), create functions using `fetch` or Axios calls to the endpoints defined in Phase 3. (Project Summary: Integration)
    - **Validation:** Log responses in the browser console to ensure JSON responses are coming through.
22. **ChatGPT API Integration:**
    - In the serverless endpoint implementations, add code to call the ChatGPT API (using the GPT 4o model) to generate dynamic content. (ChatGPT API Usage: All features)
    - **Validation:** Mock requests to verify the API returns the correct structured JSON for quizzes, grammar, and unit suggestions.
23. **Voice Chat Integration:**
    - In `/app/units/[unitId]/page.tsx`, integrate the voice chat UI component. Ensure that the component sends user vocabulary and grammar data from their profile to the `/api/voice` endpoint. (Project Summary: Voice Chat)
    - **Validation:** Simulate a conversation and verify the API returns the expected text (without voice recognition feedback, per initial spec).
24. **Progress Tracking Integration:**
    - Link user progress data from the Supabase `progress` table into the settings/profile page. (Project Summary: Progress Tracking)
    - **Validation:** Simulate a unit update and verify the percentage and status update correctly on the profile page.

---

## Phase 5: Deployment

25. **Local Testing & Linting:**
    - Run local tests for both frontend and backend endpoints to ensure functionality. (Project Summary)
    - **Validation:** Use `npm run lint` and `npm run test` commands to verify code quality.
26. **CI/CD Setup:**
    - Configure a CI/CD pipeline (e.g., GitHub Actions) to run tests on every push. (Tech Stack: Deployment Integration)
    - **Validation:** Check that pipeline jobs complete successfully when you push a commit.
27. **Deploy Frontend:**
    - Deploy the Next.js app to Vercel, ensuring the project uses Next.js 14 (explicitly required for compatibility with current AI coding tools and LLM models). (Tech Stack: Frontend)
    - **Validation:** Verify the deployment using the Vercel preview URL.
28. **Deploy Backend (Supabase):**
    - Ensure that all Supabase tables are correctly set up and accessible from the deployed app. (Tech Stack: Backend & Storage)
    - **Validation:** Use the Supabase dashboard to ensure data integrity prior to production use.
29. **Post-deployment Health Check:**
    - Verify that all API endpoints respond as expected after deployment.
    - **Validation:** Run an end-to-end test using simulated user interactions (e.g., via Cypress) with the production URL. (Project Summary)

---

## Final Validation & Pre-launch

30. **UI/UX Final Check:**
    - Perform a walkthrough of the entire application ensuring that language selection, unit browsing, quiz mechanics, and voice chat interactions are working as described. (Project Summary)
31. **Supabase Security Check:**
    - Validate authentication and permissions on Supabase to ensure data security. (Tech Stack: Backend & Storage)
32. **Performance & Scalability Test:**
    - Run load tests on the API endpoints and review performance metrics. (Project Summary)
33. **Documentation:**
    - Create a README file at the project root to document installation, configuration, and development guidelines.
34. **User Feedback Loop Plan:**
    - Plan initial user testing sessions for language learners to gather feedback on usability and features.

---

This concludes the implementation plan for your interactive language learning web application. Each step above should be reviewed within your project folder structure and documentation before executing to ensure no redundant actions are performed.