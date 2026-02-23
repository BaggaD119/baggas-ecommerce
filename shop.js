// Integrated Shop System - Works with Admin Panel
class IntegratedShop {
  constructor() {
    this.products = this.loadProducts();
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
    this.productsPerPage = 8;
    this.init();
  }

  // Load products from admin panel or use defaults
  loadProducts() {
    // Try to get products from admin panel
    const adminProducts = localStorage.getItem("adminProducts");
    
    if (adminProducts) {
      // Use admin products and filter only active ones
      const allProducts = JSON.parse(adminProducts);
      return allProducts.filter(product => product.status === 'active');
    }

    // Fallback to default products if no admin data
    const defaultProducts = [
      {
        id: 1,
        name: "Cartoon Astronaut T-Shirt",
        brand: "adidas",
        category: "shirts",
        price: 78,
        image: "img/products/f1.jpg",
        rating: 5,
        description: "Comfortable cotton t-shirt with astronaut design",
        stock: 50,
        status: "active"
      },
      {
        id: 2,
        name: "Floral Print Shirt",
        brand: "nike",
        category: "shirts",
        price: 85,
        image: "img/products/f2.jpg",
        rating: 4,
        description: "Stylish floral print shirt for casual wear",
        stock: 30,
        status: "active"
      },
      {
        id: 3,
        name: "Vintage Denim Shirt",
        brand: "zara",
        category: "shirts",
        price: 92,
        image: "img/products/f3.jpg",
        rating: 5,
        description: "Classic vintage style denim shirt",
        stock: 25,
        status: "active"
      },
      {
        id: 4,
        name: "Tropical Print Shirt",
        brand: "puma",
        category: "shirts",
        price: 67,
        image: "img/products/f4.jpg",
        rating: 4,
        description: "Bright tropical print perfect for summer",
        stock: 40,
        status: "active"
      },
      {
        id: 5,
        name: "Striped Casual Shirt",
        brand: "adidas",
        category: "shirts",
        price: 73,
        image: "img/products/f5.jpg",
        rating: 5,
        description: "Classic striped pattern casual shirt",
        stock: 35,
        status: "active"
      },
      {
        id: 6,
        name: "Geometric Pattern Shirt",
        brand: "nike",
        category: "shirts",
        price: 89,
        image: "img/products/f6.jpg",
        rating: 4,
        description: "Modern geometric pattern design",
        stock: 20,
        status: "active"
      },
      {
        id: 7,
        name: "Plain Cotton T-Shirt",
        brand: "zara",
        category: "shirts",
        price: 45,
        image: "img/products/f7.jpg",
        rating: 5,
        description: "Basic cotton t-shirt in multiple colors",
        stock: 60,
        status: "active"
      },
      {
        id: 8,
        name: "Graphic Print Tee",
        brand: "puma",
        category: "shirts",
        price: 56,
        image: "img/products/f8.jpg",
        rating: 4,
        description: "Cool graphic print t-shirt",
        stock: 45,
        status: "active"
      }
    ];

    // Store default products in localStorage for admin panel
    localStorage.setItem("adminProducts", JSON.stringify(defaultProducts));
    return defaultProducts;
  }

  init() {
    this.setupEventListeners();
    this.displayProducts();
    this.updateFilters();
  }

  setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const brandFilter = document.getElementById("brandFilter");
    const priceFilter = document.getElementById("priceFilter");
    const sortBy = document.getElementById("sortBy");
    const clearFiltersBtn = document.getElementById("clearFilters");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterProducts());
    }
    if (categoryFilter) {
      categoryFilter.addEventListener("change", () => this.filterProducts());
    }
    if (brandFilter) {
      brandFilter.addEventListener("change", () => this.filterProducts());
    }
    if (priceFilter) {
      priceFilter.addEventListener("change", () => this.filterProducts());
    }
    if (sortBy) {
      sortBy.addEventListener("change", () => this.sortProducts());
    }
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => this.clearFilters());
    }
    if (prevPageBtn) {
      prevPageBtn.addEventListener("click", () => this.previousPage());
    }
    if (nextPageBtn) {
      nextPageBtn.addEventListener("click", () => this.nextPage());
    }

    // Listen for admin panel updates
    window.addEventListener('storage', (e) => {
      if (e.key === 'adminProducts') {
        this.refreshProducts();
      }
    });
  }

  refreshProducts() {
    this.products = this.loadProducts();
    this.filterProducts();
  }

  filterProducts() {
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const category = document.getElementById("categoryFilter")?.value || "";
    const brand = document.getElementById("brandFilter")?.value || "";
    const priceRange = document.getElementById("priceFilter")?.value || "";

    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                           product.description.toLowerCase().includes(searchTerm);
      const matchesCategory = !category || product.category === category;
      const matchesBrand = !brand || product.brand.toLowerCase() === brand.toLowerCase();
      const matchesPrice = this.matchesPriceRange(product.price, priceRange);

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    this.currentPage = 1;
    this.displayProducts();
    this.updatePagination();
  }

  matchesPriceRange(price, range) {
    if (!range) return true;
    
    switch (range) {
      case "under-50": return price < 50;
      case "50-100": return price >= 50 && price <= 100;
      case "100-150": return price >= 100 && price <= 150;
      case "over-150": return price > 150;
      default: return true;
    }
  }

  sortProducts() {
    const sortValue = document.getElementById("sortBy")?.value || "";
    
    switch (sortValue) {
      case "price-low":
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "name":
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Default order
        break;
    }
    
    this.displayProducts();
  }

  displayProducts() {
    const container = document.getElementById("productContainer");
    if (!container) return;

    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

    if (productsToShow.length === 0) {
      container.innerHTML = `
        <div class="no-products">
          <i class="fas fa-search"></i>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      `;
      this.updateResultsCount();
      return;
    }

    container.innerHTML = productsToShow.map(product => `
      <div class="pro" onclick="window.location.href='product-detail.html?id=${product.id}'">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='img/products/placeholder.jpg'">
        <div class="des">
          <span>${product.brand}</span>
          <h5>${product.name}</h5>
          <div class="star">
            ${this.generateStars(product.rating || 4)}
          </div>
          <h4>$${product.price}</h4>
          ${product.stock && product.stock <= 10 ? '<span class="low-stock">Low Stock!</span>' : ''}
        </div>
        <a href="#" onclick="event.stopPropagation(); addToCart(${product.id})" class="cart-btn">
          <i class="fal fa-shopping-cart"></i>
        </a>
      </div>
    `).join('');

    this.updateResultsCount();
    this.updatePagination();
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
  }

  updateResultsCount() {
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) {
      resultsCount.textContent = `Showing ${this.filteredProducts.length} products`;
    }
  }

  updatePagination() {
    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageNumbers = document.getElementById("pageNumbers");

    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    if (pageNumbers) {
      let paginationHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
          <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                  onclick="shop.goToPage(${i})">${i}</button>
        `;
      }
      pageNumbers.innerHTML = paginationHTML;
    }
  }

  updateFilters() {
    // Update category filter
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      const categories = [...new Set(this.products.map(p => p.category))];
      categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`).join('');
    }

    // Update brand filter
    const brandFilter = document.getElementById("brandFilter");
    if (brandFilter) {
      const brands = [...new Set(this.products.map(p => p.brand))];
      brandFilter.innerHTML = '<option value="">All Brands</option>' +
        brands.map(brand => `<option value="${brand}">${brand.charAt(0).toUpperCase() + brand.slice(1)}</option>`).join('');
    }
  }

  clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("brandFilter").value = "";
    document.getElementById("priceFilter").value = "";
    document.getElementById("sortBy").value = "";
    this.filterProducts();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.displayProducts();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.displayProducts();
    }
  }

  goToPage(page) {
    this.currentPage = page;
    this.displayProducts();
  }

  // Get product by ID (for cart functionality)
  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id));
  }
}

// Global functions for backward compatibility
function addToCart(productId) {
  const product = window.shop.getProductById(productId);
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }

  // Check stock
  if (product.stock && product.stock <= 0) {
    alert('Sorry, this product is out of stock!');
    return;
  }

  // Get existing cart
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Check if product already in cart
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    // Check if we can add more
    if (product.stock && existingItem.quantity >= product.stock) {
      alert('Cannot add more items. Stock limit reached!');
      return;
    }
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  // Save cart
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count if function exists
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
  
  // Show notification
  showNotification(`${product.name} added to cart!`, 'success');
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.background = '#28a745';
      break;
    case 'error':
      notification.style.background = '#dc3545';
      break;
    case 'warning':
      notification.style.background = '#ffc107';
      notification.style.color = '#333';
      break;
    default:
      notification.style.background = '#17a2b8';
  }
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Initialize shop when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.shop = new IntegratedShop();
  console.log('🛍️ Integrated Shop System Loaded - Connected to Admin Panel');
});