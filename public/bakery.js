let cart = JSON.parse(localStorage.getItem('keziCart')) || [];

document.addEventListener("DOMContentLoaded", () => {
  setupCartButtons();
  setupNewsletterForm();
  updateCartBadge();
  setupSlideshow();
});

function setupSlideshow() {
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slides img');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    if (!slides || !prevBtn || !nextBtn) return;

    let current = 0;
    const total = images.length;

    function goToSlide(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        current = index;
        slides.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[current].classList.add('active');
    }

    let autoSlide = setInterval(() => goToSlide(current + 1), 3000);

    nextBtn.addEventListener('click', () => {
        clearInterval(autoSlide);
        goToSlide(current + 1);
        autoSlide = setInterval(() => goToSlide(current + 1), 3000);
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(autoSlide);
        goToSlide(current - 1);
        autoSlide = setInterval(() => goToSlide(current + 1), 3000);
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(autoSlide);
            goToSlide(i);
            autoSlide = setInterval(() => goToSlide(current + 1), 3000);
        });
    });
}

function setupCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const card = btn.closest('.product-card');
      const name = card.querySelector('.product-name').textContent;
      const price = card.querySelector('.product-price').textContent;

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id: index + 1, name, price, quantity: 1 });
      }

      localStorage.setItem('keziCart', JSON.stringify(cart));
      updateCartBadge();
      showToastWithLink(`🛒 ${name} added to cart!`);
      btn.textContent = "Added ✓";
      setTimeout(() => (btn.textContent = "Add to Cart"), 2000);
    });
  });
}

function setupNewsletterForm() {
  const form = document.querySelector(".newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = form.querySelector("input[type='email']");
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.textContent = "Subscribing...";
    submitBtn.disabled = true;

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "newsletter",
        "email": emailInput.value.trim()
      }).toString()
    }).then(() => {
      showToast("🍰 Thank you for subscribing!", "success");
      emailInput.value = "";
      submitBtn.textContent = "Subscribed ✓";
      setTimeout(() => {
        submitBtn.textContent = "Subscribe";
        submitBtn.disabled = false;
      }, 3000);
    }).catch(() => {
      showToast("❌ Could not subscribe. Try again.", "error");
      submitBtn.textContent = "Subscribe";
      submitBtn.disabled = false;
    });
  });
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "inline-block" : "none";
  }
}

function showToastWithLink(message) {
  const existing = document.getElementById("kezi-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "kezi-toast";
  toast.innerHTML = `
    <span>${message}</span>
    <a href="/cart.html" style="display:block; margin-top:8px; color:#fff; font-weight:600; text-decoration:underline;">View Cart →</a>
  `;
  Object.assign(toast.style, {
    position: "fixed", bottom: "30px", right: "100px",
    background: "#4caf50", color: "#fff",
    padding: "14px 22px", borderRadius: "8px",
    fontSize: "15px", fontFamily: "Montserrat, sans-serif",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    zIndex: "9999", opacity: "1", maxWidth: "320px",
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 400); }, 5000);
}

function showToast(message, type = "success") {
  const existing = document.getElementById("kezi-toast");
  if (existing) existing.remove();
  const colors = { success: "#4caf50", error: "#e53935", warning: "#fb8c00" };
  const toast = document.createElement("div");
  toast.id = "kezi-toast";
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed", bottom: "30px", right: "100px",
    background: colors[type], color: "#fff",
    padding: "14px 22px", borderRadius: "8px",
    fontSize: "15px", fontFamily: "Montserrat, sans-serif",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    zIndex: "9999", opacity: "1", maxWidth: "320px",
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 400); }, 3500);
}
