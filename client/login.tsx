import React from 'react';
import { Link } from 'react-router-dom'; // Make sure to import Link

export default function LoginForm() {
  function doLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Form submitted");
  }

  function updateUsername(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }

  function updatePassword(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }

  return (
    <form onSubmit={doLogin}>
      <h2 className="login-title work-sans-login">Login</h2>
      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={updateUsername}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          onChange={updatePassword}
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
