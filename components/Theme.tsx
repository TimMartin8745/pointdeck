"use client";

import { useEffect } from "react";
import { setTheme, ThemeMode } from "../theme/theme";

const Theme = () => {
  useEffect(() => {
    setTheme(ThemeMode.Light);
  }, []);

  return <></>;
};

export default Theme;
