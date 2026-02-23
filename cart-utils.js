// Cart Utilities - Shared across all pages
class CartUtils {
  static updateCartBadges() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach((link) => {
      // Remove existing badge
      const existingBadge = link.querySelector(".cart-badge");
      if (existingBadge) {
        existingBadge.remove();
      }

      // Add new badge if items exist
      if (itemCount > 0) {
        const badge = document.createElement("span");
        badge.className = "cart-badge";
        badge.textContent = itemCount > 99 ? "99+" : itemCount;
        link.style.position = "relative";
        link.appendChild(badge);
      }
    });
  }

  static addToCart(product, options = {}) {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");

    const cartItem = {
      id: `${product.id}_${options.color || "default"}_${options.size || "default"}`,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image || product.images?.[0],
      color: options.color,
      size: options.size,
      quantity: options.quantity || 1,
      addedAt: new Date().toISOString(),
    };

    // Check if item already exists
    const existingItemIndex = cart.findIndex((item) => item.id === cartItem.id);

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      // Add new item
      cart.push(cartItem);
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    this.updateCartBadges();

    // Use global notification system if available
    if (typeof notify !== "undefined") {
      notify.success(`${product.name} added to cart!`);
    } else {
      this.showNotification(`${product.name} added to cart!`);
    }

    return true;
  }

  static showNotification(message, type = "success") {
    // Create notification if it doesn't exist
    let notification = document.getElementById("globalCartNotification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "globalCartNotification";
      notification.className = "cart-notification";
      notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <span id="globalNotificationMessage"></span>
                </div>
            `;
      document.body.appendChild(notification);
    }

    const messageElement = document.getElementById("globalNotificationMessage");
    messageElement.textContent = message;
    notification.className = `cart-notification ${type}`;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }

  static getCartCount() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  static getCartTotal() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}

// Initialize cart badges on page load
document.addEventListener("DOMContentLoaded", function () {
  CartUtils.updateCartBadges();
});

// Update badges when storage changes (for multiple tabs)
window.addEventListener("storage", function (e) {
  if (e.key === "shoppingCart") {
    CartUtils.updateCartBadges();
  }
});
