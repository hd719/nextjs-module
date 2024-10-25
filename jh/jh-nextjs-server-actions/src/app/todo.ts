"use server";

import fs from "node:fs/promises";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export async function getTodosFromFile() {
  const file = await fs.readFile("src/todos.json", "utf-8");
  return JSON.parse(file) as Todo[];
}

export const getTodos = unstable_cache(getTodosFromFile, ["todo-list"], {
  tags: ["todos"],
});

export async function getTodoCount() {
  const todos = await getTodos();
  return todos.length;
}

export async function addTodo(title: string) {
  const todos = await getTodos();
  const newTodo = {
    id: Math.random().toString(36).substring(7),
    title,
    completed: false,
  };
  todos.push(newTodo);
  await fs.writeFile("src/todos.json", JSON.stringify(todos, null, 2));
  // revalidatePath("/");
  revalidateTag("todos");
}
