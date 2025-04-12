/**
 * MARDUK ECOSYSTEM - DASHBOARD FUNCTIONALITY
 * JavaScript for dashboard-specific functionality
 */

// Initialize dashboard elements when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    
    // Listen for role changes to update dashboard
    document.addEventListener('userRoleChanged', function(event) {
        updateDashboardByRole(event.detail.role);
    });
});

/**
 * Initialize dashboard elements
 */
function initializeDashboard() {
    // Initialize task checkboxes
    setupTaskCheckboxes();
    
    // Setup carousel autoplay with pause on hover
    setupCarousel();
    
    // Initialize tabbed content if present
    initializeTabbedContent();
    
    // Update dashboard based on current role
    const currentRole = localStorage.getItem('mardukUserRole') || 'funcionario';
    updateDashboardByRole(currentRole);
    
    // Setup ecosystem impact charts if they exist
    setupEcosystemImpactCharts();
}

/**
 * Setup task checkboxes functionality
 */
function setupTaskCheckboxes() {
    const checkboxes = document.querySelectorAll('.task-items input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        // Set initial state
        const taskItem = checkbox.closest('.d-flex');
        if (checkbox.checked) {
            taskItem.querySelectorAll('.form-check-label, .badge').forEach(el => {
                el.style.opacity = '0.5';
                if (el.classList.contains('form-check-label')) {
                    el.style.textDecoration = 'line-through';
                }
            });
        }
        
        // Add change event listener
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.d-flex');
            const label = taskItem.querySelector('.form-check-label');
            const badge = taskItem.querySelector('.badge');
            
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.5';
                if (badge) badge.style.opacity = '0.5';
                
                // Animate completion
                taskItem.style.transition = 'background-color 0.5s ease';
                taskItem.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                setTimeout(() => {
                    taskItem.style.backgroundColor = '';
                }, 1000);
                
                // In a real app, would save to server
                console.log('Task completed:', label.textContent.trim());
                
                // Update XP (in a real app this would be handled by the server)
                updateExperiencePoints(25);
            } else {
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
                if (badge) badge.style.opacity = '1';
                
                // In a real app, would save to server
                console.log('Task uncompleted:', label.textContent.trim());
                
                // Update XP (in a real app this would be handled by the server)
                updateExperiencePoints(-25);
            }
        });
    });
}

/**
 * Setup carousel autoplay with pause on hover
 */
function setupCarousel() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        // Initialize Bootstrap carousel with interval
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000
        });
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            carouselInstance.pause();
        });
        
        carousel.addEventListener('mouseleave', () => {
            carouselInstance.cycle();
        });
    });
}

/**
 * Initialize tabbed content
 */
function initializeTabbedContent() {
    const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
    
    tabLinks.forEach(link => {
        link.addEventListener('shown.bs.tab', event => {
            const targetTab = event.target.getAttribute('data-bs-target').replace('#', '');
            
            // Save active tab to localStorage
            localStorage.setItem('mardukActiveTab', targetTab);
            
            // In a real app, could track tab usage for analytics
            console.log('Tab activated:', targetTab);
        });
    });
    
    // Restore previously active tab if available
    const activeTab = localStorage.getItem('mardukActiveTab');
    if (activeTab) {
        const tabToActivate = document.querySelector(`[data-bs-target="#${activeTab}"]`);
        if (tabToActivate) {
            const tab = new bootstrap.Tab(tabToActivate);
            tab.show();
        }
    }
}

/**
 * Update dashboard based on user role
 * @param {string} role - The user role
 */
