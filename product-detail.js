// Enhanced product data - Integrated with Admin Panel
function loadDetailedProducts() {
  // Try to get products from admin panel
  const adminProducts = localStorage.getItem("adminProducts");
  
  if (adminProducts) {
    const allProducts = JSON.parse(adminProducts);
    const detailedProducts = {};
    
    // Convert admin products to detailed format
    allProducts.forEach(product => {
      if (product.status === 'active') {
        detailedProducts[product.id] = {
          ...product,
          images: product.images || [product.image],
          reviewCount: Math.floor(Math.random() * 200) + 50,
          discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
          colors: product.colors ? product.colors.map(color => ({
            name: color.charAt(0).toUpperCase() + color.slice(1),
            code: getColorCode(color),
            available: true
          })) : [
            { name: "Navy Blue", code: "#1e3a8a", available: true },
            { name: "Black", code: "#000000", available: true },
            { name: "White", code: "#ffffff", available: true }
          ],
          sizes: product.sizes ? product.sizes.map(size => ({
            name: size,
            available: true
          })) : [
            { name: "S", available: true },
            { name: "M", available: true },
            { name: "L", available: true },
            { name: "XL", available: true }
          ],
          specifications: {
            Material: "100% Cotton Blend",
            Care: "Machine wash cold",
            Origin: "Made in USA",
            Weight: "180 GSM"
          },
          detailedDescription: product.description || "High-quality product with excellent craftsmanship."
        };
      }
    });
    
    return detailedProducts;
  }
  
  // Fallback to default detailed products
  return getDefaultDetailedProducts();
}

function getColorCode(colorName) {
  const colorCodes = {
    'black': '#000000',
    'white': '#ffffff',
    'blue': '#1e3a8a',
    'red': '#dc2626',
    'green': '#16a34a',
    'gray': '#6b7280',
    'navy': '#1e3a8a'
  };
  return colorCodes[colorName.toLowerCase()] || '#6b7280';
}

