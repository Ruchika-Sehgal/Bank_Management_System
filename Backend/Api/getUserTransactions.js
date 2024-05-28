const admin = require('firebase-admin');

async function getUserTransactions(custID) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    } else { };
    let firestore = admin.firestore();
    let value = await firestore.collection('Transactions').doc(custID).get();
    value = await value.data();
    console.log('value: ', value);
    return value;
}

exports.getUserTransactions = getUserTransactions;