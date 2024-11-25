import * as ReactDOM from 'react-dom/client';
import Dashboard from './dashboard';

import './styles.css';

const root = document.getElementById('root')!;
const reactRoot = ReactDOM.createRoot(root);

function initApp(token: string, id: string) {
	fetch('http://focusfins.org/api/isAuthenticated', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}, body: JSON.stringify({ token })
	}).then(res => {
		if (res.status === 200) {
			reactRoot.render(
				<Dashboard token={token!} id={id!} />
			);
		} else {
			reactRoot.render(
				<h1 style={{ color: 'white' }}>Not logged in!</h1>
			);
		}
	});
}

declare global {
	interface Window {
		initApp: (token: string, id: string) => void;
	}
};

window.initApp = initApp;

// @ts-ignore
FocusFinsState.postMessage("WOWEEE");
