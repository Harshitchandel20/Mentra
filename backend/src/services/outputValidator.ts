/**
 * Output Validation Module for Mentra
 * Validates AI-generated roadmap output against the defined JSON schema
 */

import Ajv from 'ajv';
import outputSchema from '../schemas/outputSchema.json';

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

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  removeAdditional: false
});
const validateSchema = ajv.compile(outputSchema);

/**
 * Validates AI-generated roadmap output against the Mentra output schema
 * @param output - The AI response object to validate
 * @returns Validation result with isValid boolean and errors array
 */
function validateOutput(output: any): ValidationResult {
  const isValid = validateSchema(output);

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
 * Validates and processes AI output
 * Performs additional business logic validation beyond schema
 * @param rawOutput - Raw AI response
 * @returns Processed output and validation result
 */
function validateAndProcessOutput(rawOutput: any): ProcessOutputResult {
  // First, validate against schema
  const validation = validateOutput(rawOutput);

  if (!validation.isValid) {
    return {
      processedOutput: null,
      validation
    };
  }

  // Additional business logic validation
  const roadmap = rawOutput.roadmap;
  const businessErrors: ValidationError[] = [];

  // Check if totalWeeks matches the number of weeks in array
  if (roadmap.weeks.length !== roadmap.totalWeeks) {
    businessErrors.push({
      field: '/roadmap/totalWeeks',
      message: `totalWeeks (${roadmap.totalWeeks}) does not match number of weeks in array (${roadmap.weeks.length})`
    });
  }

  // Check if week numbers are sequential starting from 1
  const weekNumbers = roadmap.weeks.map((w: Week) => w.weekNumber);
  const expectedWeekNumbers = Array.from({ length: roadmap.totalWeeks }, (_, i) => i + 1);
  if (!weekNumbers.every((num: number, index: number) => num === expectedWeekNumbers[index])) {
    businessErrors.push({
      field: '/roadmap/weeks',
      message: 'Week numbers are not sequential starting from 1'
    });
  }

  // Calculate total estimated hours and compare
  const calculatedTotalHours = roadmap.weeks.reduce((total: number, week: Week) => {
    return total + week.topics.reduce((weekTotal: number, topic: Topic) => weekTotal + topic.estimatedHours, 0);
  }, 0);

  if (Math.abs(calculatedTotalHours - roadmap.totalEstimatedHours) > 0.1) {
    businessErrors.push({
      field: '/roadmap/totalEstimatedHours',
      message: `totalEstimatedHours (${roadmap.totalEstimatedHours}) does not match calculated total (${calculatedTotalHours})`
    });
  }

  // Check for empty required fields
  roadmap.weeks.forEach((week: Week, weekIndex: number) => {
    if (!week.title || week.title.trim().length === 0) {
      businessErrors.push({
        field: `/roadmap/weeks/${weekIndex}/title`,
        message: 'Week title cannot be empty'
      });
    }
    if (!week.weeklyGoal || week.weeklyGoal.trim().length === 0) {
      businessErrors.push({
        field: `/roadmap/weeks/${weekIndex}/weeklyGoal`,
        message: 'Weekly goal cannot be empty'
      });
    }
    if (!week.sequencingExplanation || week.sequencingExplanation.trim().length === 0) {
      businessErrors.push({
        field: `/roadmap/weeks/${weekIndex}/sequencingExplanation`,
        message: 'Sequencing explanation cannot be empty'
      });
    }
  });

  const finalValidation: ValidationResult = {
    isValid: validation.isValid && businessErrors.length === 0,
    errors: [...validation.errors, ...businessErrors]
  };

  return {
    processedOutput: finalValidation.isValid ? rawOutput : null,
    validation: finalValidation
  };
}

export { validateOutput, validateAndProcessOutput, RoadmapOutput, ValidationResult };