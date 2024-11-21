import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginForm from './login';
import Dashboard from './dashboard';
import Register from './register';
import VisitReefWrapper from './visitReef';
import ResetPassword from './resetPassword';
import Verify from './verify';
import LandingPage from './landing_page'

import './styles.css';

const root = document.getElementById('root')!;
const reactRoot = ReactDOM.createRoot(root);

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
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
  },
  {
    path: '/visitReef',
    element: <VisitReefWrapper />
  },
  {
    path: '/resetPassword',
    element: <ResetPassword />
  },
  {
    path: '/verify',
    element: <Verify />
  }
]);

reactRoot.render(
  <RouterProvider router={router} />
);
