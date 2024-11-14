import Timer from './timer';
import { Canvas } from '@react-three/fiber';
import Reef from './reef';
import { StrictMode, useCallback, useState, useEffect } from 'react';
import Store from './store';

export default function Dashboard() {
  const [money, setMoney] = useState<number>(100);
  const [cursorAvail, setCursorAvail] = useState(true);
  const [corals, setCorals] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  const spawnCoral = useCallback((id: number) => {
    let newCorals = Array.from(corals);
    newCorals.push(id);
    setCorals(newCorals);
  }, [corals]);

  useEffect(() => {
    console.log(corals);
  }, [corals]);

  return (
    <StrictMode>
      <div id="dashboard">
        <Timer username={"Test_username"} />
        <Canvas shadows>
          <Reef corals={corals} cursorAvailable={cursorAvail} setCursorAvailable={setCursorAvail} />
        </Canvas>
        <Store spawnCoralCallback={spawnCoral} />
      </div>
    </StrictMode>
  );
}
