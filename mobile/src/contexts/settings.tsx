import { createContext, PropsWithChildren, useContext } from "react";

export const ApiUrl = "https://habits.pedrorbc.com/api";

const defaultContext = {
  notifcations: false,
  version: "0.0.1",
};

type Content = typeof defaultContext;

export const SettingsContext = createContext<Content>(defaultContext);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  return (
    <SettingsContext.Provider
      value={{
        notifcations: false,
        version: "0.0.1",
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  return useContext(SettingsContext);
}
