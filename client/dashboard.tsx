import Timer from './timer';
import { Canvas } from '@react-three/fiber';
import Reef from './reef';
import { StrictMode, useState, useCallback, useRef, useEffect } from 'react';
import Store from './store';
import Navbar from './navbar';
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
          setCoralsData(data.corals);
          setCurrentCoralId(data.currentCoralIdx);
        });
      } else {
        localStorage.clear();
        navigate('/login');
      }
    });
  }, []);

  /**
   * push entire coral state and override on database
   */
  const pushCorals = (newCorals: CoralData[]) => {
    const reqBody = JSON.stringify({
      token: localStorage.getItem('token'),
      corals: newCorals
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
  };

  /**
   * push one new coral to reef
   */
  const pushNewCoral = (newCoral: CoralData) => {
    const reqBody = JSON.stringify({
      token: localStorage.getItem('token'),
      coral: newCoral
    });

    fetch('./api/addCoral', {
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
  };

  /**
   * remove a coral by id
   */
  const pushRemoveCoral = (coralId: number) => {
    const reqBody = JSON.stringify({
      token: localStorage.getItem('token'),
      coralId: coralId
    });

    fetch('./api/removeCoral', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: reqBody
    }).then(res => {
      if (res.status !== 200) {
        console.error(res);
        localStorage.clear();
        navigate('/login');
      }
    });
  };

  /**
   * update coral by id 
   */
  const pushUpdateCoral = (coralData: CoralData) => {
    const reqBody = JSON.stringify({
      token: localStorage.getItem('token'),
      coralId: coralData.coralId,
      coral: coralData
    });

    fetch('./api/updateCoral', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: reqBody
    }).then(res => {
      if (res.status !== 200) {
        console.error(res);
        localStorage.clear();
        navigate('/login');
      }
    });
  };

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
    pushNewCoral(newCoral);
    setCoralsData(prevCorals => [...prevCorals, newCoral]);
    setCurrentCoralId(prevVal => { return ++prevVal; });
  }, [corals, currentCoralId, pushCorals]);

  const updateCoral = useCallback((newCoralData: CoralData) => {
    pushUpdateCoral(newCoralData);
    setCoralsData(oldCoralData => {
      return oldCoralData.map(val => {
        if (val.coralId === newCoralData.coralId) {
          return newCoralData;
        } else {
          return val;
        }
      });
    });
  }, [corals, pushCorals]);

  const subtractBalance = (amount: number) => {
    setMoney((prevMoney) => prevMoney - amount);
  };

  const deleteCoral = useCallback((coralId: number) => {
    pushRemoveCoral(coralId);
    setCoralsData(oldCorals => {
      return oldCorals.filter((val, idx) => {
        if (val.coralId != coralId)
          return true;
        else
          return false;
      });
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

        <div ref={popupRef}className="popup-container">
          <button ref={moveButtonRef} className="popup-button">move</button>
          <button ref={rotateButtonRef} className="popup-button">rotate</button>
          <button ref={deleteButtonRef} className="popup-button">delete</button>
          <button ref={closeButtonRef} className="popup-button">close</button>
        </div>

        <div id="mainContent">
          <Timer username={"Test_username"} />
          <Canvas shadows>
            <Reef coralsData={corals} cursorAvailable={cursorAvail} setCursorAvailable={setCursorAvail} createPopupCallback={createPopup} closePopupCallback={closePopup} deleteCoralCallback={deleteCoral} updateCoralCallback={updateCoral} />
          </Canvas>
        </div>
        <Store spawnCoralCallback={spawnCoral} money={money} subtractBalance={subtractBalance} />
        <Navbar />
      </div>
    </StrictMode>
  );
}
