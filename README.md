# Snub Dodecahedron Game

A 3D interactive snub dodecahedron game built with Three.js and TypeScript.

## Development

### Prerequisites

- Node.js (for TypeScript compilation)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Open `index.html` in your browser

### Development Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development (auto-rebuild on changes)
- `npm start` - Build and open in browser

### Project Structure

- `game.ts` - TypeScript source code
- `game.js` - Generated JavaScript (do not edit manually)
- `index.html` - Main HTML file
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project configuration and dependencies

## Features

- 3D snub dodecahedron with mathematical precision
- Mouse rotation controls
- Face selection and highlighting
- Click interactions for game logic
- TypeScript for type safety

## Game Controls

- **Drag** - Rotate the polyhedron
- **Click faces** - Select faces (red highlight)
- **Hover** - Face highlighting (yellow) and info display