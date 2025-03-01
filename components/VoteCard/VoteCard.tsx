import type React from "react";
import styles from "./VoteCard.module.scss";

interface VoteCardProps {
  value: number | string;
  onClick: () => void;
  disabled: boolean;
}

const VoteCard: React.FC<VoteCardProps> = ({ value, onClick, disabled }) => {
  return (
    <button
      className={`${styles.card} ${disabled ? styles.disabled : ""}`}
      onClick={!disabled ? onClick : undefined}
      type={"button"}
    >
      {value}
    </button>
  );
};

export default VoteCard;
