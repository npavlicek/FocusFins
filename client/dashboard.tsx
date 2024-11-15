import Timer from './timer';
import { Canvas } from '@react-three/fiber';
import Reef from './reef';
import { StrictMode, useState, useCallback, useRef, useEffect } from 'react';
import Store from './store';
import { CoralCallbacks, CoralData } from './coral';

export default function Dashboard() {
  const [money, setMoney] = useState<number>(100);
  const [cursorAvail, setCursorAvail] = useState(true);
  const [corals, setCoralsData] = useState<CoralData[]>([]);
  const [currentCoralId, setCurrentCoralId] = useState<number>(0);
  const popupRef = useRef<HTMLDivElement>(null);
  const moveButtonRef = useRef<HTMLButtonElement>(null);
  const rotateButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.style.display = "none";
    }

    // TODO: LOAD CORALS FROM DATABASE HERE REPLACE THE TEMP CODE

    // BEGIN TEMP
    let initCorals: CoralData[] = [];
    for (let x = 0; x < 10; x++) {
      initCorals.push({ coralId: x, coralModelId: x });
    }
    // END TEMP

    setCoralsData(initCorals);
    setCurrentCoralId(10);
  }, []);

  let spawnCoral = useCallback((newCoralModelId: number) => {
    let newCoral: CoralData = {
      coralModelId: newCoralModelId,
      coralId: currentCoralId
    };
    setCoralsData(prevCorals => [...prevCorals, newCoral]);
    setCurrentCoralId(prevVal => { return ++prevVal; });
  }, [corals, currentCoralId]);

  const subtractBalance = (amount: number) => {
    setMoney((prevMoney) => prevMoney - amount);
  };

  let deleteCoral = useCallback((coralId: number) => {
    let newCorals: CoralData[] = corals.filter((val, idx) => {
      if (val.coralId != coralId)
        return true;
      else
        return false;
    });
    setCoralsData(newCorals);
  }, [corals]);

  const createPopup = useCallback((x: number, y: number, coralCallbacks: CoralCallbacks) => {
    if (popupRef.current) {
      popupRef.current.style.position = 'absolute';
      popupRef.current.style.display = 'block';
      popupRef.current.style.top = (y - 100).toString() + 'px';
      popupRef.current.style.left = x.toString() + 'px';
      popupRef.current.style.zIndex = '100';
      if (moveButtonRef.current)
        moveButtonRef.current.onclick = coralCallbacks.moveButtonHandler;
      if (rotateButtonRef.current)
        rotateButtonRef.current.onclick = coralCallbacks.rotateButtonHandler;
      if (closeButtonRef.current)
        closeButtonRef.current.onclick = coralCallbacks.closeButtonHandler;
      if (deleteButtonRef.current)
        deleteButtonRef.current.onclick = coralCallbacks.deleteButtonHandler;
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
          <Reef coralsData={corals} cursorAvailable={cursorAvail} setCursorAvailable={setCursorAvail} createPopupCallback={createPopup} closePopupCallback={closePopup} deleteCoralCallback={deleteCoral} />
        </Canvas>
        <Store spawnCoralCallback={spawnCoral} money={money} subtractBalance={subtractBalance} />
        <p>{money}</p>
      </div>
    </StrictMode>
  );
}