function updateDashboardByRole(role) {
    console.log('Updating dashboard for role:', role);
    
    // Define role-specific metrics
    const roleMetrics = {
        funcionario: [
            { label: "Procesos activos", value: 28, icon: "fa-briefcase", trend: "+5% vs mes anterior" },
            { label: "Audiencias pendientes", value: 5, icon: "fa-calendar", trend: "-2 vs semana anterior" },
            { label: "Notificaciones hoy", value: 12, icon: "fa-bell", trend: "+8 nuevas" }
        ],
        ciudadano: [
            { label: "Consultas recientes", value: 8, icon: "fa-search", trend: "+3 vs semana anterior" },
            { label: "Procesos activos", value: 12, icon: "fa-briefcase", trend: "+1 nuevo" },
            { label: "Documentos pendientes", value: 3, icon: "fa-file-alt", trend: "-2 vs mes anterior" }
        ],
        administrador: [
            { label: "Sistemas críticos", value: 4, icon: "fa-server", trend: "Todos operativos" },
            { label: "Incidentes activos", value: 3, icon: "fa-exclamation-circle", trend: "-2 vs ayer" },
            { label: "Usuarios activos", value: 1248, icon: "fa-users", trend: "+12% vs mes anterior" }
        ],
        desarrollador: [
            { label: "Proyectos activos", value: 7, icon: "fa-code", trend: "+2 nuevos" },
            { label: "Commits esta semana", value: 28, icon: "fa-code-branch", trend: "+8 vs semana anterior" },
            { label: "Temas resueltos", value: 15, icon: "fa-check-circle", trend: "+42% vs promedio" }
        ]
    };
    
    // Update metric cards if they exist
    const metricContainers = document.querySelectorAll('.dashboard-banner .row.g-4 .col-md-4');
    if (metricContainers.length > 0) {
        const metrics = roleMetrics[role] || roleMetrics.funcionario;
        
        metricContainers.forEach((container, index) => {
            if (index < metrics.length) {
                const metric = metrics[index];
                
                // Update icon
                const iconElement = container.querySelector('i.fa-solid');
                if (iconElement) {
                    iconElement.className = `fa-solid ${metric.icon} text-white`;
                }
                
                // Update label
                const labelElement = container.querySelector('p.small.opacity-80');
                if (labelElement) {
                    labelElement.textContent = metric.label;
                }
                
                // Update value
                const valueElement = container.querySelector('p.h3.fw-bold');
                if (valueElement) {
                    valueElement.textContent = metric.value;
                }
                
                // Update trend
                const trendElement = container.querySelector('span.small.opacity-90');
                if (trendElement) {
                    trendElement.textContent = metric.trend;
                }
            }
        });
    }
    
    // Update recommended solutions based on role
    updateRecommendedSolutions(role);
    
    // Update gamification progress based on role
    updateGamificationProgress(role);
}

/**
 * Update recommended solutions based on user role
 * @param {string} role - The user role
 */
function updateRecommendedSolutions(role) {
    // In a real application, this would fetch role-specific recommendations from the server
    console.log('Updating recommended solutions for:', role);
    
    // The actual implementation would involve AJAX calls or direct DOM updates
    // This is a simplified version without actual DOM updates for demonstration
}

/**
 * Update gamification progress based on user role
 * @param {string} role - The user role
 */
