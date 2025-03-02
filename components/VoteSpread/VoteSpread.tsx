import type { ThemeOption } from "@/types";
import styles from "./VoteSpread.module.scss";

interface VoteSpreadProps {
  spread: Record<string, number>;
  theme: ThemeOption;
}

const VoteSpread = ({ spread, theme }: VoteSpreadProps) => {
  const max = Math.max(...Object.values(spread));

  return (
    <div className={styles.spread}>
      {Object.entries(spread).map(([key, value]) => {
        return (
          <div key={key} className={styles.item}>
            <div className={styles.bar}>
              <div
                className={`${styles.fill}-${theme}`}
                style={{ height: `calc(100% * ${value} / ${max})` }}
              />
            </div>
            <h4>{key}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default VoteSpread;
