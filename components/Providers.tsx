"use client";

import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { setTheme, ThemeMode } from "@/theme";

export const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    setTheme(ThemeMode.Light);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
