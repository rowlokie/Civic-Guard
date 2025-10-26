import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Heart, Sparkles, Trophy, Store, Home, BarChart3, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="relative z-10 bg-gradient-to-r from-purple-900 to-indigo-900 flex items-center justify-between p-4 md:p-3 shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full blur opacity-75"></div>
          <div className="relative bg-purple-700 p-2 rounded-full">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
          </div>
        </div>
        <Link to="/" className="flex flex-col">
          <span className="text-xl md:text-2xl font-bold text-white">CivicGuard</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-1">
        <Link to="/issues" className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-600/30">
          <Heart className="w-4 h-4" /> Issues
        </Link>
        <Link to="/dashboard" className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-600/30">
          <Home className="w-4 h-4" /> Dashboard
        </Link>
        <Link to="/leaderboard" className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-600/30">
          <Trophy className="w-4 h-4" /> Leaderboard
        </Link>
        <Link to="/store" className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-600/30">
          <Store className="w-4 h-4" /> Store
        </Link>
      </div>

      {/* Desktop Profile Button + Pixel Texture */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/profile">
          <Button className="relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 text-white" size="sm">
            <User className="w-4 h-4 mr-1" />
            Profile
            <Badge className="absolute -top-2 -right-2 bg-green-400 text-green-900 px-1 py-0 text-xs">7</Badge>
          </Button>
        </Link>
        
        {/* Pixelated Texture */}
        <div className="w-16 h-12 relative overflow-hidden rounded-lg border-2 border-purple-400/50 bg-purple-800">
          {/* Pixel Grid */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-[1px] p-1">
            {/* Row 1 */}
            <div className="bg-purple-300 rounded-[1px]"></div>
            <div className="bg-purple-500 rounded-[1px]"></div>
            <div className="bg-purple-300 rounded-[1px]"></div>
            <div className="bg-purple-600 rounded-[1px]"></div>
            
            {/* Row 2 */}
            <div className="bg-purple-600 rounded-[1px]"></div>
            <div className="bg-purple-400 rounded-[1px]"></div>
            <div className="bg-purple-500 rounded-[1px]"></div>
            <div className="bg-purple-300 rounded-[1px]"></div>
            
            {/* Row 3 */}
            <div className="bg-purple-400 rounded-[1px]"></div>
            <div className="bg-purple-600 rounded-[1px]"></div>
            <div className="bg-purple-300 rounded-[1px]"></div>
            <div className="bg-purple-500 rounded-[1px]"></div>
          </div>
          
          {/* Pixel Border Effect */}
          <div className="absolute inset-0 border-2 border-purple-200/20 rounded-lg pointer-events-none"></div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_10px_rgba(192,132,252,0.3)] pointer-events-none"></div>
        </div>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white p-2 focus:outline-none">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-purple-800 rounded-lg shadow-lg flex flex-col p-2 space-y-2 md:hidden z-20">
          <Link to="/profile" className="flex items-center gap-1 text-white hover:bg-purple-700 px-3 py-2 rounded">
            <User className="w-4 h-4" /> Profile
          </Link>
          <Link to="/issues" className="flex items-center gap-1 text-white hover:bg-purple-700 px-3 py-2 rounded">
            <Heart className="w-4 h-4" /> Issues
          </Link>
          <Link to="/dashboard" className="flex items-center gap-1 text-white hover:bg-purple-700 px-3 py-2 rounded">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/leaderboard" className="flex items-center gap-1 text-white hover:bg-purple-700 px-3 py-2 rounded">
            <Trophy className="w-4 h-4" /> Leaderboard
          </Link>
          <Link to="/store" className="flex items-center gap-1 text-white hover:bg-purple-700 px-3 py-2 rounded">
            <Store className="w-4 h-4" /> Coupons
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;