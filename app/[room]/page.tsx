import { Suspense } from "react";

import { getRoom, getUsers } from "@/lib/api";
import VoterList from "@/app/[room]/_components/VoterList/VoterList";
import VotingBoard from "@/app/[room]/_components/VotingBoard/VotingBoard";

import VoteControls from "@/app/[room]/_components/VoteControls/VoteControls";
import VoteResults from "@/app/[room]/_components/VoteResults/VoteResults";
import { redirect } from "next/navigation";
import Channels from "@/components/Channels";
import SpectatorList from "./_components/SpectatorList/SpectatorList";

export default async function PokerRoom({
  params,
  searchParams,
}: {
  params: Promise<{ room: string }>;
  searchParams: Promise<{ userId: string }>;
}) {
  const roomId = (await params).room;
  const userId = (await searchParams).userId;

  const room = await getRoom(roomId).catch((error) => {
    console.error(error);
    redirect(`/new?room=${roomId}`);
  });

  const users = await getUsers(userId).catch(() => {
    redirect(`/${roomId}/user`);
  });

  const hasSpectators = users.findIndex(({ spectator }) => spectator) >= 0;

  return (
    <Channels roomId={roomId}>
      <div>
        <h1>{room.name}</h1>
        <Suspense>
          <VotingBoard
            roomId={roomId}
            initialRoom={room}
            userId={userId}
            initialUsers={users}
          />
        </Suspense>
        <Suspense>
          <VoteControls
            roomId={room.id}
            initialRoom={room}
            initialUsers={users}
          />
        </Suspense>
        <Suspense>
          <VoteResults roomId={room.id} initialRoom={room} />
        </Suspense>
        <div>
          <h2>Voters</h2>
          <Suspense>
            <VoterList
              roomId={room.id}
              initialRoom={room}
              initialUsers={users}
            />
          </Suspense>
        </div>
        {hasSpectators && (
          <div>
            <h2>Spectators</h2>
            <Suspense>
              <SpectatorList roomId={room.id} initialUsers={users} />
            </Suspense>
          </div>
        )}
      </div>
    </Channels>
  );
}
