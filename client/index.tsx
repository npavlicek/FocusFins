import * as THREE from 'three';

const width = window.innerWidth, height = window.innerHeight;

const ratio = (height / width) * 2 - (height / width);
const cam = new THREE.OrthographicCamera(-1, 1, ratio, -ratio, 0.001, 1000);
cam.position.z = 1;
cam.position.x = 1;
cam.position.y = 0.75;

cam.lookAt(0, 0, 0);

const scene = new THREE.Scene();

const gridWidth = 10;
const gridHeight = 10;

const group = new THREE.Group();
for (let x = 0; x < gridWidth; x++) {
	for (let y = 0; y < gridHeight; y++) {
		const geom = new THREE.BoxGeometry(0.1, 0.01, 0.1);
		geom.scale(0.95, 0.95, 0.95);
		const mat = new THREE.MeshNormalMaterial();
		const mesh = new THREE.Mesh(geom, mat);
		mesh.position.x = (x * 0.1) - 0.45;
		mesh.position.z = (y * 0.1) - 0.45;
		group.add(mesh);
	}
}

scene.add(group);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(anim);
document.body.appendChild(renderer.domElement);

function anim(time: DOMHighResTimeStamp) {
	group.rotateY(0.003);
	renderer.render(scene, cam);
}
