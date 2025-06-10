# Globetrotter

A 3D strategy game played on a snub dodecahedron planet. Control rovers to explore, conquer, and defend territories while building structures and engaging in tactical combat.

## Play Online

Once GitHub Pages is set up, the game will be available at:
`https://[your-username].github.io/dodec/`

## Setup GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Build and deployment":
   - Source: Select "GitHub Actions"
5. Push to main branch or manually trigger the workflow
6. Wait a few minutes for the deployment
7. Your game will be live at the URL above!

## Local Development

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

## Game Features

- 3D snub dodecahedron game board (92 faces)
- Turn-based strategy for 2 players (Red vs Green)
- Pentagon faces are strategic HQ spaces
- Move, shoot, and fortify actions
- Range-based combat with dice rolls
- Fortifications block enemy movement
- Win by eliminating all enemy rovers

## Game Controls

- **Rotate Globe**: Click and drag
- **Zoom**: Scroll or pinch (limited range)
- **Select Unit**: Click on your rover
- **Move**: Click Move → Click adjacent face twice
- **Shoot**: Click Shoot → Click enemy within range
- **Fortify**: Click Fortify → Click empty adjacent space

## Technical Features

- Built with Three.js and TypeScript
- Mathematical precision (60 vertices, 150 edges)
- Mouse rotation controls
- Face selection and highlighting
- Click interactions for game logic
- TypeScript for type safety