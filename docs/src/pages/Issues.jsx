import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle } from "lucide-react";
import axios from "axios";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
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
      const response = await axios.get("https://civic-guard-3tds.onrender.com/api/auth/me", {
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
        const res = await fetch("https://civic-guard-3tds.onrender.com/api/issues", {
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
    filter === "All" ? issues : issues.filter((issue) => issue.status === filter);

  // Update status for admin
  const updateStatus = async (id, newStatus) => {
    const token = storedUser?.token;
    if (!token) return console.error("❌ No token found");

    let url = "";
    if (newStatus === "Verified")
      url = `https://civic-guard-3tds.onrender.com/api/issues/verify/${id}`;
    else if (newStatus === "Resolved")
      url = `https://civic-guard-3tds.onrender.com/api/issues/resolve/${id}`;
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

  // Badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return "bg-purple-600 text-white";
      case "Resolved":
        return "bg-emerald-600 text-white";
      case "Pending":
        return "bg-red-700 text-white animate-pulse";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background  p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
          All Reported Issues
        </h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 border-0  rounded-lg bg-card text-foreground shadow-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 font-medium mb-4">{error}</p>
      )}

      {/* Issues Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-muted-foreground text-lg">Loading issues...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No issues found for the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <Card
              key={issue._id}
              className="bg-card border-1 border-blue-600 rounded-xl overflow-hidden shadow-md hover:shadow-glow transition-all duration-300 group"
            >
              {/* Image */}
              {issue.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={issue.imageUrl}
                    alt={`${issue.type} issue`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold capitalize">
                    {issue.type}
                  </h3>
                  <Badge className={getStatusColor(issue.status)}>
                    {issue.status === "Resolved" && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {issue.status}
                  </Badge>
                </div>

                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span className="text-sm">
                    {issue.location?.address || "Location not provided"}
                  </span>
                </div>

                <p className="text-sm text-foreground">{issue.description}</p>

                {/* Admin Buttons */}
                {isAdmin && issue.status !== "Resolved" && (
                  <div className="flex gap-2">
                    {issue.status !== "Verified" && (
                      <Button
                        onClick={() => updateStatus(issue._id, "Verified")}
                        className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Verify
                      </Button>
                    )}
                    <Button
                      onClick={() => updateStatus(issue._id, "Resolved")}
                      className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Resolve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ➕ Add New Issue Button */}
      <Link
        to="/report"
        className="fixed bottom-4 right-6 bg-primary text-primary-foreground 
                   text-3xl rounded-full w-14 h-14 flex items-center justify-center 
                   shadow-lg hover:rotate-90 hover:scale-110 transition-transform duration-300"
        title="Report New Issue"
      ><div className="top-1">+</div>
      </Link>
    </div>
  );
};

export default Issues;
