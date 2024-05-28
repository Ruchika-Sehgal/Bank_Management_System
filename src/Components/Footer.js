import React from 'react'
require('./Footer.css')

function Footer() {
    let curDate = new Date();
    return (
        <div className='Footer'>
            Properous &copy; | Copyright @ {curDate.getFullYear()}
        </div>
    )
}

export default Footer