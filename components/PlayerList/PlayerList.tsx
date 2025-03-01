import styles from "./PlayerList.module.scss";
import type { User } from "@/types";

interface PlayerListProps {
  users: User[];
  isRevealed: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ users, isRevealed }) => {
  const players = users.filter((user) => "vote" in user);
  const numericVotes = players
    .map((player) => (typeof player.vote === "number" ? player.vote : null))
    .filter((vote) => vote !== null) as number[];

  const average =
    numericVotes.length > 0
      ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(
          2
        )
      : null;

  return (
    <div className={styles.list}>
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.user_id}>
            <span>{player.name}</span> -
            <span>
              {isRevealed
                ? player.vote !== null
                  ? player.vote
                  : "No Vote"
                : player.vote !== null
                ? "Voted"
                : "Not Voted"}
            </span>
          </li>
        ))}
      </ul>
      {isRevealed && average && (
        <div>
          <strong>Average Vote: </strong>
          {average}
        </div>
      )}
    </div>
  );
};

export default PlayerList;
