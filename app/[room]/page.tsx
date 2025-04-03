import { Suspense } from "react";

import { getRoom, getUsers } from "@/lib/api";
import VoterList from "@/app/[room]/_components/VoterList/VoterList";
import VotingBoard from "@/app/[room]/_components/VotingBoard/VotingBoard";

import VoteControls from "@/app/[room]/_components/VoteControls/VoteControls";
import VoteResults from "@/app/[room]/_components/VoteResults/VoteResults";
import { redirect } from "next/navigation";
import Channels from "@/components/Channels";
import SpectatorList from "./_components/SpectatorList/SpectatorList";
import type { User } from "@/types";
import { tryCatch } from "@/utils";

export default async function PokerRoom({
  params,
  searchParams,
}: {
  params: Promise<{ room: string }>;
  searchParams: Promise<{ userId: string }>;
}) {
  const roomId = (await params).room;
  const userId = (await searchParams).userId;

  if (!roomId) redirect("/new");
  if (!userId) redirect(`/${roomId}/user`);

  const room = await tryCatch(getRoom(roomId));

  if (!room.success) {
    console.error(room.error);
    redirect(`/new?room=${roomId}`);
  }

  const users = await tryCatch(getUsers(roomId));

  if (!users.success) {
    console.error(users.error);
    redirect(`/new?room=${roomId}`);
  }

  const user = users.value.find(({ id }) => id === userId);
  if (!user) redirect(`/${roomId}/user`);

  const voters: User[] = [];
  const spectators: User[] = [];
  for (const user of users.value) {
    if (user.spectator) {
      spectators.push(user);
      continue;
    }
    voters.push(user);
  }

  return (
    <Channels roomId={roomId}>
      <div>
        <h1>{room.value.name}</h1>
        <Suspense>
          <VotingBoard
            roomId={roomId}
            initialRoom={room.value}
            userId={userId}
            initialVoters={voters}
          />
        </Suspense>
        <Suspense>
          <VoteControls
            roomId={roomId}
            initialRoom={room.value}
            initialVoters={voters}
          />
        </Suspense>
        <Suspense>
          <VoteResults
            roomId={roomId}
            initialRoom={room.value}
            initialVoters={voters}
          />
        </Suspense>
        <div>
          <h2>Voters</h2>
          <Suspense>
            <VoterList
              roomId={roomId}
              initialRoom={room.value}
              initialVoters={voters}
            />
          </Suspense>
        </div>
        {spectators.length > 0 && (
          <div>
            <h2>Spectators</h2>
            <Suspense>
              <SpectatorList roomId={roomId} initialSpectators={spectators} />
            </Suspense>
          </div>
        )}
      </div>
    </Channels>
  );
}
