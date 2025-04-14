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
    const solutionData = localStorage.getItem(solutionKey);

    if (!solutionData) {
        console.error(`No se encontró la solución generada con ID: ${solutionId}`);
        showToast('No se encontró la solución generada', 'error');
        return;
    }

    try {
        // Parsear los datos de la solución
        const solution = JSON.parse(solutionData);

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
    } catch (error) {
        console.error('Error al mostrar la solución generada:', error);
        showToast('Error al mostrar la solución generada', 'error');
    }
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
        featuresHtml = solution.features.map(feature => `<li class="mb-2">${feature}</li>`).join('');
    }

    // Generar HTML para los beneficios
    let benefitsHtml = '';
    if (solution.benefits && solution.benefits.length > 0) {
        benefitsHtml = solution.benefits.map(benefit => `<li class="mb-2">${benefit}</li>`).join('');
    }

    // Generar HTML para los casos de uso
    let useCasesHtml = '';
    if (solution.useCases && solution.useCases.length > 0) {
        useCasesHtml = solution.useCases.map(useCase => `<li class="mb-2">${useCase}</li>`).join('');
    }

    // Generar HTML para las etiquetas
    let tagsHtml = '';
    if (solution.tags && solution.tags.length > 0) {
        tagsHtml = solution.tags.map(tag => `<span class="badge bg-light text-dark me-2 mb-2">${tag}</span>`).join('');
    }

    return `
    <div class="container py-4">
        <!-- Botón de volver -->
        <div class="mb-4">
            <button class="btn btn-outline-primary back-button">
                <i class="fas fa-arrow-left me-2"></i>Volver a soluciones
            </button>
        </div>

        <!-- Encabezado de la aplicación -->
        <div class="card border-0 bg-gradient mb-4 rounded-3 dashboard-banner">
            <div class="card-body text-white p-4">
                <div class="d-flex align-items-center mb-3">
                    <span class="badge ${levelClass} me-2">${levelText}</span>
                    <span class="badge bg-info me-2">Generado por IA</span>
                    <span class="badge bg-secondary">${solution.type || 'community'}</span>
                </div>
                <h1 class="h3 fw-bold">${solution.name}</h1>
                <p class="mb-0 opacity-90">${solution.description}</p>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="row">
            <!-- Columna principal -->
            <div class="col-lg-8">
                <!-- Descripción completa -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Descripción</h5>
                    </div>
                    <div class="card-body">
                        <p>${solution.fullDescription || solution.description}</p>
                    </div>
                </div>

                <!-- Características -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Características</h5>
                    </div>
                    <div class="card-body">
                        <ul class="feature-list">
                            ${featuresHtml}
                        </ul>
                    </div>
                </div>

                <!-- Beneficios -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Beneficios</h5>
                    </div>
                    <div class="card-body">
                        <ul class="benefits-list">
                            ${benefitsHtml}
                        </ul>
                    </div>
                </div>

                <!-- Casos de uso -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Casos de uso</h5>
                    </div>
                    <div class="card-body">
                        <ul class="use-cases-list">
                            ${useCasesHtml}
                        </ul>
                    </div>
                </div>

                <!-- Implementación -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Implementación</h5>
                    </div>
                    <div class="card-body">
                        <p>${solution.implementation || 'No hay información de implementación disponible.'}</p>
                    </div>
                </div>
            </div>

            <!-- Columna lateral -->
            <div class="col-lg-4">
                <!-- Información general -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Información general</h5>
                    </div>
                    <div class="card-body">
                        <p><strong>Categoría:</strong> ${getCategoryName(solution.category)}</p>
                        <p><strong>Nivel de madurez:</strong> ${levelText}</p>
                        <p><strong>Tipo:</strong> ${solution.type || 'Community'}</p>
                        <p><strong>Generado por:</strong> Inteligencia Artificial</p>
                    </div>
                </div>

                <!-- Etiquetas -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Etiquetas</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex flex-wrap">
                            ${tagsHtml}
                        </div>
                    </div>
                </div>

                <!-- Acciones -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Acciones</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary">
                                <i class="fas fa-star me-2"></i>Guardar como favorito
                            </button>
                            <button class="btn btn-outline-primary">
                                <i class="fas fa-share-alt me-2"></i>Compartir
                            </button>
                        </div>
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

// Exportar funciones para uso global
window.showAppDetail = showAppDetail;
window.showSolutionsList = showSolutionsList;
window.checkUrlForAppDetail = checkUrlForAppDetail;
