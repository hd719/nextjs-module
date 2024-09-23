export default function SettingHome({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  return (
    <main>
      <h1>SettingHome</h1>
      <h2>Search Params:</h2>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </main>
  );
}
