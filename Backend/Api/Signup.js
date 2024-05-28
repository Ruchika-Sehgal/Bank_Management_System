const admin = require('firebase-admin');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

async function createCustIdCodeSendMail(value, email, password, secretCode, firestore) {

    let custID = Math.floor(Math.random() * 1000000000);
    for (let [key, val] in value) {
        if (val['custID'] === custID) {
            custID = Math.floor((Math.random() * 100000) + 1000 + (Math.random() * 100000 + 8888));
        }
    }
    let code = (Math.random() * 200000 + 1000000).toString(16).toString(10);
    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.email,
            pass: process.env.email_password
        },
        tls: {
            rejectUnauthorized: false
        }
    }));
    var mailOptions = {
        from: process.env.email,
        to: 'pranay001.sehgal@gmail.com',
        subject: 'Registration Email',
        html: '<h3>Welcome to prosperous bank!</h3> <br /> Your customer Id is ' + custID + '. <br /> Your register verification code is ' + code + '. Please enter this code to complete the registeration.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error " + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    let res = await firestore.collection('Email').doc(email).set({ "email": email, "secretCode": code, 'custId': custID });
    console.log(custID);
    if (res.writeTime > 0) {
        console.log('Code updated successfully.');
        return ({ desc: 'Verification code sent to email.' });
    }
    else {
        console.log('Some error occured. Please try again.');
        return ({ desc: 'Some error occured. Please try again.' });
    }
}








async function Signup(email, password, secretCode) {
    console.log(email, password, secretCode);
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    } else { };
    let firestore = admin.firestore();
    let value = await firestore.collection('Email').doc(email).get();
    value = await value.data();

    if ((value == undefined || value == null)) {
        if (secretCode == undefined || secretCode == null || secretCode == '') {
            let response = createCustIdCodeSendMail(value, email, password, secretCode, firestore);
            return response;
        }
        else {
            console.log('No user present in email list. Discarding the secret code.');
            return ({ desc: 'Invalid secret code. Please register your account to obtain a valid secret code.' });
        }
    }
    else if ((value.email != undefined || value.email != null) && (secretCode != undefined || secretCode != null)) {
        console.log("Hello: ", email, password, secretCode);
        let val = await firestore.collection('Email').doc(email).get();
        val = await val.data();
        let res = await firestore.collection('Users').doc(val.custId.toString()).get();
        console.log(val);
        res = res.data();
        console.log(res)
        if (res != undefined) {
            console.log("res: ");
            console.log(res);
            return ({ desc: 'User already exists. Please login.' });
        }


        if (val.secretCode == secretCode) {
            console.log(val.secretCode, secretCode);
            let custID = val.custId;
            console.log("CustID: ", custID);
            let res = await firestore.collection('Users').doc(custID.toString()).set({
                "custId": custID.toString(),
                "password": password,
                "email": email
            });
            if (res.writeTime > 0) {
                return ({ desc: 'User registered successfully.' });
            }
            else {
                return ({ desc: 'Some error occured. Please try again.' });
            }

        }
        else {
            return ({ "desc": "Invalid secret code. Please try again." });
        }
    }
    else if ((value.email != undefined || value.email != null) && (secretCode == undefined || secretCode == null)) {
        console.log(value);
        let userRes = await firestore.collection('Users').doc(value.email).get();
        userRes = userRes.data();
        console.log(userRes);
        if (userRes == undefined || userRes == null) {
            let response = createCustIdCodeSendMail(value, email, password, secretCode, firestore);
            return response;
        }
        else {
            return ({ desc: 'User already exists. Please login.' });
        }
    }
    else {
        console.log("in Else")
        console.log(value);
        console.log(value.email);
        return ({ desc: 'User already exists. Please login.' });
    }
}

exports.Signup = Signup;