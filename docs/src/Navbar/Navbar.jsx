import { Link } from 'react-router-dom'
import { Shield, Users, Heart, Sparkles, Trophy, Store, Home, BarChart3, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function Navbar() {
  return (
    <nav className="relative z-10 bg-gradient-to-r from-purple-900 to-indigo-900 flex items-center justify-between p-4 md:p-3 shadow-lg">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full blur opacity-75"></div>
          <div className="relative bg-purple-700 p-2 rounded-full">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
          </div>
        </div>
        <Link to="/" className="flex flex-col">
          <span className="text-xl md:text-2xl font-bold text-white">CivicGuard</span>
          <span className="text-xs text-purple-200"></span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-1">
         <Link 
          to="/issues" 
          className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-600/30"
        >
          <Heart className="w-4 h-4" />
          <span>Issues</span>
        </Link>
        
        <Link 
          to="/dashboard" 
          className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-600/30"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      
<Link 
          to="/leaderboard" 
          className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-600/30"
        >
          <Trophy className="w-4 h-4" />
          <span>Leaderboard</span>
        </Link>

        <Link 
          to="/store" 
          className="flex items-center gap-1 text-purple-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-purple-600/30"
        >
          <Store className="w-4 h-4" />
          <span>Store</span>
        </Link>
        
      </div>

      {/* Profile Button with Badge */}
      <Link to="/profile">
        <Button className="relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 text-white" size="sm">
          <User className="w-4 h-4 mr-1" />
          Profile
          <Badge className="absolute -top-2 -right-2 bg-green-400 text-green-900 px-1 py-0 text-xs">7</Badge>
        </Button>
      </Link>

      
    </nav>
  );
}

export default Navbar;