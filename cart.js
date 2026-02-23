// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.coupons = {
            'SAVE10': { discount: 10, type: 'percentage', minAmount: 50 },
            'SAVE20': { discount: 20, type: 'percentage', minAmount: 100 },
            'FREESHIP': { discount: 10, type: 'fixed', minAmount: 0 },
            'WELCOME15': { discount: 15, type: 'percentage', minAmount: 75 }
        };
        this.appliedCoupon = null;
        this.taxRate = 0.08; // 8% tax
        this.freeShippingThreshold = 50;
        this.shippingCost = 10;
        
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.updateCartBadge();
        this.setupEventListeners();
        this.loadRecommendedProducts();
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('shoppingCart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
            this.updateCartBadge();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add item to cart
    addItem(product, options = {}) {
        const cartItem = {
            id: `${product.id}_${options.color || 'default'}_${options.size || 'default'}`,
            productId: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            image: product.image || product.images?.[0],
            color: options.color,
            size: options.size,
            quantity: options.quantity || 1,
            addedAt: new Date().toISOString()
        };

        // Check if item already exists
        const existingItemIndex = this.cart.findIndex(item => item.id === cartItem.id);
        
        if (existingItemIndex > -1) {
            // Update quantity of existing item
            this.cart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            // Add new item
            this.cart.push(cartItem);
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`);
        
        return true;
    }

    // Remove item from cart
    removeItem(itemId) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const removedItem = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification(`${removedItem.name} removed from cart!`, 'info');
            return true;
        }
        return false;
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
            return true;
        }
        return false;
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.appliedCoupon = null;
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Cart cleared!', 'info');
    }

    // Calculate cart totals
    calculateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        let shipping = subtotal >= this.freeShippingThreshold ? 0 : this.shippingCost;
        let discount = 0;
        
        // Apply coupon discount
        if (this.appliedCoupon) {
            const coupon = this.coupons[this.appliedCoupon];
            if (coupon) {
                if (coupon.type === 'percentage') {
                    discount = subtotal * (coupon.discount / 100);
                } else if (coupon.type === 'fixed') {
                    discount = coupon.discount;
                    if (coupon.discount >= shipping) {
                        shipping = 0;
                    }
                }
            }
        }
        
        const tax = (subtotal - discount) * this.taxRate;
        const total = subtotal + shipping + tax - discount;

        return {
            subtotal: Math.max(0, subtotal),
            shipping: Math.max(0, shipping),
            tax: Math.max(0, tax),
            discount: Math.max(0, discount),
            total: Math.max(0, total),
            itemCount
        };
    }

    // Apply coupon code
    applyCoupon(couponCode) {
        const coupon = this.coupons[couponCode.toUpperCase()];
        const totals = this.calculateTotals();
        
        if (!coupon) {
            return { success: false, message: 'Invalid coupon code.' };
        }
        
        if (totals.subtotal < coupon.minAmount) {
            return { 
                success: false, 
                message: `Minimum order amount of $${coupon.minAmount} required for this coupon.` 
            };
        }
        
        if (this.appliedCoupon === couponCode.toUpperCase()) {
            return { success: false, message: 'Coupon already applied.' };
        }
        
        this.appliedCoupon = couponCode.toUpperCase();
        this.updateCartDisplay();
        
        let discountText = coupon.type === 'percentage' 
            ? `${coupon.discount}% off` 
            : `$${coupon.discount} off`;
            
        return { 
            success: true, 
            message: `Coupon applied! You saved with ${discountText}.` 
        };
    }

    // Remove applied coupon
    removeCoupon() {
        this.appliedCoupon = null;
        this.updateCartDisplay();
        return { success: true, message: 'Coupon removed.' };
    }

    // Update cart display
    updateCartDisplay() {
        const emptyCart = document.getElementById('emptyCart');
        const cartTable = document.getElementById('cartTable');
        const cartSummary = document.getElementById('cartSummary');
        const cartItems = document.getElementById('cartItems');

        if (this.cart.length === 0) {
            emptyCart.style.display = 'block';
            cartTable.style.display = 'none';
            cartSummary.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartTable.style.display = 'block';
        cartSummary.style.display = 'block';

        // Update cart items
        cartItems.innerHTML = '';
        this.cart.forEach(item => {
            const row = this.createCartItemRow(item);
            cartItems.appendChild(row);
        });

        // Update cart summary
        this.updateCartSummary();
    }

    // Create cart item row
    createCartItemRow(item) {
        const row = document.createElement('tr');
        row.className = 'cart-item-enter';
        row.innerHTML = `
            <td>
                <div class="cart-product-info">
                    <div class="cart-product-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-product-details">
                        <div class="product-brand">${item.brand}</div>
                        <h5>${item.name}</h5>
                        <div class="cart-product-options">
                            ${item.color ? `<span>Color: ${item.color}</span>` : ''}
                            ${item.size ? `<span>Size: ${item.size}</span>` : ''}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="cart-price">$${item.price.toFixed(2)}</div>
                ${item.originalPrice > item.price ? 
                    `<div class="cart-price original">$${item.originalPrice.toFixed(2)}</div>` : ''}
            </td>
            <td>
                <div class="cart-quantity">
                    <button class="cart-qty-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" class="cart-qty-input" value="${item.quantity}" 
                           onchange="cartManager.updateQuantity('${item.id}', parseInt(this.value))" min="1" max="10">
                    <button class="cart-qty-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>
                <div class="cart-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </td>
            <td>
                <button class="remove-item-btn" onclick="cartManager.confirmRemoveItem('${item.id}')" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        return row;
    }

    // Update cart summary
    updateCartSummary() {
        const totals = this.calculateTotals();
        
        document.getElementById('itemCount').textContent = totals.itemCount;
        document.getElementById('subtotalAmount').textContent = `$${totals.subtotal.toFixed(2)}`;
        document.getElementById('shippingAmount').textContent = totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`;
        document.getElementById('taxAmount').textContent = `$${totals.tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${totals.total.toFixed(2)}`;
        
        // Update discount row
        const discountRow = document.getElementById('discountRow');
        if (totals.discount > 0) {
            document.getElementById('discountAmount').textContent = `-$${totals.discount.toFixed(2)}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }
        
        // Update checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = this.cart.length === 0;
    }

    // Update cart badge in navigation
    updateCartBadge() {
        const cartLinks = document.querySelectorAll('a[href="cart.html"]');
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        cartLinks.forEach(link => {
            // Remove existing badge
            const existingBadge = link.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add new badge if items exist
            if (itemCount > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = itemCount > 99 ? '99+' : itemCount;
                link.style.position = 'relative';
                link.appendChild(badge);
            }
        });
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.getElementById('cartNotification');
        const messageElement = document.getElementById('notificationMessage');
        
        messageElement.textContent = message;
        notification.className = `cart-notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Confirm remove item
    confirmRemoveItem(itemId) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            this.showConfirmModal(
                'Remove Item',
                `Are you sure you want to remove "${item.name}" from your cart?`,
                () => this.removeItem(itemId)
            );
        }
    }

    // Confirm clear cart
    confirmClearCart() {
        if (this.cart.length === 0) return;
        
        this.showConfirmModal(
            'Clear Cart',
            'Are you sure you want to remove all items from your cart?',
            () => this.clearCart()
        );
    }

    // Show confirmation modal
    showConfirmModal(title, message, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const titleElement = document.getElementById('confirmTitle');
        const messageElement = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmOk');
        
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        // Remove existing event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        // Add new event listener
        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            this.hideConfirmModal();
        });
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Hide confirmation modal
    hideConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Setup event listeners
    setupEventListeners() {
        // Clear cart button
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.confirmClearCart());
        }

        // Apply coupon button
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        const couponInput = document.getElementById('couponCode');
        if (applyCouponBtn && couponInput) {
            applyCouponBtn.addEventListener('click', () => this.handleCouponApplication());
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleCouponApplication();
                }
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // Modal close buttons
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.hideConfirmModal());
        });

        const cancelBtn = document.getElementById('confirmCancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideConfirmModal());
        }

        // Close modal on outside click
        const modal = document.getElementById('confirmModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideConfirmModal();
                }
            });
        }
    }

    // Handle coupon application
    handleCouponApplication() {
        const couponInput = document.getElementById('couponCode');
        const couponMessage = document.getElementById('couponMessage');
        const couponCode = couponInput.value.trim();
        
        if (!couponCode) {
            couponMessage.textContent = 'Please enter a coupon code.';
            couponMessage.className = 'coupon-message error';
            return;
        }
        
        const result = this.applyCoupon(couponCode);
        couponMessage.textContent = result.message;
        couponMessage.className = `coupon-message ${result.success ? 'success' : 'error'}`;
        
        if (result.success) {
            couponInput.value = '';
        }
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }
        
        // In a real application, this would redirect to checkout page
        const totals = this.calculateTotals();
        alert(`Proceeding to checkout with ${totals.itemCount} items totaling $${totals.total.toFixed(2)}`);
        
        // For demo purposes, you could redirect to a checkout page:
        // window.location.href = 'checkout.html';
    }

    // Load recommended products
    loadRecommendedProducts() {
        const container = document.getElementById('recommendedProductsContainer');
        if (!container) return;
        
        // Sample recommended products (in a real app, this would come from an API)
        const recommendedProducts = [
            {
                id: 1,
                name: "Cartoon Astronaut T-Shirt",
                brand: "Adidas",
                price: 78,
                image: "img/products/f1.jpg",
                rating: 5
            },
            {
                id: 2,
                name: "Floral Print Shirt",
                brand: "Nike",
                price: 85,
                image: "img/products/f2.jpg",
                rating: 4
            },
            {
                id: 3,
                name: "Vintage Denim Shirt",
                brand: "Zara",
                price: 92,
                image: "img/products/f3.jpg",
                rating: 5
            },
            {
                id: 4,
                name: "Tropical Print Shirt",
                brand: "Puma",
                price: 67,
                image: "img/products/f4.jpg",
                rating: 4
            }
        ];
        
        container.innerHTML = '';
        recommendedProducts.forEach(product => {
            const productElement = this.createRecommendedProductElement(product);
            container.appendChild(productElement);
        });
    }

    // Create recommended product element
    createRecommendedProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'pro';
        
        const stars = this.generateStars(product.rating);
        
        productDiv.innerHTML = `
            <a href="product-detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="des">
                <span>${product.brand}</span>
                <h5><a href="product-detail.html?id=${product.id}" style="text-decoration: none; color: inherit;">${product.name}</a></h5>
                <div class="star">${stars}</div>
                <h4>$${product.price.toFixed(2)}</h4>
            </div>
            <a href="#" onclick="cartManager.addRecommendedToCart(${product.id})"><i class="fal fa-shopping-cart cart"></i></a>
        `;
        
        return productDiv;
    }

    // Generate star rating HTML
    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // Add recommended product to cart
    addRecommendedToCart(productId) {
        // In a real app, you'd fetch the full product data
        const product = {
            id: productId,
            name: "Product Name",
            brand: "Brand",
            price: 50,
            image: "img/products/f1.jpg"
        };
        
        this.addItem(product);
    }

    // Get cart data (for external use)
    getCart() {
        return this.cart;
    }

    // Get cart count (for external use)
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Initialize cart manager
let cartManager;

document.addEventListener('DOMContentLoaded', function() {
    cartManager = new CartManager();
});

// Global function for adding items to cart (used by other pages)
function addToCart(productId, options = {}) {
    if (!cartManager) {
        cartManager = new CartManager();
    }
    
    // This is a simplified version - in a real app, you'd fetch full product data
    const product = {
        id: productId,
        name: "Product Name",
        brand: "Brand",
        price: 50,
        image: "img/products/f1.jpg"
    };
    
    return cartManager.addItem(product, options);
}

// Mobile menu functionality (from original script.js)
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}