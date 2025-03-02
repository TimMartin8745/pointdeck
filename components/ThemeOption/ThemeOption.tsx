import type React from "react";
import Icon from "@mdi/react";
import { mdiHelp } from "@mdi/js";

import styles from "./ThemeOption.module.scss";
import clsx from "clsx";

interface ThemeOptionProps {
  name: string;
  value: string;
  defaultValue?: string;
}

const ThemeOption = ({ name, value, defaultValue }: ThemeOptionProps) => {
  return (
    <div className={clsx([styles.themeOption, `${styles.theme}-${value}`])}>
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
            {value === "random" && (
              <Icon className={styles.icon} path={mdiHelp} size={0.85} />
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default ThemeOption;
