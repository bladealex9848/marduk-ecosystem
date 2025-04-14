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

    // Save selected role to localStorage
    localStorage.setItem('mardukUserRole', role);

    // Destroy existing charts to prevent memory leaks
    if (window.profileCharts) {
        window.profileCharts.forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }

    // Initialize charts array
    window.profileCharts = [];

    // Define role-specific data
    const profileData = {
        investigador: {
            name: "Laura Mendoza",
            role: "Investigadora Jurídica",
            gender: "women",
            location: "Barranquilla",
            specialty: "Análisis Jurisprudencial",
            bio: "Investigadora especializada en análisis de jurisprudencia y tendencias legales con enfoque en derecho constitucional y derechos humanos.",
            metrics: [
                { label: "Investigaciones", value: 14, icon: "fa-search" },
                { label: "Publicaciones", value: 8, icon: "fa-file-alt" },
                { label: "Citas académicas", value: 47, icon: "fa-quote-right" }
            ],
            stats: {
                favorites: 15,
                contributions: 12,
                notifications: 3
            },
            resources: [
                { title: "Base de Datos Jurisprudencial", type: "Herramienta", size: "", icon: "fa-database", iconClass: "text-primary", bgClass: "bg-blue-soft" },
                { title: "Metodología de Investigación", type: "PDF", size: "2.8 MB", icon: "fa-file-alt", iconClass: "text-purple", bgClass: "bg-purple-soft" },
                { title: "Tendencias Constitucionales", type: "Informe", size: "4.2 MB", icon: "fa-chart-line", iconClass: "text-success", bgClass: "bg-green-soft" }
            ],
            gamification: {
                level: 4,
                title: "Analista Experto",
                xp: 780,
                xpToNextLevel: 1000,
                progressPercent: 78,
                badges: [
                    { id: 1, name: "Investigador Destacado", icon: "fa-search", description: "Completar 10+ investigaciones jurídicas" },
                    { id: 2, name: "Publicador Activo", icon: "fa-file-alt", description: "Publicar 5+ artículos de investigación" },
                    { id: 3, name: "Analista de Datos", icon: "fa-chart-bar", description: "Uso avanzado de herramientas de análisis jurídico" }
                ],
                objectives: [
                    { id: 1, name: "Publicar 2 artículos", icon: "fa-file-alt", progress: 1, total: 2, xpReward: 150 },
                    { id: 2, name: "Analizar 20 sentencias", icon: "fa-gavel", progress: 15, total: 20, xpReward: 120 },
                    { id: 3, name: "Compartir 5 hallazgos", icon: "fa-share-alt", progress: 3, total: 5, xpReward: 100 }
                ],
                impact: {
                    timesSaved: "86h",
                    docsDigitized: 215,
                    processesOptimized: 24,
                    efficiency: "+42%"
                }
            },
            bannerClass: "bg-gradient-purple"
        },
        funcionario: {
            name: "Ana María González",
            role: "Juez Civil Municipal",
            avatar: "AG",
            gender: "women",
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
            gender: "men",
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
            gender: "women",
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
                    timesSaved: "78h",
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
            gender: "men",
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
        },
        estudiante: {
            name: "Daniel Ospina",
            role: "Estudiante de Derecho",
            gender: "men",
            location: "Medellín",
            specialty: "Derecho Tecnológico",
            bio: "Estudiante de último año de derecho con interés en tecnología jurídica, innovación legal y derecho digital. Participante activo en clínicas jurídicas.",
            metrics: [
                { label: "Cursos completados", value: 12, icon: "fa-graduation-cap" },
                { label: "Casos prácticos", value: 5, icon: "fa-user-tie" },
                { label: "Certificaciones", value: 3, icon: "fa-certificate" }
            ],
            stats: {
                favorites: 9,
                contributions: 2,
                notifications: 6
            },
            resources: [
                { title: "Biblioteca Digital", type: "Recurso", size: "", icon: "fa-book", iconClass: "text-primary", bgClass: "bg-blue-soft" },
                { title: "Curso LegalTech", type: "Video", size: "8 horas", icon: "fa-video", iconClass: "text-success", bgClass: "bg-green-soft" },
                { title: "Glosario Jurídico", type: "PDF", size: "1.5 MB", icon: "fa-file-alt", iconClass: "text-orange", bgClass: "bg-orange-soft" }
            ],
            gamification: {
                level: 2,
                title: "Aprendiz Digital",
                xp: 180,
                xpToNextLevel: 300,
                progressPercent: 60,
                badges: [
                    { id: 1, name: "Estudiante Aplicado", icon: "fa-book", description: "Completar 10+ cursos en la plataforma" },
                    { id: 2, name: "Investigador Novel", icon: "fa-search", description: "Realizar 5+ investigaciones jurídicas" }
                ],
                objectives: [
                    { id: 1, name: "Completar 3 cursos", icon: "fa-graduation-cap", progress: 2, total: 3, xpReward: 50 },
                    { id: 2, name: "Participar en 2 foros", icon: "fa-comments", progress: 1, total: 2, xpReward: 30 },
                    { id: 3, name: "Crear 1 documento", icon: "fa-file-alt", progress: 0, total: 1, xpReward: 40 }
                ],
                impact: {
                    timesSaved: "24h",
                    docsDigitized: 15,
                    processesOptimized: 3,
                    efficiency: "+18%"
                }
            },
            bannerClass: "bg-gradient-green"
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

    // Update bio based on role
    updateProfileBioByRole(role);

    // Update resources
    updateResources(data.resources);

    // Update impact data
    if (data.gamification && data.gamification.impact) {
        // Convert impact object to metrics array format
        const impactMetrics = {
            metrics: [
                { label: 'Tiempo ahorrado', value: data.gamification.impact.timesSaved, color: 'primary' },
                { label: 'Docs. digitalizados', value: data.gamification.impact.docsDigitized.toString(), color: 'success' },
                { label: 'Procesos optimizados', value: data.gamification.impact.processesOptimized.toString(), color: 'info' },
                { label: 'Eficiencia', value: data.gamification.impact.efficiency, color: 'warning' }
            ]
        };
        updateImpactData(impactMetrics);
    }

    // Update gamification
    updateGamification(data.gamification);

    // Update section colors based on role
    updateSectionColors(role);

    // Update recommended solutions based on role
    updateRecommendedSolutions(role);

    // Update user profile info based on role
    updateUserProfileInfo(role, data);

    // Create role-specific charts
    createProfileCharts(role, data);

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
 * Update profile bio and info based on role
 * @param {string} role - The user role
 */
function updateProfileBioByRole(role) {
    // Define role-specific bios
    const bios = {
        funcionario: "Especializada en procesos civiles con énfasis en derechos reales y contratos. Más de 10 años de experiencia en el sistema judicial colombiano.",
        ciudadano: "Abogado litigante con experiencia en derecho laboral y seguridad social. Especialista en representación de trabajadores en procesos de reclamación de prestaciones sociales.",
        administrador: "Especialista en administración de sistemas judiciales con certificaciones en seguridad informática y gestión de infraestructura tecnológica para entidades públicas.",
        desarrollador: "Ingeniero de software con experiencia en desarrollo de aplicaciones judiciales. Especialista en arquitectura de sistemas, APIs y bases de datos para el sector justicia.",
        investigador: "Investigadora especializada en análisis de jurisprudencia y tendencias legales con enfoque en derecho constitucional y derechos humanos.",
        estudiante: "Estudiante de noveno semestre de Derecho con interés en nuevas tecnologías aplicadas al ámbito jurídico. Participante activo en semilleros de investigación."
    };

    // Update bio
    const bioElement = document.getElementById('userBio');
    if (bioElement) {
        bioElement.textContent = bios[role] || bios.funcionario;
    }
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
    // Clear existing impact boxes
    const impactContainer = document.getElementById('impactBoxes');
    if (!impactContainer) return;

    impactContainer.innerHTML = '';

    if (!impact || !impact.metrics || impact.metrics.length === 0) {
        // Default metrics if none provided
        impact = {
            metrics: [
                { label: 'Tiempo ahorrado', value: '42h', color: 'primary' },
                { label: 'Docs. digitalizados', value: '184', color: 'success' },
                { label: 'Procesos optimizados', value: '16', color: 'info' },
                { label: 'Eficiencia', value: '+35%', color: 'warning' }
            ]
        };
    }

    // Create new impact boxes with consistent styling
    impact.metrics.forEach((metric) => {
        const impactBox = document.createElement('div');
        impactBox.className = 'col-md-3';
        impactBox.innerHTML = `
            <div class="border rounded p-3 text-center impact-box">
                <h4 class="h6 fw-medium mb-2">${metric.label}</h4>
                <p class="h4 fw-bold mb-0">${metric.value}</p>
            </div>
        `;

        impactContainer.appendChild(impactBox);
    });
}

/**
 * Clean up previous colored elements
 */
function cleanupColoredElements() {
    // 1. Remove colored borders from bio section
    const bioSection = document.querySelector('.col-lg-4 .card:first-child');
    if (bioSection) {
        bioSection.classList.remove(
            'border-primary', 'border-success', 'border-info', 'border-warning',
            'border-purple', 'border-orange', 'border-top'
        );
    }

    // 2. Remove colored icons from resources section
    const resourcesTitle = document.querySelector('.col-lg-4 .card:nth-child(2) h2');
    if (resourcesTitle && resourcesTitle.innerHTML.includes('fa-bookmark')) {
        resourcesTitle.textContent = resourcesTitle.textContent.trim();
    }

    // 3. Remove badges from objectives section
    const objectivesTitle = document.querySelector('.card-body .h6.fw-medium:first-child');
    if (objectivesTitle) {
        const badge = objectivesTitle.querySelector('.badge');
        if (badge) {
            objectivesTitle.removeChild(badge);
        }
    }
}

/**
 * Update section colors based on role
 * @param {string} role - The user role
 */
function updateSectionColors(role) {
    // Limpiar elementos coloreados previos
    cleanupColoredElements();
    // Define role-specific colors
    const roleColors = {
        funcionario: {
            gradientClass: 'bg-gradient-blue',
            primaryColor: 'primary',
            secondaryColor: 'info',
            accentColor: 'blue',
            bannerClass: 'bg-gradient-blue',
            headerClass: 'bg-gradient-primary'
        },
        ciudadano: {
            gradientClass: 'bg-gradient-green',
            primaryColor: 'success',
            secondaryColor: 'teal',
            accentColor: 'green',
            bannerClass: 'bg-gradient-green',
            headerClass: 'bg-gradient-success'
        },
        administrador: {
            gradientClass: 'bg-gradient-purple',
            primaryColor: 'purple',
            secondaryColor: 'indigo',
            accentColor: 'purple',
            bannerClass: 'bg-gradient-purple',
            headerClass: 'bg-gradient-purple'
        },
        desarrollador: {
            gradientClass: 'bg-gradient-orange',
            primaryColor: 'orange',
            secondaryColor: 'warning',
            accentColor: 'orange',
            bannerClass: 'bg-gradient-orange',
            headerClass: 'bg-gradient-orange'
        },
        investigador: {
            gradientClass: 'bg-gradient-purple',
            primaryColor: 'purple',
            secondaryColor: 'indigo',
            accentColor: 'purple',
            bannerClass: 'bg-gradient-purple',
            headerClass: 'bg-gradient-purple'
        },
        estudiante: {
            gradientClass: 'bg-gradient-green',
            primaryColor: 'success',
            secondaryColor: 'teal',
            accentColor: 'green',
            bannerClass: 'bg-gradient-green',
            headerClass: 'bg-gradient-success'
        }
    };

    const colors = roleColors[role] || roleColors.funcionario;

    // Update profile banner
    const profileBanner = document.querySelector('.profile-banner');
    if (profileBanner) {
        // Remove all possible gradient classes
        profileBanner.classList.remove('bg-gradient-blue', 'bg-gradient-green', 'bg-gradient-purple', 'bg-gradient-orange');
        // Add the role-specific gradient class
        profileBanner.classList.add(colors.bannerClass);
    }

    // Update progress section header
    const progressHeader = document.querySelector('.progress-header');
    if (progressHeader) {
        // Remove all possible gradient classes
        progressHeader.classList.remove('bg-gradient-primary', 'bg-gradient-success', 'bg-gradient-purple', 'bg-gradient-orange');
        // Add the role-specific gradient class
        progressHeader.classList.add(colors.headerClass);
    }

    // Update progress bar
    const progressBar = document.querySelector('.progress-bar.bg-info');
    if (progressBar) {
        progressBar.className = progressBar.className.replace('bg-info', `bg-${colors.secondaryColor}`);
    }

    // Update objective progress bars
    document.querySelectorAll('.progress-bar.bg-primary').forEach(bar => {
        bar.className = bar.className.replace('bg-primary', `bg-${colors.primaryColor}`);
    });

    // Update objective icons
    document.querySelectorAll('.bg-primary.bg-opacity-10.text-primary').forEach(icon => {
        icon.className = icon.className.replace('bg-primary', `bg-${colors.primaryColor}`)
                                      .replace('text-primary', `text-${colors.primaryColor}`);
    });

    // Update impact boxes
    const impactColors = ['primary', 'success', 'info', 'warning'];
    const newColors = [colors.primaryColor, colors.secondaryColor, colors.primaryColor, colors.secondaryColor];

    document.querySelectorAll('.border-top .row .border').forEach((box, index) => {
        const oldColor = impactColors[index % impactColors.length];
        const newColor = newColors[index % newColors.length];

        // Update border
        box.className = box.className.replace(`border-${oldColor}`, `border-${newColor}`);

        // Update text color of heading
        const heading = box.querySelector('.h6');
        if (heading) {
            heading.className = heading.className.replace(`text-${oldColor}`, `text-${newColor}`);
        }

        // Update text color of value
        const value = box.querySelector('.h4');
        if (value) {
            value.className = value.className.replace(`text-${oldColor}`, `text-${newColor}`);
        }
    });

    // Update resource buttons
    document.querySelectorAll('#resourcesList .btn-outline-primary').forEach(btn => {
        btn.className = btn.className.replace('btn-outline-primary', `btn-outline-${colors.primaryColor}`);
    });

    // Update edit profile button
    const editProfileBtn = document.querySelector('.card:last-child .btn-primary');
    if (editProfileBtn) {
        editProfileBtn.className = editProfileBtn.className.replace('btn-primary', `btn-${colors.primaryColor}`);
    }

    // Add colored accents to various sections
    // 1. Add colored border to user bio section
    const bioSection = document.querySelector('.col-lg-4 .card:first-child');
    if (bioSection) {
        bioSection.classList.add(`border-${colors.primaryColor}`, 'border-top');
    }

    // 2. Add colored icon to resources section
    const resourcesTitle = document.querySelector('.col-lg-4 .card:nth-child(2) h2');
    if (resourcesTitle) {
        resourcesTitle.innerHTML = `<i class="fa-solid fa-bookmark text-${colors.primaryColor} me-2"></i> ${resourcesTitle.textContent}`;
    }

    // 3. Add colored badge to objectives section
    const objectivesTitle = document.querySelector('.card-body .h6.fw-medium:first-child');
    if (objectivesTitle) {
        // Verificar si ya tiene el badge para evitar duplicados
        if (!objectivesTitle.querySelector('.badge')) {
            objectivesTitle.innerHTML = `${objectivesTitle.textContent} <span class="badge bg-${colors.primaryColor} bg-opacity-10 text-${colors.primaryColor} ms-2 small">Personalizado</span>`;
        }
    }
}

/**
 * Update recommended solutions based on role
 * @param {string} role - The user role
 */
function updateRecommendedSolutions(role) {
    // Define role-specific recommended solutions
    const recommendedSolutions = {
        funcionario: [
            {
                title: 'Sistema de Gestión de Expedientes',
                icon: 'file-lines',
                description: 'Sistema integral para la gestión digital de expedientes judiciales, facilitando el acceso, búsqueda y seguimiento de información.',
                level: 'Consolidada',
                rating: 4.8,
                id: 1,
                iconClass: 'bg-gradient-blue'
            },
            {
                title: 'JudiCalc',
                icon: 'calculator',
                description: 'Calculadora judicial para términos procesales, plazos, prescripciones y caducidades con integración al calendario oficial.',
                level: 'Producción',
                rating: 4.5,
                id: 2,
                iconClass: 'bg-gradient-green'
            }
        ],
        ciudadano: [
            {
                title: 'Portal de Consulta Procesal',
                icon: 'search',
                description: 'Plataforma para consulta de estado de procesos judiciales, notificaciones y presentación de documentos electrónicos.',
                level: 'Consolidada',
                rating: 4.7,
                id: 3,
                iconClass: 'bg-gradient-green'
            },
            {
                title: 'Asistente Virtual Judicial',
                icon: 'robot',
                description: 'Asistente virtual para orientación sobre trámites judiciales, requisitos y procedimientos básicos.',
                level: 'Beta',
                rating: 4.2,
                id: 4,
                iconClass: 'bg-gradient-purple'
            }
        ],
        administrador: [
            {
                title: 'Panel de Administración Judicial',
                icon: 'server',
                description: 'Herramienta de administración centralizada para gestión de usuarios, permisos y monitoreo de sistemas judiciales.',
                level: 'Producción',
                rating: 4.6,
                id: 5,
                iconClass: 'bg-gradient-purple'
            },
            {
                title: 'JudiSecure',
                icon: 'shield-alt',
                description: 'Sistema de seguridad y auditoría para protección de información judicial sensible y cumplimiento normativo.',
                level: 'Consolidada',
                rating: 4.9,
                id: 6,
                iconClass: 'bg-gradient-blue'
            }
        ],
        desarrollador: [
            {
                title: 'JudiAPI',
                icon: 'code',
                description: 'API completa para integración con sistemas judiciales, con documentación interactiva y entorno de pruebas.',
                level: 'Producción',
                rating: 4.7,
                id: 7,
                iconClass: 'bg-gradient-orange'
            },
            {
                title: 'DevJudicial',
                icon: 'laptop-code',
                description: 'Entorno de desarrollo para creación de aplicaciones judiciales con componentes predefinidos y plantillas.',
                level: 'Beta',
                rating: 4.3,
                id: 8,
                iconClass: 'bg-gradient-purple'
            }
        ],
        investigador: [
            {
                title: 'JurisAnalytics',
                icon: 'chart-bar',
                description: 'Plataforma de análisis jurisprudencial con herramientas de minería de texto y visualización de tendencias legales.',
                level: 'Producción',
                rating: 4.8,
                id: 9,
                iconClass: 'bg-gradient-purple'
            },
            {
                title: 'LegalResearch Pro',
                icon: 'search',
                description: 'Motor de búsqueda avanzada para investigación jurídica con filtros especializados y análisis semántico.',
                level: 'Consolidada',
                rating: 4.9,
                id: 10,
                iconClass: 'bg-gradient-blue'
            }
        ],
        estudiante: [
            {
                title: 'Campus Judicial Virtual',
                icon: 'graduation-cap',
                description: 'Plataforma educativa con cursos, simulaciones y casos prácticos para estudiantes de derecho.',
                level: 'Producción',
                rating: 4.6,
                id: 11,
                iconClass: 'bg-gradient-green'
            },
            {
                title: 'LegalQuiz',
                icon: 'question-circle',
                description: 'Aplicación de preparación para exámenes con miles de preguntas y explicaciones detalladas sobre temas jurídicos.',
                level: 'Beta',
                rating: 4.4,
                id: 12,
                iconClass: 'bg-gradient-orange'
            }
        ]
    };

    const solutions = recommendedSolutions[role] || recommendedSolutions.funcionario;
    const solutionsContainer = document.getElementById('recommendedSolutions');

    if (solutionsContainer) {
        solutionsContainer.innerHTML = '';

        solutions.forEach(solution => {
            const solutionCard = document.createElement('div');
            solutionCard.className = 'col-md-6';
            solutionCard.innerHTML = `
                <div class="card h-100 border hover-shadow-sm transition-all cursor-pointer" onclick="location.href='solutions.html?app=${solution.id}'">
                    <div class="card-body p-3">
                        <div class="d-flex align-items-center mb-3">
                            <div class="solution-icon ${solution.iconClass} me-3">
                                <i class="fa-solid fa-${solution.icon}"></i>
                            </div>
                            <div>
                                <h3 class="card-title h6 fw-semibold mb-0 text-truncate">${solution.title}</h3>
                                <div class="d-flex align-items-center small mt-1">
                                    <span class="badge bg-teal-soft text-teal">${solution.level}</span>
                                    <span class="ms-2 d-flex align-items-center text-primary small">
                                        <i class="fa-solid fa-shield-alt me-1 small"></i>Oficial
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p class="card-text small text-secondary mb-3 two-lines">
                            ${solution.description}
                        </p>

                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <i class="fa-solid fa-star text-warning me-1"></i>
                                <span class="small fw-medium">${solution.rating}</span>
                            </div>
                            <button class="btn btn-link text-primary btn-sm p-0">Ver detalles</button>
                        </div>
                    </div>
                </div>
            `;

            solutionsContainer.appendChild(solutionCard);
        });
    }
}

/**
 * Update user profile info based on role
 * @param {string} role - The user role
 * @param {Object} data - The profile data
 */
function updateUserProfileInfo(role, data) {
    // Define role-specific profile info
    const profileInfo = {
        funcionario: [
            { icon: 'building', label: 'Juzgado', value: 'Juzgado Civil Municipal No. 12' },
            { icon: 'graduation-cap', label: 'Educación', value: 'Universidad Nacional de Colombia' },
            { icon: 'briefcase', label: 'Experiencia', value: '10+ años en administración de justicia' }
        ],
        ciudadano: [
            { icon: 'university', label: 'Despacho', value: 'Rodríguez & Asociados' },
            { icon: 'graduation-cap', label: 'Educación', value: 'Universidad de Antioquia' },
            { icon: 'gavel', label: 'Especialidad', value: 'Derecho Laboral y Seguridad Social' }
        ],
        administrador: [
            { icon: 'server', label: 'Departamento', value: 'Dirección de Tecnología Judicial' },
            { icon: 'certificate', label: 'Certificaciones', value: 'CISSP, ITIL, PMP' },
            { icon: 'shield-alt', label: 'Responsabilidad', value: 'Seguridad y Disponibilidad de Sistemas' }
        ],
        desarrollador: [
            { icon: 'code-branch', label: 'Especialidad', value: 'Arquitectura de Sistemas Judiciales' },
            { icon: 'laptop-code', label: 'Tecnologías', value: 'Java, Python, React, AWS' },
            { icon: 'project-diagram', label: 'Proyectos', value: '12+ aplicaciones judiciales implementadas' }
        ],
        investigador: [
            { icon: 'university', label: 'Institución', value: 'Centro de Estudios Jurídicos Avanzados' },
            { icon: 'book', label: 'Publicaciones', value: '8 artículos en revistas indexadas' },
            { icon: 'search', label: 'Líneas de Investigación', value: 'Jurisprudencia Constitucional, Derechos Humanos' }
        ],
        estudiante: [
            { icon: 'university', label: 'Universidad', value: 'Universidad de Medellín' },
            { icon: 'graduation-cap', label: 'Semestre', value: '9° Semestre de Derecho' },
            { icon: 'award', label: 'Distinciones', value: 'Beca de Excelencia Académica 2024' }
        ]
    };

    const info = profileInfo[role] || profileInfo.funcionario;
    const infoContainer = document.querySelector('.card:nth-of-type(3) .card-body');

    if (infoContainer) {
        // Keep the title and bio
        const title = infoContainer.querySelector('h2');
        const bio = infoContainer.querySelector('p');

        // Clear the rest
        infoContainer.innerHTML = '';

        // Add back title and bio
        infoContainer.appendChild(title);
        infoContainer.appendChild(bio);

        // Add role-specific info
        info.forEach(item => {
            const infoItem = document.createElement('div');
            infoItem.className = 'd-flex align-items-center mb-3';
            infoItem.innerHTML = `
                <i class="fa-solid fa-${item.icon} text-secondary me-3"></i>
                <div>
                    <p class="small text-muted mb-0">${item.label}</p>
                    <p class="small fw-medium mb-0">${item.value}</p>
                </div>
            `;

            infoContainer.appendChild(infoItem);
        });
    }

    // Update activity feed based on role
    updateActivityFeed(role);
}

/**
 * Update activity feed based on role
 * @param {string} role - The user role
 */
function updateActivityFeed(role) {
    // Define role-specific activity feed
    const activityFeed = {
        funcionario: [
            { icon: 'file-alt', bgClass: 'bg-blue-soft', iconClass: 'text-primary', title: 'Expediente actualizado', time: 'Hace 1 día', description: 'Actualizaste el <strong>Expediente 2024-0127</strong> con nueva documentación.' },
            { icon: 'calendar', bgClass: 'bg-green-soft', iconClass: 'text-success', title: 'Audiencia programada', time: 'Hace 2 días', description: 'Programaste una <strong>Audiencia de Conciliación</strong> para el 18 de abril.' },
            { icon: 'gavel', bgClass: 'bg-purple-soft', iconClass: 'text-purple', title: 'Sentencia emitida', time: 'Hace 5 días', description: 'Emitiste <strong>Sentencia</strong> en el proceso 2023-0458.' }
        ],
        ciudadano: [
            { icon: 'file-upload', bgClass: 'bg-blue-soft', iconClass: 'text-primary', title: 'Documento presentado', time: 'Hace 1 día', description: 'Presentaste <strong>Recurso de Apelación</strong> en el proceso 2024-0089.' },
            { icon: 'search', bgClass: 'bg-green-soft', iconClass: 'text-success', title: 'Consulta realizada', time: 'Hace 3 días', description: 'Consultaste el estado del <strong>Proceso 2023-0345</strong>.' },
            { icon: 'bell', bgClass: 'bg-amber-soft', iconClass: 'text-amber', title: 'Notificación recibida', time: 'Hace 4 días', description: 'Recibiste <strong>Notificación Judicial</strong> sobre audiencia programada.' }
        ],
        administrador: [
            { icon: 'server', bgClass: 'bg-purple-soft', iconClass: 'text-purple', title: 'Sistema actualizado', time: 'Hace 12 horas', description: 'Actualizaste <strong>Servidor Principal</strong> a la versión 4.2.1.' },
            { icon: 'user-plus', bgClass: 'bg-blue-soft', iconClass: 'text-primary', title: 'Usuarios creados', time: 'Hace 2 días', description: 'Creaste <strong>15 nuevas cuentas</strong> para el Juzgado Civil del Circuito.' },
            { icon: 'shield-alt', bgClass: 'bg-red-soft', iconClass: 'text-danger', title: 'Alerta de seguridad', time: 'Hace 3 días', description: 'Resolviste <strong>Incidente de Seguridad</strong> en el sistema de notificaciones.' }
        ],
        desarrollador: [
            { icon: 'code-branch', bgClass: 'bg-orange-soft', iconClass: 'text-orange', title: 'Código actualizado', time: 'Hace 6 horas', description: 'Realizaste <strong>28 commits</strong> en la rama feature/expedientes-digitales.' },
            { icon: 'bug', bgClass: 'bg-red-soft', iconClass: 'text-danger', title: 'Error corregido', time: 'Hace 1 día', description: 'Solucionaste <strong>Bug #4582</strong> en el módulo de búsqueda avanzada.' },
            { icon: 'code', bgClass: 'bg-blue-soft', iconClass: 'text-primary', title: 'API actualizada', time: 'Hace 3 días', description: 'Implementaste <strong>Nuevos Endpoints</strong> para la API de consulta procesal.' }
        ],
        investigador: [
            { icon: 'chart-bar', bgClass: 'bg-purple-soft', iconClass: 'text-purple', title: 'Análisis completado', time: 'Hace 2 días', description: 'Completaste <strong>Análisis Jurisprudencial</strong> sobre sentencias de tutela 2023.' },
            { icon: 'file-alt', bgClass: 'bg-blue-soft', iconClass: 'text-primary', title: 'Artículo enviado', time: 'Hace 5 días', description: 'Enviaste <strong>Artículo de Investigación</strong> a la Revista de Derecho Constitucional.' },
            { icon: 'search', bgClass: 'bg-green-soft', iconClass: 'text-success', title: 'Investigación iniciada', time: 'Hace 1 semana', description: 'Iniciaste <strong>Nueva Investigación</strong> sobre tendencias en derecho ambiental.' }
        ],
        estudiante: [
            { icon: 'graduation-cap', bgClass: 'bg-green-soft', iconClass: 'text-success', title: 'Curso completado', time: 'Hace 3 días', description: 'Completaste el curso <strong>Introducción al Derecho Digital</strong> con calificación 4.8/5.0.' },
            { icon: 'book', bgClass: 'bg-blue-soft', iconClass: 'text-primary', title: 'Caso práctico enviado', time: 'Hace 5 días', description: 'Enviaste solución al <strong>Caso Práctico #12</strong> de Derecho Procesal.' },
            { icon: 'certificate', bgClass: 'bg-amber-soft', iconClass: 'text-amber', title: 'Certificación obtenida', time: 'Hace 2 semanas', description: 'Obtuviste <strong>Certificación en LegalTech</strong> con distinción.' }
        ]
    };

    const activities = activityFeed[role] || activityFeed.funcionario;
    const activityContainer = document.querySelector('.card:nth-of-type(2) .list-group');

    if (activityContainer) {
        activityContainer.innerHTML = '';

        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'list-group-item border-0 ps-0';
            activityItem.innerHTML = `
                <div class="d-flex">
                    <div class="${activity.bgClass} p-2 rounded me-3">
                        <i class="fa-solid fa-${activity.icon} ${activity.iconClass}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="h6 fw-medium mb-0">${activity.title}</h3>
                            <span class="text-muted small">${activity.time}</span>
                        </div>
                        <p class="text-secondary small mb-0">${activity.description}</p>
                    </div>
                </div>
            `;

            activityContainer.appendChild(activityItem);
        });
    }
}

