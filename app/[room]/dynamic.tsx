"use client";

import { useState } from "react";

import VotingBoard from "@/components/VotingBoard/VotingBoard";
import PlayerList from "@/components/PlayerList/PlayerList";
import type { Room, User } from "@/types";

import styles from "./Room.module.scss";
import Button from "@/components/Button";

export default function DynamicPokerRoom({
  roomData,
  user,
}: {
  roomData: Room;
  user: User;
}) {
  const [users] = useState<User[]>([user]);

  // // Subscribe to players list
  // useEffect(() => {
  //   if (!room) return;
  //   const playersRef = collection(db, 'rooms', room as string, 'players');
  //   const q = query(playersRef, orderBy('createdAt'));
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     const playersList: Player[] = [];
  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data() as Omit<Player, "id">;
  //       playersList.push({ id: doc.id, ...data });
  //     });
  //     setPlayers(playersList);
  //   });
  //   return () => unsubscribe();
  // }, [room]);

  // Handle vote submission
  const handleVote = async () => {
    if (!roomData.id || !user.user_id) return;
  };

  // Reveal votes after a 3-second delay
  const handleRevealVotes = async () => {
    if (!roomData.id) return;
    setTimeout(async () => {
      // await updateDoc(roomRef, { isRevealed: true });
    }, 3000);
  };

  // Reset round: clear votes and hide results
  const handleReset = async () => {
    if (!roomData.id) return;
    // const roomRef = doc(db, 'rooms', room as string);
    // await updateDoc(roomRef, { isRevealed: false });
    // players.forEach(async (player) => {
    //   const playerRef = doc(db, 'rooms', room as string, 'players', player.id);
    //   await updateDoc(playerRef, { vote: null });
    // });
  };

  return (
    <>
      <h1>{roomData.name}</h1>
      <>
        <VotingBoard
          votingSystem={roomData.voting_system}
          onVote={handleVote}
          isRevealed={Boolean(roomData.revealed)}
        />
        <div className={styles.controls}>
          {!roomData.revealed && (
            <Button
              onClick={handleRevealVotes}
              text="Reveal Votes"
              variant={roomData.theme}
            />
          )}
          {roomData.revealed && (
            <Button
              onClick={handleReset}
              text="Reset Round"
              variant={roomData.theme}
            />
          )}
        </div>
        <PlayerList users={users} isRevealed={Boolean(roomData.revealed)} />
      </>
    </>
  );
}
