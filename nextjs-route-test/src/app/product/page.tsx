export default function ProductHome({
  params,
  searchParams,
}: {
  params: { productId: string };
  searchParams: Record<string, string | string[]>;
}) {
  return (
    <main>
      <h1>Product Detail Page</h1>
      <p>Params</p>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <h2>Search Params</h2>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </main>
  );
}
