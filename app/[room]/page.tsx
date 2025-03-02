import { Suspense } from "react";

import { supabase } from "@/lib/supabase";
import DynamicPokerRoom from "./dynamic";
import type { Room } from "@/types";
import { redirect } from "next/navigation";
import type {
  RealtimePostgresChangesFilter,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";

export default async function PokerRoom({
  params,
  searchParams,
}: {
  params: Promise<{ room: string }>;
  searchParams: Promise<{ userId: string }>;
}) {
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

  const userId = (await searchParams).userId;

  const user = data.votes.find((user) => user.user_id === userId);

  if (!user) {
    redirect(`/${room}/user`);
  }

  const databaseFilter: RealtimePostgresChangesFilter<"UPDATE"> = {
    schema: "public",
    table: "messages",
    filter: `id=eq.${room}`,
    event: "UPDATE",
  };

  supabase
    .channel(room)
    .on(
      "postgres_changes",
      databaseFilter,
      (payload: RealtimePostgresUpdatePayload<Room>) => console.log(payload)
    )
    .subscribe();

  return (
    <Suspense>
      <DynamicPokerRoom roomData={data} user={user} />
    </Suspense>
  );
}
