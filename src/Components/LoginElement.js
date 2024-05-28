import React from 'react'

function LoginElement() {
    return (
        <>
            <label htmlFor="LoginId" className=''>Login Id / Customer Id</label>
            <input type="text" id='LoginId' className='' />
            <label htmlFor="Password" className=''>Password</label>
            <input type="password" id='Password' className='' />
            <a href="#" className='forgotPswd'>Forgot Password?</a>
        </>
    )
}

export default LoginElement