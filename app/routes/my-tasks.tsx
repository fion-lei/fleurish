import type { Route } from "./+types/my-tasks";
import { Navbar } from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Tasks - Fleurish" },
    { name: "description", content: "Your tasks" },
  ];
}

export default function MyTasks() {
  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-[73.6px] p-8">
        <p className="text-gray-600">My tasks</p>
      </main>
    </div>
  );
}

