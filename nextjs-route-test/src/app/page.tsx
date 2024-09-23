export default function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  return (
    <main>
      <h1>Homepage</h1>
      <h2>Search Params:</h2>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </main>
  );
}
