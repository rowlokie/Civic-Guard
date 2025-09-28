// utils/locationParser.js
export const parseLocation = (locationStr) => {
  if (!locationStr) return { address: '' };
  
  const parts = locationStr.split(',').map(part => part.trim());
  const result = { address: locationStr };
  
  // Simple heuristic-based parsing
  if (parts.length > 0) result.street = parts[0];
  if (parts.length > 1) result.area = parts[1];
  if (parts.length > 2) result.landmark = parts[2];
  if (parts.length > 3) result.suburb = parts[3];
  if (parts.length > 4) result.city = parts[4];
  
  // If we don't have enough parts, try to identify city from known cities
  if (!result.city) {
    const knownCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
    for (const part of parts) {
      if (knownCities.includes(part)) {
        result.city = part;
        break;
      }
    }
  }
  
  return result;
};