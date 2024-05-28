const admin = require('firebase-admin');

async function addCard(custID, cardNumber, cardHolderName, expiryDate, cvv, BankName) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    }
    else { };
    let cardId = Math.random() * 1000000000 + Math.random() * 1000000000;
    let firestore = admin.firestore();
    let value = await firestore.collection('CreditCards').doc(custID).get();
    console.log(value);
    value = await value.data();
    if (value == undefined || value == null) {
        let res = await firestore.collection('CreditCards').doc(custID).set({ "1": { 'CardID': cardId, 'CardNumber': cardNumber, 'CardHolderName': cardHolderName, 'ExpiryDate': expiryDate, 'CVV': cvv, 'state': "unblock", "OnlineTransactions": false, "MerchantOutlet": false, "TapAndPay": false, "ATMWithdrawal": false, "BankName": BankName }, 'maxKey': '1', 'custID': custID });
        if (res.writeTime > 0) {
            return ({ "status": "200", "desc": 'Card added successfully.' });
        }
        else {
            return ({ "status": "500", "desc": 'Some error occcured while adding the card, please try again later.' });
        }
    }
    else {
        let newCardValue = value;
        let maxKey = parseInt(newCardValue.maxKey);
        newCardValue[maxKey + 1] = {
            'CardNumber': cardNumber, 'CardHolderName': cardHolderName, 'CardID': cardId, 'ExpiryDate': expiryDate, 'CVV': cvv, "BankName": BankName, 'state': "unblock", "OnlineTransactions": false, "MerchantOutlet": false, "TapAndPay": false, "ATMWithdrawal": false
        };
        newCardValue['maxKey'] = maxKey + 1;
        let res = await firestore.collection('CreditCards').doc(custID).set(newCardValue);
        if (res.writeTime > 0) {
            return ({ "status": "200", "desc": 'Card added successfully.' });
        }
        else {
            return ({ "status": "500", "desc": 'Some error occcured while adding the card, please try again later.' });
        }
    }
}
exports.addCard = addCard;

