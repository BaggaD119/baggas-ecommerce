// Global Notification System
class NotificationSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.createContainer();
    this.bindEvents();
  }

  createContainer() {
    // Create notification container if it doesn't exist
    this.container = document.getElementById("notification-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "notification-container";
      this.container.className = "notification-container";
      document.body.appendChild(this.container);
    }
  }

  show(message, type = "info", duration = 4000) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    const icon = this.getIcon(type);
    notification.innerHTML = `
            <div class="notification-content">
                <i class="${icon}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    // Add to container
    this.container.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add("notification-show");
    }, 10);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    return notification;
  }

  remove(notification) {
    if (notification && notification.parentElement) {
      notification.classList.remove("notification-show");
      notification.classList.add("notification-hide");

      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }

  getIcon(type) {
    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    };
    return icons[type] || icons.info;
  }

  success(message, duration) {
    return this.show(message, "success", duration);
  }

  error(message, duration) {
    return this.show(message, "error", duration);
  }

  warning(message, duration) {
    return this.show(message, "warning", duration);
  }

  info(message, duration) {
    return this.show(message, "info", duration);
  }

  bindEvents() {
    // Listen for custom notification events
    document.addEventListener("notify", (e) => {
      const { message, type, duration } = e.detail;
      this.show(message, type, duration);
    });
  }
}

// Global notification functions
window.notify = {
  show: (message, type, duration) =>
    window.notificationSystem.show(message, type, duration),
  success: (message, duration) =>
    window.notificationSystem.success(message, duration),
  error: (message, duration) =>
    window.notificationSystem.error(message, duration),
  warning: (message, duration) =>
    window.notificationSystem.warning(message, duration),
  info: (message, duration) =>
    window.notificationSystem.info(message, duration),
};

// Initialize notification system
document.addEventListener("DOMContentLoaded", () => {
  window.notificationSystem = new NotificationSystem();
});

// Add notification styles
const notificationCSS = `
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    pointer-events: none;
    max-width: 400px;
}

.notification {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    margin-bottom: 10px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    pointer-events: auto;
    border-left: 4px solid #088178;
}

.notification-show {
    opacity: 1;
    transform: translateX(0);
}

.notification-hide {
    opacity: 0;
    transform: translateX(100%);
}

.notification-content {
    display: flex;
    align-items: center;
    padding: 15px;
    gap: 12px;
}

.notification-content i:first-child {
    font-size: 18px;
    flex-shrink: 0;
}

.notification-message {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    font-size: 14px;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.notification-close:hover {
    background: #f0f0f0;
    color: #333;
}

.notification-success {
    border-left-color: #28a745;
}

.notification-success .notification-content i:first-child {
    color: #28a745;
}

.notification-error {
    border-left-color: #dc3545;
}

.notification-error .notification-content i:first-child {
    color: #dc3545;
}

.notification-warning {
    border-left-color: #ffc107;
}

.notification-warning .notification-content i:first-child {
    color: #ffc107;
}

.notification-info {
    border-left-color: #17a2b8;
}

.notification-info .notification-content i:first-child {
    color: #17a2b8;
}

@media (max-width: 768px) {
    .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .notification-content {
        padding: 12px;
    }
    
    .notification-message {
        font-size: 13px;
    }
}
`;

// Inject notification styles
const notificationStyle = document.createElement("style");
notificationStyle.textContent = notificationCSS;
document.head.appendChild(notificationStyle);
