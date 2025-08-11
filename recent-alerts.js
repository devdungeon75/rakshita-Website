// Recent Alerts JavaScript Functionality

let alerts = [];
let filteredAlerts = [];
let currentPage = 1;
const itemsPerPage = 10;

// Initialize mock data
function initializeMockData() {
    const names = [
        'Priya Sharma', 'Rahul Kumar', 'Anjali Patel', 'Vikram Singh', 'Meera Reddy',
        'Arjun Mehta', 'Kavya Iyer', 'Rohan Desai', 'Zara Khan', 'Aditya Verma',
        'Ishita Gupta', 'Karan Malhotra', 'Neha Joshi', 'Aryan Sharma', 'Diya Kapoor'
    ];
    
    const locations = [
        'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka',
        'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Hyderabad, Telangana',
        'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Jaipur, Rajasthan',
        'Lucknow, Uttar Pradesh', 'Chandigarh, Punjab', 'Bhopal, Madhya Pradesh'
    ];
    
    const messages = [
        'Need immediate assistance',
        'Feeling unsafe in current location',
        'Medical emergency',
        'Vehicle breakdown on highway',
        'Lost in unfamiliar area',
        'Suspicious activity nearby',
        'Accident occurred',
        'Health issue requiring help',
        'Stuck in traffic jam',
        'Car trouble',
        null // Some alerts without messages
    ];
    
    // Generate alerts for the last 24 hours
    for (let i = 0; i < 25; i++) {
        const timestamp = new Date(Date.now() - Math.random() * 86400000); // Random time in last 24 hours
        const alert = {
            id: Date.now() + Math.random() + i,
            name: names[Math.floor(Math.random() * names.length)],
            latitude: 20.5937 + (Math.random() - 0.5) * 20,
            longitude: 78.9629 + (Math.random() - 0.5) * 20,
            location: locations[Math.floor(Math.random() * locations.length)],
            timestamp: timestamp.toISOString(),
            status: Math.random() > 0.3 ? 'resolved' : 'active', // 30% active, 70% resolved
            message: messages[Math.floor(Math.random() * messages.length)]
        };
        alerts.push(alert);
    }
    
    // Sort by timestamp (newest first)
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    filteredAlerts = [...alerts];
    renderTable();
    updateStats();
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
}

