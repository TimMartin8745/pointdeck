"use client";

import clsx from "clsx";

import { DEFAULT_THEME } from "@/theme";
import type { ThemeOption } from "@/types";
import Link from "../Link";

import styles from "./Button.module.scss";

interface BaseButton {
  text: string;
  variant?: ThemeOption;
  disabled?: boolean;
}

interface LinkButton extends BaseButton {
  href: string;
}

interface DivButton extends BaseButton {
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
}

export type ButtonProps = LinkButton | DivButton;

const Button = (props: ButtonProps) => {
  if ("href" in props) {
    return (
      <Link
        className={clsx({
          [styles.button]: true,
          [styles[`variant-${props.variant ?? DEFAULT_THEME}`]]: true,
          [styles.disabled]: props.disabled,
        })}
        href="/new"
      >
        {props.text}
      </Link>
    );
  }
  return (
    <button
      className={clsx({
        [styles.button]: true,
        [styles[`variant-${props.variant ?? DEFAULT_THEME}`]]: true,
        [styles.disabled]: props.disabled,
      })}
      onMouseDown={props.onClick}
      onTouchStart={props.onClick}
      onKeyDown={(e) => e.key === "Enter" && props.onClick?.()}
      type={props.type ?? "button"}
      tabIndex={0}
    >
      {props.text}
    </button>
  );
};

export default Button;