/**
 * Create profile charts based on role
 * @param {string} role - The user role
 * @param {Object} data - The profile data
 */
function createProfileCharts(role, data) {
    // Remove existing chart section if it exists to prevent duplicates
    const existingChartSection = document.getElementById('chartSection');
    if (existingChartSection) {
        existingChartSection.remove();
    }

    // Create new chart section
    const chartSection = document.createElement('div');
    chartSection.id = 'chartSection';
    chartSection.className = 'card border-0 shadow-sm mb-4';
    chartSection.innerHTML = `
        <div class="card-body p-4 profile-section">
            <h2 class="h5 fw-bold mb-4">Análisis de Actividad</h2>
            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="chart-container" style="position: relative; height: 250px;">
                        <canvas id="activityChart"></canvas>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="chart-container" style="position: relative; height: 250px;">
                        <canvas id="progressChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert chart section before the recommended solutions section
    const recommendedSections = document.querySelectorAll('.card-body h2.h5.fw-bold');
    let recommendedSection = null;

    // Find the section with "Soluciones Recomendadas"
    for (const section of recommendedSections) {
        if (section.textContent.includes('Soluciones Recomendadas')) {
            recommendedSection = section.closest('.card');
            break;
        }
    }

    if (recommendedSection) {
        recommendedSection.parentNode.insertBefore(chartSection, recommendedSection);
    } else {
        // Fallback: append to main content
        document.querySelector('main .row:nth-of-type(2) .col-lg-8').appendChild(chartSection);
    }

    // Define chart data based on role
    const chartData = {
        funcionario: {
            activity: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Procesos Gestionados',
                    data: [12, 19, 15, 22, 18, 28],
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            progress: {
                labels: ['Audiencias', 'Sentencias', 'Autos', 'Notificaciones'],
                datasets: [{
                    data: [65, 40, 35, 50],
                    backgroundColor: [
                        'rgba(13, 110, 253, 0.7)',
                        'rgba(25, 135, 84, 0.7)',
                        'rgba(13, 202, 240, 0.7)',
                        'rgba(255, 193, 7, 0.7)'
                    ],
                    borderWidth: 1
                }]
            }
        },
        ciudadano: {
            activity: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Consultas Realizadas',
                    data: [5, 8, 12, 7, 10, 8],
                    backgroundColor: 'rgba(25, 135, 84, 0.2)',
                    borderColor: 'rgba(25, 135, 84, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            progress: {
                labels: ['Consultas', 'Documentos', 'Notificaciones', 'Recursos'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        'rgba(25, 135, 84, 0.7)',
                        'rgba(13, 110, 253, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(220, 53, 69, 0.7)'
                    ],
                    borderWidth: 1
                }]
            }
        },
        administrador: {
            activity: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Incidentes Resueltos',
                    data: [8, 5, 12, 7, 3, 9],
                    backgroundColor: 'rgba(133, 64, 189, 0.2)',
                    borderColor: 'rgba(133, 64, 189, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            progress: {
                labels: ['Sistemas', 'Usuarios', 'Seguridad', 'Mantenimiento'],
                datasets: [{
                    data: [30, 40, 20, 10],
                    backgroundColor: [
                        'rgba(133, 64, 189, 0.7)',
                        'rgba(13, 110, 253, 0.7)',
                        'rgba(220, 53, 69, 0.7)',
                        'rgba(25, 135, 84, 0.7)'
                    ],
                    borderWidth: 1
                }]
            }
        },
        desarrollador: {
            activity: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Commits Realizados',
                    data: [45, 30, 60, 25, 48, 28],
                    backgroundColor: 'rgba(253, 126, 20, 0.2)',
                    borderColor: 'rgba(253, 126, 20, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            progress: {
                labels: ['Desarrollo', 'Testing', 'Documentación', 'Despliegue'],
                datasets: [{
                    data: [50, 20, 15, 15],
                    backgroundColor: [
                        'rgba(253, 126, 20, 0.7)',
                        'rgba(13, 110, 253, 0.7)',
                        'rgba(25, 135, 84, 0.7)',
                        'rgba(220, 53, 69, 0.7)'
                    ],
                    borderWidth: 1
                }]
            }
        },
        investigador: {
            activity: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Análisis Completados',
                    data: [3, 5, 2, 4, 6, 3],
                    backgroundColor: 'rgba(133, 64, 189, 0.2)',
                    borderColor: 'rgba(133, 64, 189, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            progress: {
                labels: ['Investigación', 'Publicaciones', 'Análisis', 'Presentaciones'],
                datasets: [{
                    data: [40, 20, 30, 10],
                    backgroundColor: [
                        'rgba(133, 64, 189, 0.7)',
                        'rgba(13, 110, 253, 0.7)',
                        'rgba(25, 135, 84, 0.7)',
                        'rgba(255, 193, 7, 0.7)'
                    ],
                    borderWidth: 1
                }]
            }
        },
        estudiante: {
            activity: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Cursos Completados',
                    data: [1, 2, 1, 3, 2, 3],
                    backgroundColor: 'rgba(25, 135, 84, 0.2)',
                    borderColor: 'rgba(25, 135, 84, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            progress: {
                labels: ['Cursos', 'Prácticas', 'Certificaciones', 'Proyectos'],
                datasets: [{
                    data: [45, 25, 15, 15],
                    backgroundColor: [
                        'rgba(25, 135, 84, 0.7)',
                        'rgba(13, 110, 253, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(253, 126, 20, 0.7)'
                    ],
                    borderWidth: 1
                }]
            }
        }
    };

    // Get chart data for current role
    const currentChartData = chartData[role] || chartData.funcionario;

    // Get role-specific colors
    const roleColors = {
        funcionario: {
            primary: 'rgba(13, 110, 253, 1)',  // Blue
            secondary: 'rgba(13, 202, 240, 1)', // Info
            bgPrimary: 'rgba(13, 110, 253, 0.2)',
            bgSecondary: 'rgba(13, 202, 240, 0.2)'
        },
        ciudadano: {
            primary: 'rgba(25, 135, 84, 1)',    // Green
            secondary: 'rgba(32, 201, 151, 1)',  // Teal
            bgPrimary: 'rgba(25, 135, 84, 0.2)',
            bgSecondary: 'rgba(32, 201, 151, 0.2)'
        },
        administrador: {
            primary: 'rgba(133, 64, 189, 1)',    // Purple
            secondary: 'rgba(102, 16, 242, 1)',  // Indigo
            bgPrimary: 'rgba(133, 64, 189, 0.2)',
            bgSecondary: 'rgba(102, 16, 242, 0.2)'
        },
        desarrollador: {
            primary: 'rgba(253, 126, 20, 1)',    // Orange
            secondary: 'rgba(255, 193, 7, 1)',   // Warning
            bgPrimary: 'rgba(253, 126, 20, 0.2)',
            bgSecondary: 'rgba(255, 193, 7, 0.2)'
        },
        investigador: {
            primary: 'rgba(133, 64, 189, 1)',    // Purple
            secondary: 'rgba(102, 16, 242, 1)',  // Indigo
            bgPrimary: 'rgba(133, 64, 189, 0.2)',
            bgSecondary: 'rgba(102, 16, 242, 0.2)'
        },
        estudiante: {
            primary: 'rgba(25, 135, 84, 1)',    // Green
            secondary: 'rgba(32, 201, 151, 1)',  // Teal
            bgPrimary: 'rgba(25, 135, 84, 0.2)',
            bgSecondary: 'rgba(32, 201, 151, 0.2)'
        }
    };

    // Get colors for current role
    const colors = roleColors[role] || roleColors.funcionario;

    // Update chart data with role-specific colors
    if (currentChartData.activity && currentChartData.activity.datasets && currentChartData.activity.datasets.length > 0) {
        currentChartData.activity.datasets[0].borderColor = colors.primary;
        currentChartData.activity.datasets[0].backgroundColor = colors.bgPrimary;
    }

    if (currentChartData.progress && currentChartData.progress.datasets && currentChartData.progress.datasets.length > 0) {
        // Create a gradient of colors based on the role's primary and secondary colors
        currentChartData.progress.datasets[0].backgroundColor = [
            colors.primary,
            colors.secondary,
            colors.bgPrimary,
            colors.bgSecondary
        ];
    }

    // Create charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        // Activity Chart (Line Chart)
        const activityCtx = document.getElementById('activityChart');
        if (activityCtx) {
            const activityChart = new Chart(activityCtx, {
                type: 'line',
                data: currentChartData.activity,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Actividad Mensual',
                            color: '#fff'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#fff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#fff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
            window.profileCharts.push(activityChart);
        }

        // Progress Chart (Doughnut Chart)
        const progressCtx = document.getElementById('progressChart');
        if (progressCtx) {
            const progressChart = new Chart(progressCtx, {
                type: 'doughnut',
                data: currentChartData.progress,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: '#fff'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Distribución de Actividades',
                            color: '#fff'
                        }
                    }
                }
            });
            window.profileCharts.push(progressChart);
        }
    } else {
        console.warn('Chart.js no está disponible. Los gráficos no se mostrarán.');
    }
}

/**
 * Update role specific content
 * @param {string} role - The user role
 */
function updateRoleSpecificContent(role) {
    // Define role-specific colors
    const roleColors = {
        funcionario: {
            borderClass: 'border-primary',
            shadowClass: 'shadow-primary'
        },
        ciudadano: {
            borderClass: 'border-success',
            shadowClass: 'shadow-success'
        },
        administrador: {
            borderClass: 'border-purple',
            shadowClass: 'shadow-purple'
        },
        desarrollador: {
            borderClass: 'border-orange',
            shadowClass: 'shadow-orange'
        },
        investigador: {
            borderClass: 'border-purple',
            shadowClass: 'shadow-purple'
        },
        estudiante: {
            borderClass: 'border-success',
            shadowClass: 'shadow-success'
        }
    };

    // Highlight the selected profile card with role-specific colors
    document.querySelectorAll('.profile-card').forEach(card => {
        const cardRole = card.getAttribute('data-role');

        // Remove all possible border classes
        card.classList.remove('border-primary', 'border-success', 'border-purple', 'border-orange');
        card.classList.remove('shadow');

        if (cardRole === role) {
            const colors = roleColors[role] || roleColors.funcionario;
            card.classList.add(colors.borderClass);
            card.classList.add('shadow');
        }
    });

    // Update page title based on role
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        const titles = {
            funcionario: "Panel de Funcionario - Marduk",
            ciudadano: "Portal Ciudadano - Marduk",
            administrador: "Centro de Administración - Marduk",
            desarrollador: "Hub de Desarrollo - Marduk",
            investigador: "Centro de Investigación - Marduk",
            estudiante: "Portal Educativo - Marduk"
        };
        pageTitle.textContent = titles[role] || "Mi Perfil - Marduk";
    }
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
 * Get an appropriate icon for each role
 * @param {string} role - The user role
 * @returns {string} - Icon class name
 */
function getRoleIcon(role) {
    const roleIcons = {
        funcionario: 'gavel',
        ciudadano: 'user-tie',
        administrador: 'server',
        desarrollador: 'code',
        investigador: 'search',
        estudiante: 'graduation-cap'
    };

    return roleIcons[role] || 'user';
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

        // Determine card color based on role
        const roleColors = {
            funcionario: {
                btnClass: 'btn-outline-primary',
                borderClass: 'border-primary',
                badgeClass: 'bg-primary'
            },
            ciudadano: {
                btnClass: 'btn-outline-success',
                borderClass: 'border-success',
                badgeClass: 'bg-success'
            },
            administrador: {
                btnClass: 'btn-outline-purple',
                borderClass: 'border-purple',
                badgeClass: 'bg-purple'
            },
            desarrollador: {
                btnClass: 'btn-outline-orange',
                borderClass: 'border-orange',
                badgeClass: 'bg-orange'
            },
            investigador: {
                btnClass: 'btn-outline-purple',
                borderClass: 'border-purple',
                badgeClass: 'bg-purple'
            },
            estudiante: {
                btnClass: 'btn-outline-success',
                borderClass: 'border-success',
                badgeClass: 'bg-success'
            }
        };

        const colors = roleColors[role] || roleColors.funcionario;

        // Get role-specific data for the card
        const roleData = profileData[role] || {};
        const level = roleData.gamification ? roleData.gamification.level : 1;

        card.innerHTML = `
            <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                    <div class="me-3 position-relative">
                        <img src="https://randomuser.me/api/portraits/${profile.gender}/${randomNum}.jpg"
                             alt="${profile.name}"
                             class="rounded-circle"
                             width="60" height="60">
                        <span class="position-absolute bottom-0 end-0 ${colors.badgeClass} rounded-circle d-flex align-items-center justify-content-center"
                              style="width: 22px; height: 22px; font-size: 10px; border: 2px solid white;">
                            ${level}
                        </span>
                    </div>
                    <div>
                        <h3 class="h5 fw-semibold mb-0">${profile.name}</h3>
                        <p class="text-muted small mb-0">${profile.role}</p>
                    </div>
                </div>
                <p class="text-secondary small mb-3">${profile.description}</p>
                <div class="d-flex justify-content-between align-items-center small text-muted mb-3">
                    <span><i class="fas fa-map-marker-alt me-1"></i> ${profile.location || 'Colombia'}</span>
                    <span><i class="fas fa-${getRoleIcon(role)} me-1"></i> ${profile.specialty || 'Especialista'}</span>
                </div>
                <button class="btn btn-sm ${colors.btnClass} w-100">Ver perfil</button>
            </div>
        `;

        cardCol.appendChild(card);
        profileCardsContainer.appendChild(cardCol);
    });
}