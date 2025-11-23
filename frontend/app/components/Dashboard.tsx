'use client'

import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface DashboardProps {
  analysisData: {
    skillGap: {
      matchedSkills: string[]
      missingSkills: string[]
      recommendations: string[]
      suggestedLearningOrder: string[]
    }
    roadmap: {
      targetRole: string
      roadmap: Array<{
        phase: string
        topics: string[]
      }>
    }
    news: {
      stories: Array<{
        id: number
        title: string
        url: string
        score: number
        time: string
        type: string
        by: string
      }>
    }
  }
  targetRole: string
  onReset: () => void
}

export default function Dashboard({ analysisData, targetRole, onReset }: DashboardProps) {
  const [news, setNews] = useState(analysisData.news.stories)
  const [loadingNews, setLoadingNews] = useState(false)

  // Refresh news periodically (optional)
  const refreshNews = async () => {
    setLoadingNews(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`)
      setNews(response.data.stories)
    } catch (error) {
      console.error('Failed to refresh news:', error)
    } finally {
      setLoadingNews(false)
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Unknown'
    const date = new Date(timeString)
    return date.toLocaleString()
  }

  return (
    <main className="container" style={{ marginTop: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Career Analysis Dashboard</h1>
        <button className="btn btn-primary" onClick={onReset}>
          Start New Analysis
        </button>
      </div>

      {/* Target Role Display */}
      <div className="card" style={{ marginBottom: '24px', backgroundColor: '#e3f2fd' }}>
        <h2 style={{ borderBottom: '2px solid #1976d2' }}>
          Target Role: {analysisData.roadmap.targetRole}
        </h2>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-2" style={{ marginBottom: '24px' }}>
        {/* Left Side: Skill Gap Results */}
        <div className="card">
          <h2>Skill Gap Analysis</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Matched Skills ({analysisData.skillGap.matchedSkills.length})</h3>
            {analysisData.skillGap.matchedSkills.length > 0 ? (
              <div>
                {analysisData.skillGap.matchedSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag matched">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No matching skills found</p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Missing Skills ({analysisData.skillGap.missingSkills.length})</h3>
            {analysisData.skillGap.missingSkills.length > 0 ? (
              <div>
                {analysisData.skillGap.missingSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag missing">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>Great! You have all required skills.</p>
            )}
          </div>

          <div>
            <h3>Recommendations</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {analysisData.skillGap.recommendations.map((rec, idx) => (
                <li key={idx} style={{ marginBottom: '8px', color: '#555' }}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {analysisData.skillGap.suggestedLearningOrder.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Suggested Learning Order</h3>
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                {analysisData.skillGap.suggestedLearningOrder.map((skill, idx) => (
                  <li key={idx} style={{ marginBottom: '6px', color: '#555' }}>
                    {skill}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right Side: Career Roadmap */}
        <div className="card">
          <h2>Career Roadmap</h2>
          
          {analysisData.roadmap.roadmap.map((phase, idx) => (
            <div key={idx} className="roadmap-phase">
              <h4>{phase.phase}</h4>
              <ul className="roadmap-topics">
                {phase.topics.map((topic, topicIdx) => (
                  <li key={topicIdx}>{topic}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Latest Tech News */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Latest Tech News (HackerNews)</h2>
          <button 
            className="btn btn-primary" 
            onClick={refreshNews}
            disabled={loadingNews}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            {loadingNews ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {news.length > 0 ? (
          <div>
            {news.map((story) => (
              <div key={story.id} className="news-item">
                <h4>
                  <a href={story.url} target="_blank" rel="noopener noreferrer">
                    {story.title}
                  </a>
                </h4>
                <div className="news-meta">
                  <span>Score: {story.score}</span>
                  <span style={{ marginLeft: '16px' }}>By: {story.by}</span>
                  <span style={{ marginLeft: '16px' }}>Time: {formatTime(story.time)}</span>
                  <span style={{ marginLeft: '16px' }}>Type: {story.type}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="loading">No news stories available</p>
        )}
      </div>
    </main>
  )
}

