// Mathematical constants
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const XI_CONSTANT = 0.94315125924; // Real zero of x³ + 2x² - φ² = 0

// Game constants
const GAME_CONSTANTS = {
    ROVER_MAX_HP: 5,
    BUILDING_MAX_HP: 5,
    FORTIFICATION_HP: 1,
    SHOOT_RANGE: 3,
    HQ_RANGE_COST: 2,
    DRILL_CANNON_PLANET_DESTROY_THRESHOLD: 8,
    TREASURY_MAX_POINTS: 3
};

// Three.js types - global declaration for CDN usage
declare const THREE: any;

interface FaceUserData {
    faceId: number;
    type: 'triangle' | 'pentagon';
}

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface GameConfig {
    readonly cameraPosition: Vector3;
    readonly colors: {
        readonly triangle: number;
        readonly pentagon: number;
        readonly hover: number;
        readonly selected: number;
        readonly wireframe: number;
        readonly background: number;
        readonly playerRed: number;
        readonly playerGreen: number;
    };
    readonly lighting: {
        readonly ambient: { color: number; intensity: number };
        readonly directional: { color: number; intensity: number; position: Vector3 };
        readonly point: { color: number; intensity: number; position: Vector3 };
    };
}

const DEFAULT_CONFIG: GameConfig = {
    cameraPosition: { x: 5, y: 5, z: 5 },
    colors: {
        triangle: 0xBDBDBD,
        pentagon: 0x9E9E9E,
        hover: 0x42A5F5,
        selected: 0x2196F3,
        wireframe: 0xffffff,
        background: 0x111111,
        playerRed: 0xF44336,
        playerGreen: 0x4CAF50
    },
    lighting: {
        ambient: { color: 0x404040, intensity: 1.8 },
        directional: { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 5, z: 5 } },
        point: { color: 0xffffff, intensity: 0.4, position: { x: -5, y: -5, z: 5 } }
    }
};

// Face connectivity data for snub dodecahedron
interface SnubDodecahedronFaces {
    triangles: number[][];  // 80 triangles, each with 3 vertex indices
    pentagons: number[][]; // 12 pentagons, each with 5 vertex indices
}

// Vertex data from George Hart's Virtual Polyhedra
interface SnubDodecahedronData {
    vertices: number[][];
    triangles: number[][];
    pentagons: number[][];
}

// Game state types
type Player = 'red' | 'green';
type SpaceType = 'triangle' | 'pentagon';
type BuildingType = 'spaceport' | 'factory' | 'drillcannon' | 'treasury';

interface Unit {
    player: Player;
    hitPoints: number;
    maxHitPoints: number;
}

interface Rover extends Unit {
    type: 'rover';
    faceId: number;
}

interface Building extends Unit {
    type: 'building';
    buildingType: BuildingType;
    faceId: number;
}

interface Fortification {
    type: 'fortification';
    player: Player;
    faceId: number;
    hitPoints: number;
}

interface GameState {
    currentPlayer: Player;
    rovers: Rover[];
    buildings: Building[];
    fortifications: Fortification[];
    moveHistory: string[];
    gameStarted: boolean;
    actionPointsStored: {
        red: number;
        green: number;
    };
    drillCannonShots: number;
}

// Serializable game data for network/save
interface SerializedGameData {
    version: string;
    timestamp: number;
    state: GameState;
}

