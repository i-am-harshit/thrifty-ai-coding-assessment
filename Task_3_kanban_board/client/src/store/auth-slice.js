import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  userId: "",
  isAuthed: false,
  // optional display fields
  firstName: "",
  lastName: "",
  username: "",
};

const login = (state, action) => {
  // accept various payload field names coming from server/localStorage
  const payload = action.payload || {};
  const newState = {
    token: payload.token,
    userId: payload.userId,
    isAuthed: true,
    firstName: payload.firstname || payload.firstName || "",
    lastName: payload.lastName || payload.lastname || "",
    username: payload.username || "",
  };
  return newState;
};

const logout = () => {
  return initialState;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: { login, logout },
});

export const authActions = authSlice.actions;

export default authSlice;
