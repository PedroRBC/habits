"use client";

import { Provider as ReactReduxProvider, ProviderProps } from "react-redux";

export function ReduxProvider({ children, ...props }: ProviderProps) {
  return <ReactReduxProvider {...props}> {children} </ReactReduxProvider>;
}
