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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 
                         bg-clip-text text-transparent [text-shadow:_0_0_10px_rgba(168,85,247,0.8),_0_0_20px_rgba(236,72,153,0.6)]">
              Civic Complaints Dashboard
            </h1>
            <p className="text-muted-foreground">Monitor and track municipal complaints across the city</p>
          </div>
          <button className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Download size={18} /> Export Data
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard title="Total Complaints" value={metrics.total} icon={FileText} description="Active complaints in system" />
          <KPICard title="Resolved" value={metrics.resolved} icon={CheckCircle} variant="success" description="Successfully resolved" />
          <KPICard title="Verified" value={metrics.verified} icon={Shield} variant="default" description="Verified by authorities" />
          <KPICard title="Pending" value={metrics.pending} icon={AlertTriangle} variant="warning" description="Awaiting action" />
        </div>

        {/* Filters */}
        <div className="bg-opacity-10 bg-slate-500 border-white border-[1px] rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Filter size={20} className="text-purple-600" />
            <h2 className="text-lg font-semibold">Filter Complaints</h2>
            {selectedMapRegion && (
              <span className="ml-auto bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                <MapPin size={16} />
                Viewing: {selectedMapRegion}
                <button 
                  onClick={() => handleMapRegionSelect(null)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm pb-1 font-medium mb-1">Region Type</label>
              <select
                className="w-full p-2 border rounded-md"
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
              <label className="block text-sm pb-1 font-medium mb-1">Region Name</label>
              <select
                className="w-full p-2 border rounded-md"
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
              <label className="block text-sm pb-1 font-medium mb-1">Issue Type</label>
              <select
                className="w-full p-2 border rounded-md"
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
              <label className="block text-sm pb-1 font-medium mb-1">Status</label>
              <select
                className="w-full p-2 border rounded-md"
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
        <div className="grid md:grid-cols-2 gap-4">
          <CivicMap 
            issues={issues} 
            selectedRegion={selectedMapRegion} 
            onRegionSelect={handleMapRegionSelect} 
          />

          <div className="rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Complaints</h2>
              <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
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
    </div>
  );
};

export default Dashboard;
