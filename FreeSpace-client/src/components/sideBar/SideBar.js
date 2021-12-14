import React from 'react'
// import { MDBSideNav, MDBSideNavNav,
//     MDBSideNavCat, MDBSideNavLink } from 'mdbreact';
import {Link} from "react-router-dom";
import {useHistory} from "react-router-dom";
import serverURL from '../../configVars';
import './SideBar.css'
import user from '../../assets/icons/user.png';
import { useEffect } from 'react';

  
    
export const SideBar =({setLoggedInUserName, setLoggedInUserEmail, loggedInUserName, loggedInUserEmail}) => {
    // console.log(loggedInUserEmail, loggedInUserName)
    const history = useHistory();
    const logout = () => {
        fetch(serverURL + `auth/logout`, {credentials : `include`})
        .then(res => res.json())
        .then(res => {if(res.logout) history.push('./login')})
        .catch( err => console.log(err))
    }
    useEffect(() => {
        fetch(serverURL + 'auth/session', {
            credentials: 'include'
        })
        .then((res => res.json()))
        .then(res => {console.log(res); 
            if(!res.isAuthenticated){
                return history.push('./login');
            }
            else{
                setLoggedInUserEmail(res.email)
                setLoggedInUserName(res.username)
            }
        })
        .catch(err => {console.log(err);
        })
    }, [history, setLoggedInUserEmail, setLoggedInUserName])
    return (
        <div className='sidebar'>
            <ul className='sidebarul'>
                
                    <li><img className="user" src={user} alt="user" /></li>
                    <li className='user-name-field' > <div>User Name: {loggedInUserName} </div></li>
           <li className='user-name-field'><div>Email: {loggedInUserEmail}</div></li>
           
            <li className="user-name-field"><Link className="linkto" to = "/sender-listings"> My Sender Listing</Link></li>
            <li className="user-name-field"><Link className="linkto" to = "/carrier-listings"> My Carrier Listing</Link></li>
            <li className="user-name-field"><Link className="linkto" to = "/notification"> My Notifications</Link></li>
            
            <li className="user-name-field"><Link className="linkto" to = "/Privacy"> Privacy and Policy</Link></li>
            <li className="user-name-field"><Link className="linkto" to = "/TermandCondition">Term And Condition</Link></li>
            <li className='user-name-field'><button className='LOGOUT' onClick = {logout}>Log Out</button></li>
            

            

           </ul>
        </div>
    )
}