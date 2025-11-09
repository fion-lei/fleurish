import { Navbar } from "../components/Navbar";
import type { Route } from "./+types/garden";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Garden - Fleurish" },
    { name: "description", content: "Your garden" },
  ];
}

export default function Garden() {
  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-[73.6px] p-8">
        <p className="text-gray-600">Garden</p>
      </main>
    </div>
  );
}

