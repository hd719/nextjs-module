import Link from "next/link";
import Hero from "@/components/hero";

import HomeImg from "@/public/home.jpg";

export default function Home() {
  return (
    <Hero imgData={HomeImg} imgAlt="Home" title="Professional Cloud Hosting" />
  );
}
