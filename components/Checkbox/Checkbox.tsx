import clsx from "clsx";
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from "@mdi/js";
import Icon from "@mdi/react";

import type { ThemeOption } from "@/types";

import styles from "./Checkbox.module.scss";
import { DEFAULT_THEME } from "@/theme";

export interface CheckboxProps {
  name?: string;
  title?: string;
  variant?: ThemeOption;
}

export function Checkbox({
  name,
  title,
  variant = DEFAULT_THEME,
}: CheckboxProps) {
  return (
    <label className={clsx([styles.checkbox, styles[`variant-${variant}`]])}>
      <span className={styles.title}>{title}</span>
      <input type="checkbox" name={name} />
      <Icon
        path={mdiCheckboxBlankOutline}
        size={1.25}
        className={styles.blank}
      />
      <Icon path={mdiCheckboxMarked} size={1.25} className={styles.checked} />
    </label>
  );
}

export default Checkbox;
