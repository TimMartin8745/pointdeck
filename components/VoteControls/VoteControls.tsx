"use client";

import { getRoom, resetRoom, revealRoom } from "@/lib/api";
import type { Room } from "@/types";
import Button from "../Button";

import styles from "./VoteControls.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";

interface VoteControlsProps {
  roomId: string;
  initialRoom: Room;
}

const VoteControls = ({ roomId, initialRoom }: VoteControlsProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room", roomId],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const resetMutation = useMutation({
    mutationFn: () => resetRoom(roomId),
  });

  const revealMutation = useMutation({
    mutationFn: () => revealRoom(roomId),
  });

  return (
    <div className={styles.controls}>
      {room.revealed ? (
        <Button
          onClick={resetMutation.mutate}
          text="Reset Round"
          variant={room.theme}
        />
      ) : (
        <Button
          onClick={revealMutation.mutate}
          text="Reveal Votes"
          variant={room.theme}
        />
      )}
    </div>
  );
};

export default VoteControls;
