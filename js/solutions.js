/**
 * MARDUK ECOSYSTEM - SOLUCIONES
 *
 * Este archivo contiene la lógica para la página de soluciones,
 * incluyendo filtros, visualización de detalles y navegación por tabs.
 */

// Variables globales
let currentView = 'grid'; // 'grid' o 'list'
let currentFilters = {
    category: 'all',
    level: 'all',
    type: 'all',
    sort: 'featured'
};

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos de filtros
    setupFilters();

    // Configurar eventos de vista
    setupViewToggle();

    // Configurar eventos de tabs
    setupTabs();
});

/**
 * Configura los eventos para los filtros
 */
function setupFilters() {
    // Filtros de categoría
    const categoryButtons = document.querySelectorAll('.filter-categories button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Quitar clase activa de todos los botones
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Añadir clase activa al botón seleccionado
            this.classList.add('active');

            // Actualizar filtro
            currentFilters.category = this.getAttribute('data-category') || 'all';

            // Aplicar filtros
            applyFilters();
        });
    });

    // Filtros avanzados
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const advancedFilters = document.getElementById('advancedFilters');

    if (filterToggleBtn && advancedFilters) {
        filterToggleBtn.addEventListener('click', function() {
            advancedFilters.classList.toggle('d-none');

            // Cambiar icono del botón
            const icon = this.querySelector('i');
            if (icon) {
                if (advancedFilters.classList.contains('d-none')) {
                    icon.className = 'fa-solid fa-filter';
                } else {
                    icon.className = 'fa-solid fa-times';
                }
            }
        });
    }

    // Selects de filtros avanzados
    const filterSelects = document.querySelectorAll('#advancedFilters select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // Identificar el tipo de filtro
            const filterType = this.id.replace('filter-', '');

            // Actualizar filtro
            currentFilters[filterType] = this.value;

            // Aplicar filtros
            applyFilters();
        });
    });
}

/**
 * Configura los eventos para cambiar entre vista de cuadrícula y lista
 */
function setupViewToggle() {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');

    if (gridViewBtn && listViewBtn && gridView && listView) {
        gridViewBtn.addEventListener('click', function() {
            // Actualizar botones
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');

            // Mostrar vista de cuadrícula
            gridView.classList.remove('d-none');
            listView.classList.add('d-none');

            // Actualizar vista actual
            currentView = 'grid';
        });

        listViewBtn.addEventListener('click', function() {
            // Actualizar botones
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');

            // Mostrar vista de lista
            gridView.classList.add('d-none');
            listView.classList.remove('d-none');

            // Actualizar vista actual
            currentView = 'list';
        });
    }
}

/**
 * Configura los eventos para los tabs de detalles de la aplicación
 */
function setupTabs() {
    // Obtener todos los tabs
    const tabs = document.querySelectorAll('#appTabs button');

    // Añadir evento de clic a cada tab
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Actualizar URL con el tab seleccionado
            const tabId = this.id.replace('-tab', '');
            updateUrlParam('tab', tabId);
        });
    });

    // Verificar si hay un tab en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam) {
        // Activar el tab correspondiente
        const tabToActivate = document.getElementById(`${tabParam}-tab`);
        if (tabToActivate) {
            const tabInstance = new bootstrap.Tab(tabToActivate);
            tabInstance.show();
        }
    }
}

/**
 * Aplica los filtros actuales a las soluciones
 */
