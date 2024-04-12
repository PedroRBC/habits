"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/selector";
import { logout, setUser } from "@/redux/features/auth-slice";
import axios from "axios";
import { User } from "@/models/user";
import { getCookie } from "cookies-next";

export function AuthProvider() {
  const dispatch = useDispatch();
  const status = useAppSelector((state) => state.auth.status);
  useEffect(() => {
    async function fetchData() {
      const token = getCookie("token");
      if (token) {
        try {
          const data = await axios
            .get("/api/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => res.data as User);
          dispatch(setUser(data));
        } catch (error: any) {
          if (error.response.status == 401) {
            dispatch(logout());
          }
          return;
        }
      } else {
        dispatch(logout());
      }
    }
    if (status == "loading") fetchData();
  }, [status, dispatch]);

  return null;
}
