// Reviews Page JavaScript
class ReviewsPage {
  constructor() {
    this.reviews = [];
    this.currentPage = 1;
    this.reviewsPerPage = 6;
    this.filteredReviews = [];
    this.init();
  }

  init() {
    this.loadReviews();
    this.setupEventListeners();
    this.renderReviews();
  }

  loadReviews() {
    // Sample reviews data - in a real app, this would come from an API
    this.reviews = [
      {
        id: 1,
        reviewer: "Sarah Johnson",
        rating: 5,
        title: "Amazing quality and fit!",
        content:
          "I absolutely love this t-shirt! The material is so soft and comfortable, and the print quality is excellent. It fits perfectly and hasn't faded after multiple washes. Highly recommend!",
        date: "2026-01-28",
        productName: "Cartoon Astronaut T-Shirt",
        productImage: "img/products/f1.jpg",
        helpfulVotes: 12,
        verified: true,
        images: ["img/products/f1.jpg"],
      },
      {
        id: 2,
        reviewer: "Mike Chen",
        rating: 4,
        title: "Great design, fast shipping",
        content:
          "Love the design and colors! Shipping was super fast and the packaging was nice. Only minor issue is that it's a bit thinner than expected, but still good quality overall.",
        date: "2026-01-27",
        productName: "Floral Print Shirt",
        productImage: "img/products/f2.jpg",
        helpfulVotes: 8,
        verified: true,
        images: [],
      },
      {
        id: 3,
        reviewer: "Emma Wilson",
        rating: 5,
        title: "Perfect for summer!",
        content:
          "Exactly what I was looking for! The fabric is breathable and perfect for hot weather. The fit is true to size and the color hasn't faded after several washes.",
        date: "2026-01-25",
        productName: "Lightweight Summer Shirt",
        productImage: "img/products/f3.jpg",
        helpfulVotes: 15,
        verified: true,
        images: ["img/products/f3.jpg", "img/products/f4.jpg"],
      },
      {
        id: 4,
        reviewer: "David Rodriguez",
        rating: 4,
        title: "Good value for money",
        content:
          "Nice shirt with good quality fabric. The print is vibrant and hasn't cracked. Delivery was on time. Would definitely order again.",
        date: "2026-01-24",
        productName: "Vintage Style Tee",
        productImage: "img/products/f4.jpg",
        helpfulVotes: 6,
        verified: true,
        images: [],
      },
      {
        id: 5,
        reviewer: "Lisa Thompson",
        rating: 3,
        title: "Decent shirt, but sizing runs small",
        content:
          "The shirt looks nice and the pattern is attractive. However, I ordered a Large but it fits more like a Medium. The material is good quality though. Would recommend ordering a size up.",
        date: "2026-01-23",
        productName: "Classic Cotton Tee",
        productImage: "img/products/f5.jpg",
        helpfulVotes: 4,
        verified: true,
        images: [],
      },
      {
        id: 6,
        reviewer: "James Wilson",
        rating: 5,
        title: "Exceeded expectations!",
        content:
          "This shirt is fantastic! The quality is much better than I expected for the price. The fabric feels premium and the fit is perfect. Will definitely be ordering more colors.",
        date: "2026-01-22",
        productName: "Premium Cotton Shirt",
        productImage: "img/products/f6.jpg",
        helpfulVotes: 18,
        verified: true,
        images: ["img/products/f6.jpg"],
      },
      {
        id: 7,
        reviewer: "Maria Garcia",
        rating: 4,
        title: "Love the style!",
        content:
          "Beautiful shirt with a unique design. The colors are vibrant and the material is comfortable. Shipping was quick and packaging was eco-friendly.",
        date: "2026-01-21",
        productName: "Artistic Print Tee",
        productImage: "img/products/f7.jpg",
        helpfulVotes: 9,
        verified: true,
        images: [],
      },
      {
        id: 8,
        reviewer: "Robert Kim",
        rating: 5,
        title: "Outstanding quality",
        content:
          "I've ordered several shirts from Bagga's and they never disappoint. This one is particularly well-made with attention to detail. The stitching is perfect and the fabric is top-notch.",
        date: "2026-01-20",
        productName: "Designer Collection Shirt",
        productImage: "img/products/f8.jpg",
        helpfulVotes: 22,
        verified: true,
        images: ["img/products/f8.jpg", "img/products/n1.jpg"],
      },
    ];

    this.filteredReviews = [...this.reviews];
  }

