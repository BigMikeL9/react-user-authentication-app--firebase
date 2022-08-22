import { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { authActions } from "./store/authSlice";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  const history = useHistory();

  const authStore = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { logInStatus } = authStore;

  useEffect(() => {
    const localeStorage_LoginStatus = localStorage.getItem("logInStatus");

    if (JSON.parse(localeStorage_LoginStatus)?.idToken)
      dispatch(authActions.login(JSON.parse(localeStorage_LoginStatus)));

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