function applyFilters() {
    // Obtener todas las soluciones
    const solutions = document.querySelectorAll('.solution-card');

    // Filtrar soluciones
    solutions.forEach(solution => {
        const category = solution.getAttribute('data-category');
        const level = solution.getAttribute('data-level');
        const type = solution.getAttribute('data-type');

        // Verificar si cumple con los filtros
        const matchesCategory = currentFilters.category === 'all' || category === currentFilters.category;
        const matchesLevel = currentFilters.level === 'all' || level === currentFilters.level;
        const matchesType = currentFilters.type === 'all' || type === currentFilters.type;

        // Mostrar u ocultar según los filtros
        if (matchesCategory && matchesLevel && matchesType) {
            solution.classList.remove('d-none');
        } else {
            solution.classList.add('d-none');
        }
    });

    // Ordenar soluciones
    sortSolutions(currentFilters.sort);

    // Mostrar mensaje si no hay resultados
    const visibleSolutions = document.querySelectorAll('.solution-card:not(.d-none)');
    const noResultsMessage = document.getElementById('noResultsMessage');

    if (visibleSolutions.length === 0 && noResultsMessage) {
        noResultsMessage.classList.remove('d-none');
    } else if (noResultsMessage) {
        noResultsMessage.classList.add('d-none');
    }
}

/**
 * Ordena las soluciones según el criterio especificado
 * @param {string} sortBy - Criterio de ordenación
 */
function sortSolutions(sortBy) {
    // Implementar ordenación según el criterio
    // (featured, newest, downloads, rating)
    console.log(`Ordenando por: ${sortBy}`);

    // Aquí iría la lógica de ordenación
}

/**
 * Actualiza un parámetro en la URL sin recargar la página
 * @param {string} key - Nombre del parámetro
 * @param {string} value - Valor del parámetro
 */
function updateUrlParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url);
}

/**
 * Muestra los detalles de una aplicación
 * @param {number} appId - ID de la aplicación
 */
function showAppDetail(appId) {
    // Ocultar lista de soluciones
    document.getElementById('solutionsList').classList.add('d-none');

    // Mostrar detalles de la aplicación
    document.getElementById('appDetail').classList.remove('d-none');

    // Cargar datos de la aplicación
    loadAppData(appId);

    // Actualizar URL
    updateUrlParam('app', appId);

    // Desplazar al inicio
    window.scrollTo(0, 0);
}

/**
 * Vuelve a la lista de soluciones
 */
function showSolutionsList() {
    // Ocultar detalles de la aplicación
    document.getElementById('appDetail').classList.add('d-none');

    // Mostrar lista de soluciones
    document.getElementById('solutionsList').classList.remove('d-none');

    // Actualizar URL
    const url = new URL(window.location.href);
    url.searchParams.delete('app');
    url.searchParams.delete('tab');
    window.history.replaceState({}, '', url);
}

/**
 * Carga los datos de una aplicación
 * @param {number} appId - ID de la aplicación
 */
function loadAppData(appId) {
    // Aquí se cargarían los datos de la aplicación desde una API o un objeto
    console.log(`Cargando datos de la aplicación ${appId}`);

    // Por ahora, usamos datos estáticos
    // En una implementación real, esto vendría de una API
}

/**
 * Verifica si hay parámetros en la URL para mostrar detalles de una aplicación
 */
function checkUrlForAppDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');
    const category = urlParams.get('category');
    const isAiGenerated = urlParams.get('ai') === 'true';

    if (appId) {
        if (isAiGenerated) {
            // Es una solución generada por IA
            showAiGeneratedSolution(appId, category);
        } else {
            // Es una solución normal
            showAppDetail(parseInt(appId));
        }
    }
}

/**
 * Muestra una solución generada por IA
 * @param {string} solutionId - ID de la solución generada
 * @param {string} category - Categoría de la solución
 */
