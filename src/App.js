import { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  authActions,
  autoLogoutTimer,
  calculateLogout_RemainingTime,
} from "./store/authSlice";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  const history = useHistory();

  const authStore = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { logInStatus } = authStore;

  // --- Fetch logInStatus from local storage and autologin user
  useEffect(() => {
    const localeStorage_LoginStatus = localStorage.getItem("logInStatus");
    const localeStorage_LoginStatus_Obj = JSON.parse(localeStorage_LoginStatus);

    if (!localeStorage_LoginStatus_Obj) return;

    dispatch(authActions.login(localeStorage_LoginStatus_Obj));

    console.log("FROM Local Storage:", localeStorage_LoginStatus_Obj);
    console.log(
      "FROM Local Storage:",
      localeStorage_LoginStatus_Obj.futureLogoutTime
    );

    // ----------------
    // -- dispatching a custom 'action creator' function I created in the Redux store to handle the Asynchronous functionality of auto logging-out the user after some time.
    dispatch(autoLogoutTimer(localeStorage_LoginStatus_Obj.futureLogoutTime));
    // ----------------

    // Redirect user to 'profile'
    history.replace("/profile");
  }, [dispatch, history]);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>

        {/* 🌟 'Navigation Guard'  -- Conditionally render a Route🌟 */}
        {!authStore.isLoggedIn && (
          <Route path="/auth" exact>
            <AuthPage />
          </Route>
        )}

        <Route path="/profile" exact>
          {/* Protecting FrontEnd Pages using 👇 
          🌟 'Navigation Guard' -- which is Rendering page components conditionally🌟 */}
          {logInStatus.isLoggedIn ? <UserProfile /> : <Redirect to="/auth" />}
        </Route>

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
