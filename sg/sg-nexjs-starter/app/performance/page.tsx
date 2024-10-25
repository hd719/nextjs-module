import Link from "next/link";
import Hero from "@/components/hero";

import PerfImg from "@/public/performance.jpg";

export default function Performance() {
  return (
    <Hero
      imgData={PerfImg}
      imgAlt="Performance"
      title="A high performance solution for your website"
    />
  );
}
