/**
 * MARDUK ECOSYSTEM - PROFILE FUNCTIONALITY
 * JavaScript for user profile functionality
 */

// Initialize profile elements when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();

    // Listen for role changes to update profile
    document.addEventListener('userRoleChanged', function(event) {
        updateProfileByRole(event.detail.role);
    });

    // Create profile cards
    createProfileCards();

    // Add event listeners to profile cards
    document.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            updateProfileByRole(role);

            // Scroll to top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Show success toast
            showToast(`Perfil de ${role} cargado correctamente`, 'success');
        });
    });
});

/**
 * Initialize profile elements
 */
function initializeProfile() {
    // Get current role from localStorage
    const currentRole = localStorage.getItem('mardukUserRole') || 'funcionario';

    // Update profile based on role
    updateProfileByRole(currentRole);

    // Initialize achievement tooltips
    initializeTooltips();
}

/**
 * Initialize tooltips for badges and other elements
 */
function initializeTooltips() {
    // Using Bootstrap's tooltip initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Update profile based on user role
 * @param {string} role - The user role
 */
function updateProfileByRole(role) {
    console.log('Updating profile for role:', role);

    // Define role-specific data
    const profileData = {
        funcionario: {
            name: "Ana María González",
            role: "Juez Civil Municipal",
            avatar: "AG",
            location: "Bogotá",
            specialty: "Derecho Civil",
            bio: "Especializada en procesos civiles con énfasis en derechos reales y contratos. Más de 10 años de experiencia en el sistema judicial colombiano.",
            metrics: [
                { label: "Procesos activos", value: 28, icon: "fa-briefcase" },
                { label: "Audiencias pendientes", value: 5, icon: "fa-calendar" },
                { label: "Notificaciones hoy", value: 12, icon: "fa-bell" }
            ],
            stats: {
                favorites: 7,
                contributions: 3,
                notifications: 4
            },
            resources: [
                { title: "Guía de Expediente Electrónico", type: "PDF", size: "3.4 MB", icon: "fa-file-alt", iconClass: "text-primary", bgClass: "bg-blue-soft" },
                { title: "Tutorial de JudiCalc", type: "Video", size: "12:35 min", icon: "fa-video", iconClass: "text-success", bgClass: "bg-green-soft" },
                { title: "Calculadora de Términos", type: "Herramienta", size: "", icon: "fa-calculator", iconClass: "text-amber", bgClass: "bg-amber-soft" }
            ],
            gamification: {
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
                ],
                impact: {
                    timesSaved: "42h",
                    docsDigitized: 184,
                    processesOptimized: 16,
                    efficiency: "+35%"
                }
            },
            bannerClass: "bg-gradient-blue"
        },
        ciudadano: {
            name: "Carlos Rodríguez",
            role: "Abogado Litigante",
            avatar: "CR",
            location: "Medellín",
            specialty: "Derecho Laboral",
            bio: "Abogado especializado en derecho laboral y seguridad social con más de 8 años de experiencia representando a empleados y empleadores.",
            metrics: [
                { label: "Consultas recientes", value: 8, icon: "fa-search" },
                { label: "Procesos activos", value: 12, icon: "fa-briefcase" },
                { label: "Documentos pendientes", value: 3, icon: "fa-file-alt" }
            ],
            stats: {
                favorites: 5,
                contributions: 1,
                notifications: 2
            },
            resources: [
                { title: "Guía de Consulta Procesal", type: "PDF", size: "2.1 MB", icon: "fa-file-alt", iconClass: "text-primary", bgClass: "bg-blue-soft" },
                { title: "Manual de Radicación", type: "PDF", size: "1.8 MB", icon: "fa-file-alt", iconClass: "text-primary", bgClass: "bg-blue-soft" },
                { title: "Tutoriales de Acceso", type: "Video", size: "8:45 min", icon: "fa-video", iconClass: "text-success", bgClass: "bg-green-soft" }
            ],
            gamification: {
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
                ],
                impact: {
                    timesSaved: "18h",
                    docsDigitized: 37,
                    processesOptimized: 8,
                    efficiency: "+22%"
                }
            },
            bannerClass: "bg-gradient-green"
        },
        administrador: {
            name: "Mónica Valencia",
            role: "Administrador de Sistemas",
            avatar: "MV",
            location: "Cali",
            specialty: "Infraestructura Digital",
            bio: "Especialista en administración de sistemas y seguridad informática para la Rama Judicial con experiencia en implementación de soluciones escalables.",
            metrics: [
                { label: "Sistemas críticos", value: 4, icon: "fa-server" },
                { label: "Incidentes activos", value: 3, icon: "fa-exclamation-circle" },
                { label: "Usuarios activos", value: 1248, icon: "fa-users" }
            ],
            stats: {
                favorites: 9,
                contributions: 15,
                notifications: 8
            },
            resources: [
                { title: "Panel de Monitoreo", type: "Herramienta", size: "", icon: "fa-tachometer-alt", iconClass: "text-primary", bgClass: "bg-blue-soft" },
                { title: "Guía de Seguridad", type: "PDF", size: "4.7 MB", icon: "fa-shield-alt", iconClass: "text-purple", bgClass: "bg-purple-soft" },
                { title: "Métricas del Sistema", type: "Dashboard", size: "", icon: "fa-chart-bar", iconClass: "text-success", bgClass: "bg-green-soft" }
            ],
            gamification: {
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
                ],
                impact: {
                    timesSaved: "78",
                    docsDigitized: 34,
                    processesOptimized: 99.8,
                    efficiency: "+65%"
                }
            },
            bannerClass: "bg-gradient-purple"
        },
        desarrollador: {
            name: "Javier Moreno",
            role: "Desarrollador Senior",
            avatar: "JM",
            location: "Bogotá",
            specialty: "Desarrollo Backend",
            bio: "Ingeniero de software especializado en arquitecturas cloud y sistemas distribuidos con enfoque en soluciones judiciales de alta disponibilidad.",
            metrics: [
                { label: "Proyectos activos", value: 7, icon: "fa-code" },
                { label: "Commits esta semana", value: 28, icon: "fa-code-branch" },
                { label: "Temas resueltos", value: 15, icon: "fa-check-circle" }
            ],
            stats: {
                favorites: 12,
                contributions: 24,
                notifications: 5
            },
            resources: [
                { title: "Documentación API", type: "Docs", size: "", icon: "fa-code", iconClass: "text-primary", bgClass: "bg-blue-soft" },
                { title: "GitHub del Ecosistema", type: "Repositorio", size: "", icon: "fa-code-branch", iconClass: "text-orange", bgClass: "bg-orange-soft" },
                { title: "Foro de Desarrolladores", type: "Comunidad", size: "", icon: "fa-users", iconClass: "text-purple", bgClass: "bg-purple-soft" }
            ],
            gamification: {
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
                ],
                impact: {
                    timesSaved: "12,450+",
                    docsDigitized: 78,
                    processesOptimized: 42,
                    efficiency: "+58%"
                }
            },
            bannerClass: "bg-gradient-orange"
        }
    };

    // Get profile data for current role
    const data = profileData[role] || profileData.funcionario;

    // Update profile banner
    updateProfileBanner(data);

    // Update profile metrics
    updateProfileMetrics(data.metrics);

    // Update user stats
    updateUserStats(data.stats);

    // Update user bio
    updateUserBio(data.bio);

    // Update resources
    updateResources(data.resources);

    // Update gamification
    updateGamification(data.gamification);

    // Update titles for specific roles
    updateRoleSpecificContent(role);
}

