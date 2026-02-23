// Authentication System
class AuthSystem {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users")) || [];
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateNavigation();
  }

  bindEvents() {
    // Login form
    const loginForm = document.getElementById("loginFormElement");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    // Admin login form
    const adminLoginForm = document.getElementById("adminLoginFormElement");
    if (adminLoginForm) {
      adminLoginForm.addEventListener("submit", (e) =>
        this.handleAdminLogin(e),
      );
    }

    // Social login buttons
    document.querySelectorAll(".social-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleSocialLogin(e));
    });
  }

  handleAdminLogin(e) {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    // Validate inputs
    if (!this.validateEmail(email)) {
      this.showMessage("Please enter a valid email address", "error");
      return;
    }

    if (password.length < 6) {
      this.showMessage("Password must be at least 6 characters", "error");
      return;
    }

    // Check if admin user exists
    const admin = this.users.find(
      (u) => u.email === email && u.password === password && u.role === "admin",
    );

    if (admin) {
      this.currentUser = admin;
      localStorage.setItem("currentUser", JSON.stringify(admin));

      this.showMessage(
        "Admin login successful! Redirecting to admin panel...",
        "success",
      );

      setTimeout(() => {
        window.location.href = "admin.html";
      }, 1500);
    } else {
      this.showMessage("Invalid admin credentials", "error");
    }
  }

  handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Validate inputs
    if (!this.validateEmail(email)) {
      this.showMessage("Please enter a valid email address", "error");
      return;
    }

    if (password.length < 6) {
      this.showMessage("Password must be at least 6 characters", "error");
      return;
    }

    // Check if user exists
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      this.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("rememberUser", JSON.stringify(user));
      }

      this.showMessage("Login successful! Redirecting...", "success");

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1500);
    } else {
      this.showMessage("Invalid email or password", "error");
    }
  }

  handleSignup(e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("signupEmail").value;
    const phone = document.getElementById("phoneNumber").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const agreeTerms = document.getElementById("agreeTerms").checked;

    // Validate inputs
    if (!firstName || !lastName) {
      this.showMessage("Please enter your full name", "error");
      return;
    }

    if (!this.validateEmail(email)) {
      this.showMessage("Please enter a valid email address", "error");
      return;
    }

    if (!this.validatePhone(phone)) {
      this.showMessage("Please enter a valid phone number", "error");
      return;
    }

    if (password.length < 6) {
      this.showMessage("Password must be at least 6 characters", "error");
      return;
    }

    if (password !== confirmPassword) {
      this.showMessage("Passwords do not match", "error");
      return;
    }

    if (!agreeTerms) {
      this.showMessage("Please agree to the terms and conditions", "error");
      return;
    }

    // Check if user already exists
    if (this.users.find((u) => u.email === email)) {
      this.showMessage("An account with this email already exists", "error");
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
      orders: [],
      wishlist: [
        {
          id: 1,
          name: "Cartoon Astronaut T-Shirt",
          brand: "adidas",
          price: 78,
          image: "img/products/f1.jpg",
        },
      ],
    };

    this.users.push(newUser);
    localStorage.setItem("users", JSON.stringify(this.users));

    this.showMessage(
      "Account created successfully! Please sign in.",
      "success",
    );

    setTimeout(() => {
      switchToLogin();
    }, 1500);
  }

  handleSocialLogin(e) {
    e.preventDefault();
    const provider = e.currentTarget.classList.contains("google-btn")
      ? "Google"
      : "Facebook";
    this.showMessage(`${provider} login is not implemented yet`, "info");
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector(".auth-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `auth-message ${type}`;
    messageDiv.textContent = message;

    // Insert message
    const authContainer = document.getElementById("auth-container");
    authContainer.insertBefore(messageDiv, authContainer.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  updateNavigation() {
    // This will be called from other pages to update navigation
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
                    <a href="#" onclick="authSystem.viewProfile()">My Profile</a>
                    <a href="#" onclick="authSystem.viewOrders()">My Orders</a>
                    <a href="#" onclick="authSystem.viewWishlist()">Wishlist</a>
                    <a href="#" onclick="authSystem.logout()">Logout</a>
                </div>
            `;

      // Insert before cart icon
      const cartLink = navbar.querySelector("li:last-child");
      navbar.insertBefore(userMenu, cartLink);
    } else {
      // User is not logged in - show guest/login link
      const loginLink = document.createElement("li");
      loginLink.className = "auth-link";
      loginLink.innerHTML =
        '<a href="auth.html"><i class="fas fa-user"></i> Guest</a>';

      // Insert before cart icon
      const cartLink = navbar.querySelector("li:last-child");
      navbar.insertBefore(loginLink, cartLink);
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberUser");

    this.showMessage("Logged out successfully", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }

  viewProfile() {
    this.showMessage("Profile page coming soon!", "info");
  }

  viewOrders() {
    this.showMessage("Orders page coming soon!", "info");
  }

  viewWishlist() {
    this.showMessage("Wishlist feature coming soon!", "info");
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Form switching functions
function switchToSignup() {
  document.getElementById("loginForm").style.display = "none";
  const adminForm = document.getElementById("adminLoginForm");
  if (adminForm) {
    adminForm.style.display = "none";
  }
  document.getElementById("signupForm").style.display = "block";
}

function switchToLogin() {
  document.getElementById("signupForm").style.display = "none";
  const adminForm = document.getElementById("adminLoginForm");
  if (adminForm) {
    adminForm.style.display = "none";
  }
  document.getElementById("loginForm").style.display = "block";
}

function switchToAdminLogin() {
  const adminForm = document.getElementById("adminLoginForm");
  if (!adminForm) return;
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "none";
  adminForm.style.display = "block";
}

// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling;

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// Initialize authentication system
const authSystem = new AuthSystem();

// Auto-fill remembered user
document.addEventListener("DOMContentLoaded", () => {
  const rememberedUser = JSON.parse(localStorage.getItem("rememberUser"));
  if (rememberedUser && document.getElementById("loginEmail")) {
    document.getElementById("loginEmail").value = rememberedUser.email;
    document.getElementById("rememberMe").checked = true;
  }
});
