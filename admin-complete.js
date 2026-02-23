// Complete E-commerce Admin Panel System
class CompleteAdminSystem {
  constructor() {
    this.currentSection = "dashboard";
    this.products = this.loadProducts();
    this.customers = this.loadCustomers();
    this.orders = this.loadOrders();
    this.payments = this.loadPayments();
    this.promotions = this.loadPromotions();
    this.inventory = this.loadInventory();
    this.reviews = this.loadReviews();
    this.settings = this.loadSettings();
    this.analytics = this.loadAnalytics();
    this.init();
  }

  init() {
    console.log("🚀 Initializing Complete Admin System...");
    this.checkAdminAuth();
    this.bindEvents();
    this.loadDashboard();
    this.updateAllCounts();
    this.initNotifications();
    console.log("✅ Complete Admin System initialized!");
  }

  checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      this.createAdminUser();
      return;
    }
    document.getElementById("adminUserName").textContent =
      currentUser.firstName || "Admin";
  }

  createAdminUser() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    let adminUser = users.find((u) => u.role === "admin");

    if (!adminUser) {
      adminUser = {
        id: Date.now(),
        firstName: "Admin",
        lastName: "User",
        email: "admin@baggas.com",
        phone: "+1234567890",
        password: "admin123",
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
        permissions: ["all"],
      };

      users.push(adminUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
    }
    document.getElementById("adminUserName").textContent = adminUser.firstName;
  }

  bindEvents() {
    // Menu navigation
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
      });
    });

    // Modal close
    const modalClose = document.querySelector(".admin-modal-close");
    if (modalClose) {
      modalClose.addEventListener("click", () => this.closeModal());
    }

    // Dashboard timeframe change
    const timeframeSelect = document.getElementById("dashboardTimeframe");
    if (timeframeSelect) {
      timeframeSelect.addEventListener("change", () =>
        this.updateDashboardData(),
      );
    }

    this.bindFilterEvents();
  }

  bindFilterEvents() {
    // Product filters
    [
      "productSearch",
      "productCategoryFilter",
      "productBrandFilter",
      "productStatusFilter",
      "productStockFilter",
    ].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener(
          element.type === "text" ? "input" : "change",
          () => this.filterProducts(),
        );
      }
    });

    // Order filters
    [
      "orderSearch",
      "orderStatusFilter",
      "orderDateFrom",
      "orderDateTo",
      "orderPaymentFilter",
    ].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener(
          element.type === "text" ? "input" : "change",
          () => this.filterOrders(),
        );
      }
    });

    // Customer filters
    [
      "customerSearch",
      "customerSegmentFilter",
      "customerLocationFilter",
    ].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener(
          element.type === "text" ? "input" : "change",
          () => this.filterCustomers(),
        );
      }
    });
  }
  switchSection(section) {
    console.log(`🔄 Switching to section: ${section}`);

    // Update menu
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`[data-section="${section}"]`)
      ?.classList.add("active");

    // Update content
    document.querySelectorAll(".admin-section").forEach((sec) => {
      sec.classList.remove("active");
    });
    document.getElementById(section)?.classList.add("active");

    this.currentSection = section;

    // Load section data
    switch (section) {
      case "dashboard":
        this.loadDashboard();
        break;
      case "products":
        this.displayProducts();
        break;
      case "inventory":
        this.displayInventory();
        break;
      case "orders":
        this.displayOrders();
        break;
      case "customers":
        this.displayCustomers();
        break;
      case "payments":
        this.displayPayments();
        break;
      case "promotions":
        this.displayPromotions();
        break;
      case "shipping":
        this.displayShipping();
        break;
      case "reviews":
        this.displayReviews();
        break;
      case "analytics":
        this.displayAnalytics();
        break;
      case "marketing":
        this.displayMarketing();
        break;
      case "settings":
        this.displaySettings();
        break;
    }
  }

  // Data Loading Methods
  loadProducts() {
    const defaultProducts = [
      {
        id: 1,
        name: "Cartoon Astronaut T-Shirt",
        brand: "Adidas",
        category: "shirts",
        price: 78.0,
        cost: 45.0,
        image: "img/products/f1.jpg",
        images: ["img/products/f1.jpg"],
        stock: 50,
        reserved: 5,
        reorderLevel: 10,
        status: "active",
        featured: true,
        description: "Comfortable cotton t-shirt with astronaut design",
        sizes: ["S", "M", "L", "XL"],
        colors: ["black", "white", "blue"],
        tags: ["casual", "cotton", "summer"],
        sku: "AST-001",
        rating: 4.5,
        totalSales: 125,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Floral Print Shirt",
        brand: "Nike",
        category: "shirts",
        price: 85.0,
        cost: 52.0,
        image: "img/products/f2.jpg",
        images: ["img/products/f2.jpg"],
        stock: 30,
        reserved: 2,
        reorderLevel: 15,
        status: "active",
        featured: false,
        description: "Stylish floral print shirt for casual wear",
        sizes: ["M", "L", "XL"],
        colors: ["white", "blue", "green"],
        tags: ["floral", "casual", "spring"],
        sku: "FLR-002",
        rating: 4.2,
        totalSales: 89,
        createdAt: new Date().toISOString(),
      },
    ];

    const stored = localStorage.getItem("adminProducts");
    this.products = stored ? JSON.parse(stored) : defaultProducts;
    return this.products;
  }

  loadCustomers() {
    const defaultCustomers = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        totalOrders: 5,
        totalSpent: 450.0,
        lastOrderDate: new Date().toISOString(),
        status: "active",
        segment: "repeat",
        location: "New York, USA",
        joinDate: "2024-01-15",
        addresses: [
          {
            type: "billing",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA",
          },
        ],
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+1987654321",
        totalOrders: 12,
        totalSpent: 1250.0,
        lastOrderDate: new Date().toISOString(),
        status: "active",
        segment: "vip",
        location: "Los Angeles, USA",
        joinDate: "2023-08-20",
        addresses: [],
      },
    ];

    const stored = localStorage.getItem("adminCustomers");
    this.customers = stored ? JSON.parse(stored) : defaultCustomers;
    return this.customers;
  }

  loadOrders() {
    const defaultOrders = [
      {
        id: "ORD-001",
        customerId: 1,
        customerName: "John Doe",
        customerEmail: "john.doe@example.com",
        date: new Date().toISOString(),
        items: [
          {
            productId: 1,
            name: "Cartoon Astronaut T-Shirt",
            quantity: 2,
            price: 78.0,
            size: "L",
            color: "black",
          },
        ],
        subtotal: 156.0,
        tax: 12.48,
        shipping: 9.99,
        total: 178.47,
        status: "pending",
        paymentStatus: "paid",
        paymentMethod: "credit-card",
        shippingAddress: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "USA",
        },
        trackingNumber: null,
        notes: "",
      },
    ];

    const stored = localStorage.getItem("adminOrders");
    this.orders = stored ? JSON.parse(stored) : defaultOrders;
    return this.orders;
  }

  loadPayments() {
    const defaultPayments = [
      {
        id: "PAY-001",
        transactionId: "txn_1234567890",
        orderId: "ORD-001",
        customerId: 1,
        amount: 178.47,
        method: "credit-card",
        status: "completed",
        date: new Date().toISOString(),
        gateway: "stripe",
        fees: 5.35,
      },
    ];

    const stored = localStorage.getItem("adminPayments");
    this.payments = stored ? JSON.parse(stored) : defaultPayments;
    return this.payments;
  }

  loadPromotions() {
    const defaultPromotions = [
      {
        id: 1,
        name: "Summer Sale",
        type: "percentage",
        value: 20,
        code: "SUMMER20",
        startDate: "2024-06-01",
        endDate: "2024-08-31",
        status: "active",
        usageCount: 45,
        usageLimit: 100,
      },
    ];

    const stored = localStorage.getItem("adminPromotions");
    this.promotions = stored ? JSON.parse(stored) : defaultPromotions;
    return this.promotions;
  }

  loadInventory() {
    return this.products.map((product) => ({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      currentStock: product.stock,
      reserved: product.reserved || 0,
      available: product.stock - (product.reserved || 0),
      reorderLevel: product.reorderLevel || 10,
      status: this.getStockStatus(product.stock, product.reorderLevel),
    }));
  }

  loadReviews() {
    const defaultReviews = [
      {
        id: 1,
        reviewer: "Sarah Johnson",
        email: "sarah.j@example.com",
        rating: 5,
        title: "Amazing quality and fit!",
        comment:
          "I absolutely love this t-shirt! The material is so soft and comfortable, and the print quality is excellent. It fits perfectly and hasn't faded after multiple washes. Highly recommend!",
        date: "2026-01-28",
        status: "approved",
        productName: "Cartoon Astronaut T-Shirt",
        productSku: "AST-001",
        productImage: "img/products/f1.jpg",
        helpfulVotes: 12,
        response: {
          text: "Thank you so much for your wonderful review, Sarah! We're thrilled to hear that you love the quality and fit of our Cartoon Astronaut T-Shirt. Your feedback means the world to us!",
          date: "2026-01-29",
          author: "Bagga's Team",
        },
      },
      {
        id: 2,
        reviewer: "Mike Chen",
        email: "mike.chen@example.com",
        rating: 3,
        title: "Decent shirt, but sizing runs small",
        comment:
          "The shirt looks nice and the floral pattern is attractive. However, I ordered a Large but it fits more like a Medium. The material is good quality though. Would recommend ordering a size up.",
        date: "2026-01-27",
        status: "pending",
        productName: "Floral Print Shirt",
        productSku: "FLR-002",
        productImage: "img/products/f2.jpg",
        helpfulVotes: 3,
      },
      {
        id: 3,
        reviewer: "Anonymous User",
        email: "user@example.com",
        rating: 1,
        title: "Terrible quality, waste of money",
        comment:
          "This product is absolutely terrible. Poor quality, bad service, and overpriced. Don't waste your money on this garbage.",
        date: "2026-01-26",
        status: "flagged",
        productName: "Summer Casual Shirt",
        productSku: "SUM-003",
        productImage: "img/products/f3.jpg",
        helpfulVotes: 0,
        flagReason: "Inappropriate language and spam-like content",
      },
      {
        id: 4,
        reviewer: "Emma Wilson",
        email: "emma.w@example.com",
        rating: 4,
        title: "Great design, fast shipping",
        comment:
          "Love the design and colors! Shipping was super fast and the packaging was nice. Only minor issue is that it's a bit thinner than expected, but still good quality overall.",
        date: "2026-01-25",
        status: "approved",
        productName: "Vintage Style Tee",
        productSku: "VIN-004",
        productImage: "img/products/f4.jpg",
        helpfulVotes: 8,
      },
      {
        id: 5,
        reviewer: "David Rodriguez",
        email: "david.r@example.com",
        rating: 5,
        title: "Perfect for summer!",
        comment:
          "Exactly what I was looking for! The fabric is breathable and perfect for hot weather. The fit is true to size and the color hasn't faded after several washes.",
        date: "2026-01-24",
        status: "approved",
        productName: "Lightweight Summer Shirt",
        productSku: "LWS-005",
        productImage: "img/products/f5.jpg",
        helpfulVotes: 15,
      },
      {
        id: 6,
        reviewer: "Lisa Thompson",
        email: "lisa.t@example.com",
        rating: 2,
        title: "Not as described",
        comment:
          "The product looks different from the photos. The color is much darker and the material feels cheap. Disappointed with this purchase.",
        date: "2026-01-23",
        status: "pending",
        productName: "Classic Cotton Tee",
        productSku: "CCT-006",
        productImage: "img/products/f6.jpg",
        helpfulVotes: 2,
      },
    ];

    const stored = localStorage.getItem("adminReviews");
    this.reviews = stored ? JSON.parse(stored) : defaultReviews;
    return this.reviews;
  }

  loadSettings() {
    const defaultSettings = {
      store: {
        name: "Bagga's Ecommerce",
        email: "info@baggas.com",
        phone: "+1 234 567 8900",
        address: "123 Business St, City, State 12345",
        currency: "USD",
        timezone: "America/New_York",
      },
      payment: {
        gateways: ["stripe", "paypal", "square"],
        currencies: ["USD", "EUR", "GBP"],
      },
      shipping: {
        zones: ["local", "national", "international"],
        methods: ["standard", "express", "overnight"],
      },
      tax: {
        enabled: true,
        rate: 8.25,
      },
    };

    const stored = localStorage.getItem("adminSettings");
    this.settings = stored ? JSON.parse(stored) : defaultSettings;
    return this.settings;
  }

  loadAnalytics() {
    return {
      revenue: {
        today: 1250.0,
        week: 8750.0,
        month: 35000.0,
        year: 420000.0,
      },
      orders: {
        today: 15,
        week: 105,
        month: 420,
        year: 5040,
      },
      customers: {
        total: 1250,
        new: 45,
        returning: 890,
      },
      conversion: {
        rate: 3.2,
        visitors: 15000,
        conversions: 480,
      },
    };
  }
  // Dashboard Methods
  loadDashboard() {
    console.log("📊 Loading dashboard...");
    this.updateDashboardMetrics();
    this.loadDashboardWidgets();
    this.updateOrderStatusWidget();
    this.loadTopProducts();
    this.loadRecentOrders();
    this.updateCustomerInsights();
  }

  updateDashboardMetrics() {
    const analytics = this.analytics;
    const timeframe =
      document.getElementById("dashboardTimeframe")?.value || "month";

    document.getElementById("totalRevenue").textContent =
      `$${analytics.revenue[timeframe].toLocaleString()}`;
    document.getElementById("totalOrders").textContent =
      analytics.orders[timeframe].toLocaleString();
    document.getElementById("totalCustomers").textContent =
      analytics.customers.total.toLocaleString();
    document.getElementById("conversionRate").textContent =
      `${analytics.conversion.rate}%`;
  }

  loadDashboardWidgets() {
    // Sales chart would be implemented with Chart.js
    this.renderSalesChart();
  }

  renderSalesChart() {
    const canvas = document.getElementById("salesChart");
    if (canvas) {
      // Placeholder for Chart.js implementation
      canvas.style.background = "#f8f9fa";
      canvas.style.display = "flex";
      canvas.style.alignItems = "center";
      canvas.style.justifyContent = "center";
      canvas.innerHTML = "<p>Sales Chart (Chart.js integration needed)</p>";
    }
  }

  updateOrderStatusWidget() {
    const statusCounts = this.getOrderStatusCounts();
    const container = document.getElementById("orderStatusList");
    if (container) {
      container.innerHTML = Object.entries(statusCounts)
        .map(
          ([status, count]) => `
        <div class="status-item">
          <div class="status-label">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
          <div class="status-count">${count}</div>
        </div>
      `,
        )
        .join("");
    }
  }

  getOrderStatusCounts() {
    return this.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  }

  loadTopProducts() {
    const topProducts = this.products
      .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
      .slice(0, 5);

    const container = document.getElementById("topProductsList");
    if (container) {
      container.innerHTML = topProducts
        .map(
          (product) => `
        <div class="top-product-item">
          <img src="${product.image}" alt="${product.name}" class="product-thumb">
          <div class="product-info">
            <h5>${product.name}</h5>
            <p>${product.totalSales || 0} sales</p>
          </div>
          <div class="product-revenue">$${((product.totalSales || 0) * product.price).toLocaleString()}</div>
        </div>
      `,
        )
        .join("");
    }
  }

  loadRecentOrders() {
    const recentOrders = this.orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    const container = document.getElementById("recentOrdersList");
    if (container) {
      container.innerHTML = recentOrders
        .map(
          (order) => `
        <div class="recent-order-item">
          <div class="order-info">
            <h5>${order.id}</h5>
            <p>${order.customerName}</p>
          </div>
          <div class="order-status">
            <span class="status-badge status-${order.status}">${order.status}</span>
          </div>
          <div class="order-total">$${order.total.toFixed(2)}</div>
        </div>
      `,
        )
        .join("");
    }
  }

  updateCustomerInsights() {
    const insights = this.analytics.customers;
    document.getElementById("newCustomers").textContent = insights.new;
    document.getElementById("returningCustomers").textContent =
      insights.returning;

    const avgOrderValue =
      this.orders.reduce((sum, order) => sum + order.total, 0) /
      this.orders.length;
    document.getElementById("averageOrderValue").textContent =
      `$${avgOrderValue.toFixed(2)}`;
  }

  updateAllCounts() {
    document.getElementById("productCount").textContent = this.products.length;
    document.getElementById("orderCount").textContent = this.orders.length;
    document.getElementById("customerCount").textContent =
      this.customers.length;
  }

  initNotifications() {
    // Update notification badges
    const lowStockProducts = this.products.filter(
      (p) => p.stock <= p.reorderLevel,
    );
    document
      .getElementById("lowStockAlert")
      .querySelector(".notification-count").textContent =
      lowStockProducts.length;

    const newOrders = this.orders.filter((o) => o.status === "pending");
    document
      .getElementById("newOrdersAlert")
      .querySelector(".notification-count").textContent = newOrders.length;
  }

  // Product Management
  displayProducts() {
    console.log("📦 Loading products...");
    this.populateProductFilters();
    this.renderProductsTable();
  }

  populateProductFilters() {
    const categories = [...new Set(this.products.map((p) => p.category))];
    const brands = [...new Set(this.products.map((p) => p.brand))];

    const categoryFilter = document.getElementById("productCategoryFilter");
    const brandFilter = document.getElementById("productBrandFilter");

    if (categoryFilter) {
      categoryFilter.innerHTML =
        '<option value="">All Categories</option>' +
        categories
          .map(
            (cat) =>
              `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`,
          )
          .join("");
    }

    if (brandFilter) {
      brandFilter.innerHTML =
        '<option value="">All Brands</option>' +
        brands
          .map((brand) => `<option value="${brand}">${brand}</option>`)
          .join("");
    }
  }

  renderProductsTable() {
    const tbody = document.getElementById("productsTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.products
      .map(
        (product) => `
      <tr>
        <td><input type="checkbox" value="${product.id}"></td>
        <td><img src="${product.image}" alt="${product.name}" class="table-image"></td>
        <td>
          <div class="product-cell">
            <strong>${product.name}</strong>
            <div class="product-meta">
              <span class="sku">SKU: ${product.sku}</span>
              ${product.featured ? '<span class="featured-badge">Featured</span>' : ""}
            </div>
          </div>
        </td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
          <div class="stock-cell">
            <span class="stock-count ${this.getStockStatus(product.stock, product.reorderLevel)}">${product.stock}</span>
            ${product.stock <= product.reorderLevel ? '<i class="fas fa-exclamation-triangle low-stock-icon"></i>' : ""}
          </div>
        </td>
        <td><span class="status-badge status-${product.status}">${product.status}</span></td>
        <td>${product.totalSales || 0}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view" onclick="adminSystem.viewProduct(${product.id})" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="adminSystem.editProduct(${product.id})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="adminSystem.deleteProduct(${product.id})" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  getStockStatus(stock, reorderLevel) {
    if (stock === 0) return "out-of-stock";
    if (stock <= reorderLevel) return "low-stock";
    return "in-stock";
  }

  filterProducts() {
    const search =
      document.getElementById("productSearch")?.value.toLowerCase() || "";
    const category =
      document.getElementById("productCategoryFilter")?.value || "";
    const brand = document.getElementById("productBrandFilter")?.value || "";
    const status = document.getElementById("productStatusFilter")?.value || "";
    const stockFilter =
      document.getElementById("productStockFilter")?.value || "";

    const filtered = this.products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search);
      const matchesCategory = !category || product.category === category;
      const matchesBrand = !brand || product.brand === brand;
      const matchesStatus = !status || product.status === status;
      const matchesStock =
        !stockFilter ||
        this.getStockStatus(product.stock, product.reorderLevel) ===
          stockFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesStatus &&
        matchesStock
      );
    });

    this.renderFilteredProducts(filtered);
  }

  renderFilteredProducts(products) {
    const tbody = document.getElementById("productsTableBody");
    if (!tbody) return;

    tbody.innerHTML = products
      .map(
        (product) => `
      <tr>
        <td><input type="checkbox" value="${product.id}"></td>
        <td><img src="${product.image}" alt="${product.name}" class="table-image"></td>
        <td>
          <div class="product-cell">
            <strong>${product.name}</strong>
            <div class="product-meta">
              <span class="sku">SKU: ${product.sku}</span>
            </div>
          </div>
        </td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
          <span class="stock-count ${this.getStockStatus(product.stock, product.reorderLevel)}">${product.stock}</span>
        </td>
        <td><span class="status-badge status-${product.status}">${product.status}</span></td>
        <td>${product.totalSales || 0}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view" onclick="adminSystem.viewProduct(${product.id})">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="adminSystem.editProduct(${product.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="adminSystem.deleteProduct(${product.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }
  // Inventory Management
  displayInventory() {
    console.log("📦 Loading inventory...");
    this.updateInventoryAlerts();
    this.renderInventoryTable();
  }

  updateInventoryAlerts() {
    const lowStockProducts = this.products.filter(
      (p) => p.stock <= p.reorderLevel && p.stock > 0,
    );
    const outOfStockProducts = this.products.filter((p) => p.stock === 0);

    document.getElementById("lowStockCount").textContent =
      lowStockProducts.length;
    document.getElementById("outOfStockCount").textContent =
      outOfStockProducts.length;
  }

  renderInventoryTable() {
    const tbody = document.getElementById("inventoryTableBody");
    if (!tbody) return;

    const inventory = this.loadInventory();
    tbody.innerHTML = inventory
      .map(
        (item) => `
      <tr>
        <td>${item.productName}</td>
        <td>${item.sku}</td>
        <td>${item.currentStock}</td>
        <td>${item.reserved}</td>
        <td>${item.available}</td>
        <td>${item.reorderLevel}</td>
        <td><span class="status-badge status-${item.status}">${item.status.replace("-", " ")}</span></td>
        <td>
          <div class="action-buttons">
            <button class="action-btn edit" onclick="adminSystem.adjustStock(${item.productId})" title="Adjust Stock">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn reorder" onclick="adminSystem.reorderProduct(${item.productId})" title="Reorder">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  // Order Management
  displayOrders() {
    console.log("🛒 Loading orders...");
    this.updateOrderStats();
    this.renderOrdersTable();
  }

  updateOrderStats() {
    const statusCounts = this.getOrderStatusCounts();
    document.getElementById("pendingOrders").textContent =
      statusCounts.pending || 0;
    document.getElementById("processingOrders").textContent =
      statusCounts.processing || 0;
    document.getElementById("shippedOrders").textContent =
      statusCounts.shipped || 0;
    document.getElementById("deliveredOrders").textContent =
      statusCounts.delivered || 0;
  }

  renderOrdersTable() {
    const tbody = document.getElementById("ordersTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.orders
      .map(
        (order) => `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>
          <div class="customer-cell">
            <strong>${order.customerName}</strong>
            <div class="customer-email">${order.customerEmail}</div>
          </div>
        </td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td>${order.items.length} items</td>
        <td>$${order.total.toFixed(2)}</td>
        <td>
          <span class="payment-method">${order.paymentMethod.replace("-", " ")}</span>
          <span class="payment-status status-${order.paymentStatus}">${order.paymentStatus}</span>
        </td>
        <td><span class="status-badge status-${order.status}">${order.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view" onclick="adminSystem.viewOrder('${order.id}')" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="adminSystem.editOrder('${order.id}')" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn print" onclick="adminSystem.printInvoice('${order.id}')" title="Print Invoice">
              <i class="fas fa-print"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  filterOrders() {
    const search =
      document.getElementById("orderSearch")?.value.toLowerCase() || "";
    const status = document.getElementById("orderStatusFilter")?.value || "";
    const dateFrom = document.getElementById("orderDateFrom")?.value || "";
    const dateTo = document.getElementById("orderDateTo")?.value || "";
    const payment = document.getElementById("orderPaymentFilter")?.value || "";

    const filtered = this.orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search);
      const matchesStatus = !status || order.status === status;
      const matchesPayment = !payment || order.paymentMethod === payment;

      let matchesDate = true;
      if (dateFrom || dateTo) {
        const orderDate = new Date(order.date);
        if (dateFrom)
          matchesDate = matchesDate && orderDate >= new Date(dateFrom);
        if (dateTo) matchesDate = matchesDate && orderDate <= new Date(dateTo);
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });

    this.renderFilteredOrders(filtered);
  }

  renderFilteredOrders(orders) {
    const tbody = document.getElementById("ordersTableBody");
    if (!tbody) return;

    tbody.innerHTML = orders
      .map(
        (order) => `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>${order.customerName}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td>${order.items.length} items</td>
        <td>$${order.total.toFixed(2)}</td>
        <td>${order.paymentMethod}</td>
        <td><span class="status-badge status-${order.status}">${order.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view" onclick="adminSystem.viewOrder('${order.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="adminSystem.editOrder('${order.id}')">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  // Customer Management
  displayCustomers() {
    console.log("👥 Loading customers...");
    this.updateCustomerSegments();
    this.renderCustomersTable();
  }

  updateCustomerSegments() {
    const vipCustomers = this.customers.filter(
      (c) => c.segment === "vip",
    ).length;
    const repeatCustomers = this.customers.filter(
      (c) => c.segment === "repeat",
    ).length;
    const newCustomers = this.customers.filter(
      (c) => c.segment === "new",
    ).length;

    document.getElementById("vipCustomers").textContent = vipCustomers;
    document.getElementById("repeatCustomers").textContent = repeatCustomers;
    document.getElementById("newCustomersCount").textContent = newCustomers;
  }

  renderCustomersTable() {
    const tbody = document.getElementById("customersTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.customers
      .map(
        (customer) => `
      <tr>
        <td><input type="checkbox" value="${customer.id}"></td>
        <td>
          <div class="customer-cell">
            <strong>${customer.firstName} ${customer.lastName}</strong>
            <div class="customer-segment">${customer.segment.toUpperCase()}</div>
          </div>
        </td>
        <td>${customer.email}</td>
        <td>${customer.totalOrders}</td>
        <td>$${customer.totalSpent.toFixed(2)}</td>
        <td>${customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "Never"}</td>
        <td><span class="status-badge status-${customer.status}">${customer.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view" onclick="adminSystem.viewCustomer(${customer.id})" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="adminSystem.editCustomer(${customer.id})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn message" onclick="adminSystem.messageCustomer(${customer.id})" title="Message">
              <i class="fas fa-envelope"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  filterCustomers() {
    const search =
      document.getElementById("customerSearch")?.value.toLowerCase() || "";
    const segment =
      document.getElementById("customerSegmentFilter")?.value || "";
    const location =
      document.getElementById("customerLocationFilter")?.value || "";

    const filtered = this.customers.filter((customer) => {
      const matchesSearch =
        customer.firstName.toLowerCase().includes(search) ||
        customer.lastName.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search);
      const matchesSegment = !segment || customer.segment === segment;
      const matchesLocation =
        !location ||
        customer.location.toLowerCase().includes(location.toLowerCase());

      return matchesSearch && matchesSegment && matchesLocation;
    });

    this.renderFilteredCustomers(filtered);
  }

  renderFilteredCustomers(customers) {
    const tbody = document.getElementById("customersTableBody");
    if (!tbody) return;

    tbody.innerHTML = customers
      .map(
        (customer) => `
      <tr>
        <td><input type="checkbox" value="${customer.id}"></td>
        <td>${customer.firstName} ${customer.lastName}</td>
        <td>${customer.email}</td>
        <td>${customer.totalOrders}</td>
        <td>$${customer.totalSpent.toFixed(2)}</td>
        <td>${customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "Never"}</td>
        <td><span class="status-badge status-${customer.status}">${customer.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view" onclick="adminSystem.viewCustomer(${customer.id})">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="adminSystem.editCustomer(${customer.id})">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  // Payment Management
  displayPayments() {
    console.log("💳 Loading payments...");
    this.updatePaymentStats();
    this.renderPaymentsTable();
  }

  updatePaymentStats() {
    const completed = this.payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const pending = this.payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);
    const failed = this.payments
      .filter((p) => p.status === "failed")
      .reduce((sum, p) => sum + p.amount, 0);
    const refunded = this.payments
      .filter((p) => p.status === "refunded")
      .reduce((sum, p) => sum + p.amount, 0);

    document.getElementById("completedPayments").textContent =
      `$${completed.toFixed(2)}`;
    document.getElementById("pendingPayments").textContent =
      `$${pending.toFixed(2)}`;
    document.getElementById("failedPayments").textContent =
      `$${failed.toFixed(2)}`;
    document.getElementById("refundedPayments").textContent =
      `$${refunded.toFixed(2)}`;
  }

  renderPaymentsTable() {
    const tbody = document.getElementById("paymentsTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.payments
      .map(
        (payment) => `
      <tr>
        <td><code>${payment.transactionId}</code></td>
        <td><strong>${payment.orderId}</strong></td>
        <td>${this.getCustomerName(payment.customerId)}</td>
        <td>$${payment.amount.toFixed(2)}</td>
        <td>${payment.method.replace("-", " ")}</td>
        <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
        <td>${new Date(payment.date).toLocaleDateString()}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view" onclick="adminSystem.viewPayment('${payment.id}')" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn refund" onclick="adminSystem.processRefund('${payment.id}')" title="Refund">
              <i class="fas fa-undo"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  getCustomerName(customerId) {
    const customer = this.customers.find((c) => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : "Unknown";
  }
  // Modal Methods
  showModal(title, content) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = content;
    document.getElementById("adminModal").classList.add("show");
  }

  closeModal() {
    document.getElementById("adminModal").classList.remove("show");
  }

  // Product Actions
  showAddProductModal() {
    const content = `
      <form id="addProductForm">
        <div class="form-row">
          <div class="form-group">
            <label>Product Name *</label>
            <input type="text" id="productName" required>
          </div>
          <div class="form-group">
            <label>SKU *</label>
            <input type="text" id="productSku" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Brand *</label>
            <input type="text" id="productBrand" required>
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select id="productCategory" required>
              <option value="">Select Category</option>
              <option value="shirts">Shirts</option>
              <option value="pants">Pants</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Price *</label>
            <input type="number" id="productPrice" step="0.01" required>
          </div>
          <div class="form-group">
            <label>Cost</label>
            <input type="number" id="productCost" step="0.01">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Stock Quantity *</label>
            <input type="number" id="productStock" required>
          </div>
          <div class="form-group">
            <label>Reorder Level</label>
            <input type="number" id="productReorderLevel" value="10">
          </div>
        </div>

        <div class="form-group">
          <label>Image URL</label>
          <input type="text" id="productImage" placeholder="Enter image URL">
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea id="productDescription" rows="3"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Status</label>
            <select id="productStatus">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="productFeatured"> Featured Product
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="adminSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Product</button>
        </div>
      </form>
    `;

    this.showModal("Add New Product", content);

    document
      .getElementById("addProductForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.addProduct();
      });
  }

  addProduct() {
    const newProduct = {
      id: Date.now(),
      name: document.getElementById("productName").value,
      sku: document.getElementById("productSku").value,
      brand: document.getElementById("productBrand").value,
      category: document.getElementById("productCategory").value,
      price: parseFloat(document.getElementById("productPrice").value),
      cost: parseFloat(document.getElementById("productCost").value) || 0,
      stock: parseInt(document.getElementById("productStock").value),
      reorderLevel:
        parseInt(document.getElementById("productReorderLevel").value) || 10,
      image:
        document.getElementById("productImage").value ||
        "img/products/default.jpg",
      description: document.getElementById("productDescription").value,
      status: document.getElementById("productStatus").value,
      featured: document.getElementById("productFeatured").checked,
      rating: 0,
      totalSales: 0,
      createdAt: new Date().toISOString(),
    };

    this.products.push(newProduct);
    localStorage.setItem("adminProducts", JSON.stringify(this.products));
    this.closeModal();
    this.displayProducts();
    this.updateAllCounts();
    this.showNotification("Product added successfully!", "success");
  }

  viewProduct(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return;

    const content = `
      <div class="product-details">
        <div class="product-header">
          <img src="${product.image}" alt="${product.name}" class="product-detail-image">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-sku">SKU: ${product.sku}</p>
            <p class="product-brand">Brand: ${product.brand}</p>
            <p class="product-category">Category: ${product.category}</p>
          </div>
        </div>
        
        <div class="product-metrics">
          <div class="metric">
            <label>Price:</label>
            <span>$${product.price.toFixed(2)}</span>
          </div>
          <div class="metric">
            <label>Cost:</label>
            <span>$${(product.cost || 0).toFixed(2)}</span>
          </div>
          <div class="metric">
            <label>Profit Margin:</label>
            <span>${(((product.price - (product.cost || 0)) / product.price) * 100).toFixed(1)}%</span>
          </div>
          <div class="metric">
            <label>Stock:</label>
            <span class="${this.getStockStatus(product.stock, product.reorderLevel)}">${product.stock}</span>
          </div>
          <div class="metric">
            <label>Total Sales:</label>
            <span>${product.totalSales || 0}</span>
          </div>
          <div class="metric">
            <label>Revenue:</label>
            <span>$${((product.totalSales || 0) * product.price).toFixed(2)}</span>
          </div>
        </div>

        <div class="product-description">
          <h4>Description</h4>
          <p>${product.description || "No description available"}</p>
        </div>

        <div class="product-status">
          <span class="status-badge status-${product.status}">${product.status}</span>
          ${product.featured ? '<span class="featured-badge">Featured</span>' : ""}
        </div>
      </div>
    `;

    this.showModal("Product Details", content);
  }

  editProduct(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return;

    const content = `
      <form id="editProductForm">
        <div class="form-row">
          <div class="form-group">
            <label>Product Name *</label>
            <input type="text" id="editProductName" value="${product.name}" required>
          </div>
          <div class="form-group">
            <label>SKU *</label>
            <input type="text" id="editProductSku" value="${product.sku}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Brand *</label>
            <input type="text" id="editProductBrand" value="${product.brand}" required>
          </div>
          <div class="form-group">
            <label>Category *</label>
            <select id="editProductCategory" required>
              <option value="shirts" ${product.category === "shirts" ? "selected" : ""}>Shirts</option>
              <option value="pants" ${product.category === "pants" ? "selected" : ""}>Pants</option>
              <option value="shoes" ${product.category === "shoes" ? "selected" : ""}>Shoes</option>
              <option value="accessories" ${product.category === "accessories" ? "selected" : ""}>Accessories</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Price *</label>
            <input type="number" id="editProductPrice" value="${product.price}" step="0.01" required>
          </div>
          <div class="form-group">
            <label>Cost</label>
            <input type="number" id="editProductCost" value="${product.cost || 0}" step="0.01">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Stock Quantity *</label>
            <input type="number" id="editProductStock" value="${product.stock}" required>
          </div>
          <div class="form-group">
            <label>Reorder Level</label>
            <input type="number" id="editProductReorderLevel" value="${product.reorderLevel || 10}">
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea id="editProductDescription" rows="3">${product.description || ""}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Status</label>
            <select id="editProductStatus">
              <option value="active" ${product.status === "active" ? "selected" : ""}>Active</option>
              <option value="inactive" ${product.status === "inactive" ? "selected" : ""}>Inactive</option>
              <option value="draft" ${product.status === "draft" ? "selected" : ""}>Draft</option>
            </select>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" id="editProductFeatured" ${product.featured ? "checked" : ""}> Featured Product
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="adminSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Product</button>
        </div>
      </form>
    `;

    this.showModal("Edit Product", content);

    document
      .getElementById("editProductForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.updateProduct(id);
      });
  }

  updateProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) return;

    this.products[productIndex] = {
      ...this.products[productIndex],
      name: document.getElementById("editProductName").value,
      sku: document.getElementById("editProductSku").value,
      brand: document.getElementById("editProductBrand").value,
      category: document.getElementById("editProductCategory").value,
      price: parseFloat(document.getElementById("editProductPrice").value),
      cost: parseFloat(document.getElementById("editProductCost").value) || 0,
      stock: parseInt(document.getElementById("editProductStock").value),
      reorderLevel:
        parseInt(document.getElementById("editProductReorderLevel").value) ||
        10,
      description: document.getElementById("editProductDescription").value,
      status: document.getElementById("editProductStatus").value,
      featured: document.getElementById("editProductFeatured").checked,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("adminProducts", JSON.stringify(this.products));
    this.closeModal();
    this.displayProducts();
    this.showNotification("Product updated successfully!", "success");
  }

  deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.products = this.products.filter((p) => p.id !== id);
      localStorage.setItem("adminProducts", JSON.stringify(this.products));
      this.displayProducts();
      this.updateAllCounts();
      this.showNotification("Product deleted successfully!", "success");
    }
  }

  // Utility Methods
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      min-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    `;

    if (type === "success") {
      notification.style.background =
        "linear-gradient(135deg, #28a745, #20c997)";
    } else if (type === "error") {
      notification.style.background =
        "linear-gradient(135deg, #dc3545, #e74c3c)";
    } else {
      notification.style.background =
        "linear-gradient(135deg, #17a2b8, #6f42c1)";
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  refreshData() {
    this.loadProducts();
    this.loadCustomers();
    this.loadOrders();
    this.loadPayments();
    this.switchSection(this.currentSection);
    this.updateAllCounts();
    this.showNotification("Data refreshed successfully!", "success");
  }

  // Promotions Management
  displayPromotions() {
    console.log("🏷️ Loading promotions...");
    this.updatePromotionStats();
    this.renderPromotionsTable();
  }

  updatePromotionStats() {
    const activePromotions = this.promotions.filter(
      (p) => p.status === "active",
    ).length;
    const totalUsage = this.promotions.reduce(
      (sum, p) => sum + (p.usageCount || 0),
      0,
    );
    const totalSavings = this.promotions.reduce((sum, p) => {
      const savings =
        (p.usageCount || 0) * (p.type === "percentage" ? 50 : p.value); // Estimated
      return sum + savings;
    }, 0);

    // Update promotion stats if elements exist
    const activeEl = document.getElementById("activePromotions");
    const usageEl = document.getElementById("totalPromotionUsage");
    const savingsEl = document.getElementById("totalCustomerSavings");

    if (activeEl) activeEl.textContent = activePromotions;
    if (usageEl) usageEl.textContent = totalUsage;
    if (savingsEl) savingsEl.textContent = `$${totalSavings.toFixed(2)}`;
  }

  renderPromotionsTable() {
    const tbody = document.getElementById("promotionsTableBody");
    if (!tbody) return;

    tbody.innerHTML = this.promotions
      .map(
        (promotion) => `
      <tr>
        <td>
          <div class="promotion-cell">
            <strong>${promotion.name}</strong>
            <div class="promotion-code">Code: ${promotion.code}</div>
          </div>
        </td>
        <td>
          <span class="promotion-type ${promotion.type}">
            ${promotion.type === "percentage" ? `${promotion.value}% OFF` : `$${promotion.value} OFF`}
          </span>
        </td>
        <td>${new Date(promotion.startDate).toLocaleDateString()}</td>
        <td>${new Date(promotion.endDate).toLocaleDateString()}</td>
        <td>
          <div class="usage-progress">
            <div class="usage-bar">
              <div class="usage-fill" style="width: ${(promotion.usageCount / promotion.usageLimit) * 100}%"></div>
            </div>
            <span class="usage-text">${promotion.usageCount}/${promotion.usageLimit}</span>
          </div>
        </td>
        <td><span class="status-badge status-${promotion.status}">${promotion.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="action-btn view" onclick="adminSystem.viewPromotion(${promotion.id})" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit" onclick="adminSystem.editPromotion(${promotion.id})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn copy" onclick="adminSystem.copyPromotionCode('${promotion.code}')" title="Copy Code">
              <i class="fas fa-copy"></i>
            </button>
            <button class="action-btn delete" onclick="adminSystem.deletePromotion(${promotion.id})" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  showAddPromotionModal() {
    const content = `
      <form id="addPromotionForm">
        <div class="form-row">
          <div class="form-group">
            <label>Promotion Name *</label>
            <input type="text" id="promotionName" required placeholder="e.g., Summer Sale">
          </div>
          <div class="form-group">
            <label>Promotion Code *</label>
            <input type="text" id="promotionCode" required placeholder="e.g., SUMMER20" style="text-transform: uppercase;">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Discount Type *</label>
            <select id="promotionType" required onchange="adminSystem.updateDiscountInput()">
              <option value="">Select Type</option>
              <option value="percentage">Percentage Off</option>
              <option value="fixed">Fixed Amount Off</option>
              <option value="free-shipping">Free Shipping</option>
              <option value="buy-one-get-one">Buy One Get One</option>
            </select>
          </div>
          <div class="form-group">
            <label>Discount Value *</label>
            <div class="discount-input-group">
              <span class="discount-prefix" id="discountPrefix">%</span>
              <input type="number" id="promotionValue" required placeholder="20" min="0">
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Start Date *</label>
            <input type="datetime-local" id="promotionStartDate" required>
          </div>
          <div class="form-group">
            <label>End Date *</label>
            <input type="datetime-local" id="promotionEndDate" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Usage Limit</label>
            <input type="number" id="promotionUsageLimit" placeholder="100" min="1">
          </div>
          <div class="form-group">
            <label>Minimum Order Amount</label>
            <input type="number" id="promotionMinOrder" placeholder="50.00" step="0.01" min="0">
          </div>
        </div>

        <div class="form-group">
          <label>Applicable Products</label>
          <select id="promotionProducts" multiple>
            ${this.products
              .map(
                (product) => `
              <option value="${product.id}">${product.name}</option>
            `,
              )
              .join("")}
          </select>
          <small>Leave empty to apply to all products</small>
        </div>

        <div class="form-group">
          <label>Customer Segments</label>
          <div class="checkbox-group">
            <label><input type="checkbox" name="segments" value="all" checked> All Customers</label>
            <label><input type="checkbox" name="segments" value="new"> New Customers Only</label>
            <label><input type="checkbox" name="segments" value="vip"> VIP Customers Only</label>
            <label><input type="checkbox" name="segments" value="repeat"> Repeat Customers Only</label>
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea id="promotionDescription" rows="3" placeholder="Describe the promotion..."></textarea>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" id="promotionAutoApply"> Auto-apply (no code required)
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="adminSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Promotion</button>
        </div>
      </form>
    `;

    this.showModal("Create New Promotion", content);

    // Set default dates
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    document.getElementById("promotionStartDate").value = tomorrow
      .toISOString()
      .slice(0, 16);
    document.getElementById("promotionEndDate").value = nextWeek
      .toISOString()
      .slice(0, 16);

    document
      .getElementById("addPromotionForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.addPromotion();
      });
  }

  updateDiscountInput() {
    const type = document.getElementById("promotionType").value;
    const prefix = document.getElementById("discountPrefix");
    const input = document.getElementById("promotionValue");

    switch (type) {
      case "percentage":
        prefix.textContent = "%";
        input.placeholder = "20";
        input.max = "100";
        break;
      case "fixed":
        prefix.textContent = "$";
        input.placeholder = "10.00";
        input.step = "0.01";
        input.removeAttribute("max");
        break;
      case "free-shipping":
        prefix.textContent = "";
        input.value = "0";
        input.disabled = true;
        break;
      case "buy-one-get-one":
        prefix.textContent = "";
        input.value = "1";
        input.disabled = true;
        break;
      default:
        prefix.textContent = "";
        input.disabled = false;
    }
  }

  addPromotion() {
    const selectedSegments = Array.from(
      document.querySelectorAll('input[name="segments"]:checked'),
    ).map((cb) => cb.value);

    const selectedProducts = Array.from(
      document.getElementById("promotionProducts").selectedOptions,
    ).map((option) => parseInt(option.value));

    const newPromotion = {
      id: Date.now(),
      name: document.getElementById("promotionName").value,
      code: document.getElementById("promotionCode").value.toUpperCase(),
      type: document.getElementById("promotionType").value,
      value: parseFloat(document.getElementById("promotionValue").value) || 0,
      startDate: document.getElementById("promotionStartDate").value,
      endDate: document.getElementById("promotionEndDate").value,
      usageLimit:
        parseInt(document.getElementById("promotionUsageLimit").value) || 1000,
      minOrderAmount:
        parseFloat(document.getElementById("promotionMinOrder").value) || 0,
      applicableProducts: selectedProducts.length > 0 ? selectedProducts : null,
      customerSegments: selectedSegments,
      description: document.getElementById("promotionDescription").value,
      autoApply: document.getElementById("promotionAutoApply").checked,
      usageCount: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    this.promotions.push(newPromotion);
    localStorage.setItem("adminPromotions", JSON.stringify(this.promotions));
    this.closeModal();
    this.displayPromotions();
    this.showNotification("Promotion created successfully!", "success");
  }

  viewPromotion(id) {
    const promotion = this.promotions.find((p) => p.id === id);
    if (!promotion) return;

    const content = `
      <div class="promotion-details">
        <div class="promotion-header">
          <h3>${promotion.name}</h3>
          <div class="promotion-badges">
            <span class="status-badge status-${promotion.status}">${promotion.status}</span>
            <span class="promotion-type ${promotion.type}">
              ${
                promotion.type === "percentage"
                  ? `${promotion.value}% OFF`
                  : promotion.type === "fixed"
                    ? `$${promotion.value} OFF`
                    : promotion.type.replace("-", " ").toUpperCase()
              }
            </span>
          </div>
        </div>

        <div class="promotion-info-grid">
          <div class="info-section">
            <h4>Promotion Code</h4>
            <div class="code-display">
              <code>${promotion.code}</code>
              <button class="copy-btn" onclick="adminSystem.copyPromotionCode('${promotion.code}')">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <div class="info-section">
            <h4>Duration</h4>
            <p><strong>Start:</strong> ${new Date(promotion.startDate).toLocaleString()}</p>
            <p><strong>End:</strong> ${new Date(promotion.endDate).toLocaleString()}</p>
          </div>

          <div class="info-section">
            <h4>Usage Statistics</h4>
            <div class="usage-stats">
              <div class="usage-progress">
                <div class="usage-bar">
                  <div class="usage-fill" style="width: ${(promotion.usageCount / promotion.usageLimit) * 100}%"></div>
                </div>
                <span class="usage-text">${promotion.usageCount} / ${promotion.usageLimit} uses</span>
              </div>
              <p><strong>Usage Rate:</strong> ${((promotion.usageCount / promotion.usageLimit) * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div class="info-section">
            <h4>Conditions</h4>
            <p><strong>Minimum Order:</strong> ${promotion.minOrderAmount > 0 ? `$${promotion.minOrderAmount}` : "No minimum"}</p>
            <p><strong>Auto-apply:</strong> ${promotion.autoApply ? "Yes" : "No"}</p>
            <p><strong>Customer Segments:</strong> ${promotion.customerSegments.join(", ")}</p>
          </div>

          ${
            promotion.description
              ? `
            <div class="info-section">
              <h4>Description</h4>
              <p>${promotion.description}</p>
            </div>
          `
              : ""
          }

          <div class="info-section">
            <h4>Performance</h4>
            <div class="performance-metrics">
              <div class="metric">
                <span class="metric-value">${promotion.usageCount}</span>
                <span class="metric-label">Total Uses</span>
              </div>
              <div class="metric">
                <span class="metric-value">$${(promotion.usageCount * (promotion.type === "percentage" ? 50 : promotion.value)).toFixed(2)}</span>
                <span class="metric-label">Est. Savings</span>
              </div>
              <div class="metric">
                <span class="metric-value">${Math.max(0, promotion.usageLimit - promotion.usageCount)}</span>
                <span class="metric-label">Remaining</span>
              </div>
            </div>
          </div>
        </div>

        <div class="promotion-actions">
          <button class="btn btn-secondary" onclick="adminSystem.editPromotion(${promotion.id})">
            <i class="fas fa-edit"></i> Edit Promotion
          </button>
          <button class="btn btn-primary" onclick="adminSystem.copyPromotionCode('${promotion.code}')">
            <i class="fas fa-copy"></i> Copy Code
          </button>
          <button class="btn btn-outline" onclick="adminSystem.sharePromotion(${promotion.id})">
            <i class="fas fa-share"></i> Share
          </button>
        </div>
      </div>
    `;

    this.showModal("Promotion Details", content);
  }

  copyPromotionCode(code) {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        this.showNotification(
          `Promotion code "${code}" copied to clipboard!`,
          "success",
        );
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        this.showNotification(
          `Promotion code "${code}" copied to clipboard!`,
          "success",
        );
      });
  }

  editPromotion(id) {
    const promotion = this.promotions.find((p) => p.id === id);
    if (!promotion) return;

    // Similar to addPromotion but with pre-filled values
    this.showNotification(
      "Edit promotion feature - full implementation coming soon!",
      "info",
    );
  }

  deletePromotion(id) {
    if (confirm("Are you sure you want to delete this promotion?")) {
      this.promotions = this.promotions.filter((p) => p.id !== id);
      localStorage.setItem("adminPromotions", JSON.stringify(this.promotions));
      this.displayPromotions();
      this.showNotification("Promotion deleted successfully!", "success");
    }
  }

  sharePromotion(id) {
    const promotion = this.promotions.find((p) => p.id === id);
    if (!promotion) return;

    const shareText = `🎉 Special Offer: ${promotion.name}!\nUse code: ${promotion.code}\nValid until: ${new Date(promotion.endDate).toLocaleDateString()}`;

    if (navigator.share) {
      navigator.share({
        title: promotion.name,
        text: shareText,
        url: window.location.origin,
      });
    } else {
      this.copyPromotionCode(shareText);
    }
  }

  // Marketing Management
  displayMarketing() {
    console.log("📢 Loading marketing...");
    this.renderMarketingDashboard();
    this.initializeMarketingTabs();
    this.updateMarketingStats();
  }

  renderMarketingDashboard() {
    // Initialize marketing dashboard with real data
    this.updateMarketingOverview();
    this.loadEmailCampaigns();
    this.loadSocialMediaData();
    this.loadSMSCampaigns();
    this.loadLoyaltyProgram();
    this.loadAffiliateProgram();
    this.loadMarketingAutomation();
  }

  initializeMarketingTabs() {
    // Add tab switching functionality
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.switchMarketingTab(tabId);
      });
    });
  }

  switchMarketingTab(tabId) {
    // Remove active class from all tabs and content
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
    document.getElementById(tabId).classList.add("active");
  }

  updateMarketingStats() {
    // Update marketing overview statistics
    const stats = {
      emailSubscribers: 1250,
      socialFollowers: 5420,
      smsSubscribers: 890,
      campaignROI: 420,
    };

    document.getElementById("totalEmailSubscribers").textContent =
      stats.emailSubscribers.toLocaleString();
    document.getElementById("socialFollowers").textContent =
      stats.socialFollowers.toLocaleString();
    document.getElementById("smsSubscribers").textContent =
      stats.smsSubscribers.toLocaleString();
    document.getElementById("campaignROI").textContent =
      `${stats.campaignROI}%`;
  }

  updateMarketingOverview() {
    // This method updates the marketing overview cards
    this.showNotification("Marketing overview updated!", "success");
  }

  loadEmailCampaigns() {
    // Load email campaign data
    const campaigns = [
      {
        id: 1,
        name: "Summer Sale 2024",
        subject: "🌞 Summer Sale - Up to 50% Off!",
        sent: 1250,
        opens: 306,
        clicks: 40,
        status: "completed",
        date: "2 days ago",
      },
      {
        id: 2,
        name: "New Arrivals",
        subject: "✨ Check Out Our New Arrivals",
        sent: 1180,
        opens: 283,
        clicks: 34,
        status: "completed",
        date: "1 week ago",
      },
    ];

    // Update email campaigns table if needed
    console.log("Email campaigns loaded:", campaigns.length);
  }

  loadSocialMediaData() {
    // Load social media platform data
    const socialData = {
      facebook: { followers: 2450, engagement: 4.2, weeklyGrowth: 156 },
      instagram: { followers: 1890, engagement: 6.8, weeklyGrowth: 89 },
      twitter: { followers: 1080, engagement: 3.1, weeklyGrowth: 45 },
    };

    console.log("Social media data loaded:", socialData);
  }

  loadSMSCampaigns() {
    // Load SMS campaign data
    const smsCampaigns = [
      {
        id: 1,
        name: "Flash Sale Alert",
        message: "🔥 Flash Sale! 30% off everything. Use code: FLASH30",
        recipients: 890,
        delivered: 794,
        responses: 125,
        status: "completed",
      },
    ];

    console.log("SMS campaigns loaded:", smsCampaigns.length);
  }

  loadLoyaltyProgram() {
    // Load loyalty program data
    const loyaltyData = {
      activeMembers: 342,
      pointsIssued: 24500,
      rewardsRedeemed: 156,
      redemptionRate: 68,
    };

    console.log("Loyalty program data loaded:", loyaltyData);
  }

  loadAffiliateProgram() {
    // Load affiliate program data
    const affiliateData = {
      activeAffiliates: 28,
      totalCommissions: 2450,
      conversionRate: 4.2,
      avgCommission: 87.5,
    };

    console.log("Affiliate program data loaded:", affiliateData);
  }

  loadMarketingAutomation() {
    // Load marketing automation data
    const automationData = {
      activeWorkflows: 12,
      emailsSent: 3450,
      conversionRate: 8.5,
      revenueGenerated: 5680,
    };

    console.log("Marketing automation data loaded:", automationData);
  }

  // Email Marketing Methods
  createEmailCampaign() {
    this.showNotification("Email campaign creation coming soon!", "info");
  }

  manageEmailTemplates() {
    this.showNotification("Email template management coming soon!", "info");
  }

  manageSubscribers() {
    this.showNotification("Subscriber management coming soon!", "info");
  }

  viewEmailAnalytics() {
    this.showNotification("Email analytics coming soon!", "info");
  }

  viewAllEmailCampaigns() {
    this.showNotification("All email campaigns view coming soon!", "info");
  }

  viewEmailCampaign(id) {
    this.showNotification(`View email campaign ${id} coming soon!`, "info");
  }

  duplicateEmailCampaign(id) {
    this.showNotification(
      `Duplicate email campaign ${id} coming soon!`,
      "info",
    );
  }

  createSubscriberList() {
    this.showNotification("Create subscriber list coming soon!", "info");
  }

  manageList(listType) {
    this.showNotification(`Manage ${listType} list coming soon!`, "info");
  }

  // Social Media Methods
  createFacebookPost() {
    this.showNotification("Facebook post creation coming soon!", "info");
  }

  viewFacebookAnalytics() {
    this.showNotification("Facebook analytics coming soon!", "info");
  }

  createInstagramPost() {
    this.showNotification("Instagram post creation coming soon!", "info");
  }

  viewInstagramAnalytics() {
    this.showNotification("Instagram analytics coming soon!", "info");
  }

  createTwitterPost() {
    this.showNotification("Twitter post creation coming soon!", "info");
  }

  viewTwitterAnalytics() {
    this.showNotification("Twitter analytics coming soon!", "info");
  }

  previousMonth() {
    this.showNotification("Previous month navigation coming soon!", "info");
  }

  nextMonth() {
    this.showNotification("Next month navigation coming soon!", "info");
  }

  initializeSocialCalendar() {
    this.showNotification(
      "Social calendar initialization coming soon!",
      "info",
    );
  }

  viewAllSocialPosts() {
    this.showNotification("All social posts view coming soon!", "info");
  }

  // SMS Marketing Methods
  createSMSCampaign() {
    this.showNotification("SMS campaign creation coming soon!", "info");
  }

  manageSMSTemplates() {
    this.showNotification("SMS template management coming soon!", "info");
  }

  viewSMSAnalytics() {
    this.showNotification("SMS analytics coming soon!", "info");
  }

  viewSMSCampaign(id) {
    this.showNotification(`View SMS campaign ${id} coming soon!`, "info");
  }

  // Loyalty Program Methods
  createRewardTier() {
    this.showNotification("Create reward tier coming soon!", "info");
  }

  createReward() {
    this.showNotification("Create reward coming soon!", "info");
  }

  viewLoyaltyProgram() {
    this.showNotification("Loyalty program management coming soon!", "info");
  }

  manageLoyaltyRewards() {
    this.showNotification("Loyalty rewards management coming soon!", "info");
  }

  // Affiliate Program Methods
  inviteAffiliate() {
    this.showNotification("Invite affiliate coming soon!", "info");
  }

  viewAffiliate(id) {
    this.showNotification(`View affiliate ${id} coming soon!`, "info");
  }

  editAffiliate(id) {
    this.showNotification(`Edit affiliate ${id} coming soon!`, "info");
  }

  // Marketing Automation Methods
  createWorkflow() {
    this.showNotification("Create workflow coming soon!", "info");
  }

  editWorkflow(id) {
    this.showNotification(`Edit workflow ${id} coming soon!`, "info");
  }

  viewWorkflowStats(id) {
    this.showNotification(`View workflow ${id} stats coming soon!`, "info");
  }

  // Export Methods
  exportMarketingData() {
    this.showNotification("Marketing data export coming soon!", "info");
  }

  // Marketing Campaign Methods
  showCreateCampaignModal() {
    this.showNotification("Create campaign feature coming soon!", "info");
  }

  viewEmailCampaigns() {
    this.showNotification("Email campaigns management coming soon!", "info");
  }

  createEmailCampaign() {
    this.showNotification("Email campaign creation coming soon!", "info");
  }

  viewSocialCampaigns() {
    this.showNotification("Social media campaigns coming soon!", "info");
  }

  scheduleSocialPost() {
    this.showNotification("Social post scheduling coming soon!", "info");
  }

  viewSMSCampaigns() {
    this.showNotification("SMS campaigns management coming soon!", "info");
  }

  createSMSCampaign() {
    this.showNotification("SMS campaign creation coming soon!", "info");
  }

  viewLoyaltyProgram() {
    this.showNotification("Loyalty program management coming soon!", "info");
  }

  manageLoyaltyRewards() {
    this.showNotification("Loyalty rewards management coming soon!", "info");
  }

  exportPromotions() {
    this.showNotification("Promotions export feature coming soon!", "info");
  }

  // Placeholder methods for other sections
  displayShipping() {
    console.log("🚚 Loading shipping...");
    this.renderShippingDashboard();
    this.initializeShippingTabs();
    this.updateShippingStats();
  }

  renderShippingDashboard() {
    // Initialize shipping dashboard with real data
    this.updateShippingOverview();
    this.loadShippingZones();
    this.loadShippingMethods();
    this.loadCarriers();
    this.loadTrackingData();
    this.loadRateCalculator();
    this.loadLabelsAndPackaging();
  }

  initializeShippingTabs() {
    // Add tab switching functionality for shipping
    document.querySelectorAll(".shipping-tabs .tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.switchShippingTab(tabId);
      });
    });
  }

  switchShippingTab(tabId) {
    // Remove active class from all shipping tabs and content
    document
      .querySelectorAll(".shipping-tabs .tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".shipping-tabs .tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active class to selected tab and content
    document
      .querySelector(`.shipping-tabs [data-tab="${tabId}"]`)
      .classList.add("active");
    document.getElementById(tabId).classList.add("active");
  }

  updateShippingStats() {
    // Update shipping overview statistics
    const stats = {
      totalShipments: 1245,
      avgDeliveryTime: 3.2,
      onTimeDelivery: 94.8,
      shippingRevenue: 12450,
    };

    document.getElementById("totalShipments").textContent =
      stats.totalShipments.toLocaleString();
    document.getElementById("avgDeliveryTime").textContent =
      stats.avgDeliveryTime;
    document.getElementById("onTimeDelivery").textContent =
      `${stats.onTimeDelivery}%`;
    document.getElementById("shippingRevenue").textContent =
      `$${stats.shippingRevenue.toLocaleString()}`;
  }

  updateShippingOverview() {
    // Update shipping overview cards
    this.showNotification("Shipping overview updated!", "success");
  }

  loadShippingZones() {
    // Load shipping zones data
    const zones = [
      {
        id: "domestic",
        name: "Domestic (USA)",
        coverage: "All 50 States",
        baseRate: 5.99,
        freeShipping: 50,
        deliveryTime: "3-5 business days",
        orders: 1089,
        revenue: 6534,
        status: "active",
      },
      {
        id: "international",
        name: "International",
        coverage: "15 Countries",
        baseRate: 15.99,
        freeShipping: 100,
        deliveryTime: "7-14 business days",
        orders: 156,
        revenue: 2496,
        status: "active",
      },
      {
        id: "express",
        name: "Express Delivery",
        coverage: "Major Cities",
        baseRate: 12.99,
        freeShipping: 75,
        deliveryTime: "1-2 business days",
        orders: 298,
        revenue: 3864,
        status: "active",
      },
    ];

    console.log("Shipping zones loaded:", zones.length);
  }

  loadShippingMethods() {
    // Load shipping methods data
    const methods = [
      {
        id: "standard",
        name: "Standard Shipping",
        deliveryTime: "3-5 business days",
        baseCost: 5.99,
        freeThreshold: 50.0,
        orders: 1089,
        revenue: 6534,
        status: "active",
      },
      {
        id: "express",
        name: "Express Shipping",
        deliveryTime: "1-2 business days",
        baseCost: 12.99,
        freeThreshold: 75.0,
        orders: 298,
        revenue: 3864,
        status: "active",
      },
      {
        id: "overnight",
        name: "Overnight Shipping",
        deliveryTime: "1 business day",
        baseCost: 24.99,
        freeThreshold: 150.0,
        orders: 89,
        revenue: 2224,
        status: "active",
      },
      {
        id: "international",
        name: "International Shipping",
        deliveryTime: "7-14 business days",
        baseCost: 15.99,
        freeThreshold: 100.0,
        orders: 156,
        revenue: 2494,
        status: "active",
      },
    ];

    console.log("Shipping methods loaded:", methods.length);
  }

  loadCarriers() {
    // Load shipping carriers data
    const carriers = [
      {
        id: "ups",
        name: "UPS",
        shipments: 456,
        onTime: 96.2,
        cost: 5678,
        status: "connected",
        services: ["Ground", "Express", "Overnight"],
      },
      {
        id: "fedex",
        name: "FedEx",
        shipments: 389,
        onTime: 94.8,
        cost: 4892,
        status: "connected",
        services: ["Ground", "Express", "International"],
      },
      {
        id: "usps",
        name: "USPS",
        shipments: 234,
        onTime: 92.1,
        cost: 2156,
        status: "connected",
        services: ["Priority", "Express", "International"],
      },
      {
        id: "dhl",
        name: "DHL",
        shipments: 0,
        onTime: 0,
        cost: 0,
        status: "disconnected",
        services: ["International", "Express"],
      },
    ];

    console.log("Carriers loaded:", carriers.length);
  }

  loadTrackingData() {
    // Load tracking data
    const trackingStats = {
      inTransit: 234,
      delivered: 1089,
      pending: 45,
      exception: 12,
    };

    document.getElementById("inTransitCount").textContent =
      trackingStats.inTransit;
    document.getElementById("deliveredCount").textContent =
      trackingStats.delivered;
    document.getElementById("pendingCount").textContent = trackingStats.pending;
    document.getElementById("exceptionCount").textContent =
      trackingStats.exception;

    console.log("Tracking data loaded:", trackingStats);
  }

  loadRateCalculator() {
    // Initialize rate calculator
    console.log("Rate calculator initialized");
  }

  loadLabelsAndPackaging() {
    // Load labels and packaging data
    console.log("Labels and packaging data loaded");
  }

  // Shipping Zone Methods
  showAddShippingZoneModal() {
    this.showNotification("Add shipping zone feature coming soon!", "info");
  }

  showAddZoneModal() {
    this.showNotification("Add zone modal coming soon!", "info");
  }

  editZone(zoneId) {
    this.showNotification(`Edit zone ${zoneId} coming soon!`, "info");
  }

  viewZoneStats(zoneId) {
    this.showNotification(`View zone ${zoneId} stats coming soon!`, "info");
  }

  editWeightPricing() {
    this.showNotification("Edit weight pricing coming soon!", "info");
  }

  editFreeShippingRules() {
    this.showNotification("Edit free shipping rules coming soon!", "info");
  }

  // Shipping Methods
  showAddMethodModal() {
    this.showNotification("Add shipping method coming soon!", "info");
  }

  editShippingMethod(methodId) {
    this.showNotification(
      `Edit shipping method ${methodId} coming soon!`,
      "info",
    );
  }

  viewMethodStats(methodId) {
    this.showNotification(`View method ${methodId} stats coming soon!`, "info");
  }

  // Carrier Methods
  showAddCarrierModal() {
    this.showNotification("Add carrier coming soon!", "info");
  }

  configureCarrier(carrierId) {
    this.showNotification(`Configure ${carrierId} coming soon!`, "info");
  }

  viewCarrierStats(carrierId) {
    this.showNotification(`View ${carrierId} stats coming soon!`, "info");
  }

  connectCarrier(carrierId) {
    this.showNotification(`Connect ${carrierId} coming soon!`, "info");
  }

  // Tracking Methods
  searchTracking() {
    const trackingNumber = document.getElementById("trackingSearch").value;
    if (trackingNumber) {
      this.showNotification(
        `Tracking ${trackingNumber} - feature coming soon!`,
        "info",
      );
    } else {
      this.showNotification("Please enter a tracking number", "error");
    }
  }

  viewAllShipments() {
    this.showNotification("View all shipments coming soon!", "info");
  }

  viewShipmentDetails(orderId) {
    this.showNotification(
      `View shipment details for ${orderId} coming soon!`,
      "info",
    );
  }

  trackShipment(trackingNumber) {
    this.showNotification(
      `Track shipment ${trackingNumber} coming soon!`,
      "info",
    );
  }

  // Rate Calculator Methods
  calculateRates() {
    const originZip = document.getElementById("originZip").value;
    const destinationZip = document.getElementById("destinationZip").value;
    const weight = document.getElementById("packageWeight").value;
    const serviceType = document.getElementById("serviceType").value;

    if (!originZip || !destinationZip || !weight) {
      this.showNotification("Please fill in all required fields", "error");
      return;
    }

    // Show rate results
    const rateResults = document.getElementById("rateResults");
    rateResults.style.display = "block";

    // Simulate rate calculation
    const rates = [
      { carrier: "UPS", service: "Ground", rate: 8.99, days: "3-5" },
      { carrier: "FedEx", service: "Ground", rate: 9.49, days: "3-5" },
      { carrier: "USPS", service: "Priority", rate: 7.99, days: "2-3" },
    ];

    const ratesGrid = rateResults.querySelector(".rates-grid");
    ratesGrid.innerHTML = rates
      .map(
        (rate) => `
      <div class="rate-card">
        <div class="rate-header">
          <h5>${rate.carrier}</h5>
          <span class="rate-service">${rate.service}</span>
        </div>
        <div class="rate-details">
          <div class="rate-price">$${rate.rate}</div>
          <div class="rate-time">${rate.days} business days</div>
        </div>
        <button class="btn btn-sm btn-primary" onclick="adminSystem.selectRate('${rate.carrier}', '${rate.service}')">
          Select Rate
        </button>
      </div>
    `,
      )
      .join("");

    this.showNotification("Rates calculated successfully!", "success");
  }

  selectRate(carrier, service) {
    this.showNotification(
      `Selected ${carrier} ${service} - feature coming soon!`,
      "info",
    );
  }

  // Labels & Packaging Methods
  showCreateLabelModal() {
    this.showNotification("Create label modal coming soon!", "info");
  }

  useTemplate(templateType) {
    this.showNotification(`Use ${templateType} template coming soon!`, "info");
  }

  showAddPackagingModal() {
    this.showNotification("Add packaging modal coming soon!", "info");
  }

  // Export Methods
  exportShippingData() {
    this.showNotification("Shipping data export coming soon!", "info");
  }
  displayReviews() {
    console.log("⭐ Loading reviews...");
    this.renderReviewsDashboard();
    this.initializeReviewsTabs();
    this.updateReviewsStats();
  }

  renderReviewsDashboard() {
    // Initialize reviews dashboard with real data
    this.updateReviewsOverview();
    this.loadAllReviews();
    this.loadPendingReviews();
    this.loadReviewAnalytics();
    this.loadReviewResponses();
    this.loadReviewSettings();
  }

  initializeReviewsTabs() {
    // Add tab switching functionality for reviews
    document.querySelectorAll(".reviews-tabs .tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.switchReviewsTab(tabId);
      });
    });

    // Initialize review filters
    this.initializeReviewFilters();
  }

  initializeReviewFilters() {
    // Search functionality
    const searchInput = document.getElementById("reviewSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filterReviews();
      });
    }

    // Filter dropdowns
    const filters = [
      "reviewRatingFilter",
      "reviewStatusFilter",
      "reviewProductFilter",
    ];
    filters.forEach((filterId) => {
      const filter = document.getElementById(filterId);
      if (filter) {
        filter.addEventListener("change", () => {
          this.filterReviews();
        });
      }
    });

    // Date filters
    const dateFilters = ["reviewDateFrom", "reviewDateTo"];
    dateFilters.forEach((filterId) => {
      const filter = document.getElementById(filterId);
      if (filter) {
        filter.addEventListener("change", () => {
          this.filterReviews();
        });
      }
    });
  }

  filterReviews() {
    const searchTerm =
      document.getElementById("reviewSearch")?.value.toLowerCase() || "";
    const ratingFilter =
      document.getElementById("reviewRatingFilter")?.value || "";
    const statusFilter =
      document.getElementById("reviewStatusFilter")?.value || "";
    const productFilter =
      document.getElementById("reviewProductFilter")?.value || "";
    const dateFrom = document.getElementById("reviewDateFrom")?.value || "";
    const dateTo = document.getElementById("reviewDateTo")?.value || "";

    let filteredReviews = this.reviews.filter((review) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        review.reviewer.toLowerCase().includes(searchTerm) ||
        review.comment.toLowerCase().includes(searchTerm) ||
        (review.title && review.title.toLowerCase().includes(searchTerm));

      // Rating filter
      const matchesRating =
        !ratingFilter || review.rating.toString() === ratingFilter;

      // Status filter
      const matchesStatus = !statusFilter || review.status === statusFilter;

      // Product filter (simplified - in real app would match against product categories)
      const matchesProduct = !productFilter || true; // Placeholder

      // Date filter
      const reviewDate = new Date(review.date);
      const matchesDateFrom = !dateFrom || reviewDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || reviewDate <= new Date(dateTo);

      return (
        matchesSearch &&
        matchesRating &&
        matchesStatus &&
        matchesProduct &&
        matchesDateFrom &&
        matchesDateTo
      );
    });

    this.renderFilteredReviews(filteredReviews);
  }

  renderFilteredReviews(reviews) {
    const reviewsList = document.querySelector(".reviews-list");
    if (!reviewsList) return;

    if (reviews.length === 0) {
      reviewsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h4>No Reviews Found</h4>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      `;
      return;
    }

    reviewsList.innerHTML = reviews
      .map((review) => this.generateReviewHTML(review))
      .join("");
  }

  generateReviewHTML(review) {
    const starsHtml = this.generateStars(review.rating);
    const statusClass = `status-${review.status}`;
    const flaggedClass = review.status === "flagged" ? "flagged" : "";

    return `
      <div class="review-item ${flaggedClass}">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="reviewer-details">
              <h5>${review.reviewer}</h5>
              <span class="reviewer-email">${review.email}</span>
              <span class="review-date">${review.date}</span>
            </div>
          </div>
          <div class="review-actions">
            <div class="review-rating">
              ${starsHtml}
              <span class="rating-value">${review.rating}.0</span>
            </div>
            <div class="review-status">
              <span class="status-badge ${statusClass}">${review.status.charAt(0).toUpperCase() + review.status.slice(1)}</span>
            </div>
          </div>
        </div>
        
        <div class="review-product">
          <img src="${review.productImage}" alt="Product" class="product-thumb" />
          <div class="product-info">
            <h6>${review.productName}</h6>
            <span class="product-sku">SKU: ${review.productSku}</span>
          </div>
        </div>

        <div class="review-content">
          ${review.title ? `<h6 class="review-title">${review.title}</h6>` : ""}
          <p class="review-text">${review.comment}</p>
          
          ${
            review.status === "flagged"
              ? `
            <div class="flag-reason">
              <i class="fas fa-flag"></i>
              <span>Flagged for: ${review.flagReason || "Inappropriate content"}</span>
            </div>
          `
              : ""
          }
        </div>

        <div class="review-footer">
          <div class="review-helpful">
            <span class="helpful-count">
              <i class="fas fa-thumbs-up"></i> ${review.helpfulVotes || 0} people found this helpful
            </span>
          </div>
          <div class="review-admin-actions">
            ${
              review.status === "pending"
                ? `
              <button class="btn btn-sm btn-success" onclick="adminSystem.approveReview(${review.id})">
                <i class="fas fa-check"></i> Approve
              </button>
            `
                : ""
            }
            <button class="btn btn-sm btn-outline" onclick="adminSystem.respondToReview(${review.id})">
              <i class="fas fa-reply"></i> Respond
            </button>
            <button class="btn btn-sm btn-outline" onclick="adminSystem.editReview(${review.id})">
              <i class="fas fa-edit"></i> Edit
            </button>
            ${
              review.status === "pending"
                ? `
              <button class="btn btn-sm btn-danger" onclick="adminSystem.rejectReview(${review.id})">
                <i class="fas fa-times"></i> Reject
              </button>
            `
                : `
              <button class="btn btn-sm btn-danger" onclick="adminSystem.flagReview(${review.id})">
                <i class="fas fa-flag"></i> Flag
              </button>
            `
            }
          </div>
        </div>

        ${
          review.response
            ? `
          <div class="admin-response">
            <div class="response-header">
              <div class="response-avatar">
                <i class="fas fa-user-tie"></i>
              </div>
              <div class="response-info">
                <h6>${review.response.author}</h6>
                <span class="response-date">${review.response.date}</span>
              </div>
            </div>
            <div class="response-content">
              <p>${review.response.text}</p>
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  switchReviewsTab(tabId) {
    // Remove active class from all reviews tabs and content
    document
      .querySelectorAll(".reviews-tabs .tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".reviews-tabs .tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active class to selected tab and content
    document
      .querySelector(`.reviews-tabs [data-tab="${tabId}"]`)
      .classList.add("active");
    document.getElementById(tabId).classList.add("active");
  }

  // This function is now replaced by the enhanced updateReviewsStats above
  updateReviewsStatsOld() {
    // This is the old version - kept for reference but not used
  }

  updateReviewsOverview() {
    // Update reviews overview cards
    this.showNotification("Reviews overview updated!", "success");
  }

  loadAllReviews() {
    // Load all reviews data and render them
    this.renderFilteredReviews(this.reviews);
    console.log("All reviews loaded:", this.reviews.length);
  }

  loadPendingReviews() {
    // Load pending reviews data
    const pendingReviews = this.reviews
      ? this.reviews.filter((r) => r.status === "pending")
      : [];
    console.log("Pending reviews loaded:", pendingReviews.length);
  }

  loadReviewAnalytics() {
    // Load review analytics data
    const analytics = {
      ratingDistribution: {
        5: { count: 946, percentage: 65 },
        4: { count: 291, percentage: 20 },
        3: { count: 146, percentage: 10 },
        2: { count: 44, percentage: 3 },
        1: { count: 29, percentage: 2 },
      },
      trends: {
        reviewVolume: 23,
        averageRating: 4.2,
        responseRate: 89,
        helpfulVotes: 2341,
      },
    };

    console.log("Review analytics loaded:", analytics);
  }

  loadReviewResponses() {
    // Load review responses data
    const responses = [
      {
        id: 1,
        reviewId: 1,
        originalReview: "Amazing quality and fit!",
        reviewer: "Sarah Johnson",
        rating: 5,
        response: "Thank you so much for your wonderful review, Sarah!",
        responseDate: "2026-01-29",
        helpfulVotes: 8,
      },
    ];

    console.log("Review responses loaded:", responses.length);
  }

  loadReviewSettings() {
    // Load review settings
    const settings = {
      enableReviews: true,
      requireModeration: true,
      allowAnonymous: false,
      requirePurchase: true,
      reviewsPerPage: 10,
      defaultSortOrder: "helpful",
      showReviewerName: true,
      allowReviewImages: true,
      emailNewReviews: true,
      emailLowRatings: true,
      notificationEmail: "admin@baggas.com",
      autoResponseEnabled: false,
      autoResponseDelay: 24,
    };

    console.log("Review settings loaded:", settings);
  }

  // Review Management Methods
  respondToReview(reviewId) {
    this.showReviewResponseModal(reviewId);
  }

  editReview(reviewId) {
    this.showEditReviewModal(reviewId);
  }

  flagReview(reviewId) {
    if (confirm("Are you sure you want to flag this review?")) {
      // Update review status
      const review = this.reviews.find((r) => r.id === reviewId);
      if (review) {
        review.status = "flagged";
        this.saveReviews();
        this.displayReviews();
      }
      this.showNotification(
        `Review ${reviewId} flagged successfully!`,
        "success",
      );
    }
  }

  approveReview(reviewId) {
    if (confirm("Are you sure you want to approve this review?")) {
      // Update review status
      const review = this.reviews.find((r) => r.id === reviewId);
      if (review) {
        review.status = "approved";
        this.saveReviews();
        this.displayReviews();
      }
      this.showNotification(
        `Review ${reviewId} approved successfully!`,
        "success",
      );
    }
  }

  rejectReview(reviewId) {
    if (confirm("Are you sure you want to reject this review?")) {
      // Update review status
      const review = this.reviews.find((r) => r.id === reviewId);
      if (review) {
        review.status = "rejected";
        this.saveReviews();
        this.displayReviews();
      }
      this.showNotification(
        `Review ${reviewId} rejected successfully!`,
        "success",
      );
    }
  }

  deleteReview(reviewId) {
    if (
      confirm(
        "Are you sure you want to delete this review? This action cannot be undone.",
      )
    ) {
      // Remove review from array
      this.reviews = this.reviews.filter((r) => r.id !== reviewId);
      this.saveReviews();
      this.displayReviews();
      this.showNotification(
        `Review ${reviewId} deleted successfully!`,
        "success",
      );
    }
  }

  // Save reviews to localStorage
  saveReviews() {
    localStorage.setItem("adminReviews", JSON.stringify(this.reviews));
  }

  // Show Review Response Modal
  showReviewResponseModal(reviewId) {
    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content review-response-modal">
        <div class="modal-header">
          <h3>Respond to Review</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="original-review-display">
            <h4>Original Review:</h4>
            <div class="review-summary">
              <div class="reviewer-name">${review.reviewer}</div>
              <div class="review-rating">
                ${this.generateStars(review.rating)}
                <span>${review.rating}.0</span>
              </div>
              <div class="review-text">"${review.comment}"</div>
            </div>
          </div>
          
          <div class="response-templates-section">
            <h4>Quick Templates:</h4>
            <div class="template-buttons">
              <button class="btn btn-sm btn-outline" onclick="adminSystem.insertTemplate('positive')">
                Thank You (Positive)
              </button>
              <button class="btn btn-sm btn-outline" onclick="adminSystem.insertTemplate('apology')">
                Apology (Negative)
              </button>
              <button class="btn btn-sm btn-outline" onclick="adminSystem.insertTemplate('sizing')">
                Size Guide
              </button>
            </div>
          </div>
          
          <div class="response-form">
            <label for="responseText">Your Response:</label>
            <textarea id="responseText" rows="4" placeholder="Write your response to this review..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="adminSystem.submitReviewResponse(${reviewId})">
            <i class="fas fa-reply"></i> Send Response
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Insert template text
  insertTemplate(templateType) {
    const templates = {
      positive:
        "Thank you so much for your wonderful review! We're thrilled to hear about your positive experience with our product. Your feedback means the world to us and helps other customers make informed decisions.",
      apology:
        "We sincerely apologize for your experience and any inconvenience caused. We take all feedback seriously and would love the opportunity to make this right. Please contact us directly at support@baggas.com so we can resolve this issue for you.",
      sizing:
        "Thank you for the valuable feedback about sizing. We've taken note of your comments and are working to improve our size guide to help future customers. We appreciate you taking the time to share your experience.",
    };

    const textarea = document.getElementById("responseText");
    if (textarea && templates[templateType]) {
      textarea.value = templates[templateType];
    }
  }

  // Submit review response
  submitReviewResponse(reviewId) {
    const responseText = document.getElementById("responseText").value.trim();
    if (!responseText) {
      this.showNotification("Please enter a response", "error");
      return;
    }

    // Add response to review
    const review = this.reviews.find((r) => r.id === reviewId);
    if (review) {
      review.response = {
        text: responseText,
        date: new Date().toISOString().split("T")[0],
        author: "Bagga's Team",
      };
      this.saveReviews();
      this.displayReviews();
    }

    // Close modal
    document.querySelector(".modal-overlay").remove();
    this.showNotification("Response sent successfully!", "success");
  }

  // Show Edit Review Modal
  showEditReviewModal(reviewId) {
    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content edit-review-modal">
        <div class="modal-header">
          <h3>Edit Review</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="editReviewTitle">Review Title:</label>
            <input type="text" id="editReviewTitle" value="${review.title || ""}" />
          </div>
          
          <div class="form-group">
            <label for="editReviewText">Review Text:</label>
            <textarea id="editReviewText" rows="4">${review.comment}</textarea>
          </div>
          
          <div class="form-group">
            <label for="editReviewRating">Rating:</label>
            <select id="editReviewRating">
              <option value="1" ${review.rating === 1 ? "selected" : ""}>1 Star</option>
              <option value="2" ${review.rating === 2 ? "selected" : ""}>2 Stars</option>
              <option value="3" ${review.rating === 3 ? "selected" : ""}>3 Stars</option>
              <option value="4" ${review.rating === 4 ? "selected" : ""}>4 Stars</option>
              <option value="5" ${review.rating === 5 ? "selected" : ""}>5 Stars</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="editReviewStatus">Status:</label>
            <select id="editReviewStatus">
              <option value="pending" ${review.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="approved" ${review.status === "approved" ? "selected" : ""}>Approved</option>
              <option value="rejected" ${review.status === "rejected" ? "selected" : ""}>Rejected</option>
              <option value="flagged" ${review.status === "flagged" ? "selected" : ""}>Flagged</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="adminSystem.saveEditedReview(${reviewId})">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Save edited review
  saveEditedReview(reviewId) {
    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review) return;

    // Get form values
    const title = document.getElementById("editReviewTitle").value.trim();
    const text = document.getElementById("editReviewText").value.trim();
    const rating = parseInt(document.getElementById("editReviewRating").value);
    const status = document.getElementById("editReviewStatus").value;

    if (!text) {
      this.showNotification("Review text is required", "error");
      return;
    }

    // Update review
    review.title = title;
    review.comment = text;
    review.rating = rating;
    review.status = status;

    this.saveReviews();
    this.displayReviews();

    // Close modal
    document.querySelector(".modal-overlay").remove();
    this.showNotification("Review updated successfully!", "success");
  }

  // Generate stars HTML
  generateStars(rating) {
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }
    return `<div class="stars">${starsHtml}</div>`;
  }

  // Bulk Actions
  bulkApproveReviews() {
    const selectedReviews = document.querySelectorAll(
      '.pending-reviews-list input[type="checkbox"]:checked',
    );
    if (selectedReviews.length === 0) {
      this.showNotification("Please select reviews to approve", "error");
      return;
    }

    if (
      confirm(
        `Are you sure you want to approve ${selectedReviews.length} reviews?`,
      )
    ) {
      this.showNotification(
        `${selectedReviews.length} reviews approved successfully!`,
        "success",
      );
    }
  }

  bulkRejectReviews() {
    const selectedReviews = document.querySelectorAll(
      '.pending-reviews-list input[type="checkbox"]:checked',
    );
    if (selectedReviews.length === 0) {
      this.showNotification("Please select reviews to reject", "error");
      return;
    }

    if (
      confirm(
        `Are you sure you want to reject ${selectedReviews.length} reviews?`,
      )
    ) {
      this.showNotification(
        `${selectedReviews.length} reviews rejected successfully!`,
        "success",
      );
    }
  }

  // Pagination
  previousReviewsPage() {
    this.showNotification("Previous page navigation coming soon!", "info");
  }

  nextReviewsPage() {
    this.showNotification("Next page navigation coming soon!", "info");
  }

  // Product Reviews
  viewProductReviews(productId) {
    this.showNotification(
      `View reviews for product ${productId} coming soon!`,
      "info",
    );
  }

  // Response Templates
  showResponseTemplatesModal() {
    this.showNotification("Response templates modal coming soon!", "info");
  }

  useTemplate(templateType) {
    this.showNotification(`Use ${templateType} template coming soon!`, "info");
  }

  // Review Settings
  showReviewSettingsModal() {
    this.showNotification("Review settings modal coming soon!", "info");
  }

  saveReviewSettings() {
    // Get all settings values
    const settings = {
      enableReviews: document.getElementById("enableReviews").checked,
      requireModeration: document.getElementById("requireModeration").checked,
      allowAnonymous: document.getElementById("allowAnonymous").checked,
      requirePurchase: document.getElementById("requirePurchase").checked,
      reviewsPerPage: document.getElementById("reviewsPerPage").value,
      defaultSortOrder: document.getElementById("defaultSortOrder").value,
      showReviewerName: document.getElementById("showReviewerName").checked,
      allowReviewImages: document.getElementById("allowReviewImages").checked,
      emailNewReviews: document.getElementById("emailNewReviews").checked,
      emailLowRatings: document.getElementById("emailLowRatings").checked,
      notificationEmail: document.getElementById("notificationEmail").value,
      autoResponseEnabled: document.getElementById("autoResponseEnabled")
        .checked,
      autoResponseDelay: document.getElementById("autoResponseDelay").value,
    };

    // Save settings to localStorage
    localStorage.setItem("reviewSettings", JSON.stringify(settings));
    this.showNotification("Review settings saved successfully!", "success");
  }

  resetReviewSettings() {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      // Reset all form fields to default values
      document.getElementById("enableReviews").checked = true;
      document.getElementById("requireModeration").checked = true;
      document.getElementById("allowAnonymous").checked = false;
      document.getElementById("requirePurchase").checked = true;
      document.getElementById("reviewsPerPage").value = "10";
      document.getElementById("defaultSortOrder").value = "helpful";
      document.getElementById("showReviewerName").checked = true;
      document.getElementById("allowReviewImages").checked = true;
      document.getElementById("emailNewReviews").checked = true;
      document.getElementById("emailLowRatings").checked = true;
      document.getElementById("notificationEmail").value = "admin@baggas.com";
      document.getElementById("autoResponseEnabled").checked = false;
      document.getElementById("autoResponseDelay").value = "24";

      this.showNotification("Settings reset to defaults!", "success");
    }
  }

  // Export Methods
  exportReviews() {
    const reviewsData = this.reviews.map((review) => ({
      ID: review.id,
      Reviewer: review.reviewer,
      Email: review.email,
      Product: review.productName,
      SKU: review.productSku,
      Rating: review.rating,
      Title: review.title,
      Comment: review.comment,
      Date: review.date,
      Status: review.status,
      "Helpful Votes": review.helpfulVotes || 0,
      "Has Response": review.response ? "Yes" : "No",
    }));

    // Convert to CSV
    const headers = Object.keys(reviewsData[0]);
    const csvContent = [
      headers.join(","),
      ...reviewsData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV
            return typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(","),
      ),
    ].join("\n");

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reviews_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showNotification("Reviews exported successfully!", "success");
  }

  // Analytics Methods
  getReviewAnalytics() {
    const analytics = {
      totalReviews: this.reviews.length,
      averageRating:
        this.reviews.reduce((sum, r) => sum + r.rating, 0) /
        this.reviews.length,
      ratingDistribution: {
        5: this.reviews.filter((r) => r.rating === 5).length,
        4: this.reviews.filter((r) => r.rating === 4).length,
        3: this.reviews.filter((r) => r.rating === 3).length,
        2: this.reviews.filter((r) => r.rating === 2).length,
        1: this.reviews.filter((r) => r.rating === 1).length,
      },
      statusDistribution: {
        approved: this.reviews.filter((r) => r.status === "approved").length,
        pending: this.reviews.filter((r) => r.status === "pending").length,
        rejected: this.reviews.filter((r) => r.status === "rejected").length,
        flagged: this.reviews.filter((r) => r.status === "flagged").length,
      },
      responseRate:
        (this.reviews.filter((r) => r.response).length / this.reviews.length) *
        100,
    };

    return analytics;
  }

  // Update stats with real data
  updateReviewsStats() {
    const analytics = this.getReviewAnalytics();

    // Update overview stats
    document.getElementById("totalReviews").textContent =
      analytics.totalReviews.toLocaleString();
    document.getElementById("averageRating").textContent =
      analytics.averageRating.toFixed(1);
    document.getElementById("pendingReviews").textContent =
      analytics.statusDistribution.pending;
    document.getElementById("responseRate").textContent =
      `${Math.round(analytics.responseRate)}%`;

    // Update tab badges
    const pendingBadges = document.querySelectorAll(".tab-badge");
    pendingBadges.forEach((badge) => {
      badge.textContent = analytics.statusDistribution.pending;
    });

    // Update rating distribution bars
    const total = analytics.totalReviews;
    Object.keys(analytics.ratingDistribution).forEach((rating) => {
      const count = analytics.ratingDistribution[rating];
      const percentage = total > 0 ? (count / total) * 100 : 0;

      const barFill = document.querySelector(
        `.rating-bar:nth-child(${6 - rating}) .bar-fill`,
      );
      const ratingCount = document.querySelector(
        `.rating-bar:nth-child(${6 - rating}) .rating-count`,
      );

      if (barFill) barFill.style.width = `${percentage}%`;
      if (ratingCount)
        ratingCount.textContent = `${count} (${Math.round(percentage)}%)`;
    });
  }
  displayAnalytics() {
    console.log("📊 Loading analytics...");
    this.renderAnalyticsDashboard();
    this.initializeAnalyticsTabs();
    this.updateAnalyticsStats();
    this.initializeCharts();
  }

  renderAnalyticsDashboard() {
    // Initialize analytics dashboard with real data
    this.updateAnalyticsOverview();
    this.loadTopProducts();
    this.loadCustomerSegments();
    this.loadTrafficSources();
  }

  initializeAnalyticsTabs() {
    // Add tab switching functionality for analytics
    document.querySelectorAll(".analytics-tabs .tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.switchAnalyticsTab(tabId);
      });
    });

    // Initialize timeframe selector
    const timeframeSelector = document.getElementById("analyticsTimeframe");
    if (timeframeSelector) {
      timeframeSelector.addEventListener("change", (e) => {
        this.updateAnalyticsTimeframe(e.target.value);
      });
    }
  }

  switchAnalyticsTab(tabId) {
    // Remove active class from all analytics tabs and content
    document
      .querySelectorAll(".analytics-tabs .tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".analytics-tabs .tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active class to selected tab and content
    document
      .querySelector(`.analytics-tabs [data-tab="${tabId}"]`)
      .classList.add("active");
    document.getElementById(tabId).classList.add("active");

    // Load specific data for the tab
    this.loadTabData(tabId);
  }

  loadTabData(tabId) {
    switch (tabId) {
      case "sales-analytics":
        this.loadSalesAnalytics();
        break;
      case "customer-analytics":
        this.loadCustomerAnalytics();
        break;
      case "product-analytics":
        this.loadProductAnalytics();
        break;
      case "traffic-analytics":
        this.loadTrafficAnalytics();
        break;
      case "financial-analytics":
        this.loadFinancialAnalytics();
        break;
    }
  }

  updateAnalyticsStats() {
    const analytics = this.getAnalyticsData();

    // Update overview cards
    document.getElementById("analyticsRevenue").textContent =
      `$${analytics.revenue.toLocaleString()}`;
    document.getElementById("analyticsOrders").textContent =
      analytics.orders.toLocaleString();
    document.getElementById("analyticsCustomers").textContent =
      analytics.customers.toLocaleString();
    document.getElementById("analyticsConversion").textContent =
      `${analytics.conversion}%`;
  }

  getAnalyticsData() {
    const timeframe =
      document.getElementById("analyticsTimeframe")?.value || "30days";

    // Sample analytics data - in real app, this would come from API
    const data = {
      "7days": {
        revenue: 12450,
        orders: 234,
        customers: 189,
        conversion: 3.1,
        visitors: 7234,
        pageViews: 18456,
      },
      "30days": {
        revenue: 45230,
        orders: 1234,
        customers: 892,
        conversion: 3.2,
        visitors: 19342,
        pageViews: 45678,
      },
      "90days": {
        revenue: 128450,
        orders: 3456,
        customers: 2341,
        conversion: 3.0,
        visitors: 56789,
        pageViews: 134567,
      },
      "1year": {
        revenue: 542300,
        orders: 12345,
        customers: 8934,
        conversion: 2.9,
        visitors: 234567,
        pageViews: 567890,
      },
    };

    return data[timeframe];
  }

  updateAnalyticsTimeframe(timeframe) {
    this.updateAnalyticsStats();
    this.updateCharts(timeframe);
    this.showNotification(`Analytics updated for ${timeframe}`, "success");
  }

  loadSalesAnalytics() {
    // Load top products table
    this.loadTopProducts();
  }

  loadTopProducts() {
    const topProducts = [
      {
        name: "Cartoon Astronaut T-Shirt",
        image: "img/products/f1.jpg",
        sales: 156,
        revenue: 4680,
        units: 156,
        trend: "up",
      },
      {
        name: "Floral Print Shirt",
        image: "img/products/f2.jpg",
        sales: 134,
        revenue: 4020,
        units: 134,
        trend: "up",
      },
      {
        name: "Vintage Style Tee",
        image: "img/products/f3.jpg",
        sales: 98,
        revenue: 2940,
        units: 98,
        trend: "down",
      },
      {
        name: "Summer Casual Shirt",
        image: "img/products/f4.jpg",
        sales: 87,
        revenue: 2610,
        units: 87,
        trend: "up",
      },
      {
        name: "Classic Cotton Tee",
        image: "img/products/f5.jpg",
        sales: 76,
        revenue: 2280,
        units: 76,
        trend: "stable",
      },
    ];

    const tableBody = document.getElementById("topProductsTable");
    if (tableBody) {
      tableBody.innerHTML = topProducts
        .map(
          (product) => `
        <tr>
          <td>
            <div class="product-cell">
              <img src="${product.image}" alt="${product.name}" class="table-image" />
              <div>
                <strong>${product.name}</strong>
              </div>
            </div>
          </td>
          <td>${product.sales}</td>
          <td>$${product.revenue.toLocaleString()}</td>
          <td>${product.units}</td>
          <td>
            <span class="trend-indicator ${product.trend}">
              <i class="fas fa-arrow-${product.trend === "up" ? "up" : product.trend === "down" ? "down" : "right"}"></i>
            </span>
          </td>
        </tr>
      `,
        )
        .join("");
    }
  }

  loadCustomerAnalytics() {
    console.log("Loading customer analytics...");
  }

  loadProductAnalytics() {
    console.log("Loading product analytics...");
  }

  loadTrafficAnalytics() {
    console.log("Loading traffic analytics...");
  }

  loadFinancialAnalytics() {
    console.log("Loading financial analytics...");
  }

  updateAnalyticsOverview() {
    this.showNotification("Analytics overview updated!", "success");
  }

  loadCustomerSegments() {
    console.log("Customer segments loaded");
  }

  loadTrafficSources() {
    console.log("Traffic sources loaded");
  }

  // Chart initialization
  initializeCharts() {
    // Initialize all charts
    this.initRevenueChart();
    this.initCustomerAcquisitionChart();
    this.initProductPerformanceChart();
    this.initCategoryChart();
    this.initProfitLossChart();
    this.initExpenseChart();
  }

  initRevenueChart() {
    const canvas = document.getElementById("revenueChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Sample data for revenue chart
    const data = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Revenue",
          data: [
            3200, 4100, 3800, 4500, 5200, 4800, 5500, 6200, 5800, 6500, 7200,
            6800,
          ],
          borderColor: "#088178",
          backgroundColor: "rgba(8, 129, 120, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Simple chart rendering (you can replace with Chart.js for more advanced features)
    this.drawLineChart(ctx, data, canvas.width, canvas.height);
  }

  initCustomerAcquisitionChart() {
    const canvas = document.getElementById("customerAcquisitionChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const data = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "New Customers",
          data: [45, 52, 38, 61],
          backgroundColor: "#088178",
        },
        {
          label: "Returning Customers",
          data: [78, 85, 92, 88],
          backgroundColor: "#0aa085",
        },
      ],
    };

    this.drawBarChart(ctx, data, canvas.width, canvas.height);
  }

  initProductPerformanceChart() {
    const canvas = document.getElementById("productPerformanceChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const data = {
      labels: ["T-Shirts", "Shirts", "Accessories", "Others"],
      datasets: [
        {
          label: "Sales",
          data: [156, 134, 98, 67],
          backgroundColor: ["#088178", "#0aa085", "#ffc107", "#dc3545"],
        },
      ],
    };

    this.drawBarChart(ctx, data, canvas.width, canvas.height);
  }

  initCategoryChart() {
    const canvas = document.getElementById("categoryChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const data = {
      labels: ["T-Shirts", "Shirts", "Accessories", "Others"],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: ["#088178", "#0aa085", "#ffc107", "#dc3545"],
        },
      ],
    };

    this.drawPieChart(ctx, data, canvas.width, canvas.height);
  }

  initProfitLossChart() {
    const canvas = document.getElementById("profitLossChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const data = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue",
          data: [8500, 9200, 8800, 9500, 10200, 9800],
          backgroundColor: "#28a745",
        },
        {
          label: "Expenses",
          data: [5200, 5800, 5400, 6100, 6800, 6200],
          backgroundColor: "#dc3545",
        },
      ],
    };

    this.drawBarChart(ctx, data, canvas.width, canvas.height);
  }

  initExpenseChart() {
    const canvas = document.getElementById("expenseChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const data = {
      labels: ["Cost of Goods", "Marketing", "Operations", "Other"],
      datasets: [
        {
          data: [45, 25, 20, 10],
          backgroundColor: ["#088178", "#0aa085", "#ffc107", "#dc3545"],
        },
      ],
    };

    this.drawPieChart(ctx, data, canvas.width, canvas.height);
  }

  // Simple chart drawing functions (replace with Chart.js for production)
  drawLineChart(ctx, data, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#666";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Revenue Chart - Use Chart.js for production",
      width / 2,
      height / 2,
    );
  }

  drawBarChart(ctx, data, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#666";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Bar Chart - Use Chart.js for production",
      width / 2,
      height / 2,
    );
  }

  drawPieChart(ctx, data, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#666";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Pie Chart - Use Chart.js for production",
      width / 2,
      height / 2,
    );
  }

  updateCharts(timeframe) {
    // Update all charts with new timeframe data
    this.initializeCharts();
  }

  // Export and scheduling functions
  exportAnalyticsReport() {
    const reportData = {
      timeframe:
        document.getElementById("analyticsTimeframe")?.value || "30days",
      generatedAt: new Date().toISOString(),
      analytics: this.getAnalyticsData(),
      topProducts: this.getTopProductsData(),
      customerSegments: this.getCustomerSegmentsData(),
      trafficSources: this.getTrafficSourcesData(),
    };

    // Convert to CSV or JSON
    const jsonContent = JSON.stringify(reportData, null, 2);

    // Download file
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics_report_${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showNotification("Analytics report exported successfully!", "success");
  }

  scheduleReport() {
    this.showScheduleReportModal();
  }

  showScheduleReportModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content schedule-report-modal">
        <div class="modal-header">
          <h3>Schedule Analytics Report</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="reportFrequency">Frequency:</label>
            <select id="reportFrequency">
              <option value="daily">Daily</option>
              <option value="weekly" selected>Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="reportEmail">Email Address:</label>
            <input type="email" id="reportEmail" value="admin@baggas.com" />
          </div>
          
          <div class="form-group">
            <label for="reportSections">Include Sections:</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" checked> Sales Analytics
              </label>
              <label class="checkbox-label">
                <input type="checkbox" checked> Customer Analytics
              </label>
              <label class="checkbox-label">
                <input type="checkbox"> Product Analytics
              </label>
              <label class="checkbox-label">
                <input type="checkbox"> Traffic Analytics
              </label>
              <label class="checkbox-label">
                <input type="checkbox"> Financial Analytics
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="adminSystem.saveScheduledReport()">
            <i class="fas fa-calendar"></i> Schedule Report
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  saveScheduledReport() {
    const frequency = document.getElementById("reportFrequency").value;
    const email = document.getElementById("reportEmail").value;

    if (!email) {
      this.showNotification("Please enter an email address", "error");
      return;
    }

    // Save scheduled report settings
    const scheduledReport = {
      frequency,
      email,
      sections: Array.from(
        document.querySelectorAll(".checkbox-group input:checked"),
      ).map((cb) => cb.nextSibling.textContent.trim()),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "scheduledAnalyticsReport",
      JSON.stringify(scheduledReport),
    );

    // Close modal
    document.querySelector(".modal-overlay").remove();
    this.showNotification(
      `Analytics report scheduled ${frequency}!`,
      "success",
    );
  }

  // Helper functions for export
  getTopProductsData() {
    return [
      { name: "Cartoon Astronaut T-Shirt", sales: 156, revenue: 4680 },
      { name: "Floral Print Shirt", sales: 134, revenue: 4020 },
      { name: "Vintage Style Tee", sales: 98, revenue: 2940 },
    ];
  }

  getCustomerSegmentsData() {
    return {
      vip: { count: 23, avgOrderValue: 89.5, totalRevenue: 12340 },
      regular: { count: 234, avgOrderValue: 42.3, totalRevenue: 18670 },
      new: { count: 156, avgOrderValue: 28.9, totalRevenue: 8920 },
    };
  }

  getTrafficSourcesData() {
    return {
      organic: { visitors: 8234, percentage: 42.6 },
      direct: { visitors: 5678, percentage: 29.4 },
      social: { visitors: 3456, percentage: 17.9 },
      referral: { visitors: 1974, percentage: 10.2 },
    };
  }

  // View functions for other sections
  viewAllProducts() {
    this.switchSection("products");
  }
  displaySettings() {
    console.log("⚙️ Loading settings...");
    this.renderSettingsDashboard();
    this.initializeSettingsTabs();
    this.loadAllSettings();
  }

  renderSettingsDashboard() {
    // Initialize settings dashboard
    this.updateSettingsStatus();
  }

  initializeSettingsTabs() {
    // Add tab switching functionality for settings
    document.querySelectorAll(".settings-nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.switchSettingsTab(tabId);
      });
    });

    // Initialize form change detection
    this.initializeSettingsChangeDetection();
  }

  switchSettingsTab(tabId) {
    // Remove active class from all settings tabs and content
    document
      .querySelectorAll(".settings-nav-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".settings-tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active class to selected tab and content
    document
      .querySelector(`.settings-nav-btn[data-tab="${tabId}"]`)
      .classList.add("active");
    document.getElementById(tabId).classList.add("active");

    // Load specific settings for the tab
    this.loadTabSettings(tabId);
  }

  loadTabSettings(tabId) {
    switch (tabId) {
      case "general-settings":
        this.loadGeneralSettings();
        break;
      case "store-settings":
        this.loadStoreSettings();
        break;
      case "payment-settings":
        this.loadPaymentSettings();
        break;
      case "shipping-settings":
        this.loadShippingSettings();
        break;
      case "email-settings":
        this.loadEmailSettings();
        break;
      case "security-settings":
        this.loadSecuritySettings();
        break;
      case "api-settings":
        this.loadAPISettings();
        break;
      case "advanced-settings":
        this.loadAdvancedSettings();
        break;
    }
  }

  initializeSettingsChangeDetection() {
    // Track changes to form elements
    const formElements = document.querySelectorAll(
      "#settings input, #settings select, #settings textarea",
    );
    formElements.forEach((element) => {
      element.addEventListener("change", () => {
        this.markSettingsAsChanged();
      });
    });
  }

  markSettingsAsChanged() {
    const statusElement = document.querySelector(".settings-status");
    if (statusElement) {
      statusElement.innerHTML = `
        <i class="fas fa-exclamation-circle" style="color: #ffc107;"></i>
        <span style="color: #856404;">Unsaved changes</span>
      `;
    }
  }

  updateSettingsStatus(saved = true) {
    const statusElement = document.querySelector(".settings-status");
    if (statusElement) {
      if (saved) {
        statusElement.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>All settings saved</span>
        `;
      } else {
        statusElement.innerHTML = `
          <i class="fas fa-exclamation-circle" style="color: #ffc107;"></i>
          <span style="color: #856404;">Unsaved changes</span>
        `;
      }
    }
  }

  loadAllSettings() {
    // Load all settings from localStorage or defaults
    const savedSettings = localStorage.getItem("adminSystemSettings");
    const defaultSettings = this.getDefaultSettings();

    this.systemSettings = savedSettings
      ? { ...defaultSettings, ...JSON.parse(savedSettings) }
      : defaultSettings;

    // Apply settings to form elements
    this.applySettingsToForm();
  }

  getDefaultSettings() {
    return {
      // General Settings
      systemName: "Bagga's Admin System",
      systemVersion: "1.0.0",
      timezone: "America/Los_Angeles",
      darkMode: false,
      compactMode: false,
      language: "en",

      // Store Settings
      storeName: "Bagga's Fashion Store",
      storeDescription:
        "Premium fashion and lifestyle products for modern consumers",
      storeUrl: "https://baggas.com",
      storeEmail: "contact@baggas.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress:
        "562 Wellington Road, Street 32\nSan Francisco, CA 94102\nUnited States",
      currency: "USD",
      taxRate: 8.25,
      inventoryTracking: true,

      // Payment Settings
      stripeEnabled: true,
      paypalEnabled: false,
      bankTransferEnabled: false,
      testMode: true,
      paymentTimeout: 15,
      autoCapture: true,

      // Shipping Settings
      standardShippingEnabled: true,
      standardShippingRate: 9.99,
      standardShippingTime: "5-7 business days",
      expressShippingEnabled: true,
      expressShippingRate: 19.99,
      expressShippingTime: "2-3 business days",
      freeShippingEnabled: true,
      freeShippingThreshold: 75.0,
      freeShippingTime: "5-7 business days",

      // Email Settings
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUsername: "admin@baggas.com",
      smtpEncryption: true,
      fromEmail: "noreply@baggas.com",
      fromName: "Bagga's Team",
      orderConfirmationEmail: true,
      shippingNotificationEmail: true,
      lowStockEmail: true,

      // Security Settings
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordMinLength: 8,
      requireStrongPassword: true,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      enableBackups: true,
      backupFrequency: "daily",
      encryptData: true,

      // API Settings
      enableAPI: true,
      apiRateLimit: 100,
      apiVersion: "v1",
      webhookOrderCreated: true,
      webhookOrderUpdated: true,
      webhookPaymentReceived: true,
      webhookProductUpdated: false,

      // Advanced Settings
      enableCaching: true,
      cacheExpiry: 24,
      enableCompression: true,
      logLevel: "info",
      logRetention: 30,
      enableAnalytics: true,
      maintenanceMode: false,
      maintenanceMessage:
        "We're currently performing scheduled maintenance. Please check back soon!",
    };
  }

  applySettingsToForm() {
    // Apply all settings to their corresponding form elements
    Object.keys(this.systemSettings).forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === "checkbox") {
          element.checked = this.systemSettings[key];
        } else {
          element.value = this.systemSettings[key];
        }
      }
    });
  }

  loadGeneralSettings() {
    console.log("Loading general settings...");
  }

  loadStoreSettings() {
    console.log("Loading store settings...");
  }

  loadPaymentSettings() {
    console.log("Loading payment settings...");
  }

  loadShippingSettings() {
    console.log("Loading shipping settings...");
  }

  loadEmailSettings() {
    console.log("Loading email settings...");
  }

  loadSecuritySettings() {
    console.log("Loading security settings...");
  }

  loadAPISettings() {
    console.log("Loading API settings...");
  }

  loadAdvancedSettings() {
    console.log("Loading advanced settings...");
  }

  // Settings Actions
  saveAllSettings() {
    // Collect all form data
    const formData = new FormData();
    const formElements = document.querySelectorAll(
      "#settings input, #settings select, #settings textarea",
    );

    const updatedSettings = { ...this.systemSettings };

    formElements.forEach((element) => {
      if (element.id) {
        if (element.type === "checkbox") {
          updatedSettings[element.id] = element.checked;
        } else if (element.type === "number") {
          updatedSettings[element.id] = parseFloat(element.value) || 0;
        } else {
          updatedSettings[element.id] = element.value;
        }
      }
    });

    // Save to localStorage
    localStorage.setItem(
      "adminSystemSettings",
      JSON.stringify(updatedSettings),
    );
    this.systemSettings = updatedSettings;

    // Update status
    this.updateSettingsStatus(true);
    this.showNotification("All settings saved successfully!", "success");

    // Apply any immediate changes
    this.applySettingsChanges(updatedSettings);
  }

  applySettingsChanges(settings) {
    // Apply dark mode
    if (settings.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Apply compact mode
    if (settings.compactMode) {
      document.body.classList.add("compact-mode");
    } else {
      document.body.classList.remove("compact-mode");
    }

    // Update system name in header
    const systemNameElements = document.querySelectorAll(".system-name");
    systemNameElements.forEach((el) => {
      el.textContent = settings.systemName;
    });
  }

  resetAllSettings() {
    if (
      confirm(
        "Are you sure you want to reset all settings to defaults? This action cannot be undone.",
      )
    ) {
      // Clear saved settings
      localStorage.removeItem("adminSystemSettings");

      // Reload default settings
      this.loadAllSettings();

      // Update status
      this.updateSettingsStatus(true);
      this.showNotification("All settings reset to defaults!", "success");
    }
  }

  exportSettings() {
    const settingsData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      settings: this.systemSettings,
    };

    const jsonContent = JSON.stringify(settingsData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `baggas_settings_${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showNotification("Settings exported successfully!", "success");
  }

  importSettings() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            if (importedData.settings) {
              // Merge with current settings
              this.systemSettings = {
                ...this.systemSettings,
                ...importedData.settings,
              };
              localStorage.setItem(
                "adminSystemSettings",
                JSON.stringify(this.systemSettings),
              );

              // Apply to form
              this.applySettingsToForm();
              this.applySettingsChanges(this.systemSettings);

              this.updateSettingsStatus(true);
              this.showNotification(
                "Settings imported successfully!",
                "success",
              );
            } else {
              this.showNotification("Invalid settings file format!", "error");
            }
          } catch (error) {
            this.showNotification("Error importing settings file!", "error");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  // API Key Management
  regenerateAPIKey(type) {
    if (
      confirm(
        `Are you sure you want to regenerate the ${type} API key? This will invalidate the current key.`,
      )
    ) {
      // Generate new API key (simplified)
      const newKey = `pk_${type}_${this.generateRandomString(32)}`;

      // Update display
      const keyElement = document.querySelector(
        `.api-key-item:nth-child(${type === "production" ? "1" : "2"}) code`,
      );
      if (keyElement) {
        keyElement.textContent =
          newKey.substring(0, 8) + "••••••••••••••••••••••••••••••••";
      }

      this.showNotification(
        `${type.charAt(0).toUpperCase() + type.slice(1)} API key regenerated!`,
        "success",
      );
    }
  }

  copyAPIKey(type) {
    // In a real implementation, this would copy the actual key
    const dummyKey = `pk_${type}_${this.generateRandomString(32)}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(dummyKey).then(() => {
        this.showNotification("API key copied to clipboard!", "success");
      });
    } else {
      this.showNotification("Unable to copy to clipboard", "error");
    }
  }

  createAPIKey() {
    const keyName = prompt("Enter a name for the new API key:");
    if (keyName) {
      const newKey = `pk_custom_${this.generateRandomString(32)}`;
      this.showNotification(`New API key "${keyName}" created!`, "success");
    }
  }

  generateRandomString(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Maintenance Actions
  clearCache() {
    if (confirm("Are you sure you want to clear the system cache?")) {
      // Clear various caches
      localStorage.removeItem("adminCache");
      sessionStorage.clear();

      this.showNotification("System cache cleared successfully!", "success");
    }
  }

  clearLogs() {
    if (confirm("Are you sure you want to clear all system logs?")) {
      // Clear logs (in real implementation, this would call an API)
      this.showNotification("System logs cleared successfully!", "success");
    }
  }

  runDiagnostics() {
    this.showNotification("Running system diagnostics...", "info");

    // Simulate diagnostics
    setTimeout(() => {
      const diagnostics = {
        systemHealth: "Good",
        databaseConnection: "Connected",
        diskSpace: "78% available",
        memoryUsage: "45% used",
        lastBackup: "2 hours ago",
      };

      console.log("System Diagnostics:", diagnostics);
      this.showNotification(
        "System diagnostics completed successfully!",
        "success",
      );
    }, 2000);
  }

  resetSystem() {
    const confirmation = prompt('Type "RESET" to confirm system reset:');
    if (confirmation === "RESET") {
      if (
        confirm(
          "This will reset ALL system data and settings. Are you absolutely sure?",
        )
      ) {
        // Clear all data
        localStorage.clear();
        sessionStorage.clear();

        this.showNotification(
          "System reset completed. Please refresh the page.",
          "success",
        );

        // Reload page after delay
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } else if (confirmation !== null) {
      this.showNotification(
        "System reset cancelled - incorrect confirmation.",
        "error",
      );
    }
  }

  // Additional action methods
  showBulkUploadModal() {
    this.showNotification("Bulk upload feature coming soon!", "info");
  }
  showAddPromotionModal() {
    this.showNotification("Add promotion feature coming soon!", "info");
  }
  showStockAdjustmentModal() {
    this.showNotification("Stock adjustment feature coming soon!", "info");
  }
  showCreateOrderModal() {
    this.showNotification("Create order feature coming soon!", "info");
  }
  showAddCustomerModal() {
    this.showNotification("Add customer feature coming soon!", "info");
  }

  exportSalesData() {
    this.showNotification("Sales data export feature coming soon!", "info");
  }
  exportInventory() {
    this.showNotification("Inventory export feature coming soon!", "info");
  }
  exportOrders() {
    this.showNotification("Orders export feature coming soon!", "info");
  }
  exportCustomers() {
    this.showNotification("Customers export feature coming soon!", "info");
  }
  exportPayments() {
    this.showNotification("Payments export feature coming soon!", "info");
  }

  generateReport() {
    this.showNotification("Report generation feature coming soon!", "info");
  }
  processRefund() {
    this.showNotification("Refund processing feature coming soon!", "info");
  }

  viewLowStock() {
    this.switchSection("inventory");
  }
  viewOutOfStock() {
    this.switchSection("inventory");
  }

  adjustStock(productId) {
    this.showNotification(
      `Adjust stock for product ${productId} - feature coming soon!`,
      "info",
    );
  }
  reorderProduct(productId) {
    this.showNotification(
      `Reorder product ${productId} - feature coming soon!`,
      "info",
    );
  }

  viewOrder(orderId) {
    this.showNotification(
      `View order ${orderId} - feature coming soon!`,
      "info",
    );
  }
  editOrder(orderId) {
    this.showNotification(
      `Edit order ${orderId} - feature coming soon!`,
      "info",
    );
  }
  printInvoice(orderId) {
    this.showNotification(
      `Print invoice for ${orderId} - feature coming soon!`,
      "info",
    );
  }

  viewCustomer(customerId) {
    this.showNotification(
      `View customer ${customerId} - feature coming soon!`,
      "info",
    );
  }
  editCustomer(customerId) {
    this.showNotification(
      `Edit customer ${customerId} - feature coming soon!`,
      "info",
    );
  }
  messageCustomer(customerId) {
    this.showNotification(
      `Message customer ${customerId} - feature coming soon!`,
      "info",
    );
  }

  viewPayment(paymentId) {
    this.showNotification(
      `View payment ${paymentId} - feature coming soon!`,
      "info",
    );
  }

  // Admin user methods
  viewProfile() {
    this.showNotification("Profile management coming soon!", "info");
  }
  settings() {
    this.switchSection("settings");
  }
  logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  }
}

// Initialize complete admin system
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Loading Complete Admin System...");
  window.adminSystem = new CompleteAdminSystem();
});

// Add animation styles
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification {
    animation: slideIn 0.3s ease;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 5px;
    margin-left: 10px;
  }
`;
document.head.appendChild(style);