function showAiGeneratedSolution(solutionId, category) {
    console.log(`Mostrando solución generada por IA: ${solutionId}, categoría: ${category}`);

    // Intentar recuperar la solución del localStorage
    const solutionKey = `ai-solution-${solutionId}`;
    console.log(`Buscando solución en localStorage con clave: ${solutionKey}`);

    // Listar todas las claves en localStorage para depuración
    console.log('Claves en localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`- ${key}: ${localStorage.getItem(key).substring(0, 30)}...`);
    }

    const solutionData = localStorage.getItem(solutionKey);

    if (!solutionData) {
        console.error(`No se encontró la solución generada con ID: ${solutionId}`);
        showToast('No se encontró la solución generada', 'error');

        // Verificar si hay alguna solución generada por IA en localStorage
        const aiSolutions = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('ai-solution-')) {
                try {
                    const solution = JSON.parse(localStorage.getItem(key));
                    aiSolutions.push({
                        key: key,
                        id: key.replace('ai-solution-', ''),
                        solution: solution
                    });
                } catch (e) {
                    console.error(`Error al parsear solución ${key}:`, e);
                }
            }
        }

        if (aiSolutions.length > 0) {
            console.log(`Se encontraron ${aiSolutions.length} soluciones generadas por IA:`, aiSolutions);

            // Usar la solución más reciente
            const latestSolution = aiSolutions.sort((a, b) => b.id - a.id)[0];
            console.log('Usando la solución más reciente:', latestSolution);

            // Actualizar la URL
            const url = new URL(window.location.href);
            url.searchParams.set('id', latestSolution.id);
            url.searchParams.set('category', latestSolution.solution.category);
            url.searchParams.set('ai', 'true');
            window.history.replaceState({}, '', url);

            // Mostrar la solución
            displayAiSolution(latestSolution.solution);
            return;
        }

        return;
    }

    try {
        // Parsear los datos de la solución
        console.log('Datos de la solución encontrados:', solutionData.substring(0, 100) + '...');
        const solution = JSON.parse(solutionData);

        // Mostrar la solución
        displayAiSolution(solution);
    } catch (error) {
        console.error('Error al mostrar la solución generada:', error);
        showToast('Error al mostrar la solución generada', 'error');
    }
}

/**
 * Muestra una solución generada por IA en la interfaz
 * @param {Object} solution - Datos de la solución
 */
function displayAiSolution(solution) {
    // Ocultar lista de soluciones
    document.getElementById('solutionsList').classList.add('d-none');

    // Mostrar detalles de la aplicación
    const appDetailElement = document.getElementById('appDetail');
    appDetailElement.classList.remove('d-none');

    // Crear contenido HTML para la solución generada
    appDetailElement.innerHTML = generateAiSolutionHtml(solution);

    // Configurar evento para el botón de volver
    const backButton = document.querySelector('#appDetail .back-button');
    if (backButton) {
        backButton.addEventListener('click', showSolutionsList);
    }

    // Desplazar al inicio
    window.scrollTo(0, 0);

    // Mostrar mensaje de éxito
    showToast('Solución generada por IA cargada correctamente', 'success');
}

/**
 * Genera el HTML para una solución generada por IA
 * @param {Object} solution - Datos de la solución
 * @returns {string} - HTML generado
 */