  setupEventListeners() {
    // Rating filter
    document.getElementById("ratingFilter").addEventListener("change", (e) => {
      this.filterReviews();
    });

    // Sort filter
    document.getElementById("sortFilter").addEventListener("change", (e) => {
      this.sortReviews();
    });
  }

  filterReviews() {
    const ratingFilter = document.getElementById("ratingFilter").value;

    this.filteredReviews = this.reviews.filter((review) => {
      if (ratingFilter && review.rating.toString() !== ratingFilter) {
        return false;
      }
      return true;
    });

    this.currentPage = 1;
    this.sortReviews();
  }

  sortReviews() {
    const sortFilter = document.getElementById("sortFilter").value;

    switch (sortFilter) {
      case "newest":
        this.filteredReviews.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        break;
      case "oldest":
        this.filteredReviews.sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        break;
      case "highest":
        this.filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        this.filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        this.filteredReviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
        break;
    }

    this.renderReviews();
  }

  renderReviews() {
    const reviewsGrid = document.getElementById("reviewsGrid");
    const startIndex = 0;
    const endIndex = this.currentPage * this.reviewsPerPage;
    const reviewsToShow = this.filteredReviews.slice(startIndex, endIndex);

    reviewsGrid.innerHTML = reviewsToShow
      .map((review) => this.createReviewCard(review))
      .join("");

    // Update load more button visibility
    const loadMoreBtn = document.querySelector(".load-more button");
    if (endIndex >= this.filteredReviews.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-block";
    }
  }

  createReviewCard(review) {
    const stars = this.generateStars(review.rating);
    const reviewImages =
      review.images && review.images.length > 0
        ? `<div class="review-images">
                ${review.images.map((img) => `<img src="${img}" alt="Review Image" class="review-image" onclick="openImageModal('${img}')">`).join("")}
               </div>`
        : "";

    return `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${review.reviewer.charAt(0).toUpperCase()}
                        </div>
                        <div class="reviewer-details">
                            <h4>${review.reviewer}</h4>
                            <div class="review-date">${this.formatDate(review.date)}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">${review.rating}.0</span>
                    </div>
                </div>

                <div class="review-product">
                    <img src="${review.productImage}" alt="${review.productName}" class="product-image">
                    <div class="product-name">${review.productName}</div>
                </div>

                <div class="review-content">
                    <h5>${review.title}</h5>
                    <p class="review-text">${review.content}</p>
                    ${reviewImages}
                </div>

                <div class="review-footer">
                    <div class="helpful-votes">
                        <i class="fas fa-thumbs-up"></i>
                        ${review.helpfulVotes} people found this helpful
                    </div>
                    ${review.verified ? '<span class="verified-purchase">Verified Purchase</span>' : ""}
                </div>
            </div>
        `;
  }

  generateStars(rating) {
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }
    return starsHtml;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  loadMore() {
    this.currentPage++;
    this.renderReviews();
  }
}

// Initialize the reviews page
let reviewsPage;
document.addEventListener("DOMContentLoaded", () => {
  reviewsPage = new ReviewsPage();
});

// Global function for load more button
function loadMoreReviews() {
  reviewsPage.loadMore();
}

// Image modal functionality
function openImageModal(imageSrc) {
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close" onclick="closeImageModal()">&times;</span>
            <img src="${imageSrc}" alt="Review Image" class="modal-image">
        </div>
    `;

  // Add modal styles
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;

  const content = modal.querySelector(".image-modal-content");
  content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;

  const closeBtn = modal.querySelector(".image-modal-close");
  closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 30px;
        cursor: pointer;
        z-index: 1001;
    `;

  const image = modal.querySelector(".modal-image");
  image.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
    `;

  document.body.appendChild(modal);

  // Close on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeImageModal();
    }
  });
}

function closeImageModal() {
  const modal = document.querySelector(".image-modal");
  if (modal) {
    modal.remove();
  }
}

// Add CSS animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
