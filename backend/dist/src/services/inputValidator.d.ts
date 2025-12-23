/**
 * Input Validation Module for Mentra
 * Validates user input against the defined JSON schema
 */
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
    preferredDays?: string[];
    startDate?: string;
}
interface UserInput {
    skills: Skill[];
    goal: Goal;
    timeConstraints: TimeConstraints;
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
interface SanitizeAndValidateResult {
    sanitizedInput: UserInput | null;
    validation: ValidationResult;
}
/**
 * Validates user input data against the Mentra input schema
 * @param input - The user input object to validate
 * @returns Validation result with isValid boolean and errors array
 */
declare function validateInput(input: any): ValidationResult;
/**
 * Sanitizes and validates input data
 * Performs basic sanitization before validation
 * @param rawInput - Raw input data from user
 * @returns Sanitized input and validation result
 */
declare function sanitizeAndValidateInput(rawInput: any): SanitizeAndValidateResult;
export { validateInput, sanitizeAndValidateInput, UserInput, ValidationResult };
//# sourceMappingURL=inputValidator.d.ts.map