import Chat from "@/app/components/Chat";
import { getChat } from "@/db";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function ChatDetail({
  params: { chatId },
}: {
  params: { chatId: string };
}) {
  const chat = await getChat(+chatId);
  if (!chat) {
    return notFound();
  }

  const session = await auth();
  if (!session || session?.user?.email !== chat?.user_email) {
    return redirect("/");
  }

  return (
    <main className="pt-5">
      <Chat id={+chatId} key={chatId} />
    </main>
  );
}
