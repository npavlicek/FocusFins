import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Vector3 } from 'three/src/math/Vector3';
import { Mesh } from 'three/src/objects/Mesh';
import { useState, useEffect, useRef } from 'react';

interface FishProps {
  modelIndex: number;
};

/*
 * fish idx:
 * 0: shark
 * 1: pirannah
 * 2: gold fish
 * 3: dolphin
 * 4: trout
 * 5: big fish
 */

const Fish: React.FC<FishProps> = (props: FishProps) => {
  const fishMeshRef = useRef<Mesh>(null);
  const fishiesModels = useLoader(GLTFLoader, 'assets/fishies.glb');
  const [moveFinished, setMoveFinished] = useState<boolean>(true);
  const [destination, setDestination] = useState<Vector3>(new Vector3());

  useFrame((state, delta) => {
    if (moveFinished) {
      if (destination) {
        let newDest = new Vector3(Math.random() * 1 - 0.5, 0.2, Math.random() * 1 - 0.5);
        setDestination(newDest);
        setMoveFinished(false);
      }
    } else {
      if (fishMeshRef.current && destination) {
        const distance = destination.clone().sub(fishMeshRef.current.position).length();
        if (distance < 0.1) {
          setMoveFinished(true);
        } else {
          const dirVector = destination.clone().sub(fishMeshRef.current.position).normalize();
          const dirAngle = Math.atan2(dirVector.x, dirVector.z);
          const angleOffset = dirAngle - fishMeshRef.current.rotation.y;
          if (angleOffset < -0.05) {
            fishMeshRef.current.rotation.y += -0.004;
          } else if (angleOffset > 0.05) {
            fishMeshRef.current.rotation.y += +0.004;
          }
          fishMeshRef.current.position.add(new Vector3(Math.sin(fishMeshRef.current.rotation.y), 0, Math.cos(fishMeshRef.current.rotation.y)).multiplyScalar(0.0008));
          if (fishMeshRef.current.position.x > 0.6) {
            fishMeshRef.current.position.setX(-0.6);
          }
          if (fishMeshRef.current.position.x < -0.6) {
            fishMeshRef.current.position.setX(0.6);
          }
          if (fishMeshRef.current.position.z > 0.6) {
            fishMeshRef.current.position.setZ(-0.6);
          }
          if (fishMeshRef.current.position.z < -0.6) {
            fishMeshRef.current.position.setZ(0.6);
          }
        }
      }
    }
  });

  useEffect(() => {
    const model = fishiesModels.scene.children[props.modelIndex];
    if (fishMeshRef.current) {
      fishMeshRef.current.geometry = (model as Mesh).geometry;
      fishMeshRef.current.material = (model as Mesh).material;
      fishMeshRef.current.castShadow = true;
      fishMeshRef.current.receiveShadow = true;
      fishMeshRef.current.scale.set(0.003, 0.003, 0.003);
      fishMeshRef.current.position.set(Math.random() * 1 - 0.5, 0.2, Math.random() * 1 - 0.5);
    }
  }, [fishiesModels, props.modelIndex]);

  return (<mesh ref={fishMeshRef} />);
}

interface FishiesProps {
  fishiesData: number[];
};

const Fishies: React.FC<FishiesProps> = (props: FishiesProps) => {
  return (
    <>
      {
        props.fishiesData.map((val, idx) => (
          <Fish key={idx} modelIndex={val} />
        ))
      }
    </>
  );
}

export default Fishies;
