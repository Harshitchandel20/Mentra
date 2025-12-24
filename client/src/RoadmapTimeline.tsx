import { useState } from 'react';
import type { Roadmap, Week, Topic, Resource } from './types';
import './RoadmapTimeline.css';

interface RoadmapTimelineProps {
  roadmap: Roadmap;
  onReset?: () => void;
}

function RoadmapTimeline({ roadmap, onReset }: RoadmapTimelineProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  const toggleWeek = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  return (
    <div className="roadmap-timeline">
      <div className="timeline-header">
        <h2>Your Personalized Learning Roadmap</h2>
        {onReset && (
          <button onClick={onReset} className="reset-btn">
            Create New Roadmap
          </button>
        )}
      </div>

      <div className="roadmap-summary">
        <p><strong>Goal:</strong> {roadmap.overallGoal}</p>
        <p><strong>Total Weeks:</strong> {roadmap.totalWeeks}</p>
        <p><strong>Estimated Hours:</strong> {roadmap.totalEstimatedHours}</p>
      </div>

      <div className="weeks-container">
        {roadmap.weeks.map((week: Week) => (
          <div key={week.weekNumber} className="week-card">
            <div
              className="week-header"
              onClick={() => toggleWeek(week.weekNumber)}
            >
              <h3>Week {week.weekNumber}: {week.title}</h3>
              <span className="expand-icon">
                {expandedWeeks.has(week.weekNumber) ? '▼' : '▶'}
              </span>
            </div>

            {expandedWeeks.has(week.weekNumber) && (
              <div className="week-details">
                <div className="weekly-goal">
                  <h4>Weekly Goal</h4>
                  <p>{week.weeklyGoal}</p>
                </div>

                <div className="sequencing-explanation">
                  <h4>Why This Order?</h4>
                  <p>{week.sequencingExplanation}</p>
                </div>

                <div className="topics-list">
                  <h4>Topics</h4>
                  {week.topics.map((topic: Topic, index: number) => (
                    <div key={index} className="topic-item">
                      <h5>{topic.name}</h5>
                      <p>{topic.description}</p>
                      <p><strong>Estimated Hours:</strong> {topic.estimatedHours}</p>

                      {topic.prerequisites.length > 0 && (
                        <div className="prerequisites">
                          <strong>Prerequisites:</strong>
                          <ul>
                            {topic.prerequisites.map((prereq: string, i: number) => (
                              <li key={i}>{prereq}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {topic.resources.length > 0 && (
                        <div className="resources">
                          <strong>Resources:</strong>
                          <ul>
                            {topic.resources.map((resource: Resource, i: number) => (
                              <li key={i}>
                                <span className="resource-type">{resource.type}:</span>
                                {resource.url ? (
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    {resource.title}
                                  </a>
                                ) : (
                                  resource.title
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoadmapTimeline;