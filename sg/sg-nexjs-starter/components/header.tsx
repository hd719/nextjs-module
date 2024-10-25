import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full absolute text-white z-10">
      <nav className="container relative flex flex-wrap items-center justify-between mx-auto p-8">
        <Link href="/" className="font-bond text-3xl">
          Home
        </Link>
        <div className="flex space-x-4" />
        <Link href="/scale">Scale</Link>
        <Link href="/performance">Performance</Link>
        <Link href="/reliability">Reliability</Link>
      </nav>
    </div>
  );
}
