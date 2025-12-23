/**
 * Input Validation Module for Mentra
 * Validates user input against the defined JSON schema
 */

import Ajv from 'ajv';
import inputSchema from '../schemas/inputSchema.json';

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

const ajv = new Ajv({ allErrors: true });
const validateSchema = ajv.compile(inputSchema);

/**
 * Validates user input data against the Mentra input schema
 * @param input - The user input object to validate
 * @returns Validation result with isValid boolean and errors array
 */
function validateInput(input: any): ValidationResult {
  const isValid = validateSchema(input);

  if (isValid) {
    return {
      isValid: true,
      errors: []
    };
  } else {
    return {
      isValid: false,
      errors: validateSchema.errors!.map(error => ({
        field: error.instancePath || '/',
        message: error.message!,
        params: error.params
      }))
    };
  }
}

/**
 * Sanitizes and validates input data
 * Performs basic sanitization before validation
 * @param rawInput - Raw input data from user
 * @returns Sanitized input and validation result
 */
function sanitizeAndValidateInput(rawInput: any): SanitizeAndValidateResult {
  // Basic sanitization: trim strings, remove empty arrays/objects if needed
  const sanitized = JSON.parse(JSON.stringify(rawInput)); // Deep clone

  // Trim string fields
  if (sanitized.goal) {
    if (sanitized.goal.subject) sanitized.goal.subject = sanitized.goal.subject.trim();
    if (sanitized.goal.specificObjective) sanitized.goal.specificObjective = sanitized.goal.specificObjective.trim();
  }

  if (sanitized.skills) {
    sanitized.skills = sanitized.skills.map((skill: any) => ({
      ...skill,
      name: skill.name ? skill.name.trim() : skill.name,
      description: skill.description ? skill.description.trim() : skill.description
    }));
  }

  // Validate the sanitized input
  const validation = validateInput(sanitized);

  return {
    sanitizedInput: validation.isValid ? sanitized : null,
    validation
  };
}

export { validateInput, sanitizeAndValidateInput, UserInput, ValidationResult };