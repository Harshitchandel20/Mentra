import { useState } from 'react'
import RoadmapTimeline from './RoadmapTimeline'
import './App.css'

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

interface Goal {
  subject: string;
  specificObjective: string;
  depth: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

interface TimeConstraints {
  totalWeeks: number;
  hoursPerWeek: number;
  preferredDays: string[];
  startDate?: string;
}

interface FormData {
  skills: Skill[];
  goal: Goal;
  timeConstraints: TimeConstraints;
}

// Mock Data for Visualization
const MOCK_ROADMAP = {
  totalWeeks: 8,
  totalEstimatedHours: 64,
  overallGoal: "Master Advanced React & Ecosystem",
  prerequisiteAnalysis: "Assumes basic JS knowledge. Structured to build complexity week by week.",
  weeks: [
    {
      weekNumber: 1,
      title: "React Fundamentals & Hooks Deep Dive",
      weeklyGoal: "Master the core of React functional components",
      sequencingExplanation: "Foundational knowledge required before moving to state management.",
      topics: [
        {
          name: "Advanced Hooks",
          description: "Deep dive into useReducer, useContext, and custom hooks.",
          estimatedHours: 4,
          prerequisites: ["Basic React"],
          resources: [{ type: "article", title: "React Docs - Hooks", url: "https://react.dev" }]
        },
        {
          name: "Performance Optimization",
          description: "Understanding re-renders, useMemo, and useCallback.",
          estimatedHours: 3,
          prerequisites: ["Hooks"],
          resources: [{ type: "video", title: "React Performance", url: "#" }]
        }
      ]
    },
    {
      weekNumber: 2,
      title: "State Management Architecture",
      weeklyGoal: "scale application state effectively",
      sequencingExplanation: "State usage grows with app complexity, natural next step.",
      topics: [
        {
          name: "Redux Toolkit",
          description: "Modern Redux with slices and thunks.",
          estimatedHours: 5,
          prerequisites: ["Context API"],
          resources: [{ type: "documentation", title: "Redux Toolkit", url: "https://redux-toolkit.js.org" }]
        },
        {
          name: "Zustand & Jotai",
          description: "Exploring atomic state management alternatives.",
          estimatedHours: 3,
          prerequisites: ["State Basics"],
          resources: [{ type: "article", title: "Zustand vs Redux", url: "#" }]
        }
      ]
    },
    {
        weekNumber: 3,
        title: "Server Side Rendering with Next.js",
        weeklyGoal: "Understand SSR, SSG, and ISR",
        sequencingExplanation: "Moving from client-side to full-stack framework capabilities.",
        topics: [
            {
                name: "Next.js App Router",
                description: "Routing, Layouts, and Server Components.",
                estimatedHours: 5,
                prerequisites: ["React"],
                resources: [{ type: "course", title: "Next.js Learn", url: "https://nextjs.org/learn" }]
            },
            {
                name: "Data Fetching",
                description: "Server Actions and caching strategies.",
                estimatedHours: 4,
                prerequisites: ["Async JS"],
                resources: [{ type: "video", title: "Next.js Data Fetching", url: "#" }]
            }
        ]
    }
  ]
};

function App() {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    skills: [{ name: '', level: 'beginner', description: '' }],
    goal: { subject: '', specificObjective: '', depth: 'intermediate' },
    timeConstraints: { totalWeeks: 8, hoursPerWeek: 10, preferredDays: [] }
  });

  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    const newSkills = [...formData.skills];
    // @ts-ignore
    newSkills[index] = { ...newSkills[index], [field]: value };
    setFormData({ ...formData, skills: newSkills });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: '', level: 'beginner', description: '' }]
    });
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const handleGoalChange = (field: keyof Goal, value: string) => {
    setFormData({ ...formData, goal: { ...formData.goal, [field]: value } });
  };

  const handleTimeChange = (field: keyof TimeConstraints, value: string | number | string[]) => {
    setFormData({ ...formData, timeConstraints: { ...formData.timeConstraints, [field]: value } });
  };

  const handleDayToggle = (day: string) => {
    const currentDays = formData.timeConstraints.preferredDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    handleTimeChange('preferredDays', newDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // TODO: Send to backend API
    // For demo purposes, switch to roadmap view
    setShowRoadmap(true);
  };

  if (showRoadmap) {
    return <RoadmapTimeline roadmap={MOCK_ROADMAP} onReset={() => setShowRoadmap(false)} />;
  }

  return (
    <div className="app">
      <header>
        <h1>Mentra</h1>
        <p>AI-Powered Learning Roadmaps</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="onboarding-form">
          <h2>Tell us about yourself</h2>

          <section>
            <h3>Your Skills</h3>
            {formData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  required
                />
                <select
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={skill.description}
                  onChange={(e) => handleSkillChange(index, 'description', e.target.value)}
                />
                {formData.skills.length > 1 && (
                  <button type="button" onClick={() => removeSkill(index)}>Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSkill}>Add Skill</button>
          </section>

          <section>
            <h3>Your Learning Goal</h3>
            <input
              type="text"
              placeholder="Subject (e.g., Machine Learning)"
              value={formData.goal.subject}
              onChange={(e) => handleGoalChange('subject', e.target.value)}
              required
            />
            <textarea
              placeholder="Specific objective"
              value={formData.goal.specificObjective}
              onChange={(e) => handleGoalChange('specificObjective', e.target.value)}
              required
            />
            <select
              value={formData.goal.depth}
              onChange={(e) => handleGoalChange('depth', e.target.value)}
            >
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </section>

          <section>
            <h3>Time Constraints</h3>
            <label>
              Total weeks: 
              <input
                type="number"
                min="1"
                max="52"
                value={formData.timeConstraints.totalWeeks}
                onChange={(e) => handleTimeChange('totalWeeks', parseInt(e.target.value))}
                required
              />
            </label>
            <label>
              Hours per week: 
              <input
                type="number"
                min="1"
                max="40"
                value={formData.timeConstraints.hoursPerWeek}
                onChange={(e) => handleTimeChange('hoursPerWeek', parseInt(e.target.value))}
                required
              />
            </label>
            <div className="days-selection">
              <p>Preferred days:</p>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={formData.timeConstraints.preferredDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
              ))}
            </div>
            <label>
              Start date (optional): 
              <input
                type="date"
                value={formData.timeConstraints.startDate}
                onChange={(e) => handleTimeChange('startDate', e.target.value)}
              />
            </label>
          </section>

          <button type="submit" className="submit-btn">Generate My Learning Roadmap</button>
        </form>
      </main>
    </div>
  )
}

export default App
