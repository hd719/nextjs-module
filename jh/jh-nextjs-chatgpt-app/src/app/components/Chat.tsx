"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateChat } from "@/app/server-actions/updateChat";
import Transcript from "./Transcript";
import type { Message as AIMessage } from "ai";
import { useChat } from "ai/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat({
  id = null,
  messages: initialMessages = [],
}: {
  id?: number | null;
  messages?: Message[];
}) {
  const router = useRouter();
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: initialMessages as unknown as AIMessage[],
    });
  const chatId = useRef<number | null>(id); // The reason we use a ref here is because we want to persist the chatId across renders

  useEffect(() => {
    (async () => {
      if (!isLoading && messages.length) {
        const simplifiedMessages = messages.map((message) => ({
          role: message.role as "user" | "assistant",
          content: message.content,
        }));
        const newChatId = await updateChat(chatId.current, simplifiedMessages);
        if (chatId.current === null) {
          router.push(`/chats/${newChatId}`);
          router.refresh();
        } else {
          chatId.current = newChatId;
        }
      }
    })();
  }, [isLoading, messages, router]);

  return (
    <div className="flex flex-col">
      <Transcript messages={messages as Message[]} truncate={false} />
      <form className="flex mt-3" onSubmit={handleSubmit}>
        <Input
          className="flex-grow text-xl"
          placeholder="Question"
          value={input}
          onChange={handleInputChange}
          autoFocus
        />
        <Button type="submit" className="ml-3 text-xl">
          Send
        </Button>
      </form>
    </div>
  );
}
