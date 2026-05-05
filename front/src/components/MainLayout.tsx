import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomBar from "./BottomBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar />

      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      <BottomBar />
    </div>
  );
}