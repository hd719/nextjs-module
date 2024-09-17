"use client";
import { useState } from "react";
import { useEffect, useLayoutEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ClientComponent({ data }: any) {
  console.log("ClientComponent");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log("ClientComponent effect");
  }, []);

  useLayoutEffect(() => {
    console.log("ClientComponent layout effect");
  }, []);

  return (
    <div className="my-5">
      <h1 className="font-bold text-2xl">Client Component</h1>
      <p>Counter: {counter}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
        onClick={() => setCounter(counter + 1)}
      >
        Increment
      </button>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
