"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useAppSelector } from "@/redux/selector";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth-slice";
import { deleteCookie } from "cookies-next";

export function LogOut() {
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  function logOutHandler() {
    dispatch(logout());
    deleteCookie("token");
  }
  if (status === "logged") {
    return (
      <Button variant="ghost" onClick={logOutHandler} size="icon">
        <LogOutIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  } else {
    return null;
  }
}
