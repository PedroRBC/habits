"use client";

import { User } from "@/models/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Status = "loading" | "logged" | "unlogged";

interface authState {
  user: User;
  status: Status;
}

const initialState: authState = {
  user: {
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
  },
  status: "loading",
};

export const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      state.status = "logged";
    },
    logout: (state) => {
      state.status = "unlogged";
    },
  },
});

export const { setUser, logout } = providersSlice.actions;

export const authReducer = providersSlice.reducer;
