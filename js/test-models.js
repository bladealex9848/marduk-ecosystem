/**
 * Script para probar la carga de modelos desde openrouter-models.js
 */

// Cargar modelos desde openrouter-models.js
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar indicador de carga
    const modelsContainer = document.getElementById('models-container');
    modelsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando modelos desde openrouter-models.js...</p>
        </div>
    `;

    // Incluir el script openrouter-models.js antes de este script
    // Verificar si OPENROUTER_MODELS_CONFIG ya está definido
    if (typeof OPENROUTER_MODELS_CONFIG !== 'undefined') {
        console.log('OPENROUTER_MODELS_CONFIG ya está definido');
        initApp(OPENROUTER_MODELS_CONFIG);
    } else {
        console.error('OPENROUTER_MODELS_CONFIG no está definido');
        modelsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-danger mb-3">
                    <i class="fas fa-exclamation-circle fa-3x"></i>
                </div>
                <h4>Error al cargar los modelos</h4>
                <p>No se pudo cargar OPENROUTER_MODELS_CONFIG. Asegúrate de incluir openrouter-models.js antes de test-models.js</p>
            </div>
        `;
    }
});

/**
 * Inicializa la aplicación con los modelos cargados
 * @param {Object} config - Configuración de modelos
 */
function initApp(config) {
    // Elementos del DOM
    const modelsContainer = document.getElementById('models-container');
    const modelsCount = document.getElementById('models-count');
    const providerFilter = document.getElementById('provider-filter');
    const searchFilter = document.getElementById('search-filter');
    const capabilitiesFilters = document.getElementById('capabilities-filters');
    const viewToggle = document.getElementById('view-toggle');

    // Estado de la aplicación
    const state = {
        viewMode: 'grid', // 'grid' o 'list'
        filters: {
            provider: 'all',
            search: '',
            capabilities: []
        }
    };

    // Verificar si hay modelos disponibles
    if (!config || !config.models || config.models.length === 0) {
        modelsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-danger mb-3">
                    <i class="fas fa-exclamation-circle fa-3x"></i>
                </div>
                <h4>No se pudieron cargar los modelos</h4>
                <p>Verifica que el archivo openrouter-models.js esté correctamente configurado.</p>
            </div>
        `;
        return;
    }

    // Cargar modelos
    const models = config.models;

    // Actualizar contador de modelos
    modelsCount.textContent = `${models.length} modelos`;

    // Cargar proveedores únicos para el filtro
    const providers = [...new Set(models.map(model => model.provider))];
    providers.forEach(provider => {
        if (provider) {
            const option = document.createElement('option');
            option.value = provider.toLowerCase();
            option.textContent = provider;
            providerFilter.appendChild(option);
        }
    });

    // Cargar capacidades únicas para los filtros
    const allCapabilities = new Set();
    models.forEach(model => {
        if (model.capabilities && Array.isArray(model.capabilities)) {
            model.capabilities.forEach(cap => allCapabilities.add(cap));
        }
    });

    // Crear filtros de capacidades
    [...allCapabilities].sort().forEach(capability => {
        const capButton = document.createElement('button');
        capButton.className = 'btn btn-sm btn-outline-secondary';
        capButton.textContent = formatCapability(capability);
        capButton.dataset.capability = capability;
        capButton.addEventListener('click', function() {
            this.classList.toggle('active');

            // Actualizar filtros
            if (this.classList.contains('active')) {
                state.filters.capabilities.push(capability);
            } else {
                state.filters.capabilities = state.filters.capabilities.filter(cap => cap !== capability);
            }

            // Aplicar filtros
            applyFilters();
        });
        capabilitiesFilters.appendChild(capButton);
    });

    // Evento para cambiar el filtro de proveedor
    providerFilter.addEventListener('change', function() {
        state.filters.provider = this.value;
        applyFilters();
    });

    // Evento para buscar
    searchFilter.addEventListener('input', function() {
        state.filters.search = this.value.toLowerCase();
        applyFilters();
    });

    // Evento para cambiar la vista
    viewToggle.addEventListener('click', function() {
        if (state.viewMode === 'grid') {
            state.viewMode = 'list';
            this.innerHTML = '<i class="fas fa-th"></i>';
            modelsContainer.classList.add('list-view');
        } else {
            state.viewMode = 'grid';
            this.innerHTML = '<i class="fas fa-th-list"></i>';
            modelsContainer.classList.remove('list-view');
        }
    });

    // Renderizar modelos
    renderModels(models);

    /**
     * Renderiza los modelos en el contenedor
     * @param {Array} modelsToRender - Modelos a renderizar
     */
    function renderModels(modelsToRender) {
        // Limpiar contenedor
        modelsContainer.innerHTML = '';

        if (modelsToRender.length === 0) {
            modelsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="text-muted mb-3">
                        <i class="fas fa-search fa-3x"></i>
                    </div>
                    <h4>No se encontraron modelos</h4>
                    <p>Intenta con otros filtros.</p>
                </div>
            `;
            return;
        }

        // Renderizar cada modelo
        modelsToRender.forEach(model => {
            const modelCard = document.createElement('div');
            modelCard.className = state.viewMode === 'grid' ? 'col-md-6 col-lg-4 mb-4' : 'col-12 mb-3';

            // Formatear capacidades
            const capabilitiesHtml = model.capabilities && model.capabilities.length > 0 ?
                model.capabilities.map(cap => `<span class="capability-badge">${formatCapability(cap)}</span>`).join('') :
                '<span class="text-muted">No se especifican capacidades</span>';

            modelCard.innerHTML = `
                <div class="model-card h-100">
                    <div class="model-provider">${model.provider || 'Desconocido'}</div>
                    <h5 class="mt-2 mb-1">${model.name || model.id}</h5>
                    <div class="text-muted small mb-2">${model.id}</div>
                    <div class="mb-2">
                        <strong>Especialidad:</strong> ${model.specialty || 'General'}
                    </div>
                    <div>
                        <strong>Capacidades:</strong>
                        <div class="model-capabilities">
                            ${capabilitiesHtml}
                        </div>
                    </div>
                </div>
            `;

            modelsContainer.appendChild(modelCard);
        });
    }

    /**
     * Aplica los filtros a los modelos
     */
    function applyFilters() {
        let filteredModels = [...models];

        // Filtrar por proveedor
        if (state.filters.provider !== 'all') {
            filteredModels = filteredModels.filter(model =>
                model.provider && model.provider.toLowerCase() === state.filters.provider
            );
        }

        // Filtrar por búsqueda
        if (state.filters.search) {
            filteredModels = filteredModels.filter(model =>
                (model.name && model.name.toLowerCase().includes(state.filters.search)) ||
                (model.id && model.id.toLowerCase().includes(state.filters.search)) ||
                (model.specialty && model.specialty.toLowerCase().includes(state.filters.search))
            );
        }

        // Filtrar por capacidades
        if (state.filters.capabilities.length > 0) {
            filteredModels = filteredModels.filter(model =>
                model.capabilities && state.filters.capabilities.every(cap =>
                    model.capabilities.includes(cap)
                )
            );
        }

        // Actualizar contador
        modelsCount.textContent = `${filteredModels.length} de ${models.length} modelos`;

        // Renderizar modelos filtrados
        renderModels(filteredModels);
    }

    /**
     * Formatea una capacidad para mostrarla
     * @param {string} capability - Capacidad a formatear
     * @returns {string} - Capacidad formateada
     */
    function formatCapability(capability) {
        return capability
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
}
