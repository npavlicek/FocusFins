import * as ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import LoginForm from './login';
import Dashboard from './dashboard';
import Register from './register'; 
import Store from './store'; 

import './styles.css';

const root = document.getElementById('root')!;
const reactRoot = ReactDOM.createRoot(root);

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <>
        <LoginForm />
        <Link to={'/dashboard'}>go to dashboard</Link>
      </>
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/register', 
    element: <Register />
  },
  {
    path: '/login', 
    element: <LoginForm/>
  },
  {
    path: '/store', 
    element: <Store/>
  }
]);

reactRoot.render(<>
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
</>);
