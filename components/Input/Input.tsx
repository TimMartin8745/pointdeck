import clsx from "clsx";

import styles from "./Input.module.scss";

export interface InputProps {
  name?: string;
  required?: boolean;
  title?: string;
  subtitle?: string;
  error?: boolean;
  helperText?: string;
  infoText?: string;

  // name,
  // placeholder,
  // value,
  // onChange,
  // onBlur,
  // required = false,
  // error,
  // helperText,
  // startAdornment,
  // endAdornment,
  // type = TextInputType.Text,
  // loading = false,
  // disabled = false,
  // subtitle,
}

export function Input({
  name,
  required = false,
  title,
  subtitle = "",
  error,
  helperText,
  infoText,
}: InputProps) {
  return (
    <label className={styles.inputWrapper}>
      {(name ?? required ?? subtitle) && (
        <div className={styles.header}>
          {name && <span className={styles.title}>{title}</span>}
          <div className={styles.subtitleWrapper}>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            {required && (
              <span
                className={clsx({
                  [styles.title]: true,
                  [styles.requiredLabel]: true,
                  [styles.errorText]: error,
                })}
              >
                Required
              </span>
            )}
          </div>
        </div>
      )}
      <input name={name} className={styles.input} />
      {error && helperText?.toLowerCase() !== "required" && helperText ? (
        <div className={styles.footer}>
          {error && helperText?.toLowerCase() !== "required" && helperText}
        </div>
      ) : (
        helperText?.toLowerCase() !== "required" &&
        infoText && (
          <div
            className={clsx({ [styles.footer]: true, [styles.info]: !error })}
          >
            {helperText?.toLowerCase() !== "required" && infoText}
          </div>
        )
      )}
    </label>
  );
}

export default Input;
