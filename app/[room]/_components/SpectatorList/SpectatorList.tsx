"use client";

import { useQuery } from "@tanstack/react-query";

import { getSpectators } from "@/lib/api";
import type { User } from "@/types";

import styles from "./SpectatorList.module.scss";

interface SpectatorListProps {
  roomId: string;
  initialSpectators: User[];
}

const SpectatorList = ({ roomId, initialSpectators }: SpectatorListProps) => {
  const { data: spectators } = useQuery<User[]>({
    queryKey: ["users", "spectators"],
    queryFn: () => getSpectators(roomId),
    initialData: initialSpectators,
  });

  return (
    <ul className={styles.list}>
      {spectators.map((spectator) => (
        <li key={spectator.id}>
          <span>{spectator.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default SpectatorList;
