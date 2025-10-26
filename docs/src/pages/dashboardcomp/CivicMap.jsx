import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip, CircleMarker } from "react-leaflet";
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

// Color scale for complaint density - updated to purple theme
const getAreaColor = (count) => {
  if (count >= 10) return "#dc2626"; // Red for high density
  if (count >= 5) return "#f59e0b";  // Orange for medium density
  if (count >= 1) return "#8b5cf6";  // Purple for low density
  return "#4c1d95";                  // Dark purple for no complaints
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
      color: isSelected || isHovered ? "#ffffff" : "#c084fc",
      weight: isSelected || isHovered ? 4 : 2,
      opacity: isSelected || isHovered ? 1 : 0.8,
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
    layer.bindTooltip(
      `<div class="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg text-white px-3 py-2 rounded-lg border border-purple-500/50 shadow-lg">
         <strong>${areaName}</strong><br>
         ${count} complaint${count !== 1 ? "s" : ""}
       </div>`,
      { sticky: true, className: "custom-tooltip" }
    );
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
      <div className="h-[500px] w-full bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-300" />
        <p className="text-purple-300 ml-3">Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg rounded-2xl border-2 border-purple-500/30 p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Complaint Distribution by Area</h3>
        <div className="text-purple-300 text-sm bg-purple-600/30 px-3 py-1 rounded-full border border-purple-500/50">
          {Object.keys(areaComplaints).length} areas with complaints
        </div>
      </div>
      
      <div className="h-[calc(100%-3rem)] w-full rounded-xl overflow-hidden border-2 border-purple-500/30">
        <MapContainer 
          center={[19.0760, 72.8777]} 
          zoom={11} 
          scrollWheelZoom 
          className="h-full w-full"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)' }}
        >
          {/* Dark theme tile layer */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* GeoJSON areas */}
          <GeoJSON data={MUMBAI_AREAS_GEOJSON} style={areaStyle} onEachFeature={onEachArea} />

          {/* Fallback CircleMarkers */}
          {fallbackAreas.map(({ area, count, coordinates }) => {
            const isSelected = selectedRegion === area;
            const isHovered = hoveredArea === area;
            const radius = 8 + Math.log(count + 1) * 2;
            
            return (
              <CircleMarker
                key={area}
                center={coordinates}
                radius={radius}
                color={isSelected || isHovered ? "#ffffff" : getAreaColor(count)}
                fillColor={getAreaColor(count)}
                fillOpacity={isSelected || isHovered ? 0.9 : getOpacity(count)}
                weight={isSelected || isHovered ? 3 : 2}
                opacity={isSelected || isHovered ? 1 : 0.8}
                eventHandlers={{
                  click: () => onRegionSelect && onRegionSelect(selectedRegion === area ? undefined : area),
                  mouseover: () => setHoveredArea(area),
                  mouseout: () => setHoveredArea(undefined),
                }}
              >
                <Tooltip 
                  direction="top" 
                  offset={[0, -10]} 
                  opacity={1} 
                  permanent={isHovered || isSelected}
                  className="custom-tooltip"
                >
                  <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg text-white px-3 py-2 rounded-lg border border-purple-500/50 shadow-lg text-xs font-semibold">
                    {area}: {count} complaint{count !== 1 ? "s" : ""}
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-purple-300">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#8b5cf6] rounded"></div>
          <span>1-4 complaints</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#f59e0b] rounded"></div>
          <span>5-9 complaints</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#dc2626] rounded"></div>
          <span>10+ complaints</span>
        </div>
      </div>

      <style>{`
        .custom-tooltip .leaflet-tooltip {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .leaflet-tooltip-top:before {
          border-top-color: rgba(168, 85, 247, 0.5);
        }
        .leaflet-tooltip-bottom:before {
          border-bottom-color: rgba(168, 85, 247, 0.5);
        }
        .leaflet-tooltip-left:before {
          border-left-color: rgba(168, 85, 247, 0.5);
        }
        .leaflet-tooltip-right:before {
          border-right-color: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CivicMap;