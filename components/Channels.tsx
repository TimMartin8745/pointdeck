"use client";

import type { ReactNode } from "react";

import { supabase } from "@/lib/supabase";
import { queryClient } from "./Providers";

const Channels = ({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) => {
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
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    )
    .subscribe();

  return <>{children}</>;
};

export default Channels;
