import * as reactDOM from "react-dom/client";
import * as react from 'react';
import { useState } from "react";
import { password } from "bun";
import './styles.css';

const root = document.getElementById('root')!;

const reactRoot = reactDOM.createRoot(root);

reactRoot.render(<App/>)
function App() {
    const [username, setUsername] = useState("username");
    const [Password, setPassword] = useState("password");
    return (
        <>
        <LoginForm setUsername={setUsername} setPassword={setPassword} />
        <h1>{username}</h1>
        <h1>{Password}</h1>
        </>
    );
}

function LoginForm({setUsername , setPassword} : {setUsername: React.Dispatch<React.SetStateAction<string>>, setPassword: React.Dispatch<React.SetStateAction<string>>}) {
    function doLogin(event : React.FormEvent<HTMLFormElement>) {

    }

    function updateUsername( event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setUsername(event.target.value);
    }

    function updatePassword( event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setPassword(event.target.value);
    }


    return (
            <form onSubmit={doLogin}>
                <input type="text" onChange={updateUsername} placeholder="Username"/>
                <input type="password" onChange={updatePassword} placeholder="Password"/>
                <input type ="submit" value="submit"/>
            </form>
    );
}