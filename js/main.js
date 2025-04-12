/**
 * MARDUK ECOSYSTEM - MAIN FUNCTIONALITY
 * JavaScript for common functionality across all pages
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    setupEventListeners();
    
    // Retrieve and apply user role from localStorage if available
    const savedRole = localStorage.getItem('mardukUserRole');
    if (savedRole) {
        switchUserRole(savedRole, false); // Don't save again to avoid recursion
    }
});

/**
 * Initialize UI components
 */
function initializeComponents() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Setup notification read functionality
    setupNotifications();
    
    // Setup mobile menu toggle
    const menuToggle = document.querySelector('.navbar-toggler');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Setup search functionality
    const searchInputs = document.querySelectorAll('input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchContent(this.value);
            }
        });
    });
}

/**
 * Handle search functionality
 * @param {string} query - The search query
 */
function searchContent(query) {
    if (query.trim() === '') return;
    
    console.log('Searching for:', query);
    // In a real implementation, this would navigate to search results page or filter content
    
    // Example implementation - redirect to store page with search query
    const currentPage = window.location.pathname;
    let targetURL;
    
    if (currentPage.includes('/pages/')) {
        targetURL = `solutions.html?search=${encodeURIComponent(query)}`;
    } else {
        targetURL = `pages/solutions.html?search=${encodeURIComponent(query)}`;
    }
    
    window.location.href = targetURL;
}

/**
 * Setup notification functionality
 */
function setupNotifications() {
    // Mark notification as read when clicked
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('unread');
            updateNotificationCount();
        });
    });
    
    // Handle "Mark all as read" button
    const markAllReadBtn = document.querySelector('button.text-primary');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent dropdown from closing
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            updateNotificationCount();
        });
    }
}

/**
 * Update notification count badge
 */
function updateNotificationCount() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const countBadge = document.querySelector('.position-absolute.badge.rounded-pill');
    
    if (countBadge) {
        if (unreadCount > 0) {
            countBadge.textContent = unreadCount;
            countBadge.style.display = 'inline-block';
        } else {
            countBadge.style.display = 'none';
        }
    }
}

/**
 * Switch between different user roles (for demo purposes)
 * @param {string} role - The role to switch to (funcionario, ciudadano, administrador, desarrollador)
 * @param {boolean} saveRole - Whether to save the role to localStorage (default: true)
 */
function switchUserRole(role, saveRole = true) {
    console.log('Switching to role:', role);
    
    // Define the role-specific styling
    const roleStyles = {
        funcionario: {
            btnClass: 'btn-primary',
            gradientClass: 'from-blue-500 to-blue-700',
            bannerClass: 'bg-gradient-blue'
        },
        ciudadano: {
            btnClass: 'btn-success',
            gradientClass: 'from-green-500 to-green-700',
            bannerClass: 'bg-gradient-green'
        },
        administrador: {
            btnClass: 'btn-purple',
            gradientClass: 'from-purple-500 to-purple-700',
            bannerClass: 'bg-gradient-purple'
        },
        desarrollador: {
            btnClass: 'btn-orange',
            gradientClass: 'from-orange-500 to-orange-700',
            bannerClass: 'bg-gradient-orange'
        }
    };
    
    // Update UI based on selected role
    const currentRoleStyle = roleStyles[role] || roleStyles.funcionario;
    
    // Update role buttons in dropdown
    document.querySelectorAll('[onclick^="switchUserRole"]').forEach(btn => {
        const btnRole = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        
        // Remove all active classes
        btn.classList.remove('btn-primary', 'btn-success', 'btn-purple', 'btn-orange');
        
        // Add appropriate outline or filled style
        if (btnRole === role) {
            btn.classList.add(currentRoleStyle.btnClass);
            btn.classList.remove('btn-outline-success', 'btn-outline-purple', 'btn-outline-orange');
        } else {
            const outlineClass = `btn-outline-${btnRole === 'funcionario' ? 'primary' : 
                                btnRole === 'ciudadano' ? 'success' : 
                                btnRole === 'administrador' ? 'purple' : 'orange'}`;
            btn.classList.add(outlineClass);
        }
    });
    
    // Update dashboard banner if it exists
    const dashboardBanner = document.querySelector('.dashboard-banner');
    if (dashboardBanner) {
        dashboardBanner.className = 'card mb-4 border-0 dashboard-banner';
        dashboardBanner.classList.add(currentRoleStyle.bannerClass);
    }
    
    // Update user profile information
    updateUserProfileInfo(role);
    
    // Save role to localStorage if needed
    if (saveRole) {
        localStorage.setItem('mardukUserRole', role);
    }
    
    // Dispatch custom event for other components to react
    const event = new CustomEvent('userRoleChanged', { 
        detail: { role: role } 
    });
    document.dispatchEvent(event);
}

