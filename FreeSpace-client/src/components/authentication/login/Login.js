import React from 'react'
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import {useHistory} from "react-router-dom";
import serverURL from '../../../configVars';
import '../../../assets/style.css'
import '../login/Login.css';
import logo from '../../../assets/img/logo-02.png';
import '../../../assets/img/background-image.png';
import image from '../../../assets/img/i5.png';

export const Login = ({setLoggedInUserName, setLoggedInUserEmail}) => {
    const [validationError, setValidationError] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory();
    useEffect(() => {
        fetch(serverURL + 'auth/session', {
            credentials: 'include'
        })
        .then((res => res.json()))
        .then(res => {console.log(res); 
            if(res.isAuthenticated){
                setLoggedInUserEmail(res.email)
                setLoggedInUserName(res.username)
                return history.push('./dashboard');
            }
        })
        .catch(err => {console.log(err);
        })
    }, [history, setLoggedInUserName, setLoggedInUserEmail])
    return (
        <div>
            <form onSubmit={(e)=>{
                            e.preventDefault();
                            console.log(`inside login`);
                            fetch(serverURL + "auth/login",
                            {
                                mode: 'cors',
                                method: 'POST',
                                headers: { 'Content-Type':'application/json' },
                                body: JSON.stringify({username, password}),
                                credentials: 'include'
                            })
                            .then((response) => response.json())
                            .then(response => {console.log(response);
                                if(response.message){
                                    setLoggedInUserEmail(response.email)
                                    setLoggedInUserName(response.username)
                                    history.push('./dashboard')
                                }
                                else{
                                    setValidationError(response.error)
                                }
                                })
                            .catch(err => console.log(err));
                        }}>
                <div className="container">
                    <div className="flex-container">
                        <div className="left-column">
                            <img className="left" src={image} alt="bgImage" />   
                        </div>
                    <div className="right-column">
                        <img className="logo" src={logo} alt="Logo" />
                        <br></br>
                        <h5 className="slagon">Skip the stress.<span className="slagon-part-2">Ship your luggage.</span> </h5>
                        {validationError && <div className='validationError m-4'>{validationError}</div>}
                        <input  className ="text-username" type="text" name="username" required placeholder="Username" onChange={e => setUsername(e.target.value)}/>
                        <input className ="user-password" type="password" name="password" required placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                        <br></br>
                        <button className="login-button" type="submit">Login</button>
                        <br></br>
                        <div className="r2-column">
                            <p className="account">Don't have an account??</p>
                           <Link className ="register" to = "/register">Register Now</Link>
                        </div> 
                    </div>
                </div>
                </div>
            </form>
        </div>
    )
}
