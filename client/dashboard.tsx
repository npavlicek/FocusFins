import Timer from './timer';
import { Canvas } from '@react-three/fiber';
import Reef from './newreef';

export default function Dashboard() {
  return (
    <div id="dashboard">
      <Timer timeLimit={10} />
      <Canvas shadows>
        <Reef />
      </Canvas>
    </div>
  );
}
