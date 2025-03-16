"use client";

import { useEffect } from "react";
import { scan } from "react-scan";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const DevTools = () => {
  useEffect(() => {
    scan({
      enabled: true,
    });
  });

  return <ReactQueryDevtools initialIsOpen={false} />;
};

export default DevTools;
