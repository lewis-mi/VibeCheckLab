<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ppe4ommybfdnoH9G511EmxVhhAYZPsWY

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set `VITE_ANALYSIS_ENDPOINT` to the URL of your secured backend endpoint (for example, your Cloud Run `/analyze` route) that proxies Gemini requests.
   *The frontend no longer uses a Gemini API key directly—keep the key on the server backing this endpoint.*
3. Run the app:
   `npm run dev`
