const admin = require('firebase-admin');

async function getCreditCards(custID) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    } else { };
    let firestore = admin.firestore();
    let value = await firestore.collection('CreditCards').doc(custID).get();
    if (value == null || value == undefined) {
        return ({ "status": "404", "desc": "No credit cards found for the user.", "creditCards": [] })
    }
    value = await value.data();
    console.log('value: ', value);
    return { "status": "200", "desc": "Credit cards found for the user.", "creditCards": value };
}

exports.getCreditCards = getCreditCards;