import { useEffect, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Login from "./Components/Login";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Weather from "./Components/Weather";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAj3eAAiJh27t08bZSUnnUjT0ONSfK3q-w",
  authDomain: "ws-survery-f8989.firebaseapp.com",
  databaseURL: "https://ws-survery-f8989-default-rtdb.firebaseio.com",
  projectId: "ws-survery-f8989",
  storageBucket: "ws-survery-f8989.appspot.com",
  messagingSenderId: "41657779711",
  appId: "1:41657779711:web:1247504ad123b3805d13ca",
  measurementId: "G-XQ4L7845W7"
};

// Initialize Firebase

function App() {
  const [user, setUser] = useState([]);
  const logoutAfter = 3600000;
  let app, auth, provider;
  useEffect(
    () => {
      app = initializeApp(firebaseConfig);
      auth = getAuth();
      provider = new GoogleAuthProvider();
    },
    []
  )


  useEffect(
    () => {
      const userData = localStorage.getItem("userData");
      const loginAt = localStorage.getItem("loginAt");
      const now = new Date().getTime();
      const duration = now - loginAt;
      if (duration > logoutAfter) {
        logout();
      } else {
        if (userData !== null) {
          // auto login
          setUser(JSON.parse(userData));
        }
      }
    },
    []
  )

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("loginAt");
  }

  const googleLoginHandler = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        localStorage.setItem("userData", JSON.stringify(result.user));
        localStorage.setItem("loginAt", new Date().getTime())
        setUser(result.user);
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <>
      {
        user.length === 0
          ?
          <Login handler={googleLoginHandler} />
          :
          <Weather />
      }
    </>
  );
}

export default App;
