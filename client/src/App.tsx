import { useState } from 'react'
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

function App() {
  const [formData, setFormData] = useState<FormData>({
    skills: [{ name: '', level: 'beginner', description: '' }],
    goal: { subject: '', specificObjective: '', depth: 'intermediate' },
    timeConstraints: { totalWeeks: 8, hoursPerWeek: 10, preferredDays: [] }
  });

  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    const newSkills = [...formData.skills];
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
    alert('Form submitted! Check console for data.');
  };

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