// Exact face connectivity data from George Hart's Virtual Polyhedra
// via the polyhedra npm package (SnubIcosidodecahedron)
const SNUB_DODECAHEDRON_DATA: SnubDodecahedronData = {
    // 60 vertices
    vertices: [
        [0, 0, 1.028031],
        [0.4638569, 0, 0.9174342],
        [0.2187436, 0.4090409, 0.9174342],
        [-0.2575486, 0.3857874, 0.9174342],
        [-0.4616509, -0.04518499, 0.9174342],
        [-0.177858, -0.4284037, 0.9174342],
        [0.5726782, -0.4284037, 0.7384841],
        [0.8259401, -0.04518499, 0.6104342],
        [0.6437955, 0.3857874, 0.702527],
        [0.349648, 0.7496433, 0.6104342],
        [-0.421009, 0.7120184, 0.6104342],
        [-0.6783139, 0.3212396, 0.702527],
        [-0.6031536, -0.4466658, 0.702527],
        [-0.2749612, -0.7801379, 0.6104342],
        [0.1760766, -0.6931717, 0.7384841],
        [0.5208138, -0.7801379, 0.4206978],
        [0.8552518, -0.4466658, 0.3547998],
        [1.01294, -0.03548596, 0.1718776],
        [0.7182239, 0.661842, 0.3208868],
        [0.3633691, 0.9454568, 0.1758496],
        [-0.04574087, 0.9368937, 0.4206978],
        [-0.4537394, 0.905564, 0.1758496],
        [-0.7792791, 0.5887312, 0.3208868],
        [-0.9537217, 0.1462217, 0.3547998],
        [-0.9072701, -0.3283699, 0.3547998],
        [-0.6503371, -0.7286577, 0.3208868],
        [0.08459482, -0.9611501, 0.3547998],
        [0.3949153, -0.9491262, -0.007072558],
        [0.9360473, -0.409557, -0.1136978],
        [0.9829382, 0.02692292, -0.2999274],
        [0.9463677, 0.4014808, -0.007072558],
        [0.6704578, 0.7662826, -0.1419366],
        [-0.05007646, 1.025698, -0.04779978],
        [-0.4294337, 0.8845784, -0.2999274],
        [-0.9561681, 0.3719321, -0.06525234],
        [-1.022036, -0.1000338, -0.04779978],
        [-0.8659056, -0.5502712, -0.06525234],
        [-0.5227761, -0.8778535, -0.1136978],
        [-0.06856319, -1.021542, -0.09273844],
        [0.2232046, -0.8974878, -0.4489366],
        [0.6515438, -0.7200947, -0.3373472],
        [0.7969535, -0.3253959, -0.5619888],
        [0.8066872, 0.4395354, -0.461425],
        [0.4468035, 0.735788, -0.5619888],
        [0.001488801, 0.8961155, -0.503809],
        [-0.3535403, 0.6537658, -0.7102452],
        [-0.7399517, 0.5547758, -0.4489366],
        [-0.9120238, 0.1102196, -0.461425],
        [-0.6593998, -0.6182798, -0.4896639],
        [-0.2490651, -0.8608088, -0.503809],
        [0.4301047, -0.5764987, -0.734512],
        [0.5057577, -0.1305283, -0.8854492],
        [0.5117735, 0.3422252, -0.8232973],
        [0.09739587, 0.5771941, -0.8451093],
        [-0.6018946, 0.2552591, -0.7933564],
        [-0.6879024, -0.2100741, -0.734512],
        [-0.3340437, -0.5171509, -0.8232973],
        [0.08570633, -0.3414376, -0.9658797],
        [0.1277354, 0.1313635, -1.011571],
        [-0.3044499, -0.06760332, -0.979586]
    ],

    // 80 triangular faces
    triangles: [
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 5],
        [1, 6, 7],
        [1, 7, 8],
        [1, 8, 2],
        [2, 8, 9],
        [3, 10, 11],
        [3, 11, 4],
        [4, 12, 5],
        [5, 12, 13],
        [5, 13, 14],
        [6, 14, 15],
        [6, 15, 16],
        [6, 16, 7],
        [7, 16, 17],
        [8, 18, 9],
        [9, 18, 19],
        [9, 19, 20],
        [10, 20, 21],
        [10, 21, 22],
        [10, 22, 11],
        [11, 22, 23],
        [12, 24, 25],
        [12, 25, 13],
        [13, 26, 14],
        [14, 26, 15],
        [15, 26, 27],
        [16, 28, 17],
        [17, 28, 29],
        [17, 29, 30],
        [18, 30, 31],
        [18, 31, 19],
        [19, 32, 20],
        [20, 32, 21],
        [21, 32, 33],
        [22, 34, 23],
        [23, 34, 35],
        [23, 35, 24],
        [24, 35, 36],
        [24, 36, 25],
        [25, 36, 37],
        [26, 38, 27],
        [27, 38, 39],
        [27, 39, 40],
        [28, 40, 41],
        [28, 41, 29],
        [29, 42, 30],
        [30, 42, 31],
        [31, 42, 43],
        [32, 44, 33],
        [33, 44, 45],
        [33, 45, 46],
        [34, 46, 47],
        [34, 47, 35],
        [36, 48, 37],
        [37, 48, 49],
        [37, 49, 38],
        [38, 49, 39],
        [39, 50, 40],
        [40, 50, 41],
        [41, 50, 51],
        [42, 52, 43],
        [43, 52, 53],
        [43, 53, 44],
        [44, 53, 45],
        [45, 54, 46],
        [46, 54, 47],
        [47, 54, 55],
        [48, 55, 56],
        [48, 56, 49],
        [50, 57, 51],
        [51, 57, 58],
        [51, 58, 52],
        [52, 58, 53],
        [54, 59, 55],
        [55, 59, 56],
        [56, 59, 57],
        [57, 59, 58]
    ],

    // 12 pentagonal faces
    pentagons: [
        [0, 5, 14, 6, 1],
        [2, 9, 20, 10, 3],
        [4, 11, 23, 24, 12],
        [7, 17, 30, 18, 8],
        [13, 25, 37, 38, 26],
        [15, 27, 40, 28, 16],
        [19, 31, 43, 44, 32],
        [21, 33, 46, 34, 22],
        [29, 41, 51, 52, 42],
        [35, 47, 55, 48, 36],
        [39, 49, 56, 57, 50],
        [45, 53, 58, 59, 54]
    ]

};

// Pure mathematical geometry functions (easily testable)
class SnubDodecahedronGeometry {
    static generateVertices(): any[] {
        // Use exact vertex coordinates from George Hart's Virtual Polyhedra
        return SNUB_DODECAHEDRON_DATA.vertices.map(
            coords => new THREE.Vector3(coords[0], coords[1], coords[2])
        );
    }

    static getFaceConnectivity(): SnubDodecahedronFaces {
        // Use exact face connectivity from George Hart's Virtual Polyhedra
        return {
            triangles: SNUB_DODECAHEDRON_DATA.triangles,
            pentagons: SNUB_DODECAHEDRON_DATA.pentagons
        };
    }

    static buildFaceAdjacencyMap(): Map<number, Set<number>> {
        const adjacencyMap = new Map<number, Set<number>>();
        const allFaces = [
            ...SNUB_DODECAHEDRON_DATA.triangles,
            ...SNUB_DODECAHEDRON_DATA.pentagons
        ];

        // Initialize all faces
        for (let i = 0; i < allFaces.length; i++) {
            adjacencyMap.set(i, new Set<number>());
        }

        // Two faces are adjacent if they share exactly 2 vertices
        for (let i = 0; i < allFaces.length; i++) {
            for (let j = i + 1; j < allFaces.length; j++) {
                const face1 = allFaces[i];
                const face2 = allFaces[j];

                // Count shared vertices
                let sharedVertices = 0;
                for (const v1 of face1) {
                    if (face2.includes(v1)) {
                        sharedVertices++;
                    }
                }

                if (sharedVertices === 2) {
                    adjacencyMap.get(i)!.add(j);
                    adjacencyMap.get(j)!.add(i);
                }
            }
        }

        return adjacencyMap;
    }
    
    static getFaceType(faceId: number): SpaceType {
        // First 80 faces are triangles, next 12 are pentagons (HQ spaces)
        return faceId < 80 ? 'triangle' : 'pentagon';
    }
    
    static getHQSpaces(): number[] {
        // Pentagon faces start at index 80
        return Array.from({ length: 12 }, (_, i) => 80 + i);
    }
    
    static calculateDistance(from: number, to: number, adjacencyMap: Map<number, Set<number>>): number {
        // BFS to find shortest path
        if (from === to) return 0;
        
        const visited = new Set<number>();
        const queue: {face: number, distance: number}[] = [{face: from, distance: 0}];
        visited.add(from);
        
        while (queue.length > 0) {
            const current = queue.shift()!;
            const neighbors = adjacencyMap.get(current.face);
            
            if (!neighbors) continue;
            
            for (const neighbor of neighbors) {
                if (neighbor === to) {
                    return current.distance + 1;
                }
                
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push({face: neighbor, distance: current.distance + 1});
                }
            }
        }
        
