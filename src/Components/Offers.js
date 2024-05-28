import React from 'react'
require('../Components/Offers.css')
function Offers() {

    return (
        <div className='Container'>
            <h3 className="heading">
                Ongoing Offers
            </h3>
            <div className="offers heading1">
                <div className="offer heading2" id='first'>
                    <i className="fa-regular fa-credit-card icon"></i>
                    <p className="value">10% off on all payments above &#8377; 10,000</p>
                </div>
                <div className="offer heading2">
                    <i className="fa-solid fa-mobile icon"></i>
                    <p className="value">20% off on Mobile Recharges</p>
                </div>
                <div className="offer heading2">
                    <i className="fa-solid fa-utensils icon"></i>
                    <p className="value">50% off on restraunts and Hotels</p>
                </div>
                <div className="offer heading2 ">
                    <i className="fa-solid fa-plane-departure icon"></i>
                    <p className="value">Discount upto &#8377; 10,000 on Flight Bookings</p>
                </div>
            </div>
        </div>
    )

}

export default Offers