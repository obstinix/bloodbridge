/**
 * Blood Bank Management System - Main JavaScript
 * Handles common functionality across all pages
 */

// Global variables
let currentUser = null;
let notifications = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserPreferences();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Setup auto-save for forms
    setupAutoSave();
    
    // Initialize real-time updates
    initializeRealTimeUpdates();
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Handle form submissions
    document.addEventListener('submit', handleFormSubmission);
    
    // Handle navigation clicks
    document.addEventListener('click', handleNavigationClick);
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Handle page visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                showValidationErrors(form);
            }
            form.classList.add('was-validated');
        });
    });
}

/**
 * Show validation errors
 */
function showValidationErrors(form) {
    const invalidFields = form.querySelectorAll(':invalid');
    
    invalidFields.forEach(field => {
        field.classList.add('is-invalid');
        
        // Add custom error message
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = field.validationMessage;
    });
}

/**
 * Setup auto-save for forms
 */
function setupAutoSave() {
    const forms = document.querySelectorAll('form[data-autosave]');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                saveFormData(form);
            }, 1000));
        });
    });
}

/**
 * Save form data to localStorage
 */
function saveFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(`form_${form.id || 'default'}`, JSON.stringify(data));
}

/**
 * Load form data from localStorage
 */
function loadFormData(formId) {
    const data = localStorage.getItem(`form_${formId}`);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

/**
 * Clear saved form data
 */
function clearFormData(formId) {
    localStorage.removeItem(`form_${formId}`);
}

/**
 * Initialize real-time updates
 */
function initializeRealTimeUpdates() {
    // Check for updates every 30 seconds
    setInterval(checkForUpdates, 30000);
    
    // Setup WebSocket connection for real-time updates (if available)
    if (typeof WebSocket !== 'undefined') {
        setupWebSocketConnection();
    }
}

/**
 * Check for updates
 */
function checkForUpdates() {
    // This would make an AJAX call to check for updates
    // For now, we'll just update the last seen time
    updateLastSeenTime();
}

/**
 * Setup WebSocket connection
 */
function setupWebSocketConnection() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = function() {
            console.log('WebSocket connection established');
        };
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
        };
        
        ws.onclose = function() {
            console.log('WebSocket connection closed');
            // Attempt to reconnect after 5 seconds
            setTimeout(setupWebSocketConnection, 5000);
        };
        
        ws.onerror = function(error) {
            console.error('WebSocket error:', error);
        };
    } catch (error) {
        console.error('WebSocket setup failed:', error);
    }
}

/**
 * Handle WebSocket messages
 */
function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'notification':
            showNotification(data.message, data.level);
            break;
        case 'inventory_update':
            updateInventoryDisplay(data.inventory);
            break;
        case 'request_update':
            updateRequestStatus(data.requestId, data.status);
            break;
        default:
            console.log('Unknown WebSocket message type:', data.type);
    }
}

/**
 * Handle form submission
 */
function handleFormSubmission(event) {
    const form = event.target;
    
    // Add loading state to submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;
        
        // Restore button state after 3 seconds (fallback)
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
    }
    
    // Clear saved form data on successful submission
    if (form.id) {
        clearFormData(form.id);
    }
}

/**
 * Handle navigation clicks
 */
function handleNavigationClick(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    // Add loading state for internal links
    if (link.hostname === window.location.hostname) {
        link.classList.add('loading');
    }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        focusSearchInput();
    }
    
    // Escape key to close modals
    if (event.key === 'Escape') {
        closeActiveModal();
    }
    
    // Ctrl/Cmd + Enter to submit forms
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const form = event.target.closest('form');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
}

/**
 * Handle window resize
 */
function handleWindowResize() {
    // Update any responsive elements
    updateResponsiveElements();
}

/**
 * Handle page visibility change
 */
function handleVisibilityChange() {
    if (document.hidden) {
        // Page is hidden, pause updates
        pauseUpdates();
    } else {
        // Page is visible, resume updates
        resumeUpdates();
    }
}

/**
 * Focus search input
 */
