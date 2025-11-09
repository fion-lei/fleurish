import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}

