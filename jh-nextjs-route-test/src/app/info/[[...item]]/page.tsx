export default function InfoOptionalCatchall({
  params,
  searchParams,
}: {
  params: { setting: string[] };
  searchParams: Record<string, string | string[]>;
}) {
  return (
    <main>
      <h1>Info Optional Catch-all Page</h1>
      <p>Params: {JSON.stringify(params, null, 2)}</p>
      <p>Search Params: {JSON.stringify(searchParams, null, 2)}</p>
    </main>
  );
}
