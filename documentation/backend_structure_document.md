# Backend Structure Document

This document provides a clear overview of the backend architecture, hosting solutions, and infrastructure components for our interactive language learning web application. The goal is to create a reliable, scalable, and secure backend that supports personalized learning experiences, including unit creation, vocabulary quizzes, grammar sections, voice chat, and progress tracking.

## 1. Backend Architecture

The backend is designed with a focus on modularity and scalability. Key points include:

*   **Primary Framework & Pattern:**

    *   Utilizes a serverless architecture provided by Supabase, which serves as the backbone by handling database operations, authentication, and file storage.
    *   Uses the RESTful API approach to expose endpoints for interacting with frontend components.

*   **Design Principles:**

    *   **Scalability:** Supabase automatically scales to handle varying loads. The architecture allows for additional API endpoints and compute functions whenever needed.
    *   **Maintainability:** A clear separation of concerns means that authentication, data management, and AI integrations are handled by distinct modules or services, simplifying updates and bug fixes.
    *   **Performance:** Optimized SQL queries with proper indexing and API caching ensure quick data retrieval and overall system responsiveness.

## 2. Database Management

Leveraging Supabase's managed database and storage services offers benefits such as reliability, backups, and integrated security. The database management practices are as follows:

*   **Database Technology:**

    *   **SQL Database:** PostgreSQL is used as the primary relational database system.

*   **Data Management Practices:**

    *   Data is structured into logical tables such as users, units, vocabulary, grammar, quizzes, and tracking progress.
    *   Supabase handles routine tasks such as automated backups, replication, and security patches.
    *   Storage for multimedia or additional assets is managed through Supabase Storage.

## 3. Database Schema

### Human-Readable Schema Description

*   **Users Table:**

    *   Stores user details such as email, authentication credentials, and profile info.
    *   Tracks progress and preferences.

*   **Units Table:**

    *   Contains both pre-made and custom language units.
    *   Attributes include unit title, type, language, creator information, and timestamps.

*   **Vocabulary Table:**

    *   Holds items for each unit, including words, definitions, mnemonics, and etymology information.
    *   Linked to the associated unit.

*   **Grammar Table:**

    *   Includes grammar rules or conversational content powered through ChatGPT.
    *   Connected to the corresponding unit.

*   **Quizzes Table:**

    *   Stores JSON responses that define quizzes, such as question lists along with hints and mnemonics.
    *   Associated with a specific unit for context.

*   **Progress Table:**

    *   Monitors user progress for each unit, including completion percentages and timestamps.

### Sample SQL Schema (PostgreSQL)

Below is a simplified version of the SQL schema that might be used:

`-- Users Table CREATE TABLE users ( id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Units Table CREATE TABLE units ( id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, -- 'pre-made' or 'custom' language VARCHAR(50) NOT NULL, created_by INTEGER REFERENCES users(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Vocabulary Table CREATE TABLE vocabulary ( id SERIAL PRIMARY KEY, unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE, word VARCHAR(255) NOT NULL, definition TEXT, mnemonic TEXT, etymology TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Grammar Table CREATE TABLE grammar ( id SERIAL PRIMARY KEY, unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Quizzes Table CREATE TABLE quizzes ( id SERIAL PRIMARY KEY, unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE, quiz_json JSON NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Progress Table CREATE TABLE progress ( id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE, completion_percentage DECIMAL(5,2), updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );`

## 4. API Design and Endpoints

The API layer bridges the frontend with the backend services and the external ChatGPT API. The design elements are:

*   **API Protocol:**

    *   RESTful APIs are used to expose endpoints, ensuring standardized communication between the frontend and the backend.

