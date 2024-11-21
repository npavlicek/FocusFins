import { useState, useEffect } from 'react';
const ResetPassword: React.FC = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailSent(true);
  };

  return (
    <div className="centeredCard">
      <form onSubmit={submitHandler}>
        <h2 className="login-title work-sans-login">Reset Password</h2>
        {emailSent && <p className="success-message">Check your email for a password reset link!</p>}
        <div className="input-container">
          <input type="email" placeholder="email@example.com" onInput={(e: React.FormEvent<HTMLInputElement>) => { setEmail(e.currentTarget.value); }} />
        </div>
        <input type="submit" value="Reset" />
      </form>
    </div>
  );
};

export default ResetPassword;
