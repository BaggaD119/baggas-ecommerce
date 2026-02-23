// Customer Profile System
class ProfileSystem {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'overview';
        this.orders = [];
        this.wishlist = [];
        this.addresses = [];
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserData();
        this.bindEvents();
        this.loadSection('overview');
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user || user.role === 'admin') {
            window.location.href = 'auth.html';
            return;
        }
        this.currentUser = user;
    }

    loadUserData() {
        // Load user orders
        const allOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        this.orders = allOrders.filter(order => order.customerId === this.currentUser.id);

        // Load user wishlist
        this.wishlist = this.currentUser.wishlist || [];

        // Load user addresses
        this.addresses = this.currentUser.addresses || this.generateDefaultAddresses();

        // Update profile header
        this.updateProfileHeader();
        this.updateNavigationBadges();
    }

    generateDefaultAddresses() {
        return [
            {
                id: 1,
                type: 'home',
                name: 'Home Address',
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'United States',
                isDefault: true
            }
        ];
    }

    updateProfileHeader() {
        document.getElementById('profileUserName').textContent = 
            `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('profileUserEmail').textContent = this.currentUser.email;

        // Update stats
        const totalSpent = this.orders.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('totalOrders').textContent = this.orders.length;
        document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
        document.getElementById('wishlistCount').textContent = this.wishlist.length;

        // Update member since
        const memberSince = new Date(this.currentUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
        document.getElementById('memberSince').textContent = memberSince;

        // Generate avatar initials
        const initials = `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`;
        document.getElementById('userAvatar').innerHTML = initials;
    }

    updateNavigationBadges() {
        document.getElementById('ordersBadge').textContent = this.orders.length;
        document.getElementById('wishlistBadge').textContent = this.wishlist.length;
    }

    bindEvents() {
        // Navigation buttons
        document.querySelectorAll('.profile-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Modal close
        document.querySelector('.profile-modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submissions
        this.bindFormEvents();

        // Filter events
        this.bindFilterEvents();
    }

    bindFormEvents() {
        // Personal info form
        const personalForm = document.getElementById('personalInfoForm');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updatePersonalInfo();
            });
        }

        // Change password form
        const passwordForm = document.getElementById('changePasswordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }
    }

    bindFilterEvents() {
        // Order status filters
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                this.filterOrders(status);
                
                // Update active tab
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Order search
        const orderSearch = document.getElementById('orderSearchInput');
        if (orderSearch) {
            orderSearch.addEventListener('input', (e) => {
                this.searchOrders(e.target.value);
            });
        }
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.profile-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.profile-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
        this.loadSection(section);
    }

    loadSection(section) {
        switch (section) {
            case 'overview':
                this.loadOverview();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'wishlist':
                this.loadWishlist();
                break;
            case 'addresses':
                this.loadAddresses();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // Overview Section
    loadOverview() {
        this.loadRecentOrders();
        this.loadAccountActivity();
    }

    loadRecentOrders() {
        const recentOrders = this.orders
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        const container = document.getElementById('recentOrdersList');
        
        if (recentOrders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No orders yet. <a href="shop.html">Start shopping!</a></p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentOrders.map(order => `
            <div class="recent-order-item">
                <div class="order-info">
                    <div class="order-id">${order.id}</div>
                    <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div class="order-status ${order.status}">${order.status}</div>
            </div>
        `).join('');
    }

    loadAccountActivity() {
        const activities = [
            {
                icon: 'fas fa-user-edit',
                title: 'Profile Updated',
                time: '2 days ago'
            },
            {
                icon: 'fas fa-shopping-cart',
                title: 'Order Placed',
                time: '1 week ago'
            },
            {
                icon: 'fas fa-heart',
                title: 'Item Added to Wishlist',
                time: '2 weeks ago'
            }
        ];

        const container = document.getElementById('activityList');
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Orders Section
    loadOrders() {
        this.displayOrders(this.orders);
    }

    displayOrders(orders) {
        const container = document.getElementById('ordersList');
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet.</p>
                    <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>${order.id}</h3>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <div class="order-detail-item">
                        <span class="detail-label">Order Date</span>
                        <span class="detail-value">${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div class="order-detail-item">
                        <span class="detail-label">Total Amount</span>
                        <span class="detail-value">$${order.total.toFixed(2)}</span>
                    </div>
                    <div class="order-detail-item">
                        <span class="detail-label">Items</span>
                        <span class="detail-value">${order.items.length} items</span>
                    </div>
                    <div class="order-detail-item">
                        <span class="detail-label">Shipping Address</span>
                        <span class="detail-value">${order.shippingAddress}</span>
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${this.getProductImage(item.productId)}" alt="${item.name}" class="item-image">
                            <div class="item-info">
                                <div class="item-name">${item.name}</div>
                                <div class="item-details">Quantity: ${item.quantity}</div>
                            </div>
                            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 20px;">
                    <button class="btn btn-primary btn-sm" onclick="profileSystem.trackOrder('${order.id}')">
                        Track Order
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="profileSystem.reorderItems('${order.id}')">
                        Reorder
                    </button>
                </div>
            </div>
        `).join('');
    }

    getProductImage(productId) {
        // Get product image from shop products or default
        const products = [
            { id: 1, image: "img/products/f1.jpg" },
            { id: 2, image: "img/products/f2.jpg" },
            { id: 3, image: "img/products/f3.jpg" },
            { id: 4, image: "img/products/f4.jpg" },
            { id: 5, image: "img/products/f5.jpg" }
        ];
        
        const product = products.find(p => p.id === productId);
        return product ? product.image : "img/products/f1.jpg";
    }

    filterOrders(status) {
        let filteredOrders = this.orders;
        
        if (status !== 'all') {
            filteredOrders = this.orders.filter(order => order.status === status);
        }
        
        this.displayOrders(filteredOrders);
    }

    searchOrders(query) {
        const filteredOrders = this.orders.filter(order => 
            order.id.toLowerCase().includes(query.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.displayOrders(filteredOrders);
    }

    // Wishlist Section
    loadWishlist() {
        const container = document.getElementById('wishlistGrid');
        
        if (this.wishlist.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-heart"></i>
                    <h3>Your Wishlist is Empty</h3>
                    <p>Save items you love to your wishlist.</p>
                    <a href="shop.html" class="btn btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.wishlist.map(item => `
            <div class="wishlist-item">
                <button class="wishlist-remove" onclick="profileSystem.removeFromWishlist(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${item.image}" alt="${item.name}" class="wishlist-image">
                <div class="wishlist-name">${item.name}</div>
                <div class="wishlist-brand">${item.brand}</div>
                <div class="wishlist-price">$${item.price}</div>
                <div class="wishlist-actions-btn">
                    <button class="btn btn-primary btn-sm" onclick="profileSystem.addToCartFromWishlist(${item.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Addresses Section
    loadAddresses() {
        const container = document.getElementById('addressesGrid');
        
        container.innerHTML = this.addresses.map(address => `
            <div class="address-card ${address.isDefault ? 'default' : ''}">
                <div class="address-type">${address.type}</div>
                ${address.isDefault ? '<div class="address-type" style="background: #28a745;">Default</div>' : ''}
                <div class="address-name">${address.name}</div>
                <div class="address-details">
                    ${address.street}<br>
                    ${address.city}, ${address.state} ${address.zipCode}<br>
                    ${address.country}
                </div>
                <div class="address-actions">
                    <button class="btn btn-primary btn-sm" onclick="profileSystem.editAddress(${address.id})">
                        Edit
                    </button>
                    ${!address.isDefault ? `
                        <button class="btn btn-secondary btn-sm" onclick="profileSystem.setDefaultAddress(${address.id})">
                            Set Default
                        </button>
                    ` : ''}
                    <button class="btn btn-danger btn-sm" onclick="profileSystem.deleteAddress(${address.id})">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Settings Section
    loadSettings() {
        // Populate form fields
        document.getElementById('settingsFirstName').value = this.currentUser.firstName;
        document.getElementById('settingsLastName').value = this.currentUser.lastName;
        document.getElementById('settingsEmail').value = this.currentUser.email;
        document.getElementById('settingsPhone').value = this.currentUser.phone;

        // Load preferences
        const preferences = this.currentUser.preferences || {};
        document.getElementById('emailNotifications').checked = preferences.emailNotifications !== false;
        document.getElementById('smsNotifications').checked = preferences.smsNotifications === true;
        document.getElementById('marketingEmails').checked = preferences.marketingEmails !== false;
    }

    // Action Methods
    updatePersonalInfo() {
        const updatedUser = {
            ...this.currentUser,
            firstName: document.getElementById('settingsFirstName').value,
            lastName: document.getElementById('settingsLastName').value,
            email: document.getElementById('settingsEmail').value,
            phone: document.getElementById('settingsPhone').value
        };

        // Update in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;
            this.updateProfileHeader();
            this.showNotification('Personal information updated successfully!', 'success');
        }
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        // Validate current password
        if (currentPassword !== this.currentUser.password) {
            this.showNotification('Current password is incorrect', 'error');
            return;
        }

        // Validate new password
        if (newPassword.length < 6) {
            this.showNotification('New password must be at least 6 characters', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }

        // Update password
        const updatedUser = { ...this.currentUser, password: newPassword };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;
            
            // Clear form
            document.getElementById('changePasswordForm').reset();
            this.showNotification('Password changed successfully!', 'success');
        }
    }

    savePreferences() {
        const preferences = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            smsNotifications: document.getElementById('smsNotifications').checked,
            marketingEmails: document.getElementById('marketingEmails').checked
        };

        const updatedUser = { ...this.currentUser, preferences };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;
            this.showNotification('Preferences saved successfully!', 'success');
        }
    }

    // Wishlist Actions
    removeFromWishlist(itemId) {
        this.wishlist = this.wishlist.filter(item => item.id !== itemId);
        this.updateUserWishlist();
        this.loadWishlist();
        this.updateNavigationBadges();
        this.showNotification('Item removed from wishlist', 'success');
    }

    addToCartFromWishlist(itemId) {
        const item = this.wishlist.find(item => item.id === itemId);
        if (item && typeof CartUtils !== 'undefined') {
            CartUtils.addToCart(item);
            this.showNotification('Item added to cart!', 'success');
        }
    }

    addAllToCart() {
        if (typeof CartUtils !== 'undefined') {
            this.wishlist.forEach(item => {
                CartUtils.addToCart(item);
            });
            this.showNotification(`${this.wishlist.length} items added to cart!`, 'success');
        }
    }

    clearWishlist() {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            this.wishlist = [];
            this.updateUserWishlist();
            this.loadWishlist();
            this.updateNavigationBadges();
            this.showNotification('Wishlist cleared', 'success');
        }
    }

    updateUserWishlist() {
        const updatedUser = { ...this.currentUser, wishlist: this.wishlist };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;
        }
    }

    // Address Actions
    showAddAddressModal() {
        const content = `
            <form id="addAddressForm">
                <div class="form-group">
                    <label>Address Type</label>
                    <select id="addressType" required>
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Address Name</label>
                    <input type="text" id="addressName" placeholder="e.g., Home Address" required>
                </div>
                <div class="form-group">
                    <label>Street Address</label>
                    <input type="text" id="addressStreet" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" id="addressCity" required>
                    </div>
                    <div class="form-group">
                        <label>State</label>
                        <input type="text" id="addressState" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>ZIP Code</label>
                        <input type="text" id="addressZip" required>
                    </div>
                    <div class="form-group">
                        <label>Country</label>
                        <input type="text" id="addressCountry" value="United States" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="preference-label">
                        <input type="checkbox" id="setAsDefault">
                        <span class="checkmark"></span>
                        Set as default address
                    </label>
                </div>
                <button type="submit" class="btn btn-primary">Add Address</button>
            </form>
        `;
        
        this.showModal('Add New Address', content);
        
        document.getElementById('addAddressForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAddress();
        });
    }

    addAddress() {
        const newAddress = {
            id: Date.now(),
            type: document.getElementById('addressType').value,
            name: document.getElementById('addressName').value,
            street: document.getElementById('addressStreet').value,
            city: document.getElementById('addressCity').value,
            state: document.getElementById('addressState').value,
            zipCode: document.getElementById('addressZip').value,
            country: document.getElementById('addressCountry').value,
            isDefault: document.getElementById('setAsDefault').checked
        };

        // If setting as default, remove default from others
        if (newAddress.isDefault) {
            this.addresses.forEach(addr => addr.isDefault = false);
        }

        this.addresses.push(newAddress);
        this.updateUserAddresses();
        this.closeModal();
        this.loadAddresses();
        this.showNotification('Address added successfully!', 'success');
    }

    editAddress(addressId) {
        const address = this.addresses.find(addr => addr.id === addressId);
        if (!address) return;

        const content = `
            <form id="editAddressForm">
                <div class="form-group">
                    <label>Address Type</label>
                    <select id="editAddressType" required>
                        <option value="home" ${address.type === 'home' ? 'selected' : ''}>Home</option>
                        <option value="work" ${address.type === 'work' ? 'selected' : ''}>Work</option>
                        <option value="other" ${address.type === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Address Name</label>
                    <input type="text" id="editAddressName" value="${address.name}" required>
                </div>
                <div class="form-group">
                    <label>Street Address</label>
                    <input type="text" id="editAddressStreet" value="${address.street}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" id="editAddressCity" value="${address.city}" required>
                    </div>
                    <div class="form-group">
                        <label>State</label>
                        <input type="text" id="editAddressState" value="${address.state}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>ZIP Code</label>
                        <input type="text" id="editAddressZip" value="${address.zipCode}" required>
                    </div>
                    <div class="form-group">
                        <label>Country</label>
                        <input type="text" id="editAddressCountry" value="${address.country}" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Update Address</button>
            </form>
        `;
        
        this.showModal('Edit Address', content);
        
        document.getElementById('editAddressForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAddress(addressId);
        });
    }

    updateAddress(addressId) {
        const addressIndex = this.addresses.findIndex(addr => addr.id === addressId);
        if (addressIndex === -1) return;

        this.addresses[addressIndex] = {
            ...this.addresses[addressIndex],
            type: document.getElementById('editAddressType').value,
            name: document.getElementById('editAddressName').value,
            street: document.getElementById('editAddressStreet').value,
            city: document.getElementById('editAddressCity').value,
            state: document.getElementById('editAddressState').value,
            zipCode: document.getElementById('editAddressZip').value,
            country: document.getElementById('editAddressCountry').value
        };

        this.updateUserAddresses();
        this.closeModal();
        this.loadAddresses();
        this.showNotification('Address updated successfully!', 'success');
    }

    setDefaultAddress(addressId) {
        this.addresses.forEach(addr => {
            addr.isDefault = addr.id === addressId;
        });
        
        this.updateUserAddresses();
        this.loadAddresses();
        this.showNotification('Default address updated!', 'success');
    }

    deleteAddress(addressId) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.addresses = this.addresses.filter(addr => addr.id !== addressId);
            this.updateUserAddresses();
            this.loadAddresses();
            this.showNotification('Address deleted successfully!', 'success');
        }
    }

    updateUserAddresses() {
        const updatedUser = { ...this.currentUser, addresses: this.addresses };
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;
        }
    }

    // Order Actions
    trackOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const statusSteps = {
            pending: 1,
            processing: 2,
            shipped: 3,
            delivered: 4
        };

        const currentStep = statusSteps[order.status] || 1;

        const content = `
            <div class="order-tracking">
                <h3>Order ${order.id}</h3>
                <p>Placed on ${new Date(order.date).toLocaleDateString()}</p>
                
                <div class="tracking-steps">
                    <div class="tracking-step ${currentStep >= 1 ? 'completed' : ''}">
                        <div class="step-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="step-content">
                            <h4>Order Placed</h4>
                            <p>Your order has been placed successfully</p>
                        </div>
                    </div>
                    
                    <div class="tracking-step ${currentStep >= 2 ? 'completed' : ''}">
                        <div class="step-icon">
                            <i class="fas fa-cog"></i>
                        </div>
                        <div class="step-content">
                            <h4>Processing</h4>
                            <p>Your order is being prepared</p>
                        </div>
                    </div>
                    
                    <div class="tracking-step ${currentStep >= 3 ? 'completed' : ''}">
                        <div class="step-icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="step-content">
                            <h4>Shipped</h4>
                            <p>Your order is on its way</p>
                        </div>
                    </div>
                    
                    <div class="tracking-step ${currentStep >= 4 ? 'completed' : ''}">
                        <div class="step-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="step-content">
                            <h4>Delivered</h4>
                            <p>Your order has been delivered</p>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
                    <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
                </div>
            </div>
        `;
        
        this.showModal('Track Order', content);
    }

    reorderItems(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order || typeof CartUtils === 'undefined') return;

        order.items.forEach(item => {
            // Convert order item back to product format for cart
            const product = {
                id: item.productId,
                name: item.name,
                price: item.price,
                image: this.getProductImage(item.productId)
            };
            
            CartUtils.addToCart(product, { quantity: item.quantity });
        });

        this.showNotification(`${order.items.length} items added to cart!`, 'success');
    }

    // Account Actions
    changeAvatar() {
        this.showNotification('Avatar upload feature coming soon!', 'info');
    }

    downloadData() {
        const userData = {
            profile: this.currentUser,
            orders: this.orders,
            wishlist: this.wishlist,
            addresses: this.addresses
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `profile-data-${this.currentUser.id}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data downloaded successfully!', 'success');
    }

    deactivateAccount() {
        if (confirm('Are you sure you want to deactivate your account? You can reactivate it later.')) {
            const updatedUser = { ...this.currentUser, status: 'inactive' };
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
                this.showNotification('Account deactivated. Logging out...', 'warning');
                
                setTimeout(() => {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'index.html';
                }, 2000);
            }
        }
    }

    deleteAccount() {
        if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
            if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const filteredUsers = users.filter(u => u.id !== this.currentUser.id);
                
                localStorage.setItem('users', JSON.stringify(filteredUsers));
                localStorage.removeItem('currentUser');
                
                this.showNotification('Account deleted successfully', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        }
    }

    // Utility Methods
    showModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('profileModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('profileModal').classList.remove('show');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `auth-message ${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize profile system
document.addEventListener('DOMContentLoaded', () => {
    window.profileSystem = new ProfileSystem();
});