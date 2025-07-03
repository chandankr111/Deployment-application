# 🚀 Vercel-like Deployment Platform

A simplified full-stack Vercel-style platform that allows users to deploy GitHub repositories using a custom dashboard and automated deployment pipeline.

---

## 🧩 Project Structure

vercel-clone/
│
├── upload-service/ # Handles GitHub repo upload & cloning
├── deploy-service/ # Builds and deploys the project to Cloudflare R2
├── handler-server/ # Central orchestrator and API router
├── frontend/ # User-facing UI built with React + Tailwind
└── output/ # Temporary folder for cloned project sources

yaml
Copy
Edit

---

## 🔧 Services Overview

### 📤 1. Upload Service (`upload-service/`)

- Accepts GitHub repository URLs from the frontend.
- Clones the repository into `output/:id`.
- Generates a unique `uploadId` for tracking.

**Endpoint:**

POST /deploy
Body: { "repoUrl": "https://github.com/user/repo" }


### 2. Deploy Service (deploy-service/)
Installs dependencies and builds the project:

bash
Copy
Edit
npm install && npm run build
Uploads the static output to a Cloudflare R2 bucket.

Uses Redis to update the status of the deployment.

Endpoint:

http
Copy
Edit
GET /status?id=<uploadId>
🧠 3. Handler Server (handler-server/)
Orchestrates the upload & deployment lifecycle.

Tracks the status in Redis:

uploading

building

deployed

failed

Serves status updates to the frontend.

☁️ Cloudflare R2 (Static Hosting)
Used for hosting final static build files.

Compatible with AWS SDK (S3 API)

Credentials and bucket details are stored in .env

Required .env variables:

env
Copy
Edit
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
BUCKET_NAME=your_bucket
R2_REGION=auto
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
⚡ Redis (Local)
Used for deployment status tracking.

Run Redis with Docker:
bash
Copy
Edit
docker run -d --name redis -p 6379:6379 redis
Access Redis CLI:
bash
Copy
Edit
docker exec -it redis redis-cli
🖥️ Running Locally
1. Install dependencies
Run npm install in each folder:

bash
Copy
Edit
cd upload-service && npm install
cd deploy-service && npm install
cd handler-server && npm install
cd frontend && npm install
2. Start the services
bash
Copy
Edit
# Upload Service
cd upload-service
npm run dev
bash
Copy
Edit
# Deploy Service
cd deploy-service
npm run dev
bash
Copy
Edit
# Handler Server
cd handler-server
npm run dev
bash
Copy
Edit
# Frontend
cd frontend
npm run dev
Now open http://localhost:5173

🌐 Deployment Output URL
After successful deployment, your site will be available at:

arduino
Copy
Edit
http://<uploadId>.chandanvercel.com/index.html
✨ Features
✅ GitHub repo upload via UI

✅ Automated build and deploy flow

✅ Redis-backed real-time deployment status

✅ Cloudflare R2 static hosting

✅ Fully containerized Redis

✅ Vite + Tailwind-based modern UI

👨‍💻 Author
Chandan Kumar
GitHub: @chandankr111