// Create table row HTML
function createTableRow(alert) {
    return `
        <tr>
            <td>
                <div class="user-name">${alert.name}</div>
            </td>
            <td>
                <div class="location-info">
                    <i class="fas fa-map-marker-alt"></i>
                    ${alert.location}
                </div>
            </td>
            <td>
                <div class="time-info">${formatTime(alert.timestamp)}</div>
            </td>
            <td>
                <span class="status-badge ${alert.status}">${alert.status}</span>
            </td>
            <td>
                <div class="message-content" title="${alert.message || 'No message'}">
                    ${alert.message || '-'}
                </div>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn view" onclick="viewAlert('${alert.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn map" onclick="viewOnMap('${alert.id}')" title="View on Map">
                        <i class="fas fa-map-marked-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Render table
function renderTable() {
    const tableBody = document.getElementById('alertsTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageAlerts = filteredAlerts.slice(startIndex, endIndex);
    
    if (pageAlerts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h4>No alerts found</h4>
                        <p>No SOS alerts match your current filters.</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = pageAlerts.map(alert => createTableRow(alert)).join('');
    }
    
    updatePagination();
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
    const currentPageElement = document.getElementById('currentPage');
    const totalPagesElement = document.getElementById('totalPages');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    currentPageElement.textContent = currentPage;
    totalPagesElement.textContent = totalPages;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Update stats
function updateStats() {
    const totalAlerts = document.getElementById('totalAlerts');
    totalAlerts.textContent = filteredAlerts.length;
}

// Filter alerts
function filterAlerts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const timeFilter = document.getElementById('timeFilter').value;
    
    filteredAlerts = alerts.filter(alert => {
        // Search filter
        const matchesSearch = alert.name.toLowerCase().includes(searchTerm) ||
                            alert.location.toLowerCase().includes(searchTerm) ||
                            (alert.message && alert.message.toLowerCase().includes(searchTerm));
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
        
        // Time filter
        const alertTime = new Date(alert.timestamp);
        const now = new Date();
        let matchesTime = true;
        
        if (timeFilter === '1h') {
            matchesTime = (now - alertTime) <= 3600000;
        } else if (timeFilter === '6h') {
            matchesTime = (now - alertTime) <= 21600000;
        } else if (timeFilter === '12h') {
            matchesTime = (now - alertTime) <= 43200000;
        } else if (timeFilter === '24h') {
            matchesTime = (now - alertTime) <= 86400000;
        }
        
        return matchesSearch && matchesStatus && matchesTime;
    });
    
    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    currentPage = 1; // Reset to first page
    renderTable();
    updateStats();
}

// View alert details
function viewAlert(alertId) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
        // Create modal for alert details
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0; color: #333;">Alert Details</h3>
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>User:</strong> ${alert.name}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Location:</strong> ${alert.location}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Time:</strong> ${formatTime(alert.timestamp)}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Status:</strong> 
                    <span class="status-badge ${alert.status}">${alert.status}</span>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Coordinates:</strong> ${alert.latitude.toFixed(6)}, ${alert.longitude.toFixed(6)}
                </div>
                ${alert.message ? `
                    <div style="margin-bottom: 1rem;">
                        <strong>Message:</strong> ${alert.message}
                    </div>
                ` : ''}
                <div style="text-align: center; margin-top: 2rem;">
                    <button onclick="viewOnMap('${alert.id}')" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        margin-right: 1rem;
                    ">
                        <i class="fas fa-map-marked-alt"></i>
                        View on Map
                    </button>
                    <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// View alert on map
function viewOnMap(alertId) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
        // Redirect to live map with coordinates
        const url = `live-map.html?lat=${alert.latitude}&lng=${alert.longitude}&alert=${alertId}`;
        window.open(url, '_blank');
    }
}

// Export data
function exportData() {
    const csvContent = [
        ['User Name', 'Location', 'Time of Alert', 'Status', 'Message', 'Latitude', 'Longitude'],
        ...filteredAlerts.map(alert => [
            alert.name,
            alert.location,
            new Date(alert.timestamp).toLocaleString(),
            alert.status,
            alert.message || '',
            alert.latitude,
            alert.longitude
        ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rakshita-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Update last update time
function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    lastUpdate.textContent = 'Just now';
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
    // Simulate new alerts
    setInterval(() => {
        if (Math.random() < 0.2) { // 20% chance of new alert
            const newAlert = generateMockAlert();
            alerts.unshift(newAlert);
            filterAlerts();
            updateLastUpdateTime();
            
            // Show notification
            showNotification(`New SOS alert from ${newAlert.name}`);
        }
    }, 15000); // Every 15 seconds
    
    // Simulate status changes
    setInterval(() => {
        if (alerts.length > 0 && Math.random() < 0.15) { // 15% chance of status change
            const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
            if (randomAlert.status === 'active') {
                randomAlert.status = 'resolved';
                filterAlerts();
                updateLastUpdateTime();
            }
        }
    }, 20000); // Every 20 seconds
}

// Generate mock alert
function generateMockAlert() {
    const names = ['Priya Sharma', 'Rahul Kumar', 'Anjali Patel', 'Vikram Singh', 'Meera Reddy'];
    const locations = [
        'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka',
        'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Hyderabad, Telangana'
    ];
    const messages = [
        'Need immediate assistance',
        'Feeling unsafe',
        'Medical emergency',
        'Vehicle breakdown',
        'Lost in unfamiliar area',
        null
    ];
    
    const latitude = 20.5937 + (Math.random() - 0.5) * 20;
    const longitude = 78.9629 + (Math.random() - 0.5) * 20;
    
    return {
        id: Date.now() + Math.random(),
        name: names[Math.floor(Math.random() * names.length)],
        latitude: latitude,
        longitude: longitude,
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: new Date().toISOString(),
        status: 'active',
        message: messages[Math.floor(Math.random() * messages.length)]
    };
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMockData();
    simulateRealTimeUpdates();
    
    // Add event listeners
    document.getElementById('searchInput').addEventListener('input', filterAlerts);
    document.getElementById('statusFilter').addEventListener('change', filterAlerts);
    document.getElementById('timeFilter').addEventListener('change', filterAlerts);
    
    document.getElementById('exportBtn').addEventListener('click', exportData);
    
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    
    document.getElementById('refreshBtn').addEventListener('click', () => {
        // Simulate refresh
        const btn = document.getElementById('refreshBtn');
        const icon = btn.querySelector('i');
        icon.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            icon.style.transform = 'rotate(0deg)';
            updateLastUpdateTime();
        }, 1000);
    });
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        updateLastUpdateTime();
    }, 30000);
});

// Make functions globally available
window.viewAlert = viewAlert;
window.viewOnMap = viewOnMap;
