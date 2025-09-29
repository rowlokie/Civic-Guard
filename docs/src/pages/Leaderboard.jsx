import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy } from "lucide-react";

// Trophy colors
const getTrophyColor = (rank) => {
  if (rank === 1) return "text-yellow-400"; // gold
  if (rank === 2) return "text-gray-300";   // silver
  if (rank === 3) return "text-amber-600";  // bronze
  return "text-muted-foreground";
};

// Trophy glow for icon
const getTrophyGlow = (rank) => {
  if (rank === 1) return "drop-shadow-[0_0_10px_rgb(255,215,0)]";
  if (rank === 2) return "drop-shadow-[0_0_10px_rgb(192,192,192)]";
  if (rank === 3) return "drop-shadow-[0_0_10px_rgb(205,127,50)]";
  return "";
};

// Card for each player
const PlayerCard = ({ player, rank }) => {
  const isTopThree = rank <= 3;

  // Card glow class based on rank
  const glowClass =
    rank === 1
      ? "glow-gold"
      : rank === 2
      ? "glow-silver"
      : rank === 3
      ? "glow-bronze"
      : "hover:shadow-sm";

  return (
    <Card
      className={`bg-card border-0  transition-all duration-300 
                  hover:scale-[1.02] ${glowClass} 
                  ${isTopThree ? "ring-2 ring-primary/50" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Rank + Trophy */}
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getTrophyColor(rank)}`}
              >
                {rank}
              </span>
              {isTopThree && (
                <Trophy
                  className={`w-6 h-6 ${getTrophyColor(rank)} ${getTrophyGlow(rank)}`}
                />
              )}
            </div>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <img
                src={player.avatar || "/default-avatar.png"}
                alt={`${player.name} avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>

            {/* Name + Email */}
            <div>
              <h3 className="font-semibold text-foreground">{player.name}</h3>
              <p className="text-sm text-muted-foreground">{player.email}</p>
            </div>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary text-primary-foreground text-lg font-bold px-3 py-1 flex items-center gap-1"
            >
              <Coins className="w-5 h-5 animate-coin-bounce" />
              {player.realBalance.toLocaleString()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/leaderboard");
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-muted-foreground">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coins className="w-8 h-8 text-primary  animate-coin-bounce" />
            <h1
              className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 
                         bg-clip-text text-transparent [text-shadow:_0_0_10px_rgba(168,85,247,0.8),_0_0_20px_rgba(236,72,153,0.6)]"
            >
              UrbanCoin Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Compete with others and climb to the top!
          </p>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3 border-0">
          {users.map((player, index) => (
            <PlayerCard  key={player._id} player={player} rank={index + 1} />
          ))}
        </div>

        {/* Stats footer */}
        <div
          className="mt-6 p-4 rounded-xl border border-border 
                     bg-card shadow-md backdrop-blur-sm"
        >
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{users.length}</p>
              <p className="text-muted-foreground">Active Players</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {users.reduce((sum, p) => sum + p.realBalance, 0).toLocaleString()}
              </p>
              <p className="text-muted-foreground">Total Coins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(
                  users.reduce((sum, p) => sum + p.realBalance, 0) / users.length || 0
                )}
              </p>
              <p className="text-muted-foreground">Average Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
