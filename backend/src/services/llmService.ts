/**
 * LLM Integration Service for Mentra
 * Handles communication with Google Gemini API for roadmap generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizeAndValidateInput, UserInput, ValidationResult } from './inputValidator';
import { validateAndProcessOutput, RoadmapOutput } from './outputValidator';
import SYSTEM_PROMPT from '../prompts/systemPrompt';

interface RoadmapGenerationResult {
  success: boolean;
  roadmap?: RoadmapOutput['roadmap'];
  error?: string;
  details?: any;
  rawResponse?: any;
}

class LLMService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Generates a learning roadmap using the LLM
   * @param userInput - The user's learning request
   * @returns The validated roadmap or error
   */
  async generateRoadmap(userInput: any): Promise<RoadmapGenerationResult> {
    try {
      // Step 1: Validate and sanitize input
      const { sanitizedInput, validation: inputValidation } = sanitizeAndValidateInput(userInput);

      if (!inputValidation.isValid) {
        return {
          success: false,
          error: 'Invalid input',
          details: inputValidation.errors
        };
      }

      // Step 2: Prepare the user prompt
      const userPrompt = this.buildUserPrompt(sanitizedInput!);

      // Step 3: Call Gemini API
      const result = await this.model.generateContent(userPrompt);
      const response = await result.response;
      const responseText = response.text();

      // Step 4: Extract and parse the response
      let parsedOutput: any;
      try {
        // Gemini might include markdown, so clean it
        const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
        parsedOutput = JSON.parse(cleanedText);
      } catch (parseError) {
        return {
          success: false,
          error: 'Failed to parse AI response as JSON',
          details: (parseError as Error).message,
          rawResponse: responseText
        };
      }

      // Step 5: Validate the output
      const { processedOutput, validation: outputValidation } = validateAndProcessOutput(parsedOutput);

      if (!outputValidation.isValid) {
        return {
          success: false,
          error: 'AI response does not match expected schema',
          details: outputValidation.errors,
          rawResponse: parsedOutput
        };
      }

      // Step 6: Return the validated roadmap
      return {
        success: true,
        roadmap: processedOutput!.roadmap
      };

    } catch (error) {
      console.error('LLM Service Error:', error);

      return {
        success: false,
        error: 'Unexpected error in LLM service',
        details: (error as Error).message
      };
    }
  }

  /**
   * Builds the user prompt from sanitized input
   * @param input - Sanitized user input
   * @returns Formatted user prompt
   */
  private buildUserPrompt(input: UserInput): string {
    const skillsText = input.skills.map(skill =>
      `- ${skill.name} (${skill.level})${skill.description ? `: ${skill.description}` : ''}`
    ).join('\n');

    const goalText = `${input.goal.subject} - ${input.goal.specificObjective} (Depth: ${input.goal.depth})`;

    const timeText = `${input.timeConstraints.totalWeeks} weeks, ${input.timeConstraints.hoursPerWeek} hours per week`;

    return `${SYSTEM_PROMPT}\n\nPlease create a personalized learning roadmap with the following details:

User Skills:
${skillsText}

Learning Goal:
${goalText}

Time Constraints:
${timeText}

Please generate a comprehensive, prerequisite-aware learning roadmap that fits within these constraints.`;
  }
}

export default LLMService;