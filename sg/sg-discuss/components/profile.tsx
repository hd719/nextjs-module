"use client";
import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();

  if (session?.data?.user) {
    return <div>Client: {JSON.stringify(session.data.user)}</div>;
  } else {
    return <div>Client: Signed Out</div>;
  }
}
