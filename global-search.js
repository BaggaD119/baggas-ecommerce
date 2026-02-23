// Global Search Functionality
class GlobalSearch {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalSearch();
        this.addMobileSearchStyles();
    }

    setupGlobalSearch() {
        const globalSearchInput = document.getElementById('globalSearchInput');
        const globalSearchButton = document.getElementById('globalSearchButton');

        if (globalSearchInput && globalSearchButton) {
            // Handle search input
            globalSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // Handle search button click
            globalSearchButton.addEventListener('click', () => {
                this.performSearch();
            });

            // Add focus/blur effects
            globalSearchInput.addEventListener('focus', () => {
                globalSearchInput.parentElement.classList.add('focused');
            });

            globalSearchInput.addEventListener('blur', () => {
                globalSearchInput.parentElement.classList.remove('focused');
            });
        }
    }

    performSearch() {
        const globalSearchInput = document.getElementById('globalSearchInput');
        const query = globalSearchInput.value.trim();
        
        if (query) {
            // Save search to recent searches
            this.saveRecentSearch(query);
            
            // Redirect to search page
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }

    saveRecentSearch(query) {
        try {
            let recentSearches = JSON.parse(localStorage.getItem('recentGlobalSearches') || '[]');
            
            // Remove if already exists
            recentSearches = recentSearches.filter(search => search !== query);
            
            // Add to beginning
            recentSearches.unshift(query);
            
            // Keep only last 5 searches
            recentSearches = recentSearches.slice(0, 5);
            
            localStorage.setItem('recentGlobalSearches', JSON.stringify(recentSearches));
        } catch (error) {
            console.log('Could not save search to localStorage');
        }
    }

    addMobileSearchStyles() {
        // Add mobile-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-search-btn {
                color: #101010;
                font-size: 20px;
                padding: 0 10px;
                text-decoration: none;
                transition: color 0.3s;
            }
            
            .mobile-search-btn:hover {
                color: #088178;
            }
            
            .global-search.focused {
                transform: scale(1.02);
            }
            
            @media (max-width: 799px) {
                .global-search {
                    display: none;
                }
                
                .mobile-search-btn {
                    display: block;
                }
            }
            
            @media (min-width: 800px) {
                .mobile-search-btn {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize global search
document.addEventListener('DOMContentLoaded', function() {
    new GlobalSearch();
});

// Export for use in other scripts
window.GlobalSearch = GlobalSearch;