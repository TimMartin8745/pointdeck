import { Suspense } from "react";
import styles from "./NewUser.module.scss";
import DynamicNewRoomForm from "./dynamic";
import { redirect } from "next/navigation";
import { userPacketSchema } from "@/types";
import { addUser, getRoom } from "@/lib/api";

export default async function NewUser({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const roomId = (await params).room;

  const room = await getRoom(roomId).catch((error) => {
    console.error(error);
    redirect(`/new?room=${roomId}`);
  });

  const createNewUser = async (formData: FormData) => {
    "use server";
    let redirectPath: string | null = null;

    try {
      const newUser = {
        room_id: roomId,
        name: formData.get("name"),
        spectator: Boolean(formData.get("spectator")),
      };

      const validNewUser = userPacketSchema.parse(newUser);

      const user = await addUser(validNewUser);

      redirectPath = `/${roomId}?userId=${user.id}`;
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
        <DynamicNewRoomForm newUserAction={createNewUser} theme={room.theme} />
      </Suspense>
    </div>
  );
}
