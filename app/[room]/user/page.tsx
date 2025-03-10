import { redirect } from "next/navigation";

import Button from "@/components/Button/Button";
import { getRoom } from "@/lib/api";

import Input from "@/components/Input/Input";
import Checkbox from "@/components/Checkbox/Checkbox";
import NewUserForm from "./_components/NewUserForm/NewUserForm";

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

  return (
    <NewUserForm roomId={roomId}>
      <h1>Enter your details</h1>
      <Input name="name" title="Display Name" />
      <Checkbox name="spectator" title="Spectator" variant={room.theme} />
      <Button type="submit" text="Enter Room" variant={room.theme} />
    </NewUserForm>
  );
}
