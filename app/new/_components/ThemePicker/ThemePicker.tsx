import type React from "react";
import Icon from "@mdi/react";
import { mdiHelp } from "@mdi/js";
import clsx from "clsx";

import type { ThemeOption } from "@/types";

import styles from "./ThemePicker.module.scss";

interface ThemePickerProps {
  name: string;
  value?: ThemeOption | "random";
  defaultValue?: ThemeOption | "random";
  isRandom?: boolean;
}

const ThemePicker = ({
  name,
  value,
  defaultValue,
  isRandom,
}: ThemePickerProps) => {
  return (
    <div
      className={clsx([
        styles.themeOption,
        styles[`theme-${isRandom ? "random" : value}`],
      ])}
    >
      <input
        type="radio"
        id={value}
        name={name}
        value={value}
        defaultChecked={value === defaultValue}
      />
      <label htmlFor={value} title={value}>
        <div className={styles.border}>
          <div className={styles.option}>
            {isRandom && (
              <Icon className={styles.icon} path={mdiHelp} size={0.85} />
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default ThemePicker;
