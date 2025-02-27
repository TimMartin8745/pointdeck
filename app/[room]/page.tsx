"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import styles from "./Room.module.scss";
import VotingBoard from "../../components/VotingBoard/VotingBoard";
import PlayerList from "../../components/PlayerList/PlayerList";
import type { Room, Player } from "../../types";

export default function Room({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const router = useRouter();

  const [room, setRoom] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [players] = useState<Player[]>([]);
  const [joined, setJoined] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");

  // Load room
  useEffect(() => {
    async function getRoom() {
      const room = (await params).room;
      setRoom(room);
    }

    void getRoom();
  }, [params]);

  // Load room data
  useEffect(() => {
    if (!room) return;

    async function getRoomData() {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", room)
        .single();

      if (error || !data) {
        console.error(error);
        router.push("/new");
      } else {
        setRoomData(data);
        // Redirect if room is older than 1 day
        const createdAt = new Date(data.created_at);
        if (new Date().getTime() - createdAt.getTime() > 24 * 60 * 60 * 1000) {
          router.push("/new");
        }
      }
    }

    void getRoomData();
  }, [room, router]);

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

  // Handle joining the room
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    // Generate or retrieve a unique player id for this room
    const storedPlayerId = localStorage.getItem(`playerId_${room}`);
    const id =
      storedPlayerId || `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    if (!storedPlayerId) {
      localStorage.setItem(`playerId_${room}`, id);
    }
    setPlayerId(id);
    setJoined(true);
  };

  // Handle vote submission
  const handleVote = async () => {
    if (!room || !playerId) return;
  };

  // Reveal votes after a 3-second delay
  const handleRevealVotes = async () => {
    if (!room) return;
    setTimeout(async () => {
      // await updateDoc(roomRef, { isRevealed: true });
    }, 3000);
  };

  // Reset round: clear votes and hide results
  const handleReset = async () => {
    if (!room) return;
    // const roomRef = doc(db, 'rooms', room as string);
    // await updateDoc(roomRef, { isRevealed: false });
    // players.forEach(async (player) => {
    //   const playerRef = doc(db, 'rooms', room as string, 'players', player.id);
    //   await updateDoc(playerRef, { vote: null });
    // });
  };

  if (!roomData) {
    return <div>Loading room...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{roomData.name}</h1>
      {!joined ? (
        <form onSubmit={handleJoin} className={styles.joinForm}>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
          <button type="submit">Join Room</button>
        </form>
      ) : (
        <>
          <VotingBoard
            votingSystem={roomData.voting_system}
            onVote={handleVote}
            isRevealed={Boolean(roomData.revealed)}
          />
          <div className={styles.controls}>
            {!roomData.revealed && (
              <button onClick={handleRevealVotes}>Reveal Votes</button>
            )}
            {roomData.revealed && (
              <button onClick={handleReset}>Reset Round</button>
            )}
          </div>
          <PlayerList
            players={players}
            isRevealed={Boolean(roomData.revealed)}
          />
        </>
      )}
    </div>
  );
}
