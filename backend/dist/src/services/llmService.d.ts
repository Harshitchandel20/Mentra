/**
 * LLM Integration Service for Mentra
 * Handles communication with Google Gemini API for roadmap generation
 */
import { RoadmapOutput } from './outputValidator';
interface RoadmapGenerationResult {
    success: boolean;
    roadmap?: RoadmapOutput['roadmap'];
    error?: string;
    details?: any;
    rawResponse?: any;
}
declare class LLMService {
    private genAI;
    private model;
    constructor();
    /**
     * Generates a learning roadmap using the LLM
     * @param userInput - The user's learning request
     * @returns The validated roadmap or error
     */
    generateRoadmap(userInput: any): Promise<RoadmapGenerationResult>;
    /**
     * Builds the user prompt from sanitized input
     * @param input - Sanitized user input
     * @returns Formatted user prompt
     */
    private buildUserPrompt;
}
export default LLMService;
//# sourceMappingURL=llmService.d.ts.map