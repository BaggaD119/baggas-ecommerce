// Advanced Search System
class SearchEngine {
  constructor() {
    this.products = this.loadProducts();
    this.searchHistory = this.loadSearchHistory();
    this.currentResults = [];
    this.currentQuery = "";
    this.currentPage = 1;
    this.resultsPerPage = 12;
    this.searchStartTime = 0;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadInitialSearch();
    this.setupAutoComplete();
    this.displayRecentSearches();
  }

  // Load products data - Integrated with Admin Panel
  loadProducts() {
    // Try to get products from admin panel
    const adminProducts = localStorage.getItem("adminProducts");
    
    if (adminProducts) {
      // Use admin products and filter only active ones
      const allProducts = JSON.parse(adminProducts);
      return allProducts.filter(product => product.status === 'active').map(product => ({
        ...product,
        tags: product.tags || [product.category, product.brand.toLowerCase()],
        inStock: product.stock > 0,
        onSale: product.price < (product.originalPrice || product.price * 1.2)
      }));
    }

    // Fallback to default products
    return [
      {
        id: 1,
        name: "Cartoon Astronaut T-Shirt",
        brand: "Adidas",
        category: "shirts",
        price: 78,
        originalPrice: 98,
        image: "img/products/f1.jpg",
        rating: 5,
        inStock: true,
        onSale: true,
        tags: ["casual", "cotton", "graphic", "space", "astronaut", "summer"],
        description: "Comfortable cotton t-shirt with astronaut design",
      },
      {
        id: 2,
        name: "Floral Print Shirt",
        brand: "Nike",
        category: "shirts",
        price: 85,
        originalPrice: 110,
        image: "img/products/f2.jpg",
        rating: 4,
        inStock: true,
        onSale: true,
        tags: ["floral", "print", "casual", "summer", "colorful"],
        description: "Stylish floral print shirt for casual wear",
      },
      {
        id: 3,
        name: "Vintage Denim Shirt",
        brand: "Zara",
        category: "shirts",
        price: 92,
        originalPrice: 92,
        image: "img/products/f3.jpg",
        rating: 5,
        inStock: true,
        onSale: false,
        tags: ["denim", "vintage", "classic", "blue", "casual"],
        description: "Classic vintage style denim shirt",
      },
      {
        id: 4,
        name: "Tropical Print Shirt",
        brand: "Puma",
        category: "shirts",
        price: 67,
        originalPrice: 67,
        image: "img/products/f4.jpg",
        rating: 4,
        inStock: true,
        onSale: false,
        tags: ["tropical", "print", "summer", "vacation", "colorful"],
        description: "Bright tropical print perfect for summer",
      },
      {
        id: 5,
        name: "Striped Casual Shirt",
        brand: "Adidas",
        category: "shirts",
        price: 73,
        originalPrice: 73,
        image: "img/products/f5.jpg",
        rating: 5,
        inStock: false,
        onSale: false,
        tags: ["striped", "casual", "classic", "pattern"],
        description: "Classic striped pattern casual shirt",
      },
      {
        id: 6,
        name: "Geometric Pattern Shirt",
        brand: "Nike",
        category: "shirts",
        price: 89,
        originalPrice: 89,
        image: "img/products/f6.jpg",
        rating: 4,
        inStock: true,
        onSale: false,
        tags: ["geometric", "pattern", "modern", "design"],
        description: "Modern geometric pattern design",
      },
      {
        id: 7,
        name: "Plain Cotton T-Shirt",
        brand: "Zara",
        category: "shirts",
        price: 45,
        originalPrice: 45,
        image: "img/products/f7.jpg",
        rating: 5,
        inStock: true,
        onSale: false,
        tags: ["plain", "cotton", "basic", "essential", "comfortable"],
        description: "Basic cotton t-shirt in multiple colors",
      },
      {
        id: 8,
        name: "Graphic Print Tee",
        brand: "Puma",
        category: "shirts",
        price: 56,
        originalPrice: 56,
        image: "img/products/f8.jpg",
        rating: 4,
        inStock: true,
        onSale: false,
        tags: ["graphic", "print", "tee", "casual", "cool"],
        description: "Cool graphic print t-shirt",
      },
      {
        id: 9,
        name: "Casual Polo Shirt",
        brand: "Adidas",
        category: "shirts",
        price: 95,
        originalPrice: 95,
        image: "img/products/n1.jpg",
        rating: 5,
        inStock: true,
        onSale: false,
        tags: ["polo", "casual", "smart", "collar", "classic"],
        description: "Classic polo shirt for smart casual look",
      },
      {
        id: 10,
        name: "Henley Neck Shirt",
        brand: "Nike",
        category: "shirts",
        price: 82,
        originalPrice: 82,
        image: "img/products/n2.jpg",
        rating: 4,
        inStock: true,
        onSale: false,
        tags: ["henley", "neck", "casual", "comfortable"],
        description: "Comfortable henley neck design",
      },
      {
        id: 11,
        name: "Button-Up Casual Shirt",
        brand: "Zara",
        category: "shirts",
        price: 108,
        originalPrice: 108,
        image: "img/products/n3.jpg",
        rating: 5,
        inStock: true,
        onSale: false,
        tags: ["button-up", "casual", "smart", "formal"],
        description: "Smart casual button-up shirt",
      },
      {
        id: 12,
        name: "Crew Neck Sweatshirt",
        brand: "Puma",
        category: "shirts",
        price: 125,
        originalPrice: 125,
        image: "img/products/n4.jpg",
        rating: 4,
        inStock: true,
        onSale: false,
        tags: ["crew", "neck", "sweatshirt", "warm", "cozy"],
        description: "Cozy crew neck sweatshirt",
      },
      {
        id: 13,
        name: "V-Neck Cotton Tee",
        brand: "Adidas",
        category: "shirts",
        price: 52,
        originalPrice: 52,
        image: "img/products/n5.jpg",
        rating: 5,
        inStock: true,
        onSale: false,
        tags: ["v-neck", "cotton", "tee", "casual", "comfortable"],
        description: "Classic v-neck cotton t-shirt",
      },
      {
        id: 14,
        name: "Long Sleeve Shirt",
        brand: "Nike",
        category: "shirts",
        price: 98,
        originalPrice: 98,
        image: "img/products/n6.jpg",
        rating: 4,
        inStock: true,
        onSale: false,
        tags: ["long", "sleeve", "casual", "comfortable"],
        description: "Comfortable long sleeve shirt",
      },
      {
        id: 15,
        name: "Pocket T-Shirt",
        brand: "Zara",
        category: "shirts",
        price: 48,
        originalPrice: 48,
        image: "img/products/n7.jpg",
        rating: 5,
        inStock: true,
        onSale: false,
        tags: ["pocket", "tee", "simple", "casual", "basic"],
        description: "Simple pocket t-shirt design",
      },
      {
        id: 16,
        name: "Oversized Hoodie",
        brand: "Puma",
        category: "shirts",
        price: 145,
        originalPrice: 145,
        image: "img/products/n8.jpg",
        rating: 4,
        inStock: true,
        onSale: false,
        tags: ["oversized", "hoodie", "trendy", "comfortable", "warm"],
        description: "Trendy oversized hoodie",
      },
    ];
  }

