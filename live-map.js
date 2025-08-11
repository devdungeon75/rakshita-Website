// Live Map JavaScript Functionality

let map;
let markers = [];
let alerts = [];
let filteredAlerts = [];

// Initialize the map
function initMap() {
    // Initialize map centered on India
    map = L.map('map').setView([20.5937, 78.9629], 5);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add custom CSS for map controls
    const mapStyle = document.createElement('style');
    mapStyle.textContent = `
        .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        }
        .leaflet-control-zoom a {
            background: white !important;
            color: #333 !important;
            border: 1px solid #ddd !important;
        }
        .leaflet-control-zoom a:hover {
            background: #f8f9fa !important;
        }
    `;
    document.head.appendChild(mapStyle);
}

// Create custom marker icon
function createMarkerIcon(status) {
    const color = status === 'active' ? '#e74c3c' : '#27ae60';
    const iconHtml = `
        <div style="
            background: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <i class="fas fa-exclamation-triangle" style="color: white; font-size: 10px;"></i>
        </div>
    `;
    
    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

// Add marker to map
function addMarker(alert) {
    const marker = L.marker([alert.latitude, alert.longitude], {
        icon: createMarkerIcon(alert.status)
    }).addTo(map);
    
    // Create popup content
    const popupContent = `
        <div class="popup-content">
            <h3>${alert.name}</h3>
            <p><strong>Status:</strong> <span class="status-${alert.status}">${alert.status}</span></p>
            <p><strong>Location:</strong> ${alert.location}</p>
            <p><strong>Time:</strong> <span class="popup-time">${formatTime(alert.timestamp)}</span></p>
            ${alert.message ? `<p><strong>Message:</strong> ${alert.message}</p>` : ''}
        </div>
    `;
    
    marker.bindPopup(popupContent);
    markers.push({ id: alert.id, marker: marker });
    
    return marker;
}

// Remove marker from map
function removeMarker(alertId) {
    const markerIndex = markers.findIndex(m => m.id === alertId);
    if (markerIndex !== -1) {
        map.removeLayer(markers[markerIndex].marker);
        markers.splice(markerIndex, 1);
    }
}

// Update marker on map
function updateMarker(alert) {
    removeMarker(alert.id);
    addMarker(alert);
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

// Create alert item HTML
function createAlertItem(alert) {
    return `
        <div class="alert-item ${alert.status}" data-id="${alert.id}">
            <div class="alert-header">
                <div class="alert-name">${alert.name}</div>
                <div class="alert-status ${alert.status}">${alert.status}</div>
            </div>
            <div class="alert-location">
                <i class="fas fa-map-marker-alt"></i>
                ${alert.location}
            </div>
            <div class="alert-time">
                <i class="fas fa-clock"></i>
                ${formatTime(alert.timestamp)}
            </div>
            ${alert.message ? `<div class="alert-message">${alert.message}</div>` : ''}
        </div>
    `;
}

// Render alerts list
function renderAlerts() {
    const alertsList = document.getElementById('alertsList');
    const alertCount = document.getElementById('alertCount');
    
    if (filteredAlerts.length === 0) {
        alertsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shield-alt"></i>
                <h4>No alerts found</h4>
                <p>No SOS alerts match your current filters.</p>
            </div>
        `;
    } else {
        alertsList.innerHTML = filteredAlerts.map(alert => createAlertItem(alert)).join('');
    }
    
    alertCount.textContent = filteredAlerts.filter(alert => alert.status === 'active').length;
    
    // Add click handlers to alert items
    document.querySelectorAll('.alert-item').forEach(item => {
        item.addEventListener('click', () => {
            const alertId = item.dataset.id;
            const alert = alerts.find(a => a.id === alertId);
            if (alert) {
                map.setView([alert.latitude, alert.longitude], 15);
                const marker = markers.find(m => m.id === alertId);
                if (marker) {
                    marker.marker.openPopup();
                }
            }
        });
    });
}

// Filter alerts
function filterAlerts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const timeFilter = document.getElementById('timeFilter').value;
    
    filteredAlerts = alerts.filter(alert => {
        // Search filter
        const matchesSearch = alert.name.toLowerCase().includes(searchTerm) ||
                            alert.location.toLowerCase().includes(searchTerm);
        
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
        } else if (timeFilter === '24h') {
            matchesTime = (now - alertTime) <= 86400000;
        }
        
        return matchesSearch && matchesStatus && matchesTime;
    });
    
    renderAlerts();
    updateMapMarkers();
}

// Update map markers based on filtered alerts
function updateMapMarkers() {
    // Clear all markers
    markers.forEach(m => map.removeLayer(m.marker));
    markers = [];
    
    // Add markers for filtered alerts
    filteredAlerts.forEach(alert => {
        addMarker(alert);
    });
}

// Update last update time
function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    lastUpdate.textContent = 'Just now';
}

// Simulate real-time data updates
function simulateRealTimeUpdates() {
    // Simulate new alerts
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance of new alert
            const newAlert = generateMockAlert();
            alerts.unshift(newAlert);
            addMarker(newAlert);
            filterAlerts();
            updateLastUpdateTime();
            
            // Show notification
            showNotification(`New SOS alert from ${newAlert.name}`);
        }
    }, 10000); // Every 10 seconds
    
    // Simulate status changes
    setInterval(() => {
        if (alerts.length > 0 && Math.random() < 0.2) { // 20% chance of status change
            const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
            if (randomAlert.status === 'active') {
                randomAlert.status = 'resolved';
                updateMarker(randomAlert);
                filterAlerts();
                updateLastUpdateTime();
            }
        }
    }, 15000); // Every 15 seconds
}

// Generate mock alert data
function generateMockAlert() {
    const names = ['Priya Sharma', 'Rahul Kumar', 'Anjali Patel', 'Vikram Singh', 'Meera Reddy'];
    const locations = [
        'Mumbai, Maharashtra',
        'Delhi, Delhi',
        'Bangalore, Karnataka',
        'Chennai, Tamil Nadu',
        'Kolkata, West Bengal',
        'Hyderabad, Telangana',
        'Pune, Maharashtra',
        'Ahmedabad, Gujarat'
    ];
    const messages = [
        'Need immediate assistance',
        'Feeling unsafe',
        'Medical emergency',
        'Vehicle breakdown',
        'Lost in unfamiliar area',
        null // Some alerts without messages
    ];
    
    // Generate random coordinates within India
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

// Initialize mock data
function initializeMockData() {
    // Generate initial alerts
    for (let i = 0; i < 5; i++) {
        const alert = generateMockAlert();
        alert.timestamp = new Date(Date.now() - Math.random() * 3600000).toISOString(); // Random time in last hour
        alerts.push(alert);
    }
    
    filteredAlerts = [...alerts];
    renderAlerts();
    updateMapMarkers();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initializeMockData();
    simulateRealTimeUpdates();
    
    // Add event listeners
    document.getElementById('searchInput').addEventListener('input', filterAlerts);
    document.getElementById('statusFilter').addEventListener('change', filterAlerts);
    document.getElementById('timeFilter').addEventListener('change', filterAlerts);
    
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

// Handle window resize
window.addEventListener('resize', () => {
    if (map) {
        map.invalidateSize();
    }
});
