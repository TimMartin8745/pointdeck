import { Suspense } from "react";
import styles from "./NewUser.module.scss";
import DynamicNewRoomForm from "./dynamic";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { userSchema } from "@/types";

export default async function NewUser({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const room = (await params).room;

  const createNewRoom = async (formData: FormData) => {
    "use server";
    let redirectPath: string | null = null;

    try {
      const userData = {
        user_id: crypto.randomUUID(),
        name: formData.get("name"),
        ...(formData.get("spectator")
          ? {
              spectator: true,
            }
          : { vote: null }),
      };

      const validUserData = userSchema.parse(userData);

      const { error } = await supabase.rpc("add_user_to_room", {
        room_id: room,
        user_data: validUserData,
      });

      if (error) throw error;

      redirectPath = `/${room}?userId=${validUserData.user_id}`;
    } catch (error) {
      console.error("Error adding user to room:", error);
    } finally {
      if (redirectPath) redirect(redirectPath);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Enter your details</h1>
      <Suspense>
        <DynamicNewRoomForm newUserAction={createNewRoom} />
      </Suspense>
    </div>
  );
}
