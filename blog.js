// Blog Functionality
document.addEventListener('DOMContentLoaded', function() {
    setupBlogSearch();
    setupCategoryFilter();
    setupPagination();
});

// Setup blog search functionality
function setupBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            blogPosts.forEach(post => {
                const title = post.querySelector('h2').textContent.toLowerCase();
                const content = post.querySelector('p').textContent.toLowerCase();
                const category = post.querySelector('.category').textContent.toLowerCase();
                
                const matches = title.includes(searchTerm) || 
                              content.includes(searchTerm) || 
                              category.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    post.style.display = 'block';
                    post.classList.add('fade-in');
                } else {
                    post.style.display = 'none';
                    post.classList.remove('fade-in');
                }
            });
            
            // Update results count
            updateResultsCount();
        });
    }
}

// Setup category filtering
function setupCategoryFilter() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const category = this.getAttribute('data-category');
            
            // Update active category
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts
            blogPosts.forEach(post => {
                const postCategory = post.getAttribute('data-category');
                
                if (category === 'all' || postCategory === category) {
                    post.style.display = 'block';
                    post.classList.add('fade-in');
                } else {
                    post.style.display = 'none';
                    post.classList.remove('fade-in');
                }
            });
            
            // Clear search
            const searchInput = document.getElementById('blogSearch');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Update results count
            updateResultsCount();
        });
    });
}

// Setup pagination
function setupPagination() {
    const pageButtons = document.querySelectorAll('.blog-pagination .page-btn');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            pageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button (if it's a number)
            if (!isNaN(this.textContent)) {
                this.classList.add('active');
            }
            
            // In a real application, this would load different pages of content
            // For now, we'll just scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Update results count
function updateResultsCount() {
    const visiblePosts = document.querySelectorAll('.blog-post[style*="block"], .blog-post:not([style*="none"])');
    const totalPosts = document.querySelectorAll('.blog-post');
    
    // You could add a results counter here if needed
    console.log(`Showing ${visiblePosts.length} of ${totalPosts.length} posts`);
}

// Add fade-in animation class
const style = document.createElement('style');
style.textContent = `
    .blog-post.fade-in {
        animation: fadeInUp 0.5s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

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