# Snub Dodecahedron Game Project

## Overview
This is a 3D strategy game called "Globetrotter" based on a snub dodecahedron polyhedron with 92 faces (12 pentagons + 80 triangles).

## Technical Stack
- Three.js for 3D rendering (loaded via CDN)
- TypeScript for source code
- Simple HTML/CSS for UI
- NPM for build process

## Project Structure
```
dodec/
├── index.html      # Main HTML file with Three.js CDN imports
├── game.ts         # TypeScript source file
├── game.js         # Compiled JavaScript (generated)
├── package.json    # NPM configuration
├── tsconfig.json   # TypeScript configuration
└── CLAUDE.md       # This file
```

## Key Features Implemented
1. **Polyhedron Rendering**: Accurate snub dodecahedron with 60 vertices, 92 faces
2. **Face Selection**: Click to select faces, visual feedback with colors
3. **Camera Controls**: Orbit controls with zoom limits (2.5-15 units)
4. **TypeScript Architecture**: Clean, modular code with proper types
5. **Face Data**: Exact vertex and face connectivity from polyhedra npm package
6. **Game State**: 2-player turn-based system with serializable state
7. **Unit Movement**: Rovers move to adjacent spaces with double-click confirmation
8. **Visual Styling**: Gray color scheme with blue selection highlights
9. **Shooting**: Range-based combat (3 spaces, +2 from HQ), 1d6 roll (4+ hits)
10. **Fortifications**: Build cube barriers that block enemy movement
11. **Action Menu**: Click rover for Move/Shoot/Fortify options
12. **Tooltips**: Hover over units to see HP information
13. **UI Feedback**: Messages appear at bottom of screen

## Game Rules Status

### Implemented ✓
- Basic 2-player turn system (red/green)
- Rovers with 5 HP that can move to adjacent spaces
- Pentagon faces are HQ spaces
- Shooting with range calculation and dice rolls
- Fortifications (1 HP, block enemy movement)
- Win condition: eliminate all enemy rovers
- HQ bonus: +2 shooting range from pentagon spaces
- Visual feedback for valid moves/targets

### Not Yet Implemented ✗
1. **Multiple Rovers**: 
   - Start with 1 rover each, can build more at Factory
   - UI to select which rover to control

2. **Buildings**:
   - **Space Port**: Move to any space, can traverse enemy fortifications
   - **Factory**: Build new rovers (max 5 HP)
   - **Drill Cannon**: Damage all units on a space, destroy planet at 8 shots
   - **Treasury**: Store action points (max 3)

3. **Action Points**:
   - Only used by Treasury buildings
   - Spend to shoot twice or move+shoot in one turn

4. **Advanced Combat**:
   - Shooting through fortifications
   - Multi-unit combat on same space
   - Drill Cannon planet destruction

5. **Special Rules**:
   - Can't build on HQ spaces
   - Factory produces rovers on adjacent spaces
   - Buildings can't move but can be destroyed

## Color Scheme
- Triangles: Light gray (#BDBDBD)
- Pentagons: Medium gray (#9E9E9E)  
- Selection: Medium blue (#2196F3)
- Hover: Light blue (#42A5F5)
- Background: Dark (#111111)
- Player colors: Red (#F44336), Green (#4CAF50)
- Fortifications: Dark red (#8B0000), Dark green (#006400)
- Valid targets: Orange (#FF5722)
- Valid moves: Green (#4CAF50)
- Pending move: Yellow (#FFEB3B)

## Build Process
```bash
npm run build   # Compile TypeScript to JavaScript
npm run watch   # Watch mode for development
```

## Controls
- Click and drag to rotate globe
- Scroll/pinch to zoom (limited 2.5-15 units)
- Click your rover to see action menu
- Click action button then target to execute
- Move requires double-click confirmation

## Next Priority Tasks
1. [ ] Building construction UI and mechanics
2. [ ] Multiple rover management
3. [ ] Space Port implementation
4. [ ] Factory rover production
5. [ ] Drill Cannon mechanics
6. [ ] Treasury and action points
7. [ ] Save/load game state
8. [ ] Sound effects
9. [ ] Victory screen
10. [ ] Network multiplayer