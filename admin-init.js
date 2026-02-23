// Admin Panel Initialization Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎛️ Admin Panel Initializing...');
    
    // Check if we're on the admin page
    if (document.body.classList.contains('admin-body')) {
        // Initialize the admin system
        if (typeof CompleteAdminSystem !== 'undefined') {
            window.adminSystem = new CompleteAdminSystem();
            console.log('✅ Admin System Loaded Successfully');
        } else {
            console.error('❌ CompleteAdminSystem not found');
        }
    }
    
    // Add mobile menu toggle for admin panel
    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');
    
    if (sidebar && main) {
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.style.cssText = `
            display: none;
            position: fixed;
            top: 15px;
            left: 15px;
            z-index: 1001;
            background: #088178;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
        `;
        
        document.body.appendChild(mobileMenuBtn);
        
        // Mobile menu functionality
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Show mobile menu button on small screens
        function checkScreenSize() {
            if (window.innerWidth <= 1024) {
                mobileMenuBtn.style.display = 'block';
            } else {
                mobileMenuBtn.style.display = 'none';
                sidebar.classList.remove('open');
            }
        }
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024 && 
                !sidebar.contains(e.target) && 
                !mobileMenuBtn.contains(e.target) &&
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }
});

// Global notification function
window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
};

console.log('🎨 Admin styles and functionality restored!');