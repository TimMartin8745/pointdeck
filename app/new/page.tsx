"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import styles from "./NewRoom.module.scss";
import { Room, VotingSystem } from "@/types";

export default function NewRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [votingSystem, setVotingSystem] = useState<VotingSystem>(
    VotingSystem.Fibonacci
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const room: Room = {
        name: roomName,
        voting_system: votingSystem,
        revealed: false,
        votes: {},
      };
      const { data, error } = await supabase
        .from("rooms")
        .insert([room])
        .select()
        .single();

      if (error) {
        console.error("Error creating room:", error.message);
      } else if (data) {
        router.push(`/${data.id}`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
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
            onChange={(e) => setVotingSystem(e.target.value as VotingSystem)}
          >
            <option value={VotingSystem.Fibonacci}>Fibonacci</option>
            <option value={VotingSystem.T_Shirts}>T-Shirts</option>
            <option value={VotingSystem.Powers_Of_2}>Powers of 2</option>
          </select>
        </div>
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
}
