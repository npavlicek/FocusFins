import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const width = window.innerWidth, height = window.innerHeight;
const aspect = width / height;
const camWidth = 2;
const camHeight = camWidth / aspect;
const cam = new THREE.OrthographicCamera(-camWidth / 2, camWidth / 2, camHeight / 2, -camHeight / 2, 0.001, 500);
cam.position.z = 1 * 50;
cam.position.x = 1 * 50;
cam.position.y = 0.75 * 50;
cam.lookAt(0, 0, 0);

const scene = new THREE.Scene();
const loader = new GLTFLoader();

let gridPositions: Array<Array<number>> = [];
const gridWidth = 10;
const gridHeight = 10;
for (let x = 0; x < gridWidth; x++) {
	for (let y = 0; y < gridHeight; y++) {
		const scale = 0.1;
		gridPositions.push([(x * scale) - 0.45, 0, (y * scale) - 0.45]);
	}
}

const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#333333', 2.0);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight('#DFEEE8', 2.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.x = 2048;
directionalLight.shadow.mapSize.y = 2048;
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

let sandTile: THREE.InstancedMesh;
loader.loadAsync('sandtile.glb').then(res => {
	let geometry = null;
	let mat = null;
	res.scene.traverse((child: THREE.Object3D) => {
		if (child.type == "Mesh") {
			geometry = (child as THREE.Mesh).geometry;
			mat = (child as THREE.Mesh).material;
			return;
		}
	});

	if (geometry && mat) {
		sandTile = new THREE.InstancedMesh(geometry, mat, gridWidth * gridHeight);
		sandTile.instanceMatrix.setUsage(THREE.StaticDrawUsage);

		for (let i = 0; i < gridWidth * gridHeight; i++) {
			let pos = gridPositions.at(i)!;
			let dummy: THREE.Object3D = new THREE.Object3D();
			dummy.position.set(pos[0], pos[1], pos[2]);
			dummy.scale.multiplyScalar(0.05);
			dummy.updateMatrix();
			sandTile.setMatrixAt(i, dummy.matrix);
		}

		sandTile.receiveShadow = true;
		scene.add(sandTile);
	} else {
		console.error("COULD NOT FIND MESH AND GEOMETRY DATA");
	}
}).catch(err => {
	console.error(err);
});

let coral: THREE.Mesh;
loader.loadAsync('basic_coral.glb').then(res => {
	res.scene.traverse((child: THREE.Object3D) => {
		if (child.type == "Mesh") {
			coral = (child as THREE.Mesh);
			return;
		}
	});

	if (coral) {
		coral.scale.multiplyScalar(0.09);
		coral.castShadow = true;
		scene.add(coral);
	}
}).catch(err => {
	console.error(err);
});


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(width, height);
renderer.setAnimationLoop(anim);
document.body.appendChild(renderer.domElement);

let pos = new THREE.Vector3();

let camDir = new THREE.Vector3(0.0, 0.0, 0.0);
camDir.sub(cam.position);
camDir.normalize();

window.onmousemove = event => {
	let rayOrigin = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, -1);
	rayOrigin.unproject(cam);
	let distance = (0 - rayOrigin.y) / camDir.y;
	pos.copy(rayOrigin).add(new THREE.Vector3().copy(camDir).multiplyScalar(distance));
}

let oldX: number = 0, oldZ: number = 0;
let velX: number = 0, velZ: number = 0;
let dampening = 1.0;

function anim(time: DOMHighResTimeStamp) {
	renderer.setClearColor('#DFEEE8');
	renderer.clear(true, true, true);

	if (coral) {
		const newX = Math.floor(pos.x / 0.1) * 0.1 + 0.05;
		const newZ = Math.floor(pos.z / 0.1) * 0.1 + 0.05;

		velX += (pos.x - oldX) * 5;
		velZ += (pos.z - oldZ) * 5;

		//coral.rotation.set(velX, 0.0, velZ);

		console.log(velX);

		if (Math.abs(newX) < 0.1 * gridWidth / 2 && Math.abs(newZ) < 0.1 * gridHeight / 2) {
			coral.position.set(newX, 0.03, newZ);
		}

		if (velX > 0)
			velX -= dampening;
		else if (velX < 0)
			velX += dampening;

		if (velZ > 0)
			velZ -= dampening;
		else if (velZ < 0)
			velZ += dampening;

		oldX = pos.x;
		oldZ = pos.z;
		coral.rotation.y = time / 800;
	}

	renderer.render(scene, cam);
}
