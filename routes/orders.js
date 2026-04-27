const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const orders = [];

// POST /api/orders/place — body: { name, email, phone, address, deliveryNote }
router.post("/place", (req, res) => {
  const { name, email, phone, address, deliveryNote } = req.body;

  if (!name || !email || !phone || !address)
    return res.status(400).json({ success: false, message: "Please provide name, email, phone, and address." });

  const cart = req.session.cart || [];
  if (cart.length === 0)
    return res.status(400).json({ success: false, message: "Your cart is empty." });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    orderId: uuidv4().slice(0, 8).toUpperCase(),
    customer: { name, email, phone, address, deliveryNote: deliveryNote || "" },
    items: [...cart],
    total: parseFloat(total.toFixed(2)),
    status: "Pending",
    placedAt: new Date().toISOString(),
  };

  orders.push(order);
  req.session.cart = [];

  console.log(`🛒 Order #${order.orderId} from ${name} — GHs${order.total}`);

  res.status(201).json({
    success: true,
    message: `Order placed! Your ID is #${order.orderId}. We'll contact you shortly.`,
    orderId: order.orderId,
    total: order.total,
  });
});

// GET /api/orders — all orders (admin)
router.get("/", (req, res) => {
  res.json({ success: true, count: orders.length, orders });
});

// GET /api/orders/:orderId — track one order
router.get("/:orderId", (req, res) => {
  const order = orders.find((o) => o.orderId === req.params.orderId.toUpperCase());
  if (!order)
    return res.status(404).json({ success: false, message: `Order #${req.params.orderId} not found.` });
  res.json({ success: true, order });
});

module.exports = router;