"use client";

import Image from "next/image";

export default function TshLogo({
  className = "h-40 w-40 object-contain opacity-10",
}: {
  className?: string;
}) {
  return (
    <Image
      src="/tsh-logo.png"
      alt=""
      width={160}
      height={160}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
