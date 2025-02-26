"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './NewRoom.module.scss';

export default function NewRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [votingSystem, setVotingSystem] = useState('fibonacci');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        votingSystem,
        createdAt: serverTimestamp(),
        isRevealed: false,
      });
      router.push(`/room/${docRef.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New Room</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label>Voting System</label>
          <select
            value={votingSystem}
            onChange={(e) => setVotingSystem(e.target.value)}
          >
            <option value="fibonacci">Fibonacci</option>
            <option value="tshirts">T-Shirts</option>
            <option value="powers">Powers of 2</option>
          </select>
        </div>
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
}