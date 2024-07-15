import { useState } from 'react';
import './LoginView.css';
import { userIsRegistered, displayUserName, restoreGameFromLocalOrDB } from '../appTypes';

/** Creates the view for the log in screen */
function LoginView(props: {displayUserName: displayUserName, userIsRegistered: userIsRegistered, restoreGameFromLocalOrDB: restoreGameFromLocalOrDB}) {
    const { userIsRegistered, displayUserName, restoreGameFromLocalOrDB } = props;
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showWarning, setShowWarning] = useState('black');

    function enterSubmit(e: React.KeyboardEvent) {
      if (e.code !== 'Enter') {
        return;
      }
      e.preventDefault();
      sendNameAndPassword(name, password, false)
      setName('');
      setPassword('');
    };
    
    
    /** Immediately moves on if guest option chosen. Otherwise queries backend to confirm log in and to check for saved data */
    async function sendNameAndPassword(name: string, pword: string, guest: boolean) {
      if (guest === true) {
        displayUserName(name, true);
        userIsRegistered(false);
        setName('');
        setPassword('');
        return;
      } else {
        if (name.length < 2 || pword.length < 8 || name === 'Guest') {
          if (showWarning === 'red') {
            window.alert('Check your username and password to login and proceed');
          }
          setShowWarning('red');
          return;
        }
        console.log(name, 'name in sendName')
        const body = JSON.stringify({name: name, password: pword});
        const request = new Request('/api/users/login', {method: 'POST', body: body, headers: {'Content-Type': 'application/json'} })
        const loggedIn = await fetch(request)
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((e) => console.error(e));

        if (loggedIn === 'success') {
          console.log(name, 'name in sendName 2')
          const savedGame = await restoreGameFromLocalOrDB(name);
          console.log(savedGame, 'local')
          if (savedGame) {
            displayUserName(name, false);
            setName('');
            setPassword('');
            userIsRegistered(true);
            return;
          }
          displayUserName(name, true);
          setName('');
          setPassword('');
          userIsRegistered(true);
        } else {
          window.alert('Check your username and password to login and proceed');
        }
      } 
    };

    /** Queries backend and adds new user to DB if actuall new */
    async function addNameAndPassword(name: string, pword: string) {
      if (name.length < 2 || pword.length < 8 || name === 'Guest') {
        if (showWarning === 'red') {
          window.alert('Check your username and password to login and proceed');
        }
        setShowWarning('red');
        return;
      }
      const newUser = JSON.stringify({ name: name, password: pword });
      const request = new Request('/api/users/create', {method: 'POST', body: newUser, headers: {'Content-Type': 'application/json'} });
      const wasCreated = await fetch(request)
      .then((res) => res.json())
      .then((data) => {
        if (data === 'saved') {
          return data;
        } else {
          return 'not saved'
        }
      })
      .catch((e) => console.error(e));
      console.log(wasCreated)
      if (wasCreated === 'saved') {
        userIsRegistered(true);
        displayUserName(name, true);
        setName('');
        setPassword('');
      } else {
        window.alert('There was an issue saving your user info. Do you already have an account?');
      }
    };
    

    return (
      <>
      <div>
      <div style={{color: showWarning}}>
        <b>User name must be at least 2 characters and cannot be "Guest". Password must be at least 8.</b>
      </div>
      <div className="login-fields">
        <label htmlFor="name">
          User Name: 
        </label>
        <input id="name" type="text" required minLength={2} value={name} onKeyDown={enterSubmit} onChange={(c) => {
          setShowWarning('black');
          setName(c.target.value);
          }}>
        </input>
        <label htmlFor="password">
          Password: 
        </label>
        <input id="password" type="password" required minLength={8} value={password} onKeyDown={enterSubmit} onChange={(c) => {
          setShowWarning('black');
          setPassword(c.target.value);
          }}>
        </input>
        <button onClick={() => addNameAndPassword(name, password)}>
          Create New User
        </button>
        <button onClick={() => sendNameAndPassword(name, password, false)}>
          Sign In
        </button>
      </div><br></br>
      <button onClick={() => sendNameAndPassword('Guest', 'password', true)}>
        Sign in as guest
      </button>
      </div>
      </>
    )
}

export default LoginView