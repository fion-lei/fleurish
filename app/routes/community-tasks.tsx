import type { Route } from "./+types/community-tasks";
import { Navbar } from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Community Tasks - Fleurish" },
    { name: "description", content: "Community tasks" },
  ];
}

export default function CommunityTasks() {
  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-[73.6px] p-8">
        <p className="text-gray-600">Community Tasks</p>
      </main>
    </div>
  );
}