        return -1; // No path found
    }
}

// Utility functions (pure and testable)
class GeometryUtils {
    static createFaceGeometry(vertices: Float32Array): any {
        const faceGeometry = new THREE.BufferGeometry();
        faceGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        faceGeometry.computeVertexNormals();
        return faceGeometry;
    }

    static extractTriangleVertices(positions: Float32Array, indices: number[], startIndex: number): Float32Array {
        const faceVertices = new Float32Array(9);

        for (let j = 0; j < 3; j++) {
            const vertexIndex = indices[startIndex + j] * 3;
            faceVertices[j * 3] = positions[vertexIndex];
            faceVertices[j * 3 + 1] = positions[vertexIndex + 1];
            faceVertices[j * 3 + 2] = positions[vertexIndex + 2];
        }

        return faceVertices;
    }

    static createFaceUserData(index: number, type: 'triangle' | 'pentagon'): FaceUserData {
        return { faceId: index, type: type };
    }

    static createFaceFromVertices(vertices: any[], indices: number[]): any {
        const faceVertices = new Float32Array(indices.length * 3);

        for (let i = 0; i < indices.length; i++) {
            const vertex = vertices[indices[i]];
            faceVertices[i * 3] = vertex.x;
            faceVertices[i * 3 + 1] = vertex.y;
            faceVertices[i * 3 + 2] = vertex.z;
        }

        const faceGeometry = new THREE.BufferGeometry();
        faceGeometry.setAttribute('position', new THREE.BufferAttribute(faceVertices, 3));

        // Create triangulation indices for non-triangular faces
        if (indices.length === 5) {
            // Pentagon: triangulate as fan from vertex 0
            const triangulationIndices = [0, 1, 2, 0, 2, 3, 0, 3, 4];
            faceGeometry.setIndex(triangulationIndices);
        }

        faceGeometry.computeVertexNormals();
        return faceGeometry;
    }
}

// UI utilities
class UIUtils {
    static updateFaceInfo(faceId: number, type: string): void {
        // Don't update during game - UI is used for game info
    }

    static clearFaceInfo(): void {
        const faceInfoElement = document.getElementById('face-info');
        if (faceInfoElement) {
            faceInfoElement.textContent = 'Face: None';
        }
    }

    static calculateMousePosition(event: MouseEvent): { x: number; y: number } {
        return {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1
        };
    }
}

class SnubDodecahedronGame {
    private scene: any;
    private camera: any;
    private renderer: any;
    private polyhedron: any | null = null;
    private faces: any[] = [];
    private selectedFace: any | null = null;
    private raycaster: any;
    private mouse: any;
    private controls: any;
    private config: GameConfig;

    // Game state
    private gameState: GameState;
    private faceAdjacencyMap: Map<number, Set<number>>;
    private roverMeshes: Map<Rover, any> = new Map();
    private buildingMeshes: Map<Building, any> = new Map();
    private fortificationMeshes: Map<Fortification, any> = new Map();
    
    // UI state
    private selectedRover: Rover | null = null;
    private actionMode: 'none' | 'move' | 'shoot' | 'fortify' = 'none';
    private pendingMoveFaceId: number | null = null;

    constructor(config: GameConfig = DEFAULT_CONFIG) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Initialize game state
        this.gameState = {
            currentPlayer: 'red',
            rovers: [],
            buildings: [],
            fortifications: [],
            moveHistory: [],
            gameStarted: false,
            actionPointsStored: {
                red: 0,
                green: 0
            },
            drillCannonShots: 0
        };

        // Build adjacency map
        this.faceAdjacencyMap = SnubDodecahedronGeometry.buildFaceAdjacencyMap();

