// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDlfBvah57LQLsNYhM2wk5hjLZkZReRLrw",
    authDomain: "shop-managment-3e081.firebaseapp.com",
    projectId: "shop-managment-3e081",
    storageBucket: "shop-managment-3e081.appspot.com",
    messagingSenderId: "976199542261",
    appId: "1:976199542261:web:1d392dc8829376356c6cbc",
    measurementId: "G-HHN8C5FKN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);