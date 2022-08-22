import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  logInStatus: {
    isLoggedIn: false,
    token: null,
    email: null,
    password: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.logInStatus = {
        isLoggedIn: !!action.payload.idToken, // https://stackoverflow.com/questions/29312123/how-does-the-double-exclamation-work-in-javascript
        token: action.payload.idToken,
        email: action.payload.enteredEmail,
        password: action.payload.enteredPassword,
      };

      // -- store authentication status in 'localStorage'
      localStorage.setItem(
        "logInStatus",
        JSON.stringify({
          isLoggedIn: !!action.payload.idToken,
          idToken: action.payload.idToken,
          email: action.payload.enteredEmail,
          password: action.payload.enteredPassword,
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
      };

      // remove user logInStatus from localeStorage
      localStorage.removeItem("logInStatus");

      console.log(current(state));
      console.log(action);
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
