// Mathematical constants
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const XI_CONSTANT = 0.94315125924; // Real zero of x³ + 2x² - φ² = 0

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
        triangle: 0x4CAF50,
        pentagon: 0x2196F3,
        hover: 0xFFEB3B,
        selected: 0xF44336,
        wireframe: 0xffffff,
        background: 0x111111
    },
    lighting: {
        ambient: { color: 0x404040, intensity: 0.6 },
        directional: { color: 0xffffff, intensity: 0.8, position: { x: 5, y: 5, z: 5 } },
        point: { color: 0xffffff, intensity: 0.5, position: { x: -5, y: -5, z: 5 } }
    }
};

// Face connectivity data for snub dodecahedron
interface SnubDodecahedronFaces {
    triangles: number[][];  // 80 triangles, each with 3 vertex indices
    pentagons: number[][]; // 12 pentagons, each with 5 vertex indices
}

// Pure mathematical geometry functions (easily testable)
class SnubDodecahedronGeometry {
    static generateBasePoint(): any {
        const phi = GOLDEN_RATIO;
        const xi = XI_CONSTANT;
        
        return new THREE.Vector3(
            phi * phi - phi * phi * xi,
            -phi * phi * phi + phi * xi + 2 * phi * xi * xi,
            xi
        );
    }
    
    static createRotationAxis(): any {
        return new THREE.Vector3(0, 1, GOLDEN_RATIO).normalize();
    }
    
    static cyclicRotation(v: any): any {
        return new THREE.Vector3(v.z, v.x, v.y);
    }
    
    static generateBaseVertices(): any[] {
        const p = this.generateBasePoint();
        const vertices: any[] = [];
        const axis1 = this.createRotationAxis();
        const angle1 = (2 * Math.PI) / 5;
        
        let currentPoint = p.clone();
        
        for (let i = 0; i < 5; i++) {
            let tempPoint = currentPoint.clone();
            
            for (let j = 0; j < 3; j++) {
                vertices.push(tempPoint.clone());
                tempPoint = this.cyclicRotation(tempPoint);
            }
            
            currentPoint.applyAxisAngle(axis1, angle1);
        }
        
        return vertices;
    }
    
    static generateAdditionalVertices(baseVertices: any[]): any[] {
        const additionalVertices: any[] = [];
        baseVertices.forEach(v => {
            additionalVertices.push(new THREE.Vector3(-v.x, -v.y, v.z));
            additionalVertices.push(new THREE.Vector3(v.x, -v.y, -v.z));
            additionalVertices.push(new THREE.Vector3(-v.x, v.y, -v.z));
        });
        return additionalVertices;
    }
    
    static generateVertices(): any[] {
        const baseVertices = this.generateBaseVertices();
        const additionalVertices = this.generateAdditionalVertices(baseVertices);
        return [...baseVertices, ...additionalVertices].slice(0, 60);
    }
    
    static getFaceConnectivity(): SnubDodecahedronFaces {
        // This is a simplified approach - in practice, you'd need the exact face connectivity
        // For now, we'll create a reasonable approximation by analyzing vertex neighborhoods
        const vertices = this.generateVertices();
        return this.computeFaceConnectivity(vertices);
    }
    
