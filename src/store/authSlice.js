import { createSlice, current } from "@reduxjs/toolkit";

let logoutTimer;

const initialState = {
  logInStatus: {
    isLoggedIn: false,
    token: null,
    email: null,
    password: null,
    futureLogoutTime: null,
  },
};

// ------------------------
// --- Calculate remaining time for 'auto logout' - Helper function
//  { remaining time } = { futureLogoutTime } - { current time }
export const calculateLogout_RemainingTime = (futureLogoutTime) => {
  const remainingTime = futureLogoutTime - Date.now();

  return remainingTime;
};

// ------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.logInStatus = {
        isLoggedIn: !!action.payload.idToken, // https://stackoverflow.com/questions/29312123/how-does-the-double-exclamation-work-in-javascript
        token: action.payload.idToken,
        email: action.payload.email,
        password: action.payload.password,
        futureLogoutTime: action.payload.futureLogoutTime,
      };

      // -- store authentication status in 'localStorage'
      localStorage.setItem(
        "logInStatus",
        JSON.stringify({
          isLoggedIn: !!action.payload.idToken,
          idToken: action.payload.idToken,
          email: action.payload.email,
          password: action.payload.password,
          futureLogoutTime: action.payload.futureLogoutTime,
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
        futureLogoutTime: null,
      };

      // remove user logInStatus from localeStorage
      localStorage.removeItem("logInStatus");

      if (logoutTimer) clearTimeout(logoutTimer);

      console.log(current(state));
      console.log(action);
    },
  },
});

// ------------------------
// Creating an 'action creator' to run asynchronous code in Redux Store
export const autoLogoutTimer = (futureLogoutTime) => {
  return (dispatch) => {
    const remainingLogoutTime = calculateLogout_RemainingTime(futureLogoutTime);

    console.log("remainingTime", remainingLogoutTime);

    logoutTimer = setTimeout(() => {
      dispatch(authActions.logout());
      console.log("AUTO LOGGED OUT ");
    }, remainingLogoutTime);
  };
};

export const authActions = authSlice.actions;

export default authSlice;
