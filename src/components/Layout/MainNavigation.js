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
    dispatch(authActions.logout());
    history.push("/");
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
