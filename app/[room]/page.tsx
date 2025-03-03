import { Suspense } from "react";

import { getRoom, getUser } from "@/lib/api";
import VoterList from "@/components/VoterList/VoterList";
import VotingBoard from "@/components/VotingBoard/VotingBoard";

import VoteControls from "@/components/VoteControls/VoteControls";
// import SpectatorList from "@/components/SpectatorList/SpectatorList";
import VoteResults from "@/components/VoteResults/VoteResults";
import { redirect } from "next/navigation";

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

  const user = await getUser(userId).catch(() => {
    redirect(`/${roomId}/user`);
  });

  return (
    <div>
      <h1>{room.name}</h1>
      <Suspense>
        <VotingBoard
          roomId={room.id}
          initialRoom={room}
          userId={user.id}
          initialUser={user}
        />
      </Suspense>
      <Suspense>
        <VoteControls roomId={room.id} initialRoom={room} />
      </Suspense>
      <Suspense>
        <VoteResults roomId={room.id} initialRoom={room} />
      </Suspense>
      <div>
        <h2>Voters</h2>
        <Suspense>
          <VoterList roomId={room.id} initialRoom={room} />
        </Suspense>
      </div>
      {/* <Suspense>
        <SpectatorList roomId={room.id} />
      </Suspense> */}
    </div>
  );
}
