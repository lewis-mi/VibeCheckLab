# 🧪 Vibe Check Lab

> "Overthink a conversation. But with science."

Vibe Check Lab is a web-based analysis tool that uses the Gemini API to analyze chatbot transcripts. It reveals the "vibe" of an interaction by evaluating intangible feelings of rapport, purpose, and flow that go beyond just what was said.

This tool is designed for students, researchers, and designers of human-computer interaction to get instant, data-driven insights into why a conversation *feels* the way it does, with analysis grounded in academic linguistic theories.

## ✨ Core Features

*   **Vibe Analysis:** Generates a catchy, vibe-based title for the conversation (e.g., "Efficient but Impersonal," "Frustrating Loop").
*   **Key Formulations:** Identifies the top 3 most important, high-level design takeaways from the conversation.
*   **Dashboard Metrics:** Scores the conversation on 6 core metrics: Rapport, Purpose, Flow, Implicature, Cohesion, and Accommodation.
*   **Catalyst Moment:** Pinpoints the single most critical moment or exchange in the transcript.
*   **Interactive Annotated Transcript:** Displays the full transcript with highlighted phrases linked to the key formulations.
*   **Academic Grounding:** Provides deep-dive explanations for each metric based on established linguistic theories.
*   **Light/Dark Mode:** Supports both light and dark themes for user comfort.
*   **Analysis History:** Saves previous analyses in local storage for easy review.

## 🚀 Tech Stack & Architecture

This project uses a frontend-backend architecture.

*   **Frontend:** A **React** single-page application built with **Vite** and written in **TypeScript**.
*   **Backend:** A serverless function acting as a secure proxy between the client and the Gemini API.
*   **AI Model:** **Google's Gemini API** (`gemini-2.5-pro`) is called from the backend proxy.
*   **Styling:** A combination of CSS-in-JS for component-specific styles and global CSS variables for robust theming (light and dark modes).

## ⚙️ How It Works

1.  A user selects a sample transcript or pastes their own into the React UI.
2.  Upon clicking "Check the vibe," the frontend sends the transcript to a backend proxy function (at `/api/analyze`).
3.  The backend function, running in a secure server environment, retrieves a stored API key from its environment variables.
4.  The backend securely calls the **Google Gemini API** with the transcript, a system prompt, and a response schema.
5.  Gemini returns a structured JSON object to the backend proxy.
6.  The proxy forwards this JSON response back to the client-side React app.
7.  The React app validates and parses the JSON, then uses it to render the interactive analysis dashboard.

## 💻 How to Run This Project

This project uses Vite as its development server and build tool. It assumes a hosting environment (like Vercel or Netlify) that can run serverless functions.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    Your `API_KEY` for the Gemini API must be available as an environment variable in the serverless function's execution context. For local development with platforms like Vercel, you can create a `.env` file in the project root:
    ```
    API_KEY=your_gemini_api_key_here
    ```

3.  **Run the Development Server:**
    Use your platform's development command (e.g., `vercel dev`) to serve the Vite app and the serverless function proxy simultaneously. If running Vite directly, ensure you have a way to run and proxy to the API function.
    ```bash
    npm run dev
    ```

4.  **Open the App:**
    The application will be available at the URL provided by the development server (typically `http://localhost:3000`).