/**
 * Update profile banner with user data
 * @param {Object} data - The profile data
 */
function updateProfileBanner(data) {
    // Update banner background class
    const profileBanner = document.getElementById('profileBanner');
    if (profileBanner) {
        profileBanner.className = `card border-0 ${data.bannerClass} mb-4 rounded-3`;
    }

    // Update profile title
    const profileTitle = document.getElementById('profileTitle');
    if (profileTitle) {
        const titles = {
            funcionario: "Panel de Funcionario Judicial",
            ciudadano: "Portal Ciudadano de Justicia",
            administrador: "Centro de Administración Judicial",
            desarrollador: "Hub de Desarrollo Judicial"
        };
        profileTitle.textContent = titles[data.role.toLowerCase()] || "Mi Perfil";
    }

    // Update profile name, role, location, specialty
    document.getElementById('profileName').textContent = data.name;
    document.getElementById('profileRole').textContent = data.role;
    document.getElementById('profileLocation').textContent = data.location;
    document.getElementById('profileSpecialty').textContent = data.specialty;

    // Update profile avatar with random image
    const profileAvatarImg = document.getElementById('profileAvatar');
    if (profileAvatarImg) {
        // Generate random number for avatar
        const gender = data.gender || (Math.random() > 0.5 ? 'men' : 'women');
        const randomNum = Math.floor(Math.random() * 99) + 1;
        profileAvatarImg.src = `https://randomuser.me/api/portraits/${gender}/${randomNum}.jpg`;
        profileAvatarImg.alt = data.name;
    }
}

