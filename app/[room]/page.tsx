import { Suspense } from "react";

import { supabase } from "@/lib/supabase";
import DynamicPokerRoom from "./dynamic";
import type { Room } from "@/types";
import { redirect } from "next/navigation";

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

  return (
    <Suspense>
      <DynamicPokerRoom roomData={data} user={user} />
    </Suspense>
  );
}
