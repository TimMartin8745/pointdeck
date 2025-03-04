"use client";

import { getRoom, resetRoom, revealRoom } from "@/lib/api";
import type { Room } from "@/types";
import Button from "../Button";

import styles from "./VoteControls.module.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../Providers";

interface VoteControlsProps {
  roomId: string;
  initialRoom: Room;
}

const VoteControls = ({ roomId, initialRoom }: VoteControlsProps) => {
  const { data: room } = useQuery<Room>({
    queryKey: ["room"],
    queryFn: () => getRoom(roomId),
    initialData: initialRoom,
  });

  const resetMutation = useMutation({
    mutationFn: () => resetRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const revealMutation = useMutation({
    mutationFn: () => revealRoom(roomId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["room"] }),
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
