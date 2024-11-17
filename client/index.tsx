import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import LoginForm from './login';
import Dashboard from './dashboard';
import Register from './register';
import './styles.css';

const root = document.getElementById('root')!;
const reactRoot = ReactDOM.createRoot(root);

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <LoginForm />
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
    element: <LoginForm />
  }
]);

reactRoot.render(
  <RouterProvider router={router} />
);
