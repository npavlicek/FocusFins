import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from 'three';

interface CoralProps {
  camDir: THREE.Vector3;
  cursorAvailableCallback: (newState: boolean) => void;
  cursorAvailable: boolean;
};

const Coral: React.FC<CoralProps> = (props: CoralProps) => {
  const sceneLoaded = useLoader(GLTFLoader, './basic_coral.glb');
  const meshRef = useRef<THREE.Mesh>(null);
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

  useEffect(() => {
    sceneLoaded.scene.children.forEach(val => {
      if (val.type == "Mesh") {
        if (meshRef.current) {
          meshRef.current.geometry = (val as THREE.Mesh).geometry;
          meshRef.current.material = (val as THREE.Mesh).material;
          meshRef.current.scale.set(0.1, 0.1, 0.1);
          meshRef.current.position.set(Math.random(), 0.0125, Math.random());
          meshRef.current.castShadow = true;
        }
        return;
      }
    });
  }, [sceneLoaded, meshRef]);

  useEffect(() => {
    if (selected) {
      gl.domElement.addEventListener('mousemove', handleMouseMove);
      props.cursorAvailableCallback(false);
    } else {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      props.cursorAvailableCallback(true);
    }
  }, [selected]);

  return (
    <>
      <mesh ref={meshRef} onClick={_ => { if (props.cursorAvailable || selected) { setSelected(!selected); console.log("DOIGN SHIT"); } }} />
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
