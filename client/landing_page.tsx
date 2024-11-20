import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div
      className='landingPage'
    >
     
      <button className='lpLoginButton'
        onClick={handleLoginClick}
      >
        Login Here
      </button>
    </div>
  );
};

export default LandingPage;
