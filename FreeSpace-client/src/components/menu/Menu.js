import React from 'react'
import {Link} from "react-router-dom";
import {useHistory} from "react-router-dom";
import serverURL from '../../configVars';
import '../menu/Menu.css'
import '../../assets/style.css'
import home from '../../assets/icons/home.png';
import list from '../../assets/icons/list.png';
import '../../assets/icons/add.png';
import '../../assets/icons/message.png'
import '../../assets/icons/user.png';
import logo from '../../assets/img/logo-02.png';

export const Menu = ({loggedInUserName, loggedInUserEmail}) => {
    console.log(loggedInUserEmail, loggedInUserName)
    const history = useHistory();
    const logout = () => {
        fetch(serverURL + `auth/logout`, {credentials : `include`})
        .then(res => res.json())
        .then(res => {if(res.logout) history.push('./login')})
        .catch( err => console.log(err))
    }
    return (
        <div className="menubar">
           <div className="free">
           <img className="logo" src={logo} alt="logoImage" />
           </div>
           <div>User Name: {loggedInUserName} </div>
           <div>Email: {loggedInUserEmail}</div>
           <div className="nav-link">
            <nav className="nav">
                <ul>
                    <li className="icon"><Link className="linkto" to = "/dashboard"> <img className="icon-img" src={home} alt="homeImage" /></Link></li>
                    <li className="icon"><Link className="linkto" to = "/sender-listings"> <img className="icon-img" src={list} alt="listImage" /></Link></li>
                    <li><button className='LOGOUT' onClick = {logout}>Log Out</button></li> 
                </ul>
            </nav>
            </div>
            
        </div>
    )
}
