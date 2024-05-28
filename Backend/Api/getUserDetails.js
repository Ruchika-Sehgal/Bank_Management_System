const admin = require('firebase-admin');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

async function getUserDetails(custID) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    } else { };
    let firestore = admin.firestore();
    let value = await firestore.collection('Users').doc(custID).get();
    value = await value.data();
    if (value == undefined || value == null) {
        return ({ desc: 'User does not exist. Please register.' });
    }
    else {
        console.log('value', value);
        let email = value.email;
        let name, phone, address;
        if (value.name == undefined || value.name == null) {
            name = '';
        }
        else {
            name = value.name;
        }
        if (value.phone == undefined || value.name == null) {
            phone = '';
        } else {
            phone = value.phone;
        }
        if (value.address == undefined || value.name == null) {
            address = '';
        }
        else {
            address = value.address;
        }
        let newValue = {
            email: email,
            name: name,
            phone: phone,
            address: address,
            desc: 'Successful'
        }
        console.log(newValue);
        return newValue;
    }
}

exports.getUserDetails = getUserDetails;