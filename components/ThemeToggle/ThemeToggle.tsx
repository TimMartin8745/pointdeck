"use client";

import { useEffect, useState } from "react";
import { mdiWeatherNight, mdiWeatherSunny } from "@mdi/js";
import Icon from "@mdi/react";

import { setTheme, ThemeMode } from "@/theme";

import styles from "./ThemeToggle.module.scss";

const ThemeToggle = () => {
  const [themeState, setThemeState] = useState<ThemeMode | null>(null);

  useEffect(() => {
    const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? ThemeMode.Dark
      : ThemeMode.Light;

    const storedTheme = localStorage.getItem("theme");
    const currentTheme =
      (storedTheme as ThemeMode) ||
      document.documentElement.getAttribute("data-theme") ||
      defaultTheme;

    setThemeState(currentTheme as ThemeMode);
  }, []);

  const handleToggle = () => {
    setThemeState((cur) => {
      const newTheme =
        cur === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;

      setTheme(newTheme);
      return newTheme;
    });
  };

  if (!themeState) return null;

  return (
    <button type="button" className={styles.toggle} onClick={handleToggle}>
      {themeState === ThemeMode.Light ? (
        <Icon path={mdiWeatherNight} size={1.25} title={"Dark Mode"} />
      ) : (
        <Icon path={mdiWeatherSunny} size={1.25} title={"Light Mode"} />
      )}
    </button>
  );
};

export default ThemeToggle;