        this.init();
    }

    private init(): void {
        this.setupRenderer();
        this.setupCamera();
        this.setupControls();
        this.createSnubDodecahedron();
        this.setupLighting();
        this.setupEventListeners();
        this.setupGame();
        this.animate();
    }

    private setupRenderer(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(this.config.colors.background);
        const container = document.getElementById('container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    private setupCamera(): void {
        const pos = this.config.cameraPosition;
        this.camera.position.set(pos.x, pos.y, pos.z);
    }

    private setupControls(): void {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Set zoom limits
        this.controls.minDistance = 2.5;  // Don't get closer than this
        this.controls.maxDistance = 15;   // Don't get farther than this
    }

    private createSnubDodecahedronVertices(): any[] {
        return SnubDodecahedronGeometry.generateVertices();
    }

    private createSnubDodecahedron(): void {
        const vertices = this.createSnubDodecahedronVertices();
        const faceData = SnubDodecahedronGeometry.getFaceConnectivity();

        // Create faces using exact connectivity data
        this.createFacesFromData(vertices, faceData);
        this.createWireframeFromVertices(vertices);
        this.createPolyhedronGroup();
    }

    private createTriangleMaterial(): any {
        return new THREE.MeshLambertMaterial({
            color: this.config.colors.triangle,
            transparent: false,
            side: THREE.DoubleSide
        });
    }

    private createPentagonMaterial(): any {
        return new THREE.MeshLambertMaterial({
            color: this.config.colors.pentagon,
            transparent: false,
            side: THREE.DoubleSide
        });
    }

    private createFacesFromData(vertices: any[], faceData: SnubDodecahedronFaces): void {
        const triangleMaterial = this.createTriangleMaterial();
        const pentagonMaterial = this.createPentagonMaterial();

        this.faces = [];
        let faceIndex = 0;

        // Create triangle faces
        faceData.triangles.forEach((triangleIndices) => {
            const faceGeometry = GeometryUtils.createFaceFromVertices(vertices, triangleIndices);
            const face = new THREE.Mesh(faceGeometry, triangleMaterial.clone());
            face.userData = GeometryUtils.createFaceUserData(faceIndex++, 'triangle');

            this.faces.push(face);
            this.scene.add(face);
        });

        // Create pentagon faces
        faceData.pentagons.forEach((pentagonIndices) => {
            const faceGeometry = GeometryUtils.createFaceFromVertices(vertices, pentagonIndices);
            const face = new THREE.Mesh(faceGeometry, pentagonMaterial.clone());
            face.userData = GeometryUtils.createFaceUserData(faceIndex++, 'pentagon');

            this.faces.push(face);
            this.scene.add(face);
        });
    }

    private createWireframeFromVertices(vertices: any[]): void {
        // Create a BufferGeometry from vertices for wireframe
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(vertices.length * 3);

        vertices.forEach((v, i) => {
            positions[i * 3] = v.x;
            positions[i * 3 + 1] = v.y;
            positions[i * 3 + 2] = v.z;
        });

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Use ConvexGeometry just for the wireframe
        const convexGeometry = new THREE.ConvexGeometry(vertices);
        const wireframe = new THREE.WireframeGeometry(convexGeometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.color.setHex(this.config.colors.wireframe);
        line.material.opacity = 0;
        line.material.transparent = true;
        this.scene.add(line);
    }

    private createPolyhedronGroup(): void {
        this.polyhedron = new THREE.Group();
        this.faces.forEach(face => this.polyhedron.add(face));
        this.scene.add(this.polyhedron);
    }

    private setupLighting(): void {
        const { ambient, directional, point } = this.config.lighting;

        const ambientLight = new THREE.AmbientLight(ambient.color, ambient.intensity);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(directional.color, directional.intensity);
        directionalLight.position.set(directional.position.x, directional.position.y, directional.position.z);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(point.color, point.intensity);
        pointLight.position.set(point.position.x, point.position.y, point.position.z);
        this.scene.add(pointLight);
    }

    private setupEventListeners(): void {
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('click', (event: MouseEvent) => this.onMouseClick(event));
        this.renderer.domElement.addEventListener('mousemove', (event: MouseEvent) => this.onMouseMove(event));
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onMouseClick(event: MouseEvent): void {
        this.updateMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // First check if we clicked on a unit
        const unitMeshes: any[] = [];
        this.roverMeshes.forEach(mesh => unitMeshes.push(mesh));
        this.buildingMeshes.forEach(mesh => unitMeshes.push(mesh));
        
        const unitIntersects = this.raycaster.intersectObjects(unitMeshes);
        
        if (unitIntersects.length > 0) {
            const mesh = unitIntersects[0].object;
            
            // Find which rover was clicked
            let clickedRover: Rover | null = null;
            this.roverMeshes.forEach((roverMesh, rover) => {
                if (roverMesh === mesh && rover.player === this.gameState.currentPlayer) {
                    clickedRover = rover;
                }
            });
            
            if (clickedRover) {
                this.showActionMenu(clickedRover, event.clientX, event.clientY);
                return;
            }
        }
        
        // If we're in an action mode, check face/unit clicks
        if (this.actionMode === 'move' && this.selectedRover) {
            const faceIntersects = this.raycaster.intersectObjects(this.faces);
            if (faceIntersects.length > 0) {
                const clickedFace = faceIntersects[0].object;
                const userData = clickedFace.userData as FaceUserData;
                
                // Check if this is the second click on the same face
                if (this.pendingMoveFaceId === userData.faceId) {
                    this.attemptMove(userData.faceId);
                    this.pendingMoveFaceId = null;
                } else {
                    // First click - validate and mark as pending
                    const adjacentFaces = this.faceAdjacencyMap.get(this.selectedRover.faceId);
                    if (adjacentFaces && adjacentFaces.has(userData.faceId)) {
                        // Check if face is valid for movement
                        const occupiedByRover = this.gameState.rovers.some(r => r.faceId === userData.faceId);
                        const occupiedByBuilding = this.gameState.buildings.some(b => b.faceId === userData.faceId);
                        const enemyFortification = this.gameState.fortifications.find(
                            f => f.faceId === userData.faceId && f.player !== this.gameState.currentPlayer
                        );
                        
                        if (!occupiedByRover && !occupiedByBuilding && !enemyFortification) {
                            this.pendingMoveFaceId = userData.faceId;
                            this.showMoveFeedback('Click again to confirm move', true);
                        } else {
                            this.showMoveFeedback('Invalid move: face blocked', false);
                        }
                    } else {
                        this.showMoveFeedback('Invalid move: not adjacent', false);
                    }
                }
            }
        } else if (this.actionMode === 'shoot' && this.selectedRover) {
            // Check if we clicked on an enemy unit
            const enemyTargets = this.getEnemyTargetsAtClick(event);
            if (enemyTargets.length > 0) {
                const target = enemyTargets[0];
                this.attemptShoot(target);
            }
        } else if (this.actionMode === 'fortify' && this.selectedRover) {
            // Check if we clicked on a valid face for fortification
            const faceIntersects = this.raycaster.intersectObjects(this.faces);
            if (faceIntersects.length > 0) {
                const clickedFace = faceIntersects[0].object;
                const userData = clickedFace.userData as FaceUserData;
                this.attemptFortify(userData.faceId);
            }
        } else {
            // Otherwise, hide any action menus and reset state
            this.hideActionMenu();
            this.selectedRover = null;
            this.actionMode = 'none';
            this.pendingMoveFaceId = null;
        }
    }

    private onMouseMove(event: MouseEvent): void {
        this.updateMousePosition(event);

        // Check for unit tooltips
        this.onMouseMoveUnits(event);

        // Check for face highlighting
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.faces);

        this.resetFaceColors();
        
        // Show valid moves/targets based on action mode
        if (this.actionMode === 'move' && this.selectedRover) {
            this.highlightValidMoves();
        } else if (this.actionMode === 'shoot' && this.selectedRover) {
            this.highlightValidTargets();
        } else if (this.actionMode === 'fortify' && this.selectedRover) {
            this.highlightValidFortificationSpots();
        }

        if (intersects.length > 0) {
            this.highlightHoveredFace(intersects[0].object);
        } else {
            UIUtils.clearFaceInfo();
        }
    }

    private updateMousePosition(event: MouseEvent): void {
        const mousePos = UIUtils.calculateMousePosition(event);
        this.mouse.x = mousePos.x;
        this.mouse.y = mousePos.y;
    }

    private resetFaceColors(): void {
        this.faces.forEach(face => {
            const userData = face.userData as FaceUserData;
            const color = userData.type === 'pentagon' ? this.config.colors.pentagon : this.config.colors.triangle;
            face.material.color.setHex(color);
            if (face.material.transparent) {
                face.material.opacity = 1.0;
            }
        });
        
        // Reset unit colors too
        this.roverMeshes.forEach((mesh, rover) => {
            mesh.material.color.setHex(
                rover.player === 'red' ? this.config.colors.playerRed : this.config.colors.playerGreen
            );
        });
        
        this.buildingMeshes.forEach((mesh, building) => {
            mesh.material.color.setHex(
                building.player === 'red' ? this.config.colors.playerRed : this.config.colors.playerGreen
            );
        });
        
        this.fortificationMeshes.forEach((mesh, fortification) => {
            mesh.material.color.setHex(
                fortification.player === 'red' ? 0x8B0000 : 0x006400
            );
        });
    }

    private highlightHoveredFace(face: any): void {
        face.material.color.setHex(this.config.colors.hover);
        face.material.opacity = 1.0;

        const userData = face.userData as FaceUserData;
        UIUtils.updateFaceInfo(userData.faceId, userData.type);
    }

    private selectFace(face: any): void {
        // No longer used for face selection
    }

    private deselectCurrentFace(): void {
        if (this.selectedFace) {
            const userData = this.selectedFace.userData as FaceUserData;
            const color = userData.type === 'pentagon' ? this.config.colors.pentagon : this.config.colors.triangle;
            this.selectedFace.material.color.setHex(color);
        }
    }

    private setSelectedFace(face: any): void {
        this.selectedFace = face;
        face.material.color.setHex(this.config.colors.selected);
        face.material.opacity = 1.0;

        const userData = face.userData as FaceUserData;
        console.log(`Selected face ${userData.faceId}`);
    }

    protected onFaceSelected(face: any): void {
        // No longer used
    }

    private setupGame(): void {
        // Get available HQ spaces
        const hqSpaces = SnubDodecahedronGeometry.getHQSpaces();
        
        // Randomly select starting HQ for each player
        const shuffled = [...hqSpaces].sort(() => Math.random() - 0.5);
        
        // Create initial rovers for each player
        const redRover: Rover = {
            type: 'rover',
            player: 'red',
            faceId: shuffled[0],
            hitPoints: GAME_CONSTANTS.ROVER_MAX_HP,
            maxHitPoints: GAME_CONSTANTS.ROVER_MAX_HP
        };
        
        const greenRover: Rover = {
            type: 'rover', 
            player: 'green',
            faceId: shuffled[1],
            hitPoints: GAME_CONSTANTS.ROVER_MAX_HP,
            maxHitPoints: GAME_CONSTANTS.ROVER_MAX_HP
        };
        
        this.gameState.rovers.push(redRover, greenRover);
        
        // Create visual representations
        this.createRoverMesh(redRover);
        this.createRoverMesh(greenRover);
        
        // Update positions
        this.updateAllUnitPositions();
        
        // Start the game
        this.gameState.gameStarted = true;
        this.updateUI();
    }
    
    private createRoverMesh(rover: Rover): void {
        const geometry = new THREE.ConeGeometry(0.15, 0.3, 6);
        const material = new THREE.MeshLambertMaterial({
            color: rover.player === 'red' ? this.config.colors.playerRed : this.config.colors.playerGreen
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.roverMeshes.set(rover, mesh);
        this.scene.add(mesh);
    }
    
    private updateAllUnitPositions(): void {
        // Update rover positions
        this.gameState.rovers.forEach(rover => {
            const mesh = this.roverMeshes.get(rover);
            if (mesh) {
                this.positionUnitOnFace(mesh, rover.faceId);
            }
        });
        
        // Update building positions
        this.gameState.buildings.forEach(building => {
            const mesh = this.buildingMeshes.get(building);
            if (mesh) {
                this.positionUnitOnFace(mesh, building.faceId);
            }
        });
    }
    
    private positionUnitOnFace(mesh: any, faceId: number): void {
        if (this.faces[faceId]) {
            const face = this.faces[faceId];
            const center = new THREE.Vector3();
            face.geometry.computeBoundingBox();
            face.geometry.boundingBox.getCenter(center);
            face.localToWorld(center);
            
            // Get the normal vector (pointing outward from center)
            const normal = center.clone().normalize();
            
            // Offset slightly outward from face
            center.add(normal.multiplyScalar(0.1));
            
            mesh.position.copy(center);
            
            // Make the cone point outward from the center
            // The cone's default orientation is pointing up along Y axis
            // We need to rotate it to point along the normal vector
            mesh.lookAt(center.clone().add(normal));
            
            // The lookAt makes the cone's Z axis point at the target
            // But cones point along Y axis, so we need to rotate 90 degrees around X
            mesh.rotateX(Math.PI / 2);
        }
    }
    
    private attemptMove(targetFaceId: number): void {
        if (!this.selectedRover) {
            console.log('No rover selected');
            return;
        }
        
        // Check if move is valid (adjacent face)
        const adjacentFaces = this.faceAdjacencyMap.get(this.selectedRover.faceId);
        if (!adjacentFaces || !adjacentFaces.has(targetFaceId)) {
            this.showMoveFeedback('Invalid move: not adjacent', false);
            return;
        }
        
        // Check if face is occupied by unit or building
        const occupiedByRover = this.gameState.rovers.some(r => r.faceId === targetFaceId);
        const occupiedByBuilding = this.gameState.buildings.some(b => b.faceId === targetFaceId);
        
        if (occupiedByRover || occupiedByBuilding) {
            this.showMoveFeedback('Invalid move: face occupied', false);
            return;
        }
        
        // Check for enemy fortifications
        const enemyFortification = this.gameState.fortifications.find(
            f => f.faceId === targetFaceId && f.player !== this.gameState.currentPlayer
        );
        
        if (enemyFortification) {
            this.showMoveFeedback('Invalid move: enemy fortification', false);
            return;
        }
        
        // Make the move
        this.selectedRover.faceId = targetFaceId;
        this.gameState.moveHistory.push(`${this.gameState.currentPlayer} moved rover to ${targetFaceId}`);
        this.updateAllUnitPositions();
        
        // Reset action mode
        this.selectedRover = null;
        this.actionMode = 'none';
        this.pendingMoveFaceId = null;
        
        // Switch players
        this.endTurn();
    }
    
    private showMoveFeedback(message: string, success: boolean): void {
        const feedback = document.createElement('div');
        feedback.style.position = 'absolute';
        feedback.style.bottom = '80px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = success ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)';
        feedback.style.color = 'white';
        feedback.style.padding = '15px';
        feedback.style.borderRadius = '5px';
        feedback.style.fontSize = '16px';
        feedback.style.zIndex = '1002';
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 1500);
    }
    
    private highlightValidMoves(): void {
        if (!this.selectedRover) return;
        
        const adjacentFaces = this.faceAdjacencyMap.get(this.selectedRover.faceId);
        if (!adjacentFaces) return;
        
        adjacentFaces.forEach(faceId => {
            // Check if face is occupied
            const occupiedByRover = this.gameState.rovers.some(r => r.faceId === faceId);
            const occupiedByBuilding = this.gameState.buildings.some(b => b.faceId === faceId);
            const enemyFortification = this.gameState.fortifications.find(
                f => f.faceId === faceId && f.player !== this.gameState.currentPlayer
            );
            
            if (!occupiedByRover && !occupiedByBuilding && !enemyFortification && this.faces[faceId]) {
                if (this.pendingMoveFaceId === faceId) {
                    // Highlight pending move with a bright yellow
                    this.faces[faceId].material.color.setHex(0xFFEB3B);
                    this.faces[faceId].material.opacity = 0.9;
                } else {
                    // Highlight as valid move with a green tint
                    this.faces[faceId].material.color.setHex(0x4CAF50);
                    this.faces[faceId].material.opacity = 0.8;
                }
            }
        });
    }
    
    private highlightValidTargets(): void {
        if (!this.selectedRover) return;
        
        const maxRange = this.getShootingRange();
        
        // Highlight enemy units in range
        this.gameState.rovers.forEach(rover => {
            if (rover.player !== this.gameState.currentPlayer) {
                const distance = SnubDodecahedronGeometry.calculateDistance(
                    this.selectedRover!.faceId,
                    rover.faceId,
                    this.faceAdjacencyMap
                );
                
                if (distance > 0 && distance <= maxRange) {
                    const mesh = this.roverMeshes.get(rover);
                    if (mesh) {
                        mesh.material.color.setHex(0xFF5722); // Orange for valid targets
                    }
                }
            }
        });
        
        this.gameState.buildings.forEach(building => {
            if (building.player !== this.gameState.currentPlayer) {
                const distance = SnubDodecahedronGeometry.calculateDistance(
                    this.selectedRover!.faceId,
                    building.faceId,
                    this.faceAdjacencyMap
                );
                
                if (distance > 0 && distance <= maxRange) {
                    const mesh = this.buildingMeshes.get(building);
                    if (mesh) {
                        mesh.material.color.setHex(0xFF5722); // Orange for valid targets
                    }
                }
            }
        });
        
        this.gameState.fortifications.forEach(fortification => {
            if (fortification.player !== this.gameState.currentPlayer) {
                const distance = SnubDodecahedronGeometry.calculateDistance(
                    this.selectedRover!.faceId,
                    fortification.faceId,
                    this.faceAdjacencyMap
                );
                
                if (distance > 0 && distance <= maxRange) {
                    const mesh = this.fortificationMeshes.get(fortification);
                    if (mesh) {
                        mesh.material.color.setHex(0xFF5722); // Orange for valid targets
                    }
                }
            }
        });
    }
    
    private highlightValidFortificationSpots(): void {
        if (!this.selectedRover) return;
        
        const adjacentFaces = this.faceAdjacencyMap.get(this.selectedRover.faceId);
        if (!adjacentFaces) return;
        
        adjacentFaces.forEach(faceId => {
            // Check if face is empty (no units, buildings, or fortifications)
            const occupiedByRover = this.gameState.rovers.some(r => r.faceId === faceId);
            const occupiedByBuilding = this.gameState.buildings.some(b => b.faceId === faceId);
            const occupiedByFortification = this.gameState.fortifications.some(f => f.faceId === faceId);
            
            if (!occupiedByRover && !occupiedByBuilding && !occupiedByFortification && this.faces[faceId]) {
                // Highlight as valid fortification spot with a brown/tan color
                this.faces[faceId].material.color.setHex(0x8D6E63);
                this.faces[faceId].material.opacity = 0.8;
            }
        });
    }
    
    private attemptFortify(targetFaceId: number): void {
        if (!this.selectedRover) return;
        
        // Check if face is adjacent
        const adjacentFaces = this.faceAdjacencyMap.get(this.selectedRover.faceId);
        if (!adjacentFaces || !adjacentFaces.has(targetFaceId)) {
            this.showMoveFeedback('Can only fortify adjacent spaces', false);
            return;
        }
        
        // Check if face is empty
        const occupiedByRover = this.gameState.rovers.some(r => r.faceId === targetFaceId);
        const occupiedByBuilding = this.gameState.buildings.some(b => b.faceId === targetFaceId);
        const occupiedByFortification = this.gameState.fortifications.some(f => f.faceId === targetFaceId);
        
        if (occupiedByRover || occupiedByBuilding || occupiedByFortification) {
            this.showMoveFeedback('Cannot fortify occupied space', false);
            return;
        }
        
        // Create fortification
        const fortification: Fortification = {
            type: 'fortification',
            player: this.gameState.currentPlayer,
            faceId: targetFaceId,
            hitPoints: GAME_CONSTANTS.FORTIFICATION_HP
        };
        
        this.gameState.fortifications.push(fortification);
        this.createFortificationMesh(fortification);
        
        // Update UI
        this.updateUI();
        this.showMoveFeedback('Fortification built!', true);
        
        // Reset action mode
        this.selectedRover = null;
        this.actionMode = 'none';
        
        // End turn after fortifying
        this.endTurn();
    }
    
    private createFortificationMesh(fortification: Fortification): void {
        // Create a cube shape for fortification
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshLambertMaterial({
            color: fortification.player === 'red' ? 0x8B0000 : 0x006400 // Dark red or dark green
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position it on the face
        this.positionUnitOnFace(mesh, fortification.faceId);
        
        this.fortificationMeshes.set(fortification, mesh);
        this.scene.add(mesh);
    }
    
    private endTurn(): void {
        this.gameState.currentPlayer = this.gameState.currentPlayer === 'red' ? 'green' : 'red';
        this.updateUI();
        this.checkWinConditions();
    }
    
    private checkWinConditions(): void {
        const redAlive = this.gameState.rovers.some(r => r.player === 'red') || 
                        this.gameState.buildings.some(b => b.player === 'red' && b.buildingType === 'factory');
        const greenAlive = this.gameState.rovers.some(r => r.player === 'green') || 
                          this.gameState.buildings.some(b => b.player === 'green' && b.buildingType === 'factory');
        
        if (!redAlive && !greenAlive) {
            alert('Game Over: Both players eliminated!');
            this.gameState.gameStarted = false;
        } else if (!redAlive) {
            alert('Game Over: Green wins!');
            this.gameState.gameStarted = false;
        } else if (!greenAlive) {
            alert('Game Over: Red wins!');
            this.gameState.gameStarted = false;
        }
        
        // Check planet destruction
        if (this.gameState.drillCannonShots >= GAME_CONSTANTS.DRILL_CANNON_PLANET_DESTROY_THRESHOLD) {
            alert('Game Over: Planet destroyed by drill cannon!');
            this.gameState.gameStarted = false;
        }
    }

    private updateUI(): void {
        const info = document.getElementById('face-info');
        if (info) {
            const currentRovers = this.gameState.rovers.filter(r => r.player === this.gameState.currentPlayer);
            const roverCount = currentRovers.length;
            const buildingCount = this.gameState.buildings.filter(b => b.player === this.gameState.currentPlayer).length;
            
            info.innerHTML = `
                <strong>Current Turn: ${this.gameState.currentPlayer.toUpperCase()}</strong><br>
                Rovers: ${roverCount} | Buildings: ${buildingCount}<br>
                Action Points: ${this.gameState.actionPointsStored[this.gameState.currentPlayer]}
            `;
        }
    }

    // Serialization methods
    public exportGameState(): SerializedGameData {
        return {
            version: '1.0.0',
            timestamp: Date.now(),
            state: { ...this.gameState }
        };
    }

    public importGameState(data: SerializedGameData): void {
        // Clear existing meshes
        this.roverMeshes.forEach((mesh, rover) => {
            this.scene.remove(mesh);
        });
        this.buildingMeshes.forEach((mesh, building) => {
            this.scene.remove(mesh);
        });
        this.fortificationMeshes.forEach((mesh, fort) => {
            this.scene.remove(mesh);
        });
        
        this.roverMeshes.clear();
        this.buildingMeshes.clear();
        this.fortificationMeshes.clear();
        
        // Load new state
        this.gameState = { ...data.state };
        
        // Recreate visual elements
        this.gameState.rovers.forEach(rover => {
            this.createRoverMesh(rover);
        });
        
        // Update positions and UI
        this.updateAllUnitPositions();
        this.updateUI();
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    private onMouseMoveUnits(event: MouseEvent): void {
        this.updateMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for unit intersections
        const unitMeshes: any[] = [];
        this.roverMeshes.forEach(mesh => unitMeshes.push(mesh));
        this.buildingMeshes.forEach(mesh => unitMeshes.push(mesh));
        
        const intersects = this.raycaster.intersectObjects(unitMeshes);
        
        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            
            // Find which unit this mesh belongs to
            let unitInfo = '';
            
            this.roverMeshes.forEach((roverMesh, rover) => {
                if (roverMesh === mesh) {
                    unitInfo = `${rover.player.toUpperCase()} Rover - HP: ${rover.hitPoints}/${rover.maxHitPoints}`;
                }
            });
            
            this.buildingMeshes.forEach((buildingMesh, building) => {
                if (buildingMesh === mesh) {
                    const buildingName = building.buildingType.charAt(0).toUpperCase() + building.buildingType.slice(1);
                    unitInfo = `${building.player.toUpperCase()} ${buildingName} - HP: ${building.hitPoints}/${building.maxHitPoints}`;
                }
            });
            
            if (unitInfo) {
                this.showTooltip(event.clientX, event.clientY, unitInfo);
            }
        } else {
            this.hideTooltip();
        }
    }
    
    private showTooltip(x: number, y: number, text: string): void {
        let tooltip = document.getElementById('unit-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'unit-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '14px';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.zIndex = '1000';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y - 30}px`;
    }
    
    private hideTooltip(): void {
        const tooltip = document.getElementById('unit-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    private showActionMenu(rover: Rover, x: number, y: number): void {
        this.selectedRover = rover;
        this.actionMode = 'none';
        
        // Remove any existing action menu
        this.hideActionMenu();
        
        const menu = document.createElement('div');
        menu.id = 'action-menu';
        menu.style.position = 'absolute';
        menu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        menu.style.border = '2px solid #42A5F5';
        menu.style.borderRadius = '5px';
        menu.style.padding = '10px';
        menu.style.zIndex = '1001';
        menu.style.left = `${x + 10}px`;
        menu.style.top = `${y + 10}px`;
        
        const title = document.createElement('div');
        title.style.color = 'white';
        title.style.marginBottom = '10px';
        title.style.fontWeight = 'bold';
        title.textContent = `${rover.player.toUpperCase()} Rover`;
        menu.appendChild(title);
        
        const actions = [
            { name: 'Move', action: 'move', enabled: true },
            { name: 'Shoot', action: 'shoot', enabled: true },
            { name: 'Fortify', action: 'fortify', enabled: true }
        ];
        
        actions.forEach(actionData => {
            const button = document.createElement('button');
            button.textContent = actionData.name;
            button.style.display = 'block';
            button.style.width = '100px';
            button.style.margin = '5px 0';
            button.style.padding = '5px';
            button.style.backgroundColor = actionData.enabled ? '#2196F3' : '#555';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.cursor = actionData.enabled ? 'pointer' : 'not-allowed';
            button.disabled = !actionData.enabled;
            
            if (actionData.enabled) {
                button.addEventListener('click', () => {
                    this.actionMode = actionData.action as any;
                    this.hideActionMenu();
                    this.showActionFeedback(actionData.name);
                });
                
                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = '#42A5F5';
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = '#2196F3';
                });
            }
            
            menu.appendChild(button);
        });
        
        document.body.appendChild(menu);
    }
    
    private hideActionMenu(): void {
        const menu = document.getElementById('action-menu');
        if (menu) {
            menu.remove();
        }
    }
    
    private showActionFeedback(action: string): void {
        const feedback = document.createElement('div');
        feedback.style.position = 'absolute';
        feedback.style.bottom = '100px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
        feedback.style.color = 'white';
        feedback.style.padding = '20px';
        feedback.style.borderRadius = '5px';
        feedback.style.fontSize = '18px';
        feedback.style.zIndex = '1002';
        
        let message = '';
        if (action === 'Move') {
            message = `${action} mode: Click an adjacent face twice to confirm`;
        } else if (action === 'Shoot') {
            const range = this.getShootingRange();
            message = `${action} mode: Click an enemy unit within ${range} spaces`;
        } else if (action === 'Fortify') {
            message = `${action} mode: Click an empty adjacent space`;
        } else {
            message = `${action} mode activated`;
        }
        
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    private getEnemyTargetsAtClick(event: MouseEvent): (Rover | Building | Fortification)[] {
        this.updateMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const unitMeshes: any[] = [];
        const units: (Rover | Building | Fortification)[] = [];
        
        // Check enemy rovers
        this.roverMeshes.forEach((mesh, rover) => {
            if (rover.player !== this.gameState.currentPlayer) {
                unitMeshes.push(mesh);
                units.push(rover);
            }
        });
        
        // Check enemy buildings
        this.buildingMeshes.forEach((mesh, building) => {
            if (building.player !== this.gameState.currentPlayer) {
                unitMeshes.push(mesh);
                units.push(building);
            }
        });
        
        // Check enemy fortifications
        this.fortificationMeshes.forEach((mesh, fortification) => {
            if (fortification.player !== this.gameState.currentPlayer) {
                unitMeshes.push(mesh);
                units.push(fortification);
            }
        });
        
        const intersects = this.raycaster.intersectObjects(unitMeshes);
        const targets: (Rover | Building | Fortification)[] = [];
        
        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            
            // Find which unit was hit
            this.roverMeshes.forEach((mesh, rover) => {
                if (mesh === hitMesh && rover.player !== this.gameState.currentPlayer) {
                    targets.push(rover);
                }
            });
            
            this.buildingMeshes.forEach((mesh, building) => {
                if (mesh === hitMesh && building.player !== this.gameState.currentPlayer) {
                    targets.push(building);
                }
            });
            
            this.fortificationMeshes.forEach((mesh, fortification) => {
                if (mesh === hitMesh && fortification.player !== this.gameState.currentPlayer) {
                    targets.push(fortification);
                }
            });
        }
        
        return targets;
    }
    
    private attemptShoot(target: Rover | Building | Fortification): void {
        if (!this.selectedRover) return;
        
        // Calculate distance
        const distance = SnubDodecahedronGeometry.calculateDistance(
            this.selectedRover.faceId,
            target.faceId,
            this.faceAdjacencyMap
        );
        
        // Check range (3 spaces, or more from HQ)
        const maxRange = this.getShootingRange();
        
        if (distance > maxRange || distance < 1) {
            this.showMoveFeedback(`Target out of range (${distance} spaces, max ${maxRange})`, false);
            return;
        }
        
        // Roll dice (1d6, hit on 4+)
        const roll = Math.floor(Math.random() * 6) + 1;
        const isHit = roll >= 4;
        
        if (isHit) {
            // Deal damage
            target.hitPoints -= 1;
            
            if (target.hitPoints <= 0) {
                // Remove unit
                if (target.type === 'rover') {
                    const index = this.gameState.rovers.indexOf(target as Rover);
                    if (index > -1) {
                        this.gameState.rovers.splice(index, 1);
                        const mesh = this.roverMeshes.get(target as Rover);
                        if (mesh) {
                            this.scene.remove(mesh);
                            this.roverMeshes.delete(target as Rover);
                        }
                    }
                } else if (target.type === 'building') {
                    const index = this.gameState.buildings.indexOf(target as Building);
                    if (index > -1) {
                        this.gameState.buildings.splice(index, 1);
                        const mesh = this.buildingMeshes.get(target as Building);
                        if (mesh) {
                            this.scene.remove(mesh);
                            this.buildingMeshes.delete(target as Building);
                        }
                    }
                } else if (target.type === 'fortification') {
                    const index = this.gameState.fortifications.indexOf(target as Fortification);
                    if (index > -1) {
                        this.gameState.fortifications.splice(index, 1);
                        const mesh = this.fortificationMeshes.get(target as Fortification);
                        if (mesh) {
                            this.scene.remove(mesh);
                            this.fortificationMeshes.delete(target as Fortification);
                        }
                    }
                }
                
                this.showShootFeedback(`Hit! (rolled ${roll}) - Target destroyed!`, true);
            } else {
                this.showShootFeedback(`Hit! (rolled ${roll}) - ${target.hitPoints} HP remaining`, true);
            }
        } else {
            this.showShootFeedback(`Miss! (rolled ${roll}, needed 4+)`, false);
        }
        
        // Reset action mode
        this.selectedRover = null;
        this.actionMode = 'none';
        
        // End turn
        this.endTurn();
    }
    
    private getShootingRange(): number {
        if (!this.selectedRover) return GAME_CONSTANTS.SHOOT_RANGE;
        
        // Check if we're on an HQ space
        const isOnHQ = SnubDodecahedronGeometry.getFaceType(this.selectedRover.faceId) === 'pentagon';
        
        if (isOnHQ) {
            return GAME_CONSTANTS.SHOOT_RANGE + GAME_CONSTANTS.HQ_RANGE_COST;
        }
        
        return GAME_CONSTANTS.SHOOT_RANGE;
    }
    
    private showShootFeedback(message: string, success: boolean): void {
        const feedback = document.createElement('div');
        feedback.style.position = 'absolute';
        feedback.style.bottom = '120px';
        feedback.style.left = '50%';
        feedback.style.transform = 'translateX(-50%)';
        feedback.style.backgroundColor = success ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)';
        feedback.style.color = 'white';
        feedback.style.padding = '20px';
        feedback.style.borderRadius = '5px';
        feedback.style.fontSize = '20px';
        feedback.style.fontWeight = 'bold';
        feedback.style.zIndex = '1003';
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2500);
    }
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new SnubDodecahedronGame();
});
