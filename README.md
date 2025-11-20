# Garmin Workout Generator

A web application for creating custom strength training workouts compatible with Garmin devices. Built with Angular and designed to generate FIT files that can be imported into Garmin Connect.

## Features

- **Exercise Library**: Browse and select from Garmin's complete exercise library with advanced filtering
- **Workout Builder**: Drag-and-drop interface to build custom workouts with repeats and rest periods
- **Angular Material UI**: Modern, responsive interface following Material Design principles
- **FIT File Export**: Generate Garmin-compatible FIT files with custom workout names
- **FIT File Import**: Load existing workouts from FIT files for editing
- **URL-based Navigation**: Direct navigation to specific steps via URL

## Development

This project was built using various Vibe and Agent tools. You might notice from the interesting code style.

### Prerequisites

- Node.js and npm
- Angular CLI

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Run tests
npm run test

# Format code
npm run prettier
```

The application will be available at `http://localhost:4200/`

### Navigation

- `/exercises` - Browse and select exercises from the Garmin library
- `/workout` - Build your custom workout

## Technology Stack

- **Angular 20** - Modern web framework with standalone components
- **Angular Material** - UI component library
- **TypeScript** - Type-safe development
- **FIT SDK** - Garmin FIT file encoding/decoding
- **Karma/Jasmine** - Testing framework

## Project Structure

- `src/app/exercise-selector/` - Exercise browsing and filtering
- `src/app/workout-builder/` - Workout creation interface
- `src/app/fit-control/` - FIT file import/export functionality
- `src/app/fit-encoder.ts` - FIT file encoding logic
- `src/app/fit-decoder.ts` - FIT file decoding logic

## Disclaimer

⚠️ **Use at your own risk!** This software is provided as-is with no warranties whatsoever. It might break your watch, your life, or anything else. 

That said... it works for me! 😊

## Important Notes

📱 **USB Import Required**: The created FIT file needs to be imported directly via USB to your Garmin watch. Garmin doesn't support importing custom workouts via Garmin Connect - you must transfer the file manually to your device.
