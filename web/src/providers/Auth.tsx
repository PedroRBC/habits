"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function AuthProvider() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    if (window && token) {
      sessionStorage.setItem("token", token);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("token");
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params}`,
      );
    }
  }, [token]);

  return null;
}
