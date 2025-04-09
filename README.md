# Lingua Learner

An interactive language learning web application built with Next.js, Supabase, and OpenAI.

## Features (Implemented/Planned)

*   Language Selection
*   Unit Explorer (Pre-made & Custom Units)
*   Unit Detail View
    *   Vocabulary Display
    *   AI-Generated Quizzes (OpenAI)
    *   AI Grammar Conversation (OpenAI)
    *   Sentence Practice (Planned)
    *   AI Voice Chat (Text-based, OpenAI)
*   User Authentication (Supabase Auth)
*   Progress Tracking (Supabase)
*   Settings/Profile Page
*   AI-Generated Unit Suggestions (OpenAI)

## Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **Database:** Supabase (PostgreSQL)
*   **Authentication:** Supabase Auth
*   **AI:** OpenAI API (GPT-4o)
*   **Deployment:** Vercel

## Getting Started

### Prerequisites

*   Node.js (v20.x recommended)
*   npm or yarn
*   Git
*   Supabase Account & Project
*   OpenAI API Key

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd lingua-learner
    ```

2.  **Install dependencies:**
    Navigate into the application directory and install packages.
    ```bash
    cd lingua-learner-app
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env.local` in the `lingua-learner-app` directory.
    Add the following environment variables, replacing the placeholder values with your actual credentials:

    ```plaintext
    # Supabase Credentials (find in your Supabase project settings > API)
    NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>

    # OpenAI API Key (generate at https://platform.openai.com/api-keys)
    OPENAI_API_KEY=sk-<your-openai-api-key>
    ```

4.  **Set up Supabase Database:**
    The necessary database schema (`units` and `progress` tables) and Row Level Security policies should be applied automatically if you use Supabase Migrations or were set up during initial development (refer to `supabase/migrations` if using that workflow, or apply manually if needed based on Phase 3 steps).
    *Ensure you have at least one user created in Supabase Auth (Authentication -> Users) for testing login.* 

### Running Locally

1.  Make sure you are in the `lingua-learner-app` directory.
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

### Linting

To check for code quality issues:
```bash
npm run lint
```

## Deployment

This application is configured for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project into Vercel.
3.  Configure the **Root Directory** in Vercel project settings to `lingua-learner-app`.
4.  Add the same environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`) in the Vercel project settings (Settings -> Environment Variables).
5.  Deploy!

---

*This README provides basic setup instructions. Refer to the code and comments for more detailed implementation specifics.* 