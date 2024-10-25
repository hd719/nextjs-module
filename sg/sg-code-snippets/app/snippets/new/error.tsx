// must be client component

"use client";

interface ErrorPageProps {
  error: Error;
  reset: () => void; // automatically refresh the route
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <div>{error.message}</div>;
}
