const express = require('express');
const app = express();
app.use(express.static('./public'));
app.use(express.json());
const cors = require('cors');
app.set('view-engine', 'ejs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const login = require('../Api/Login.js');
const signup = require('../Api/Signup.js');
const ForgotPswd = require('../Api/forgotPswd.js');
const admin = require('firebase-admin');

const recordPayment = require('../Api/recordPayment.js');
const addCard = require('../Api/addCard.js');
const getCreditCards = require('../Api/getCreditCards.js');
const updateCardDetails = require('../Api/updateCardDetails.js');
const getUserTransactions = require('../Api/getUserTransactions.js');
const authenticateForgotPswd = require('../Api/authenticateForgotPswd.js');
const resetPassword = require('../Api/resetPassword.js');
const getUserDetails = require('../Api/getUserDetails.js');
const updateUserDetails = require('../Api/updateUserDetails.js');
app.options('*', cors())
console.log('app started at port 2000');
const getLoggedInUser = require('../Api/getLoggedInUser.js');
const { firestore } = require('firebase-admin');
// let currentUser = "203450335";
let currentUser = null;

app.use(cors());

app.listen(2000, () => {
    console.log(`Server is running on port 2000`);
});

app.get('/getCurrentUser', async (req, res) => {
    if (currentUser != null) {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(process.env.CREDENTIAL))
            });
        } else { };
        let firestore = admin.firestore();
        let user = await firestore.collection('Users').doc(currentUser).get();
        user = await user.data();
        console.log("username", user.name);
        let name;
        if (user.name != null && user.name != undefined) {
            name = user.name;
            console.log('In if of getCurrentUser- User name', name);
        }
        else {
            name = user.email;
        }
        res.status(200).send({ status: '200', currentUser: currentUser, name: name });
    }
    else {
        res.status(200).send({ status: '404', currentUser: "null", desc: 'User not found. Please login to continue.' });
    }
});

app.post('/api/login', async function (req, res) {
    let value = await login.Login(req.body.username, req.body.password, req.body.secretCode);
    console.log("value", value);
    if (value.desc.includes('Login Successful')) {
        currentUser = req.body.username;
    }
    console.log("currentUser", currentUser);
    res.status(200).send(value);
});

app.post('/api/signup', async function (req, res) {
    console.log('Homepage ', req.body.email, req.body.password, req.body.secretCode);
    let value = await signup.Signup(req.body.email, req.body.password, req.body.secretCode);

    res.status(200).send(value);
});

app.post('/api/forgotPassword', async function (req, res) {
    let val = await ForgotPswd.forgotPswd(req.body.custID);
    console.log(val);
    res.status(200).send(val);
});

app.post('/api/authenticateForgotPswd', async function (req, res) {
    let val = await authenticateForgotPswd.authenticateForgotPswd(req.body.custID, req.body.code);
    console.log(val);
    res.status(200).send(val);
});

app.post('/api/resetPassword', async function (req, res) {
    let val = await resetPassword.resetPassword(req.body.custID, req.body.password);
    console.log(val);
    res.status(200).send(val);
});

// app.post('/api/getLoggedInUser', async (req, res) => {
//     let val = await getLoggedInUser.getLoggedInUser(currentUser);
//     console.log(val);
//     res.status(200).send(val);
// });

app.post('/api/getUserDetails', async (req, res) => {
    console.log("custID", req.body.custID);
    let val = await getUserDetails.getUserDetails(req.body.custID);
    console.log(val);
    res.status(200).send(val);
});

app.post('/api/updateUserDetails', async (req, res) => {
    console.log("custID", req.body.custID);
    let val = await updateUserDetails.updateUserDetails(req.body.custID, req.body.name, req.body.email, req.body.address, req.body.phone);
    console.log(val);
    res.status(200).send(val);
});


app.post('/api/recordPayment', async (req, res) => {
    let val = await recordPayment.recordPayment(req.body.transactionType, req.body.amount, req.body.custID, req.body.transactionDetails);
    console.log(val);
    res.status(200).send(val);
});

app.post('/api/getUserTransactions', async (req, res) => {
    let val = await getUserTransactions.getUserTransactions(req.body.custID);
    console.log(val);
    res.status(200).send(val);
});


app.post('/api/getCreditCards', async (req, res) => {
    let val = await getCreditCards.getCreditCards(req.body.custID);
    console.log(val);
    res.status(200).send(val);
});

app.post('/api/addCard', async (req, res) => {
    let val = await addCard.addCard(req.body.custID, req.body.cardNumber, req.body.cardHolderName, req.body.expiryDate, req.body.cvv, req.body.BankName);
    console.log(val);
    res.status(200).send(val);
});

app.post('/api/updateCardDetails', async (req, res) => {
    let value = await updateCardDetails.updateCardDetails(req.body.custID, req.body.cardID, req.body.OnlineTransactions, req.body.ATMWithdrawal, req.body.TapAndPay, req.body.MerchantOutlet);
    console.log(value);
    res.status(200).send(value);
});

app.get('/logout', async (req, res) => {
    currentUser = null;
    res.status(200).send({ status: '200', desc: 'Logout Successful' });
});