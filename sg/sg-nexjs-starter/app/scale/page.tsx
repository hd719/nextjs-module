import Link from "next/link";
import Hero from "@/components/hero";

import ScaleImg from "@/public/scale.jpg";

export default function Reliability() {
  return (
    <Hero
      imgData={ScaleImg}
      imgAlt="Scale"
      title="A scalable solution for your website"
    />
  );
}
