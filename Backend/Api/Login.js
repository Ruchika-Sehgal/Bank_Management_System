const admin = require('firebase-admin');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

async function Login(username, password, secretCode) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    } else { };
    debugger;
    let firestore = admin.firestore();
    // try {
    let value = await firestore.collection('Users').doc(username).get();
    value = await value.data();
    if (value == undefined || value == null) {
        return ({ desc: 'User does not exist. Please register.' });
    }
    else {
        console.log(secretCode)
        if (value.password === password && (secretCode == undefined || secretCode == null)) {
            let code = (Math.random() * 200000 + 1000000).toString(16).toString(10);
            console.log(code);

            let value = await firestore.collection('Users').doc(username).update({ "secretCode": code });
            console.log(value);
            if (value.writeTime > 0) {
                console.log("Code updated successfully.")
            }
            else {
                console.log("Some error occured. Please try again.")
            }


            var transporter = nodemailer.createTransport(smtpTransport({
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
                to: 'ruchikasehgal001@gmail.com',
                subject: 'Sending Email using Node.js[nodemailer]',
                html: '<h3>Welcome to prosperous bank!</h3> <br /> Your login verification code is ' + code + '. Please enter this code to login.'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return { desc: 'Password matched. Successful.' };
        }
        else if (value.password === password && secretCode == value.secretCode) {
            return {
                desc: 'Confirmation code matched. Login Successful.'
            }
        }
        else if (value.password === password && secretCode != value.secretCode) {
            return { desc: 'Confirmation code does not match. Please try again.' };
        }
        else {
            return { desc: 'Password does not match. Please try again.' };
        }
    }
    // } catch (e) { }
}

exports.Login = Login;