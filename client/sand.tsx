import { useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh } from 'three/src/objects/Mesh';

interface SandProps {
	setSandMesh: React.Dispatch<React.SetStateAction<Mesh | undefined>>;
};

const Sand: React.FC<SandProps> = (props: SandProps) => {
	const sandModel = useLoader(GLTFLoader, 'assets/sand.glb');
	const meshRef = useRef<Mesh>(null);

	useEffect(() => {
		const model = sandModel.scene.children[0];
		if (meshRef.current) {
			meshRef.current.geometry = (model as Mesh).geometry;
			meshRef.current.material = (model as Mesh).material;
			meshRef.current.receiveShadow = true;
			props.setSandMesh(meshRef.current);
		}
	}, [sandModel, meshRef]);

	return (
		<mesh ref={meshRef} />
	);
}

export default Sand;

