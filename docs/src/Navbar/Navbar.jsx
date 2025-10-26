import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Heart, Sparkles, Trophy, Store, Home, BarChart3, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative bg-gray-900 text-white">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Home />
            <span className="font-bold text-lg">CivicGuard</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/leaderboard" className="hover:text-purple-300 flex items-center">
              <Trophy />
              Leaderboard
            </Link>
            <Link to="/store" className="hover:text-purple-300 flex items-center">
              <Store />
              Store
            </Link>
            <Link to="/profile" className="hover:text-purple-300 flex items-center">
              <User />
              Profile
            </Link>
          </div>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 bg-gray-800">
          <Link to="/leaderboard" className="block hover:text-purple-300">Leaderboard</Link>
          <Link to="/store" className="block hover:text-purple-300">Store</Link>
          <Link to="/profile" className="block hover:text-purple-300">Profile</Link>
        </div>
      )}

      {/* Pixel effect overlay */}
      <div className="absolute bottom-0 left-0 w-full h-4 pixel-effect pointer-events-none"></div>

      {/* Pixel effect CSS */}
      <style>{`
        .pixel-effect {
          background-image: 
            repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.1) 0,
              rgba(255,255,255,0.1) 1px,
              transparent 1px,
              transparent 4px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(255,255,255,0.1) 0,
              rgba(255,255,255,0.1) 1px,
              transparent 1px,
              transparent 4px
            );
          background-size: 4px 4px;
        }
      `}</style>
    </div>
  );
}

export default Navbar;
