import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, User, ImageIcon } from "lucide-react";

const statusColors = {
  Pending: "warning",
  Resolved: "success", 
  Verified: "default"
};

const typeColors = {
  pothole: "destructive",
  sewage: "warning",
  drains: "default",
  garbage: "accent",
  "Broken Infrastructure": "outline",
  Other: "secondary"
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
    <Card className="h-[400px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Complaints {selectedRegion && `in ${selectedRegion}`}</span>
          <Badge variant="secondary" className="ml-2">{complaints.length}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="h-full overflow-y-auto space-y-3">
        {complaints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No complaints found for the selected filters.</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="border border-border rounded-lg p-3 space-y-2 hover:shadow-md transition-shadow bg-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={typeColors[complaint.type] || "default"}>
                    {complaint.type}
                  </Badge>
                  <Badge variant={statusColors[complaint.status] || "secondary"}>
                    {complaint.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  #{complaint._id?.slice(-6) || 'N/A'}
                </span>
              </div>

              <p className="text-sm text-foreground line-clamp-2">
                {complaint.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">
                    {getLocationDisplay(complaint.location)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="max-w-[100px] truncate">
                    {complaint.reportedBy?.name || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {complaint.createdAt ? formatDate(complaint.createdAt) : 'Unknown date'}
                </div>
              </div>

              {/* Display image if available */}
              {complaint.imageUrl && (
                <div className="mt-2">
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint"
                    className="w-full h-32 object-cover rounded-md border border-gray-200"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintsList;
