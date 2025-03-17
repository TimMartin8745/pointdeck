import type { ReactNode } from "react";
import styles from "./Dropdown.module.scss";
import { mdiUnfoldMoreHorizontal } from "@mdi/js";
import Icon from "@mdi/react";

export interface DropdownProps<T extends string | number> {
  name?: string;
  title?: string;
  options: readonly T[];
  renderOption: (option: T) => ReactNode;
}

export function Dropdown<T extends string | number>({
  name,
  title,
  options,
  renderOption,
}: DropdownProps<T>) {
  return (
    <label className={styles.inputWrapper}>
      {title && (
        <div className={styles.header}>
          {title && <span className={styles.title}>{title}</span>}
        </div>
      )}
      <div className={styles.input}>
        <select name={name} className={styles.select}>
          {options.map((option) => (
            <option key={option} value={option}>
              {renderOption(option)}
            </option>
          ))}
        </select>
        <Icon path={mdiUnfoldMoreHorizontal} size={1} />
      </div>
    </label>
  );
}

export default Dropdown;
