import React from "react";
import { CalendarDays, MapPin, User, ImageIcon } from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-600 text-white",
  Resolved: "bg-green-600 text-white", 
  Verified: "bg-purple-600 text-white"
};

const typeColors = {
  pothole: "bg-red-600 text-white",
  sewage: "bg-orange-600 text-white",
  drains: "bg-blue-600 text-white",
  garbage: "bg-amber-600 text-white",
  "Broken Infrastructure": "bg-cyan-600 text-white",
  Other: "bg-gray-600 text-white"
};

export const ComplaintsList = ({ complaints, selectedRegion }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getLocationDisplay = (location) => {
    if (!location) return "Unknown location";
    if (typeof location === 'string') return location;
    return location.address || `${location.area}, ${location.city}`;
  };

  return (
    <div className="h-[400px] w-full bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          Complaints {selectedRegion && `in ${selectedRegion}`}
        </h3>
        <span className="bg-purple-600/30 text-purple-300 text-sm px-3 py-1 rounded-full border border-purple-500/50">
          {complaints.length} items
        </span>
      </div>

      <div className="h-[calc(100%-3rem)] overflow-y-auto space-y-4 pr-2">
        {complaints.length === 0 ? (
          <div className="text-center py-8 text-purple-300">
            <p>No complaints found for the selected filters.</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-gradient-to-br from-purple-800/40 to-blue-800/40 backdrop-blur-lg rounded-xl border-2 border-purple-500/30 p-4 space-y-3 hover:border-purple-500 transition-all duration-300 hover:scale-102 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${typeColors[complaint.type] || "bg-gray-600 text-white"}`}>
                    {complaint.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[complaint.status] || "bg-gray-600 text-white"}`}>
                    {complaint.status}
                  </span>
                </div>
                <span className="text-xs text-purple-300 whitespace-nowrap bg-purple-900/30 px-2 py-1 rounded-full">
                  #{complaint._id?.slice(-6) || 'N/A'}
                </span>
              </div>

              <p className="text-sm text-white line-clamp-2">
                {complaint.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-purple-300 flex-wrap">
                <div className="flex items-center gap-1 bg-purple-900/30 px-2 py-1 rounded-full">
                  <MapPin className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">
                    {getLocationDisplay(complaint.location)}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-purple-900/30 px-2 py-1 rounded-full">
                  <User className="h-3 w-3" />
                  <span className="max-w-[100px] truncate">
                    {complaint.reportedBy?.name || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-purple-900/30 px-2 py-1 rounded-full">
                  <CalendarDays className="h-3 w-3" />
                  {complaint.createdAt ? formatDate(complaint.createdAt) : 'Unknown date'}
                </div>
              </div>

              {/* Display image if available */}
              {complaint.imageUrl && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 text-purple-300 text-xs mb-1">
                    <ImageIcon className="h-3 w-3" />
                    <span>Issue Image</span>
                  </div>
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint"
                    className="w-full h-32 object-cover rounded-lg border-2 border-purple-500/30 shadow-lg"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Custom scrollbar styling */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(168, 85, 247, 0.1);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ComplaintsList;