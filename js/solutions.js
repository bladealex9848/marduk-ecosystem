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

// Exportar funciones para uso global
window.showAppDetail = showAppDetail;
window.showSolutionsList = showSolutionsList;
