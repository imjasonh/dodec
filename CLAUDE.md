# Claude Code Context

## Project Overview
A web-based 3D snub dodecahedron game built with Three.js and TypeScript. The snub dodecahedron is rendered with its mathematically correct 92 faces (12 pentagons + 80 triangles).

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
- ✅ Interactive rotation with mouse drag
- ✅ Face selection and highlighting
- ✅ Different colors for triangles (green) and pentagons (blue)
- ✅ No visible edges (wireframe opacity = 0)
- ✅ Bright lighting on all sides
- ✅ Fully opaque faces

### Development Commands
- Build: `npm run build` or `npx tsc`
- Dev mode: `npm run dev` (watches for changes)
- Open game: `open index.html` or `npm start`

### Dependencies
- TypeScript (dev)
- @types/three (dev)
- polyhedra (for geometry data)

## Next Steps
The game foundation is complete. Possible enhancements:
- Add game mechanics (scoring, objectives)
- Add sound effects
- Add animations
- Add texture mapping
- Add multiplayer support