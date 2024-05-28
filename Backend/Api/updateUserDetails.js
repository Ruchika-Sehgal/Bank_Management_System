const admin = require('firebase-admin');
const dotenv = require('dotenv').config();

async function updateUserDetails(custID, name, email, address, phone) {
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
        if (name == undefined || name == null) {
            name = '';
        }
        else if (address == undefined || address == null) {
            address = '';
        }
        else if (phone == undefined || phone == null) {
            phone = '';
        }

        let value = await firestore.collection('Users').doc(custID).update({
            name: name,
            email: email,
            address: address,
            phone: phone
        });
        if (value.writeTime > 0) {
            return ({ desc: 'User details updated successfully' });
        }
        else {
            return ({ desc: 'User details could not be updated. Please try again.' });
        }
    }
}

exports.updateUserDetails = updateUserDetails;