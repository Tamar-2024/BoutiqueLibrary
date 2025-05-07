import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    role: null
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setAdminState: (state) => {
      state.role = "admin";
    },
    setBorrowState: (state) => {
      state.role = "borrow";
    },
  },
});

export default userSlice;
export const { setUserId, setAdminState, setBorrowState } = userSlice.actions;
