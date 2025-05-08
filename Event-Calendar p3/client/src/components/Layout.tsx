import React from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#ffcf9d]">
      <h1 className="text-4xl text-center text-[#493628] font-[Papyrus] p-4">Campus Hub</h1>

      <header className="bg-[#a89c29] text-[#ffcf9d]">
        <div className="flex justify-between items-center p-4">
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="font-mono hover:text-gray-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="font-mono hover:text-gray-200">
                Events
              </Link>
            </li>
            <li>
              <span className="font-mono hover:text-gray-200 cursor-pointer">About</span>
            </li>
          </ul>
          <Input
            id="search"
            type="text"
            placeholder="Search.."
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f0a04b] w-56"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>

      <footer className="bg-[#f0a04b] mt-auto py-3 px-6">
        <p className="text-[#493628]">&copy; 2025 Campus Hub | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Layout;
