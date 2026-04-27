const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const newsletterRoutes = require("./routes/newsletter");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (used for cart management per user)
app.use(
  session({
    secret: "kezibakes-secret-key-2024",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Serve static frontend files (your HTML, CSS, images)
app.use(express.static(path.join(__dirname, "public")));

// ── API Routes ────────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/orders", orderRoutes);

// ── Serve Frontend (catch-all) ────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🍰 Kezi Bakes server running at http://localhost:${PORT}`);
});