// Settings Page JavaScript
class SettingsManager {
    constructor() {
        this.settings = {};
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateQuickToggles();
        this.startStatusUpdates();
    }

    setupEventListeners() {
        // Settings search
        document.getElementById('settingsSearch').addEventListener('input', (e) => {
            this.searchSettings(e.target.value);
        });

        // Quick toggles
        document.getElementById('quickDarkMode').addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });

        document.getElementById('quickMaintenanceMode').addEventListener('change', (e) => {
            this.toggleMaintenanceMode(e.target.checked);
        });

        document.getElementById('quickEmailNotifications').addEventListener('change', (e) => {
            this.toggleEmailNotifications(e.target.checked);
        });

        document.getElementById('quickAPIAccess').addEventListener('change', (e) => {
            this.toggleAPIAccess(e.target.checked);
        });
    }

    loadSettings() {
        // Load settings from localStorage or use defaults
        const savedSettings = localStorage.getItem('adminSystemSettings');
        const defaultSettings = this.getDefaultSettings();
        
        this.settings = savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    }

    getDefaultSettings() {
        return {
            darkMode: false,
            maintenanceMode: false,
            emailNotifications: true,
            apiAccess: true,
            systemName: "Bagga's Admin System",
            storeName: "Bagga's Fashion Store",
            currency: "USD",
            timezone: "America/Los_Angeles",
            language: "en"
        };
    }

    updateQuickToggles() {
        document.getElementById('quickDarkMode').checked = this.settings.darkMode;
        document.getElementById('quickMaintenanceMode').checked = this.settings.maintenanceMode;
        document.getElementById('quickEmailNotifications').checked = this.settings.emailNotifications;
        document.getElementById('quickAPIAccess').checked = this.settings.apiAccess;
    }

    searchSettings(query) {
        const shortcuts = document.querySelectorAll('.shortcut-card');
        const searchTerm = query.toLowerCase();

        shortcuts.forEach(card => {
            const title = card.querySelector('.shortcut-title').textContent.toLowerCase();
            const description = card.querySelector('.shortcut-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.display = searchTerm === '' ? 'block' : 'none';
                card.style.opacity = searchTerm === '' ? '1' : '0.5';
            }
        });

        // Show "no results" message if needed
        const visibleCards = Array.from(shortcuts).filter(card => card.style.display !== 'none');
        if (visibleCards.length === 0 && query !== '') {
            this.showNoResultsMessage();
        } else {
            this.hideNoResultsMessage();
        }
    }

    showNoResultsMessage() {
        let noResultsMsg = document.querySelector('.no-results-message');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <h3>No settings found</h3>
                    <p>Try adjusting your search terms</p>
                </div>
            `;
            document.querySelector('.settings-shortcuts').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    }

    hideNoResultsMessage() {
        const noResultsMsg = document.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }

    toggleDarkMode(enabled) {
        this.settings.darkMode = enabled;
        this.saveSettings();
        
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        this.showNotification(`Dark mode ${enabled ? 'enabled' : 'disabled'}`, 'success');
    }

    toggleMaintenanceMode(enabled) {
        this.settings.maintenanceMode = enabled;
        this.saveSettings();
        
        if (enabled) {
            this.showNotification('Maintenance mode enabled - Store is now offline', 'warning');
        } else {
            this.showNotification('Maintenance mode disabled - Store is now online', 'success');
        }
    }

    toggleEmailNotifications(enabled) {
        this.settings.emailNotifications = enabled;
        this.saveSettings();
        
        this.showNotification(`Email notifications ${enabled ? 'enabled' : 'disabled'}`, 'success');
    }

    toggleAPIAccess(enabled) {
        this.settings.apiAccess = enabled;
        this.saveSettings();
        
        if (enabled) {
            this.showNotification('API access enabled', 'success');
        } else {
            this.showNotification('API access disabled - External integrations may not work', 'warning');
        }
    }

    saveSettings() {
        localStorage.setItem('adminSystemSettings', JSON.stringify(this.settings));
    }

    startStatusUpdates() {
        // Update system status every 30 seconds
        setInterval(() => {
            this.updateSystemStatus();
        }, 30000);
    }

    updateSystemStatus() {
        // Simulate status updates
        const statusItems = document.querySelectorAll('.status-item');
        
        // Randomly update some status indicators
        statusItems.forEach((item, index) => {
            if (Math.random() < 0.1) { // 10% chance to update each item
                const icon = item.querySelector('.status-icon');
                const info = item.querySelector('.status-info p');
                
                switch(index) {
                    case 0: // System Health
                        info.textContent = 'All systems operational';
                        icon.className = 'status-icon healthy';
                        break;
                    case 1: // Database
                        const dbLatency = Math.floor(Math.random() * 50) + 10;
                        info.textContent = `Connected (${dbLatency}ms)`;
                        icon.className = 'status-icon healthy';
                        break;
                    case 2: // Storage
                        const freeSpace = (Math.random() * 5 + 75).toFixed(1);
                        info.textContent = `${freeSpace}% available`;
                        icon.className = freeSpace < 80 ? 'status-icon warning' : 'status-icon healthy';
                        break;
                    case 5: // Performance
                        const responseTime = Math.floor(Math.random() * 200) + 150;
                        info.textContent = `Response time: ${responseTime}ms`;
                        icon.className = responseTime > 300 ? 'status-icon warning' : 'status-icon healthy';
                        break;
                }
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'warning' ? '#ffeaa7' : '#bee5eb'};
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions
function openSettingsTab(tabId) {
    // Redirect to main admin page with specific tab
    window.location.href = `admin-complete.html#settings-${tabId}`;
}

function exportSettings() {
    const settingsData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        settings: settingsManager.settings
    };

    const jsonContent = JSON.stringify(settingsData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `baggas_settings_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    settingsManager.showNotification("Settings exported successfully!", "success");
}

function saveAllSettings() {
    settingsManager.saveSettings();
    settingsManager.showNotification("All settings saved successfully!", "success");
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .recent-changes {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .change-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #eee;
    }
    
    .change-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #088178;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
    }
    
    .change-info strong {
        display: block;
        color: #333;
        margin-bottom: 4px;
    }
    
    .change-info p {
        margin: 0;
        color: #666;
        font-size: 14px;
    }
    
    /* Dark mode styles */
    .dark-mode {
        background: #1a202c;
        color: #e2e8f0;
    }
    
    .dark-mode .settings-header,
    .dark-mode .settings-search,
    .dark-mode .quick-settings,
    .dark-mode .shortcut-card,
    .dark-mode .system-status {
        background: #2d3748;
        border-color: #4a5568;
    }
    
    .dark-mode .settings-header h1,
    .dark-mode .quick-settings h3,
    .dark-mode .system-status h3,
    .dark-mode .shortcut-title,
    .dark-mode .quick-toggle-label {
        color: #e2e8f0;
    }
    
    .dark-mode .shortcut-description,
    .dark-mode .status-info p,
    .dark-mode .change-info p {
        color: #a0aec0;
    }
    
    .dark-mode .search-input,
    .dark-mode .quick-toggle,
    .dark-mode .status-item,
    .dark-mode .change-item {
        background: #4a5568;
        border-color: #718096;
        color: #e2e8f0;
    }
    
    .dark-mode .search-input::placeholder {
        color: #a0aec0;
    }
`;
document.head.appendChild(style);

// Initialize settings manager
let settingsManager;
document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
});