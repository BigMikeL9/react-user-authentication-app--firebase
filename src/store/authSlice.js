import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  logInStatus: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.logInStatus = {
        userLoggedIn: true,
        userIdToken: action.payload.idToken,
        email: action.payload.enteredEmail,
        password: action.payload.enteredPassword,
      };

      console.log(current(state));
      console.log(action);
    },

    logout(state, action) {
      state.logInStatus = {
        userLoggedIn: false,
        userIdToken: null,
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
