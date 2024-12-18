import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Verify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/verifyEmail', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ key: searchParams.get('key') })
    }).then(res => {
      if (res.status === 200) {
        setVerified(true);
      } else {
        setError(true);
      }
    }).catch(err => {
      console.error(err);
    });
  }, []);

  useEffect(() => {
    if (verified === true) {
      setTimeout(() => navigate('/login'), 1000);
    }
  }, [verified]);

  return (
    <>
      {verified &&
        <h3 style={{ color: 'white' }}>Thank you for verifying your email!</h3>
      }
      {error &&
        <h3 style={{ color: 'red' }}>Verification link is invalid!</h3>
      }
    </>
  );
};

export default Verify;
