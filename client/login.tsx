import React from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

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

    if (localStorage.getItem('logged-in') === 'true') {
      navigate('/dashboard');
    }
  }, []);

  // Check for 'registered' query parameter on component mount
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true') {
      setSuccessMessage('Registration successful. Please check your email for a verification link!');
    }
  }, [location]);

  function doLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(''); // Clear any previous error message

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
          }
        });
      }
    }).catch(err => {
      setErrorMessage('An error occurred. Please try again later.');
      console.error(err);
    });

    console.log("HERE2");
  }

  return (
    <div className="centeredCard">
      <form onSubmit={doLogin}>
        <h2 className="login-title work-sans-login">Login</h2>

        {/* Display success message if registration was successful */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Display error message if login failed */}
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
          or
          <Link to="/resetPassword">
            <button type="button" className="register-button">Reset your password</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
