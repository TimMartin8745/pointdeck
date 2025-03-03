import type React from "react";
import Icon from "@mdi/react";
import { mdiHelp } from "@mdi/js";
import clsx from "clsx";

import type { ThemeOption } from "@/types";

import styles from "./ThemeOptionInput.module.scss";

interface ThemeOptionProps {
  name: string;
  value: ThemeOption | "random";
  defaultValue?: ThemeOption | "random";
  onClick?: () => void;
  isRandom?: boolean;
}

const ThemeOptionInput = ({
  name,
  value,
  defaultValue,
  onClick,
  isRandom,
}: ThemeOptionProps) => {
  return (
    <div
      className={clsx([
        styles.themeOption,
        styles[`theme-${isRandom ? "random" : value}`],
      ])}
      onMouseDown={onClick}
      onTouchStart={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
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

export default ThemeOptionInput;
