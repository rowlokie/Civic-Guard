import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy } from "lucide-react";

// Helper: trophy color and glow
const getTrophyColor = (rank) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-amber-600";
  return "text-purple-400";
};
const getGlow = (rank) => {
  if (rank === 1) return "shadow-[0_0_25px_rgba(255,215,0,0.6)]";
  if (rank === 2) return "shadow-[0_0_25px_rgba(200,200,200,0.5)]";
  if (rank === 3) return "shadow-[0_0_25px_rgba(255,160,0,0.4)]";
  return "hover:shadow-[0_0_15px_rgba(147,51,234,0.3)]";
};

// Single player card
const PlayerCard = ({ player, rank }) => {
  const isTopThree = rank <= 3;

  return (
    <Card
      className={`relative bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg 
                  p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02]
                  ${getGlow(rank)} ${isTopThree ? "border-yellow-400/70" : "border-purple-500/40"}`}
    >
      {isTopThree && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 w-12 h-12 rounded-full 
                          flex items-center justify-center text-xl font-bold shadow-lg">
            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
          </div>
        </div>
      )}

      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          {/* Left: rank, avatar, name */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-purple-300 w-8">#{rank}</div>
            <div className="w-14 h-14 rounded-full bg-purple-800/40 flex items-center justify-center border border-purple-500/30">
              <img
                src={player.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{player.name}</h3>
              <p className="text-sm text-purple-300">{player.city || player.email}</p>
            </div>
          </div>

          {/* Right: level, coins */}
          <div className="text-right flex flex-col items-end gap-2">
            <div
              className="text-2xl font-bold text-transparent bg-clip-text 
                         bg-gradient-to-r from-yellow-300 to-amber-400"
            >
              Level {player.level || Math.floor(player.realBalance / 100)}
            </div>
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

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          "https://civic-guard-3tds.onrender.com/api/leaderboard"
        );
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-purple-300 text-xl">
        ⚙️ Loading the Guardian leaderboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0015] via-[#120026] to-[#1b0038] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 
                         bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]">
            🛡️ CivicGuardian Leaderboard
          </h1>
          <p className="text-purple-300 mt-3">
            Compete. Contribute. Rise through the ranks of Guardians.
          </p>
        </div>

        {/* List of players */}
        <div className="space-y-5">
          {users.map((player, i) => (
            <PlayerCard key={player._id} player={player} rank={i + 1} />
          ))}
        </div>

        {/* Footer stats */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/40 
                        p-6 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="grid grid-cols-3 text-center gap-6">
            <div>
              <p className="text-2xl font-bold text-yellow-400">{users.length}</p>
              <p className="text-purple-300">Active Guardians</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">
                {users.reduce((sum, p) => sum + p.realBalance, 0).toLocaleString()}
              </p>
              <p className="text-purple-300">Total XP Earned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">
                {Math.round(
                  users.reduce((sum, p) => sum + p.realBalance, 0) / users.length || 0
                )}
              </p>
              <p className="text-purple-300">Average XP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
