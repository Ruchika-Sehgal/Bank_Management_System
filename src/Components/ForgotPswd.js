import { ToastContainer, toast } from 'react-toastify';
import React, { useEffect } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom';

require('../Components/ForgotPswd.css')
const Login = require("./Login")
function ForgotPswd() {
    let showLoginPage = false;
    useEffect(() => {
        if (showLoginPage) {
            console.log("showLoginPage", showLoginPage);
            return Login
        }
    }, [showLoginPage])


    async function resetPassword(e) {
        e.preventDefault();
        let custID = document.getElementById('custID').value;
        let password = document.getElementById('Password').value;
        let ConfirmPassword = document.getElementById('ConfirmPassword').value;
        console.log(custID, password, ConfirmPassword);
        if (password != ConfirmPassword) {
            toast('Passwords do not match. Please try again.');
        }
        else {
            let res = await fetch('http://localhost:2000/api/resetPassword', {
                "method": "POST",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "custID": custID,
                    "password": password
                }),
                "mode": "cors"
            });
            if (res != null || res != undefined) {
                res = await res.json();
                console.log(res);
                toast(res.desc);
                if (res.desc.includes("User does not exist. Please register.")) {
                    let stateObj = { id: "100" };
                    console.log("Redirecting to Login")
                    showLoginPage = true;
                    // window.location = '/login';
                    let LoginPage = Login.json();
                    // console.log(LoginPage);
                    // window.document.body.innerHTML = Login;
                    window.history.pushState(stateObj,
                        "Login Page", "/login");

                }
                else if (res.desc.includes('Password cannot be same as the previous five passwords. Please try again')) {
                    document.querySelector('#Password').value = '';
                    document.querySelector('#ConfirmPassword').value = '';
                }
            }
            else {
                toast('Some error occured. Please try again.')
            }
        }
    }



    async function Authenticate(e, custID, securityCode) {
        e.preventDefault();
        if (securityCode == '' || securityCode == undefined || securityCode == null) {
            let response = await fetch('http://localhost:2000/api/forgotPassword', {
                "method": "POST",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "custID": custID
                }),
                "mode": "cors"
            });
            console.log("response:", response);
            if (response != undefined) {
                response = await response.json();
                console.log(response);
                toast(response.desc);
                if (response.desc.includes('Email sent successfully. Please reset your password using the code in the email.')) {
                    document.querySelectorAll('.securityCode').forEach((Element) => {
                        Element.classList.remove('no-display');
                        console.log(document.getElementById('Step1').innerHTML);
                        let step1 = document.getElementById('Step1');
                        step1.innerText = '';
                        let checked = document.createElement('i');
                        checked.classList = "fa-solid fa-check";
                        step1.appendChild(checked);
                    })
                }
            }
            else {
                console.log("response", response);
                toast(response.desc);
            }
        }
        else {
            let res = await fetch('http://localhost:2000/api/authenticateForgotPswd', {
                "method": "POST",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "custID": custID,
                    "code": securityCode
                }),
                "mode": "cors"
            });
            if (res != null || res != undefined) {
                res = await res.json();
                console.log(res);
                toast(res.desc);
                if (res.desc.includes('Authentication successful. Please reset your password now')) {
                    document.querySelectorAll('.Password').forEach((Element) => {
                        Element.classList.remove('no-display');
                    })
                    document.querySelectorAll('.ConfirmPassword').forEach((Element) => {
                        Element.classList.remove('no-display');
                    })
                    document.querySelectorAll('.SavePassword').forEach((Element) => {
                        Element.classList.remove('no-display');
                    })
                    document.querySelectorAll('.securityCode').forEach((Element) => {
                        Element.classList.add('no-display');
                    });
                    document.querySelectorAll('.Authenticate').forEach((Element) => {
                        Element.classList.add('no-display');
                    })
                    let step2 = document.getElementById('Step2');
                    step2.innerText = '';
                    let checked = document.createElement('i');
                    checked.classList = "fa-solid fa-check";
                    step2.appendChild(checked);
                }
            }
        }
    }



    return (
        <>

            {
                // useEffect(() => {
                //     if (showLoginPage) {
                //         console.log("showLoginPage", showLoginPage);
                //         return Login
                //     }
                // }, [showLoginPage])
            }
            <div className="Container">
                <div className="processContainer">
                    <div className='ForgotPassword'><h2>Forgot Password</h2></div>
                    <div className="process">
                        <div className="step" id='Step1'>1</div>
                        <hr />
                        <div className="step" id='Step2'>2</div>
                        <hr />
                        <div className="step" id='Step3'>3</div>
                    </div>
                </div>
                <ToastContainer />
                <form className="ForgotPswd" onSubmit={(e) => {
                    e.preventDefault();
                    console.log(document.getElementById('custID'));
                    let custID = document.getElementById('custID').value;
                    console.log(custID);
                    let securityCode = document.getElementById('securityCode').value;
                    console.log(securityCode);
                    Authenticate(e, custID, securityCode)
                }}>
                    <label htmlFor="custID">Please enter your customer ID.</label>
                    <input type="text" id='custID' required />
                    <label htmlFor="securityCode" className='securityCode no-display'>Please enter the security code recieved in Mail</label>
                    <input type="text" id='securityCode' className='securityCode no-display' />
                    <label htmlFor="Password" className='Password no-display'>Please enter the new password</label>
                    <input type="password" id='Password' className='Password no-display' />
                    <label htmlFor="ConfirmPassword" className='ConfirmPassword no-display'>Please re-enter the password</label>
                    <input type="password" id='ConfirmPassword' className='ConfirmPassword no-display' />
                    <button type="submit" className='SavePassword no-display' onClick={(e) => {
                        resetPassword(e)
                    }}>Save Password</button>
                    <button type="submit" className='Authenticate'>Authenticate</button>
                </form>
            </div>
        </>
    )
}

export default ForgotPswd