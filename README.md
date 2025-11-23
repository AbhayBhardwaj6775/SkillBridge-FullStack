# SkillBridge-FullStack

A full-stack application for skill-gap analysis, career roadmap generation, and tech news integration.

## Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript
- **Backend**: Node.js with Express
- **API Integration**: HackerNews Public API
- **Storage**: JSON file storage (optional, for user inputs)

## Project Structure

```
FullStack/
├── backend/
│   ├── server.js              # Express server with API endpoints
│   ├── package.json           # Backend dependencies
│   └── .gitignore
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   └── Dashboard.tsx  # Main dashboard component
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Career goal input page
│   │   └── globals.css        # Global styles
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   ├── next.config.js         # Next.js configuration
│   └── .gitignore
└── README.md
```

## Features

### 1. Career Goal Input Page
- Simple form to enter target role and current skills
- Validates user input before submission
- Displays available roles for guidance

### 2. Skill Gap Analyzer API (POST /api/skill-gap)
- Analyzes user's skills against required skills for target role
- Returns:
  - Matched skills
  - Missing skills
  - Recommendations
  - Suggested learning order

### 3. Career Roadmap Generator API (POST /api/roadmap)
- Generates a 3-phase career roadmap based on target role
- Each phase includes specific topics and timelines

### 4. HackerNews API Integration (GET /api/news)
- Fetches top 5 latest tech stories from HackerNews
- Displays: title, URL, score, time, type, and author

### 5. Combined Dashboard
- Left side: Skill gap analysis results
- Right side: Career roadmap phases
- Bottom: Latest tech news from HackerNews

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Build for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## API Endpoints

### POST /api/skill-gap
Analyzes skill gaps for a given target role.

**Request Body:**
```json
{
  "targetRole": "Backend Developer",
  "currentSkills": "Java, SQL, Git"
}
```

**Response:**
```json
{
  "matchedSkills": ["Java", "SQL", "Git"],
  "missingSkills": ["Spring Boot", "APIs"],
  "recommendations": [
    "Focus on learning: Spring Boot, APIs",
    "Start with foundational skills first, then move to advanced topics"
  ],
  "suggestedLearningOrder": ["Spring Boot", "APIs"]
}
```

### POST /api/roadmap
Generates a career roadmap for a target role.

**Request Body:**
```json
{
  "targetRole": "Backend Developer"
}
```

**Response:**
```json
{
  "targetRole": "Backend Developer",
  "roadmap": [
    {
      "phase": "Phase 1 (1-2 months)",
      "topics": ["Java basics", "OOP concepts", "Git version control"]
    },
    {
      "phase": "Phase 2 (2 months)",
      "topics": ["Spring Boot framework", "SQL databases", "RESTful APIs"]
    },
    {
      "phase": "Phase 3 (1-2 months)",
      "topics": ["Deployment & DevOps", "System design basics", "Microservices"]
    }
  ]
}
```

### GET /api/news
Fetches top 5 latest tech stories from HackerNews.

**Response:**
```json
{
  "stories": [
    {
      "id": 12345678,
      "title": "Story Title",
      "url": "https://example.com/story",
      "score": 100,
      "time": "2024-01-01T12:00:00.000Z",
      "type": "story",
      "by": "username"
    }
  ]
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Career Pathway API is running"
}
```

## Available Roles

The system currently supports the following roles:

1. **Frontend Developer**
   - Required Skills: HTML, CSS, JavaScript, React, Git

2. **Backend Developer**
   - Required Skills: Java, Spring Boot, SQL, APIs, Git

3. **Data Analyst**
   - Required Skills: Excel, SQL, Python, Dashboards, Statistics

## Assumptions

1. **Skills Matching**: The system performs case-insensitive matching and also checks for partial matches (e.g., "JavaScript" matches "javascript" or "js").

2. **User Input Storage**: User inputs are optionally saved to `user-inputs.json` in the backend directory. This is for demonstration purposes and doesn't affect functionality if storage fails.

3. **News Refresh**: The dashboard includes a refresh button for news, but news is also loaded initially with the analysis.

4. **Error Handling**: All API endpoints include proper error handling and return appropriate HTTP status codes.

5. **Responsive Design**: The UI is responsive and works on mobile, tablet, and desktop devices.

## Deployment

### Vercel (Frontend)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy

### Backend (Any Node.js hosting)
- Render, Railway, Heroku, or any Node.js hosting service
- Ensure the server runs on the specified PORT or uses the platform's PORT environment variable

## Development Notes

- The backend uses mock logic for roadmaps (not AI-generated)
- Skills matching is fuzzy to handle variations in user input
- The application prioritizes clarity and functionality over advanced UI design
- All API calls include error handling and loading states

## Future Enhancements

- Add more roles and skills
- Implement user authentication
- Add database for persistent storage
- Enhance skill matching algorithm
- Add progress tracking
- Implement real AI-based roadmap generation

## License

This project is created for the CodeAtRandom AI assignment.


