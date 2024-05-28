import React from 'react'
import LoaderImage from "../Images/Loader.gif";
import css from "../Components/Loader.css";

function Loader() {
    return (
        <div className='LoaderContainer'>
            <img src={LoaderImage} alt="Loading.." className="loader" />
        </div>
    )
}

export default Loader