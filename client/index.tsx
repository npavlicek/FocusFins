import * as ReactDOM from 'react-dom/client';
import { useState } from 'react';
import './styles.css';

const root = document.getElementById('root')!;

const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(<App />);

function App() {
  const [Username, setUsername] = useState("username");
  const [Password, setPassword] = useState("password");

  return (
    <>   
      <LoginForm setUsername={setUsername} setPassword={setPassword} />
      <h1>{Username}</h1>
      <h1>{Password}</h1>
    </>
  );
}

interface LoginFormProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

function LoginForm({ setUsername, setPassword }: LoginFormProps) {
    function doLogin(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault(); 
      console.log("Form submitted");
    }
  
    function updateUsername(event: React.ChangeEvent<HTMLInputElement>) {
      setUsername(event.target.value); 
    }
  
    function updatePassword(event: React.ChangeEvent<HTMLInputElement>) {
      setPassword(event.target.value); 
    }
  
    return (
      <form onSubmit={doLogin}>
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
      </form>
    );
  }