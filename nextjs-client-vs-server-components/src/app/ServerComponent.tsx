export default async function ServerComponent() {
  console.log("ServerComponent");

  const req = await fetch("https://reqres.in/api/users/2");
  const { data } = await req.json();

  return (
    <div className="my-5">
      <h1 className="font-bold text-2xl">Server Component</h1>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
