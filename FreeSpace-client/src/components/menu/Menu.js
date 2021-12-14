import React from 'react'
import {Link} from "react-router-dom";
import '../menu/Menu.css'
import '../../assets/style.css'
import list from '../../assets/icons/list.png';
import '../../assets/icons/add.png';
import '../../assets/icons/message.png'
import '../../assets/icons/user.png';
import logo from '../../assets/img/logo-02.png';

export const Menu = () => {
    return (
        <div className="menubar">
            <div className="free">
            <img className="logo" src={logo} alt="logoImage" />
            <Link className="linkto" to = "/sidebar"> <img className="icon-img" src={list} alt="listImage" /></Link>
            </div>
            <div className="nav-link">
                <nav className="nav">
                    <ul>
                    </ul>
                </nav>
            </div>
        </div>
    )
}
