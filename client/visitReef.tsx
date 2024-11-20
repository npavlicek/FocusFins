import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLoader } from '@react-three/fiber';
import { Mesh } from 'three/src/objects/Mesh';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera';
import { Canvas } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { EffectComposer } from '@react-three/postprocessing';

interface CoralData {
  coralId: number;
  coralModelId: number;
  position: {
    x: number;
    y: number;
    z: number;
  },
  rotation: {
    y: number;
  }
};

interface VisitReefProps {
  coralsData: CoralData[] | null;
};

const VisitReefWrapper: React.FC = () => {
  const [coralsData, setCoralsData] = useState<CoralData[] | null>(null);
  const [searchParams] = useSearchParams();
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const username = searchParams.get('username');
    fetch('./api/getCoralsByUsername', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username })
    }).then(res => {
      if (res.status === 200) {
        res.json().then(data => {
          setCoralsData(data);
        });
      } else {
        setIsError(true);
      }
    });
  }, []);

  return (
    <>
      {isError && <p>User does not exist!</p>}
      <h1 style={{ color: 'white', position: 'absolute', top: '15px', left: '50px', zIndex: 99 }}>{searchParams.get('username')}'s Reef</h1 >
      <Canvas shadows>
        <VisitReef coralsData={coralsData} />
      </Canvas>
    </>
  );
};

interface CoralProps {
  coralData: CoralData;
};

const Coral: React.FC<CoralProps> = (props: CoralProps) => {
  const coralsLoaded = useLoader(GLTFLoader, './public/cartoon_seaweed_9.glb');
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    const val = coralsLoaded.scene.children[props.coralData.coralModelId];
    if (meshRef.current) {
      meshRef.current.geometry = (val as Mesh).geometry;
      meshRef.current.material = (val as Mesh).material;
      meshRef.current.scale.set(0.20, 0.20, 0.20);
      meshRef.current.position.set(props.coralData.position.x, props.coralData.position.y, props.coralData.position.z);
      meshRef.current.rotation.y = props.coralData.rotation.y;
      meshRef.current.castShadow = true;
      meshRef.current.receiveShadow = true;
    }
  }, [coralsLoaded, meshRef]);

  return (
    <mesh ref={meshRef} />
  );
}

const VisitReef: React.FC<VisitReefProps> = (props: VisitReefProps) => {
  const sandLoaded = useLoader(GLTFLoader, './public/sand.glb');
  const sandMeshRef = useRef<Mesh | null>(null);
  const camRef = useRef<OrthographicCamera | null>(null);
  const lightRef = useRef<DirectionalLight>(null);
  const { scene, size, set, gl } = useThree();

  useEffect(() => {
    gl.domElement.style.marginTop = '15vh';
  }, []);

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.intensity = 2.0;
      lightRef.current.color.set('#ccf9ff');
      lightRef.current.castShadow = true;
      lightRef.current.shadow.mapSize.width = 2048;
      lightRef.current.shadow.mapSize.height = 2048;
      lightRef.current.position.set(0, 5, 5);
    }
  }, [lightRef]);

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
    }
  }, [scene, size]);

  useEffect(() => {
    if (sandMeshRef.current) {
      sandMeshRef.current.geometry = (sandLoaded.scene.children[0] as Mesh).geometry;
      sandMeshRef.current.material = (sandLoaded.scene.children[0] as Mesh).material;
      sandMeshRef.current.receiveShadow = true;
    }
  }, [sandLoaded]);

  return (
    <>
      <orthographicCamera ref={camRef} />
      <EffectComposer>
        <>
          {props.coralsData && props.coralsData.map(val => (
            <Coral coralData={val} />
          ))
          }
          <mesh ref={sandMeshRef} />
        </>
      </EffectComposer>
      <ambientLight intensity={2.0} color={0xCCF9FF} />
      <directionalLight ref={lightRef} />
    </>
  );
};

export default VisitReefWrapper;

