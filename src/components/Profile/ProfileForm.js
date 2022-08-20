import { useRef } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { authActions } from "../../store/authSlice";

import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const history = useHistory();

  // --------
  const dispatch = useDispatch();
  const authStore = useSelector((state) => state.auth);

  const { logInStatus } = authStore;

  // --------
  const newPasswordInputRef = useRef();

  // --------
  const submitFormHandler = async (event) => {
    event.preventDefault();

    const auth = getAuth();

    const user = auth.currentUser;
    const newPassword = newPasswordInputRef.current.value;

    try {
      const response = await updatePassword(user, newPassword);

      /* --- if password changed successfully  
      1. Logout user
      2. redirect the user to homepage
*/
      dispatch(authActions.logout());
      history.replace("/");
    } catch (error) {
      const errorCode = error?.code;
      const errorMessage = error?.message || "Authentication Failed!!";

      console.log("Error Code 👉 ", errorCode);
      console.log("Error Message 👉 ", errorMessage);

      alert(`🛑 ${errorCode} 🛑`);
    }
  };

  return (
    <>
      <h1>Welcome, {logInStatus?.email} 🙌</h1>
      <h3>Your current password is: {logInStatus?.password} 🐱‍👤</h3>
      <form className={classes.form} onSubmit={submitFormHandler}>
        <div className={classes.control}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={newPasswordInputRef} />
        </div>
        <div className={classes.action}>
          <button>Change Password</button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
