import { useState } from 'react';
import './Roadmap.css';

interface Resource {
  type: string;
  title: string;
  url?: string;
}

interface Topic {
  name: string;
  description: string;
  estimatedHours: number;
  prerequisites?: string[];
  resources: Resource[];
}

interface Week {
  weekNumber: number;
  title: string;
  weeklyGoal: string;
  sequencingExplanation: string;
  topics: Topic[];
}

interface WeekCardProps {
  week: Week;
}

const WeekCard = ({ week }: WeekCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`week-card ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="week-number-badge">{week.weekNumber}</div>
      
      <div className="week-header">
        <div className="week-title">
          <h3>{week.title}</h3>
          <div className="week-summary">Goal: {week.weeklyGoal}</div>
        </div>
        <div className="expand-icon">
          ⌄
        </div>
      </div>

      <div className="week-details" onClick={(e) => e.stopPropagation()}>
        <div className="why-section">
          <strong>Why this week?</strong> {week.sequencingExplanation}
        </div>

        <div className="topics-grid">
          {week.topics.map((topic, index) => (
            <div key={index} className="topic-card">
              <h4>{topic.name}</h4>
              <div className="topic-meta">
                <span>⏱ {topic.estimatedHours}h</span>
                {topic.prerequisites && topic.prerequisites.length > 0 && (
                  <span>🔑 Prereq: {topic.prerequisites.length}</span>
                )}
              </div>
              <p>{topic.description}</p>
              
              <div className="resources-list">
                {topic.resources.map((res, i) => (
                  <a 
                    key={i} 
                    href={res.url || '#'} 
                    className="resource-tag" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={res.title}
                  >
                    {res.type === 'video' ? '📺' : res.type === 'book' ? '📖' : '🔗'} {res.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekCard;
