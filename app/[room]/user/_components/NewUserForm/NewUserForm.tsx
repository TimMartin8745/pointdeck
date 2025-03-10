"use client";

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { addUser } from "@/lib/api";
import { userPacketSchema } from "@/types";

import styles from "./NewUserForm.module.scss";

const NewUserForm = ({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) => {
  const mutateUser = useMutation({
    mutationFn: addUser,
  });

  const createNewUser = async (formData: FormData) => {
    let redirectPath: string | null = null;

    try {
      const newUser = {
        room_id: roomId,
        name: formData.get("name"),
        spectator: Boolean(formData.get("spectator")),
      };

      const validNewUser = userPacketSchema.parse(newUser);

      const user = await mutateUser.mutateAsync(validNewUser);

      redirectPath = `/${roomId}?userId=${user.id}`;
    } catch (error) {
      console.error("Error adding user to room:", error);
    } finally {
      if (redirectPath) redirect(redirectPath);
    }
  };

  return (
    <form className={styles.container} action={createNewUser}>
      {children}
    </form>
  );
};

export default NewUserForm;
