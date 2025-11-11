# 🚀 Deploying to Google Cloud Run

This guide shows you how to deploy Vibe Check Lab to Google Cloud Run with secure API key management.

## Prerequisites

1. **Google Cloud Account** - Sign up at https://cloud.google.com/
2. **Google Gemini API Key** - Get it from https://aistudio.google.com/app/apikey
3. **gcloud CLI** - Install from https://cloud.google.com/sdk/docs/install

## Step 1: Set Up Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing one)
gcloud projects create YOUR-PROJECT-ID --name="Vibe Check Lab"

# Set the project as active
gcloud config set project YOUR-PROJECT-ID

# Enable required services
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## Step 2: Build and Push Docker Image

### Option A: Using Cloud Build (Recommended)

```bash
# Build the image directly on Google Cloud
gcloud builds submit --tag gcr.io/YOUR-PROJECT-ID/vibe-check-lab
```

### Option B: Using Artifact Registry

```bash
# Create an Artifact Registry repository
gcloud artifacts repositories create vibe-check-lab \
    --repository-format=docker \
    --location=us-central1 \
    --description="Vibe Check Lab Docker images"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build and push
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR-PROJECT-ID/vibe-check-lab/app:latest
```

## Step 3: Deploy to Cloud Run with Secret API Key

### Using Secret Manager (Most Secure - Recommended)

```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create a secret for your API key
echo -n "your_actual_gemini_api_key_here" | \
    gcloud secrets create gemini-api-key \
    --data-file=- \
    --replication-policy="automatic"

# Deploy to Cloud Run with secret
gcloud run deploy vibe-check-lab \
    --image gcr.io/YOUR-PROJECT-ID/vibe-check-lab \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-secrets="API_KEY=gemini-api-key:latest" \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10
```

### Using Environment Variables (Quick Method)

```bash
# Deploy with API key as environment variable
gcloud run deploy vibe-check-lab \
    --image gcr.io/YOUR-PROJECT-ID/vibe-check-lab \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars="API_KEY=your_actual_gemini_api_key_here" \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10
```

## Step 4: Get Your Deployment URL

After deployment completes, you'll see output like:

```
Service [vibe-check-lab] revision [vibe-check-lab-00001-abc] has been deployed
and is serving 100 percent of traffic.
Service URL: https://vibe-check-lab-xyz123-uc.a.run.app
```

Visit that URL in your browser!

## Updating Your Deployment

### Update API Key Secret

```bash
# Update the secret with a new API key
echo -n "your_new_api_key" | \
    gcloud secrets versions add gemini-api-key --data-file=-
```

### Update Application Code

```bash
# Rebuild and redeploy
gcloud builds submit --tag gcr.io/YOUR-PROJECT-ID/vibe-check-lab

gcloud run deploy vibe-check-lab \
    --image gcr.io/YOUR-PROJECT-ID/vibe-check-lab \
    --region us-central1
```

## Security Best Practices

✅ **API Key stored in Secret Manager** - Never in code or environment variables visible in console
✅ **HTTPS by default** - Cloud Run provides automatic SSL/TLS
✅ **No .env file in container** - .dockerignore prevents accidental inclusion
✅ **Minimal attack surface** - Multi-stage build creates small production image

## Monitoring and Logs

```bash
# View logs
gcloud run services logs read vibe-check-lab --region us-central1

# View service details
gcloud run services describe vibe-check-lab --region us-central1
```

## Cost Estimates

Cloud Run pricing (as of 2025):
- **First 2 million requests/month**: FREE
- **CPU time**: $0.00002400/vCPU-second (billed in increments of 100ms)
- **Memory**: $0.00000250/GiB-second
- **Network egress**: First 1GB free, then $0.12/GB

For a low-traffic personal project: **~$0-5/month**

## Troubleshooting

### "API key not valid" error
```bash
# Verify secret is set correctly
gcloud secrets versions access latest --secret="gemini-api-key"

# Check if service has permission to access secret
gcloud run services describe vibe-check-lab --region us-central1 --format="value(spec.template.spec.containers[0].env)"
```

### Container fails to start
```bash
# Check build logs
gcloud builds list --limit=5

# View detailed logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=vibe-check-lab" --limit 50
```

## Local Testing of Production Build

```bash
# Build the Docker image locally
docker build -t vibe-check-lab .

# Run with your API key
docker run -p 8080:8080 -e API_KEY=your_key_here vibe-check-lab

# Test at http://localhost:8080
```

## Cleanup

```bash
# Delete the Cloud Run service
gcloud run services delete vibe-check-lab --region us-central1

# Delete the secret
gcloud secrets delete gemini-api-key

# Delete container images
gcloud container images delete gcr.io/YOUR-PROJECT-ID/vibe-check-lab
```
