export default function Editor(searchParams: {
  searchParams: Record<string, string | string[]>;
}) {
  return (
    <main>
      Team A&apos;s Editor
      <h2>Search Params: {JSON.stringify(searchParams, null, 2)}</h2>
    </main>
  );
}
