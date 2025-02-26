import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../lib/firebase';
import { doc, onSnapshot, updateDoc, collection, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import styles from './Room.module.scss';
import VotingBoard from '../../components/VotingBoard/VotingBoard';
import PlayerList from '../../components/PlayerList/PlayerList';
import type { Room, Player } from "../../types"



export default function Room() {
  const router = useRouter();
  const { room } = router.query;

  const [roomData, setRoomData] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [joined, setJoined] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  
  // Load room data
  useEffect(() => {
    if (!room) return;
    const roomRef = doc(db, 'rooms', room as string);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Room, "id">;
        setRoomData({ id: docSnap.id, ...data });
        // Check if room was created more than 1 day ago
        if(data.createdAt){
          const createdAt = new Date(data.createdAt);
          const now = new Date();
          if((now.getTime() - createdAt.getTime()) > 24 * 60 * 60 * 1000){
            router.push('/room/new');
          }
        }
      } else {
        router.push('/room/new');
      }
    });
    return () => unsubscribe();
  }, [room, router]);

  // Subscribe to players list
  useEffect(() => {
    if (!room) return;
    const playersRef = collection(db, 'rooms', room as string, 'players');
    const q = query(playersRef, orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const playersList: Player[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Player, "id">;
        playersList.push({ id: doc.id, ...data });
      });
      setPlayers(playersList);
    });
    return () => unsubscribe();
  }, [room]);

  // Handle joining the room
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    // Generate or retrieve a unique player id for this room
    const storedPlayerId = localStorage.getItem(`playerId_${room}`);
    const id = storedPlayerId || `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    if(!storedPlayerId){
      localStorage.setItem(`playerId_${room}`, id);
    }
    setPlayerId(id);
    const playerRef = doc(db, 'rooms', room as string, 'players', id);
    await setDoc(playerRef, {
      name: playerName,
      vote: null,
      isSpectator: false,
      createdAt: serverTimestamp(),
    });
    setJoined(true);
  };

  // Handle vote submission
  const handleVote = async (vote: number | string) => {
    if (!room || !playerId) return;
    const playerRef = doc(db, 'rooms', room as string, 'players', playerId);
    await updateDoc(playerRef, { vote });
  };

  // Reveal votes after a 3-second delay
  const handleRevealVotes = async () => {
    if (!room) return;
    const roomRef = doc(db, 'rooms', room as string);
    setTimeout(async () => {
      await updateDoc(roomRef, { isRevealed: true });
    }, 3000);
  };

  // Reset round: clear votes and hide results
  const handleReset = async () => {
    if (!room) return;
    const roomRef = doc(db, 'rooms', room as string);
    await updateDoc(roomRef, { isRevealed: false });
    players.forEach(async (player) => {
      const playerRef = doc(db, 'rooms', room as string, 'players', player.id);
      await updateDoc(playerRef, { vote: null });
    });
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
            votingSystem={roomData.votingSystem} 
            onVote={handleVote} 
            isRevealed={roomData.isRevealed} 
          />
          <div className={styles.controls}>
            {!roomData.isRevealed && (
              <button onClick={handleRevealVotes}>Reveal Votes</button>
            )}
            {roomData.isRevealed && (
              <button onClick={handleReset}>Reset Round</button>
            )}
          </div>
          <PlayerList players={players} isRevealed={roomData.isRevealed} />
        </>
      )}
    </div>
  );
}
