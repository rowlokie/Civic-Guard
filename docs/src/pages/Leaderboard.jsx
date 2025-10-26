import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("https://civic-guard-3tds.onrender.com/api/leaderboard");
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
      <div className="min-h-screen flex justify-center items-center text-purple-300">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-8">
        UrbanCoin Leaderboard
      </h1>

      <div className="space-y-4">
        {users.map((player, index) => (
          <div
            key={player._id}
            className={`relative bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-102 ${
              index < 3
                ? 'border-yellow-500/80 shadow-2xl shadow-yellow-500/30'
                : player.name === 'You'
                ? 'border-purple-500/80 shadow-xl shadow-purple-500/30'
                : 'border-purple-500/30'
            }`}
          >
            {index < 3 && (
              <div className="absolute -top-3 -right-3">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-purple-300 w-8">#{index + 1}</div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <img
                    src={player.avatar || "/default-avatar.png"}
                    alt={`${player.name} avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{player.name}</h3>
                  <p className="text-sm text-purple-300">{player.email}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">
                  {player.realBalance.toLocaleString()} Coins
                </div>
                <div className="text-sm text-purple-300">UrbanCoin</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats footer */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-lg border border-purple-500/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
              {users.length}
            </p>
            <p className="text-purple-300">Active Players</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">
              {users.reduce((sum, p) => sum + p.realBalance, 0).toLocaleString()}
            </p>
            <p className="text-purple-300">Total Coins</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300">
              {Math.round(
                users.reduce((sum, p) => sum + p.realBalance, 0) / users.length || 0
              ).toLocaleString()}
            </p>
            <p className="text-purple-300">Average Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;