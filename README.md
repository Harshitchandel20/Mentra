# Mentra
AI-Powered Learning Roadmaps

## Project Overview

Mentra is an AI-powered academic mentor that creates personalized learning roadmaps for complex subjects. Using generative AI, Mentra analyzes user skills, goals, and time constraints to generate structured, prerequisite-aware learning paths that guide learners through subjects efficiently and effectively.

## Core Features

- **Personalized Roadmap Generation**: Creates customized learning paths based on individual skills and goals
- **Prerequisite Reasoning**: Intelligently sequences topics considering dependencies and knowledge requirements
- **Motivation Layer**: Provides personalized encouragement and progress tracking
- **Smart Resource Recommendations**: Curates relevant learning materials including books, courses, and practice resources
- **Time-Adaptive Planning**: Balances weekly workload according to user availability

## High-Level Architecture

Mentra consists of three main components:

- **Frontend**: React-based user interface for onboarding and roadmap visualization
- **Backend**: Node.js server handling API requests and business logic
- **AI Integration**: LLM-powered system for generating and reasoning about learning roadmaps

The system uses structured JSON schemas for input/output validation and maintains separation between AI logic and application concerns.

## Bootcamp Compliance Notes

This project follows the specified 12-hour development roadmap, implementing features incrementally across three days. All commits are structured with clear messages, and no secrets or sensitive information are committed to the repository. The project uses standard Node.js and React practices with proper environment variable management.