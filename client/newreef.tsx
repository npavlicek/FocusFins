import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import THREE from 'three';

import Sand from './sand';
import Coral from './coral';

const Reef: React.FC = () => {
  const camRef = useRef<THREE.OrthographicCamera | null>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const [camDir, setCamDir] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const [cursorAvail, setCursorAvail] = useState(true);

  const { scene, size, set } = useThree();

  const cursorAvailableCallback = useCallback((newState: boolean) => {
    setCursorAvail(newState);
  }, []);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.intensity = 2.0;
      lightRef.current.color.set('#DFEEE8');
      lightRef.current.castShadow = true;
      lightRef.current.shadow.mapSize.width = 2048;
      lightRef.current.shadow.mapSize.height = 2048;
      lightRef.current.position.set(0, 5, 5);
    }
  }, []);

  useEffect(() => {
    if (camRef.current) {
      const aspect = size.width / size.height;
      const camWidth = 2;
      const camHeight = camWidth / aspect;
      camRef.current.top = camHeight / 2;
      camRef.current.bottom = -camHeight / 2;
      camRef.current.left = -camWidth / 2;
      camRef.current.right = camWidth / 2;
      camRef.current.near = 0.001;
      camRef.current.far = 500;
      camRef.current.position.z = 1 * 50;
      camRef.current.position.x = 1 * 50;
      camRef.current.position.y = 0.75 * 50;
      camRef.current.lookAt(0, 0, 0);
      camRef.current.updateProjectionMatrix();
      set({ camera: camRef.current });

      const tmpDir = new THREE.Vector3(0.0, 0.0, 0.0);
      tmpDir.sub(camRef.current.position);
      tmpDir.normalize();
      setCamDir(tmpDir.clone());
    }
  }, [scene, size]);

  return (<>
    <orthographicCamera ref={camRef} />
    <Coral camDir={camDir} cursorAvailableCallback={cursorAvailableCallback} cursorAvailable={cursorAvail} />
    <Coral camDir={camDir} cursorAvailableCallback={cursorAvailableCallback} cursorAvailable={cursorAvail} />
    <Coral camDir={camDir} cursorAvailableCallback={cursorAvailableCallback} cursorAvailable={cursorAvail} />
    <Sand />
    <directionalLight ref={lightRef} />
    <ambientLight />
  </>
  )
}

export default Reef;
