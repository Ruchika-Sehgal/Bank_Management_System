const admin = require('firebase-admin');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

async function forgotPswd(custId) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    } else { };
    let firestore = admin.firestore();
    // try {

    console.log(custId);
    let value = await firestore.collection('Users').doc(custId).get();
    value = await value.data();
    if (value == undefined || value == null) {
        return ({ desc: 'User does not exist. Please register.' });
    }
    else {
        let code = (Math.random() * 200000 + 1000000).toString(16).toString(10);
        console.log(code);

        let value = await firestore.collection('Users').doc(custId).update({ "secretCode": code });
        console.log("value", value);
        if (value.writeTime > 0) {
            console.log("Code updated successfully.")
        }
        else {
            console.log("Some error occured. Please try again.")
        }
        let res = await sendMail(code);
        return res;


    }
}
const sendMail = async (code) => {

    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.email_password
        },
        tls: {
            rejectUnauthorized: false
        }
    }));
    let mailOptions = {
        from: process.env.email,
        to: 'ruchikasehgal001@gmail.com',
        subject: 'Password Reset',
        html: 'Your secret code is <b>' + code + '</b>. Kindly use this to reset your password.'
    }
    const val = await transporter.sendMail(mailOptions);
    const ok = val.response.search('OK');
    if (ok > 0) {
        console.log('Email sent: ' + val.response);
        return ({ "desc": "Email sent successfully. Please reset your password using the code in the email." })
    }
    else {
        console.log('Error occured while sending email. Please try again.');
        return ({ "desc": "Error occured while sending email. Please try again." })
    }
    // console.log(await transporter.sendMail(mailOptions))
}
function getResult(e, i) {
    if (e) {
        console.log(e);
        return ({ "desc": "Error occured while sending email. Please try again." })
    } else {
        console.log('Email sent: ' + i.response);
        return ({ "desc": "Email sent successfully. Please reset your password using the code in the email." })
    }
}
exports.forgotPswd = forgotPswd;