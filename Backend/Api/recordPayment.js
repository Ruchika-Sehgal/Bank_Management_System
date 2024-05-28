const admin = require('firebase-admin');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


async function recordPayment(transactionType, amount, custID, transactionDetails) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    } else { };
    let firestore = admin.firestore();

    console.log('In record Payment API');
    let transactionID = Math.floor(Math.random() * 1000000000 + Math.random() * 100 + Math.random() * 10000);
    let date = new Date();
    let transactionDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    let value = await firestore.collection('Transactions').doc(custID).get();
    value = await value.data();

    if (value == undefined || value == null) {
        let res = firestore.collection('Transactions').doc(custID).set({ "1": { 'TransactionID': transactionID, 'custID': custID, 'Amount': amount, 'TransactionType': transactionType, 'TransactionDate': transactionDate, 'TransactionDetails': transactionDetails }, 'maxKey': '1', 'custID': custID });
        console.log('res: ', res);

        if ((await res).writeTime > 0) {
            return ({ desc: 'Payment recorded successfully.' });
        }
    } else {
        console.log('value')
        console.log(value);
        console.log(value.custID, custID)
        if (value.custID == custID) {
            let newTransactionValue = value;
            let maxKey = parseInt(value.maxKey);
            newTransactionValue[maxKey + 1] = { 'TransactionID': transactionID, 'custID': custID, 'Amount': amount, 'TransactionType': transactionType, 'TransactionDate': transactionDate, 'TransactionDetails': transactionDetails };
            newTransactionValue['maxKey'] = maxKey + 1;
            console.log(typeof newTransactionValue);
            let res = firestore.collection('Transactions').doc(custID).set(newTransactionValue);
            console.log(res);
            if ((await res).writeTime > 0) {
                return ({ desc: 'Payment recorded successfully.' });
            }
        }
        else {
            return ({ desc: 'Payment recording failed.' });
        }
    }






}

exports.recordPayment = recordPayment;