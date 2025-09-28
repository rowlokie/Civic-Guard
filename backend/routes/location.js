// routes/location.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/reverse", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  try {
    // Call OpenStreetMap Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "User-Agent": "CivicGuardApp/1.0", // Required by OSM
        },
      }
    );

    const data = await response.json();

    if (!data.address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({ address: data.address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

export default router;
