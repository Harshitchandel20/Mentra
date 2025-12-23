"use strict";
/**
 * Input Validation Module for Mentra
 * Validates user input against the defined JSON schema
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
exports.sanitizeAndValidateInput = sanitizeAndValidateInput;
const ajv_1 = __importDefault(require("ajv"));
const inputSchema_json_1 = __importDefault(require("../schemas/inputSchema.json"));
const ajv = new ajv_1.default({ allErrors: true });
const validateSchema = ajv.compile(inputSchema_json_1.default);
/**
 * Validates user input data against the Mentra input schema
 * @param input - The user input object to validate
 * @returns Validation result with isValid boolean and errors array
 */
function validateInput(input) {
    const isValid = validateSchema(input);
    if (isValid) {
        return {
            isValid: true,
            errors: []
        };
    }
    else {
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
 * @param rawInput - Raw input data from user
 * @returns Sanitized input and validation result
 */
function sanitizeAndValidateInput(rawInput) {
    // Basic sanitization: trim strings, remove empty arrays/objects if needed
    const sanitized = JSON.parse(JSON.stringify(rawInput)); // Deep clone
    // Trim string fields
    if (sanitized.goal) {
        if (sanitized.goal.subject)
            sanitized.goal.subject = sanitized.goal.subject.trim();
        if (sanitized.goal.specificObjective)
            sanitized.goal.specificObjective = sanitized.goal.specificObjective.trim();
    }
    if (sanitized.skills) {
        sanitized.skills = sanitized.skills.map((skill) => ({
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
//# sourceMappingURL=inputValidator.js.map