    private static computeFaceConnectivity(vertices: any[]): SnubDodecahedronFaces {
        // For a proper snub dodecahedron, we need to determine which sets of vertices
        // form triangular vs pentagonal faces based on geometric relationships
        
        const triangles: number[][] = [];
        const pentagons: number[][] = [];
        
        // Analyze vertex neighborhoods to identify face types
        const adjacencyThreshold = 1.2; // Distance threshold for adjacent vertices
        
        // Build adjacency lists for each vertex
        const adjacency: number[][] = [];
        for (let i = 0; i < vertices.length; i++) {
            adjacency[i] = [];
            for (let j = 0; j < vertices.length; j++) {
                if (i !== j) {
                    const distance = vertices[i].distanceTo(vertices[j]);
                    if (distance < adjacencyThreshold) {
                        adjacency[i].push(j);
                    }
                }
            }
        }
        
        // Find faces by looking for cycles in the adjacency graph
        const usedVertexSets = new Set<string>();
        
        // Look for triangular faces (3-cycles)
        for (let i = 0; i < vertices.length; i++) {
            for (let j = 0; j < adjacency[i].length; j++) {
                const v1 = adjacency[i][j];
                for (let k = 0; k < adjacency[v1].length; k++) {
                    const v2 = adjacency[v1][k];
                    if (v2 !== i && adjacency[v2].includes(i)) {
                        // Found a triangle: i, v1, v2
                        const triangle = [i, v1, v2].sort((a, b) => a - b);
                        const key = triangle.join(',');
                        if (!usedVertexSets.has(key) && triangles.length < 80) {
                            triangles.push(triangle);
                            usedVertexSets.add(key);
                        }
                    }
                }
            }
        }
        
        // Look for pentagonal faces (5-cycles) - simplified approach
        // In practice, you'd use more sophisticated cycle detection
        for (let i = 0; i < vertices.length && pentagons.length < 12; i++) {
            if (adjacency[i].length >= 4) {
                // Try to form a pentagon starting from this vertex
                const neighbors = adjacency[i].slice(0, 4);
                const pentagon = [i, ...neighbors];
                const key = pentagon.sort((a, b) => a - b).join(',');
                if (!usedVertexSets.has(key)) {
                    pentagons.push(pentagon);
                    usedVertexSets.add(key);
                }
            }
        }
        
        // If we don't have enough faces, create some reasonable defaults
        while (triangles.length < 80) {
            const baseIndex = triangles.length * 3;
            if (baseIndex + 2 < vertices.length) {
                triangles.push([baseIndex % 60, (baseIndex + 1) % 60, (baseIndex + 2) % 60]);
            } else {
                break;
            }
        }
        
        while (pentagons.length < 12) {
            const baseIndex = pentagons.length * 5;
            if (baseIndex + 4 < vertices.length) {
                pentagons.push([
                    baseIndex % 60, 
                    (baseIndex + 1) % 60, 
                    (baseIndex + 2) % 60, 
                    (baseIndex + 3) % 60, 
                    (baseIndex + 4) % 60
                ]);
            } else {
                break;
            }
        }
        
        return { triangles, pentagons };
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
        const faceInfoElement = document.getElementById('face-info');
        if (faceInfoElement) {
            faceInfoElement.textContent = `Face: ${faceId} (${type})`;
        }
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

    constructor(config: GameConfig = DEFAULT_CONFIG) {
        this.config = config;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
    }
    
    private init(): void {
        this.setupRenderer();
        this.setupCamera();
        this.setupControls();
        this.createSnubDodecahedron();
        this.setupLighting();
        this.setupEventListeners();
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
        const convexGeometry = new THREE.ConvexGeometry(vertices);
        
        // For now, use ConvexGeometry which will triangulate everything
        // A proper snub dodecahedron would need exact face connectivity data
        this.createFaces(convexGeometry);
        this.createWireframe(convexGeometry);
        this.createPolyhedronGroup();
    }
    
    private createTriangleMaterial(): any {
        return new THREE.MeshLambertMaterial({ 
            color: this.config.colors.triangle,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
    }
    
    private createPentagonMaterial(): any {
        return new THREE.MeshLambertMaterial({ 
            color: this.config.colors.pentagon,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
    }
    
    private createFaces(convexGeometry: any): void {
        const positions = convexGeometry.attributes.position.array;
        const indices = convexGeometry.index ? convexGeometry.index.array : null;
        const triangleMaterial = this.createTriangleMaterial();
        
        this.faces = [];
        
        if (indices) {
            // Indexed geometry
            for (let i = 0; i < indices.length; i += 3) {
                const faceVertices = GeometryUtils.extractTriangleVertices(positions, indices, i);
                const faceGeometry = GeometryUtils.createFaceGeometry(faceVertices);
                
                const face = new THREE.Mesh(faceGeometry, triangleMaterial.clone());
                face.userData = GeometryUtils.createFaceUserData(i / 3, 'triangle');
                
                this.faces.push(face);
                this.scene.add(face);
            }
        } else {
            // Non-indexed geometry
            for (let i = 0; i < positions.length; i += 9) {
                const faceVertices = new Float32Array(9);
                for (let j = 0; j < 9; j++) {
                    faceVertices[j] = positions[i + j];
                }
                
                const faceGeometry = GeometryUtils.createFaceGeometry(faceVertices);
                const face = new THREE.Mesh(faceGeometry, triangleMaterial.clone());
                face.userData = GeometryUtils.createFaceUserData(i / 9, 'triangle');
                
                this.faces.push(face);
                this.scene.add(face);
            }
        }
    }
    
    private createWireframe(convexGeometry: any): void {
        const wireframe = new THREE.WireframeGeometry(convexGeometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.color.setHex(this.config.colors.wireframe);
        line.material.opacity = 0.3;
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
            face.material.opacity = 0.8;
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
        console.log(`Face ${userData.faceId} clicked! Add your game logic here.`);
        
        this.animateFaceSelection(face);
    }
    
    private animateFaceSelection(face: any): void {
        const originalScale = face.scale.clone();
        face.scale.multiplyScalar(1.2);
        
        setTimeout(() => {
            face.scale.copy(originalScale);
        }, 200);
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