function getDefaultDetailedProducts() {
  return {
    1: {
      id: 1,
      name: "Cartoon Astronaut T-Shirt",
      brand: "Adidas",
      category: "shirts",
      price: 78,
      originalPrice: 98,
      discount: 20,
      images: [
        "img/products/f1.jpg",
        "img/products/f2.jpg",
        "img/products/f3.jpg",
        "img/products/f4.jpg",
      ],
      rating: 5,
      reviewCount: 127,
      stock: 15,
      description:
        "Comfortable and stylish cartoon astronaut t-shirt made from premium cotton blend. Perfect for casual wear and space enthusiasts.",
      detailedDescription: `
              <p>This premium cartoon astronaut t-shirt combines comfort with style, featuring a unique space-themed design that's perfect for casual wear. Made from a high-quality cotton blend, this shirt offers excellent breathability and durability.</p>
              <h4>Key Features:</h4>
              <ul>
                  <li>100% premium cotton blend fabric</li>
                  <li>Unique cartoon astronaut graphic design</li>
                  <li>Pre-shrunk for consistent fit</li>
                  <li>Reinforced seams for durability</li>
                  <li>Machine washable</li>
                  <li>Available in multiple colors and sizes</li>
              </ul>
              <p>Whether you're exploring the cosmos or just running errands, this t-shirt will keep you comfortable and looking great. The vibrant print is fade-resistant and maintains its quality wash after wash.</p>
          `,
      colors: [
        { name: "Navy Blue", code: "#1e3a8a", available: true },
        { name: "Black", code: "#000000", available: true },
        { name: "White", code: "#ffffff", available: true },
        { name: "Gray", code: "#6b7280", available: false },
      ],
      sizes: [
        { name: "XS", available: true },
        { name: "S", available: true },
        { name: "M", available: true },
        { name: "L", available: true },
        { name: "XL", available: true },
        { name: "XXL", available: false },
      ],
      specifications: {
        Material: "100% Cotton Blend",
      Fit: "Regular Fit",
      "Sleeve Type": "Short Sleeve",
      "Neck Type": "Round Neck",
      Pattern: "Graphic Print",
      "Care Instructions": "Machine wash cold, tumble dry low",
      "Country of Origin": "Bangladesh",
      Weight: "180 GSM",
    },
    reviews: [
      {
        name: "John Smith",
        rating: 5,
        date: "2024-01-15",
        text: "Amazing quality t-shirt! The print is vibrant and the fabric feels premium. Highly recommended!",
      },
      {
        name: "Sarah Johnson",
        rating: 4,
        date: "2024-01-10",
        text: "Great design and comfortable fit. The only minor issue is that it runs slightly small, so consider sizing up.",
      },
      {
        name: "Mike Wilson",
        rating: 5,
        date: "2024-01-05",
        text: "Perfect for my space-loving kid! The quality is excellent and it has held up well after multiple washes.",
      },
    ],
  },
  2: {
    id: 2,
    name: "Floral Print Shirt",
    brand: "Nike",
    category: "shirts",
    price: 85,
    originalPrice: 110,
    discount: 23,
    images: [
      "img/products/f2.jpg",
      "img/products/f1.jpg",
      "img/products/f3.jpg",
    ],
    rating: 4,
    reviewCount: 89,
    stock: 8,
    description:
      "Elegant floral print shirt perfect for casual and semi-formal occasions. Made with breathable fabric for all-day comfort.",
    detailedDescription: `
            <p>This elegant floral print shirt brings a touch of nature to your wardrobe. The sophisticated pattern and premium fabric make it suitable for both casual outings and semi-formal events.</p>
            <h4>Key Features:</h4>
            <ul>
                <li>Premium polyester-cotton blend</li>
                <li>Elegant floral print design</li>
                <li>Breathable and moisture-wicking</li>
                <li>Wrinkle-resistant fabric</li>
                <li>Easy care and maintenance</li>
            </ul>
        `,
    colors: [
      { name: "Floral Blue", code: "#3b82f6", available: true },
      { name: "Floral Pink", code: "#ec4899", available: true },
      { name: "Floral Green", code: "#10b981", available: false },
    ],
    sizes: [
      { name: "S", available: true },
      { name: "M", available: true },
      { name: "L", available: true },
      { name: "XL", available: false },
    ],
    specifications: {
      Material: "65% Polyester, 35% Cotton",
      Fit: "Slim Fit",
      "Sleeve Type": "Short Sleeve",
      Pattern: "Floral Print",
      "Care Instructions": "Machine wash warm, hang dry",
      "Country of Origin": "Vietnam",
    },
    reviews: [
      {
        name: "Emma Davis",
        rating: 4,
        date: "2024-01-12",
        text: "Beautiful floral pattern and good quality fabric. Fits well and looks great!",
      },
    ],
  },
  // Add more products as needed
};

// Global variables
let currentProduct = null;
let selectedColor = null;
let selectedSize = null;
let currentImageIndex = 0;

// DOM elements
const mainImg = document.getElementById("mainImg");
const thumbnailContainer = document.getElementById("thumbnailContainer");
const productBrand = document.getElementById("productBrand");
const productTitle = document.getElementById("productTitle");
const productStars = document.getElementById("productStars");
const ratingCount = document.getElementById("ratingCount");
const currentPrice = document.getElementById("currentPrice");
const originalPrice = document.getElementById("originalPrice");
const discountBadge = document.getElementById("discountBadge");
const stockStatus = document.getElementById("stockStatus");
const productDescription = document.getElementById("productDescription");
const colorOptions = document.getElementById("colorOptions");
const sizeOptions = document.getElementById("sizeOptions");
const quantityInput = document.getElementById("quantity");
const addToCartBtn = document.getElementById("addToCartBtn");
const addToWishlistBtn = document.getElementById("addToWishlistBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

// Initialize product detail page
document.addEventListener("DOMContentLoaded", function () {
  // Load detailed products from admin panel or defaults
  const detailedProducts = loadDetailedProducts();
  window.detailedProducts = detailedProducts; // Make it globally available
  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "1"; // Default to product 1 if no ID

  loadProduct(productId);
  setupEventListeners();
  setupTabs();
});

// Load product data
function loadProduct(productId) {
  currentProduct = window.detailedProducts[productId];

  if (!currentProduct) {
    // Redirect to shop if product not found
    window.location.href = "shop.html";
    return;
  }

  updateBreadcrumb();
  updateProductImages();
  updateProductInfo();
  updateProductOptions();
  updateProductTabs();
  loadRelatedProducts();
}

// Update breadcrumb navigation
function updateBreadcrumb() {
  document.getElementById("breadcrumb-category").textContent =
    currentProduct.category.charAt(0).toUpperCase() +
    currentProduct.category.slice(1);
  document.getElementById("breadcrumb-product").textContent =
    currentProduct.name;
}

// Update product images
function updateProductImages() {
  // Set main image
  mainImg.src = currentProduct.images[0];
  mainImg.alt = currentProduct.name;

  // Create thumbnails
  thumbnailContainer.innerHTML = "";
  currentProduct.images.forEach((image, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.innerHTML = `<img src="${image}" alt="Product image ${index + 1}">`;
    thumbnail.addEventListener("click", () => changeMainImage(index));
    thumbnailContainer.appendChild(thumbnail);
  });
}

// Change main image
function changeMainImage(index) {
  currentImageIndex = index;
  mainImg.src = currentProduct.images[index];

  // Update active thumbnail
  document.querySelectorAll(".thumbnail").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
}

// Update product information
function updateProductInfo() {
  productBrand.textContent = currentProduct.brand;
  productTitle.textContent = currentProduct.name;

  // Update rating
  productStars.innerHTML = generateStars(currentProduct.rating);
  ratingCount.textContent = `(${currentProduct.reviewCount} reviews)`;

  // Update pricing
  currentPrice.textContent = `$${currentProduct.price.toFixed(2)}`;

  if (currentProduct.originalPrice > currentProduct.price) {
    originalPrice.textContent = `$${currentProduct.originalPrice.toFixed(2)}`;
    originalPrice.style.display = "inline";
    discountBadge.textContent = `-${currentProduct.discount}%`;
    discountBadge.style.display = "inline";
  } else {
    originalPrice.style.display = "none";
    discountBadge.style.display = "none";
  }

  // Update stock status
  if (currentProduct.stock > 0) {
    stockStatus.innerHTML = '<i class="fas fa-check-circle"></i> In Stock';
    stockStatus.className = "stock-status";
  } else {
    stockStatus.innerHTML = '<i class="fas fa-times-circle"></i> Out of Stock';
    stockStatus.className = "stock-status out-of-stock";
  }

  // Update description
  productDescription.innerHTML = `<p>${currentProduct.description}</p>`;
}

// Update product options
function updateProductOptions() {
  // Update color options
  colorOptions.innerHTML = "";
  currentProduct.colors.forEach((color, index) => {
    const colorOption = document.createElement("div");
    colorOption.className = `color-option ${!color.available ? "unavailable" : ""}`;
    colorOption.style.backgroundColor = color.code;
    colorOption.title = color.name;
    colorOption.addEventListener("click", () => selectColor(index));
    colorOptions.appendChild(colorOption);
  });

  // Update size options
  sizeOptions.innerHTML = "";
  currentProduct.sizes.forEach((size, index) => {
    const sizeOption = document.createElement("div");
    sizeOption.className = `size-option ${!size.available ? "unavailable" : ""}`;
    sizeOption.textContent = size.name;
    if (size.available) {
      sizeOption.addEventListener("click", () => selectSize(index));
    }
    sizeOptions.appendChild(sizeOption);
  });
}

// Select color
function selectColor(index) {
  if (!currentProduct.colors[index].available) return;

  selectedColor = index;
  document.querySelectorAll(".color-option").forEach((option, i) => {
    option.classList.toggle("active", i === index);
  });
  updateAddToCartButton();
}

// Select size
function selectSize(index) {
  if (!currentProduct.sizes[index].available) return;

  selectedSize = index;
  document.querySelectorAll(".size-option").forEach((option, i) => {
    option.classList.toggle("active", i === index);
  });
  updateAddToCartButton();
}

// Update add to cart button state
function updateAddToCartButton() {
  const canAddToCart =
    selectedColor !== null && selectedSize !== null && currentProduct.stock > 0;
  addToCartBtn.disabled = !canAddToCart;
  addToCartBtn.style.opacity = canAddToCart ? "1" : "0.6";
}

// Generate star rating HTML
function generateStars(rating) {
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

// Update product tabs
function updateProductTabs() {
  // Update detailed description
  document.getElementById("detailedDescription").innerHTML =
    currentProduct.detailedDescription;

  // Update specifications
  const specsTable = document.getElementById("specificationsTable");
  specsTable.innerHTML = "";
  Object.entries(currentProduct.specifications).forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "spec-row";
    row.innerHTML = `
            <div class="spec-label">${key}</div>
            <div class="spec-value">${value}</div>
        `;
    specsTable.appendChild(row);
  });

  // Update reviews
  const reviewsContainer = document.getElementById("reviewsContainer");
  reviewsContainer.innerHTML = "";
  currentProduct.reviews.forEach((review) => {
    const reviewElement = document.createElement("div");
    reviewElement.className = "review-item";
    reviewElement.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div class="review-rating">${generateStars(review.rating)}</div>
            <div class="review-text">${review.text}</div>
        `;
    reviewsContainer.appendChild(reviewElement);
  });
}

// Load related products
function loadRelatedProducts() {
  const relatedContainer = document.getElementById("relatedProductsContainer");
  relatedContainer.innerHTML = "";

  // Get other products (in a real app, this would be based on category/tags)
  const relatedIds = Object.keys(detailedProducts)
    .filter((id) => id !== currentProduct.id.toString())
    .slice(0, 4);

  relatedIds.forEach((id) => {
    const product = window.detailedProducts[id];
    if (product) {
      const productElement = createRelatedProductElement(product);
      relatedContainer.appendChild(productElement);
    }
  });
}

// Create related product element
function createRelatedProductElement(product) {
  const productDiv = document.createElement("div");
  productDiv.className = "pro";

  productDiv.innerHTML = `
        <img src="${product.images[0]}" alt="${product.name}">
        <div class="des">
            <span>${product.brand}</span>
            <h5>${product.name}</h5>
            <div class="star">${generateStars(product.rating)}</div>
            <h4>$${product.price.toFixed(2)}</h4>
        </div>
        <a href="product-detail.html?id=${product.id}"><i class="fal fa-shopping-cart cart"></i></a>
    `;

  return productDiv;
}

// Setup event listeners
function setupEventListeners() {
  // Quantity controls
  document.getElementById("decreaseQty").addEventListener("click", () => {
    const qty = parseInt(quantityInput.value);
    if (qty > 1) {
      quantityInput.value = qty - 1;
    }
  });

  document.getElementById("increaseQty").addEventListener("click", () => {
    const qty = parseInt(quantityInput.value);
    const maxQty = Math.min(10, currentProduct.stock);
    if (qty < maxQty) {
      quantityInput.value = qty + 1;
    }
  });

  // Quantity input validation
  quantityInput.addEventListener("change", () => {
    const qty = parseInt(quantityInput.value);
    const maxQty = Math.min(10, currentProduct.stock);
    if (qty < 1) quantityInput.value = 1;
    if (qty > maxQty) quantityInput.value = maxQty;
  });

  // Action buttons
  addToCartBtn.addEventListener("click", addToCart);
  addToWishlistBtn.addEventListener("click", addToWishlist);
  buyNowBtn.addEventListener("click", buyNow);

  // Image zoom
  mainImg.addEventListener("click", openImageZoom);
  document
    .getElementById("imageZoomModal")
    .addEventListener("click", closeImageZoom);
  document
    .querySelector(".close-modal")
    .addEventListener("click", closeImageZoom);
}

// Setup tabs functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Update active button
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update active panel
      tabPanels.forEach((panel) => panel.classList.remove("active"));
      document.getElementById(`${targetTab}-tab`).classList.add("active");
    });
  });
}

// Add to cart functionality
function addToCart() {
  if (selectedColor === null || selectedSize === null) {
    alert("Please select color and size before adding to cart.");
    return;
  }

  const options = {
    color: currentProduct.colors[selectedColor].name,
    size: currentProduct.sizes[selectedSize].name,
    quantity: parseInt(quantityInput.value),
  };

  CartUtils.addToCart(currentProduct, options);
}

// Add to wishlist functionality
function addToWishlist() {
  const wishlistItem = {
    id: currentProduct.id,
    name: currentProduct.name,
    brand: currentProduct.brand,
    price: currentProduct.price,
    image: currentProduct.images[0],
  };

  console.log("Added to wishlist:", wishlistItem);
  alert(`Added ${wishlistItem.name} to wishlist!`);

  // Toggle heart icon
  const heartIcon = addToWishlistBtn.querySelector("i");
  heartIcon.classList.toggle("far");
  heartIcon.classList.toggle("fas");
}

// Buy now functionality
function buyNow() {
  if (selectedColor === null || selectedSize === null) {
    alert("Please select color and size before purchasing.");
    return;
  }

  // In a real application, this would redirect to checkout
  alert("Redirecting to checkout...");
  // window.location.href = 'checkout.html';
}

// Image zoom functionality
function openImageZoom() {
  const modal = document.getElementById("imageZoomModal");
  const zoomedImage = document.getElementById("zoomedImage");

  zoomedImage.src = currentProduct.images[currentImageIndex];
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeImageZoom() {
  const modal = document.getElementById("imageZoomModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Mobile menu functionality (from original script.js)
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
