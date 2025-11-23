# How to Start the Servers Locally

## Option 1: Manual Start (Recommended for Testing)

### Terminal 1 - Backend
```powershell
cd backend
npm start
```
You should see: `Server is running on port 5000`

### Terminal 2 - Frontend  
```powershell
cd frontend
npm run dev
```
You should see: `Ready - started server on 0.0.0.0:3000`

## Option 2: Use the Test Script

Run the test script to verify both servers:
```powershell
.\test-servers.ps1
```

## Access the Application

Once both servers are running:
- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: http://localhost:5000

## Quick Test

1. Open http://localhost:3000
2. Enter a role: "Backend Developer"
3. Enter skills: "Java, SQL, Git"
4. Click "Analyze My Career Path"
5. You should see the dashboard with:
   - Skill gap analysis (left)
   - Career roadmap (right)  
   - Latest tech news (bottom)

## Troubleshooting

### Backend not starting?
- Check if port 5000 is already in use
- Make sure you ran `npm install` in the backend folder
- Check for any error messages in the terminal

### Frontend not starting?
- Check if port 3000 is already in use
- Make sure you ran `npm install` in the frontend folder
- Next.js takes 10-30 seconds to compile on first start
- Check for TypeScript or compilation errors

### APIs not working?
- Ensure backend is running first (http://localhost:5000/health)
- Check browser console for CORS errors
- Verify NEXT_PUBLIC_API_URL is set correctly (defaults to http://localhost:5000)


