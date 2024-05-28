const admin = require('firebase-admin');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

async function resetPassword(custID, password) {
    if (admin.apps.length == 0) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    }
    else { };
    let firestore = admin.firestore();
    let userRes = await firestore.collection('Users').doc(custID).get();
    userRes = (await userRes).data();
    console.log('userRes', userRes);
    if (userRes == undefined || userRes == null) {
        return ({ desc: 'User does not exist. Please register.' });
    }
    else {
        console.log(userRes);
        if (userRes.password == password) {
            return { desc: 'Password cannot be same as the previous five passwords. Please try again.' }
        }
        let value = await firestore.collection('Users').doc(custID).update({ password: password });
        if (value.writeTime > 0) {
            return { desc: 'Password updated successfully.' }
        }
        else {
            return { desc: 'Error while updating password. Please try again later.' }
        }
    }
}

exports.resetPassword = resetPassword;