
# Vibe Check Lab

Overthink a conversation... *but with science.* ✨

### 🤖 Hackathon Category: AI Studio

Vibe Check Lab is an AI-powered analysis tool built for students, designers, and researchers of Human-Computer Interaction. It transforms any chatbot transcript into a beautiful, interactive dashboard that provides an in-depth report on its conversational dynamics, grounded in established academic theory.

This project meets the "vibe-code your concept" challenge by using a powerful AI Studio-engineered prompt to "vibe-code" messy conversations into structured, actionable data.

## How It Works: The Serverless Stack

This project uses a secure, two-part architecture:

1.  **Frontend (This Repository):** A dynamic **React + Vite** application. It provides the complete user interface, from the input form to the final interactive dashboard. It sends the user's transcript to our backend for analysis.
2.  **Backend (The "Lab Assistant"):** A serverless **Python Flask** app deployed on **Google Cloud Run**. This is our secure "serverless application" that handles all AI processing.

## Fulfilling the "AI Studio" Requirement

The "brain" of this entire application is the **AI system prompt** that was engineered and prototyped in AI Studio.

The backend doesn't just ask the AI to "chat." It uses a detailed **structured JSON schema** to force the Gemini model to act as an expert Conversation Analyst. The AI returns a single, complex JSON object that perfectly maps to our React components, allowing us to dynamically generate:

  * **Dynamic "Key Formulations"** as a visual legend.
  * **Color-Coded Highlights** for the interactive transcript.
  * **At-a-Glance Metrics** like the "Key Moment" and "Flow" balance.
  * **The "Lab Library":** A deep-dive modal for each academic concept.

## App Features

  * **Secure API Key Handling:** The frontend contains **zero** API keys. All keys are securely stored in **Google Secret Manager** and accessed *only* by the Cloud Run backend.
  * **User-Input Validation:** The app automatically checks for character limits and scans for **PII** (emails, phone numbers) before submission to protect user privacy.
  * **Sample Transcripts:** A curated list of example conversations to demonstrate a wide variety of conversational dynamics.
  * **PDF Export:** Users can export their complete, formatted analysis report as a PDF.
  * **Polished UX:** Includes a "History" panel, dark/light mode toggle, and custom loading animations.
  * **Sanitized Git History:** The repository history was scrubbed of all accidentally committed keys using `git-filter-repo`, and a `.gitignore` file is in place.

## How to Run This Project

This project requires both the frontend (this repo) and the backend (`vibe-check-backend` repo) to be running.

### 1\. Run the Backend (on Google Cloud Run)

The backend is a containerized Python app.

1.  **Deploy to Cloud Run:** Deploy the `vibe-check-backend` repository to Google Cloud Run.
2.  **Add API Key:** Create a new Gemini API key in AI Studio. Securely store this key in **Google Secret Manager**.
3.  **Configure Service:** In your Cloud Run service settings, add this new secret as an **environment variable** named `GEMINI_API_KEY`.
4.  **Get the URL:** Once deployed, copy your Cloud Run service's URL.

### 2\. Run the Frontend (Locally)

**Prerequisites:** Node.js

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set Environment Variable:**
    Copy the `.env.example` file to a new file named `.env.local`.

    ```
    # .env.local
    VITE_ANALYSIS_ENDPOINT=httpsIt://your-cloud-run-service-url.a.run.app/analyze
    ```

    *Replace the URL with your live backend URL from Step 1.*

3.  **Run the app:**

    ```bash
    npm run dev
    ```
