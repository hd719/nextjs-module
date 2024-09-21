"use client";
import { Todo, addTodo } from "@/app/todo";
import { useState } from "react";

export default function Todos({
  todos,
  todoCount,
}: {
  todos: Todo[];
  todoCount: number;
}) {
  const [newTodo, setNewTodo] = useState("");

  return (
    <>
      <h2 className="text-2xl font-bold mb-5">Todos</h2>
      <p className="mb-2">Total todos: {todoCount}</p>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2">
            {todo.title}
          </li>
        ))}
      </ul>
      <form
        onSubmit={async (e) => {
          addTodo(newTodo);
          e.preventDefault();
          setNewTodo("");
        }}
      >
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border p-1 text-black"
        />
        <button type="submit" className="border p-1">
          Add
        </button>
      </form>
    </>
  );
}
