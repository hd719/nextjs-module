import { getTodos, getTodoCount } from "@/app/todo";
import Todos from "@/app/Todos";

export default async function Home() {
  const todos = await getTodos();
  const todoCount = await getTodoCount();

  return (
    <main className="max-w-xl mx-auto mt-5">
      <Todos todos={todos} todoCount={todoCount} />
    </main>
  );
}
