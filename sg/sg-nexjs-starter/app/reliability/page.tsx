import Link from "next/link";
import Hero from "@/components/hero";

import ReliabilityImg from "@/public/reliability.jpg";

export default function Reliability() {
  return (
    <Hero
      imgData={ReliabilityImg}
      imgAlt="Reliability"
      title="A reliable solution for your website"
    />
  );
}
