const admin = require('firebase-admin');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

async function authenticateForgotPswd(custId, authCode) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    } else { };
    debugger;
    let firestore = admin.firestore();
    // try {
    let value = await firestore.collection('Users').doc(custId).get();
    console.log("value:", value);
    value = await value.data();
    if (value == undefined || value == null) {
        return ({ desc: 'User does not exist. Please register.' });
    }
    else {
        let UsersRes = value;
        if (UsersRes.secretCode == authCode) {
            return ({ desc: 'Authentication successful. Please reset your password now' });
        }
        else {
            return ({ desc: 'Incorrect Customer Id or secret code. Please try again.' });
        }
    }
}


exports.authenticateForgotPswd = authenticateForgotPswd;