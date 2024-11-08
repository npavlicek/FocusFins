import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for 'registered' query parameter on component mount
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Login here.');
    }
  }, [location]);

  function doLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        navigate('/dashboard');
      } else {
        console.error("COULD NOT LOG IN");
      }
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <form onSubmit={doLogin}>
      <h2 className="login-title work-sans-login">Login</h2>

      {/* Display success message if registration was successful */}
      {successMessage && <p className="success-message">{successMessage}</p>}

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
      </div>
    </form>
  );
}
