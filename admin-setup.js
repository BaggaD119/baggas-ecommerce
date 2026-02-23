// Admin Setup and Auto-Login System
class AdminSetup {
  constructor() {
    this.init();
  }

  init() {
    this.createDefaultAdminUser();
    this.setupAdminAccess();
  }

  createDefaultAdminUser() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const adminExists = users.find((u) => u.role === "admin");

    if (!adminExists) {
      console.log("Creating default admin user...");
      
      const adminUser = {
        id: Date.now(),
        firstName: "Admin",
        lastName: "User",
        email: "admin@baggas.com",
        phone: "+1234567890",
        password: "admin123",
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
        orders: [],
        wishlist: []
      };

      users.push(adminUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      console.log("Default admin user created:");
      console.log("Email: admin@baggas.com");
      console.log("Password: admin123");
      
      return adminUser;
    }
    
    return adminExists;
  }

  setupAdminAccess() {
    // Add admin access methods to window for easy access
    window.adminAccess = {
      // Quick admin login
      quickLogin: () => {
        const adminUser = this.createDefaultAdminUser();
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        console.log("Admin logged in automatically!");
        window.location.href = "admin-enhanced.html";
      },

      // Show admin credentials
      showCredentials: () => {
        console.log("=== ADMIN CREDENTIALS ===");
        console.log("Email: admin@baggas.com");
        console.log("Password: admin123");
        console.log("========================");
        alert("Admin Credentials:\nEmail: admin@baggas.com\nPassword: admin123");
      },

      // Reset admin user
      resetAdmin: () => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const filteredUsers = users.filter(u => u.role !== "admin");
        localStorage.setItem("users", JSON.stringify(filteredUsers));
        localStorage.removeItem("currentUser");
        console.log("Admin user reset. Creating new one...");
        this.createDefaultAdminUser();
      },

      // Go to admin panel
      goToAdmin: () => {
        window.location.href = "admin-enhanced.html";
      },

      // Go to auth page
      goToAuth: () => {
        window.location.href = "auth.html";
      }
    };

    // Show helpful console messages
    console.log("🔧 Admin Setup Complete!");
    console.log("📋 Available commands:");
    console.log("  adminAccess.quickLogin() - Login as admin automatically");
    console.log("  adminAccess.showCredentials() - Show admin login details");
    console.log("  adminAccess.goToAdmin() - Go to admin panel");
    console.log("  adminAccess.goToAuth() - Go to login page");
    console.log("  adminAccess.resetAdmin() - Reset admin user");
  }

  // Auto-login if on admin page and no user is logged in
  autoLoginForAdmin() {
    const currentPath = window.location.pathname;
    const isAdminPage = currentPath.includes('admin') && !currentPath.includes('auth');
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (isAdminPage && (!currentUser || currentUser.role !== "admin")) {
      console.log("Auto-logging in admin user...");
      const adminUser = this.createDefaultAdminUser();
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      
      // Refresh the page to load with admin user
      if (typeof window.adminSystem !== 'undefined') {
        window.adminSystem.currentUser = adminUser;
        window.adminSystem.checkAdminAuth();
      }
    }
  }
}

// Initialize admin setup
document.addEventListener("DOMContentLoaded", () => {
  const adminSetup = new AdminSetup();
  
  // Auto-login for admin pages
  setTimeout(() => {
    adminSetup.autoLoginForAdmin();
  }, 100);
});

// Also initialize immediately for pages that are already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AdminSetup());
} else {
  new AdminSetup();
}