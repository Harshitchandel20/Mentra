import WeekCard from './WeekCard';
import './Roadmap.css';

interface RoadmapData {
  weeks: any[]; // Using any for simplicity as we defined detailed types in WeekCard, ideally share types
  totalWeeks: number;
  totalEstimatedHours: number;
  overallGoal: string;
}

interface RoadmapDisplayProps {
  data: RoadmapData;
  onReset: () => void;
}

const RoadmapDisplay = ({ data, onReset }: RoadmapDisplayProps) => {
  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <button onClick={onReset} style={{ marginBottom: '1rem', background: 'transparent', border: '1px solid var(--border)' }}>
          ← Back to Settings
        </button>
        <h1>Your Learning Journey</h1>
        <p className="roadmap-goal">{data.overallGoal}</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Duration</h3>
            <p>{data.totalWeeks} Weeks</p>
          </div>
          <div className="stat-card">
            <h3>Effort</h3>
            <p>{data.totalEstimatedHours} Hours</p>
          </div>
          <div className="stat-card">
            <h3>Focus</h3>
            <p>{data.weeks.length} Modules</p>
          </div>
        </div>
      </div>

      <div className="weeks-list">
        {data.weeks.map((week) => (
          <WeekCard key={week.weekNumber} week={week} />
        ))}
      </div>
    </div>
  );
};

export default RoadmapDisplay;
