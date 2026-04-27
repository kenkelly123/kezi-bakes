const express = require("express");
const router = express.Router();

const products = [
  { id: 1, name: "Chocolate Delight Cake", price: 35.0, image: "/IMAGES/chocolate.jpg" },
  { id: 2, name: "Strawberry Cupcakes", price: 3.5, image: "/IMAGES/strawberry cupcakes.webp" },
  { id: 3, name: "Food Basket & Customize Cakes", price: 4.25, image: "/IMAGES/foodbasket.pic.jpeg" },
];

function getCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

function calcTotals(cart) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { itemCount, total: parseFloat(total.toFixed(2)) };
}

// GET /api/cart
router.get("/", (req, res) => {
  const cart = getCart(req);
  res.json({ success: true, cart, ...calcTotals(cart) });
});

// POST /api/cart/add  — body: { productId, quantity }
router.post("/add", (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId)
    return res.status(400).json({ success: false, message: "productId is required" });

  const product = products.find((p) => p.id === parseInt(productId));
  if (!product)
    return res.status(404).json({ success: false, message: "Product not found" });

  const cart = getCart(req);
  const existing = cart.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += parseInt(quantity);
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: parseInt(quantity),
    });
  }

  req.session.cart = cart;
  res.json({ success: true, message: `${product.name} added to cart!`, cart, ...calcTotals(cart) });
});

// PUT /api/cart/update — body: { productId, quantity }
router.put("/update", (req, res) => {
  const { productId, quantity } = req.body;
  const cart = getCart(req);
  const item = cart.find((i) => i.productId === parseInt(productId));
  if (!item)
    return res.status(404).json({ success: false, message: "Item not in cart" });

  if (parseInt(quantity) <= 0) {
    req.session.cart = cart.filter((i) => i.productId !== parseInt(productId));
  } else {
    item.quantity = parseInt(quantity);
  }

  res.json({ success: true, message: "Cart updated", cart: req.session.cart, ...calcTotals(req.session.cart) });
});

// DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", (req, res) => {
  const cart = getCart(req);
  const updated = cart.filter((i) => i.productId !== parseInt(req.params.productId));
  req.session.cart = updated;
  res.json({ success: true, message: "Item removed", cart: updated, ...calcTotals(updated) });
});

// DELETE /api/cart/clear
router.delete("/clear", (req, res) => {
  req.session.cart = [];
  res.json({ success: true, message: "Cart cleared", cart: [], itemCount: 0, total: 0 });
});

module.exports = router;