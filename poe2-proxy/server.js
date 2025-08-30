const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const POE2_API_URL = "https://poe.ninja/api/data/builds?game=poe2";

const response = await fetch("https://poe.ninja/api/data/builds?game=poe2", {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
  }
});

app.get("/poe2-leagues", async (req, res) => {
  try {
    const response = await fetch(POE2_API_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching PoE2 Ninja API:", error);
    res.status(500).json({ error: "Failed to fetch PoE2 Ninja data" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Proxy running at http://localhost:${PORT}`));