function focusSearchInput() {
    const searchInput = document.querySelector('input[type="search"], #searchInput');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

/**
 * Close active modal
 */
function closeActiveModal() {
    const activeModal = document.querySelector('.modal.show');
    if (activeModal) {
        const modal = bootstrap.Modal.getInstance(activeModal);
        if (modal) {
            modal.hide();
        }
    }
}

/**
 * Update responsive elements
 */
function updateResponsiveElements() {
    // Update table responsiveness
    const tables = document.querySelectorAll('.table-responsive');
    tables.forEach(table => {
        if (window.innerWidth < 768) {
            table.classList.add('table-sm');
        } else {
            table.classList.remove('table-sm');
        }
    });
}

/**
 * Pause updates
 */
function pauseUpdates() {
    // Pause any running intervals or timeouts
    console.log('Updates paused');
}

/**
 * Resume updates
 */
function resumeUpdates() {
    // Resume any paused intervals or timeouts
    console.log('Updates resumed');
    checkForUpdates();
}

/**
 * Show notification
 */
function showNotification(message, level = 'info', duration = 5000) {
    const notification = createNotificationElement(message, level);
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

/**
 * Create notification element
 */
function createNotificationElement(message, level) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${level} alert-dismissible fade position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    return notification;
}

/**
 * Update inventory display
 */
function updateInventoryDisplay(inventory) {
    // Update blood inventory cards
    inventory.forEach(item => {
        const card = document.querySelector(`[data-blood-group="${item.blood_group}"]`);
        if (card) {
            const quantityElement = card.querySelector('.quantity');
            if (quantityElement) {
                quantityElement.textContent = `${item.quantity} ml`;
            }
            
            // Update status class
            card.className = `blood-group-card ${getInventoryStatus(item.quantity)}`;
        }
    });
}

/**
 * Get inventory status class
 */
function getInventoryStatus(quantity) {
    if (quantity === 0) return 'critical';
    if (quantity < 50) return 'low';
    if (quantity < 100) return 'moderate';
    return 'good';
}

/**
 * Update request status
 */
function updateRequestStatus(requestId, status) {
    const requestRow = document.querySelector(`[data-request-id="${requestId}"]`);
    if (requestRow) {
        const statusElement = requestRow.querySelector('.status-badge');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `badge status-badge ${getStatusClass(status)}`;
        }
    }
}

/**
 * Get status class
 */
function getStatusClass(status) {
    const statusClasses = {
        'Pending': 'bg-warning',
        'Approved': 'bg-success',
        'Rejected': 'bg-danger',
        'Fulfilled': 'bg-info'
    };
    return statusClasses[status] || 'bg-secondary';
}

/**
 * Update last seen time
 */
function updateLastSeenTime() {
    const lastSeenElement = document.querySelector('.last-seen');
    if (lastSeenElement) {
        lastSeenElement.textContent = new Date().toLocaleTimeString();
    }
}

/**
 * Load user preferences
 */
function loadUserPreferences() {
    const preferences = localStorage.getItem('userPreferences');
    if (preferences) {
        const prefs = JSON.parse(preferences);
        applyUserPreferences(prefs);
    }
}

/**
 * Apply user preferences
 */
function applyUserPreferences(preferences) {
    // Apply theme
    if (preferences.theme) {
        document.body.setAttribute('data-theme', preferences.theme);
    }
    
    // Apply language
    if (preferences.language) {
        document.documentElement.lang = preferences.language;
    }
    
    // Apply other preferences
    if (preferences.autoRefresh !== undefined) {
        // Set auto-refresh preference
    }
}

/**
 * Save user preferences
 */
function saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format date
 */
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format time
 */
function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success', 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showNotification('Failed to copy to clipboard', 'error', 3000);
    }
}

/**
 * Download data as CSV
 */
function downloadCSV(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

/**
 * Convert data to CSV
 */
function convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

/**
 * Export table data
 */
function exportTableData(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const data = [];
    const headers = [];
    const headerCells = table.querySelectorAll('thead th');
    
    headerCells.forEach(cell => {
        headers.push(cell.textContent.trim());
    });
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowData = {};
        const cells = row.querySelectorAll('td');
        
        cells.forEach((cell, index) => {
            if (headers[index]) {
                rowData[headers[index]] = cell.textContent.trim();
            }
        });
        
        data.push(rowData);
    });
    
    downloadCSV(data, filename);
}

// Export functions for global use
window.BloodBankApp = {
    showNotification,
    copyToClipboard,
    downloadCSV,
    exportTableData,
    formatNumber,
    formatDate,
    formatTime
};
