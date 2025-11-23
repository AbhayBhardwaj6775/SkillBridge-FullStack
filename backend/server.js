const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Predefined role skills mapping
const ROLE_SKILLS = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
  "Data Analyst": ["Excel", "SQL", "Python", "Dashboards", "Statistics"]
};

// Predefined roadmaps for each role
const ROADMAPS = {
  "Frontend Developer": {
    "Phase 1 (1-2 months)": ["HTML basics", "CSS fundamentals", "JavaScript basics", "Git version control"],
    "Phase 2 (2 months)": ["React fundamentals", "Component architecture", "State management", "API integration"],
    "Phase 3 (1-2 months)": ["Advanced React patterns", "Performance optimization", "Testing", "Build tools"]
  },
  "Backend Developer": {
    "Phase 1 (1-2 months)": ["Java basics", "OOP concepts", "Git version control", "Basic algorithms"],
    "Phase 2 (2 months)": ["Spring Boot framework", "SQL databases", "RESTful APIs", "Database design"],
    "Phase 3 (1-2 months)": ["Deployment & DevOps", "System design basics", "Microservices", "Security practices"]
  },
  "Data Analyst": {
    "Phase 1 (1-2 months)": ["Excel advanced functions", "SQL basics", "Data cleaning", "Basic statistics"],
    "Phase 2 (2 months)": ["Python for data analysis", "Pandas & NumPy", "Data visualization", "Dashboard creation"],
    "Phase 3 (1-2 months)": ["Advanced analytics", "Machine learning basics", "Data storytelling", "Business intelligence"]
  }
};

// Helper function to save user input to JSON file (optional storage)
async function saveUserInput(data) {
  try {
    const filePath = path.join(__dirname, 'user-inputs.json');
    let inputs = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      inputs = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist, start with empty array
    }
    
    inputs.push({
      ...data,
      timestamp: new Date().toISOString()
    });
    
    await fs.writeFile(filePath, JSON.stringify(inputs, null, 2));
  } catch (error) {
    console.error('Error saving user input:', error);
    // Don't throw error - storage is optional
  }
}

// API: POST /api/skill-gap
app.post('/api/skill-gap', async (req, res) => {
  try {
    const { targetRole, currentSkills } = req.body;

    // Validate input
    if (!targetRole || !currentSkills) {
      return res.status(400).json({ 
        error: 'Target role and current skills are required' 
      });
    }

    // Normalize skills (handle both array and comma-separated string)
    let normalizedSkills = [];
    if (Array.isArray(currentSkills)) {
      normalizedSkills = currentSkills.map(skill => skill.trim().toLowerCase());
    } else if (typeof currentSkills === 'string') {
      normalizedSkills = currentSkills.split(',').map(skill => skill.trim().toLowerCase());
    }

    // Get required skills for target role (case-insensitive matching)
    const roleKey = Object.keys(ROLE_SKILLS).find(
      role => role.toLowerCase() === targetRole.toLowerCase()
    );

    if (!roleKey) {
      return res.status(400).json({ 
        error: 'Invalid target role. Available roles: Frontend Developer, Backend Developer, Data Analyst' 
      });
    }

    const requiredSkills = ROLE_SKILLS[roleKey].map(skill => skill.toLowerCase());
    
    // Find matched and missing skills
    const matchedSkills = requiredSkills.filter(skill => 
      normalizedSkills.some(userSkill => 
        userSkill === skill || skill.includes(userSkill) || userSkill.includes(skill)
      )
    );

    const missingSkills = requiredSkills.filter(skill => 
      !matchedSkills.includes(skill)
    );

    // Generate recommendations
    const recommendations = [];
    if (missingSkills.length > 0) {
      recommendations.push(`Focus on learning: ${missingSkills.join(', ')}`);
      recommendations.push(`Start with foundational skills first, then move to advanced topics`);
      recommendations.push(`Practice through projects and real-world applications`);
    } else {
      recommendations.push('Great! You have all the required skills for this role.');
      recommendations.push('Consider learning advanced topics and specializations');
    }

    // Suggested learning order (prioritize missing foundational skills)
    const foundationalSkills = missingSkills.filter(skill => 
      ['html', 'css', 'javascript', 'java', 'sql', 'python', 'excel', 'git'].includes(skill)
    );
    const advancedSkills = missingSkills.filter(skill => 
      !foundationalSkills.includes(skill)
    );
    const suggestedOrder = [...foundationalSkills, ...advancedSkills];

    // Save user input (optional)
    await saveUserInput({ targetRole, currentSkills: normalizedSkills });

    // Return response
    res.json({
      matchedSkills: ROLE_SKILLS[roleKey].filter(skill => 
        matchedSkills.includes(skill.toLowerCase())
      ),
      missingSkills: ROLE_SKILLS[roleKey].filter(skill => 
        missingSkills.includes(skill.toLowerCase())
      ),
      recommendations,
      suggestedLearningOrder: ROLE_SKILLS[roleKey].filter(skill => 
        suggestedOrder.includes(skill.toLowerCase())
      )
    });

  } catch (error) {
    console.error('Error in skill-gap analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: POST /api/roadmap
app.post('/api/roadmap', async (req, res) => {
  try {
    const { targetRole } = req.body;

    // Validate input
    if (!targetRole) {
      return res.status(400).json({ 
        error: 'Target role is required' 
      });
    }

    // Find roadmap for target role (case-insensitive matching)
    const roleKey = Object.keys(ROADMAPS).find(
      role => role.toLowerCase() === targetRole.toLowerCase()
    );

    if (!roleKey) {
      return res.status(400).json({ 
        error: 'Invalid target role. Available roles: Frontend Developer, Backend Developer, Data Analyst' 
      });
    }

    const roadmap = ROADMAPS[roleKey];

    // Convert to array format for easier frontend display
    const roadmapPhases = Object.entries(roadmap).map(([phase, topics]) => ({
      phase,
      topics
    }));

    res.json({
      targetRole: roleKey,
      roadmap: roadmapPhases
    });

  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: GET /api/news
app.get('/api/news', async (req, res) => {
  try {
    // Fetch top story IDs from HackerNews
    const topStoriesResponse = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );

    const topStoryIds = topStoriesResponse.data.slice(0, 10); // Fetch more to ensure we get 5 stories

    // Fetch details for each story
    const storyPromises = topStoryIds.map(id =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    );

    const storyResponses = await Promise.all(storyPromises);

    // Format stories and filter for story type only, then take top 5
    const stories = storyResponses
      .map(response => response.data)
      .filter(story => story && story.type === 'story') // Filter out non-story items
      .slice(0, 5) // Take top 5 stories
      .map(story => ({
        id: story.id,
        title: story.title || 'No title',
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        score: story.score || 0,
        time: story.time ? new Date(story.time * 1000).toISOString() : null,
        type: story.type || 'story',
        by: story.by || 'Unknown'
      }));

    res.json({ stories });

  } catch (error) {
    console.error('Error fetching HackerNews stories:', error);
    res.status(500).json({ error: 'Failed to fetch news stories' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Career Pathway API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

