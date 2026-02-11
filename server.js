// 🔍 PROVE IT LINE — DO NOT REMOVE
console.log("🧠 RUNNING ROOT server.js:", __filename);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Job = require("./models/job");
const Accommodation = require("./models/accommodation");
const Community = require("./models/community");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS + JS) — NO CACHING
app.use(
  express.static(path.join(__dirname, "public"), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "no-store");
    },
  })
);

// ---------- DATABASE ----------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ---------- AUTH HELPERS ----------
function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ---------- AUTH ROUTES ----------
app.post("/api/auth/register", async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User(req.body);
    await user.save();

    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Invalid login" });

    const ok = await user.comparePassword(req.body.password);
    if (!ok) return res.status(401).json({ message: "Invalid login" });

    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- SAVE ITEMS ----------
app.post("/api/save-item", async (req, res) => {
  try {
    const { userId, itemId, type } = req.body;
    if (!userId || !itemId || !type) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let update = null;
    if (type === "job") update = { $addToSet: { savedJobs: itemId } };
    if (type === "acc") update = { $addToSet: { savedAcc: itemId } };
    if (type === "community")
      update = { $addToSet: { savedCommunities: itemId } };

    if (!update) return res.status(400).json({ message: "Invalid type" });

    await User.findByIdAndUpdate(userId, update);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Save failed" });
  }
});

app.get("/api/my-saved", async (req, res) => {
  try {
    const user = await User.findById(req.query.userId)
      .populate("savedJobs")
      .populate("savedAcc")
      .populate("savedCommunities");

    res.json({
      jobs: user?.savedJobs || [],
      acc: user?.savedAcc || [],
      communities: user?.savedCommunities || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

// ---------- DATA APIs ----------
app.get("/api/jobs", async (req, res) => res.json(await Job.find()));
app.get("/api/accommodation", async (req, res) =>
  res.json(await Accommodation.find())
);
app.get("/api/communities", async (req, res) =>
  res.json(await Community.find())
);

// ---------- HTML ROUTES ----------
const viewsPath = path.join(__dirname, "views");
console.log("📁 Serving views from:", viewsPath);

app.get("/", (req, res) => res.sendFile(path.join(viewsPath, "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(viewsPath, "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(viewsPath, "register.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(viewsPath, "dashboard.html")));
app.get("/jobs", (req, res) => res.sendFile(path.join(viewsPath, "jobs.html")));
app.get("/accommodation", (req, res) => res.sendFile(path.join(viewsPath, "accommodation.html")));
app.get("/communities", (req, res) => res.sendFile(path.join(viewsPath, "communities.html")));
app.get("/saved", (req, res) => res.sendFile(path.join(viewsPath, "saved.html")));

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 SERVER RUNNING AT http://localhost:${PORT}`));