/**
 * Update profile metrics
 * @param {Array} metrics - The metrics data
 */
function updateProfileMetrics(metrics) {
    metrics.forEach((metric, index) => {
        const metricElement = document.getElementById(`metric${index + 1}`);
        if (metricElement) {
            metricElement.textContent = metric.value;
        }

        // Update label and icon if needed
        const labelElement = metricElement.previousElementSibling;
        const iconElement = labelElement.parentElement.previousElementSibling.querySelector('i');

        if (labelElement) {
            labelElement.textContent = metric.label;
        }

        if (iconElement) {
            iconElement.className = `fa-solid ${metric.icon}`;
        }
    });
}

/**
 * Update user stats
 * @param {Object} stats - The user stats
 */
function updateUserStats(stats) {
    document.getElementById('profileFavorites').textContent = stats.favorites;
    document.getElementById('profileContributions').textContent = stats.contributions;
    document.getElementById('profileNotifications').textContent = stats.notifications;
}

/**
 * Update user bio
 * @param {string} bio - The user bio
 */
function updateUserBio(bio) {
    document.getElementById('userBio').textContent = bio;
}

/**
 * Update resources list
 * @param {Array} resources - The resources data
 */
function updateResources(resources) {
    const resourcesList = document.getElementById('resourcesList');
    if (!resourcesList) return;

    // Clear existing resources
    resourcesList.innerHTML = '';

    // Add new resources
    resources.forEach(resource => {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'list-group-item px-0 py-3 d-flex align-items-center border-0';

        const sizeInfo = resource.size ? `${resource.type} • ${resource.size}` : resource.type;

        resourceItem.innerHTML = `
            <div class="p-3 rounded ${resource.bgClass} ${resource.iconClass} me-3">
                <i class="fa-solid ${resource.icon}"></i>
            </div>
            <div class="flex-grow-1">
                <h3 class="h6 fw-medium mb-0">${resource.title}</h3>
                <p class="small text-muted mb-0">${sizeInfo}</p>
            </div>
            <a href="#" class="btn btn-outline-primary btn-sm">Acceder</a>
        `;

        resourcesList.appendChild(resourceItem);
    });
}

/**
 * Update gamification elements
 * @param {Object} gamification - The gamification data
 */
