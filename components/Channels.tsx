"use client";

import type { ReactNode } from "react";

import { supabase } from "@/lib/supabase";
import { queryClient } from "./Providers";
import type { Room, User } from "@/types";
import { roomSchema, userSchema } from "@/types";

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
      (message) => {
        const { data, error } = roomSchema.safeParse(message.new);

        if (error) {
          console.error(error);
          return;
        }

        queryClient.setQueryData<Room>(["room"], () => data);
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
      (message) => {
        const { data, error } = userSchema.safeParse(message.new);

        if (error) {
          console.error(error);
          return;
        }

        queryClient.setQueryData<Record<string, User>>(
          ["users", data.spectator ? "spectators" : "voters"],
          (oldData) =>
            oldData && {
              ...oldData,
              [data.id]: data,
            }
        );
      }
    )
    .subscribe();

  return <>{children}</>;
};

export default Channels;