function generateAiSolutionHtml(solution) {
    // Determinar el nivel de la solución
    const level = parseInt(solution.level) || 1;
    const levelClass = getLevelClass(level);
    const levelText = getLevelText(level);

    // Generar HTML para las características
    let featuresHtml = '';
    if (solution.features && solution.features.length > 0) {
        featuresHtml = solution.features.map(feature =>
            `<div class="d-flex align-items-start mb-3">
                <div class="feature-icon bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <i class="fas fa-check text-primary"></i>
                </div>
                <div>
                    <p class="mb-0">${feature}</p>
                </div>
            </div>`
        ).join('');
    }

    // Generar HTML para los beneficios
    let benefitsHtml = '';
    if (solution.benefits && solution.benefits.length > 0) {
        benefitsHtml = solution.benefits.map(benefit =>
            `<div class="d-flex align-items-start mb-3">
                <div class="feature-icon bg-success bg-opacity-10 rounded-circle p-2 me-3">
                    <i class="fas fa-plus text-success"></i>
                </div>
                <div>
                    <p class="mb-0">${benefit}</p>
                </div>
            </div>`
        ).join('');
    }

    // Generar HTML para los casos de uso
    let useCasesHtml = '';
    if (solution.useCases && solution.useCases.length > 0) {
        useCasesHtml = solution.useCases.map(useCase =>
            `<div class="d-flex align-items-start mb-3">
                <div class="feature-icon bg-info bg-opacity-10 rounded-circle p-2 me-3">
                    <i class="fas fa-user-check text-info"></i>
                </div>
                <div>
                    <p class="mb-0">${useCase}</p>
                </div>
            </div>`
        ).join('');
    }

    // Generar HTML para las etiquetas
    let tagsHtml = '';
    if (solution.tags && solution.tags.length > 0) {
        tagsHtml = solution.tags.map(tag =>
            `<span class="badge bg-light text-dark me-2 mb-2 py-2 px-3 rounded-pill">
                <i class="fas fa-tag me-1 text-primary opacity-75"></i>${tag}
            </span>`
        ).join('');
    }

    // Generar HTML para el proceso de evolución
    const evolutionHtml = generateEvolutionTimeline(level);

    // Generar HTML para recomendado para
    const recommendedForHtml = `
        <div class="d-flex flex-wrap gap-3">
            <div class="d-flex align-items-center bg-primary bg-opacity-10 rounded-pill px-4 py-2">
                <i class="fas fa-user-tie text-primary me-2"></i>
                <span class="fw-medium">Funcionarios Judiciales</span>
            </div>
            <div class="d-flex align-items-center bg-primary bg-opacity-10 rounded-pill px-4 py-2">
                <i class="fas fa-user-cog text-primary me-2"></i>
                <span class="fw-medium">Administradores</span>
            </div>
        </div>
    `;

    // Generar HTML para los tabs
    const tabsHtml = `
        <ul class="nav nav-tabs" id="appTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab" aria-controls="overview" aria-selected="true">
                    <i class="fas fa-info-circle me-2"></i>Descripción general
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="features-tab" data-bs-toggle="tab" data-bs-target="#features" type="button" role="tab" aria-controls="features" aria-selected="false">
                    <i class="fas fa-list-check me-2"></i>Características
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="implementation-tab" data-bs-toggle="tab" data-bs-target="#implementation" type="button" role="tab" aria-controls="implementation" aria-selected="false">
                    <i class="fas fa-code me-2"></i>Implementación
                </button>
            </li>
        </ul>
    `;

    return `
    <div class="container py-4">
        <!-- Botón de volver -->
        <div class="mb-4">
            <button class="btn btn-outline-primary back-button rounded-pill px-4">
                <i class="fas fa-arrow-left me-2"></i>Volver a soluciones
            </button>
        </div>

        <!-- Encabezado de la aplicación -->
        <div class="card border-0 shadow-sm mb-4 rounded-4 overflow-hidden">
            <div class="card-body p-0">
                <div class="bg-gradient-primary text-white p-4 pb-5">
                    <div class="d-flex align-items-center mb-3">
                        <span class="badge ${levelClass} me-2 rounded-pill px-3">${levelText}</span>
                        <span class="badge bg-info me-2 rounded-pill px-3">Generado por IA</span>
                        <span class="badge bg-secondary rounded-pill px-3">${solution.type || 'community'}</span>
                    </div>
                    <h1 class="h3 fw-bold">${solution.name}</h1>
                    <p class="mb-0 opacity-90">${solution.description}</p>
                </div>

                <div class="bg-white px-4 py-3">
                    ${tabsHtml}
                </div>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="row g-4">
            <!-- Columna principal -->
            <div class="col-lg-8">
                <div class="tab-content" id="appTabsContent">
                    <!-- Tab: Descripción general -->
                    <div class="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="overview-tab">
                        <!-- Descripción completa -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                                <i class="fas fa-info-circle text-primary me-2"></i>
                                Descripción detallada
                            </h3>
                            <div class="mb-4">
                                <p class="text-secondary">${solution.fullDescription || solution.description}</p>
                            </div>
                        </div>

                        <!-- Beneficios -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                                <i class="fas fa-star text-warning me-2"></i>
                                Beneficios principales
                            </h3>
                            <div class="benefits-list">
                                ${benefitsHtml}
                            </div>
                        </div>

                        <!-- Casos de uso -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                                <i class="fas fa-user-check text-info me-2"></i>
                                Casos de uso
                            </h3>
                            <div class="use-cases-list">
                                ${useCasesHtml}
                            </div>
                        </div>

                        <!-- Recomendado para -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                                <i class="fas fa-users text-success me-2"></i>
                                Recomendado para
                            </h3>
                            ${recommendedForHtml}
                        </div>
                    </div>

                    <!-- Tab: Características -->
                    <div class="tab-pane fade" id="features" role="tabpanel" aria-labelledby="features-tab">
                        <!-- Características -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                                <i class="fas fa-list-check text-primary me-2"></i>
                                Características principales
                            </h3>
                            <div class="feature-list">
                                ${featuresHtml}
                            </div>
                        </div>
                    </div>

                    <!-- Tab: Implementación -->
                    <div class="tab-pane fade" id="implementation" role="tabpanel" aria-labelledby="implementation-tab">
                        <!-- Implementación -->
                        <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                            <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                                <i class="fas fa-code text-primary me-2"></i>
                                Detalles de implementación
                            </h3>
                            <p class="text-secondary">${solution.implementation || 'No hay información de implementación disponible.'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Columna lateral -->
            <div class="col-lg-4">
                <!-- Información general -->
                <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                        <i class="fas fa-circle-info text-primary me-2"></i>
                        Información general
                    </h3>
                    <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                        <div class="icon-box bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                            <i class="fas fa-folder text-primary"></i>
                        </div>
                        <div>
                            <p class="text-muted small mb-0">Categoría</p>
                            <p class="fw-medium mb-0">${getCategoryName(solution.category)}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                        <div class="icon-box bg-success bg-opacity-10 rounded-3 p-3 me-3">
                            <i class="fas fa-chart-line text-success"></i>
                        </div>
                        <div>
                            <p class="text-muted small mb-0">Nivel de madurez</p>
                            <p class="fw-medium mb-0">${levelText}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                        <div class="icon-box bg-info bg-opacity-10 rounded-3 p-3 me-3">
                            <i class="fas fa-code-branch text-info"></i>
                        </div>
                        <div>
                            <p class="text-muted small mb-0">Tipo</p>
                            <p class="fw-medium mb-0">${solution.type || 'Community'}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <div class="icon-box bg-warning bg-opacity-10 rounded-3 p-3 me-3">
                            <i class="fas fa-robot text-warning"></i>
                        </div>
                        <div>
                            <p class="text-muted small mb-0">Generado por</p>
                            <p class="fw-medium mb-0">Inteligencia Artificial</p>
                        </div>
                    </div>
                </div>

                <!-- Proceso de evolución -->
                <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                        <i class="fas fa-chart-line text-success me-2"></i>
                        Proceso de evolución
                    </h3>
                    <div class="position-relative evolution-timeline">
                        ${evolutionHtml}
                    </div>
                </div>

                <!-- Etiquetas -->
                <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                        <i class="fas fa-tags text-primary me-2"></i>
                        Etiquetas
                    </h3>
                    <div class="d-flex flex-wrap">
                        ${tagsHtml}
                    </div>
                </div>

                <!-- Acciones -->
                <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h3 class="h5 fw-bold mb-4 d-flex align-items-center">
                        <i class="fas fa-bolt text-warning me-2"></i>
                        Acciones rápidas
                    </h3>
                    <div class="d-grid gap-3">
                        <button class="btn btn-primary rounded-pill py-2 px-4">
                            <i class="fas fa-star me-2"></i>Guardar como favorito
                        </button>
                        <button class="btn btn-outline-primary rounded-pill py-2 px-4">
                            <i class="fas fa-share-alt me-2"></i>Compartir solución
                        </button>
                        <button class="btn btn-outline-success rounded-pill py-2 px-4">
                            <i class="fas fa-download me-2"></i>Descargar información
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Obtiene el nombre de la categoría a partir de su ID
 * @param {string} categoryId - ID de la categoría
 * @returns {string} - Nombre de la categoría
 */
function getCategoryName(categoryId) {
    const categories = {
        'case-management': 'Gestión de Casos',
        'legal-research': 'Investigación Jurídica',
        'document-automation': 'Automatización de Documentos',
        'ai-tools': 'Herramientas de IA',
        'access-justice': 'Acceso a la Justicia',
        'legal-education': 'Educación Jurídica'
    };

    return categories[categoryId] || categoryId;
}

/**
 * Obtiene la clase CSS para el nivel de madurez de una solución
 * @param {number} level - Nivel de madurez (1-5)
 * @returns {string} - Clase CSS
 */
function getLevelClass(level) {
    const levelClasses = {
        1: 'bg-secondary',
        2: 'bg-info',
        3: 'bg-primary',
        4: 'bg-success',
        5: 'bg-warning text-dark'
    };

    return levelClasses[level] || 'bg-secondary';
}

/**
 * Obtiene el texto para el nivel de madurez de una solución
 * @param {number} level - Nivel de madurez (1-5)
 * @returns {string} - Texto descriptivo
 */
function getLevelText(level) {
    const levelTexts = {
        1: 'Nivel 1: Idea',
        2: 'Nivel 2: Prototipo',
        3: 'Nivel 3: Beta',
        4: 'Nivel 4: Producción',
        5: 'Nivel 5: Consolidada'
    };

    return levelTexts[level] || 'Nivel desconocido';
}

/**
 * Genera el HTML para la línea de tiempo de evolución
 * @param {number} currentLevel - Nivel actual de la solución
 * @returns {string} - HTML generado
 */
function generateEvolutionTimeline(currentLevel) {
    // Definir las etapas de evolución
    const stages = [
        {
            level: 1,
            name: 'Idea',
            icon: 'lightbulb',
            description: 'Fase inicial: Conceptualización de la herramienta',
            date: 'Enero 2023'
        },
        {
            level: 2,
            name: 'Prototipo',
            icon: 'code',
            description: 'Desarrollo del primer prototipo funcional',
            date: 'Pendiente'
        },
        {
            level: 3,
            name: 'Beta',
            icon: 'flask',
            description: 'Pruebas con usuarios reales',
            date: 'Pendiente'
        },
        {
            level: 4,
            name: 'Producción',
            icon: 'rocket',
            description: 'Lanzamiento oficial y despliegue',
            date: 'Pendiente'
        },
        {
            level: 5,
            name: 'Consolidada',
            icon: 'check-circle',
            description: 'Adopción generalizada y mejora continua',
            date: 'Pendiente'
        }
    ];

    // Línea de tiempo vertical
    let timelineHtml = `<div class="position-absolute start-0 top-0 bottom-0 ms-5" style="width: 2px; background-color: #e9ecef;"></div>`;

    // Generar HTML para cada etapa
    stages.forEach(stage => {
        const isCompleted = stage.level <= currentLevel;
        const statusClass = isCompleted ? 'bg-success' : 'bg-secondary';
        const statusText = isCompleted ? 'Completado' : 'Pendiente';
        const date = stage.level === 1 ? stage.date : (isCompleted ? 'Completado' : 'Pendiente');

        timelineHtml += `
        <div class="timeline-item d-flex mb-4 position-relative">
            <div class="timeline-icon ${statusClass} text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; z-index: 1;">
                <i class="fas fa-${stage.icon}"></i>
            </div>
            <div class="timeline-content ms-4 ps-3">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="h6 fw-bold mb-1">${stage.name}</h4>
                    <span class="badge ${statusClass} rounded-pill">${statusText}</span>
                </div>
                <p class="text-secondary mb-1">${stage.description}</p>
                <p class="small text-muted">${date}</p>
            </div>
        </div>
        `;
    });

    return timelineHtml;
}

// Exportar funciones para uso global
window.showAppDetail = showAppDetail;
window.showSolutionsList = showSolutionsList;
window.checkUrlForAppDetail = checkUrlForAppDetail;
window.showAiGeneratedSolution = showAiGeneratedSolution;

// Inicializar la página cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando página de soluciones...');

    // Verificar parámetros de URL para mostrar detalles de una aplicación
    checkUrlForAppDetail();
});
