// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCb9xXAkJie-R053FQLTBFjvGQiFaeIkiA",
  authDomain: "t0-python.firebaseapp.com",
  databaseURL: "https://t0-python-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "t0-python",
  storageBucket: "t0-python.firebasestorage.app",
  messagingSenderId: "331595037617",
  appId: "1:331595037617:web:33d7379becdde728819b90",
  measurementId: "G-WCLNC4SN6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);