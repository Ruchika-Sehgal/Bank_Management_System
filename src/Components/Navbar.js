import { useState } from 'react'
import React from 'react'
import Logo from '../Images/Logo.png'
require('../Components/Navbar.css')

function Navbar() {
    let [LoginState, setLoginState] = useState("Login");
    let currentUser;
    let fn = async () => {
        let value = await fetch('http://localhost:2000/getCurrentUser', {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        });

        let val = await value.json();
        console.log(val);
        currentUser = val.currentUser;
        let name = val.name;
        console.log(currentUser);
        if (val.currentUser != 'null') {
            if (val.name != 'null' || value.name != 'undefined') {
                console.log(val.name);
                setLoginState(val.name);
            }
            else {
                setLoginState(val.currentUser);
            }
        }
        else {
            setLoginState("Login");
        }
    }
    fn();
    return (
        <>
            <div className="MainContainer">
                <div className="Logo" onClick={() => {
                    window.location.href = "/";
                }}>
                    <img src={Logo} alt="Prosperous" className='LogoImage' />
                </div>
                <div className="Menu">
                    <ul>
                        <li onClick={() => {
                            if (LoginState == "Login") {
                                window.location.href = "/Login";
                            }
                            else {
                                window.location.href = "/Dashboard";
                            }
                        }}>{LoginState}</li>
                        <li onClick={() => {
                            if (LoginState == "Login") {
                                window.location.href = "/Login";
                            }
                            else {
                                window.location.href = "/Dashboard";
                            }
                        }}>Services</li>
                    </ul>
                </div>
                <div className="Search">
                    <input type="search" name="" id="search" />
                    <button>🔎</button>
                </div>
            </div>
        </>

    )
}

export default Navbar