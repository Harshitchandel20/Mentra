/**
 * Input Validation Module for Mentra
 * Validates user input against the defined JSON schema
 */

const Ajv = require('ajv');
const inputSchema = require('../schemas/inputSchema.json');

const ajv = new Ajv({ allErrors: true });
const validateSchema = ajv.compile(inputSchema);

/**
 * Validates user input data against the Mentra input schema
 * @param {Object} input - The user input object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
function validateInput(input) {
  const isValid = validateSchema(input);

  if (isValid) {
    return {
      isValid: true,
      errors: []
    };
  } else {
    return {
      isValid: false,
      errors: validateSchema.errors.map(error => ({
        field: error.instancePath || '/',
        message: error.message,
        params: error.params
      }))
    };
  }
}

/**
 * Sanitizes and validates input data
 * Performs basic sanitization before validation
 * @param {Object} rawInput - Raw input data from user
 * @returns {Object} - Sanitized input and validation result
 */
function sanitizeAndValidateInput(rawInput) {
  // Basic sanitization: trim strings, remove empty arrays/objects if needed
  const sanitized = JSON.parse(JSON.stringify(rawInput)); // Deep clone

  // Trim string fields
  if (sanitized.goal) {
    if (sanitized.goal.subject) sanitized.goal.subject = sanitized.goal.subject.trim();
    if (sanitized.goal.specificObjective) sanitized.goal.specificObjective = sanitized.goal.specificObjective.trim();
  }

  if (sanitized.skills) {
    sanitized.skills = sanitized.skills.map(skill => ({
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

module.exports = {
  validateInput,
  sanitizeAndValidateInput
};