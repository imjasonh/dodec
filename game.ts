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
        const intersects = this.raycaster.intersectObjects(this.faces);

        if (intersects.length > 0) {
            const clickedFace = intersects[0].object;
            this.selectFace(clickedFace);
        }
    }

    private onMouseMove(event: MouseEvent): void {
        this.updateMousePosition(event);

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.faces);

        this.resetFaceColors();

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
    }

    private highlightHoveredFace(face: any): void {
        face.material.color.setHex(this.config.colors.hover);
        face.material.opacity = 1.0;

        const userData = face.userData as FaceUserData;
        UIUtils.updateFaceInfo(userData.faceId, userData.type);
    }

    private selectFace(face: any): void {
        this.deselectCurrentFace();
        this.setSelectedFace(face);
        this.onFaceSelected(face);
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
        const userData = face.userData as FaceUserData;
        const faceId = userData.faceId;

        if (this.gameState.gameStarted) {
            this.attemptMove(faceId);
        }
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
            
            // Offset slightly outward from face
            const normal = center.clone().normalize();
            center.add(normal.multiplyScalar(0.1));
            
            mesh.position.copy(center);
        }
    }
    
    private attemptMove(targetFaceId: number): void {
        // Find the current player's rovers
        const currentRovers = this.gameState.rovers.filter(r => r.player === this.gameState.currentPlayer);
        
        if (currentRovers.length === 0) {
            console.log('No rovers to move');
            return;
        }
        
        // For now, move the first rover (later we'll need UI to select which rover)
        const rover = currentRovers[0];
        
        // Check if move is valid (adjacent face)
        const adjacentFaces = this.faceAdjacencyMap.get(rover.faceId);
        if (!adjacentFaces || !adjacentFaces.has(targetFaceId)) {
            console.log('Invalid move: not adjacent');
            return;
        }
        
        // Check if face is occupied by unit or building
        const occupiedByRover = this.gameState.rovers.some(r => r.faceId === targetFaceId);
        const occupiedByBuilding = this.gameState.buildings.some(b => b.faceId === targetFaceId);
        
        if (occupiedByRover || occupiedByBuilding) {
            console.log('Invalid move: face occupied');
            return;
        }
        
        // Check for enemy fortifications
        const enemyFortification = this.gameState.fortifications.find(
            f => f.faceId === targetFaceId && f.player !== this.gameState.currentPlayer
        );
        
        if (enemyFortification) {
            console.log('Invalid move: enemy fortification blocks movement');
            return;
        }
        
        // Make the move
        rover.faceId = targetFaceId;
        this.gameState.moveHistory.push(`${this.gameState.currentPlayer} moved rover to ${targetFaceId}`);
        this.updateAllUnitPositions();
        
        // Switch players
        this.endTurn();
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
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new SnubDodecahedronGame();
});
