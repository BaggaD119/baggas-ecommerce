// Analytics Dashboard JavaScript with Chart.js
class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.currentTimeframe = '30days';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAnalyticsData();
        this.initializeCharts();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Timeframe selector
        document.getElementById('analyticsTimeframe').addEventListener('change', (e) => {
            this.currentTimeframe = e.target.value;
            this.updateAllData();
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.quick-action-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateQuickPeriod(e.target.dataset.period);
            });
        });

        // Chart control buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.closest('.chart-section');
                parent.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartPeriod(e.target.dataset.period);
            });
        });
    }

    loadAnalyticsData() {
        // Sample analytics data - in production, this would come from API
        this.analyticsData = {
            '7days': {
                revenue: 12450,
                orders: 234,
                customers: 189,
                conversion: 3.1,
                revenueData: [1800, 2100, 1950, 2300, 2050, 1750, 2200],
                customerData: [25, 32, 28, 35, 30, 22, 38],
                trafficSources: [2800, 1200, 800, 400],
                topProducts: [45, 38, 32, 28, 25]
            },
            '30days': {
                revenue: 45230,
                orders: 1234,
                customers: 892,
                conversion: 3.2,
                revenueData: [3200, 4100, 3800, 4500, 5200, 4800, 5500, 6200, 5800, 6500, 7200, 6800, 5900, 6300, 5700, 6100, 5400, 5800, 6200, 5600, 6000, 6400, 5800, 6200, 5900, 6100, 5700, 6300, 6000, 6400],
                customerData: [28, 35, 32, 40, 45, 38, 42, 48, 44, 50, 55, 52, 46, 49, 43, 47, 41, 44, 48, 42, 46, 50, 44, 48, 45, 47, 43, 49, 46, 50],
                trafficSources: [8234, 5678, 3456, 1974],
                topProducts: [156, 134, 98, 87, 76]
            },
            '90days': {
                revenue: 128450,
                orders: 3456,
                customers: 2341,
                conversion: 3.0,
                revenueData: Array.from({length: 90}, (_, i) => 1200 + Math.random() * 800),
                customerData: Array.from({length: 90}, (_, i) => 20 + Math.random() * 30),
                trafficSources: [24702, 17034, 10368, 5922],
                topProducts: [468, 402, 294, 261, 228]
            },
            '1year': {
                revenue: 542300,
                orders: 12345,
                customers: 8934,
                conversion: 2.9,
                revenueData: [38000, 42000, 39000, 45000, 48000, 44000, 50000, 52000, 49000, 53000, 55000, 51000],
                customerData: [680, 750, 720, 820, 890, 810, 920, 980, 890, 1020, 1100, 980],
                trafficSources: [99828, 68908, 41943, 23888],
                topProducts: [1872, 1608, 1176, 1044, 912]
            }
        };

        this.updateOverviewCards();
    }

    updateOverviewCards() {
        const data = this.analyticsData[this.currentTimeframe];
        
        document.getElementById('analyticsRevenue').textContent = `$${data.revenue.toLocaleString()}`;
        document.getElementById('analyticsOrders').textContent = data.orders.toLocaleString();
        document.getElementById('analyticsCustomers').textContent = data.customers.toLocaleString();
        document.getElementById('analyticsConversion').textContent = `${data.conversion}%`;
    }

    initializeCharts() {
        this.initRevenueChart();
        this.initTopProductsChart();
        this.initCustomerGrowthChart();
        this.initTrafficSourcesChart();
        this.initConversionFunnelChart();
    }

    initRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        const data = this.analyticsData[this.currentTimeframe];
        
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateLabels(data.revenueData.length),
                datasets: [{
                    label: 'Revenue',
                    data: data.revenueData,
                    borderColor: '#088178',
                    backgroundColor: 'rgba(8, 129, 120, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#088178',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#088178',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `Revenue: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#666',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initTopProductsChart() {
        const ctx = document.getElementById('topProductsChart').getContext('2d');
        const data = this.analyticsData[this.currentTimeframe];
        
        this.charts.topProducts = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['T-Shirts', 'Shirts', 'Accessories', 'Pants', 'Others'],
                datasets: [{
                    data: data.topProducts,
                    backgroundColor: [
                        '#088178',
                        '#0aa085',
                        '#ffc107',
                        '#dc3545',
                        '#6c757d'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: '#666'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    initCustomerGrowthChart() {
        const ctx = document.getElementById('customerGrowthChart').getContext('2d');
        const data = this.analyticsData[this.currentTimeframe];
        
        this.charts.customerGrowth = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.generateLabels(data.customerData.length),
                datasets: [{
                    label: 'New Customers',
                    data: data.customerData,
                    backgroundColor: 'rgba(8, 129, 120, 0.8)',
                    borderColor: '#088178',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#666'
                        }
                    }
                }
            }
        });
    }

    initTrafficSourcesChart() {
        const ctx = document.getElementById('trafficSourcesChart').getContext('2d');
        const data = this.analyticsData[this.currentTimeframe];
        
        this.charts.trafficSources = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Organic Search', 'Direct', 'Social Media', 'Referral'],
                datasets: [{
                    data: data.trafficSources,
                    backgroundColor: [
                        '#28a745',
                        '#007bff',
                        '#e83e8c',
                        '#fd7e14'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: '#666'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    initConversionFunnelChart() {
        const ctx = document.getElementById('conversionFunnelChart').getContext('2d');
        
        this.charts.conversionFunnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Visitors', 'Product Views', 'Add to Cart', 'Checkout', 'Purchase'],
                datasets: [{
                    label: 'Conversion Funnel',
                    data: [10000, 6500, 2100, 890, 320],
                    backgroundColor: [
                        'rgba(8, 129, 120, 0.9)',
                        'rgba(8, 129, 120, 0.7)',
                        'rgba(8, 129, 120, 0.5)',
                        'rgba(8, 129, 120, 0.3)',
                        'rgba(8, 129, 120, 0.1)'
                    ],
                    borderColor: '#088178',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                const percentage = context.dataIndex === 0 ? 100 : 
                                    ((context.parsed.x / 10000) * 100).toFixed(1);
                                return `${context.parsed.x.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#666'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#666'
                        }
                    }
                }
            }
        });
    }

    generateLabels(count) {
        const labels = [];
        const now = new Date();
        
        for (let i = count - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            if (count <= 7) {
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            } else if (count <= 31) {
                labels.push(date.getDate().toString());
            } else if (count <= 90) {
                if (i % 7 === 0) {
                    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                } else {
                    labels.push('');
                }
            } else {
                labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
            }
        }
        
        return labels;
    }

    updateAllData() {
        this.updateOverviewCards();
        this.updateAllCharts();
    }

    updateAllCharts() {
        const data = this.analyticsData[this.currentTimeframe];
        
        // Update revenue chart
        if (this.charts.revenue) {
            this.charts.revenue.data.labels = this.generateLabels(data.revenueData.length);
            this.charts.revenue.data.datasets[0].data = data.revenueData;
            this.charts.revenue.update();
        }
        
        // Update customer growth chart
        if (this.charts.customerGrowth) {
            this.charts.customerGrowth.data.labels = this.generateLabels(data.customerData.length);
            this.charts.customerGrowth.data.datasets[0].data = data.customerData;
            this.charts.customerGrowth.update();
        }
        
        // Update top products chart
        if (this.charts.topProducts) {
            this.charts.topProducts.data.datasets[0].data = data.topProducts;
            this.charts.topProducts.update();
        }
        
        // Update traffic sources chart
        if (this.charts.trafficSources) {
            this.charts.trafficSources.data.datasets[0].data = data.trafficSources;
            this.charts.trafficSources.update();
        }
    }

    updateQuickPeriod(period) {
        // Map quick periods to timeframes
        const periodMap = {
            'today': '7days',
            'week': '7days',
            'month': '30days',
            'quarter': '90days',
            'year': '1year'
        };
        
        this.currentTimeframe = periodMap[period] || '30days';
        document.getElementById('analyticsTimeframe').value = this.currentTimeframe;
        this.updateAllData();
    }

    updateChartPeriod(period) {
        // Update specific chart based on period
        console.log(`Updating chart period to: ${period}`);
        // This would typically update the chart with different granularity
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.simulateRealTimeUpdate();
        }, 30000);
    }

    simulateRealTimeUpdate() {
        // Add small random variations to simulate real-time data
        const data = this.analyticsData[this.currentTimeframe];
        
        // Update last data point with small variation
        if (data.revenueData.length > 0) {
            const lastIndex = data.revenueData.length - 1;
            const variation = (Math.random() - 0.5) * 200;
            data.revenueData[lastIndex] = Math.max(0, data.revenueData[lastIndex] + variation);
        }
        
        if (data.customerData.length > 0) {
            const lastIndex = data.customerData.length - 1;
            const variation = Math.floor((Math.random() - 0.5) * 10);
            data.customerData[lastIndex] = Math.max(0, data.customerData[lastIndex] + variation);
        }
        
        // Update charts
        this.updateAllCharts();
        this.updateOverviewCards();
    }
}

// Global functions for buttons
function exportAnalyticsReport() {
    const reportData = {
        timeframe: document.getElementById('analyticsTimeframe').value,
        generatedAt: new Date().toISOString(),
        data: dashboard.analyticsData[dashboard.currentTimeframe]
    };

    const jsonContent = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("Analytics report exported successfully!", "success");
}

function scheduleReport() {
    showNotification("Schedule report feature coming soon!", "info");
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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
`;
document.head.appendChild(style);

// Initialize dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new AnalyticsDashboard();
});