*   **Key Endpoints Include:**

    *   **Authentication Endpoints:**

        *   Register, Login, Logout - Handled by Supabase’s authentication module.

    *   **Unit Management Endpoints:**

        *   GET endpoints to retrieve pre-made or custom language units.
        *   POST endpoints for creating new custom units (both from-scratch and template-based).
        *   PUT endpoints for updating unit details.

    *   **Vocabulary & Grammar Endpoints:**

        *   GET endpoints to fetch vocabulary and grammar details for a specific unit.
        *   POST endpoints to add or update vocabulary items or grammar sections.

    *   **Quiz Endpoints:**

        *   Integrate with ChatGPT API to generate quizzes in JSON format, including mnemonics and etymology info.

    *   **Voice Chat Endpoints:**

        *   Endpoint to initiate and maintain a ChatGPT-powered voice interaction mode, guiding conversations based on known vocabulary/grammar.

    *   **Progress Tracking Endpoints:**

        *   GET/POST endpoints to update and fetch user progress data.

Communication between the frontend and these endpoints is handled using JSON, ensuring compatibility and easy parsing.

## 5. Hosting Solutions

The backend is hosted using a cloud-based platform provided by Supabase, which offers multiple benefits:

*   **Cloud Provider:** Supabase

    *   **Benefits:**

        *   **Reliability:** Managed and monitored environment with high uptime.
        *   **Scalability:** Automatically scales based on demand, relieving the team from manual infrastructure management.
        *   **Cost-Effectiveness:** Optimized pricing for startups and scalable usage without heavy upfront costs.

*   **Additional Hosting Options:**

    *   For serving static assets or supporting CSR parts of the application, a platform like Vercel can complement Supabase.

## 6. Infrastructure Components

Key infrastructure components are set up to ensure efficient performance and seamless user experience:

*   **Load Balancers:**

    *   Supabase uses built-in load balancing to evenly distribute incoming API requests.

*   **Caching Mechanisms:**

    *   Response caching is utilized to enhance the speed of frequently accessed endpoints. This might include using a Redis cache or similar technologies if demanded by load.

*   **Content Delivery Network (CDN):**

    *   Static assets served through a CDN (e.g., Vercel CDN) ensure faster load times and global availability.

*   **Integration:**

    *   All these components work hand-in-hand to minimize latency, optimize resource usage, and guarantee smooth scalability as user numbers increase.

## 7. Security Measures

Security is a top priority, and comprehensive measures are in place to protect user data:

*   **Authentication & Authorization:**

    *   Uses Supabase’s built-in authentication services for secure login, register, and session management.
    *   Implements role-based access control to ensure users can only access appropriate data (only learners in this case).

*   **Encryption:**

    *   Data in transit is secured using HTTPS.
    *   Data at rest is encrypted within Supabase-managed databases.

*   **Additional Security Practices:**

    *   Regular security audits and updates.
    *   Secure API endpoints with token-based access and validation.
    *   Compliance with data protection regulations and best practices.

## 8. Monitoring and Maintenance

Keeping the backend operational and optimized is an ongoing process:

*   **Monitoring Tools:**

    *   Supabase’s dashboard provides real-time insights and performance metrics.
    *   Additional third-party tools like Sentry (error tracking) and other monitoring solutions can be integrated.

*   **Maintenance Strategies:**

    *   Regular automated backups and maintenance windows.
    *   Scheduled performance reviews and scaling tests to ensure ongoing reliability.
    *   Continuous updates to third-party libraries and security patches.

## 9. Conclusion and Overall Backend Summary

The backend for our interactive language learning application is designed to be robust, flexible, and secure. By leveraging Supabase’s suite of tools, we achieve:

*   **Modularity:** Clear separation of user, unit, and content functionalities.
*   **Scalability:** Cloud-based hosting and automated scaling reduce the need for constant manual intervention.
*   **Performance:** Optimized endpoints and caching strategies ensure a quick and responsive user experience.
*   **Security:** Comprehensive security measures protect user data and maintain trust.

This architecture not only supports the current application needs—such as customizable units, real-time quizzes, ChatGPT-powered interactions, and tracking user progress—but also sets a solid foundation for future enhancements like expanded roles or additional monetization options. The use of everyday tools coupled with advanced AI functionality differentiates our project in the competitive landscape of language learning tools.

Overall, the backend is crafted to align perfectly with the project’s goals, ensuring reliability, flexibility, and an engaging user experience.
