# 🚀 Deployment Platform

A simplified full-stack deployment platform inspired by Vercel that allows users to deploy GitHub repositories with real-time status tracking.

## Architecture
![alt text]([https://private-user-images.githubusercontent.com/122672735/475686469-7430c360-9f5d-42e9-8091-70ee15d284aa.jpeg?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTQ5NzQ4MjAsIm5iZiI6MTc1NDk3NDUyMCwicGF0aCI6Ii8xMjI2NzI3MzUvNDc1Njg2NDY5LTc0MzBjMzYwLTlmNWQtNDJlOS04MDkxLTcwZWUxNWQyODRhYS5qcGVnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDgxMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA4MTJUMDQ1NTIwWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9OTRiN2VjNDZlMmNlODVjMTA1M2U5NDYwZjg0MmM4ZDMwNDU1MjdiYmUzZmFjZjI5YmZlODM0ZDg2YmUxYzZiNyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.KGaDS0X9pL8hxMSP5wPBYVcMVL0uoz84xQOseZTWk28](https://github.com/chandankr111/Deployment-application/blob/main/image.png))

![alt text](https://private-user-images.githubusercontent.com/122672735/475686465-da9d0e70-b49d-4fa8-84b3-2404e59b574d.jpeg?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTQ5NzQ4NzIsIm5iZiI6MTc1NDk3NDU3MiwicGF0aCI6Ii8xMjI2NzI3MzUvNDc1Njg2NDY1LWRhOWQwZTcwLWI0OWQtNGZhOC04NGIzLTI0MDRlNTliNTc0ZC5qcGVnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDgxMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA4MTJUMDQ1NjEyWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9Njc2YWIzYWRhYWJjMWMxYWIzZmJlN2U5ZjVjYzYwNjYwYzViYWE1Nzc1NzdiOWEwOTliMzVlNjQ5MWI5YThiYyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.zJr9ZRPCEn3eLNfhwn6y0P_4qqkMJG1IK7bqfBsJLEc)
## ✨ Features

- 🔗 **GitHub Integration** - Deploy directly from GitHub repositories
- 🏗️ **Automated Builds** - Automatic dependency installation and build process
- ☁️ **Cloud Storage** - Static hosting via Cloudflare R2 (S3-compatible)
- 📊 **Real-time Status** - Live deployment tracking with Redis

- 🐳 **Docker Support** - Containerized Redis for easy setup
- ⚡ **Fast Deployment** - Optimized build and deployment pipeline

## 🏗️ Architecture

```
vercel-clone/
├── upload-service/     # GitHub repo cloning & upload handling
├── deploy-service/     # Build process & Cloudflare R2 deployment
├── handler-server/     # API orchestration & status management
├── frontend/          # React UI with Tailwind CSS
└── output/           # Temporary storage for cloned repositories
```

## 🔧 Services Overview

### 📤 Upload Service
Handles GitHub repository processing and cloning.

**Key Features:**
- Repository URL validation
- Secure cloning to isolated directories
- Unique upload ID generation
- Error handling for invalid repositories

**API Endpoint:**
```http
POST /deploy
Content-Type: application/json

{
  "repoUrl": "https://github.com/username/repository"
}
```

### 🚀 Deploy Service
Manages the build and deployment process.

**Key Features:**
- Automated dependency installation
- Build process execution
- Cloudflare R2 upload
- Build status tracking

**API Endpoint:**
```http
GET /status?id=<uploadId>
```

### 🧠 Handler Server
Central orchestrator that coordinates between services.

**Deployment States:**
- `uploading` - Repository is being cloned
- `building` - Dependencies installing and building
- `deployed` - Successfully deployed and live
- `failed` - Deployment encountered an error

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (for Redis)
- Cloudflare R2 account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/chandankr111/Deployment-application.git
cd Deployment-application
```

### 2. Environment Setup

Create `.env` files in each service directory:

```env
# Cloudflare R2 Configuration
AWS_ACCESS_KEY_ID=your_r2_access_key
AWS_SECRET_ACCESS_KEY=your_r2_secret_key
BUCKET_NAME=your_r2_bucket_name
R2_REGION=auto
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

### 3. Start Redis

```bash
docker run -d --name redis -p 6379:6379 redis
```

### 4. Install Dependencies

```bash
# Install all service dependencies
npm run install:all

# Or install manually for each service
cd upload-service && npm install
cd ../deploy-service && npm install
cd ../handler-server && npm install
cd ../frontend && npm install
```

### 5. Start All Services

```bash
# Start all services concurrently
npm run dev

# Or start each service individually
npm run start:upload    # Upload service on port 3000
npm run start:deploy    
npm run start:handler   # Handler server on port 3002
npm run dev:frontend  # Frontend on port 5173
```

### 6. Access the Platform

Open your browser and navigate to:
```
http://localhost:5173
```

## 📖 Usage

1. **Enter GitHub Repository URL**
   - Paste any public GitHub repository URL
   - Click "Deploy" to start the process

2. **Monitor Deployment**
   - Watch real-time status updates
   - View build logs and progress

3. **Access Deployed Site**
   - Get your unique deployment URL
   - Format: `http://<uploadId>.chandanvercel.com/index.html`

## 🛠️ Development

### Project Scripts

```bash
# Development
npm run start:upload       # Start upload service only
npm run start:deploy       # Start deploy service only
npm run start:handler      # Start handler server only
npm run dev:frontend     # Start frontend only

# Production
npm run build            # Build all services
npm run start            # Start production servers

# Utilities
npm run install:all      # Install all dependencies
npm run clean           # Clean output directory
```

### Redis Commands

```bash
# Access Redis CLI
docker exec -it redis redis-cli

# Monitor deployment status
HGETALL deployment:<uploadId>

# Clear all data
FLUSHALL
```

## 🔒 Security Considerations

- Repository URLs are validated before processing
- Temporary files are cleaned up after deployment
- Build processes run in isolated environments
- Environment variables are properly secured

## 🌐 Deployment States

| State | Description | Duration |
|-------|-------------|----------|
| `uploading` | Cloning repository from GitHub | 10-30s |
| `building` | Installing dependencies and building | 1-5min |
| `deployed` | Successfully deployed and accessible | - |
| `failed` | Error occurred during process | - |


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Vercel](https://vercel.com)
- Built with modern web technologies
- Powered by Cloudflare R2 for reliable hosting

## 📧 Contact

**Chandan Kumar**
- GitHub: [@chandankr111](https://github.com/chandankr111)
- Email: chandankr824142@gmail.com

---

<div align="center">
  <p>Made with ❤️ by Chandan Kumar</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
