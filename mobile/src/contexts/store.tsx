import { useURL as UseLinkUri } from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

const ApiUrl =
  process.env.NODE_ENV === "production"
    ? "https://habits.pedrorbc.com/api"
    : "http://localhost:3000/api";

const defaultContext = {
  user: {
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
  },
  status: "loading" as "loading" | "authenticated" | "unauthenticated",
  logOut: () => {},
};

type Content = typeof defaultContext;

const StoreContext = createContext<Content>(defaultContext);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const defToken = SecureStore.getItem("token");
  const [token, setToken] = useState(defToken);
  const [user, setUser] = useState(defaultContext.user);
  const [status, setStatus] = useState(defaultContext.status);
  const url = UseLinkUri();

  function logOut() {
    SecureStore.deleteItemAsync("token");
    setToken(null);
  }

  useEffect(() => {
    if (url?.includes("token")) {
      const _token = url.split("token=")[1];
      SecureStore.setItem("token", _token);
      setToken(_token);
    }
  }, [url]);

  useEffect(() => {
    if (token) {
      fetch(`${ApiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setStatus("authenticated");
        });
    } else {
      setStatus("unauthenticated");
    }
  }, [token]);

  return (
    <StoreContext.Provider
      value={{
        user,
        status,
        logOut,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
