import Timer from './timer';
import { Canvas } from '@react-three/fiber';
import Reef from './newreef';
import { StrictMode } from 'react';

export default function Dashboard() {
  return (
    <StrictMode>
      <div id="dashboard">
        <Timer timeLimit={10} />
        <Canvas shadows>
          <Reef />
        </Canvas>
      </div>
    </StrictMode>
  );
}
