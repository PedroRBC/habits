"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/selector";
import { setUser } from "@/redux/features/auth-slice";
import axios from "axios";
import { User } from "@/models/user";
import { getCookie } from "cookies-next";

export function AuthProvider() {
  const dispatch = useDispatch();
  const logged = useAppSelector((state) => state.auth.logged);
  useEffect(() => {
    async function fetchData() {
      const token = getCookie("token");
      if (token) {
        const data = await axios
          .get("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data as User);
        dispatch(setUser(data));
      }
    }
    if (!logged) fetchData();
  }, [logged, dispatch]);

  return null;
}
