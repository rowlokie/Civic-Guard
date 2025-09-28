import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, MapPin, Navigation } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const typeFilterOptions = [
  { value: "all", label: "All Types", variant: "secondary" },
  { value: "pothole", label: "Potholes", variant: "destructive" },
  { value: "garbage", label: "Garbage", variant: "warning" },
  { value: "sewage", label: "Sewage", variant: "default" },
  { value: "drains", label: "Drains", variant: "accent" },
  { value: "Broken Infrastructure", label: "Infrastructure", variant: "outline" },
  { value: "Other", label: "Other", variant: "secondary" }
];

const statusFilterOptions = [
  { value: "all", label: "All Statuses", variant: "secondary" },
  { value: "Pending", label: "Pending", variant: "warning" },
  { value: "Verified", label: "Verified", variant: "default" },
  { value: "Resolved", label: "Resolved", variant: "success" }
];

export const ComplaintFilter = ({ 
  selectedType, 
  selectedStatus,
  selectedRegionType,
  selectedRegionName,
  onTypeChange, 
  onStatusChange,
  onRegionTypeChange,
  onRegionNameChange,
  counts,
  regions 
}) => {
  const [availableRegions, setAvailableRegions] = useState([]);

  // Update available regions when region type changes
  useEffect(() => {
    if (regions && selectedRegionType) {
      const regionData = regions[`${selectedRegionType}s`] || [];
      setAvailableRegions(regionData.filter(region => region && region.trim() !== ''));
    }
  }, [regions, selectedRegionType]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Filter size={20} />
          Filter Complaints
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Issue Type Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Issue Type</h3>
          <div className="flex flex-wrap gap-2">
            {typeFilterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedType === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange(option.value)}
                className="relative h-8"
              >
                {option.label}
                <Badge 
                  variant="secondary" 
                  className="ml-2 text-xs h-4 min-w-[20px]"
                >
                  {counts[option.value] || 0}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusFilterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedStatus === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(option.value)}
                className="h-8"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Region Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin size={16} />
            Region Filter
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Region Type Selector */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Region Type</label>
              <Select value={selectedRegionType} onValueChange={onRegionTypeChange}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="suburb">Suburb</SelectItem>
                  <SelectItem value="street">Street</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Name Selector */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Region Name</label>
              <Select 
                value={selectedRegionName} 
                onValueChange={onRegionNameChange}
                disabled={selectedRegionType === "all"}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {selectedRegionType}s</SelectItem>
                  {availableRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedType !== "all" || selectedStatus !== "all" || selectedRegionType !== "all") && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="text-xs font-medium mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedType !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Type: {typeFilterOptions.find(o => o.value === selectedType)?.label}
                </Badge>
              )}
              {selectedStatus !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Status: {statusFilterOptions.find(o => o.value === selectedStatus)?.label}
                </Badge>
              )}
              {selectedRegionType !== "all" && selectedRegionName !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {selectedRegionType}: {selectedRegionName}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintFilter;