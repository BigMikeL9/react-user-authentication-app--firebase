import { useState, useRef } from "react";
import classes from "./AuthForm.module.css";

// we get API key from firbase > Project setting > Web API Key
const API_KEY = "AIzaSyDIpWgPHDqhtlzFIAYEuBDk5ZFEUtJelNA";
const SIGN_UP_API = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // --- signup new user - mode
    if (!isLogin) {
      const newUserInfo = {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      };

      console.log(newUserInfo);

      try {
        const response = await fetch(SIGN_UP_API, {
          method: "POST",
          body: JSON.stringify(newUserInfo),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error(
            `🛑🛑🛑 ERROR ERROR ERROR!!! ${response.status} 🛑🛑🛑`
          );

        const data = await response.json();

        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    }

    // --- LOGIN - mode
    if (isLogin) {
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
          <button>{isLogin ? "Login" : "Create Account"}</button>
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
