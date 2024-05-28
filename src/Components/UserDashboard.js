import React, { createElement, useEffect } from 'react'
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useRef } from 'react';
import Login from '../Components/Login';
import react from 'react';
import { render } from 'react-dom';
import { ToastContainer, toast } from 'react-toastify';
import { click } from '@testing-library/user-event/dist/click';
require('./UserDashboard.css')

const UserDashboard = () => {
    // let custID;
    async function getCurrentUser() {
        console.log('In getCurrentUser');
        let res = await fetch('http://localhost:2000/getCurrentUser', {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        });
        console.log(res);
        res = await res.json();
        console.log(res);
        if (res.status == 404) {
            document.body.innerHTML = "";
            render([<><Navbar /> <Login /><ToastContainer />toast("Please login to view the user dashboard");<Footer /></>], document.body);
            window.history.pushState({}, "", "/login");
        }
        else {
            let custID = res.currentUser;
            console.log('currentUser', custID);
            return res.currentUser;
        }
        console.log('currentUser terminated');
    }

    let labels = ["Online Transactions", "Merchant Outlet", "Tap And Pay", "ATM Withdrawal"]

    const ref = useRef((component) => {
        document.querySelector('.personalDetails').classList.add('no-display');
        document.querySelector('.personalDetails').classList.add('no-width');
        document.querySelector('.transactionContainer').classList.add('no-display');
        document.querySelector('.transactionContainer').classList.add('no-width');
        document.querySelector('.PayBillsContainer').classList.add('no-display');
        document.querySelector('.PayBillsContainer').classList.add('no-width');
        document.querySelector(`.${component}`).classList.remove('no-display');
        document.querySelector(`.${component}`).classList.remove('no-width');

    })
    async function displayMenu() {
        let minimize = document.querySelector('#minimize');
        let maximize = document.querySelector('#maximize');
        let parentMenu = document.querySelector('.parentMenu');
        let menuOptions = document.querySelector('.menuOptions');
        let Dashboard = document.querySelector('.Dashboard');
        let opt = document.querySelectorAll('.opt');
        if (minimize.classList.contains('no-display')) {
            minimize.classList.remove('no-display');
            maximize.classList.add('no-display');
            opt.forEach((o) => {
                o.classList.add('no-display');

            });
            parentMenu.style.width = '10vw';
            menuOptions.style.display = 'flex';
            menuOptions.style.alignItems = 'center';
            // menuOptions.style.justifyContent = 'center';
            menuOptions.style.flexDirection = 'column';
        } else {
            minimize.classList.add('no-display');
            maximize.classList.remove('no-display');
            opt.forEach((o) => {
                o.classList.remove('no-display');

            });
            parentMenu.style.width = '25vw';
            menuOptions.style.display = 'block';
        }
    }


    async function displayUserValues() {
        let custID = await getCurrentUser();
        let val = await fetch('http://localhost:2000/api/getUserDetails', {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                'custID': custID
            }),
            "mode": "cors"
        });
        val = await val.json();
        let username = document.querySelector('#UserName');
        let email = document.querySelector('#EmailAddress');
        let phone = document.querySelector('#PhoneNumber');
        let address = document.querySelector('#UserAddress');
        console.log(val);
        if (val.desc.includes('User does not exist. Please register.')) {
            toast("User does not exist. Please register.");
        }
        else {
            console.log(val);
            val.name != undefined && val.name != null ? username.value = val.name : username.value = '';
            email.value = val.email;
            val.phone != undefined && val.phone != null ? phone.value = val.phone : phone.value = '';
            val.address != undefined && val.address != null ? address.value = val.address : address.value = '';
        }
    }

    function showCardPaymentPanel(defaultBankSet) {
        let creditCardPayment = document.querySelector('.creditCardPayment');
        creditCardPayment.classList.remove('no-display');
        let BankName = document.querySelector('#BankName');
        if (defaultBankSet) {
            BankName.value = 'Prosperous Bank';
            BankName.disabled = true;
        }
        else {
            BankName.value = '';
            BankName.disabled = false;
        }
    }

    async function updateUserValues(e) {
        e.preventDefault();
        let UserName = document.querySelector('#UserName');
        let EmailAddress = document.querySelector('#EmailAddress');
        let UserAddress = document.querySelector('#UserAddress');
        let PhoneNumber = document.querySelector('#PhoneNumber');
        let UpdateButton = document.querySelector('.UpdateButton');
        let currentUser = await getUser();
        console.log('currentUser', currentUser);
        // UserName.value = currentUser.name;
        // EmailAddress.value = currentUser.email;
        // UserAddress.value = currentUser.address;
        // PhoneNumber.value = currentUser.phone;



        console.log('Update button clicked')
        let custID = await getCurrentUser();
        let res = await fetch('http://localhost:2000/api/updateUserDetails', {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                custID: custID,
                name: UserName.value,
                email: EmailAddress.value,
                address: UserAddress.value,
                phone: PhoneNumber.value
            }),
            "mode": "cors"
        });
        res = await res.json();
        console.log(res);
        if (res.desc.includes('User details updated successfully')) {
            toast("User details updated successfully");
            document.querySelector('#editValues').style.display = 'flex';
            document.querySelector('.UpdateButton').style.display = 'none';
        }
        else {
            toast("User details could not be updated. Please try again later.");
        }

    }

    function addTransitionClass() {
        let paymentOptions = document.querySelector('.paymentOptions');
        paymentOptions.classList.add('animate-to-right');
    }


    async function getUser() {
        let res = await fetch('http://localhost:2000/getCurrentUser', {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        });
        res = await res.json();
        console.log(res);
        if (res.status == 404) {
            document.body.innerHTML = "";
            render([<><Navbar /> <Login /><ToastContainer />toast("Please login to view the user dashboard");<Footer /></>], document.body);
            window.history.pushState({}, "", "/login");
        }
        else {
            console.log('currentUser', res.currentUser);
            return res.currentUser;
        }
    }


    async function makePaymentRequest(e, transactionDetails, amount) {
        e.preventDefault();
        // let custID = await getUser();
        // console.log(custID);
        let custID = await getCurrentUser();

        let transactionType = 'Debit';
        let res = await fetch('http://localhost:2000/api/recordPayment', {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                'custID': String(custID),
                'transactionType': String(transactionType),
                'amount': String(amount),
                'transactionDetails': String(transactionDetails)
            }),
            "mode": "cors"
        });

        res = await res.json();

        if (res.desc.includes('Payment recorded successfully.')) {
            toast("Payment recorded successfully.");
        } else {
            toast("Payment recording failed. Please try again later.");
        }

    }


    async function toggleEdit() {
        let UserName = document.querySelector('#UserName');
        let EmailAddress = document.querySelector('#EmailAddress');
        let UserAddress = document.querySelector('#UserAddress');
        let PhoneNumber = document.querySelector('#PhoneNumber');
        let editValues = document.querySelector('#editValues');
        let UpdateButton = document.querySelector('.UpdateButton');
        if (UserName.disabled == true) {
            UserName.disabled = false;
            UserAddress.disabled = false;
            PhoneNumber.disabled = false;
            editValues.style.display = 'none';
            UpdateButton.style.display = 'flex';
        }
        else {
            UserName.disabled = true;
            EmailAddress.disabled = true;
            UserAddress.disabled = true;
            PhoneNumber.disabled = true;
            editValues.style.display = 'flex';
        }
    }

    async function setTransactionContainer() {
        let custID = await getCurrentUser();
        console.log('In setTransactionContainer function');
        let val = await fetch('http://localhost:2000/api/getUserTransactions', {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                'custID': custID
            }),
            "mode": "cors"
        });
        if (val == undefined || val == null) {
            let transactionContainer = document.querySelector('.transactionContainer');
            let transactionsTable = document.createElement('div');
            transactionsTable.innerText = 'No transactions found.';
            transactionsTable.style.textAlign = 'center';
            transactionsTable.style.fontWeight = '600';
            transactionsTable.style.fontSize = '1rem'
            transactionContainer.appendChild(transactionsTable);
        }
        val = await val.json();
        console.log("val.creditCards", val.creditCards);
        if (val == undefined || val == null || val.length == 0) {
            let transactionContainer = document.querySelector('.transactionContainer');
            let transactionsTable = document.createElement('div');
            transactionsTable.innerText = 'No transactions found.';
            transactionsTable.style.textAlign = 'center';
            transactionsTable.style.fontWeight = '600';
            transactionsTable.style.fontSize = '1rem'
            transactionContainer.appendChild(transactionsTable);
        }
        else {

            let transactionContainer = document.querySelector('.transactionContainer');
            let transactionsTable = document.createElement('div');
            transactionsTable.style.display = 'grid';
            if (val.maxKey >= 5) {
                transactionsTable.style.gridTemplateColumns = 'repeat(5, 1fr)';
                transactionsTable.style.gridTemplateRows = 'repeat(6, 1fr)';
                let snoHeading = document.createElement("div");
                snoHeading.classList.add('bold');
                snoHeading.innerText = 'Serial Number ';
                let transactionDateHeading = document.createElement("div");
                transactionDateHeading.innerText = "Transaction Date";
                transactionDateHeading.classList.add('bold');
                let transactionIDHeading = document.createElement("div");
                transactionIDHeading.innerText = "Transaction ID";
                transactionIDHeading.classList.add('bold');
                let transactionDetailsHeading = document.createElement("div");
                transactionDetailsHeading.innerText = "Transaction Details";
                transactionDetailsHeading.classList.add('bold');
                let amountHeading = document.createElement("div");
                amountHeading.innerText = " Transaction Amount";
                amountHeading.classList.add('bold');
                transactionsTable.classList.add('transactionsTable');

                transactionsTable.appendChild(snoHeading);
                transactionsTable.appendChild(transactionDateHeading);
                transactionsTable.appendChild(transactionIDHeading);
                transactionsTable.appendChild(transactionDetailsHeading);
                transactionsTable.appendChild(amountHeading);
                for (let i = 1; i < 6; i++) {
                    let sno = document.createElement("div");
                    sno.innerText = i;
                    let transactionDate = document.createElement("div");
                    transactionDate.innerText = val.transactionDate;
                    let transactionID = document.createElement("div");
                    transactionID.innerText = val[i].TransactionID;
                    let transactionDetails = document.createElement("div");
                    transactionDetails.innerText = val[i].TransactionDetails;
                    let amount = document.createElement("div");
                    amount.innerText = 'Rs. ' + val[i].Amount;
                    transactionsTable.appendChild(sno);
                    transactionsTable.appendChild(transactionDate);
                    transactionsTable.appendChild(transactionID);
                    transactionsTable.appendChild(transactionDetails);
                    transactionsTable.appendChild(amount);
                }
                transactionContainer.appendChild(transactionsTable);
            }
            else {
                transactionsTable.style.gridTemplateColumns = 'repeat(5, 1fr)';
                transactionsTable.style.gridTemplateRows = 'repeat(' + val.maxKey + ', 1fr)';
                let snoHeading = document.createElement("div");
                snoHeading.innerText = 'Serial Number ';
                snoHeading.classList.add("bold");
                let transactionDateHeading = document.createElement("div");
                transactionDateHeading.innerText = "Transaction Date";
                transactionDateHeading.classList.add("bold");
                let transactionIDHeading = document.createElement("div");
                transactionIDHeading.innerText = "Transaction ID";
                transactionIDHeading.classList.add("bold");
                let transactionDetailsHeading = document.createElement("div");
                transactionDetailsHeading.innerText = "Transaction Details";
                transactionDetailsHeading.classList.add("bold");
                let amountHeading = document.createElement("div");
                amountHeading.innerText = " Transaction Amount";
                amountHeading.classList.add("bold");
                transactionsTable.classList.add('transactionsTable');
                transactionsTable.appendChild(snoHeading);
                transactionsTable.appendChild(transactionDateHeading);
                transactionsTable.appendChild(transactionIDHeading);
                transactionsTable.appendChild(transactionDetailsHeading);
                transactionsTable.appendChild(amountHeading);
                for (let i = 1; i < val.maxKey + 1; i++) {
                    let sno = document.createElement("div");
                    sno.innerText = i;
                    let transactionDate = document.createElement("div");
                    transactionDate.innerText = val[i].TransactionDate;

                    let transactionID = document.createElement("div");
                    transactionID.innerText = val[i].TransactionID;
                    let transactionDetails = document.createElement("div");
                    transactionDetails.innerText = val[i].TransactionDetails;
                    let amount = document.createElement("div");
                    amount.innerText = 'Rs. ' + val[i].Amount;
                    transactionsTable.appendChild(sno);
                    transactionsTable.appendChild(transactionDate);
                    transactionsTable.appendChild(transactionID);
                    transactionsTable.appendChild(transactionDetails);
                    transactionsTable.appendChild(amount);
                }
                transactionContainer.appendChild(transactionsTable);

            }

        }
    }

    async function setNewCard(e) {
        // e.preventDefault();
        let cardNumber = document.querySelector('#cardNumberNewCardPanel').value;
        let cardHolderName = document.querySelector('#cardHolderNameNewCardPanel').value
        let BankName = document.querySelector('#BankNameNewCardPanel').value;
        let expiryDate = document.querySelector('#expiryDateNewCardPanel').value;
        let cvv = document.querySelector('#cvvNewCardPanel').value;
        console.log(cardNumber, cardHolderName, BankName, expiryDate, cvv);
        if (cardNumber == '' || cardHolderName == '' || BankName == '' || expiryDate == '' || cvv == '') {
            console.log('Please fill all the fields to register the card.')
            toast("Please fill all the fields to register the card.");
        }
        else if (cardNumber == null || cardNumber == undefined || cardHolderName == null || cardHolderName == undefined || BankName == null || BankName == undefined || expiryDate == null || expiryDate == undefined || cvv == null || cvv == undefined) {
            console.log('Null / Undefined values are not allowed. Please enter the valid values.')
            toast("Null / Undefined values are not allowed. Please enter the valid values.");
        }
        else {
            let custID = await getCurrentUser();
            console.log('All fields are filled');
            let res = await fetch('http://localhost:2000/api/addCard', {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "custID": custID,
                    "cardNumber": cardNumber,
                    "cardHolderName": cardHolderName,
                    "BankName": BankName,
                    "expiryDate": expiryDate,
                    "cvv": cvv
                })
            });
            res = await res.json();
            console.log(res);
            if (res.status == 200 && res.desc.includes("success")) {
                toast("Card added successfully.");
                let val = await fetch('http://localhost:2000/api/getCreditCards', {
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "body": JSON.stringify({
                        "custID": custID
                    })
                });
                val = await val.json();
                console.log('In SetNewCard', val);
                displayCardOptions(val, 1);
                document.body.removeChild(document.querySelector('.addCardPanelContainer'));
            }
            else {
                toast(res.desc);
            }
        }
    }
    function displayAddCardPanel() {
        console.log("In Add Card Panel");
        let addCardPanelContainer = document.createElement("div");
        addCardPanelContainer.classList.add('addCardPanelContainer');
        let panelHeader = document.createElement("div");
        panelHeader.classList.add('panelHeader');
        let panelHeading = document.createElement("div");
        panelHeading.classList.add('panelHeading');
        panelHeading.innerText = 'Add Card';
        let crossButton = document.createElement("button");
        crossButton.classList.add('crossButton');
        crossButton.innerText = 'X';
        crossButton.addEventListener('click', () => {
            document.body.removeChild(document.querySelector('.addCardPanelContainer'));
        });
        panelHeader.appendChild(panelHeading);
        panelHeader.appendChild(crossButton);
        let panel = document.createElement("div");
        panel.classList.add('panel');
        let cardNumber = document.createElement("input");
        cardNumber.type = 'number';
        cardNumber.id = 'cardNumberNewCardPanel';
        let cardNumberLabel = document.createElement("label");
        cardNumberLabel.innerText = 'Card Number';
        cardNumberLabel.htmlFor = 'cardNumberNewCardPanel';
        let cardHolderName = document.createElement("input");
        cardHolderName.type = 'text';
        cardHolderName.id = 'cardHolderNameNewCardPanel';
        let cardHolderNameLabel = document.createElement("label");
        cardHolderNameLabel.innerText = 'Card Holder Name';
        cardHolderNameLabel.htmlFor = 'cardHolderNameNewCardPanel';
        let BankName = document.createElement("input");
        BankName.type = 'text';
        BankName.id = 'BankNameNewCardPanel';
        let BankNameLabel = document.createElement("label");
        BankNameLabel.innerText = 'Bank Name';
        BankNameLabel.htmlFor = 'BankNameNewCardPanel';
        let expiryDate = document.createElement("input");
        expiryDate.type = 'date';
        expiryDate.id = 'expiryDateNewCardPanel';
        let expiryDateLabel = document.createElement("label");
        expiryDateLabel.innerText = 'Expiry Date';
        expiryDateLabel.htmlFor = 'expiryDateNewCardPanel';
        let cvv = document.createElement("input");
        cvv.type = 'number';
        cvv.id = 'cvvNewCardPanel';
        let cvvLabel = document.createElement("label");
        cvvLabel.innerText = 'CVV';
        cvvLabel.htmlFor = 'cvvNewCardPanel';
        let submitButton = document.createElement("button");
        submitButton.innerText = 'Submit';
        submitButton.addEventListener("click", (e) => {
            console.log("submitButton clicked")
            setNewCard(e);
        });
        panel.appendChild(cardNumberLabel);
        panel.appendChild(cardNumber);
        panel.appendChild(cardHolderNameLabel);
        panel.appendChild(cardHolderName);
        panel.appendChild(BankNameLabel);
        panel.appendChild(BankName);
        panel.appendChild(expiryDateLabel);
        panel.appendChild(expiryDate);
        panel.appendChild(cvvLabel);
        panel.appendChild(cvv);
        panel.appendChild(submitButton);
        addCardPanelContainer.appendChild(panelHeader);
        addCardPanelContainer.appendChild(panel);
        document.body.appendChild(addCardPanelContainer);
    }

    async function updateCardDetailsFunction(cardID, onlineTransactionsState, ATMWithdrawalState, MerchantOutletState, TapAndPayState) {
        let custID = await getCurrentUser();
        console.log("In updateCardDetailsFunction");
        let res = await fetch('http://localhost:2000/api/updateCardDetails', {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "custID": custID,
                "cardID": cardID,
                "OnlineTransactions": onlineTransactionsState,
                "ATMWithdrawal": ATMWithdrawalState,
                "TapAndPay": MerchantOutletState,
                "MerchantOutlet": TapAndPayState
            })
        });
        res = await res.json();
        console.log(res);
        if (res.status == 200 && res.desc.includes("success")) {
            toast("Card details updated successfully.");
        }
        else {
            toast("Card details could not be updated. Please try again later.");
        }
    }
    async function displayCardOptions(val, i) {
        console.log("In displayCardOptions")
        let updateCardDetails = document.querySelector('.updateCardDetails');
        while (updateCardDetails.children.length) {
            updateCardDetails.removeChild(updateCardDetails.children[0]);
        }
        // updateCardDetails.innerHTML = '';
        let creditCardDetails = document.createElement('div');
        creditCardDetails.classList.add('creditCardDetails');
        let AddCards = document.createElement('button');
        AddCards.classList.add('AddCardButton');
        AddCards.innerText = 'Add New Card';
        AddCards.addEventListener("click", () => {
            console.log('Add Cards button clicked');
            displayAddCardPanel();
        })
        creditCardDetails.appendChild(AddCards);

        console.log(val)
        for (let i = 1; i < parseInt(val.creditCards.maxKey) + 1; i++) {
            console.log(i, val.creditCards.maxKey + 1)
            let CardContainer = document.createElement('div');
            CardContainer.classList.add('CardContainer');
            let cardDetails = document.createElement('div');
            cardDetails.classList.add('cardDetails');
            // Add the toggle buttons for online transactions and ATM withdrawals etc in this container


            let Maincard = document.createElement('div');
            Maincard.classList.add('Maincard');
            let cardContainer = document.createElement('div');
            cardContainer.classList.add('cardContainer');

            let card = document.createElement('div');
            card.classList.add('card');
            let dropArrow = document.createElement('i');
            dropArrow.classList.add('fa-solid');
            dropArrow.classList.add('fa-angle-down');
            dropArrow.addEventListener('click', () => {
                let optionsContainer = document.querySelector('#optionsContainer' + i);
                if (optionsContainer.style.height == '0rem') {
                    optionsContainer.style.height = 'fit-content';
                    optionsContainer.style.padding = '1rem';
                }
                else {
                    optionsContainer.style.height = '0rem';
                    optionsContainer.style.paddingTop = 0
                    optionsContainer.style.paddingBottom = 0
                }
            });
            console.log(val.creditCards[i]);
            card.innerText = val.creditCards[i].CardNumber + ' (' + val.creditCards[i].CardHolderName + ', ' + val.creditCards[i].BankName + ' )';
            cardContainer.appendChild(card);
            cardContainer.appendChild(dropArrow);
            Maincard.appendChild(cardContainer);
            CardContainer.appendChild(Maincard);
            CardContainer.appendChild(cardDetails);
            let optionsContainer = document.createElement('div');
            optionsContainer.classList.add('optionsContainer');
            optionsContainer.id = 'optionsContainer' + i;
            for (let j = 0; j < labels.length; j++) {
                let toggleContainer = document.createElement('div');
                toggleContainer.classList.add('toggleContainer');

                let toggleCheckBox = document.createElement('input');
                toggleCheckBox.type = 'Checkbox';
                toggleCheckBox.classList.add('toggleCheckBox');
                toggleCheckBox.id = 'toggleCheckBox' + i + (labels[j].replaceAll(" ", ""));
                let labelDiv = document.createElement('label');
                labelDiv.htmlFor = 'toggleCheckBox' + i + (labels[j].replaceAll(" ", ""));
                labelDiv.addEventListener('click', (e) => {
                    console.log(e.target.htmlFor);

                    setTimeout(() => {
                        console.log('toggle button clicked');
                        let onlineTransactionsState = document.querySelector('#toggleCheckBox' + i + 'OnlineTransactions').checked;
                        let ATMWithdrawalState = document.querySelector('#toggleCheckBox' + i + 'ATMWithdrawal').checked;
                        let MerchantOutletState = document.querySelector('#toggleCheckBox' + i + 'MerchantOutlet').checked;
                        let TapAndPayState = document.querySelector('#toggleCheckBox' + i + 'TapAndPay').checked;
                        // e.target.htmlFor.includes('OnlineTransactions') ? onlineTransactionsState = !onlineTransactionsState : onlineTransactionsState = onlineTransactionsState;
                        // e.target.htmlFor.includes('ATMWithdrawal') ? ATMWithdrawalState = !ATMWithdrawalState : ATMWithdrawalState = ATMWithdrawalState;
                        // e.target.htmlFor.includes('MerchantOutlet') ? MerchantOutletState = !MerchantOutletState : MerchantOutletState = MerchantOutletState;
                        // e.target.htmlFor.includes('TapAndPay') ? TapAndPayState = !TapAndPayState : TapAndPayState = TapAndPayState;

                        console.log(onlineTransactionsState, ATMWithdrawalState, MerchantOutletState, TapAndPayState);
                        updateCardDetailsFunction(val.creditCards[i].cardID, onlineTransactionsState, ATMWithdrawalState, MerchantOutletState, TapAndPayState);

                    }, 2000);
                })
                let labelDes = document.createElement("label");
                labelDes.textContent = labels[j];
                labelDes.classList.add("labelDes");
                labelDes.htmlFor = 'toggleCheckBox' + i + (labels[j].replaceAll(" ", ""));
                labelDiv.classList.add('labelDiv');
                labelDes.addEventListener("click", () => {
                    console.log('toggleCheckBox clicked');
                    let onlineTransactionsState = document.querySelector('#toggleCheckBox' + i + 'OnlineTransactions').checked;
                    let ATMWithdrawalState = document.querySelector('#toggleCheckBox' + i + 'ATMWithdrawal').checked;
                    let MerchantOutletState = document.querySelector('#toggleCheckBox' + i + 'MerchantOutlet').checked;
                    let TapAndPayState = document.querySelector('#toggleCheckBox' + i + 'TapAndPay').checked;
                    console.log(onlineTransactionsState, ATMWithdrawalState, MerchantOutletState, TapAndPayState);
                    updateCardDetailsFunction(val.creditCards[i].cardID, onlineTransactionsState, ATMWithdrawalState, MerchantOutletState, TapAndPayState);
                });
                let labelName = labels[j].replaceAll(" ", "");
                console.log(labelName, val.creditCards[i][labelName]);
                if (val.creditCards[i][labelName] == true) {
                    toggleCheckBox.checked = true;
                }

                toggleContainer.appendChild(toggleCheckBox);
                toggleContainer.appendChild(labelDiv);
                toggleContainer.appendChild(labelDes);
                optionsContainer.appendChild(toggleContainer);
            }
            Maincard.appendChild(optionsContainer);
            creditCardDetails.appendChild(CardContainer);
        }
        updateCardDetails.appendChild(creditCardDetails);

    }

    async function setCardOptions() {
        let custID = await getCurrentUser();
        let val = await fetch('http://localhost:2000/api/getCreditCards', {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "custID": custID
            })
        });
        val = await val.json();
        if (val.creditCards == null || val.creditCards == undefined || val.creditCards.length == 0) {
            let updateCardDetails = document.querySelector('.updateCardDetails');
            let creditCardDetails = document.createElement('div');
            creditCardDetails.classList.add('creditCardDetails');
            updateCardDetails.classList.add('updateCardDetails');
            creditCardDetails.innerText = 'No credit cards found for the user.';
            let addCard = document.createElement('button');
            addCard.classList.add('AddCardButton');
            addCard.id = 'addCard';
            addCard.innerText = 'Add Card';
            addCard.addEventListener("click", (e) => {
                console.log("submitButton clicked")
                displayAddCardPanel();
            });

            updateCardDetails.appendChild(addCard);
            updateCardDetails.appendChild(creditCardDetails);
        }
        else {
            displayCardOptions(val, 1);
        }
    }

    displayUserValues();
    return (
        <>
            <h3 className='text-center Welcome'>Welcome!</h3>
            <div className='Dashboard'>
                <div className="parentMenu">
                    <div className="menuOptions">
                        <div className="icons">
                            <i className="fa-solid fa-bars float-right no-display" id='minimize' onClick={displayMenu}></i>
                            <i className="fa-solid fa-arrow-left float-right" id='maximize' onClick={displayMenu}></i>
                        </div>
                        <ul className='MainMenu'>
                            <li onClick={() => ref.current("personalDetails")}><i className="fa-solid fa-person"></i> <p className='opt'>Personal Information</p></li>
                            <li onClick={() => { ref.current("transactionContainer"); setTransactionContainer(); }}><i className="fa-solid fa-file-invoice-dollar"></i> <p className='opt'>My transactions</p></li>
                            <li onClick={() => { ref.current("PayBillsContainer"); }}><i className="fa-solid fa-wallet"></i> <p className='opt'>Pay Bills</p></li>
                            <li onClick={() => { ref.current("updateCardDetails"); setCardOptions(); }}><i className="fa-regular fa-credit-card"></i> <p className='opt'>Update Card Details</p></li>
                            <li><i className="fa-solid fa-money-bill"></i> <p className='opt'>Create FD / RD</p></li>
                            <li><i className="fa-solid fa-mobile-screen"></i> <p className='opt'>Modify Mobile Banking Details</p></li>
                        </ul>
                    </div>
                </div>
                <div className='DashboardContainer'>
                    <form className="personalDetails">
                        <div className="Head">
                            <h4>Personal Details</h4>
                            <i className="fa-solid fa-user-pen" id='editValues' onClick={toggleEdit}></i>
                        </div>
                        <p>Username: </p>
                        <div className="userName">
                            <input type="text" name="" id="UserName" required disabled />
                        </div>
                        <p>Email: </p>
                        <div className="EmailAddress">
                            <input type="text" name="" id="EmailAddress" required disabled />
                            <p className='tooltip'>User's email has already been verified. This field cannot be updated.</p>
                        </div>
                        <p>User Address: </p>
                        <div className="UserAddress">
                            <input type="text" name="" id="UserAddress" required disabled />
                        </div>
                        <p>Phone Number: </p>
                        <div className="PhoneNumber">
                            <input type="text" name="" id="PhoneNumber" required disabled />
                        </div>
                        <button className="UpdateButton" onClick={(e) => {
                            updateUserValues(e)
                        }}>Update</button>
                        <button className="Logout" onClick={async (e) => {
                            e.preventDefault();
                            let res = await fetch('http://localhost:2000/logout');
                            res = await res.json();
                            console.log(res);
                            if (res.desc.includes('Success')) {
                                document.body.innerHTML = "";
                                render([<><Navbar /> <Login /><ToastContainer /><Footer /></>], document.body);
                                window.history.pushState({}, "", "/login");
                            }
                            else {
                                toast('User could not be logged out. Please try again later.')

                            }

                        }}>Logout the User</button>
                    </form>



                    <div className="transactionContainer no-display">
                        <h3 className='text-center Welcome highlight '>Your Recent Transactions</h3>

                    </div>

                    <div className="PayBillsContainer no-display">
                        <div className="paymentOptions">
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    showCardPaymentPanel(true);
                                }, 1000)
                            }}>
                                <i className="fa-regular fa-credit-card"></i>
                                <p>Prosperous Credit Card Bill</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    showCardPaymentPanel(false);
                                }, 1000)
                            }}>
                                <i className="fa-regular fa-credit-card"></i>
                                <p>Other Credit Card Bills</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    document.querySelector('.prepaidRecharge').classList.remove('no-display');
                                }, 1000)
                            }}>
                                <i className="fa-solid fa-file-invoice-dollar"></i>
                                <p>Postpaid Recharge</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    document.querySelector('.prepaidRecharge').classList.remove('no-display');
                                }, 1000)
                            }}>
                                <i className="fa-solid fa-mobile-screen"></i>
                                <p>Prepaid Recharge</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    document.querySelector('.DTHContainer').classList.remove('no-display');
                                }, 1000)
                            }}>
                                <i className="fa-solid fa-tv"></i>
                                <p>DTH</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    document.querySelector('.electricityBills').classList.remove('no-display');
                                }, 1000)
                            }}>
                                <i className="fa-solid fa-bolt"></i>
                                <p>Electricity Bills</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    document.querySelector('.pipedGas').classList.remove('no-display');
                                }, 1000)
                            }}>
                                <i className="fa-solid fa-gas-pump"></i>
                                <p>Piped Gas</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                document.querySelector('.paymentOptions').style.display = 'none';
                                document.querySelector('.LPGCylinder').classList.remove('no-display');
                            }}>
                                <i className="fa-solid fa-gas-pump"></i>
                                <p>LPG Cylinder Booking</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    document.querySelector('.education').classList.remove('no-display');
                                }, 1000)
                            }}>
                                <i className="fa-solid fa-gas-pump"></i>
                                <p>Education</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    document.querySelector('.waterBills').classList.remove('no-display');
                                }, 1000)
                            }}>
                                <i className="fa-solid fa-droplet"></i>
                                <p>Water Bill</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                setTimeout(() => {
                                    document.querySelector('.paymentOptions').style.display = 'none';
                                    document.querySelector('.cableTVPayment').classList.remove('no-display');
                                }, 1000)
                            }}>
                                <i className="fa-solid fa-tv"></i>
                                <p>Cable TV</p>
                            </div>
                            <div className="option" onClick={() => {
                                addTransitionClass();
                                document.querySelector('.paymentOptions').style.display = 'none';
                                document.querySelector('.loanRepayment').classList.remove('no-display');
                            }}>
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                <p>Loan Repayment</p>
                            </div>
                        </div>
                    </div>

                    <div className="creditCardPayment no-display">
                        <form action="" className='CardPaymentForm'>
                            <label htmlFor="cardNumber" className='cardNumber labels'>Card Number</label>
                            <input type="text" name="" id="cardNumber" />

                            <label htmlFor="cardHolderName" className='cardHolderName labels'>Card Holder Name</label>
                            <input type="text" name="" id="cardHolderName" />

                            <label htmlFor="BankName" className='BankName labels'>Bank Name</label>
                            <input type="text" name="" id="BankName" />

                            <label htmlFor="expiryDate" className='expiryDate labels'>Expiry Date</label>
                            <input type="text" name="" id="expiryDate" />

                            <label htmlFor="paymentDueDate" className='paymentDueDate labels'>Payment Due Date</label>
                            <input type="date" name="" id="paymentDueDate" />

                            <label htmlFor="amount" className='amount labels'>Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="amount" />
                            <button type="submit" onClick={(e) => {
                                let BankName = document.querySelector('#BankName').value;
                                makePaymentRequest(e, BankName + ' Bank Credit Card Bill', document.querySelector('#amount').value)
                            }}>Proceed with Payment</button>

                        </form>
                    </div>

                    <div className="prepaidRecharge no-display">
                        <form action="" className='prepaidRechargeForm'>
                            <label htmlFor="mobileNumber" className='mobileNumber labels'>Mobile Number</label>
                            <div className="supporter"></div><input type="tel" name="" id="mobileNumber" />

                            <label htmlFor="operator" className='operator labels'>Operator</label>
                            <select name="selectOperator" id="operator">
                                <option value="Airtel">Airtel India</option>
                                <option value="BSNL">BSNL</option>
                                <option value="MTNL">MTNL</option>
                                <option value="Jio">Reliance Jio</option>
                                <option value="Vodafone">Vodafone Idea Limited</option>
                            </select>

                            <label htmlFor="circle" className='circle labels'>Circle</label>
                            <select name="" id="StatesOfIndia">
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                <option value="Assam">Assam</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                                <option value="Goa">Goa</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Manipur">Manipur</option>
                                <option value="Meghalaya">Meghalaya</option>
                                <option value="Mizoram">Mizoram</option>
                                <option value="New Delhi">New Delhi</option>
                                <option value="Nagaland">Nagaland</option>
                                <option value="Odisha">Odisha</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Sikkim">Sikkim</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Tripura">Tripura</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Uttarakhand">Uttarakhand</option>
                                <option value="West Bengal">West Bengal</option>
                            </select>

                            <label htmlFor="amount" className='amount labels'>Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" id="amount" className='prepaidRechargeAmount' />

                            <button type="submit" onClick={(e) => {
                                let mobileNumber = document.querySelector('#mobileNumber').value;
                                let operator = document.querySelector('#operator').value;
                                console.log("operator", operator);
                                let state = document.querySelector('#StatesOfIndia').value;
                                let amount = document.querySelector('.prepaidRechargeAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, operator + ' Mobile Recharge of ' + mobileNumber + '(' + state + ')', amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>

                    <div className="DTHContainer no-display">
                        <form action="" className='DTHForm'>
                            <label htmlFor="DTHNumber" className='DTHNumber labels'>DTH Number</label>
                            <input type="text" name="" id="DTHNumber" />

                            <label htmlFor="DTHOperator" className='DTHOperator labels'>DTH Operator</label>
                            <select name="selectDTHOperator" id="DTHOperator">
                                <option value="Airtel">Airtel Digital TV</option>
                                <option value="Airtel">DD Free Dish</option>
                                <option value="DishTV">DishTV</option>
                                <option value="SunDirect">Sun Direct</option>
                                <option value="TataSky">Tata Sky</option>
                                <option value="LocalTVOperator">Local DTH Operator</option>
                            </select>

                            <label htmlFor="DTHAmount" className='DTHAmount labels'>Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="DTHAmount" />

                            <button type="submit" onClick={(e) => {
                                let DTHNumber = document.querySelector('#DTHNumber').value;
                                let operator = document.querySelector('#DTHOperator').value;
                                console.log("operator", operator);
                                let amount = document.querySelector('#DTHAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, operator + ' DTH Recharge of ' + DTHNumber, amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>

                    <div className="electricityBills no-display">
                        <form action="" className="electricityBillsForm">
                            <label htmlFor="electricityConsumerNumber" className='electricityConsumerNumber labels'>Consumer Number</label>
                            <input type="text" name="" id="electricityConsumerNumber" />

                            <label htmlFor="electricityOperator" className='electricityOperator labels'>Electricity Operator</label>
                            <select name="selectElectricityOperator" id="electricityOperator">
                                <option value="APDCL">Assam Power Distribution Company Limited</option>
                                <option value="BESCOM">Bangalore Electricity Supply Company</option>
                                <option value="BEST">Brihanmumbai Electric Supply and Transport</option>
                                <option value="CESC">Calcutta Electric Supply Corporation</option>
                                <option value="CSEB">Chhattisgarh State Electricity Board</option>
                                <option value="DHBVN">Dakshin Haryana Bijli Vitran Nigam</option>
                                <option value="DGVCL">Dakshin Gujarat Vij Company Limited</option>
                                <option value="JVVNL">Jaipur Vidyut Vitran Nigam</option>
                                <option value="KSEB">Kerala State Electricity Board</option>
                                <option value="MSEB">Maharashtra State Electricity Board</option>
                                <option value="MPPKVVCL">Madhya Pradesh Poorv Kshetra Vidyut Vitaran Company Limited</option>
                                <option value="NESCO">North Eastern Electricity Supply Company of Odisha</option>
                                <option value="PSPCL">Punjab State Power Corporation Limited</option>
                                <option value="TNEB">Tamil Nadu Electricity Board</option>
                                <option value="TSSPDCL">Telangana State Southern Power Distribution Company Limited</option>
                                <option value="UPPCL">Uttar Pradesh Power Corporation Limited</option>
                                <option value="WBSEDCL">West Bengal State Electricity Distribution Company Limited</option>
                            </select>

                            <label htmlFor="electricityAmount" className='electricityAmount labels'>Payable Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="electricityAmount" />

                            <button type="submit" onClick={(e) => {
                                let ElectricityConsumerNumber = document.querySelector('#electricityConsumerNumber').value;
                                let electricityOperator = document.querySelector('#electricityOperator').value;
                                console.log("operator", electricityOperator);
                                let amount = document.querySelector('#electricityAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, ' Electricity Recharge of ' + ElectricityConsumerNumber + '(' + electricityOperator + ')', amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>

                    <div className="pipedGas no-display">
                        <form action="" className="pipedGasForm">
                            <label htmlFor="pipedGasConsumerNumber" className='pipedGasConsumerNumber labels'>Consumer Number</label>
                            <input type="text" name="" id="pipedGasConsumerNumber" />

                            <label htmlFor="pipedGasOperator" className='pipedGasOperator labels'>Piped Gas Operator</label>
                            <select name="selectPipedGasOperator" id="pipedGasOperator">
                                <option value="IGL">Indraprastha Gas Limited</option>
                                <option value="GujaratGas">Gujarat Gas</option>
                                <option value="GAIL">GAIL Gas</option>
                                <option value="MahanagarGas">Mahanagar Gas</option>
                                <option value="Central U.P. Gas Limited">Central U.P. Gas Limited</option>
                                <option value="Indian Oil Corporation Limited">Indian Oil Corporation Limited</option>
                                <option value="Petronet LNG">Petronet LNG</option>
                                <option value="Aavantika Gas Limited">Aavantika Gas Limited</option>
                                <option value="Bhagyanagar Gas Ltd">Bhagyanagar Gas Ltd</option>
                                <option value="BPCL">Bharat Petroleum Gas</option>
                                <option value="HPGas">Hindustan Petroleum Gas</option>
                                <option value="Assam Gas">Assam Gas</option>
                                <option value="Green Gas">Green Gas</option>
                                <option value="AdaniGas">Adani Gas</option>
                                <option value="LocalGasOperator" onClick={() => {
                                    document.querySelector('.nameOfOtherOperatorLabel').classList.remove('no-display');
                                    document.querySelector('#OtherOperator').classList.remove('no-display');
                                }}>Local Gas Operator</option>
                            </select>
                            <label htmlFor="OtherOperator" className='nameOfOtherOperatorLabel no-display'>Name of Other Gas Operator</label>
                            <input type="text" name="" id="OtherOperator" className='nameOfOtherOperator no-display' />

                            <label htmlFor="pipedGasAmount" className='pipedGasAmount labels'>Payable Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="pipedGasAmount" />

                            <button type="submit" onClick={(e) => {
                                let pipedGasConsumerNumber = document.querySelector('#pipedGasConsumerNumber').value;
                                let pipedGasOperator = document.querySelector('#pipedGasOperator').value;
                                console.log("operator", pipedGasOperator);
                                let amount = document.querySelector('#pipedGasAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, 'Piped Gas Bill Payment of ' + pipedGasConsumerNumber + '(' + pipedGasOperator + ')', amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>
                    <div className="LPGCylinder no-display">
                        <form action="" className="LPGCylinderForm">
                            <label htmlFor="LPGCylinderConsumerNumber" className='LPGCylinderConsumerNumber labels'>Consumer Number</label>
                            <input type="text" name="" id="LPGCylinderConsumerNumber" />

                            <label htmlFor="LPGCylinderOperator" className='LPGCylinderOperator labels'>LPG Cylinder Operator</label>
                            <select name="selectLPGCylinderOperator" id="LPGCylinderOperator">
                                <option value="HPGas">HP Gas</option>
                                <option value="BharatGas">Bharat Gas</option>
                                <option value="BharatGasCommercial">Bharat Gas (BPCL) - Commercial</option>
                                <option value="Indane">Indane</option>
                                <option value="LocalLPGOperator">Local LPG Operator</option>
                            </select>

                            <label htmlFor="LPGCylinderAmount" className='LPGCylinderAmount labels'>Payable Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="LPGCylinderAmount" />

                            <button type="submit" onClick={(e) => {
                                let LPGCylinderConsumerNumber = document.querySelector('#LPGCylinderConsumerNumber').value;
                                let LPGCylinderOperator = document.querySelector('#LPGCylinderOperator').value;
                                console.log("operator", LPGCylinderOperator);
                                let amount = document.querySelector('#LPGCylinderAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, 'LPG Cylinder Payment of ' + LPGCylinderConsumerNumber + '(' + LPGCylinderOperator + ')', amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>

                    <div className="education no-display">
                        <form action="" className="educationForm">
                            <label htmlFor="educationConsumerNumber" className='educationConsumerNumber labels'>Consumer Number</label>
                            <input type="text" name="" id="educationConsumerNumber" />

                            <label htmlFor="educationOperator" className='educationOperator labels'>Education Operator</label>
                            <select name="selectEducationOperator" id="educationOperator">
                                <option value="School">School</option>
                                <option value="College">College</option>
                                <option value="University">University</option>
                                <option value="CoachingInstitute">Coaching Institute</option>
                                <option value="Other">Other</option>
                            </select>

                            <label htmlFor="InstitutionName" className='InstitutionName labels'>Institution Name</label>
                            <input type="text" name="" id="InstitutionName" />

                            <label htmlFor="educationAmount" className='educationAmount labels'>Payable Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="educationAmount" />

                            <button type="submit" onClick={(e) => {
                                let educationConsumerNumber = document.querySelector('#educationConsumerNumber').value;
                                let educationOperator = document.querySelector('#educationOperator').value;
                                console.log("operator", educationOperator);

                                let InstitutionName = document.querySelector('#InstitutionName').value;
                                let amount = document.querySelector('#educationAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, educationOperator + ' Fees of ' + educationConsumerNumber + '(' + InstitutionName + ')', amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>

                    <div className="waterBills no-display">
                        <form action="" className="waterBillsForm">
                            <label htmlFor="waterConsumerNumber" className='waterConsumerNumber labels'>Consumer Number</label>
                            <input type="text" name="" id="waterConsumerNumber" />

                            <label htmlFor="waterOperator" className='waterOperator labels'>Water Operator</label>
                            <select name="selectWaterOperator" id="waterOperator">
                                <option value="BWSSB">Bangalore Water Supply and Sewerage Board</option>
                                <option value="DelhiJalBoard">Delhi Jal Board</option>
                                <option value="HMWSSB">Hyderabad Metropolitan Water Supply and Sewerage Board</option>
                                <option value="KWA">Kerala Water Authority Board (KWA)</option>
                                <option value="MCGM">Municipal Corporation of Greater Mumbai</option>
                            </select>
                            <label htmlFor="WaterBillAmount" className='WaterBillAmount labels'>Payable Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="WaterBillAmount" />

                            <button type="submit" onClick={(e) => {
                                let waterConsumerNumber = document.querySelector('#waterConsumerNumber').value;
                                let waterOperator = document.querySelector('#waterOperator').value;
                                console.log("operator", waterOperator);

                                let amount = document.querySelector('#WaterBillAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, ' Water Bill Payment of ' + waterOperator + '(' + waterConsumerNumber + ')', amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>

                    <div className="cableTVPayment no-display">
                        <form action="" className="cableTVPaymentForm">
                            <label htmlFor="cableTVConsumerNumber" className='cableTVConsumerNumber labels'>Consumer Number</label>
                            <input type="text" name="" id="cableTVConsumerNumber" />

                            <label htmlFor="cableTVOperator" className='cableTVOperator labels'>Cable TV Operator</label>
                            <select name="selectCableTVOperator" id="cableTVOperator">
                                <option value="Hathway">Hathway</option>
                                <option value="DEN_Networks">DEN Networks</option>
                                <option value="AsianetDigital">Asianet Digital</option>
                                <option value="GTPLHathway">GTPL Hathway</option>
                                <option value="DarshDigital">Darsh Digital</option>
                                <option value="FinolexCablesLtd">Finolex Cables Ltd</option>
                                <option value="RelianceDigicom">Reliance digicom</option>
                                <option value="SunDirect">Sun Direct</option>
                                <option value="LocalCableTVOperator">Local Cable TV Operator</option>
                            </select>

                            <label htmlFor="cableTVAmount" className='cableTVAmount labels'>Payable Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="cableTVAmount" />

                            <button type="submit" onClick={(e) => {
                                let cableTVConsumerNumber = document.querySelector('#cableTVConsumerNumber').value;
                                let cableTVOperator = document.querySelector('#cableTVOperator').value;
                                console.log("operator", cableTVOperator);

                                let amount = document.querySelector('#cableTVAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, 'Cable TV Recharge of ' + cableTVOperator + ' ( ' + cableTVConsumerNumber + ' ) ', amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>

                    <div className="loanRepayment no-display">
                        <form action="" className="loanRepaymentForm">
                            <label htmlFor="loanAccountNumber" className='loanAccountNumber labels'>Loan Account Number</label>
                            <input type="text" name="" id="loanAccountNumber" />

                            <label htmlFor="loanBankName" className='loanBankName labels'>Bank Name</label>
                            <input type="text" name="" id="loanBankName" />

                            <label htmlFor="loanAmount" className='loanAmount labels'>Payable Amount</label>
                            <div className="AmountSymbol"></div>
                            <input type="text" name="" id="loanAmount" />

                            <button type="submit" onClick={(e) => {
                                let loanAccountNumber = document.querySelector('#loanAccountNumber').value;
                                let loanBankName = document.querySelector('#loanBankName').value;
                                console.log("operator", loanBankName);

                                let amount = document.querySelector('#loanAmount').value;
                                console.log("amount", amount);
                                makePaymentRequest(e, 'Loan Payment of ' + loanBankName + ' ( ' + loanAccountNumber + ' ) ', amount)
                            }}>Proceed with Payment</button>
                        </form>
                    </div>

                    <div className="updateCardDetails">

                    </div>
                </div>
            </div>
        </>
    )
}

export default UserDashboard