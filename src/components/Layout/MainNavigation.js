import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { authActions } from "../../store/authSlice";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const history = useHistory();

  const authStore = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { logInStatus } = authStore;

  const logoutHandler = () => {
    // 'action object creator'

    // -- Side note: Firebase doesnt care or doesnt need to know whether a user is login in or not.  The only thing that should change when a user logout, is our app state, in Redux.  The 'token' / 'isLoggedIn' etc states should be null / falsy.
    dispatch(authActions.logout());

    console.log(`user (${authStore.logInStatus.email}) is LOGGED OUT 🔴 `);
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {/* ---- When user is NOT logged in / authenticated ---- */}
          {!logInStatus.isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}

          {/* ---- When user is logged in / authenticated ---- */}
          {logInStatus.isLoggedIn && (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>

              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
