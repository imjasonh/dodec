# Claude Code Context

## Project Overview
Globetrotter - A 3D strategy game for 2+ players played on a snub dodecahedron planet. Players control Rovers to explore, conquer, and defend territories while building structures and engaging in tactical combat.

## Key Learnings

### Snub Dodecahedron Geometry
- Also known as "snub icosidodecahedron" in mathematical literature
- Has exactly 92 faces: 12 regular pentagons and 80 equilateral triangles
- 60 vertices and 150 edges
- Vertex and face data sourced from George Hart's Virtual Polyhedra via the `polyhedra` npm package

### Technical Implementation
1. **Face Rendering**: Each face is rendered as a separate mesh to enable individual interaction
2. **Pentagon Triangulation**: Pentagons are triangulated using a fan pattern from vertex 0
3. **Transparency Issues**: Setting `transparent: true` in Three.js can cause rendering artifacts even with `opacity: 1.0`. Solution: use `transparent: false` for opaque materials
4. **Lighting**: Ambient light intensity of 1.8 provides good visibility on all sides

### Project Structure
- `game.ts`: Main TypeScript source with embedded polyhedra data
- `game.js`: Compiled JavaScript (gitignored)
- `index.html`: Simple HTML with Three.js CDN imports
- Build: `npx tsc` compiles TypeScript to JavaScript

### Current Features
- ✅ Mathematically accurate snub dodecahedron with 92 faces
- ✅ 12 Pentagon spaces serve as HQ locations
- ✅ 80 Triangle spaces for regular gameplay
- ✅ Interactive rotation with mouse drag
- ✅ Face selection and highlighting
- ✅ Two-player turn-based strategy (red vs green)
- ✅ Rovers with 5 hit points each
- ✅ Movement to adjacent faces only
- ✅ Collision detection (units cannot stack)
- ✅ Enemy fortifications block movement
- ✅ Win/loss conditions implemented
- ✅ Game state serialization for save/load

### Development Commands
- Build: `npm run build` or `npx tsc`
- Dev mode: `npm run dev` (watches for changes)
- Open game: `open index.html` or `npm start`

### Dependencies
- TypeScript (dev)
- @types/three (dev)
- polyhedra (for geometry data)

## Game Rules (Globetrotter)

### Setup
- Each player starts with one Rover in a random HQ (pentagon) space
- Rovers have 5 hit points

### On Your Turn (Choose One Action)
1. **Move**: Move a Rover to an adjacent space
2. **Fortify**: Place a fortification (not yet implemented)
3. **Shoot**: Attack enemy units within 3 spaces (not yet implemented)
4. **Build**: Construct buildings in HQ spaces (not yet implemented)
5. **Destroy**: Remove HQ buildings (not yet implemented)

### Movement Rules
- Rovers move 1 space to adjacent faces
- Cannot move through enemy fortifications
- Cannot stack units on same space

### Victory Conditions
- Eliminate all enemy Rovers AND they have no Factory to build new ones
- If all players lose simultaneously, everyone loses
- Planet destruction (8+ drill cannon shots) ends game

## API Methods
- `exportGameState()`: Returns serialized game data for saving
- `importGameState(data)`: Loads a saved game state

## Not Yet Implemented
- Fortification placement and mechanics
- Shooting/combat system (range calculation, dice rolls)
- Building construction (Space Port, Factory, Drill Cannon, Treasury)
- Special building abilities
- Action point storage (Treasury)
- Rover production (Factory)
- Orbital mechanics (Space Port)
- Drill Cannon charging/firing
- Multi-rover selection UI
- Visual indicators for valid moves
- Sound effects and animations