"use client";

import { signOut } from "next-auth/react";
import AgentStatusButton from "../AgentStatusButton";
import TshLogo from "../TshLogo";

export default function ApHeader({ user }: { user: any }) {
  return (
    <header className="flex flex-col gap-2 border-b bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-center gap-3">
        <TshLogo className="h-8 w-8 shrink-0 object-contain" />
        <span className="text-xl font-semibold tracking-tight">TSHInc</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm sm:justify-end">
        <span>
          <span className="font-semibold">{user?.name}</span> 님 환영 합니다.
        </span>
        <AgentStatusButton />
        <button
          onClick={() => signOut()}
          className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
        >
          Log Out
        </button>
      </div>
    </header>
  );
}