function updateGamification(gamification) {
    // Update level and title
    document.getElementById('userLevel').textContent = `Nivel ${gamification.level}: ${gamification.title}`;

    // Update XP progress
    const xpProgressElement = document.getElementById('xpProgress');
    if (xpProgressElement) {
        xpProgressElement.querySelector('span:first-child').textContent = `${gamification.xp} XP`;
        xpProgressElement.querySelector('span:last-child').textContent = `${gamification.xpToNextLevel} XP`;
    }

    // Update progress bar
    const progressBar = document.getElementById('xpProgressBar');
    if (progressBar) {
        progressBar.style.width = `${gamification.progressPercent}%`;
        progressBar.setAttribute('aria-valuenow', gamification.progressPercent);
    }

    // Update XP needed text
    document.getElementById('xpToNextLevel').textContent = `${gamification.xpToNextLevel - gamification.xp} XP para el siguiente nivel`;

    // Update badges
    updateBadges(gamification.badges);

    // Update objectives
    updateObjectives(gamification.objectives);

    // Update impact data
    updateImpactData(gamification.impact);
}

/**
 * Update badges
 * @param {Array} badges - The badges data
 */
function updateBadges(badges) {
    const badgesContainer = document.getElementById('badgesContainer');
    if (!badgesContainer) return;

    // Remove existing badges (except the "More" badge)
    const moreBadge = badgesContainer.querySelector('.badge-item-unlock');
    badgesContainer.innerHTML = '';

    // Add badges
    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge-item';
        badgeElement.title = badge.description;
        badgeElement.innerHTML = `
            <i class="fa-solid ${badge.icon}"></i>
            <span class="small mt-1">${badge.name.split(' ')[0]}</span>
        `;
        badgesContainer.appendChild(badgeElement);
    });

    // Add "More" badge
    if (moreBadge) {
        badgesContainer.appendChild(moreBadge);
    } else {
        const newMoreBadge = document.createElement('div');
        newMoreBadge.className = 'badge-item-unlock';
        newMoreBadge.title = 'Desbloquea más insignias';
        newMoreBadge.innerHTML = `
            <i class="fa-solid fa-plus-circle"></i>
            <span class="small mt-1">Más</span>
        `;
        badgesContainer.appendChild(newMoreBadge);
    }

    // Re-initialize tooltips
    initializeTooltips();
}

/**
 * Update objectives
 * @param {Array} objectives - The objectives data
 */
