import { Canvas } from '@react-three/fiber';
import Reef from './reef';
import { StrictMode, useState, useCallback, useRef, useEffect } from 'react';
import { CoralCallbacks, CoralData } from './coral';

interface DashboardParams {
	id: string;
	token: string;
};

export default function Dashboard(props: DashboardParams) {
	const [cursorAvail, setCursorAvail] = useState(true);
	const [corals, setCoralsData] = useState<CoralData[]>([]);
	const [currentCoralId, setCurrentCoralId] = useState<number>(0);
	const popupRef = useRef<HTMLDivElement>(null);
	const moveButtonRef = useRef<HTMLButtonElement>(null);
	const rotateButtonRef = useRef<HTMLButtonElement>(null);
	const deleteButtonRef = useRef<HTMLButtonElement>(null);
	const [error, setError] = useState<boolean>();

	useEffect(() => {
		if (popupRef.current) {
			popupRef.current.style.display = "none";
		}

		const getCoralsReqBody = JSON.stringify({
			id: props.id
		});

		fetch('http://focusfins.org/api/getCorals', {
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
				setError(true);
			}
		});
	}, []);

	/**
	 * push entire coral state and override on database
	 */
	const pushCorals = (newCorals: CoralData[]) => {
		const reqBody = JSON.stringify({
			token: props.token,
			corals: newCorals
		});

		fetch('http://focusfins.org/api/updateCorals', {
			method: 'post',
			headers: {
				"Content-Type": "application/json"
			},
			body: reqBody
		}).then(res => {
			if (res.status !== 200) {
				setError(true);
			}
		});
	};

	/**
	 * remove a coral by id
	 */
	const pushRemoveCoral = (coralId: number) => {
		const reqBody = JSON.stringify({
			token: props.token,
			coralId: coralId
		});

		fetch('http://focusfins.org/api/removeCoral', {
			method: 'post',
			headers: {
				"Content-Type": "application/json"
			},
			body: reqBody
		}).then(res => {
			if (res.status !== 200) {
				setError(true);
			}
		});
	};

	/**
	 * update coral by id
	 */
	const pushUpdateCoral = (coralData: CoralData) => {
		const reqBody = JSON.stringify({
			token: props.token,
			coralId: coralData.coralId,
			coral: coralData
		});

		fetch('http://focusfins.org/api/updateCoral', {
			method: 'post',
			headers: {
				"Content-Type": "application/json"
			},
			body: reqBody
		}).then(res => {
			if (res.status !== 200) {
				setError(true);
			}
		});
	};

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

	const deleteCoral = useCallback((coralId: number) => {
		pushRemoveCoral(coralId);
		setCoralsData(oldCorals => {
			return oldCorals.filter((val) => {
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

				<div ref={popupRef} className="popup-container">
					<button ref={moveButtonRef} className="popup-button">move</button>
					<button ref={rotateButtonRef} className="popup-button">rotate</button>
					<button ref={deleteButtonRef} className="popup-button-delete">delete</button>
				</div>

				{error &&
					<h1>ERROR</h1>
				}

				{!error &&
					<Canvas shadows>
						<Reef coralsData={corals} cursorAvailable={cursorAvail} setCursorAvailable={setCursorAvail} createPopupCallback={createPopup} closePopupCallback={closePopup} deleteCoralCallback={deleteCoral} updateCoralCallback={updateCoral} />
					</Canvas>
				}
			</div >
		</StrictMode >
	);
}
