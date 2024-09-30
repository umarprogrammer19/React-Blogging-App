import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyChq4DZ8Cme7OGZWnPT_8Dmj2EyG_zVIr4",
    authDomain: "react-blogging-app121.firebaseapp.com",
    projectId: "react-blogging-app121",
    storageBucket: "react-blogging-app121.appspot.com",
    messagingSenderId: "157565899165",
    appId: "1:157565899165:web:640f0986adc7787d1adf74"
};

const app = initializeApp(firebaseConfig);

export default app;