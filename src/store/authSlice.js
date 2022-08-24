import { createSlice, current } from "@reduxjs/toolkit";

let userManuallyLoggedOut;

const initialState = {
  logInStatus: {
    isLoggedIn: false,
    token: null,
    email: null,
    password: null,
    logoutTimer: null,
  },
};

// ------------------------
// --- Calculate remaining time for 'auto logout' - Helper function
//  { remaining time } = { futureLogoutTime } - { current time }
export const calculateLogout_RemainingTime = (futureExpirationTime) => {
  const remainingTime = futureExpirationTime - Date.now();

  return remainingTime;
};

// ------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const remainingLogoutTime = calculateLogout_RemainingTime(
        action.payload.logoutTimer
      );

      console.log(remainingLogoutTime);

      state.logInStatus = {
        isLoggedIn: !!action.payload.idToken, // https://stackoverflow.com/questions/29312123/how-does-the-double-exclamation-work-in-javascript
        token: action.payload.idToken,
        email: action.payload.email,
        password: action.payload.password,
        logoutTimer: action.payload.logoutTimer,
      };

      // -- store authentication status in 'localStorage'
      localStorage.setItem(
        "logInStatus",
        JSON.stringify({
          isLoggedIn: !!action.payload.idToken,
          idToken: action.payload.idToken,
          email: action.payload.email,
          password: action.payload.password,
          logoutTimer: action.payload.logoutTimer,
        })
      );

      console.log(current(state));
      console.log(action);
    },

    logout(state, action) {
      state.logInStatus = {
        isLoggedIn: false,
        token: null,
        email: null,
        password: null,
        logoutTimer: null,
      };

      userManuallyLoggedOut = true;

      // remove user logInStatus from localeStorage
      localStorage.removeItem("logInStatus");

      console.log(current(state));
      console.log(action);
    },
  },
});

// ------------------------
// Creating an 'action creator' to run asynchronous code in Redux Store
export const autoLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    const remainingLogoutTime = calculateLogout_RemainingTime(expirationTime);

    console.log("remainingTime", remainingLogoutTime);

    const runLater = setTimeout(() => {
      dispatch(authActions.logout());
      console.log("AUTO LOGGED OUT after: ", `${expirationTime / 1000}s`);
    }, remainingLogoutTime);

    if (userManuallyLoggedOut) clearTimeout(runLater);
  };
};

export const authActions = authSlice.actions;

export default authSlice;
