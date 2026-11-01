# Celebra AI - Event Planning Assistant

An AI-powered celebration and event planning assistant using Featherless API.

## Deployment Instructions (Vercel)

### Prerequisites
- Node.js installed
- Vercel account
- Featherless API key

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Environment Variables
Create a `.env` file (or set in Vercel dashboard):
```
FEATHERLESS_API_KEY=your_featherless_api_key_here
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
```

**Option B: Using Vercel Dashboard**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Set environment variable: `FEATHERLESS_API_KEY`
6. Click "Deploy"

### Step 4: Configure Environment Variables in Vercel
After deployment:
1. Go to your project settings in Vercel
2. Navigate to Environment Variables
3. Add: `FEATHERLESS_API_KEY` = your actual Featherless API key
4. Redeploy if needed

### Local Development
```bash
npm run dev
```
Visit `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Project Structure
- `api/index.ts` - Vercel serverless functions for API endpoints
- `server.ts` - Local Express server (for development)
- `src/` - React frontend application
- `vercel.json` - Vercel deployment configuration

## API Endpoints
- `GET /api/status` - Check Featherless API status
- `POST /api/ai/plan` - Generate event plan
- `POST /api/ai/optimize-budget` - Optimize event budget
- `POST /api/ai/chat` - AI chat assistant
- `POST /api/ai/ideas` - Generate creative ideas
