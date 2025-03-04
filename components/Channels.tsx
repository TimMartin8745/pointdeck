"use client";

import { useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { deleteUser } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { queryClient } from "./Providers";

const Channels = ({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  supabase
    .channel(`${roomId}-room`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${roomId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ["room"] });
      }
    )
    .subscribe();

  supabase
    .channel(`${roomId}-users`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "users",
        filter: `room_id=eq.${roomId}`,
      },
      () => {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    )
    .subscribe();

  const presenceChannel = supabase.channel(`${roomId}-presence`, {
    config: {
      presence: {
        key: userId ?? undefined,
      },
    },
  });

  presenceChannel
    .on("presence", { event: "leave" }, async ({ key }) => {
      console.log("leave", key);
      if (!key) return;
      await deleteUser(key);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    })
    .subscribe()
    .track({});

  return <>{children}</>;
};

export default Channels;
