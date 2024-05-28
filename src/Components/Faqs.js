import React, { createElement, useEffect } from 'react'
require('../Components/Faqs.css');
const Faqs = () => {
    function addFaqs() {
        setTimeout(() => {
            console.log('addFaqs');
            let MainFAQContainer = document.querySelector('.MainFAQContainer');
            let questionsList = ["What is Prosperous bank Internet banking?", "On which browsers can we access the Internet Banking Website?", "What is a customer ID?"]
            let answersList = ["The Internet Banking gives you access to your account/s - anytime, anywhere, 24X7 - at your own comfort. You can manage all your daily transactions online. You can view statements, order cheque books, do fund transfers, order DDs, pay your bills & even shop online.", "Internet Banking works best on the latest versions of all browsers such as Internet Explorer, Safari, Google Chrome etc.", "A Customer ID is a 9 - digit number which uniquely identifies your relationship with Axis Bank.Your customer ID is usually your login ID for the Internet Banking login.Please mention this ID in all your communications with Axis Bank."];
            for (let i = 0; i < questionsList.length; i++) {
                let faqContainer = document.createElement("div");
                faqContainer.classList.add("faqContainer");

                let faq = document.createElement('div');
                faq.className = 'faq';
                faq.id = 'faq' + i;
                let downArrow = document.createElement('i');
                downArrow.classList.add('fa-solid');
                downArrow.classList.add('fa-caret-down');
                let upArrow = document.createElement('i');
                upArrow.classList.add('fa-solid');
                upArrow.classList.add('fa-caret-up');
                upArrow.classList.add('no-display');
                let faqQuestion = document.createElement('div');
                faqQuestion.classList.add('faq-question');
                faqQuestion.id = 'faq-question' + i;
                faqQuestion.innerText = questionsList[i];
                let faqAnswer = document.createElement('div');
                faqAnswer.className = 'faq-answer';
                faqAnswer.id = 'faq-answer' + i;
                faqAnswer.classList.add('toggleStyle');
                faqAnswer.innerHTML = answersList[i];
                upArrow.addEventListener('click', () => {
                    faqAnswer.classList.toggle('toggleStyle')
                    upArrow.classList.toggle('no-display');
                    downArrow.classList.toggle('no-display');
                });
                downArrow.addEventListener('click', () => {
                    faqAnswer.classList.toggle('toggleStyle')
                    upArrow.classList.toggle('no-display');
                    downArrow.classList.toggle('no-display');
                });
                faq.appendChild(downArrow);
                faq.appendChild(upArrow);
                faq.appendChild(faqQuestion);
                faqContainer.appendChild(faq);
                faqContainer.appendChild(faqAnswer);
                MainFAQContainer.appendChild(faqContainer);


            }
        }, 1000);
    };
    return (
        <div className="faqs">
            <h3>FAQs</h3>
            <div className="MainFAQContainer">
                {addFaqs()}

            </div>
        </div>
    )
}

export default Faqs;