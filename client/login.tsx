import React from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [showResetPassword, setShowResetPassword] = React.useState(false); // State to control reset password visibility
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const reqBody = JSON.stringify({
      token: localStorage.getItem('token')
    });
    fetch('/api/isAuthenticated', {
      method: 'post',
      body: reqBody,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status !== 200) {
        localStorage.clear();
      }
    });

    if (localStorage.getItem('logged-in') === 'true') {
      navigate('/dashboard');
    }
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true') {
      setSuccessMessage('Registration successful. Please check your email for a verification link!');
    }
  }, [location]);

  function doLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setShowResetPassword(false); // Hide reset password option initially

    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        res.json().then(val => {
          localStorage.setItem('logged-in', 'true');
          localStorage.setItem('token', val.token);
          localStorage.setItem('firstName', val.firstName);
          localStorage.setItem('lastName', val.lastName);
          localStorage.setItem('id', val.id);
          navigate('/dashboard');
        }).catch(err => {
          setErrorMessage('An error occurred. Please try again later.');
          console.error(err);
        });
      } else {
        res.json().then(data => {
          if (data.emailVerified === false) {
            setErrorMessage("Please verify your email!");
          } else {
            setErrorMessage("Invalid username or password!");
            setShowResetPassword(true); // Show reset password option on invalid credentials
          }
        });
      }
    }).catch(err => {
      setErrorMessage('An error occurred. Please try again later.');
      console.error(err);
    });
  }

  return (
    <div className="login-background">
      <div className="centeredCard">
        <form onSubmit={doLogin}>
          <h2 className="login-title work-sans-login">Login</h2>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
          <div className="register-container">
            <span className="small-text">New to FocusFins?</span>
            <Link to="/register">
              <button type="button" className="register-button">Register here!</button>
            </Link>
            {showResetPassword && (
              <>
                or
                <Link to="/resetPassword">
                  <button type="button" className="register-button">Reset your password</button>
                </Link>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
