import { Navbar } from "../components/Navbar";
import type { Route } from "./+types/profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile - Fleurish" },
    { name: "description", content: "Your profile" },
  ];
}

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-[73.6px] p-8">
        <p className="text-gray-600">Profile</p>
      </main>
    </div>
  );
}

