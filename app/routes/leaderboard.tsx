import type { Route } from "./+types/leaderboard";
import { Navbar } from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leaderboard - Fleurish" },
    { name: "description", content: "Leaderboard" },
  ];
}

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-[73.6px] p-8">
        <p className="text-gray-600">Leaderboard</p>
      </main>
    </div>
  );
}

