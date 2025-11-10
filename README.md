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

This project is a client-side, single-page application.

*   **Frontend:** A **React** application built with **Vite** and written in **TypeScript**.
*   **AI Model:** **Google's Gemini API** (`gemini-2.5-pro`) provides the core analysis. The API is called directly from the frontend, requesting a structured JSON output from the model based on a detailed system prompt and schema.
*   **Styling:** A combination of CSS-in-JS for component-specific styles and global CSS variables for robust theming (light and dark modes).

## ⚙️ How It Works

1.  A user selects a sample transcript or pastes their own into the React UI.
2.  Upon clicking "Check the vibe," the application sends the transcript, a detailed system prompt, and a JSON schema directly to the **Gemini API** from the browser.
3.  The API key is securely provided by the execution environment and is not handled by the client-side code.
4.  Gemini returns a structured JSON object containing the full analysis.
5.  The React app validates and parses the JSON, then uses it to render the interactive analysis dashboard.

## 💻 How to Run This Project

This project uses Vite as its development server and build tool.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    An `API_KEY` for the Gemini API must be available as an environment variable in your execution context.
    ```bash
    npm run dev
    ```

3.  **Open the App:**
    The application will be available at the URL provided by the Vite development server (typically `http://localhost:3000`).
