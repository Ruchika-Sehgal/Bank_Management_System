// import Loader from './Components/Loader';
import Navbar from './Components/Navbar';
import Header from './Components/Header';
import Offers from './Components/Offers';
import Reviews from './Components/Reviews';
import Login from './Components/Login';
import ForgotPswd from './Components/ForgotPswd.js';
import './App.css';
import { useEffect } from 'react';
import React from 'react';
import Footer from './Components/Footer';
// import Faqs from './Components/Faqs.js';
import UserDashboard from './Components/UserDashboard';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Feedback from './Components/Feedback';

function App() {

  let i = 0;


  useEffect(() => {
    if (typeof document != null && document.querySelector(".offers") != null) {
      try {

        let intersectionObserver = new IntersectionObserver((e) => {
          [...document.querySelectorAll(".offer")].forEach(el => el.style.transition = 'all 500ms ease-in-out');
          e.forEach((entry) => {
            if (entry.isIntersecting === true && document.readyState == 'complete') {
              // console.log("Hello", document.readyState);
              [...document.querySelectorAll(".offer")].forEach(el => el.style.display = 'flex');
            }
            else {
              [...document.querySelectorAll(".offer")].forEach(el => el.style.display = 'none');
            }
          });
        });
        // console.log(document.querySelector(".offers"));
        intersectionObserver.observe(document.querySelector(".offers"));
        // console.log("Hello Hello");
      } catch { };
    }


  }, [document.readyState, document.querySelector(".offers")])


  useEffect(() => {
    if (typeof document != null && document.querySelector(".reviews") != null) {
      let review = document.querySelector('.reviews');
      setInterval(() => {
        review.scroll({
          left: (getComputedStyle(document.querySelector(".review")).getPropertyValue("width").split("px")[0]) * i,
          behavior: "smooth"
        })
        i++;
      }, 2000);
      setInterval(() => {
        i = 0;

      }, 8000)
    }
  }, [document.querySelector('.reviews')])

  useEffect(() => {
    if (typeof document != null && document.querySelector(".FeedbackContainer") != null) {
      try {

        let intersectionObserver = new IntersectionObserver((e) => {
          document.querySelector(".FeedbackContainer").style.transition = 'all 1000ms ease-in-out';
          e.forEach((entry) => {
            if (entry.isIntersecting === true && document.readyState == 'complete') {
              // console.log("intersecting");
              document.querySelector(".FeedbackContainer").style.translate = "0vw";
            }
            else {
              document.querySelector(".FeedbackContainer").style.translate = "-150vw";
              // console.log("Not Intersecting");
            }
          });
        });
        // console.log(document.querySelector(".FeedbackContainer"));
        intersectionObserver.observe(document.querySelector(".FeedbackMajor"));
        try {
          intersectionObserver.observe(document.querySelector(".FeedbackMajor"));

        } catch (e) { }
        // console.log("Hello Hello");
      } catch { };
    }


  }, [document.readyState, document.querySelector(".FeedbackContainer")])

  return (
    <>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<><Navbar /><Header /><Offers /><Reviews /><Feedback /><Footer /></>} >
            </Route>
            <Route path="/Login" element={<><Navbar /><Login /><Footer /></>} >
            </Route>
            <Route path="/ForgotPassword" element={<><Navbar /><ForgotPswd /><Footer /></>} >
            </Route>
            <Route path="/Dashboard" element={<><Navbar /><UserDashboard /><Footer /></>}>
            </Route>
            {/* <Route path="/FAQ" element={<><Navbar /><Faqs /> <Footer /></>}>
            </Route> */}

          </Routes>
        </BrowserRouter>
      </React.StrictMode>

    </>
  );
}

export default App;