/**
 * Update user profile information based on role
 * @param {string} role - The user role
 */
function updateUserProfileInfo(role) {
    // Define user profiles
    const userProfiles = {
        funcionario: {
            name: "Ana María González",
            role: "Juez Civil Municipal",
            avatar: "AG",
            notifications: 4
        },
        ciudadano: {
            name: "Carlos Rodríguez",
            role: "Abogado Litigante",
            avatar: "CR",
            notifications: 2
        },
        administrador: {
            name: "Mónica Valencia",
            role: "Administrador de Sistemas",
            avatar: "MV",
            notifications: 8
        },
        desarrollador: {
            name: "Javier Moreno",
            role: "Desarrollador Senior",
            avatar: "JM",
            notifications: 5
        }
    };
    
    const profile = userProfiles[role] || userProfiles.funcionario;
    
    // Update user name, role and avatar
    const userNameElements = document.querySelectorAll('.dropdown-toggle .lh-1');
    const userRoleElements = document.querySelectorAll('.dropdown-toggle .small.opacity-75');
    const avatarElements = document.querySelectorAll('.avatar-circle:not(.avatar-circle-sm):not(.avatar-circle-xs):not(.avatar-circle-lg)');
    
    userNameElements.forEach(el => el.textContent = profile.name);
    userRoleElements.forEach(el => el.textContent = profile.role);
    avatarElements.forEach(el => el.textContent = profile.avatar);
    
    // Update notification count
    const notificationBadge = document.querySelector('.position-absolute.badge.rounded-pill');
    if (notificationBadge) {
        notificationBadge.textContent = profile.notifications;
    }
    
    // Update dashboard title if it exists
    const dashboardTitle = document.querySelector('.dashboard-banner h1');
    if (dashboardTitle) {
        const titles = {
            funcionario: "Dashboard de Funcionario Judicial",
            ciudadano: "Portal Ciudadano de Justicia",
            administrador: "Centro de Administración Judicial",
            desarrollador: "Hub de Desarrollo Judicial"
        };
        dashboardTitle.textContent = titles[role] || titles.funcionario;
    }
    
    // Update welcome message if it exists
    const welcomeMessage = document.querySelector('.dashboard-banner p.opacity-90');
    if (welcomeMessage && welcomeMessage.textContent.includes('Bienvenido')) {
        welcomeMessage.textContent = `Bienvenido de nuevo, ${profile.name}`;
    }
}

/**
 * Handle navigation between pages
 * @param {string} page - The page to navigate to
 * @param {Object} params - Additional parameters
 */
function navigateTo(page, params = {}) {
    let url = '';
    
    // Determine if we're in a subdirectory
    const inSubdirectory = window.location.pathname.includes('/pages/');
    const prefix = inSubdirectory ? '../' : '';
    
    // Build the URL based on the page parameter
    switch (page) {
        case 'home':
            url = `${prefix}index.html`;
            break;
        case 'profile':
        case 'solutions':
        case 'community':
            url = `${prefix}pages/${page}.html`;
            break;
        case 'app-detail':
            url = `${prefix}pages/solutions.html?app=${params.appId}`;
            break;
        default:
            url = `${prefix}index.html`;
    }
    
    // Add any additional query parameters
    if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const key in params) {
            if (key !== 'appId') { // We already handled appId in app-detail case
                queryParams.append(key, params[key]);
            }
        }
        
        const queryString = queryParams.toString();
        if (queryString) {
            url += (url.includes('?') ? '&' : '?') + queryString;
        }
    }
    
    // Navigate to the URL
    window.location.href = url;
}

/**
 * Parse query parameters from URL
 * @returns {Object} - The parsed query parameters
 */
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    
    if (queryString) {
        const pairs = queryString.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

/**
 * Format a number with thousands separator
 * @param {number} num - The number to format
 * @returns {string} - The formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format a date relative to now (e.g., "2 days ago")
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted relative date
 */
function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return "Hoy";
    } else if (diffDays === 1) {
        return "Ayer";
    } else if (diffDays < 7) {
        return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
        const diffWeeks = Math.floor(diffDays / 7);
        return `Hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
    } else if (diffDays < 365) {
        const diffMonths = Math.floor(diffDays / 30);
        return `Hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
    } else {
        const diffYears = Math.floor(diffDays / 365);
        return `Hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`;
    }
}