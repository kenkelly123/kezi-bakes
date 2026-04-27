const API = "http://localhost:3000/api";
let cartCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  setupCartButtons();
  setupNewsletterForm();
  refreshCartCount();
});

function setupCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach((btn, index) => {
    const productId = index + 1;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.textContent = "Adding...";
      try {
        const res = await fetch(`${API}/cart/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: 1 }),
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          showToast(`🛒 ${data.message}`);
          cartCount = data.itemCount;
          updateCartBadge();
          btn.textContent = "Added ✓";
          setTimeout(() => (btn.textContent = "Add to Cart"), 2000);
        } else {
          showToast("❌ " + data.message, "error");
          btn.textContent = "Add to Cart";
        }
      } catch {
        showToast("❌ Could not connect to server", "error");
        btn.textContent = "Add to Cart";
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function setupNewsletterForm() {
  const form = document.querySelector(".newsletter-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector("input[type='email']");
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Subscribing...";
    try {
      const res = await fetch(`${API}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.value.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      showToast(data.success ? "🍰 " + data.message : "⚠️ " + data.message, data.success ? "success" : "warning");
      if (data.success) emailInput.value = "";
      submitBtn.textContent = data.success ? "Subscribed ✓" : "Subscribe";
    } catch {
      showToast("❌ Could not connect.", "error");
      submitBtn.textContent = "Subscribe";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

async function refreshCartCount() {
  try {
    const res = await fetch(`${API}/cart`, { credentials: "include" });
    const data = await res.json();
    if (data.success) { cartCount = data.itemCount; updateCartBadge(); }
  } catch {}
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? "inline-block" : "none";
  }
}

function showToast(message, type = "success") {
  const existing = document.getElementById("kezi-toast");
  if (existing) existing.remove();
  const colors = { success: "#4caf50", error: "#e53935", warning: "#fb8c00" };
  const toast = document.createElement("div");
  toast.id = "kezi-toast";
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed", bottom: "30px", right: "30px",
    background: colors[type], color: "#fff",
    padding: "14px 22px", borderRadius: "8px",
    fontSize: "15px", fontFamily: "Montserrat, sans-serif",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    zIndex: "9999", opacity: "1", maxWidth: "320px",
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 400); }, 3500);
}