import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import axios, { type AxiosInstance } from "axios";
import { useURL as UseLinkUri } from "expo-linking";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { mmkvStorage } from "@/lib/mmkvStorage";

// export const ApiUrl =
//   process.env.NODE_ENV === "production"
//     ? "https://habits.pedrorbc.com/api"
//     : "http://192.168.99.130:3000/api";

export const ApiUrl = "https://habits.pedrorbc.com/api";

const defaultContext = {
  user: {
    id: "",
    name: "",
    email: "",
    avatarUrl: "",
  },
  status: "loading" as "loading" | "authenticated" | "unauthenticated",
  logOut: () => {},
  refresh: () => {},
  api: {} as AxiosInstance,
};

type Content = typeof defaultContext;

export const StoreContext = createContext<Content>(defaultContext);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState(null as string | null);
  const [user, setUser] = useState(defaultContext.user);
  const [status, setStatus] = useState(defaultContext.status);
  const url = UseLinkUri();

  const api = axios.create({
    baseURL: ApiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  function logOut() {
    SecureStore.deleteItemAsync("token");
    setToken(null);
  }

  async function tryLogin() {
    try {
      const { data, status } = await api.get("/user");
      const Data = data as typeof defaultContext.user;
      if (status === 200) {
        setUser(Data);
        mmkvStorage.set("user.id", Data.id);
        mmkvStorage.set("user.name", Data.name);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    } catch (error: any) {
      setStatus("unauthenticated");
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      analytics().setUserId(user.id);
      crashlytics().setUserId(user.id);
    }
  }, [status]);

  useEffect(() => {
    const getToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        setToken(token);
      } else {
        setStatus("unauthenticated");
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (url?.includes("token")) {
      const _token = url.split("token=")[1];
      SecureStore.setItem("token", _token);
      setToken(_token);
    }
  }, [url]);

  useEffect(() => {
    if (token) {
      tryLogin();
    } else {
      SecureStore.getItemAsync("token").then((token) => {
        if (token) {
          setToken(token);
        } else {
          setStatus("unauthenticated");
        }
      });
    }
  }, [token]);

  return (
    <StoreContext.Provider
      value={{
        user,
        status,
        api,
        logOut,
        refresh: tryLogin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  return useContext(StoreContext);
}
