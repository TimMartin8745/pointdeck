import type React from "react";
import clsx from "clsx";

import type { ThemeOption } from "@/types";
import styles from "./VoteCard.module.scss";

interface VoteCardProps {
  value: number | string;
  onClick: () => void;
  disabled?: boolean;
  selected: boolean;
  theme: ThemeOption;
}

const VoteCard = ({
  value,
  onClick,
  disabled,
  selected,
  theme,
}: VoteCardProps) => {
  return (
    <button
      className={clsx({
        [styles.card]: true,
        [styles[`theme-${theme}`]]: true,
        [styles.disabled]: disabled,
        [styles.selected]: selected,
      })}
      onClick={!disabled ? onClick : undefined}
      type={"button"}
    >
      <h2>{value}</h2>
    </button>
  );
};

export default VoteCard;
