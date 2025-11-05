import React, { useEffect, useState, useCallback } from 'react';
import {
  Crown,
  Trophy,
  Star,
  Target,
  Activity,
  Zap,
  Award,
  Calendar,
  Clock,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import UrbanCoinABI from '../abi/UrbanCoinABI.json';

const TOKEN_ADDRESS = "0x348a6101297a3E414144D35f7484FB21EcCD3E4E";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [realBalance, setRealBalance] = useState('0');

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    const storedUserRaw = localStorage.getItem('user');
    const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

    if (!storedUser?.token) {
      setError('Not authenticated. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://civic-guard-production.up.railway.app/api/auth/me', {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err?.response?.data?.error || 'Failed to fetch user profile.');
      setTimeout(() => navigate('/login'), 1200);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch ERC20 token balance
  const fetchTokenBalance = useCallback(async (walletAddress) => {
    if (!walletAddress) {
      setRealBalance('🔗 No wallet linked');
      return;
    }

    if (!window.ethereum) {
      setRealBalance('❌ Wallet not detected');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const contract = new ethers.Contract(TOKEN_ADDRESS, UrbanCoinABI, provider);
      const rawBalance = await contract.balanceOf(walletAddress);
      let decimals = 18;
      try { decimals = await contract.decimals(); } catch {}
      const formatted = ethers.utils.formatUnits(rawBalance, decimals);
      setRealBalance(formatted);
    } catch (err) {
      console.error('Error fetching token balance:', err);
      setRealBalance('Error');
    }
  }, []);

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      setUser(prev => ({ ...prev, walletAddress }));
      fetchTokenBalance(walletAddress);

      // Optionally update wallet on backend
      const storedUserRaw = localStorage.getItem('user');
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
      if (storedUser?.token) {
        await axios.post('https://civic-guard-production.up.railway.app/api/auth/update-wallet', { walletAddress }, {
          headers: { Authorization: `Bearer ${storedUser.token}` }
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet");
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setUser(prev => ({ ...prev, walletAddress: accounts[0] }));
          fetchTokenBalance(accounts[0]);
        } else {
          setUser(prev => ({ ...prev, walletAddress: null }));
          setRealBalance('No wallet connected');
        }
      });
    }
  }, [fetchTokenBalance]);

  useEffect(() => { fetchUserProfile(); }, [fetchUserProfile]);
  useEffect(() => { if (user?.walletAddress) fetchTokenBalance(user.walletAddress); }, [user, fetchTokenBalance]);

  if (loading) return <div className="p-4 text-center">⏳ Loading profile...</div>;
  if (error) return <div className="p-4 text-red-600 text-center">{error}</div>;

  // === UI Components ===
  const ProfileCard = ({ name, email, role, level }) => (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-800 rounded-2xl p-9 shadow-lg text-white">
      <div className="flex items-center gap-4 mb-6 ">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-purple-200">{email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-purple-700 text-xs px-2 py-1 rounded-full">{role}</span>
            <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">Level {level}</span>
          </div>
        </div>
      </div>
      {!user.walletAddress && (
        <button
          onClick={connectWallet}
          className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );

  const LevelProgress = ({ currentLevel, currentXP, xpToNextLevel, totalXP }) => {
    const progress = (currentXP / xpToNextLevel) * 100;
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" /> Level Progress
        </h3>
        <div className="mb-2 flex justify-between text-sm">
          <span>Current Level</span>
          <span className="font-bold">{currentXP} XP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400 mb-6">
          <span>{xpToNextLevel - currentXP} XP to Level {currentLevel + 1}</span>
          <span>Total XP: {totalXP.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  const CoinDisplay = ({ balance, walletAddress }) => (
    <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 shadow-lg text-white">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="bg-yellow-500 p-1 rounded-full">
          <Zap className="w-4 h-4 text-white" />
        </div>
        Wallet Balance
      </h3>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold">{balance}</span>
        <span className="text-lg font-semibold text-yellow-200">COINS</span>
      </div>
      <div className="text-xs text-yellow-200/70 break-all">{walletAddress || 'No wallet connected'}</div>
    </div>
  );

  const StatsGrid = () => {
    const stats = [
      { label: 'Games Played', value: '127', icon: <Activity className="w-5 h-5" /> },
      { label: 'Win Rate', value: '68%', icon: <Trophy className="w-5 h-5" /> },
      { label: 'Accuracy', value: '82%', icon: <Target className="w-5 h-5" /> },
    ];
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-white">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" /> Performance Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-400">{stat.icon}</div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AchievementGrid = () => {
    const achievements = [
      { title: 'First Blood', description: 'Complete your first task', icon: <Award className="w-6 h-6" />, earned: true },
      { title: 'Consistency', description: 'Login for 7 consecutive days', icon: <Calendar className="w-6 h-6" />, earned: true },
      { title: 'Speed Runner', description: 'Complete a task in under 5 minutes', icon: <Clock className="w-6 h-6" />, earned: true },
      { title: 'Master Collector', description: 'Earn 1000 coins', icon: <Crown className="w-6 h-6" />, earned: false },
    ];
    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-white">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" /> Achievements 
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${a.earned ? 'bg-gradient-to-br from-green-900/30 to-blue-900/30 border-gray-700' : 'bg-gray-900/50 border-gray-700  opacity-60'}`}
            >
              <div className={`p-2 rounded-full w-12 h-12 flex items-center justify-center mb-3 ${a.earned ? 'bg-yellow-500' : 'bg-gray-700'}`}>
                <div className={a.earned ? 'text-white' : 'text-gray-500'}>{a.icon}</div>
              </div>
              <h4 className="font-semibold">{a.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RecentActivity = () => {
    const activities = [
      { action: 'Completed', task: 'Neighborhood Cleanup', time: '2 hours ago', coins: 25 },
      { action: 'Earned', task: 'Daily Login Bonus', time: '5 hours ago', coins: 10 },
      { action: 'Completed', task: 'Park Restoration', time: '1 day ago', coins: 40 },
    ];

    const logout = () => {
  localStorage.removeItem('user'); // Clear saved token
  navigate('/login');               // Redirect to login page
};

    return (
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-white">
      
        <div className="mt-4 flex gap-4">
  {!user.walletAddress && (
    <button
      onClick={connectWallet}
      className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  )}
  <button
    onClick={logout}
    className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
  >
    Logout
  </button>
</div>


        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" /> Recent Activity
        </h3>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-1 w-2 h-2 rounded-full ${a.coins > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{a.action}: {a.task}</span>
                  <span className={a.coins > 0 ? 'text-green-300' : 'text-red-300'}>
                    {a.coins > 0 ? '+' : ''}{a.coins} coins
                  </span>
                </div>
                <p className="text-xs text-gray-400">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 pb-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 pt-8">
            <ProfileCard
              name={user.name}
              email={user.email}
              role={user.role}
              level={user.level || 1}
            />
          </div>
          <div className="pt-8">
            <LevelProgress
              currentLevel={user.level || 1}
              currentXP={user.currentXP || 400}
              xpToNextLevel={user.xpToNextLevel || 1000}
              totalXP={user.totalXP || 0}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <CoinDisplay balance={realBalance ?? 0} walletAddress={user.walletAddress} />
          <div className="lg:col-span-3">
            <StatsGrid />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AchievementGrid />
          </div>
          <div>
            <RecentActivity />
            
          </div>

          
        </div>
        
      </div>
      
    </div>
  );
};

export default ProfilePage;