function updateGamificationProgress(role) {
    // Define role-specific gamification data
    const gamificationData = {
        funcionario: {
            level: 3,
            title: "Innovador Digital",
            xp: 450,
            xpToNextLevel: 750,
            progressPercent: 60,
            badges: [
                { id: 1, name: "Contribuidor Activo", icon: "fa-award", description: "Más de 5 contribuciones a la comunidad" },
                { id: 2, name: "Analista de Datos", icon: "fa-chart-bar", description: "Uso efectivo de herramientas de análisis judicial" },
                { id: 3, name: "Explorador Innovador", icon: "fa-compass", description: "Probó 10+ soluciones diferentes" }
            ],
            objectives: [
                { id: 1, name: "Participa en 3 discusiones", icon: "fa-comments", progress: 1, total: 3, xpReward: 75 },
                { id: 2, name: "Valora 5 aplicaciones", icon: "fa-star", progress: 3, total: 5, xpReward: 50 },
                { id: 3, name: "Comparte 2 recursos", icon: "fa-share-alt", progress: 0, total: 2, xpReward: 100 }
            ]
        },
        ciudadano: {
            level: 2,
            title: "Ciudadano Digital",
            xp: 220,
            xpToNextLevel: 500,
            progressPercent: 44,
            badges: [
                { id: 1, name: "Participante Activo", icon: "fa-users", description: "Participación regular en la plataforma" },
                { id: 2, name: "Consultor Eficiente", icon: "fa-search", description: "Alta eficiencia en consultas judiciales" }
            ],
            objectives: [
                { id: 1, name: "Completa tu perfil", icon: "fa-user", progress: 3, total: 5, xpReward: 50 },
                { id: 2, name: "Realiza 5 consultas", icon: "fa-search", progress: 4, total: 5, xpReward: 75 }
            ]
        },
        administrador: {
            level: 5,
            title: "Maestro de Sistemas",
            xp: 1280,
            xpToNextLevel: 1500,
            progressPercent: 85,
            badges: [
                { id: 1, name: "Gurú de Seguridad", icon: "fa-shield-alt", description: "Implementación de prácticas avanzadas de seguridad" },
                { id: 2, name: "Arquitecto de Sistemas", icon: "fa-layer-group", description: "Diseño de arquitecturas robustas y escalables" },
                { id: 3, name: "Mentor Destacado", icon: "fa-award", description: "Mentoría a más de 10 usuarios" },
                { id: 4, name: "First Responder", icon: "fa-exclamation-circle", description: "Respuesta rápida a incidentes críticos" }
            ],
            objectives: [
                { id: 1, name: "Resolver 10 incidentes", icon: "fa-check-circle", progress: 7, total: 10, xpReward: 150 },
                { id: 2, name: "Optimizar 3 sistemas", icon: "fa-bolt", progress: 2, total: 3, xpReward: 200 }
            ]
        },
        desarrollador: {
            level: 6,
            title: "Arquitecto Digital",
            xp: 2450,
            xpToNextLevel: 3000,
            progressPercent: 82,
            badges: [
                { id: 1, name: "Contribuidor Élite", icon: "fa-award", description: "Más de 20 contribuciones de código" },
                { id: 2, name: "Experto API", icon: "fa-code", description: "Desarrollo de APIs avanzadas" },
                { id: 3, name: "Integrador Maestro", icon: "fa-code-branch", description: "Integración efectiva de múltiples sistemas" },
                { id: 4, name: "Innovador Técnico", icon: "fa-lightbulb", description: "Implementación de soluciones innovadoras" }
            ],
            objectives: [
                { id: 1, name: "Contribuir a 5 proyectos", icon: "fa-code-branch", progress: 4, total: 5, xpReward: 200 },
                { id: 2, name: "Resolver 10 issues", icon: "fa-check-circle", progress: 7, total: 10, xpReward: 150 },
                { id: 3, name: "Documentar 3 APIs", icon: "fa-file-alt", progress: 2, total: 3, xpReward: 180 }
            ]
        }
    };
    
    const data = gamificationData[role] || gamificationData.funcionario;
    
    // Update level and title
    const levelSpan = document.querySelector('.dashboard-banner .bg-white.bg-opacity-20 .small.opacity-80');
    const titleSpan = document.querySelector('.dashboard-banner .bg-white.bg-opacity-20 .fw-semibold');
    
    if (levelSpan) levelSpan.textContent = `Nivel ${data.level}`;
    if (titleSpan) titleSpan.textContent = data.title;
    
    // Update progress information
    const currentXPSpan = document.querySelector('.justify-content-between .small:first-child');
    const targetXPSpan = document.querySelector('.justify-content-between .small:last-child');
    const progressBar = document.querySelector('.progress-bar.bg-info');
    const xpNeededText = document.querySelector('.small.mt-1.opacity-80');
    
    if (currentXPSpan) currentXPSpan.textContent = `${data.xp} XP`;
    if (targetXPSpan) targetXPSpan.textContent = `${data.xpToNextLevel} XP`;
    if (progressBar) progressBar.style.width = `${data.progressPercent}%`;
    if (xpNeededText) xpNeededText.textContent = `${data.xpToNextLevel - data.xp} XP para el siguiente nivel`;
    
    // Update badges
    const badgeContainer = document.querySelector('.mt-4.d-flex.flex-wrap.gap-2');
    if (badgeContainer) {
        // Keep the "unlock more" badge item
        const unlockBadge = badgeContainer.querySelector('.badge-item-unlock');
        
        // Remove existing badges
        while (badgeContainer.firstChild) {
            badgeContainer.removeChild(badgeContainer.firstChild);
        }
        
        // Add new badges
        data.badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge-item';
            badgeElement.title = badge.description;
            badgeElement.innerHTML = `
                <i class="fa-solid ${badge.icon}"></i>
                <span class="small mt-1">${badge.name.split(' ')[0]}</span>
            `;
            badgeContainer.appendChild(badgeElement);
        });
        
        // Re-add the unlock badge
        if (unlockBadge) {
            badgeContainer.appendChild(unlockBadge);
        } else {
            const newUnlockBadge = document.createElement('div');
            newUnlockBadge.className = 'badge-item-unlock';
            newUnlockBadge.title = 'Desbloquea más insignias';
            newUnlockBadge.innerHTML = `
                <i class="fa-solid fa-plus-circle"></i>
                <span class="small mt-1">Más</span>
            `;
            badgeContainer.appendChild(newUnlockBadge);
        }
    }
    
    // Update objectives
    const objectivesContainer = document.querySelector('.card-body .space-y-3, .card-body .mb-3');
    if (objectivesContainer) {
        // Clear existing objectives
        objectivesContainer.innerHTML = '';
        
        // Add new objectives
        data.objectives.forEach((objective, index) => {
            const objectiveElement = document.createElement('div');
            objectiveElement.className = index < data.objectives.length - 1 ? 'd-flex mb-3' : 'd-flex';
            objectiveElement.innerHTML = `
                <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3 text-primary" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                    <i class="fa-solid ${objective.icon}"></i>
                </div>
                <div class="flex-grow-1">
                    <h4 class="small fw-medium">${objective.name}</h4>
                    <div class="progress mt-1" style="height: 6px;">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${(objective.progress / objective.total) * 100}%;" 
                            aria-valuenow="${(objective.progress / objective.total) * 100}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div class="d-flex justify-content-between small text-muted mt-1">
                        <span>${objective.progress}/${objective.total} completado</span>
                        <span>+${objective.xpReward} XP</span>
                    </div>
                </div>
            `;
            objectivesContainer.appendChild(objectiveElement);
        });
    }
}

