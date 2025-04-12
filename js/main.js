/**
 * MARDUK ECOSYSTEM - FUNCIONALIDAD PRINCIPAL
 * JavaScript para funcionalidad común en todas las páginas
 *
 * Este archivo contiene las funciones principales que se utilizan
 * en todo el ecosistema Marduk, incluyendo la inicialización de
 * componentes, gestión de eventos y funcionalidades comunes.
 */

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes UI
    initializeComponents();

    // Configurar listeners de eventos
    setupEventListeners();

    // Inicializar modo oscuro
    initDarkMode();

    // Recuperar y aplicar el rol de usuario desde localStorage si está disponible
    const savedRole = localStorage.getItem('mardukUserRole');
    if (savedRole) {
        switchUserRole(savedRole, false); // No guardar de nuevo para evitar recursión
    }

    // Mostrar animación de entrada
    document.body.classList.add('animate-fade-in');
});

/**
 * Inicializa los componentes de la interfaz de usuario
 */
function initializeComponents() {
    // Inicializar todos los tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar todos los popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Inicializar componentes personalizados
    initCustomComponents();
}

/**
 * Configura los listeners de eventos globales
 */
function setupEventListeners() {
    // Configurar funcionalidad de lectura de notificaciones
    setupNotifications();

    // Configurar toggle del menú móvil
    const menuToggle = document.querySelector('.navbar-toggler');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }

    // Configurar funcionalidad de búsqueda (si no se usa el sistema avanzado)
    if (!window.advancedSearch) {
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

    // Configurar toggle de modo oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

/**
 * Maneja la funcionalidad de búsqueda básica
 * @param {string} query - La consulta de búsqueda
 */
function searchContent(query) {
    if (query.trim() === '') return;

    console.log('Buscando:', query);

    // Si existe el sistema de búsqueda avanzada, usarlo
    if (window.advancedSearch) {
        window.advancedSearch.search(query);
        return;
    }

    // Implementación básica - redireccionar a la página de soluciones con la consulta
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
 * Formatea una fecha relativa al momento actual (ej: "hace 2 días")
 * @param {string} dateString - La cadena de fecha a formatear
 * @returns {string} - La fecha relativa formateada
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

/**
 * Inicializa componentes personalizados adicionales
 */
function initCustomComponents() {
    // Inicializar tooltips personalizados
    initCustomTooltips();

    // Inicializar botones de acción rápida
    initQuickActionButtons();

    // Inicializar tarjetas interactivas
    initInteractiveCards();
}

/**
 * Inicializa tooltips personalizados con más información
 */
function initCustomTooltips() {
    const enhancedTooltips = document.querySelectorAll('[data-enhanced-tooltip]');

    enhancedTooltips.forEach(element => {
        const tooltipContent = element.getAttribute('data-enhanced-tooltip');
        const tooltipPosition = element.getAttribute('data-tooltip-position') || 'top';

        element.addEventListener('mouseenter', function(e) {
            // Crear tooltip personalizado
            const tooltip = document.createElement('div');
            tooltip.className = 'enhanced-tooltip';
            tooltip.innerHTML = tooltipContent;
            tooltip.setAttribute('data-position', tooltipPosition);

            // Añadir al DOM
            document.body.appendChild(tooltip);

            // Posicionar tooltip
            positionTooltip(tooltip, element, tooltipPosition);

            // Mostrar con animación
            setTimeout(() => {
                tooltip.classList.add('visible');
            }, 10);
        });

        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.enhanced-tooltip');
            if (tooltip) {
                tooltip.classList.remove('visible');

                // Eliminar después de la animación
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 300);
            }
        });
    });
}

/**
 * Posiciona un tooltip personalizado
 */
function positionTooltip(tooltip, element, position) {
    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top, left;

    switch (position) {
        case 'top':
            top = elementRect.top - tooltipRect.height - 10;
            left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
            break;
        case 'bottom':
            top = elementRect.bottom + 10;
            left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
            break;
        case 'left':
            top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
            left = elementRect.left - tooltipRect.width - 10;
            break;
        case 'right':
            top = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
            left = elementRect.right + 10;
            break;
    }

    // Ajustar para evitar que salga de la ventana
    if (top < 0) top = 0;
    if (left < 0) left = 0;
    if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 5;
    }

    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left}px`;
}

/**
 * Inicializa botones de acción rápida
 */
function initQuickActionButtons() {
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');

    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const target = this.getAttribute('data-target');

            // Mostrar efecto de clic
            this.classList.add('btn-clicked');
            setTimeout(() => {
                this.classList.remove('btn-clicked');
            }, 300);

            // Ejecutar acción correspondiente
            executeQuickAction(action, target, this);
        });
    });
}

/**
 * Ejecuta una acción rápida
 */
function executeQuickAction(action, target, buttonElement) {
    console.log(`Ejecutando acción rápida: ${action} en ${target}`);

    // Implementar acciones específicas según sea necesario
    switch (action) {
        case 'favorite':
            toggleFavorite(target, buttonElement);
            break;
        case 'share':
            shareContent(target);
            break;
        case 'download':
            downloadContent(target);
            break;
        // Otras acciones...
    }
}

/**
 * Inicializa tarjetas interactivas
 */
function initInteractiveCards() {
    const interactiveCards = document.querySelectorAll('.interactive-card');

    interactiveCards.forEach(card => {
        // Efecto de hover 3D
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });

        // Restablecer al salir
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/**
 * Inicializa el modo oscuro
 */
function initDarkMode() {
    // Verificar preferencia guardada
    const darkModeEnabled = localStorage.getItem('darkModeEnabled');

    // Aplicar modo oscuro si está habilitado
    if (darkModeEnabled === 'true') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateDarkModeToggle(true);
    } else {
        // Verificar preferencia del sistema
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateDarkModeToggle(true);
            localStorage.setItem('darkModeEnabled', 'true');
        }
    }

    // Añadir botón de modo oscuro si no existe
    addDarkModeToggle();
}

/**
 * Alterna entre modo claro y oscuro
 */
function toggleDarkMode() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDarkMode) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('darkModeEnabled', 'false');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkModeEnabled', 'true');
    }

    // Actualizar estado del botón
    updateDarkModeToggle(!isDarkMode);
}

/**
 * Actualiza el estado del botón de modo oscuro
 */
function updateDarkModeToggle(isDarkMode) {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    const icon = toggle.querySelector('i');
    if (icon) {
        if (isDarkMode) {
            icon.className = 'fas fa-sun';
            toggle.setAttribute('title', 'Cambiar a modo claro');
        } else {
            icon.className = 'fas fa-moon';
            toggle.setAttribute('title', 'Cambiar a modo oscuro');
        }
    }
}

/**
 * Añade el botón de modo oscuro si no existe
 */
function addDarkModeToggle() {
    // Verificar si ya existe
    if (document.getElementById('darkModeToggle')) return;

    // Buscar contenedor para el botón
    const userMenu = document.querySelector('.d-flex.align-items-center');
    if (!userMenu) return;

    // Crear botón
    const darkModeButton = document.createElement('button');
    darkModeButton.id = 'darkModeToggle';
    darkModeButton.className = 'btn btn-link text-light position-relative p-1 me-3';
    darkModeButton.setAttribute('title', 'Cambiar modo oscuro/claro');

    // Determinar icono inicial
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    darkModeButton.innerHTML = `<i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>`;

    // Insertar antes del primer elemento
    userMenu.insertBefore(darkModeButton, userMenu.firstChild);

    // Añadir evento
    darkModeButton.addEventListener('click', toggleDarkMode);
}