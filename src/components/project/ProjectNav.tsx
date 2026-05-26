"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  projectId: string;
}

export default function ProjectNav({ projectId }: Props) {
  const pathname = usePathname();

  const tabs = [
    { href: `/projects/${projectId}/issues`, label: "이슈" },
    { href: `/projects/${projectId}/boards`, label: "보드" },
  ];

  return (
    <div className="flex gap-0 border-b border-slate-200 mb-6">
      {tabs.map(({ href, label }) => {
        const active =
          pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={[
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors no-underline",
              active
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300",
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
