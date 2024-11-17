import Timer from './timer';
import { Canvas } from '@react-three/fiber';
import Reef from './reef';
import { StrictMode, useState, useCallback, useRef, useEffect } from 'react';
import Store from './store';
import { CoralCallbacks, CoralData } from './coral';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    const reqBody = JSON.stringify({
      token: localStorage.getItem('token')
    });
    fetch('/api/isAuthenticated', {
      method: 'post', body: reqBody, headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status !== 200) {
        localStorage.clear();
      }
    });

    if (localStorage.getItem('logged-in') !== 'true') {
      navigate('/login');
    }

    if (popupRef.current) {
      popupRef.current.style.display = "none";
    }

    const getCoralsReqBody = JSON.stringify({
      id: localStorage.getItem('id')
    });

    fetch('/api/getCorals', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: getCoralsReqBody
    }).then(res => {
      if (res.status === 200) {
        res.json().then(data => {
          let idx = 0;
          const newCorals: CoralData[] = data.corals.map((curCoral: any) => {
            let newCurCoral: CoralData = {
              ...curCoral,
              coralId: idx
            };
            idx++;
            return newCurCoral;
          });

          setCoralsData(newCorals);
          setCurrentCoralId(idx);
        });
      } else {
        localStorage.clear();
        navigate('/login');
      }
    });
  }, []);

  const pushCorals = useCallback((newCorals: CoralData[]) => {
    const coralsBody = newCorals.map(val => {
      return {
        coralModelId: val.coralModelId,
        position: val.position,
        rotation: val.rotation
      };
    });

    const reqBody = JSON.stringify({
      token: localStorage.getItem('token'),
      corals: coralsBody
    });

    fetch('./api/updateCorals', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: reqBody
    }).then(res => {
      if (res.status !== 200) {
        localStorage.clear();
        navigate('/login');
      }
    });
  }, [corals]);

  const spawnCoral = useCallback((newCoralModelId: number) => {
    let newCoral: CoralData = {
      coralModelId: newCoralModelId,
      coralId: currentCoralId,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: {
        y: 0
      }
    };
    setCoralsData(prevCorals => {
      const res: CoralData[] = [...prevCorals, newCoral];
      pushCorals(res);
      return res;
    });
    setCurrentCoralId(prevVal => { return ++prevVal; });
  }, [corals, currentCoralId, pushCorals]);


  const updateCoral = useCallback((newCoralData: CoralData) => {
    setCoralsData(oldCoralData => {
      const res: CoralData[] = oldCoralData.map(val => {
        if (val.coralId === newCoralData.coralId) {
          return newCoralData;
        } else {
          return val;
        }
      });
      pushCorals(res);
      return res;
    });
  }, [corals, pushCorals]);

  const subtractBalance = (amount: number) => {
    setMoney((prevMoney) => prevMoney - amount);
  };

  const deleteCoral = useCallback((coralId: number) => {
    setCoralsData(oldCorals => {
      let newCorals: CoralData[] = oldCorals.filter((val, idx) => {
        if (val.coralId != coralId)
          return true;
        else
          return false;
      });
      pushCorals(newCorals);
      return newCorals;
    });
  }, [corals, pushCorals]);

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
          <Reef coralsData={corals} cursorAvailable={cursorAvail} setCursorAvailable={setCursorAvail} createPopupCallback={createPopup} closePopupCallback={closePopup} deleteCoralCallback={deleteCoral} updateCoralCallback={updateCoral} />
        </Canvas>
        <Store spawnCoralCallback={spawnCoral} money={money} subtractBalance={subtractBalance} />
        <p>{money}</p>
      </div>
    </StrictMode>
  );
}
