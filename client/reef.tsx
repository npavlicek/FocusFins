import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import THREE from 'three';
import { CoralCallbacks } from './coral';

import Sand from './sand';
import Coral from './coral';

interface ReefProps {
  cursorAvailable: boolean;
  setCursorAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  createPopupCallback: (x: number, y: number, coralCallbacks: CoralCallbacks) => void;
  closePopupCallback: () => void;
  corals: number[];
};

const Reef: React.FC<ReefProps> = (props: ReefProps) => {
  const camRef = useRef<THREE.OrthographicCamera | null>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const [camDir, setCamDir] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const { scene, size, set } = useThree();

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.intensity = 2.0;
      lightRef.current.color.set('#ccf9ff');
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
    <EffectComposer autoClear={false}>
      {
        props.corals.map((val, idx) => (
          <Coral key={idx} coralId={val} camDir={camDir} setCursorAvailable={props.setCursorAvailable} cursorAvailable={props.cursorAvailable} createPopupCallback={props.createPopupCallback} closePopupCallback={props.closePopupCallback} />
        ))
      }
    </EffectComposer>
    <Sand />
    <ambientLight intensity={1.0} color={0xCCF9FF} />
    <directionalLight ref={lightRef} />
    <ambientLight />
  </>
  )
}

export default Reef;