  // Setup event listeners
  setupEventListeners() {
    const mainSearchInput = document.getElementById("mainSearchInput");
    const searchButton = document.getElementById("searchButton");
    const clearSearchButton = document.getElementById("clearSearchButton");
    const advancedToggle = document.getElementById("advancedSearchToggle");
    const clearAllFilters = document.getElementById("clearAllFilters");
    const viewButtons = document.querySelectorAll(".view-btn");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    // Main search
    if (mainSearchInput) {
      mainSearchInput.addEventListener(
        "input",
        this.debounce(() => {
          this.handleSearch();
          this.updateClearButton();
        }, 300),
      );

      mainSearchInput.addEventListener("keydown", (e) => {
        this.handleKeyNavigation(e);
      });
    }

    if (searchButton) {
      searchButton.addEventListener("click", () => this.handleSearch());
    }

    if (clearSearchButton) {
      clearSearchButton.addEventListener("click", () => this.clearSearch());
    }

    // Advanced filters toggle
    if (advancedToggle) {
      advancedToggle.addEventListener("click", () =>
        this.toggleAdvancedFilters(),
      );
    }

    if (clearAllFilters) {
      clearAllFilters.addEventListener("click", () => this.clearAllFilters());
    }

    // Filter changes
    const filterElements = document.querySelectorAll(
      "#searchCategory, #searchBrand, #searchPriceRange, #searchSort",
    );
    filterElements.forEach((element) => {
      element.addEventListener("change", () => this.handleSearch());
    });

    // Advanced filter changes
    const advancedFilters = document.querySelectorAll(
      "#minPrice, #maxPrice, .rating-filters input, .availability-filters input",
    );
    advancedFilters.forEach((element) => {
      element.addEventListener("change", () => this.handleSearch());
    });

    // Price range sliders
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    if (minPrice && maxPrice) {
      minPrice.addEventListener("input", () => this.updatePriceRange());
      maxPrice.addEventListener("input", () => this.updatePriceRange());
    }

    // View toggle
    viewButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => this.toggleView(e.target.id));
    });

    // Load more
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => this.loadMoreResults());
    }

    // Suggestion tags
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("suggestion-tag")) {
        this.searchFromSuggestion(e.target.dataset.search);
      }
      if (e.target.classList.contains("recent-search-item")) {
        this.searchFromHistory(e.target.textContent.trim());
      }
    });
  }

  // Load initial search from URL parameters
  loadInitialSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q") || "";

    if (query) {
      document.getElementById("mainSearchInput").value = query;
      this.handleSearch();
    } else {
      this.displayAllProducts();
    }
  }

  // Setup autocomplete functionality
  setupAutoComplete() {
    const searchInput = document.getElementById("mainSearchInput");
    const suggestionsContainer = document.getElementById("searchSuggestions");

    if (!searchInput || !suggestionsContainer) return;

    let currentSuggestionIndex = -1;

    searchInput.addEventListener(
      "input",
      this.debounce(() => {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
          const suggestions = this.generateSuggestions(query);
          this.displaySuggestions(suggestions);
          currentSuggestionIndex = -1;
        } else {
          this.hideSuggestions();
        }
      }, 200),
    );

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !suggestionsContainer.contains(e.target)
      ) {
        this.hideSuggestions();
      }
    });
  }

  // Generate search suggestions
  generateSuggestions(query) {
    const suggestions = [];
    const queryLower = query.toLowerCase();

    // Product name suggestions
    this.products.forEach((product) => {
      if (product.name.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: product.name,
          type: "product",
          icon: "fas fa-tshirt",
        });
      }
    });

    // Brand suggestions
    const brands = [...new Set(this.products.map((p) => p.brand))];
    brands.forEach((brand) => {
      if (brand.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: brand,
          type: "brand",
          icon: "fas fa-tag",
        });
      }
    });

    // Category suggestions
    const categories = [...new Set(this.products.map((p) => p.category))];
    categories.forEach((category) => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: category,
          type: "category",
          icon: "fas fa-list",
        });
      }
    });

    // Tag suggestions
    const allTags = [...new Set(this.products.flatMap((p) => p.tags))];
    allTags.forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: tag,
          type: "tag",
          icon: "fas fa-hashtag",
        });
      }
    });

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions.filter(
      (suggestion, index, self) =>
        index === self.findIndex((s) => s.text === suggestion.text),
    );

    return uniqueSuggestions.slice(0, 8);
  }

  // Display search suggestions
  displaySuggestions(suggestions) {
    const container = document.getElementById("searchSuggestions");
    if (!container) return;

    if (suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    container.innerHTML = suggestions
      .map(
        (suggestion) => `
            <div class="suggestion-item" data-text="${suggestion.text}">
                <i class="suggestion-icon ${suggestion.icon}"></i>
                <span class="suggestion-text">${suggestion.text}</span>
                <span class="suggestion-type">${suggestion.type}</span>
            </div>
        `,
      )
      .join("");

    // Add click listeners
    container.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", () => {
        const text = item.dataset.text;
        document.getElementById("mainSearchInput").value = text;
        this.hideSuggestions();
        this.handleSearch();
      });
    });

    container.classList.add("show");
  }

  // Hide suggestions
  hideSuggestions() {
    const container = document.getElementById("searchSuggestions");
    if (container) {
      container.classList.remove("show");
    }
  }

  // Handle keyboard navigation in suggestions
  handleKeyNavigation(e) {
    const suggestions = document.querySelectorAll(".suggestion-item");
    let currentIndex = Array.from(suggestions).findIndex((item) =>
      item.classList.contains("highlighted"),
    );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, suggestions.length - 1);
        this.highlightSuggestion(currentIndex);
        break;
      case "ArrowUp":
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, -1);
        this.highlightSuggestion(currentIndex);
        break;
      case "Enter":
        e.preventDefault();
        if (currentIndex >= 0 && suggestions[currentIndex]) {
          suggestions[currentIndex].click();
        } else {
          this.handleSearch();
        }
        break;
      case "Escape":
        this.hideSuggestions();
        break;
    }
  }

  // Highlight suggestion
  highlightSuggestion(index) {
    const suggestions = document.querySelectorAll(".suggestion-item");
    suggestions.forEach((item, i) => {
      item.classList.toggle("highlighted", i === index);
    });
  }

  // Main search handler
  handleSearch() {
    this.searchStartTime = performance.now();

    const query = document.getElementById("mainSearchInput").value.trim();
    const category = document.getElementById("searchCategory").value;
    const brand = document.getElementById("searchBrand").value;
    const priceRange = document.getElementById("searchPriceRange").value;
    const sortBy = document.getElementById("searchSort").value;

    // Advanced filters
    const minPrice = parseInt(document.getElementById("minPrice")?.value || 0);
    const maxPrice = parseInt(
      document.getElementById("maxPrice")?.value || 500,
    );
    const ratingFilters = Array.from(
      document.querySelectorAll(".rating-filters input:checked"),
    ).map((cb) => parseInt(cb.value));
    const inStockOnly =
      document.getElementById("inStockOnly")?.checked || false;
    const onSaleOnly = document.getElementById("onSaleOnly")?.checked || false;

    this.currentQuery = query;
    this.currentPage = 1;

    // Filter products
    let results = this.products.filter((product) => {
      // Text search
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase()),
        );

      // Category filter
      const matchesCategory = !category || product.category === category;

      // Brand filter
      const matchesBrand =
        !brand || product.brand.toLowerCase() === brand.toLowerCase();

      // Price range filter
      let matchesPriceRange = true;
      if (priceRange) {
        const price = product.price;
        switch (priceRange) {
          case "0-50":
            matchesPriceRange = price >= 0 && price <= 50;
            break;
          case "50-100":
            matchesPriceRange = price > 50 && price <= 100;
            break;
          case "100-200":
            matchesPriceRange = price > 100 && price <= 200;
            break;
          case "200+":
            matchesPriceRange = price > 200;
            break;
        }
      }

      // Advanced price range
      const matchesAdvancedPrice =
        product.price >= minPrice && product.price <= maxPrice;

      // Rating filter
      const matchesRating =
        ratingFilters.length === 0 ||
        ratingFilters.some((rating) => product.rating >= rating);

      // Stock filter
      const matchesStock = !inStockOnly || product.inStock;

      // Sale filter
      const matchesSale = !onSaleOnly || product.onSale;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesBrand &&
        matchesPriceRange &&
        matchesAdvancedPrice &&
        matchesRating &&
        matchesStock &&
        matchesSale
      );
    });

    // Sort results
    results = this.sortResults(results, sortBy, query);

    this.currentResults = results;
    this.displayResults();
    this.updateSearchInfo();
    this.saveSearchHistory(query);
    this.hideSuggestions();
  }

  // Sort search results
  sortResults(results, sortBy, query) {
    switch (sortBy) {
      case "price-low":
        return results.sort((a, b) => a.price - b.price);
      case "price-high":
        return results.sort((a, b) => b.price - a.price);
      case "name-az":
        return results.sort((a, b) => a.name.localeCompare(b.name));
      case "rating":
        return results.sort((a, b) => b.rating - a.rating);
      case "newest":
        return results.sort((a, b) => b.id - a.id);
      case "relevance":
      default:
        // Sort by relevance (exact matches first, then partial matches)
        if (!query) return results;

        return results.sort((a, b) => {
          const queryLower = query.toLowerCase();
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();

          // Exact name matches first
          if (aName === queryLower && bName !== queryLower) return -1;
          if (bName === queryLower && aName !== queryLower) return 1;

          // Name starts with query
          if (aName.startsWith(queryLower) && !bName.startsWith(queryLower))
            return -1;
          if (bName.startsWith(queryLower) && !aName.startsWith(queryLower))
            return 1;

          // Brand matches
          if (
            a.brand.toLowerCase() === queryLower &&
            b.brand.toLowerCase() !== queryLower
          )
            return -1;
          if (
            b.brand.toLowerCase() === queryLower &&
            a.brand.toLowerCase() !== queryLower
          )
            return 1;

          // Rating as tiebreaker
          return b.rating - a.rating;
        });
    }
  }

  // Display search results
  displayResults() {
    const container = document.getElementById("searchResultsGrid");
    const noResults = document.getElementById("noResults");
    const loadMoreSection = document.getElementById("loadMoreSection");

    if (!container) return;

    const startIndex = (this.currentPage - 1) * this.resultsPerPage;
    const endIndex = startIndex + this.resultsPerPage;
    const resultsToShow = this.currentResults.slice(0, endIndex);

    if (this.currentResults.length === 0) {
      container.style.display = "none";
      noResults.style.display = "block";
      loadMoreSection.style.display = "none";
      return;
    }

    container.style.display = "grid";
    noResults.style.display = "none";

    container.innerHTML = resultsToShow
      .map((product) => this.createProductElement(product))
      .join("");

    // Show/hide load more button
    if (loadMoreSection) {
      loadMoreSection.style.display =
        endIndex < this.currentResults.length ? "block" : "none";
    }

    // Add fade-in animation
    container.querySelectorAll(".pro").forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
      element.classList.add("fade-in");
    });
  }

  // Create product element HTML
  createProductElement(product) {
    const stars = this.generateStars(product.rating);
    const highlightedName = this.highlightSearchTerm(
      product.name,
      this.currentQuery,
    );

    return `
            <div class="pro" data-product-id="${product.id}">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </a>
                <div class="des">
                    <span>${product.brand}</span>
                    <h5><a href="product-detail.html?id=${product.id}" style="text-decoration: none; color: inherit;">${highlightedName}</a></h5>
                    <div class="star">${stars}</div>
                    <div class="price-container">
                        <h4>$${product.price.toFixed(2)}</h4>
                        ${product.originalPrice > product.price ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ""}
                    </div>
                    ${!product.inStock ? '<div class="out-of-stock">Out of Stock</div>' : ""}
                    ${product.onSale ? '<div class="sale-badge">Sale</div>' : ""}
                </div>
                <a href="#" onclick="CartUtils.addToCart({id: ${product.id}, name: '${product.name}', brand: '${product.brand}', price: ${product.price}, image: '${product.image}'})">
                    <i class="fal fa-shopping-cart cart"></i>
                </a>
            </div>
        `;
  }

  // Generate star rating HTML
  generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<i class="fas fa-star"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    return stars;
  }

  // Highlight search terms in text
  highlightSearchTerm(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  // Update search information
  updateSearchInfo() {
    const searchTime = (
      (performance.now() - this.searchStartTime) /
      1000
    ).toFixed(3);

    document.getElementById("searchQuery").textContent =
      `"${this.currentQuery}"`;
    document.getElementById("searchResultsCount").textContent =
      `(${this.currentResults.length} results)`;
    document.getElementById("resultsFound").textContent =
      `${this.currentResults.length} products found`;
    document.getElementById("searchTime").textContent =
      `Search completed in ${searchTime} seconds`;
  }

  // Display all products (default view)
  displayAllProducts() {
    this.currentResults = this.products;
    this.currentQuery = "";
    this.displayResults();

    document.getElementById("searchQuery").textContent = '"All Products"';
    document.getElementById("searchResultsCount").textContent =
      `(${this.products.length} results)`;
    document.getElementById("resultsFound").textContent =
      `${this.products.length} products found`;
    document.getElementById("searchTime").textContent = "";
  }

  // Load more results
  loadMoreResults() {
    this.currentPage++;
    this.displayResults();
  }

  // Toggle view (grid/list)
  toggleView(viewId) {
    const gridView = document.getElementById("gridView");
    const listView = document.getElementById("listView");
    const resultsGrid = document.getElementById("searchResultsGrid");

    if (viewId === "listView") {
      listView.classList.add("active");
      gridView.classList.remove("active");
      resultsGrid.classList.add("list-view");
    } else {
      gridView.classList.add("active");
      listView.classList.remove("active");
      resultsGrid.classList.remove("list-view");
    }
  }

  // Toggle advanced filters
  toggleAdvancedFilters() {
    const panel = document.getElementById("advancedFiltersPanel");
    const button = document.getElementById("advancedSearchToggle");

    if (panel.classList.contains("show")) {
      panel.classList.remove("show");
      button.innerHTML = '<i class="fas fa-sliders-h"></i> Advanced Filters';
    } else {
      panel.classList.add("show");
      button.innerHTML = '<i class="fas fa-sliders-h"></i> Hide Filters';
    }
  }

  // Update price range display
  updatePriceRange() {
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    const minValue = document.getElementById("minPriceValue");
    const maxValue = document.getElementById("maxPriceValue");

    if (minPrice && maxPrice && minValue && maxValue) {
      minValue.textContent = minPrice.value;
      maxValue.textContent = maxPrice.value;

      // Ensure min is not greater than max
      if (parseInt(minPrice.value) > parseInt(maxPrice.value)) {
        minPrice.value = maxPrice.value;
        minValue.textContent = maxPrice.value;
      }

      this.handleSearch();
    }
  }

  // Clear search
  clearSearch() {
    document.getElementById("mainSearchInput").value = "";
    this.updateClearButton();
    this.displayAllProducts();
    this.hideSuggestions();
  }

  // Update clear button visibility
  updateClearButton() {
    const input = document.getElementById("mainSearchInput");
    const clearBtn = document.getElementById("clearSearchButton");

    if (input && clearBtn) {
      if (input.value.trim()) {
        clearBtn.classList.add("show");
      } else {
        clearBtn.classList.remove("show");
      }
    }
  }

  // Clear all filters
  clearAllFilters() {
    document.getElementById("mainSearchInput").value = "";
    document.getElementById("searchCategory").value = "";
    document.getElementById("searchBrand").value = "";
    document.getElementById("searchPriceRange").value = "";
    document.getElementById("searchSort").value = "relevance";

    // Advanced filters
    document.getElementById("minPrice").value = 0;
    document.getElementById("maxPrice").value = 500;
    document.getElementById("minPriceValue").textContent = "0";
    document.getElementById("maxPriceValue").textContent = "500";

    document
      .querySelectorAll(".rating-filters input")
      .forEach((cb) => (cb.checked = false));
    document
      .querySelectorAll(".availability-filters input")
      .forEach((cb) => (cb.checked = false));

    this.updateClearButton();
    this.displayAllProducts();
  }

  // Search from suggestion
  searchFromSuggestion(query) {
    document.getElementById("mainSearchInput").value = query;
    this.handleSearch();
  }

  // Search from history
  searchFromHistory(query) {
    document.getElementById("mainSearchInput").value = query;
    this.handleSearch();
  }

  // Save search to history
  saveSearchHistory(query) {
    if (!query || query.length < 2) return;

    // Remove if already exists
    this.searchHistory = this.searchHistory.filter((item) => item !== query);

    // Add to beginning
    this.searchHistory.unshift(query);

    // Keep only last 10 searches
    this.searchHistory = this.searchHistory.slice(0, 10);

    // Save to localStorage
    localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));

    this.displayRecentSearches();
  }

  // Load search history
  loadSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem("searchHistory") || "[]");
    } catch {
      return [];
    }
  }

  // Display recent searches
  displayRecentSearches() {
    const container = document.getElementById("recentSearches");
    if (!container || this.searchHistory.length === 0) {
      document.getElementById("search-history").style.display = "none";
      return;
    }

    document.getElementById("search-history").style.display = "block";

    container.innerHTML = this.searchHistory
      .map(
        (search) => `
            <div class="recent-search-item">
                <i class="fas fa-history"></i>
                ${search}
            </div>
        `,
      )
      .join("");
  }

  // Debounce utility
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize search engine
let searchEngine;

document.addEventListener("DOMContentLoaded", function () {
  searchEngine = new SearchEngine();
});

// Global search function for other pages
function performGlobalSearch(query) {
  if (query.trim()) {
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  }
}

// Mobile menu functionality
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}
