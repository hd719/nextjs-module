export default function SettingPage({
  params,
  searchParams,
}: {
  params: { setting: string[] };
  searchParams: Record<string, string | string[]>;
}) {
  return (
    <main>
      <h1>Setting Page</h1>
      <p>Setting: {JSON.stringify(params.setting)}</p>
      <p>Setting: {JSON.stringify(searchParams)}</p>
    </main>
  );
}
