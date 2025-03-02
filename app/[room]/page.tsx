import { Suspense } from "react";
import { redirect } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { roomSchema, type Room } from "@/types";
import VoterList from "@/components/VoterList/VoterList";
import VotingBoard from "@/components/VotingBoard/VotingBoard";

import VoteControls from "@/components/VoteControls/VoteControls";
import SpectatorList from "@/components/SpectatorList/SpectatorList";
import VoteResults from "@/components/VoteResults/VoteResults";

export default async function PokerRoom({
  params,
  searchParams,
}: {
  params: Promise<{ room: string }>;
  searchParams: Promise<{ userId: string }>;
}) {
  // Get room data
  const room = (await params).room;

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", room)
    .single<Room>();

  if (error || !data) {
    console.error(error);
    redirect(`/new?room=${room}`);
  }

  // Redirect if room data is not valid
  const {
    data: roomData,
    error: zodError,
    success,
  } = roomSchema.safeParse(data);
  if (!success) {
    console.error(zodError);
    redirect(`/new?room=${room}`);
  }

  const userId = (await searchParams).userId;

  const user = data.votes.find((user) => user.user_id === userId);

  if (!user) {
    redirect(`/${room}/user`);
  }

  // handle reveal votes
  const revealVotes = async () => {
    "use server";
    const { data, error } = await supabase
      .from("rooms")
      .update({ revealed: true })
      .eq("id", room)
      .select()
      .single();

    if (error || !data) {
      console.error("Unable to reveal votes. Please try again.", error);
    }
  };

  // handle reset room
  const resetRoom = async () => {
    "use server";
    const { error } = await supabase.rpc("reset_room_state", {
      room_id: room,
    });

    if (error || !data) {
      console.error("Unable to reset room state:", error);
    }
  };

  // handle user vote
  const updateVote = async (vote: string | number) => {
    "use server";
    const { error } = await supabase.rpc("update_user_vote", {
      room_id: room,
      user_id: userId,
      new_vote: vote,
    });

    if (error) {
      console.error("Error updating user vote:", error);
    }
  };

  return (
    <div>
      <h1>{roomData.name}</h1>
      <Suspense>
        {"vote" in user && (
          <VotingBoard
            room={room}
            user={user}
            votingSystem={roomData.voting_system}
            theme={roomData.theme}
            onVote={updateVote}
          />
        )}
      </Suspense>
      <Suspense>
        <VoteControls
          room={room}
          isRevealed={roomData.revealed}
          theme={roomData.theme}
          onReset={resetRoom}
          onReveal={revealVotes}
        />
      </Suspense>
      <Suspense>
        <VoteResults roomData={roomData} />
      </Suspense>
      <Suspense>
        <VoterList roomData={data} />
      </Suspense>
      <Suspense>
        <SpectatorList roomData={data} />
      </Suspense>
    </div>
  );
}
