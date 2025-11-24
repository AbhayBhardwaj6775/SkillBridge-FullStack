# Backend API Server

Express.js server providing APIs for career pathway analysis.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000` (or PORT from environment variable).

## API Endpoints

- `POST /api/skill-gap` - Analyze skill gaps
- `POST /api/roadmap` - Generate career roadmap
- `GET /api/news` - Fetch latest tech news from HackerNews
- `GET /health` - Health check




