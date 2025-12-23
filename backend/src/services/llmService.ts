/**
 * LLM Integration Service for Mentra
 * Handles communication with OpenAI API for roadmap generation
 */

import OpenAI from 'openai';
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
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
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

      // Step 3: Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4', // Using GPT-4 for better reasoning
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent structured output
        max_tokens: 4000 // Sufficient for detailed roadmaps
      });

      // Step 4: Extract and parse the response
      const responseContent = completion.choices[0].message.content;

      let parsedOutput: any;
      try {
        parsedOutput = JSON.parse(responseContent!);
      } catch (parseError) {
        return {
          success: false,
          error: 'Failed to parse AI response as JSON',
          details: (parseError as Error).message,
          rawResponse: responseContent
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

      if ((error as any).response) {
        // OpenAI API error
        return {
          success: false,
          error: 'OpenAI API error',
          details: (error as any).response.data
        };
      } else {
        // Other error
        return {
          success: false,
          error: 'Unexpected error in LLM service',
          details: (error as Error).message
        };
      }
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

    return `Please create a personalized learning roadmap with the following details:

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