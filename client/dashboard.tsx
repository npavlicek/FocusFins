import Timer from './timer';
import { Canvas } from '@react-three/fiber';
import Reef from './reef';
import { StrictMode, useState, useCallback, useRef, useEffect } from 'react';
import Store from './store';

export default function Dashboard() {
  const [money, setMoney] = useState<number>(100);
  const [cursorAvail, setCursorAvail] = useState(true);
  const [corals, setCorals] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const popupRef = useRef<HTMLDivElement>(null);
  const moveButtonRef = useRef<HTMLButtonElement>(null);
  const rotateButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.style.display = "none";
    }
  }, []);

  let spawnCoral = (id: number) => {
    setCorals(prevCorals => [...prevCorals, id]);
  };

  const subtractBalance = (amount: number) => {
    setMoney((prevMoney) => prevMoney - amount);
  };

  const createPopup = useCallback((x: number, y: number, moveButtonHandler: (e: MouseEvent) => void) => {
    if (popupRef.current) {
      popupRef.current.style.position = 'absolute';
      popupRef.current.style.display = 'block';
      popupRef.current.style.top = (y - 100).toString() + 'px';
      popupRef.current.style.left = x.toString() + 'px';
      popupRef.current.style.zIndex = '100';
      if (moveButtonRef.current)
        moveButtonRef.current.onclick = moveButtonHandler;
    }
  }, []);

  const closePopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  }, []);

  return (
    <StrictMode>
      <div id="dashboard">
        <Timer username={"Test_username"} />
        <div ref={popupRef}>
          <button ref={moveButtonRef}>move</button>
          <button ref={rotateButtonRef}>rotate</button>
          <button ref={deleteButtonRef}>delete</button>
          <button ref={closeButtonRef}>close</button>
        </div>
        <Canvas shadows>
          <Reef corals={corals} cursorAvailable={cursorAvail} setCursorAvailable={setCursorAvail} createPopupCallback={createPopup} closePopupCallback={closePopup} />
        </Canvas>
        <Store spawnCoralCallback={spawnCoral} money={money} subtractBalance={subtractBalance} />
        <p>{money}</p>
      </div>
    </StrictMode>
  );
}
