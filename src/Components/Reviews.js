import React from 'react'
import image from '../Images/womanIcon.png'
import manImage from '../Images/manIcon.png'
require('../Components/Reviews.css')
function Reviews() {


    return (
        <div className='ReviewContainer'>
            <div className="heading1">
                Our Product Reviews
            </div>
            <div className="reviews">
                <div className="review" id='review1'>
                    <img src={image} alt="" className='ReviewImage' />
                    <div className="heading3">~Poonam Chaurasiya</div>
                    <div className="heading2">
                        Best service good customer service great transfer and transaction service great guidance and good policy and great experience and good job 👍
                    </div>
                </div>
                <div className="review" id='review2'>
                    <img src={image} alt="" className='ReviewImage' />
                    <div className="heading3">~Anonymous</div>
                    <div className="heading2">
                        I am doing all my transactions with this bank and this branch is near to my residence. I am keeping minimum balance of Rs. 1000 and i have not faced any issues till now. Prosperous Bank has a very good customer service and this savings account has a normal rate of interest.
                    </div>
                </div>
                <div className="review" id='review3'>
                    <img src={manImage} alt="" className='ReviewImageMan' />
                    <div className="heading3">~Joseph</div>
                    <div className="heading2">
                        For cash withdrawal, i am getting instantly alert messages from Indian Bank some times due to software problem i am unable to get messages. Since 16 years i am using this account, so no need to maintain minimum balance. ATM facilities are near and debit card charges are applicable.
                    </div>
                </div>
            </div>
            <div className="refers">
                <ul>
                    <li onClick={() => {
                        let review = document.querySelector(".reviews");
                        review.scroll({
                            left: (window.innerWidth) * 0,
                            behavior: "smooth"
                        })
                        console.log(getComputedStyle(document.querySelector(".review")).getPropertyValue("width").split("px")[0])
                        console.log('Scrolled to 1')
                    }}> </li>
                    <li onClick={() => {
                        let review = document.querySelector(".reviews");
                        review.scroll({
                            left: (window.innerWidth) * 1,
                            behavior: "smooth"
                        })
                        console.log('Scrolled to 2')
                    }}> </li>
                    <li onClick={() => {
                        let review = document.querySelector(".reviews");
                        review.scroll({
                            left: (window.innerWidth) * 2,
                            behavior: "smooth"
                        })
                        console.log('Scrolled to 3')
                    }}> </li>
                </ul>
            </div>
        </div>
    )
}

export default Reviews