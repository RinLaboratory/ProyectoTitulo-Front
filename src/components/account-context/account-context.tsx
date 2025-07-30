"use client";

import { createContext, useContext } from "react";
import type { TSafeUser } from "~/utils/validators";

interface AccountContextType {
  user: TSafeUser | undefined;
}

const AccountContext = createContext<AccountContextType | null>(null);

interface AccountContextProviderProps extends AccountContextType {
  children: React.ReactNode;
}

export function AccountContextProvider({
  user,
  children,
}: AccountContextProviderProps) {
  return (
    <AccountContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export const useAccountContext = () => {
  const ctx = useContext(AccountContext);
  if (!ctx)
    throw new Error(
      "useAccountContext must be used within AccountContextProvider",
    );
  return ctx;
};
