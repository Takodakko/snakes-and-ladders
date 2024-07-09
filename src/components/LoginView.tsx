import { useState } from 'react';
import './LoginView.css';

/** Creates the view for the log in screen */
function LoginView(props: {displayUserName: Function}) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showWarning, setShowWarning] = useState('#63c4e2');

    function enterSubmit(e: React.KeyboardEvent) {
      if (e.code !== 'Enter') {
        return;
      }
      e.preventDefault();
      sendNameAndPassword(name, password, false)
      setName('');
      setPassword('');
    };
    
    function sendNameAndPassword(name: string, pword: string, guest: boolean) {
      if (guest === true) {
        props.displayUserName(name);
      } else {
        if (name.length < 2 || pword.length < 8 || name === 'Guest') {
          if (showWarning === 'red') {
            window.alert('Check your username and password to login and proceed');
          }
          setShowWarning('red');
          return;
        }
        console.log(name, pword, 'name and pword')
        props.displayUserName(name);
      } 
    };
    // //   useEffect(() => {
    //     const newName = await fetch('/login', {method: 'POST', body: data})
    //     .then((res) => res.json())
    //     // .then((json) => setData(json))
    //     .then((json) => json)
    //     .catch((e) => console.error(e));
    // //   }, []);
    //     // console.log(name, data, 'what is it')
    //     // fetch('/login', {method: 'POST', body: data})
    //     // // .then((res) => {
    //     // //     console.log(res, res.body, 'res')
    //     // //     res.json()
    //     // // })
    //     // // .then((json) => {
    //     // //     console.log(json, 'is it json?')
    //     // //     setData(json)
    //     // // })
    //     // // .then((res) => {
    //     // //     console.log(res, res.body, 'res');
    //     // //     setData(res.status)
    //     // // })
    //     // .then((res) => {
    //     //     console.log(res.body, 'res.body')
    //     //     return res.body.getReader()
    //     // })
    //     // .catch((e) => console.error(e));
    //   setData(newName);
    // };

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
          setShowWarning('#63c4e2');
          setName(c.target.value);
          }}>
        </input>
        <label htmlFor="password">
          Password: 
        </label>
        <input id="password" type="password" required minLength={8} value={password} onKeyDown={enterSubmit} onChange={(c) => {
          setShowWarning('#63c4e2');
          setPassword(c.target.value);
          }}>
        </input>
        <button onClick={() => sendNameAndPassword(name, password, false)}>
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