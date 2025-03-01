export enum ThemeMode {
  Default = "default",
  Light = "light",
  Dark = "dark",
}

export enum ThemeVariant {
  Grey = "grey",
  CoolGrey = "cool-grey",
  WarmGrey = "warm-grey",
  Brown = "brown",
  Red = "red",
  Crimson = "crimson",
  Orange = "orange",
  Amber = "amber",
  Yellow = "yellow",
  Lime = "lime",
  LightGreen = "light-green",
  Green = "green",
  Teal = "teal",
  Cyan = "cyan",
  LightBlue = "light-blue",
  Blue = "blue",
  Indigo = "indigo",
  Purple = "purple",
  Pink = "pink",
}

export function setTheme(theme?: ThemeMode) {
  const prevTheme =
    localStorage.getItem("theme") ??
    document.documentElement.getAttribute("data-theme");

  function pushTheme(theme: ThemeMode) {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }

  if (!theme) {
    const oldTheme = prevTheme ?? ThemeMode.Default;
    const newTheme = oldTheme === "dark" ? ThemeMode.Dark : ThemeMode.Light;
    pushTheme(newTheme);
    return;
  }

  if (theme === ThemeMode.Default) {
    if (!window) {
      pushTheme(ThemeMode.Default);
      return;
    }

    const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? ThemeMode.Dark
      : ThemeMode.Light;
    pushTheme(defaultTheme);
  }

  pushTheme(theme);
}
