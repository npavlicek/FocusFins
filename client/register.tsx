import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const [showRequirements, setShowRequirements] = useState(false);

  const validatePassword = (password) => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (newPassword) setShowRequirements(true);
  };

  function doRegister(event) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (Object.values(requirements).some((req) => !req)) {
      setError("Password does not meet all requirements");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log("Registration form submitted");
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);
      setIsLoading(false);
      setIsRegistered(true);
    }, 2000); // Replace with actual API call!!!!!
  }

  if (isRegistered) {
    return <p className="success-message">Registration successful! You can now log in.</p>;
  }

  return (
    <form onSubmit={doRegister} className="register-form">
      <h2 className="register-title">Register</h2>
      
      {error && <p className="error-message">{error}</p>}

      <div className="input-container">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="input-container">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          onFocus={() => setShowRequirements(true)}
          onBlur={() => !password && setShowRequirements(false)}
          required
        />
      </div>
      
      {showRequirements && (
        <div className="password-requirements">
          <h4>Password must include:</h4>
          <ul>
            <li className={requirements.length ? "valid" : "invalid"}>
              {requirements.length ? "✓" : "✗"} At least 8 characters
            </li>
            <li className={requirements.uppercase ? "valid" : "invalid"}>
              {requirements.uppercase ? "✓" : "✗"} One uppercase letter
            </li>
            <li className={requirements.lowercase ? "valid" : "invalid"}>
              {requirements.lowercase ? "✓" : "✗"} One lowercase letter
            </li>
            <li className={requirements.number ? "valid" : "invalid"}>
              {requirements.number ? "✓" : "✗"} One number
            </li>
            <li className={requirements.specialChar ? "valid" : "invalid"}>
              {requirements.specialChar ? "✓" : "✗"} One special character
            </li>
          </ul>
        </div>
      )}

<button type="submit" className="register-button register-page-button" disabled={isLoading}>
  {isLoading ? "Registering..." : "Register"}
</button>

      
      {/* Link to Login Page */}
      <div className="register-container">
                <span className="small-text">Already have an account? </span>
  <             Link to="/login" className="login-link">Login here!</Link>
        </div>

    </form>
  );
}
