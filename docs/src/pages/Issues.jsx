import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Trash2 } from "lucide-react"; // added Trash2 icon
import axios from "axios";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // Fetch user profile
  const fetchUserProfile = async () => {
    const token = storedUser?.token;
    if (!token) {
      setTimeout(() => navigate("/login"), 1500);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://civic-guard-production.up.railway.app/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch user profile.");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch all issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch("https://civic-guard-production.up.railway.app/api/issues", {
          mode: "cors",
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setIssues(data || []);
      } catch (err) {
        console.error("❌ Failed to fetch issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Filter issues
  const filteredIssues =
    selectedFilter === "All" ? issues : issues.filter((issue) => issue.status === selectedFilter);

  // Update status (verify / resolve)
  const updateStatus = async (id, newStatus) => {
    const token = storedUser?.token;
    if (!token) return console.error("❌ No token found");

    let url = "";
    if (newStatus === "Verified")
      url = `https://civic-guard-production.up.railway.app/api/issues/verify/${id}`;
    else if (newStatus === "Resolved")
      url = `https://civic-guard-production.up.railway.app/api/issues/resolve/${id}`;
    else return console.error("❌ Unsupported status:", newStatus);

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setIssues((prev) =>
        prev.map((issue) => (issue._id === updated._id ? updated : issue))
      );
    } catch (err) {
      console.error("Error updating issue:", err);
    }
  };

  // 🗑️ Delete issue (only if Pending)
  const deleteIssue = async (id) => {
    const token = storedUser?.token;
    if (!token) return alert("Unauthorized");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this issue? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://civic-guard-production.up.railway.app/api/issues/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete issue");

      // Remove from local list
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
      alert("Issue deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting issue:", err);
      alert("Failed to delete issue. Try again later.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
          All Reported Issues
        </h1>

        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg text-white border-2 border-purple-500/50 rounded-xl px-6 py-3 pr-12 font-medium focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Resolved">Resolved</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-purple-300">
            ▼
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-center text-red-400 font-medium mb-4">{error}</p>
      )}

      {/* Issues Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2" />
          <p className="text-purple-300 text-lg">Loading issues...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-purple-300 text-lg">
            No issues found for the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue._id}
              className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              {/* Image */}
              {issue.imageUrl && (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={issue.imageUrl}
                    alt={issue.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        issue.status === "Resolved"
                          ? "bg-green-600 text-white"
                          : issue.status === "Verified"
                          ? "bg-purple-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {issue.status === "Resolved" && "✓ "}
                      {issue.status}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-3 capitalize">
                  {issue.type}
                </h3>

                <div className="flex items-start space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-purple-300 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-purple-200 line-clamp-2">
                    {issue.location?.address || "Location not provided"}
                  </p>
                </div>

                <p className="text-sm text-purple-300 mb-4">
                  {issue.description}
                </p>

                {/* Admin Buttons */}
                {isAdmin && (
                  <div className="flex gap-2">
                    {issue.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(issue._id, "Verified")}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Verify
                        </button>
                        {/* 🗑️ Delete button visible only if Pending */}
                        <button
                          onClick={() => deleteIssue(issue._id)}
                          className="flex items-center justify-center bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Trash2 size={18} className="mr-1" /> Delete
                        </button>
                      </>
                    )}

                    {issue.status === "Verified" && (
                      <button
                        onClick={() => updateStatus(issue._id, "Resolved")}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Issue Button */}
      <Link
        to="/report"
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center text-3xl font-bold transition-all duration-300 hover:scale-110"
      >
        +
      </Link>
    </div>
  );
};

export default Issues;
