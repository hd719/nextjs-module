import ServerComponent from "./ServerComponent";
import ClientComponent from "./ClientComponent";

export default async function Home() {
  const req = await fetch("https://reqres.in/api/users/2");
  const { data } = await req.json();

  return (
    <main className="mt-5 max-w-xl mx-auto">
      <ServerComponent />
      <ClientComponent data={data} />
    </main>
  );
}
