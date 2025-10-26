import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { KPICard } from "./dashboardcomp/KPICard";
import { ComplaintsList } from "./dashboardcomp/ComplaintsLists";
import CivicMap from "./dashboardcomp/CivicMap";
import { AlertTriangle, CheckCircle, Shield, FileText, MapPin, Filter, Download } from "lucide-react";

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [regions, setRegions] = useState({ cities: [], areas: [], suburbs: [], streets: [] });
  const [filters, setFilters] = useState({
    regionType: "all",
    regionName: "all",
    type: "all",
    status: "all"
  });
  const [selectedMapRegion, setSelectedMapRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://civic-guard-3tds.onrender.com";

  // Fetch issues and regions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [issuesRes, regionsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/issues`),
          axios.get(`${BACKEND_URL}/api/issues/regions`)
        ]);

        setIssues(Array.isArray(issuesRes.data) ? issuesRes.data : []);
        setRegions(regionsRes.data || { cities: [], areas: [], suburbs: [], streets: [] });
      } catch (err) {
        console.error("Error fetching data:", err);
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [BACKEND_URL]);

  // Apply filters
  const applyFilters = async (newFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (newFilters.regionType !== "all" && newFilters.regionName !== "all") {
        params.append("regionType", newFilters.regionType);
        params.append("regionName", newFilters.regionName);
      }
      if (newFilters.type !== "all") params.append("type", newFilters.type);
      if (newFilters.status !== "all") params.append("status", newFilters.status);

      const res = await axios.get(`${BACKEND_URL}/api/issues?${params}`);
      setIssues(Array.isArray(res.data) ? res.data : []);
      setFilters(newFilters);
      setSelectedMapRegion(null);
    } catch (err) {
      console.error("Error applying filters:", err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  // Map region selection
  const handleMapRegionSelect = (regionName) => {
    setSelectedMapRegion(regionName);
    if (regionName) {
      applyFilters({ ...filters, regionType: "area", regionName });
    } else {
      applyFilters({ ...filters, regionType: "all", regionName: "all" });
    }
  };

  // Get region options for select
  const getRegionOptions = () => {
    switch (filters.regionType) {
      case "city": return regions.cities;
      case "area": return regions.areas;
      case "suburb": return regions.suburbs;
      case "street": return regions.streets;
      default: return [];
    }
  };

  // Safe metrics calculation
  const metrics = useMemo(() => {
    const arr = Array.isArray(issues) ? issues : [];
    const total = arr.length;
    const resolved = arr.filter(c => c.status === "Resolved").length;
    const verified = arr.filter(c => c.status === "Verified").length;
    const pending = arr.filter(c => c.status === "Pending").length;
    return { total, resolved, verified, pending };
  }, [issues]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Twinkling Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
              Civic Complaints Dashboard
            </h1>
            <p className="text-purple-300 mt-2">Monitor and track municipal complaints across the city</p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
            <Download size={18} /> Export Data
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Complaints</p>
                <p className="text-3xl font-bold text-white mt-2">{metrics.total}</p>
                <p className="text-purple-300 text-xs mt-1">Active complaints in system</p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold text-white mt-2">{metrics.resolved}</p>
                <p className="text-purple-300 text-xs mt-1">Successfully resolved</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Verified</p>
                <p className="text-3xl font-bold text-white mt-2">{metrics.verified}</p>
                <p className="text-purple-300 text-xs mt-1">Verified by authorities</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-white mt-2">{metrics.pending}</p>
                <p className="text-purple-300 text-xs mt-1">Awaiting action</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-purple-300" />
            <h2 className="text-xl font-bold text-white">Filter Complaints</h2>
            {selectedMapRegion && (
              <span className="ml-auto bg-purple-600/30 text-purple-300 text-sm px-3 py-2 rounded-full flex items-center gap-2 border border-purple-500/50">
                <MapPin size={16} />
                Viewing: {selectedMapRegion}
                <button 
                  onClick={() => handleMapRegionSelect(null)}
                  className="text-purple-300 hover:text-white ml-2"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-purple-300 text-sm font-medium mb-2">Region Type</label>
              <select
                className="w-full bg-gradient-to-br from-purple-800/40 to-blue-800/40 backdrop-blur-lg text-white border-2 border-purple-500/50 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                value={filters.regionType}
                onChange={(e) => applyFilters({ ...filters, regionType: e.target.value, regionName: "all" })}
              >
                <option value="all">All Regions</option>
                <option value="city">City</option>
                <option value="area">Area</option>
                <option value="suburb">Suburb</option>
                <option value="street">Street</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-medium mb-2">Region Name</label>
              <select
                className="w-full bg-gradient-to-br from-purple-800/40 to-blue-800/40 backdrop-blur-lg text-white border-2 border-purple-500/50 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-purple-500 appearance-none cursor-pointer disabled:opacity-50"
                value={filters.regionName}
                onChange={(e) => applyFilters({ ...filters, regionName: e.target.value })}
                disabled={filters.regionType === "all"}
              >
                <option value="all">All</option>
                {getRegionOptions().map((region, idx) => (
                  <option key={region || idx} value={region}>{region || "Unknown"}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-purple-300 text-sm font-medium mb-2">Issue Type</label>
              <select
                className="w-full bg-gradient-to-br from-purple-800/40 to-blue-800/40 backdrop-blur-lg text-white border-2 border-purple-500/50 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                value={filters.type}
                onChange={(e) => applyFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="pothole">Potholes</option>
                <option value="sewage">Sewage</option>
                <option value="drains">Drains</option>
                <option value="garbage">Garbage</option>
                <option value="Broken Infrastructure">Broken Infrastructure</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div> 
              <label className="block text-purple-300 text-sm font-medium mb-2">Status</label>
              <select
                className="w-full bg-gradient-to-br from-purple-800/40 to-blue-800/40 backdrop-blur-lg text-white border-2 border-purple-500/50 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
                value={filters.status}
                onChange={(e) => applyFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid - Map + Complaints */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl">
            <CivicMap 
              issues={issues} 
              selectedRegion={selectedMapRegion} 
              onRegionSelect={handleMapRegionSelect} 
            />
          </div>

          <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Complaints</h2>
              <span className="bg-purple-600/30 text-purple-300 text-sm px-3 py-1 rounded-full border border-purple-500/50">
                {issues.length} items
              </span>
            </div>
            <ComplaintsList
              complaints={issues}
              selectedRegion={filters.regionName !== "all" ? filters.regionName : null}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;