"use client";

import { signOut } from "next-auth/react";
import AgentStatusButton from "../AgentStatusButton";

export default function ApHeader({ user }: { user: any }) {
  return (
    <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-xl">My Dashboard</h1>
        <AgentStatusButton />
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-semibold">{user?.name}</span> 님 환영 합니다.
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
