import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip, CircleMarker } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Mock GeoJSON data for Mumbai areas
const MUMBAI_AREAS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Borivali", area: "Borivali" },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.84, 19.22], [72.85, 19.22], [72.85, 19.23], [72.84, 19.23], [72.84, 19.22]]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Andheri", area: "Andheri" },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.83, 19.11], [72.84, 19.11], [72.84, 19.12], [72.83, 19.12], [72.83, 19.11]]]
      }
    }
  ]
};

// Color scale for complaint density
const getAreaColor = (count) => {
  if (count >= 10) return "#dc2626"; // Red
  if (count >= 5) return "#f59e0b";  // Orange
  if (count >= 1) return "#2563eb";  // Blue
  return "#e5e7eb";                  // Gray
};

// Opacity scale based on number of complaints
const getOpacity = (count) => {
  if (count >= 10) return 0.9;
  if (count >= 5) return 0.7;
  if (count >= 1) return 0.5;
  return 0.3;
};

// Coordinates for areas without GeoJSON
const getAreaCoordinates = (areaName) => {
  const coords = {
    "Borivali": [19.2307, 72.8567],
    "Magathane": [19.2314, 72.8612],
    "Magathane Metro": [19.2314, 72.8612],
    "Tata Power": [19.2320, 72.8600],
    "Andheri": [19.1197, 72.8464],
    "Bandra": [19.0544, 72.8403],
    "Mumbai": [19.0760, 72.8777],
    "Unknown": [19.0760, 72.8777]
  };
  return coords[areaName] || coords["Unknown"];
};

const CivicMap = ({ issues = [], onRegionSelect, selectedRegion }) => {
  const [hoveredArea, setHoveredArea] = useState();
  const [loading, setLoading] = useState(false);

  // Aggregate complaints by area
  const areaComplaints = useMemo(() => {
    const data = {};
    issues.forEach(issue => {
      if (!issue.location) return;
      const area = issue.location.area || "Unknown";
      data[area] = (data[area] || 0) + 1;
    });
    return data;
  }, [issues]);

  // Style function for GeoJSON areas
  const areaStyle = (feature) => {
    const areaName = feature.properties.area;
    const count = areaComplaints[areaName] || 0;
    const isSelected = selectedRegion === areaName;
    const isHovered = hoveredArea === areaName;

    return {
      fillColor: getAreaColor(count),
      fillOpacity: isHovered || isSelected ? 1 : getOpacity(count),
      color: isSelected || isHovered ? "#000" : "#666",
      weight: isSelected || isHovered ? 3 : 1,
    };
  };

  // Event handlers
  const onEachArea = (feature, layer) => {
    const areaName = feature.properties.area;

    layer.on({
      mouseover: (e) => setHoveredArea(areaName),
      mouseout: (e) => setHoveredArea(undefined),
      click: () => onRegionSelect && onRegionSelect(selectedRegion === areaName ? undefined : areaName),
    });

    const count = areaComplaints[areaName] || 0;
    layer.bindTooltip(`${areaName}: ${count} complaint${count !== 1 ? "s" : ""}`, {
      sticky: true
    });
  };

  // Areas without GeoJSON
  const fallbackAreas = useMemo(() => {
    const geoAreas = new Set(MUMBAI_AREAS_GEOJSON.features.map(f => f.properties.area));
    return Object.entries(areaComplaints)
      .filter(([area]) => !geoAreas.has(area))
      .map(([area, count]) => ({ area, count, coordinates: getAreaCoordinates(area) }));
  }, [areaComplaints]);

  if (loading) {
    return (
      <Card className="h-[500px] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading map data...</p>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] w-full">
      <CardHeader className="pb-3">
        <CardTitle>Complaint Distribution by Area</CardTitle>
        <div className="text-sm text-muted-foreground">{Object.keys(areaComplaints).length} areas with complaints</div>
      </CardHeader>
      <CardContent className="h-full p-0">
        <MapContainer center={[19.0760, 72.8777]} zoom={11} scrollWheelZoom className="h-full w-full rounded-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* GeoJSON areas */}
          <GeoJSON data={MUMBAI_AREAS_GEOJSON} style={areaStyle} onEachFeature={onEachArea} />

          {/* Fallback CircleMarkers */}
          {fallbackAreas.map(({ area, count, coordinates }) => {
            const isSelected = selectedRegion === area;
            const isHovered = hoveredArea === area;
            return (
              <CircleMarker
                key={area}
                center={coordinates}
                radius={8 + Math.log(count + 1) * 2}
                color={isSelected || isHovered ? "#000" : getAreaColor(count)}
                fillColor={getAreaColor(count)}
                fillOpacity={isSelected || isHovered ? 1 : getOpacity(count)}
                weight={isSelected || isHovered ? 3 : 1}
                eventHandlers={{
                  click: () => onRegionSelect && onRegionSelect(selectedRegion === area ? undefined : area),
                  mouseover: () => setHoveredArea(area),
                  mouseout: () => setHoveredArea(undefined),
                }}
              >
                <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={isHovered || isSelected}>
                  <div className="text-xs font-semibold">{area}: {count} complaint{count !== 1 ? "s" : ""}</div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default CivicMap;
