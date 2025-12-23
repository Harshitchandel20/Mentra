/**
 * Output Validation Module for Mentra
 * Validates AI-generated roadmap output against the defined JSON schema
 */
interface Resource {
    type: 'book' | 'course' | 'video' | 'article' | 'tutorial' | 'documentation';
    title: string;
    url?: string;
}
interface Topic {
    name: string;
    description: string;
    estimatedHours: number;
    prerequisites: string[];
    resources: Resource[];
}
interface Week {
    weekNumber: number;
    title: string;
    topics: Topic[];
    weeklyGoal: string;
    sequencingExplanation: string;
}
interface Roadmap {
    weeks: Week[];
    totalWeeks: number;
    totalEstimatedHours: number;
    overallGoal: string;
    prerequisiteAnalysis: string;
}
interface RoadmapOutput {
    roadmap: Roadmap;
}
interface ValidationError {
    field: string;
    message: string;
    params?: any;
}
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}
interface ProcessOutputResult {
    processedOutput: RoadmapOutput | null;
    validation: ValidationResult;
}
/**
 * Validates AI-generated roadmap output against the Mentra output schema
 * @param output - The AI response object to validate
 * @returns Validation result with isValid boolean and errors array
 */
declare function validateOutput(output: any): ValidationResult;
/**
 * Validates and processes AI output
 * Performs additional business logic validation beyond schema
 * @param rawOutput - Raw AI response
 * @returns Processed output and validation result
 */
declare function validateAndProcessOutput(rawOutput: any): ProcessOutputResult;
export { validateOutput, validateAndProcessOutput, RoadmapOutput, ValidationResult };
//# sourceMappingURL=outputValidator.d.ts.map