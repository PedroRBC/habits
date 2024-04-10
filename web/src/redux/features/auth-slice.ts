"use client";

import { User } from "@/models/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface authState {
  user: User;
  logged: boolean;
  loading: boolean;
}

const initialState: authState = {
  user: {
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
  },
  logged: false,
  loading: true,
};

export const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      state.logged = true;
      state.loading = false;
    },
    logout: (state) => {
      state.logged = false;
    },
  },
});

export const { setUser, logout } = providersSlice.actions;

export const authReducer = providersSlice.reducer;
