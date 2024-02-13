// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA-OW62DzdxaCA9J96mVEwZL6Vm_w5fpVk",
    authDomain: "foodmenu-4aded.firebaseapp.com",
    projectId: "foodmenu-4aded",
    storageBucket: "foodmenu-4aded.appspot.com",
    messagingSenderId: "663312748706",
    appId: "1:663312748706:web:4953320efa27897b0487fb",
    measurementId: "G-6STL54YW4M"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db, analytics}