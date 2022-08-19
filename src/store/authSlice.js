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
        isLoggedIn: !!action.payload.idToken,
        token: action.payload.idToken,
        email: action.payload.enteredEmail,
        password: action.payload.enteredPassword,
      };

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

      console.log(current(state));
      console.log(action);
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
