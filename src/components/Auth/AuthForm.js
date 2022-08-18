import { useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";

import classes from "./AuthForm.module.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUXasgay7Kzr8nToCUZyOZziUGhBcf-HU",
  authDomain: "react-authentication-app-ea73b.firebaseapp.com",
  projectId: "react-authentication-app-ea73b",
  storageBucket: "react-authentication-app-ea73b.appspot.com",
  messagingSenderId: "838042641546",
  appId: "1:838042641546:web:ec4b2c361c6ac5d9a27973",
};

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // ------ Redux Store ------
  const authStore = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // -------------------------

  // ---- Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // ---- Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);
  // console.log(auth);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    console.log("Email:", enteredEmail);
    console.log("Password:", enteredPassword);

    setIsLoading(true);

    // ---- Send HTTP request Helper function ----
    const sendRequest = async (callback) => {
      try {
        const response = await callback(auth, enteredEmail, enteredPassword);

        // console.log(response);

        setIsLoading(false);

        return response;
      } catch (error) {
        // show error modal

        const errorCode = error?.code;
        const errorMessage = error?.message || "Authentication Failed!!";

        console.log("Error Code 👉 ", errorCode);
        console.log("Error Message 👉 ", errorMessage);

        alert(`🛑 ${errorCode} 🛑`);

        setIsLoading(false);
      }
    };
    // -------------------------------------------

    // --- signup new user - mode
    if (!isLogin) {
      sendRequest(createUserWithEmailAndPassword);
    }

    // --- LOGIN - mode
    if (isLogin) {
      const response = await sendRequest(signInWithEmailAndPassword);

      const userIdToken = response._tokenResponse.idToken;

      dispatch(
        authActions.login({
          idToken: userIdToken,
          enteredEmail,
          enteredPassword,
        })
      );
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitFormHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>

        <div className={classes.actions}>
          {isLoading && <p>Sending Request...</p>}
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
