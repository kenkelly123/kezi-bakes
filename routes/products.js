const express = require("express");
const router = express.Router();

const products = [
  {
    id: 1,
    name: "Chocolate Delight Cake",
    price: 35.0,
    priceDisplay: "GHs35.00",
    description: "Rich chocolate layers with smooth ganache",
    image: "/IMAGES/chocolate.jpg",
    category: "cakes",
    inStock: true,
  },
  {
    id: 2,
    name: "Strawberry Cupcakes",
    price: 3.5,
    priceDisplay: "GHs3.50 each",
    description: "Light and fluffy with fresh strawberry frosting",
    image: "/IMAGES/strawberry cupcakes.webp",
    category: "cupcakes",
    inStock: true,
  },
  {
    id: 3,
    name: "Food Basket & Customize Cakes",
    price: 4.25,
    priceDisplay: "GHs4.25",
    description: "Buttery, flaky pastry with almond cream filling",
    image: "/IMAGES/foodbasket.pic.jpeg",
    category: "custom",
    inStock: true,
  },
];

// GET /api/products — all products
router.get("/", (req, res) => {
  res.json({ success: true, products });
});

// GET /api/products/:id — single product
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product)
    return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
});

// GET /api/products/category/:category — filter by category
router.get("/category/:category", (req, res) => {
  const filtered = products.filter(
    (p) => p.category === req.params.category.toLowerCase()
  );
  res.json({ success: true, products: filtered });
});

module.exports = router;