/**
 * Update experience points
 * @param {number} xpChange - The amount of XP to add (positive) or subtract (negative)
 */
function updateExperiencePoints(xpChange) {
    // Get current role
    const currentRole = localStorage.getItem('mardukUserRole') || 'funcionario';
    
    // Get current XP and level info
    const currentXPSpan = document.querySelector('.justify-content-between .small:first-child');
    const targetXPSpan = document.querySelector('.justify-content-between .small:last-child');
    const progressBar = document.querySelector('.progress-bar.bg-info');
    const xpNeededText = document.querySelector('.small.mt-1.opacity-80');
    
    if (!currentXPSpan || !targetXPSpan || !progressBar || !xpNeededText) return;
    
    // Parse current values
    let currentXP = parseInt(currentXPSpan.textContent);
    const targetXP = parseInt(targetXPSpan.textContent);
    
    // Update XP
    currentXP += xpChange;
    if (currentXP < 0) currentXP = 0;
    
    // Calculate new percentage
    const progressPercent = Math.min(Math.round((currentXP / targetXP) * 100), 100);
    
    // Update UI
    currentXPSpan.textContent = `${currentXP} XP`;
    progressBar.style.width = `${progressPercent}%`;
    xpNeededText.textContent = `${targetXP - currentXP} XP para el siguiente nivel`;
    
    // Check for level up
    if (currentXP >= targetXP) {
        // In a real app, this would trigger a level up animation and server update
        showLevelUpNotification();
    }
    
    // Show XP gain/loss notification
    if (xpChange !== 0) {
        showXPNotification(xpChange);
    }
}

/**
 * Show level up notification
 */
function showLevelUpNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'position-fixed top-50 start-50 translate-middle p-4 bg-gradient-primary text-white rounded-lg shadow-lg text-center';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <h4 class="mb-2">¡Nivel Completado!</h4>
        <p class="mb-3">Has subido al siguiente nivel. ¡Felicitaciones!</p>
        <div class="animate-pulse">
            <i class="fa-solid fa-arrow-up fa-2x"></i>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s ease-out';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

/**
 * Show XP gain/loss notification
 * @param {number} xpChange - The amount of XP gained or lost
 */
function showXPNotification(xpChange) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `position-fixed bottom-0 end-0 m-4 p-3 rounded-lg shadow-lg text-white ${xpChange > 0 ? 'bg-success' : 'bg-danger'}`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fa-solid ${xpChange > 0 ? 'fa-plus' : 'fa-minus'} me-2"></i>
            <span class="fw-bold">${Math.abs(xpChange)} XP</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

/**
 * Setup ecosystem impact charts
 */
function setupEcosystemImpactCharts() {
    // In a real application, this would create charts using Chart.js or similar
    console.log('Setting up ecosystem impact charts');
    
    // The actual implementation would involve creating charts
    // This is a simplified version without actual chart creation for demonstration
}