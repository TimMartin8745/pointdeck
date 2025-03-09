import styles from "./Input.module.scss";

export interface InputProps {
  name: string;
  title?: string;
  disabled?: boolean;
}

export function Input({ name, title, disabled = false }: InputProps) {
  return (
    <label className={styles.inputWrapper}>
      {title && (
        <div className={styles.header}>
          {title && <span className={styles.title}>{title}</span>}
        </div>
      )}
      <input name={name} className={styles.input} disabled={disabled} />
    </label>
  );
}

export default Input;
