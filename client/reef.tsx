import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { Vector3 } from 'three/src/math/Vector3';
import { Mesh } from 'three/src/objects/Mesh';
import { CoralCallbacks, CoralData } from './coral';

import Sand from './sand';
import Coral from './coral';
import Fishies from './fishies';

interface ReefProps {
  cursorAvailable: boolean;
  setCursorAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  createPopupCallback: (x: number, y: number, coralCallbacks: CoralCallbacks) => void;
  closePopupCallback: () => void;
  deleteCoralCallback: (coralId: number) => void;
  updateCoralCallback: (newCoralData: CoralData) => void;
  coralsData: CoralData[];
};

const Reef: React.FC<ReefProps> = (props: ReefProps) => {
  const camRef = useRef<OrthographicCamera | null>(null);
  const lightRef = useRef<DirectionalLight>(null);
  const [camDir, setCamDir] = useState<Vector3>(new Vector3(0, 0, 0));
  const [sandMesh, setSandMesh] = useState<Mesh>();
  const [fishiesData, setFishiesData] = useState<number[]>([]);
  const [oldScore, setOldScore] = useState<number>(0);

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
    const totalScore = props.coralsData.length;
    if (oldScore !== totalScore) {
      let totalRare = 0;
      let totalNormal = 0;
      if (totalScore >= 15) {
        totalRare = 0.3 * totalScore - 3.5;
        totalRare = Math.floor(totalRare);
      }

      totalNormal = 0.5 * totalScore + 1.0;
      totalNormal = Math.floor(totalNormal);

      let newFishiesData = [];

      for (let x = 0; x < totalRare; x++) {
        const c = Math.random();
        if (c > 0.5)
          newFishiesData.push(0);
        else
          newFishiesData.push(3);
      }

      for (let x = 0; x < totalNormal; x++) {
        const c = Math.random();
        if (c < 0.25)
          newFishiesData.push(1);
        else if (c < 0.5)
          newFishiesData.push(2);
        else if (c < 0.75)
          newFishiesData.push(4);
        else if (c < 1.0)
          newFishiesData.push(5);
      }

      setOldScore(totalScore);
      setFishiesData(newFishiesData);
    }
  }, [props.coralsData]);

  useEffect(() => {
    const scale = 1.0;
    if (camRef.current) {
      const aspect = size.width / size.height;
      const camWidth = 2;
      const camHeight = camWidth / aspect;
      camRef.current.top = (camHeight / 2) * scale;
      camRef.current.bottom = -camHeight / 2 * scale;
      camRef.current.left = -camWidth / 2 * scale;
      camRef.current.right = camWidth / 2 * scale;
      camRef.current.near = 0.001;
      camRef.current.far = 500;
      camRef.current.position.z = 1 * 50;
      camRef.current.position.x = 1 * 50;
      camRef.current.position.y = 0.50 * 50;
      camRef.current.lookAt(0, 0, 0);
      camRef.current.updateProjectionMatrix();
      set({ camera: camRef.current });

      const tmpDir = new Vector3(0.0, 0.0, 0.0);
      tmpDir.sub(camRef.current.position);
      tmpDir.normalize();
      setCamDir(tmpDir.clone());
    }
  }, [scene, size]);

  return (<>
    <orthographicCamera ref={camRef} />
    <EffectComposer autoClear={false}>
      <>
        <Fishies fishiesData={fishiesData} />
        {
          props.coralsData.map(val => (
            <Coral key={val.coralId} coralData={val} sandMesh={sandMesh!} camDir={camDir} setCursorAvailable={props.setCursorAvailable} cursorAvailable={props.cursorAvailable} createPopupCallback={props.createPopupCallback} closePopupCallback={props.closePopupCallback} deleteCoralCallback={props.deleteCoralCallback} updateCoralCallback={props.updateCoralCallback} />
          ))
        }
        <Sand setSandMesh={setSandMesh} />
      </>
    </EffectComposer>
    <ambientLight intensity={2.0} color={0xCCF9FF} />
    <directionalLight ref={lightRef} />
  </>
  )
}

export default Reef;
