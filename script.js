// Initialize authentication system on all pages
document.addEventListener("DOMContentLoaded", function () {
  // Check if auth system exists (it will be loaded on auth.html)
  if (typeof AuthSystem !== "undefined") {
    window.authSystem = new AuthSystem();
  } else {
    // Create a minimal auth system for other pages
    window.authSystem = {
      currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,

      updateNavigation() {
        const navbar = document.getElementById("navbar");
        if (!navbar) return;

        // Remove existing auth links
        const existingAuthLinks = navbar.querySelectorAll(".auth-link");
        existingAuthLinks.forEach((link) => link.remove());

        if (this.currentUser && this.currentUser.role !== "admin") {
          // User is logged in - show user menu
          const userMenu = document.createElement("li");
          userMenu.className = "auth-link user-menu";
          userMenu.innerHTML = `
                        <a href="#" class="user-dropdown">
                            <i class="fas fa-user"></i>
                            ${this.currentUser.firstName}
                            <i class="fas fa-chevron-down"></i>
                        </a>
                        <div class="dropdown-menu">
                            <a href="profile.html">My Profile</a>
                            <a href="#" onclick="authSystem.viewOrders()">My Orders</a>
                            <a href="#" onclick="authSystem.viewWishlist()">Wishlist</a>
                            <a href="#" onclick="authSystem.logout()">Logout</a>
                        </div>
                    `;

          // Replace the login link
          const loginLink = navbar.querySelector('a[href="auth.html"]');
          if (loginLink) {
            loginLink.parentElement.replaceWith(userMenu);
          }
        } else {
          // Ensure guest/login link exists
          let loginLink = navbar.querySelector('a[href="auth.html"]');
          if (!loginLink) {
            const li = document.createElement("li");
            li.innerHTML =
              '<a href="auth.html"><i class="fas fa-user"></i> Guest</a>';
            const cartLink = navbar.querySelector(
              'a[href="cart.html"]',
            ).parentElement;
            navbar.insertBefore(li, cartLink);
            loginLink = li.querySelector('a[href="auth.html"]');
          }

          if (loginLink) {
            loginLink.innerHTML = '<i class="fas fa-user"></i> Guest';
          }
        }
      },

      logout() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("rememberUser");
        window.location.href = "index.html";
      },

      viewProfile() {
        alert("Profile page coming soon!");
      },

      viewOrders() {
        window.location.href = "profile.html#orders";
      },

      viewWishlist() {
        window.location.href = "profile.html#wishlist";
      },

      isLoggedIn() {
        return this.currentUser !== null;
      },

      getCurrentUser() {
        return this.currentUser;
      },
    };
  }

  // Update navigation on page load
  if (window.authSystem && window.authSystem.updateNavigation) {
    window.authSystem.updateNavigation();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const cartLink = event.target.closest("a");
    if (!cartLink || !cartLink.querySelector(".cart")) return;

    event.preventDefault();

    const productCard = cartLink.closest(".pro");
    if (!productCard || typeof CartUtils === "undefined") return;

    const product = extractProductFromCard(productCard);
    if (!product) return;

    CartUtils.addToCart(product);
  });

  function extractProductFromCard(card) {
    const nameElement =
      card.querySelector(".des h5 a") || card.querySelector(".des h5");
    const brandElement = card.querySelector(".des span");
    const priceElement = card.querySelector(".des h4");
    const imageElement = card.querySelector("img");

    const name = nameElement ? nameElement.textContent.trim() : "";
    const brand = brandElement ? brandElement.textContent.trim() : "";
    const priceText = priceElement ? priceElement.textContent.trim() : "";
    const image = imageElement ? imageElement.getAttribute("src") : "";

    if (!name || !priceText) return null;

    const price = Number(priceText.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(price)) return null;

    const id = getProductId(card, name);

    return {
      id,
      name,
      brand,
      price,
      image,
    };
  }

  function getProductId(card, name) {
    const dataId = card.getAttribute("data-product-id");
    if (dataId) return dataId;

    const detailLink = card.querySelector('a[href*="product-detail.html?id="]');
    if (detailLink) {
      const match = detailLink.getAttribute("href").match(/id=([^&]+)/);
      if (match && match[1]) return match[1];
    }

    const imageElement = card.querySelector("img");
    if (imageElement) {
      const src = imageElement.getAttribute("src") || "";
      const match = src.match(/\/([a-z]\d+)\.(jpg|jpeg|png|webp)$/i);
      if (match && match[1]) return match[1];
    }

    return name.toLowerCase().replace(/\s+/g, "-");
  }
});
