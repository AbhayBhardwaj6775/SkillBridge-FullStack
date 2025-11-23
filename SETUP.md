# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Testing the APIs

### Test Skill Gap API
```bash
curl -X POST http://localhost:5000/api/skill-gap \
  -H "Content-Type: application/json" \
  -d '{
    "targetRole": "Backend Developer",
    "currentSkills": "Java, SQL, Git"
  }'
```

### Test Roadmap API
```bash
curl -X POST http://localhost:5000/api/roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "targetRole": "Backend Developer"
  }'
```

### Test News API
```bash
curl http://localhost:5000/api/news
```

## Troubleshooting

1. **Port already in use**: Change PORT in backend/server.js or set PORT environment variable
2. **CORS errors**: Make sure backend is running and CORS is enabled (it's already configured)
3. **API connection errors**: Verify NEXT_PUBLIC_API_URL in frontend/.env.local matches your backend URL


