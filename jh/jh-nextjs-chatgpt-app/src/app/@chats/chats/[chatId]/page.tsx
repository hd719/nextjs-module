import { auth } from "@/auth";

import ChatMenu from "@/app/components/ChatMenu";

export default async function ChatMenuColumn() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const session = await auth();
  const authenticated = !!session?.user?.email;

  return authenticated ? (
    <div className="md:w-1/3 md:min-w-1/3 pr-5 w-full text-nowrap">
      <ChatMenu />
    </div>
  ) : (
    <div>There are no chat sessions</div>
  );
}