function updateObjectives(objectives) {
    const objectivesContainer = document.getElementById('objectivesContainer');
    if (!objectivesContainer) return;

    // Clear existing objectives
    objectivesContainer.innerHTML = '';

    // Add new objectives
    objectives.forEach((objective, index) => {
        const objectiveElement = document.createElement('div');
        objectiveElement.className = index < objectives.length - 1 ? 'd-flex mb-3' : 'd-flex';

        const progressPercent = (objective.progress / objective.total) * 100;

        objectiveElement.innerHTML = `
            <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3 text-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                <i class="fa-solid ${objective.icon}"></i>
            </div>
            <div class="flex-grow-1">
                <h4 class="small fw-medium">${objective.name}</h4>
                <div class="progress mt-1" style="height: 6px;">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: ${progressPercent}%;"
                        aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
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

/**
 * Update impact data
 * @param {Object} impact - The impact data
 */
function updateImpactData(impact) {
    const impactElements = document.querySelectorAll('.border-top.pt-4 .row .h4');
    if (impactElements.length >= 4) {
        impactElements[0].textContent = impact.timesSaved;
        impactElements[1].textContent = impact.docsDigitized;
        impactElements[2].textContent = impact.processesOptimized;
        impactElements[3].textContent = impact.efficiency;
    }
}

/**
 * Update role specific content
 * @param {string} role - The user role
 */
function updateRoleSpecificContent(role) {
    // Here you can implement role-specific UI changes that aren't covered by the other functions
    // For example, showing/hiding certain sections based on role

    // This function is a placeholder for future extensions
    console.log('Applying role-specific UI changes for:', role);

    // Highlight the selected profile card
    document.querySelectorAll('.profile-card').forEach(card => {
        if (card.getAttribute('data-role') === role) {
            card.classList.add('border-primary');
            card.classList.add('shadow');
        } else {
            card.classList.remove('border-primary');
            card.classList.remove('shadow');
        }
    });
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    // Check if SweetAlert2 is available
    if (typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: type,
            title: message
        });
    } else {
        // Fallback to alert if SweetAlert2 is not available
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

/**
 * Create profile cards for different user roles
 */
function createProfileCards() {
    // Define profile data for cards
    const profileData = {
        funcionario: {
            name: "Ana María González",
            role: "Juez Civil Municipal",
            gender: "women",
            description: "Especializada en procesos civiles con énfasis en derechos reales y contratos."
        },
        ciudadano: {
            name: "Carlos Rodríguez",
            role: "Abogado Litigante",
            gender: "men",
            description: "Abogado especializado en derecho laboral y seguridad social con experiencia en litigio."
        },
        administrador: {
            name: "Mónica Valencia",
            role: "Administrador de Sistemas",
            gender: "women",
            description: "Especialista en administración de sistemas y seguridad informática para la Rama Judicial."
        },
        desarrollador: {
            name: "Javier Moreno",
            role: "Desarrollador Senior",
            gender: "men",
            description: "Ingeniero de software especializado en arquitecturas cloud y sistemas distribuidos."
        },
        investigador: {
            name: "Laura Mendoza",
            role: "Investigadora Jurídica",
            gender: "women",
            description: "Investigadora especializada en análisis de jurisprudencia y tendencias legales."
        },
        estudiante: {
            name: "Daniel Ospina",
            role: "Estudiante de Derecho",
            gender: "men",
            description: "Estudiante de último año de derecho con interés en tecnología jurídica e innovación."
        }
    };

    // Get or create the container for profile cards
    let profileCardsContainer = document.getElementById('profileCardsContainer');

    if (!profileCardsContainer) {
        // Create the section if it doesn't exist
        const mainContent = document.querySelector('main');

        if (mainContent) {
            // Create section title
            const sectionTitle = document.createElement('h2');
            sectionTitle.className = 'h4 fw-bold mb-4 mt-5';
            sectionTitle.textContent = 'Cambiar a otro perfil';
            mainContent.appendChild(sectionTitle);

            // Create container
            profileCardsContainer = document.createElement('div');
            profileCardsContainer.id = 'profileCardsContainer';
            profileCardsContainer.className = 'row g-4 mb-5';
            mainContent.appendChild(profileCardsContainer);
        } else {
            console.error('Main content container not found');
            return;
        }
    }

    // Clear existing cards
    profileCardsContainer.innerHTML = '';

    // Create cards for each profile
    Object.keys(profileData).forEach(role => {
        const profile = profileData[role];
        const randomNum = Math.floor(Math.random() * 99) + 1;

        const cardCol = document.createElement('div');
        cardCol.className = 'col-md-4 col-lg-4 mb-4';

        const card = document.createElement('div');
        card.className = 'card h-100 profile-card cursor-pointer transition-all';
        card.setAttribute('data-role', role);

        // Highlight current role
        const currentRole = localStorage.getItem('mardukUserRole') || 'funcionario';
        if (role === currentRole) {
            card.classList.add('border-primary');
            card.classList.add('shadow');
        }

        card.innerHTML = `
            <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                    <div class="me-3">
                        <img src="https://randomuser.me/api/portraits/${profile.gender}/${randomNum}.jpg"
                             alt="${profile.name}"
                             class="rounded-circle"
                             width="60" height="60">
                    </div>
                    <div>
                        <h3 class="h5 fw-semibold mb-0">${profile.name}</h3>
                        <p class="text-muted small mb-0">${profile.role}</p>
                    </div>
                </div>
                <p class="text-secondary small mb-3">${profile.description}</p>
                <button class="btn btn-sm btn-outline-primary w-100">Ver perfil</button>
            </div>
        `;

        cardCol.appendChild(card);
        profileCardsContainer.appendChild(cardCol);
    });
}