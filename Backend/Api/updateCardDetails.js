const admin = require('firebase-admin');

async function updateCardDetails(custID, cardID, OnlineTransactions, ATMWithdrawal, TapAndPay, MerchantOutlet) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
        });
    }
    else { };

    let firestore = admin.firestore();
    console.log(OnlineTransactions, ATMWithdrawal, TapAndPay, MerchantOutlet);
    console.log(typeof OnlineTransactions, typeof ATMWithdrawal, typeof TapAndPay, typeof MerchantOutlet);
    if (typeof OnlineTransactions != "boolean" || typeof ATMWithdrawal != 'boolean' || typeof TapAndPay != 'boolean' || typeof MerchantOutlet != 'boolean') {
        return ({ "status": '403', "desc": "Invalid input. Please provide valid input." });
    }
    let value = await firestore.collection('CreditCards').doc(custID).get();
    if (value == undefined || value == null) {
        return ({ "status": '403', "desc": "No such user exists. Kindly register the user to proceed." })
    }
    else {
        value = await value.data();
        if (value == undefined || value == null) {
            return ({ "status": '403', "desc": "No such user exists. Kindly register the user to proceed." })

        }
        else {
            let maxKey = value.maxKey;
            let cardFound = false;
            console.log(value);
            for (let i = 1; i < maxKey + 1; i++) {
                console.log(value[i].cardID, cardID);
                if (value[i].cardID == cardID) {
                    cardFound = true;

                    value[i].OnlineTransactions != OnlineTransactions && (OnlineTransactions == false || OnlineTransactions == true) ? value[i].OnlineTransactions = OnlineTransactions : value[i].OnlineTransactions = value[i].OnlineTransactions;
                    value[i].ATMWithdrawal != ATMWithdrawal && (ATMWithdrawal == false || ATMWithdrawal == true) ? value[i].ATMWithdrawal = ATMWithdrawal : value[i].ATMWithdrawal = value[i].ATMWithdrawal;
                    value[i].TapAndPay != TapAndPay && (TapAndPay == false || TapAndPay == true) ? value[i].TapAndPay = TapAndPay : value[i].TapAndPay = value[i].TapAndPay;
                    value[i].MerchantOutlet != MerchantOutlet && (MerchantOutlet == false || MerchantOutlet == true) ? value[i].MerchantOutlet = MerchantOutlet : value[i].MerchantOutlet = value[i].MerchantOutlet;
                    let res = await firestore.collection('CreditCards').doc(custID).set(value);
                    if (res.writeTime > 0) {
                        return ({ "status": '200', "desc": "Card details updated successfully" })
                    }
                    else {
                        return ({ "status": '500', "desc": "Unknown error occurred. Please try again later." });
                    }
                }
                if (cardFound == false) {
                    return ({ "status": '403', "desc": "No card found with the given card ID. Kindly register the card first." });
                }
            }

        }

    }

}

exports.updateCardDetails = updateCardDetails;
