import { useState, useEffect, useRef, useCallback } from 'react';
import { useLoader, useThree, ThreeEvent } from '@react-three/fiber';
import { Outline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from 'three';

interface CoralProps {
  camDir: THREE.Vector3;
  setCursorAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  createPopupCallback: (x: number, y: number, moveButtonHandler: (e: MouseEvent) => void) => void;
  closePopupCallback: () => void;
  cursorAvailable: boolean;
  coralId: number;
};

const Coral: React.FC<CoralProps> = (props: CoralProps) => {
  const sceneLoaded = useLoader(GLTFLoader, './cartoon_seaweed_9.glb');
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const [moving, setMoving] = useState<boolean>(false);
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

  const moveButtonClicked = useCallback((e: MouseEvent) => {
    props.closePopupCallback();
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    setMoving(true);
  }, [handleMouseMove, moving]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    if (props.cursorAvailable) {
      e.stopPropagation();
      props.createPopupCallback(e.x, e.y, moveButtonClicked);
      props.setCursorAvailable(false);
      setSelected(true);
    } else if (moving) {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      props.setCursorAvailable(true);
      setSelected(false);
      setMoving(false);
    }
    else if (selected) {
      props.setCursorAvailable(true);
      props.closePopupCallback();
      setSelected(false);
    }
  }, [props.cursorAvailable, moving, selected, props.camDir, moveButtonClicked]);

  useEffect(() => {
    const val = sceneLoaded.scene.children[props.coralId];
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
      {meshRef.current && selected && <Outline selection={[meshRef.current]} blendFunction={BlendFunction.ALPHA} visibleEdgeColor={0xFF0000} hiddenEdgeColor={0xFFFFFF} blur={false} edgeStrength={2} />}
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
