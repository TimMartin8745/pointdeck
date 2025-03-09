"use client";

import { useQuery } from "@tanstack/react-query";

import { getUsers } from "@/lib/api";
import type { User } from "@/types";

import styles from "./SpectatorList.module.scss";

interface SpectatorListProps {
  roomId: string;
  initialUsers: User[];
}

const SpectatorList = ({ roomId, initialUsers }: SpectatorListProps) => {
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(roomId),
    initialData: initialUsers,
  });

  const spectators = users.filter(({ spectator }) => spectator);

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
