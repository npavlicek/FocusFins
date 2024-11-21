import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const key = searchParams.get("key");

  const submitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('/api/resetPassword', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    }).then(res => {
      if (res.status === 200) {
        setEmailSent(true);
      } else {
        setError(true);
      }
    }).catch(err => {
      setError(err);
      console.error(err);
    });
  };

  const submitReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('/api/submitPasswordReset', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ key, password })
    }).then(res => {
      if (res.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setError(true);
      }
    }).catch(err => {
      setError(err);
      console.error(err);
    });
  };

  return (
    <div className="centeredCard">
      {!key &&
        <>
          <form onSubmit={submitEmail}>
            <h2 className="login-title work-sans-login">Reset Password</h2>
            {emailSent && <p className="success-message">Check your email for a password reset link!</p>}
            {error && <p className="error-message">There was an error processing your request</p>}
            <div className="input-container">
              <input type="email" placeholder="email@example.com" onInput={(e: React.FormEvent<HTMLInputElement>) => { setEmail(e.currentTarget.value); }} />
            </div>
            <input type="submit" value="Reset" />
          </form>
        </>
      }
      {key &&
        <>
          <form onSubmit={submitReset}>
            <h2 className="login-title work-sans-login">Reset Password</h2>
            {success && <p className="success-message">Successfully reset your password! Redirecting...</p>}
            {error && <p className="error-message">There was an error processing your request</p>}
            <div className="input-container">
              <input type="password" onInput={(e: React.FormEvent<HTMLInputElement>) => { setPassword(e.currentTarget.value); }} />
            </div>
            <input type="submit" value="Reset" />
          </form>
        </>
      }
    </div>
  );
};

export default ResetPassword;
