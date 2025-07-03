# Vercel-like Deployment Platform 🧩

A simplified full-stack Vercel-like platform that allows users to deploy GitHub repositories using a custom dashboard and deployment flow.

---

## 🏗 Project Structure

```bash
vercel-clone/
│
├── upload-service/      # Handles repository upload & cloning
├── deploy-service/      # Builds and deploys the cloned project
├── handler-server/      # Manages API requests and controls deployment lifecycle
├── frontend/            # Frontend UI for user input and deployment status
└── output/              # Temporarily holds user-uploaded projects
🔧 Services
1. 📤 Upload Service (upload-service/)
Accepts GitHub repository URLs.

Clones the repository into the /output/:id directory.

Generates a unique upload ID used for further processing.

Exposes: POST /deploy

2. 🚀 Deploy Service (deploy-service/)
Takes the cloned repo path (/output/:id) and installs dependencies.

Builds the project using npm install && npm run build.

On success, the site is uploaded to Cloudflare R2 bucket (S3 compatible).

Exposes: GET /status?id=<uploadId>

3. 🧠 Handler Server (handler-server/)
Central controller that routes between upload and deploy services.

Handles state updates (e.g., "uploading", "building", "deployed").

Connects with Redis to track the current status of deployments.

🗃 Storage
☁️ Cloudflare R2 (S3-Compatible)
Used to store and serve built static files.

Compatible with AWS SDK (@aws-sdk/client-s3)

Bucket name and credentials configured via environment variables.

⚡ Local Redis (via Docker)
Used to store job status (uploading, building, deployed, etc).

To run Redis locally:

bash
Copy
Edit
docker run -d --name redis -p 6379:6379 redis
To access Redis CLI:

bash
Copy
Edit
docker exec -it redis redis-cli
🖥️ Running Locally
1. Install dependencies:
bash
Copy
Edit
npm install
Run separately in each folder (upload-service/, deploy-service/, handler-server/, etc.)

2. Start Upload Service
bash
Copy
Edit
cd upload-service
npm run dev
3. Start Deploy Service
bash
Copy
Edit
cd deploy-service
npm run dev
4. Start Handler Server
bash
Copy
Edit
cd handler-server
npm run dev
5. Start Frontend
bash
Copy
Edit
cd frontend
npm run dev
Access the frontend at http://localhost:5173

🌐 Environment Variables
Setup your .env files in each service accordingly.

For Upload & Deploy services:
env
Copy
Edit
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
BUCKET_NAME=your_bucket
R2_REGION=auto
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
For Redis (optional):
env
Copy
Edit
REDIS_URL=redis://localhost:6379
✅ Deployment Status Example
Once deployed, users will see the deployed URL:

arduino
Copy
Edit
http://<uploadId>.chandanvercel.com/index.html
✨ Features
Real-time deployment status polling

GitHub integration (via repo cloning)

Redis-based job state management

Cloudflare R2 storage integration

Docker-powered Redis

Vite + Tailwind frontend

