import type React from "react";
import styles from "./VotingBoard.module.scss";
import VoteCard from "../VoteCard/VoteCard";

interface VotingBoardProps {
  votingSystem: string;
  onVote: (vote: number | string) => void;
  isRevealed: boolean;
}

const getVotingValues = (system: string): (number | string)[] => {
  switch (system) {
    case "fibonacci":
      return ["1", "2", "3", "5", "8", "13", "21"];
    case "tshirts":
      return ["XS", "S", "M", "L", "XL"];
    case "powers":
      return ["1", "2", "4", "8", "16", "32", "64"];
    default:
      return [];
  }
};

const VotingBoard: React.FC<VotingBoardProps> = ({
  votingSystem,
  onVote,
  isRevealed,
}) => {
  const values = getVotingValues(votingSystem);

  return (
    <div className={styles.board}>
      {values.map((value) => (
        <VoteCard
          key={value}
          value={value}
          onClick={() => onVote(value)}
          disabled={isRevealed}
        />
      ))}
    </div>
  );
};

export default VotingBoard;
