import styles from "./Dropdown.module.scss";

export interface DropdownProps {
  name?: string;
  required?: boolean;
  title?: string;
}

export function Dropdown({ name, required = false, title }: DropdownProps) {
  return (
    <label className={styles.inputWrapper}>
      {(name ?? required) && (
        <div className={styles.header}>
          {name && <span className={styles.title}>{title}</span>}
        </div>
      )}
      <input name={name} className={styles.input} />
    </label>
  );
}

export default Dropdown;
