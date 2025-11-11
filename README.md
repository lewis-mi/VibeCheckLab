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

This project uses a unified frontend-backend architecture suitable for containerization.

*   **Frontend:** A **React** single-page application built with **Vite** and written in **TypeScript**.
*   **Backend:** A standalone **Node.js** server that both serves the frontend static assets and acts as a secure proxy for the Gemini API.
*   **AI Model:** **Google's Gemini API** (`gemini-2.5-flash`) is called from the backend server.
*   **Styling:** A combination of CSS-in-JS for component-specific styles and global CSS variables for robust theming (light and dark modes).

## 🔒 Security Features

*   **Backend API Proxy:** The Gemini API key is securely stored as a server-side environment variable and never exposed to the client. All API calls are routed through the backend server.
*   **Server-Side Validation:** The backend enforces transcript length limits and scans for personally identifiable information (PII) to prevent abuse and protect user privacy.

## ⚙️ How It Works

1.  A user selects a sample transcript or pastes their own into the React UI.
2.  Upon clicking "Check the vibe," the frontend sends the transcript to the backend server at `/api/analyze`.
3.  The backend validates the input (length, PII) in a secure server environment.
4.  The backend retrieves the API key from its environment variables and securely calls the **Google Gemini API** with the transcript, a system prompt, and a response schema.
5.  Gemini returns a structured JSON object to the backend.
6.  The backend forwards this JSON response back to the client-side React app.
7.  The React app validates and parses the JSON, then uses it to render the interactive analysis dashboard.

## 💻 How to Run This Project

This project uses Vite for its development server and a standalone Node.js server for the API.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    Your `API_KEY` for the Gemini API must be available as an environment variable. Create a `.env` file in the project root:
    ```bash
    API_KEY=your_gemini_api_key_here
    ```

    **Get your API key from:** https://aistudio.google.com/app/apikey

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    The Vite development server includes embedded API logic, so you only need to run one command for both frontend and backend during development.

4.  **Open the App:**
    The application will be available at `http://localhost:3000`.

### ☁️ How to Deploy to Google Cloud Run

The decoupled architecture of this project is well-suited for containerized deployment on platforms like Google Cloud Run.

1.  **Create a `Dockerfile`:**
    A `Dockerfile` is included in the project root. It uses a multi-stage build to create a lean, production-ready container image that contains both the frontend and backend.

2.  **Build the Docker Image:**
    From your project root, build the image using Google Cloud Build (or a local Docker daemon) and tag it for Artifact Registry. Replace `PROJECT_ID`, `REGION`, and `REPO_NAME` with your GCP details.

    ```bash
    gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT_ID/REPO_NAME/vibe-check-lab
    ```

3.  **Deploy to Cloud Run:**
    Deploy the image from Artifact Registry to Cloud Run.

    ```bash
    gcloud run deploy vibe-check-lab \
      --image REGION-docker.pkg.dev/PROJECT_ID/REPO_NAME/vibe-check-lab \
      --platform managed \
      --region REGION \
      --allow-unauthenticated \
      --set-env-vars="API_KEY=your_gemini_api_key_here"
    ```
    *   `--allow-unauthenticated` makes the service public.
    *   Use `--set-env-vars` to securely provide your Gemini API key to the Cloud Run instance. Do not hardcode it in the Dockerfile.
