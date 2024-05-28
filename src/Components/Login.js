import LoginElement from './LoginElement';
import Signup from './Signup';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ForgotPassword from './ForgotPswd.js';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { render } from 'react-dom';
import FAQs from './Faqs.js';

require("../Components/Login.css")
function renderForgotPassword(e) {
    e.preventDefault();
    document.body.innerText = "";
    render([<Navbar />, <ForgotPassword />, <Footer />], document.body);
    window.history.pushState({}, "", "/ForgotPassword")
}
function Login() {
    let captchaVerified = false;
    let onChange = () => {
        captchaVerified = true;
        console.log("Captcha verified");
    };
    let setOptionView = () => {
        if (document.querySelector('.LoginOpt').classList.contains('OptSelected')) {
            document.querySelector('.loginElement').classList.add('OptionNotSelected');
            document.querySelector('.Signup').classList.remove('OptionNotSelected');
            document.querySelector('#confirmationCodeRegister').value = '';
            document.querySelector('#Email').value = '';
            document.querySelector('#Password').value = '';
            document.querySelector('#confirmPassword').value = '';
            document.querySelectorAll('.confirmationCodeRegister').forEach((e) => {
                e.style.display = 'none';
            })
            document.querySelectorAll('.optNotSelectedElements').forEach((e) => {
                e.value = '';
            })
            document.querySelector('.LoginBtn').innerText = 'Sign Up';
        } else {
            document.querySelector('.loginElement').classList.remove('OptionNotSelected');
            document.querySelector('.Signup').classList.add('OptionNotSelected');
            document.querySelector('.LoginBtn').innerText = 'Login';
        }
        document.querySelector('.LoginOpt').classList.toggle('OptSelected');
        document.querySelector('.SignUpOpt').classList.toggle('OptSelected');
    }

    return (
        <>
            <div className="mainContainer">
                <div className="LoginForm">
                    <form action="submit" onSubmit={async (e) => {
                        e.preventDefault();
                        if (captchaVerified) {
                            console.log('Captcha verified! Logging in');
                            console.log(document.querySelector('.loginElement').classList);
                            if (document.querySelector('.LoginOpt').classList.contains('OptSelected')) {
                                let username = document.getElementById('LoginId').value;
                                let password = document.getElementById('PasswordLogin').value;
                                let confirmationCode = document.getElementById('confirmationCode').value;
                                console.log("confirmationCode = " + confirmationCode);
                                if (confirmationCode == null || confirmationCode == '') {
                                    confirmationCode = undefined;
                                }
                                let value = await fetch('http://localhost:2000/api/login', {
                                    "method": "POST",
                                    "headers": {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json"
                                    },
                                    "body": JSON.stringify({
                                        "username": username,
                                        "password": password,
                                        "secretCode": confirmationCode
                                    }),
                                    "mode": "cors"
                                });

                                value = await value.json();
                                let desc = await value.desc;
                                if (desc.includes("Password matched")) {
                                    document.querySelectorAll('.confirmationCode').forEach((el) => { el.style.display = 'flex' });
                                    toast("Please enter the confirmation code received in mail to login!");
                                }
                                else if (desc.includes("Confirmation code matched")) {
                                    toast("Login Successful!");
                                    window.location.href = "/Dashboard";

                                }
                                else {
                                    toast(desc);
                                }
                            }
                            else {
                                let email = document.querySelector('#Email').value;
                                let password = document.querySelector('#Password').value;
                                let confirmPassword = document.querySelector('#confirmPassword').value;
                                let confirmationCodeRegister = document.querySelector('#confirmationCodeRegister').value;
                                console.log("email = " + email, "password = " + password, "confirmPassword = " + confirmPassword);
                                console.log("confirmationCodeRegister = " + confirmationCodeRegister);
                                if (confirmationCodeRegister == null || confirmationCodeRegister == '') {
                                    confirmationCodeRegister = undefined;
                                }

                                if (password != confirmPassword) {
                                    toast("Passwords do not match. Please try again.");
                                    document.querySelector('#Password').value = '';
                                    document.querySelector('#ConfirmPassword').value = '';
                                    return;
                                }
                                else {
                                    let value = await fetch('http://localhost:2000/api/signup', {
                                        "method": "POST",
                                        "headers": {
                                            "Accept": "application/json",
                                            "Content-Type": "application/json"
                                        },
                                        "body": JSON.stringify({
                                            "email": email,
                                            "password": password,
                                            "secretCode": confirmationCodeRegister
                                        }),
                                        "mode": "cors"
                                    });
                                    value = await value.json();
                                    console.log(value);
                                    let desc = value.desc;
                                    console.log(desc);
                                    if (desc.includes("Verification code sent to email.")) {
                                        toast("Verification code sent to email. Please enter the code to register.");
                                        document.querySelectorAll('.confirmationCodeRegister').forEach(element => {
                                            element.style.display = 'flex';
                                        });
                                    }
                                    else if (desc.includes('User already exists. Please login.')) {
                                        toast("User already exists. Please login to continue.");

                                    }
                                    else if (desc.includes('User registered successfully.')) {
                                        toast("User registered successfully. Please login to continue.");
                                    }
                                    else {
                                        toast(value.desc);
                                    }
                                }

                            }
                        } else {
                            toast("Please verify captcha prior to logging in")
                            console.log('Captcha not verified');
                        }
                    }}>
                        <div className="optionSelection">
                            <div className='LoginOpt OptSelected' onClick={setOptionView}>Login</div>
                            <div className='SignUpOpt' onClick={setOptionView}>Sign Up</div>
                        </div>
                        <div className='loginElement'>
                            <label htmlFor="LoginId" className=''>Login Id / Customer Id</label>
                            <input type="text" id='LoginId' className='' pattern='[0-9]{9}' />
                            <label htmlFor="PasswordLogin" className=''>Password</label>
                            <input type="password" id='PasswordLogin' className='' pattern='[A-Za-z]{6}[0-9]{4}[#$*~`]{1}' />
                            <label htmlFor="confirmationCode" className='confirmationCode'>Confirmation Code received in Email</label>
                            <input type="text" id='confirmationCode' className='confirmationCode' />
                            <a href="/ForgotPassword" className='forgotPswd' onClick={renderForgotPassword}>Forgot Password?</a>
                        </div>
                        <div className='Signup OptionNotSelected' >
                            <label htmlFor="EmailId" className='optNotSelectedElements'>User Email ID</label>
                            <input type="email" id='Email' className='optNotSelectedElements' />
                            <label htmlFor="Password" className='optNotSelectedElements'>Password</label>
                            <input type="password" id='Password' className='optNotSelectedElements' pattern='[A-Za-z]{6}[0-9]{4}[#$*~`]{1}' />
                            <label htmlFor="confirmPassword" className='optNotSelectedElements'>Confirm Password</label>
                            <input type="password" id='confirmPassword' className='optNotSelectedElements' pattern='[A-Za-z]{6}[0-9]{4}[#$*~`]{1}' />
                            <label htmlFor="confirmationCodeRegister" className='confirmationCodeRegister'>Confirmation Code received in Email</label>
                            <input type="text" id='confirmationCodeRegister' className='confirmationCodeRegister' />
                        </div>

                        <ReCAPTCHA
                            sitekey="6LfpsJspAAAAAOb8A2mB0TNp1ZHa1AWufHwcff3d"
                            onChange={onChange} className='captcha'
                        />
                        <button type='submit' className='LoginBtn' >Login</button>
                    </form>
                </div>
                <ToastContainer />
                <div className="helpSection">
                    <h3>Welcome to Prosperous Bank!</h3>
                    <div className="needHelp">
                        <div>Need Help?</div>
                        <div className='FAQLine'> </div>
                        <div className='FAQs' onClick={
                            (e) => {
                                e.preventDefault();
                                console.log('In FAQS');
                                render([<><Navbar /><FAQs /> <Footer /></>], document.body);
                                window.history.pushState({}, "", "/FAQ");
                                console.log('Document present');
                            }

                        }>FAQs</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login