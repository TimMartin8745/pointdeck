import { ThemeVariant } from "./theme";
import Theme from "./theme.module.scss";

export { ThemeMode, ThemeVariant, setTheme } from "./theme";
export const DEFAULT_THEME = ThemeVariant.Indigo;
export default Theme;
