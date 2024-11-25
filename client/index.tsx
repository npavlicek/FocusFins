import * as ReactDOM from 'react-dom/client';
import Dashboard from './dashboard';

import './styles.css';

const root = document.getElementById('root')!;
const reactRoot = ReactDOM.createRoot(root);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const token = urlParams.get('token');
const id = urlParams.get('id');

fetch('./api/isAuthenticated', {
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

