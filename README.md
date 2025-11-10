Vibe Check Lab

Overthink a conversation... but with science. ✨

🤖 Hackathon Category: AI Studio

🚀 Try it Out

Vibe Check Lab is live!

Try the Deployed App: [ADD YOUR VERCEL/NETLIFY FRONTEND URL HERE]

Backend API Endpoint: https://vibe-check-lab-analyst-142444819227.us-west1.run.app

📖 Project Summary

Vibe Check Lab is a serverless web application built for students, designers, and researchers of Human-Computer Interaction. It transforms any chatbot transcript into a rich, interactive, and educational dashboard.

Instead of just "feeling" if a conversation is good or bad, our app provides a "vibe-code" analysis, grounding the interaction in established academic theories [cite: lewis-mi/vibechecklab/VibeCheckLab-561781b6fc223233851c335922b6d604e73c4aa0/components/AcademicSources.tsx]. It identifies a conversation's "catalyst" moment [cite: lewis-mi/vibechecklab/VibeCheckLab-561781b6fc223233851c335922b6d604e73c4aa0/components/CatalystMoment.tsx], highlights key design patterns (like "Proactive Guidance" or "Clear Escalation") [cite: lewis-mi/vibechecklab/VibeCheckLab-561781b6fc223233851c335922b6d604e73c4aa0/components/KeyRecommendations.tsx], and provides at-a-glance metrics for everything from conversational flow [cite: lewis-mi/vibechecklab/VibeCheckLab-561781b6fc223233851c335922b6d604e73c4aa0/components/ConversationFlowViz.tsx] to academic concepts [cite: lewis-mi/vibechecklab/VibeCheckLab-561781b6fc223233851c335922b6d604e73c4aa0/components/MetricList.tsx].

🎥 Demonstration Video

[ADD YOUR 3-MINUTE YOUTUBE/LOOM VIDEO LINK HERE]

🛠️ How We Used Google Cloud & AI Studio

This project was built to meet the "AI Studio Category" challenge by using a secure, decoupled, serverless architecture.

Foundation Model: We use Gemini 1.5 Flash as the analytical "brain" of our application [cite: lewis-mi/vibe-check-backend/vibe-check-backend-57ae01b47a4f3b8446db25b45fe1f23f38ba6070/main.py].

Google AI Studio (Prototyping): AI Studio was our "spark" and "vibe-coding" tool. We didn't just use it to generate code; we used it to engineer the core logic of our app. We iteratively designed and tested a sophisticated Master Prompt with a structured JSON schema [cite: lewis-mi/vibechecklab/VibeCheckLab-561781b6fc223233851c335922b6d604e73c4aa0/services/geminiService.ts]. This prompt is the "secret sauce" that instructs Gemini to act as an expert Conversation Analyst and return the precise, complex JSON object our dashboard needs [cite: lewis-mi/vibechecklab/VibeCheckLab-561781b6fc223233851c335922b6d604e73c4aa0/types.ts].

Google Cloud Run (Serverless Backend): The application is deployed on Cloud Run as a serverless Python (Flask) app [cite: lewis-mi/vibe-check-backend/vibe-check-backend-57ae01b47a4f3b8446db25b45fe1f23f38ba6070/dockerfile]. This backend is our secure "vault," and it's the only part of our system that ever touches the API key. It receives transcript text from the frontend [cite: lewis-mi/vibe-check-backend/vibe-check-backend-57ae01b47a4f3b8446db25b45fe1f23f38ba6070/main.py] and returns the finished JSON analysis.

Google Secret Manager (Security): Our Gemini API key is not in our code. It's securely stored in Secret Manager and injected into our Cloud Run container as an environment variable (os.environ.get("GEMINI_API_KEY")), which is the professional standard for security [cite: lewis-mi/vibe-check-backend/vibe-check-backend-57ae01b47a4f3b8446db25b45fe1f23f38ba6070/main.py].

🏛️ Architecture Diagram

Our architecture is a standard, secure, and decoupled model:

The Frontend (React app) is deployed as a static site (e.g., on Vercel or Netlify).

The Backend (Python app) is deployed on Google Cloud Run.

The Frontend never calls the Gemini API. It only calls our Cloud Run backend's /analyze endpoint [cite: lewis-mi/vibechecklab/VibeCheckLab-561781b6fc223233851c335922b6d604e73c4aa0/services/geminiService.ts].

The Backend securely gets the API key from Secret Manager, calls the Gemini API, and returns the analysis.

flowchart TD
    A[Frontend: React App] -- 1. POST /analyze (with transcript) --> B[Backend: Python App on Google Cloud Run];
    B -- 2. Read API Key --> C(Google Secret Manager);
    B -- 3. Send (Transcript + Key) --> D(Gemini API);
    D -- 4. Return JSON Analysis --> B;
    B -- 5. Return JSON to Frontend --> A;
    A -- 6. Renders Dashboard --> User[👩‍💻 User];
    User -- Pastes Transcript --> A;


🔗 Code Repositories

This project is split into two separate repositories for a secure, professional workflow:

Frontend (Public): https://github.com/lewis-mi/VibeCheckLab

A React + Vite + TypeScript application that provides the full user interface, visualizations, and "Lab Library."

Backend (Public): https://github.com/lewis-mi/vibe-check-backend

A Python + Flask serverless API, containerized with a Dockerfile, and deployed on Google Cloud Run. This app contains all the AI logic and secure key handling.

🔗 AI Studio Prompt Link

Link to our original AI Studio Prompt: [ADD YOUR AI STUDIO 'SHARE APP' LINK HERE]
