import { useState, useEffect, useRef, useCallback } from 'react';
import { useLoader, useThree, ThreeEvent } from '@react-three/fiber';
import { Outline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from 'three';

interface CoralProps {
  camDir: THREE.Vector3;
  cursorAvailableCallback: (newState: boolean) => void;
  cursorAvailable: boolean;
};

const Coral: React.FC<CoralProps> = (props: CoralProps) => {
  const sceneLoaded = useLoader(GLTFLoader, './cartoon_seaweed_9.glb');
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const { gl, camera } = useThree();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    let rayOrigin = new THREE.Vector3(((e.clientX - gl.domElement.getBoundingClientRect().left) / gl.domElement.width) * 2 - 1, - ((e.clientY - gl.domElement.getBoundingClientRect().top) / gl.domElement.height) * 2 + 1, -1);
    rayOrigin.unproject(camera);
    let distance = (0.0125 - rayOrigin.y) / props.camDir.y;
    let newPos = new THREE.Vector3();
    newPos.copy(rayOrigin).add(new THREE.Vector3().copy(props.camDir).multiplyScalar(distance));
    if (meshRef.current) {
      meshRef.current.position.set(newPos.x, 0.0125, newPos.z);
    }
  }, [props.camDir]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (props.cursorAvailable) {
      gl.domElement.addEventListener('mousemove', handleMouseMove);
      props.cursorAvailableCallback(false);
      setSelected(true);
    } else if (selected) {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      props.cursorAvailableCallback(true);
      setSelected(false);
    }
  }, [props.cursorAvailable, selected, props.camDir]);

  useEffect(() => {
    const val = sceneLoaded.scene.children[20];
    if (meshRef.current) {
      meshRef.current.geometry = (val as THREE.Mesh).geometry;
      meshRef.current.material = (val as THREE.Mesh).material;
      meshRef.current.scale.set(0.20, 0.20, 0.20);
      meshRef.current.position.set(Math.random(), 0.0125, Math.random());
      meshRef.current.castShadow = true;
      meshRef.current.receiveShadow = true;
    }
  }, [sceneLoaded, meshRef]);

  return (
    <>
      {meshRef.current && selected && <Outline selection={[meshRef.current]} blendFunction={BlendFunction.ALPHA} visibleEdgeColor={0xFF0000} hiddenEdgeColor={0x000000} blur={false} edgeStrength={2} />}
      <mesh ref={meshRef} onClick={handleClick} />
    </>
  );
}

interface CoralInfo {
  id: number;
  x: number;
  y: number;
};

export { CoralInfo };
export default Coral;
