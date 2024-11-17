import { useState, useEffect, useRef, useCallback } from 'react';
import { useLoader, useThree, ThreeEvent } from '@react-three/fiber';
import { Outline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from 'three';

interface CoralData {
  coralId: number;
  coralModelId: number;
};

interface CoralProps {
  camDir: THREE.Vector3;
  setCursorAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  createPopupCallback: (x: number, y: number, coralCallbacks: CoralCallbacks) => void;
  closePopupCallback: () => void;
  deleteCoralCallback: (coralId: number) => void;
  cursorAvailable: boolean;
  coralData: CoralData
};

interface CoralCallbacks {
  moveButtonHandler: (e: MouseEvent) => void;
  rotateButtonHandler: (e: MouseEvent) => void;
  closeButtonHandler: (e: MouseEvent) => void;
  deleteButtonHandler: (e: MouseEvent) => void;
};

const Coral: React.FC<CoralProps> = (props: CoralProps) => {
  const sceneLoaded = useLoader(GLTFLoader, './cartoon_seaweed_9.glb');
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const [moving, setMoving] = useState<boolean>(false);
  const [rotating, setRotating] = useState<boolean>(false);
  const { gl, camera } = useThree();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Calculate world coordinates of cursor
    let rayOrigin = new THREE.Vector3(((e.clientX - gl.domElement.getBoundingClientRect().left) / gl.domElement.getBoundingClientRect().width) * 2 - 1, - ((e.clientY - gl.domElement.getBoundingClientRect().top) / gl.domElement.getBoundingClientRect().height) * 2 + 1, -1);
    rayOrigin.unproject(camera);
    let distance = (0.0125 - rayOrigin.y) / props.camDir.y;
    let newPos = new THREE.Vector3();
    newPos.copy(rayOrigin).add(new THREE.Vector3().copy(props.camDir).multiplyScalar(distance));
    if (meshRef.current) {
      meshRef.current.position.set(newPos.x, 0.0125, newPos.z);
    }
  }, [props.camDir]);

  const handleMouseMoveRot = useCallback((e: MouseEvent) => {
    // Calculate world coordinates of cursor
    let rayOrigin = new THREE.Vector3(((e.clientX - gl.domElement.getBoundingClientRect().left) / gl.domElement.getBoundingClientRect().width) * 2 - 1, - ((e.clientY - gl.domElement.getBoundingClientRect().top) / gl.domElement.getBoundingClientRect().height) * 2 + 1, -1);
    rayOrigin.unproject(camera);
    let distance = (0.0125 - rayOrigin.y) / props.camDir.y;
    let newPos = new THREE.Vector3();
    newPos.copy(rayOrigin).add(new THREE.Vector3().copy(props.camDir).multiplyScalar(distance));

    // calculate angle
    if (meshRef.current) {
      newPos.sub(meshRef.current.position).normalize();
      meshRef.current.rotation.set(0, Math.atan2(newPos.x, newPos.z), 0);
    }
  }, [props.camDir]);

  const handleClickFinishRot = useCallback((e: MouseEvent) => {
    gl.domElement.removeEventListener('click', handleClickFinishRot);
    gl.domElement.removeEventListener('mousemove', handleMouseMoveRot);
    setRotating(false);
    setSelected(false);
    props.setCursorAvailable(true);
  }, [rotating, selected, props.setCursorAvailable, handleMouseMoveRot]);

  const handleClickFinishMove = useCallback((e: MouseEvent) => {
    gl.domElement.removeEventListener('mousemove', handleMouseMove);
    gl.domElement.removeEventListener('click', handleClickFinishMove);
    props.setCursorAvailable(true);
    setSelected(false);
    setMoving(false);
  }, [moving, selected, props.setCursorAvailable, handleMouseMove]);

  const moveButtonClicked = useCallback((e: MouseEvent) => {
    props.closePopupCallback();
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('click', handleClickFinishMove);
    setMoving(true);
  }, [handleMouseMove, moving, props.closePopupCallback, handleClickFinishMove]);

  const rotateButtonClicked = useCallback((e: MouseEvent) => {
    props.closePopupCallback();
    setRotating(true);
    gl.domElement.addEventListener('mousemove', handleMouseMoveRot);
    gl.domElement.addEventListener('click', handleClickFinishRot);
  }, [props.closePopupCallback, rotating, handleMouseMoveRot, handleClickFinishRot]);

  const closeButtonClicked = useCallback((e: MouseEvent) => {
    setSelected(false);
    props.closePopupCallback();
    props.setCursorAvailable(true);
  }, []);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    if (props.cursorAvailable) {
      e.stopPropagation();
      const coralCallbacks: CoralCallbacks = {
        moveButtonHandler: moveButtonClicked,
        rotateButtonHandler: rotateButtonClicked,
        closeButtonHandler: closeButtonClicked,
        deleteButtonHandler: (e: MouseEvent) => {
          props.closePopupCallback();
          props.setCursorAvailable(true);
          props.deleteCoralCallback(props.coralData.coralId);
        }
      };
      props.createPopupCallback(e.x, e.y+gl.domElement.getBoundingClientRect().top+window.scrollY, coralCallbacks);
      props.setCursorAvailable(false);
      setSelected(true);
    } else if (selected) {
      props.setCursorAvailable(true);
      props.closePopupCallback();
      setSelected(false);
    }
  }, [props.cursorAvailable, moving, selected, props.camDir, moveButtonClicked, rotateButtonClicked, props.deleteCoralCallback]);

  useEffect(() => {
    const val = sceneLoaded.scene.children[props.coralData.coralModelId];
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

export { CoralInfo, CoralCallbacks, CoralData };
export default Coral;
