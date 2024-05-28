import React from 'react'

function Signup() {
    return (
        <>
            <label htmlFor="LoginId" className='optNotSelectedElements'>Login Id / Customer Id</label>
            <input type="text" id='LoginId' className='optNotSelectedElements' />
            <label htmlFor="Password" className='optNotSelectedElements'>Password</label>
            <input type="password" id='Password' className='optNotSelectedElements' />
            <label htmlFor="confirmPassword" className='optNotSelectedElements'>Confirm Password</label>
            <input type="password" id='confirmPassword' className='optNotSelectedElements' />
        </>
    )
}

export default Signup