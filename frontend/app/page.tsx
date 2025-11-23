'use client'

import { useState } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Home() {
  const [targetRole, setTargetRole] = useState('')
  const [currentSkills, setCurrentSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analysisData, setAnalysisData] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!targetRole.trim() || !currentSkills.trim()) {
      setError('Please fill in both target role and current skills')
      return
    }

    setLoading(true)
    setError('')
    setAnalysisData(null)

    try {
      // Fetch skill gap analysis
      const skillGapResponse = await axios.post(`${API_BASE_URL}/api/skill-gap`, {
        targetRole: targetRole.trim(),
        currentSkills: currentSkills.trim()
      })

      // Fetch roadmap
      const roadmapResponse = await axios.post(`${API_BASE_URL}/api/roadmap`, {
        targetRole: targetRole.trim()
      })

      // Fetch news
      const newsResponse = await axios.get(`${API_BASE_URL}/api/news`)

      setAnalysisData({
        skillGap: skillGapResponse.data,
        roadmap: roadmapResponse.data,
        news: newsResponse.data
      })

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze career path. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTargetRole('')
    setCurrentSkills('')
    setAnalysisData(null)
    setError('')
  }

  if (analysisData) {
    return (
      <Dashboard 
        analysisData={analysisData} 
        targetRole={targetRole}
        onReset={handleReset}
      />
    )
  }

  return (
    <main className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <div className="card">
        <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>
          Career Pathway Analyzer
        </h1>
        
        <p style={{ marginBottom: '24px', color: '#666', textAlign: 'center' }}>
          Enter your target role and current skills to get a personalized career analysis
        </p>

        {error && <div className="error">{error}</div>}

        <div>
          <label className="label" htmlFor="targetRole">
            Target Role
          </label>
          <input
            id="targetRole"
            type="text"
            className="input"
            placeholder="e.g., Backend Developer, Frontend Developer, Data Analyst"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            disabled={loading}
          />

          <label className="label" htmlFor="currentSkills">
            Current Skills (comma-separated)
          </label>
          <textarea
            id="currentSkills"
            className="textarea"
            placeholder="e.g., Java, SQL, Git, APIs"
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
            disabled={loading}
          />

          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Analyzing...' : 'Analyze My Career Path'}
          </button>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Available Roles:</h3>
          <ul style={{ paddingLeft: '20px', color: '#666' }}>
            <li>Frontend Developer</li>
            <li>Backend Developer</li>
            <li>Data Analyst</li>
          </ul>
        </div>
      </div>
    </main>
  )
}


