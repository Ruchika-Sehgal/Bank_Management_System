import { ToastContainer, toast } from 'react-toastify';
import img from '../Images/Feedback_new.png'
import React from 'react'
require('./Feedback.css')

function Feedback() {
    return (
        <div className='FeedbackMajor'>
            <ToastContainer />
            <div className="FeedbackContainer">
                <div className="Image">
                    <img src={img} alt="Your Feedback Matters!" />
                </div>
                <form action="submit" className="feedbackForm">
                    <label htmlFor="Email">Your Email Id</label>
                    <input type="email" id='Email' />
                    <label htmlFor="Name">Name</label>
                    <input type="text" id='Name' />
                    <label htmlFor="Feedback">Your Feedback</label>
                    <textarea name="Feedback" id="Feedback" cols="30" rows="10" placeholder='Please input your feedback here. Hope our services matched your expectations!'></textarea>
                    <button onClick={(e) => {
                        e.preventDefault();
                        toast("Thanks for your feedback! We will get back to you soon!");
                        document.getElementById('Email').value = '';
                        document.getElementById('Name').value = '';
                        document.getElementById('Feedback').value = '';
                        // window.location = '/'
                    }}>Save Feedback</button>
                </form>
            </div>
        </div>
    )
}

export default Feedback