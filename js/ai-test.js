/**
 * MARDUK ECOSYSTEM - PRUEBA DE MODELOS DE IA
 *
 * Este archivo contiene la lógica para la página de prueba de modelos de IA,
 * permitiendo al usuario seleccionar diferentes modelos de OpenRouter y
 * probar su funcionamiento en un chat interactivo.
 */

// Variables globales
let currentModel = null;
let chatHistory = [];

// Elementos del DOM
const modelSelector = document.getElementById('model-selector');
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const clearChatBtn = document.getElementById('clear-chat-btn');
const selectedModelName = document.getElementById('selected-model-name');
const selectedModelProvider = document.getElementById('selected-model-provider');
const modelInfo = document.getElementById('model-info');

// La configuración de modelos se carga desde openrouter-models.js en el HTML

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Configurar eventos primero para que el formulario de API key funcione
        setupEventListeners();

        // Cargar API key guardada
        loadSavedApiKey();

        // Mostrar mensaje de carga
        Swal.fire({
            title: 'Cargando modelos...',
            text: 'Inicializando',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Verificar si hay una API key válida
        const apiKeyValid = await checkApiKey();

        // Cerrar mensaje de carga
        Swal.close();

        // Cargar modelos desde OpenRouter (esta función ya maneja el caso de API key no válida)
        const models = await loadModelsFromService();

        // Mostrar mensaje solo si no se pudieron cargar modelos desde la API
        if (models.source === 'local') {
            showApiKeyMissingMessage();
        } else {
            showToast('Conectado a OpenRouter', 'success');
        }

        // Mostrar mensaje de bienvenida
        showToast('Bienvenido a la prueba de modelos de IA', 'info');
    } catch (error) {
        console.error('Error al inicializar la página de prueba:', error);

        // Cerrar mensaje de carga si está abierto
        Swal.close();

        // Cargar modelos desde la configuración estática como fallback
        loadModelsFromConfig();

        // Mostrar error
        showToast('Error al inicializar. Usando configuración local.', 'warning');
    }
});

/**
 * Verifica si la API key está configurada y es válida
 * @returns {Promise<boolean>} - Promesa que se resuelve con true si la API key es válida
 */
async function checkApiKey() {
    try {
        // Esperar a que se carguen las variables de entorno
        await waitForEnvVariables();

        // Intentar obtener la API key de diferentes fuentes
        let apiKey;

        // 1. Verificar si hay una API key en las variables de entorno
        if (window.ENV && window.ENV.OPENROUTER_API_KEY && window.ENV.OPENROUTER_API_KEY !== 'DEMO_MODE') {
            apiKey = window.ENV.OPENROUTER_API_KEY;
            console.log('Usando API key de variables de entorno para verificación');
        }
        // 2. Verificar si hay una API key en localStorage
        else if (localStorage.getItem('OPENROUTER_API_KEY')) {
            apiKey = localStorage.getItem('OPENROUTER_API_KEY');
            console.log('Usando API key de localStorage para verificación');
        }

        // Verificar si la API key existe y no es la predeterminada
        if (!apiKey || apiKey === 'demo' || apiKey === 'tu-api-key-aquí') {
            return false;
        }

        // Hacer una solicitud de prueba a OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Marduk Ecosystem'
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Error al verificar API key:', error);
        return false;
    }
}

/**
 * Espera a que se carguen las variables de entorno
 * @returns {Promise<void>} - Promesa que se resuelve cuando las variables de entorno están cargadas
 */
async function waitForEnvVariables() {
    return new Promise(resolve => {
        // Verificar si ENV ya está disponible y tiene una API key válida
        if (window.ENV && window.ENV.OPENROUTER_API_KEY &&
            window.ENV.OPENROUTER_API_KEY !== 'demo' &&
            window.ENV.OPENROUTER_API_KEY !== 'tu-api-key-aquí') {
            console.log('Variables de entorno ya cargadas con API key válida');
            showApiKeyFoundMessage();
            resolve();
            return;
        }

        // Si no está disponible, esperar a que se cargue
        console.log('Esperando a que se carguen las variables de entorno...');

        // Intentar cargar manualmente si está disponible la función
        if (typeof window.loadEnvVariables === 'function') {
            window.loadEnvVariables().then(() => {
                if (window.ENV && window.ENV.OPENROUTER_API_KEY &&
                    window.ENV.OPENROUTER_API_KEY !== 'demo' &&
                    window.ENV.OPENROUTER_API_KEY !== 'tu-api-key-aquí') {
                    console.log('Variables de entorno cargadas manualmente con API key válida');
                    showApiKeyFoundMessage();
                } else {
                    console.log('Variables de entorno cargadas manualmente, pero sin API key válida');
                }
                resolve();
            }).catch(error => {
                console.error('Error al cargar variables de entorno:', error);
                resolve(); // Resolver de todos modos para continuar
            });
        } else {
            // Esperar a que ENV esté disponible (máximo 5 segundos)
            let attempts = 0;
            const maxAttempts = 10; // 10 intentos * 500ms = 5 segundos

            const checkEnv = () => {
                attempts++;

                if (window.ENV && window.ENV.OPENROUTER_API_KEY &&
                    window.ENV.OPENROUTER_API_KEY !== 'demo' &&
                    window.ENV.OPENROUTER_API_KEY !== 'tu-api-key-aquí') {
                    console.log(`Variables de entorno detectadas con API key válida (intento ${attempts})`);
                    showApiKeyFoundMessage();
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.log(`Tiempo de espera agotado después de ${attempts} intentos. Continuando sin API key válida.`);
                    resolve();
                } else {
                    console.log(`Esperando variables de entorno... (intento ${attempts}/${maxAttempts})`);
                    setTimeout(checkEnv, 500);
                }
            };
            checkEnv();
        }
    });
}

/**
 * Muestra un mensaje indicando que la API key no está configurada
 */
function showApiKeyMissingMessage() {
    // Eliminar mensaje anterior si existe
    const existingMessage = document.querySelector('.api-key-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const apiKeyMessage = document.createElement('div');
    apiKeyMessage.className = 'alert alert-warning mt-3 api-key-message';
    apiKeyMessage.innerHTML = `
        <h5><i class="fas fa-exclamation-triangle me-2"></i> API Key no configurada</h5>
        <p>No se ha detectado una API key válida para OpenRouter. Actualmente se están usando modelos locales.</p>
        <p>Para usar modelos reales de IA, ingresa tu API key en el formulario de configuración o configura el archivo .env.</p>
    `;

    // Insertar mensaje antes del contenedor de chat
    const chatCard = document.querySelector('.card:has(#chat-container)');
    if (chatCard) {
        chatCard.parentNode.insertBefore(apiKeyMessage, chatCard);
    }
}

/**
 * Muestra un mensaje indicando que la API key se ha cargado correctamente
 */
function showApiKeyFoundMessage() {
    // Eliminar mensaje anterior si existe
    const existingMessage = document.querySelector('.api-key-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const apiKeyMessage = document.createElement('div');
    apiKeyMessage.className = 'alert alert-success mt-3 api-key-message';
    apiKeyMessage.innerHTML = `
        <h5><i class="fas fa-check-circle me-2"></i> API Key configurada correctamente</h5>
        <p>Se ha detectado una API key válida para OpenRouter desde el archivo .env o variables de entorno.</p>
        <p>Se están cargando modelos reales desde la API de OpenRouter.</p>
    `;

    // Insertar mensaje antes del contenedor de chat
    const chatCard = document.querySelector('.card:has(#chat-container)');
    if (chatCard) {
        chatCard.parentNode.insertBefore(apiKeyMessage, chatCard);
    }
}

/**
 * Carga la API key guardada en el formulario
 */
function loadSavedApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    if (!apiKeyInput) return;

    // Obtener API key guardada
    const savedApiKey = localStorage.getItem('OPENROUTER_API_KEY');
    if (savedApiKey && savedApiKey !== 'demo' && savedApiKey !== 'tu-api-key-aquí') {
        // Mostrar parte de la API key por seguridad
        const maskedKey = savedApiKey.substring(0, 4) + '...' + savedApiKey.substring(savedApiKey.length - 4);
        apiKeyInput.value = maskedKey;
        apiKeyInput.setAttribute('data-has-key', 'true');

        // Añadir botón para usar la API key completa
        const formText = apiKeyInput.parentNode.nextElementSibling;
        if (formText) {
            formText.innerHTML += `<br><span class="text-success">API key guardada. <button type="button" class="btn btn-link btn-sm p-0" id="use-saved-key">Usar clave guardada</button></span>`;

            // Añadir evento al botón
            const useSavedKeyBtn = document.getElementById('use-saved-key');
            if (useSavedKeyBtn) {
                useSavedKeyBtn.addEventListener('click', function() {
                    // Actualizar la API key en el servicio si está disponible
                    if (window.openRouterService && window.openRouterService.config) {
                        window.openRouterService.config.apiKey = savedApiKey;
                        showToast('Usando API key guardada', 'success');

                        // Intentar inicializar OpenRouter
                        initializeOpenRouterInBackground();
                    }
                });
            }
        }
    }
}

/**
 * Carga los modelos desde openrouter-models.js o una lista predefinida
 */
async function loadModelsFromService() {
    try {
        // Obtener API key desde localStorage o desde .env
        let apiKey = '';

        // Esperar a que se carguen las variables de entorno
        await waitForEnvVariables();

        // 1. Verificar si hay una API key en las variables de entorno
        if (window.ENV && window.ENV.OPENROUTER_API_KEY && window.ENV.OPENROUTER_API_KEY !== 'DEMO_MODE') {
            apiKey = window.ENV.OPENROUTER_API_KEY;
            console.log('Usando API key de variables de entorno para el chat');
        }
        // 2. Verificar si hay una API key en localStorage
        else if (localStorage.getItem('OPENROUTER_API_KEY')) {
            apiKey = localStorage.getItem('OPENROUTER_API_KEY');
            console.log('Usando API key de localStorage para el chat');
        }

        // Si no hay API key válida, cargar modelos locales directamente
        if (!apiKey || apiKey === 'demo' || apiKey === 'tu-api-key-aquí') {
            console.log('No se encontró API key válida, cargando modelos locales');
            showToast('Usando modelos locales', 'info');
            const localModelsResult = loadModelsFromConfig();
            return { models: localModelsResult, source: 'local' };
        }

        // Mostrar indicador de carga
        Swal.fire({
            title: 'Cargando modelos...',
            text: 'Obteniendo modelos disponibles',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Esperar un momento para asegurarnos de que OPENROUTER_MODELS_CONFIG esté cargado
        await new Promise(resolve => setTimeout(resolve, 500));

        let localModels = [];
        let apiModels = [];

        // Verificar si tenemos una API key válida
        if (apiKey && apiKey !== 'demo' && apiKey !== 'tu-api-key-aquí') {
            try {
                console.log('Cargando modelos desde la API de OpenRouter...');

                // Hacer solicitud a la API
                const response = await fetch('https://openrouter.ai/api/v1/models', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Marduk Ecosystem'
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.data && Array.isArray(data.data)) {
                        // Filtrar solo modelos gratuitos y de OpenRouter
                        apiModels = data.data.filter(model => {
                            // Verificar si el modelo es gratuito
                            const isFree = model.id.includes(':free') || (model.context_length_free && model.context_length_free > 0);

                            // Verificar si el modelo es de OpenRouter
                            const isOpenRouter = model.id.startsWith('openrouter/');

                            // Incluir el modelo si es gratuito o de OpenRouter
                            return isFree || isOpenRouter;
                        }).map(model => ({
                            id: model.id,
                            name: model.name || model.id.split('/').pop(),
                            provider: model.id.split('/')[0] || 'Desconocido',
                            specialty: getModelSpecialty(model),
                            capabilities: getModelCapabilities(model),
                            context_length: model.context_length,
                            context_length_free: model.context_length_free,
                            pricing: {
                                prompt: model.pricing?.prompt,
                                completion: model.pricing?.completion
                            },
                            description: model.description || null,
                            version: model.version || null,
                            source: 'api'
                        }));

                        showToast(`${apiModels.length} modelos gratuitos y de OpenRouter cargados`, 'success');
                        console.log(`Se filtraron solo modelos gratuitos y de OpenRouter: ${apiModels.length} de ${data.data.length} modelos disponibles`);
                    }
                } else {
                    console.error('Error al cargar modelos desde la API:', response.status);
                    // Si hay un error con la API, cargar modelos locales como fallback
                    localModels = loadLocalModels();
                }
            } catch (error) {
                console.error('Error al cargar modelos desde la API:', error);
                // Si hay un error con la API, cargar modelos locales como fallback
                localModels = loadLocalModels();
            }
        } else {
            // Si no hay API key válida, cargar modelos locales
            localModels = loadLocalModels();
        }

        // Si tenemos modelos de la API, usar solo esos
        // Si no, usar los modelos locales
        let models;
        let source;

        if (apiModels.length > 0) {
            models = apiModels;
            source = 'api';
        } else {
            models = localModels;
            source = 'local';
        }

        // Cerrar indicador de carga
        Swal.close();

        // Cargar modelos
        loadModelsToUI(models);

        // Seleccionar modelo por defecto (el primero de la lista o Optimus Alpha si está disponible)
        if (models.length > 0) {
            const defaultModel = models.find(m => m.id === 'openrouter/optimus-alpha') || models[0];
            selectModel(defaultModel);
        }

        // Mostrar notificación de éxito
        if (source === 'api') {
            showToast(`Se cargaron ${models.length} modelos gratuitos y de OpenRouter`, 'success');
        } else {
            showToast(`Se cargaron ${models.length} modelos locales`, 'success');
        }

        // Devolver los modelos con información sobre su fuente
        return { models, source };
    } catch (error) {
        console.error('Error al cargar modelos desde OpenRouter:', error);
        showToast('Error al cargar modelos: ' + error.message, 'error');

        // Cerrar indicador de carga si está abierto
        Swal.close();

        // Cargar modelos desde la configuración como fallback
        const models = loadModelsFromConfig();
        return { models, source: 'local' };
    }
}

/**
 * Carga modelos locales desde la configuración
 * @returns {Array} - Lista de modelos locales
 */
function loadLocalModels() {
    // Verificar si OPENROUTER_MODELS_CONFIG está disponible
    if (window.OPENROUTER_MODELS_CONFIG && window.OPENROUTER_MODELS_CONFIG.models) {
        console.log('Cargando modelos desde OPENROUTER_MODELS_CONFIG');

        // Filtrar solo modelos gratuitos o los que queremos mostrar
        const localModels = window.OPENROUTER_MODELS_CONFIG.models.filter(model =>
            model.id.includes(':free') || // Modelos gratuitos
            model.id.startsWith('openrouter/') || // Modelos de OpenRouter
            ['anthropic/claude-3-haiku:beta', 'anthropic/claude-3-sonnet:beta', 'anthropic/claude-3-opus:beta'].includes(model.id) // Modelos específicos
        ).map(model => ({...model, source: 'local'}));

        showToast(`${localModels.length} modelos locales cargados`, 'success');
        return localModels;
    } else {
        console.log('OPENROUTER_MODELS_CONFIG no disponible, usando modelos predefinidos');

        // Lista predefinida de modelos
        return [
            {
                id: "openrouter/optimus-alpha",
                name: "Optimus Alpha",
                provider: "OpenRouter",
                specialty: "general",
                capabilities: ["advanced_reasoning", "multi_task", "multilingual_support"],
                source: "local"
            },
            {
                id: "openrouter/quasar-alpha",
                name: "Quasar Alpha",
                provider: "OpenRouter",
                specialty: "general",
                capabilities: ["advanced_reasoning", "multi_task", "multilingual_support"],
                source: "local"
            },
            {
                id: "anthropic/claude-3-haiku:beta",
                name: "Claude 3 Haiku",
                provider: "Anthropic",
                specialty: "general",
                capabilities: ["efficiency", "multi_task", "multilingual_support"],
                source: "local"
            }
        ];
    }
}

/**
 * Determina la especialidad de un modelo basado en sus metadatos
 * @param {Object} model - Datos del modelo
 * @returns {string} - Especialidad del modelo
 */
function getModelSpecialty(model) {
    const id = model.id.toLowerCase();

    if (id.includes('vision') || id.includes('vl') || id.includes('multimodal')) {
        return 'multimodal';
    } else if (id.includes('code') || id.includes('coder')) {
        return 'coding';
    } else if (id.includes('creative') || id.includes('qwerky')) {
        return 'creative';
    } else {
        return 'general';
    }
}

/**
 * Determina las capacidades de un modelo basado en sus metadatos
 * @param {Object} model - Datos del modelo
 * @returns {Array} - Lista de capacidades
 */
function getModelCapabilities(model) {
    const capabilities = [];
    const id = model.id.toLowerCase();

    // Capacidades basadas en el ID
    if (id.includes('vision') || id.includes('vl') || id.includes('multimodal')) {
        capabilities.push('vision_understanding');
    }

    if (id.includes('instruct')) {
        capabilities.push('instruction_optimized');
    }

    if (id.includes('code') || id.includes('coder')) {
        capabilities.push('code_generation');
    }

    // Capacidades basadas en el contexto
    if (model.context_length > 16000) {
        capabilities.push('large_context');
    }

    // Capacidades comunes
    capabilities.push('multi_task');
    capabilities.push('multilingual_support');

    return capabilities;
}

/**
 * Carga los modelos desde la configuración estática
 */
function loadModelsFromConfig() {
    try {
        // Obtener modelos de la configuración
        const models = OPENROUTER_MODELS_CONFIG.models;

        // Cargar modelos
        loadModelsToUI(models);

        // Seleccionar modelo por defecto
        const defaultModel = models.find(model => model.id === OPENROUTER_MODELS_CONFIG.default_model);
        if (defaultModel) {
            selectModel(defaultModel);
        } else if (models.length > 0) {
            selectModel(models[0]);
        }

        // Mostrar notificación
        showToast('Usando modelos de simulación. Configura tu API key para usar modelos reales.', 'warning');

        return models;
    } catch (error) {
        console.error('Error al cargar modelos desde la configuración:', error);
        showModelError();
        return [];
    }
}

/**
 * Carga los modelos en la interfaz de usuario
 * @param {Array|Object} modelsData - Lista de modelos o objeto con modelos y fuente
 */
function loadModelsToUI(modelsData) {
    // Manejar tanto arrays como objetos con { models, source }
    const models = Array.isArray(modelsData) ? modelsData : modelsData.models;

    // Limpiar selector
    modelSelector.innerHTML = '';

    // Verificar si hay modelos
    if (!models || models.length === 0) {
        showModelError('No hay modelos disponibles');
        return;
    }

    // Crear una lista simple para mostrar los modelos
    const modelList = document.createElement('div');
    modelList.className = 'list-group list-group-flush';
    modelSelector.appendChild(modelList);

    // Agregar modelos a la lista
    models.forEach(model => {
        const modelItem = document.createElement('button');
        modelItem.className = 'list-group-item list-group-item-action d-flex flex-column align-items-start p-3';
        modelItem.setAttribute('data-model-id', model.id);

        // Verificar si el modelo es gratuito
        const isFree = model.id.includes(':free');

        modelItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-center">
                <h6 class="mb-1">${model.name}</h6>
                ${isFree ? '<span class="badge bg-success">Gratis</span>' : ''}
            </div>
            <div class="d-flex w-100 justify-content-between align-items-center mt-1">
                <small class="text-muted">${model.provider}</small>
                <small class="text-muted">${model.specialty || 'General'}</small>
            </div>
        `;

        // Agregar evento de clic
        modelItem.addEventListener('click', () => {
            // Remover clase activa de todos los elementos
            document.querySelectorAll('.list-group-item').forEach(item => {
                item.classList.remove('active');
            });

            // Agregar clase activa al elemento seleccionado
            modelItem.classList.add('active');

            // Seleccionar modelo
            selectModel(model);
        });

        modelList.appendChild(modelItem);
    });
}

/**
 * Muestra un error en el selector de modelos
 * @param {string} message - Mensaje de error
 */
function showModelError(message = 'Error al cargar modelos') {
    modelSelector.innerHTML = `
        <div class="alert alert-danger m-3">
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
        </div>
    `;
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

/**
 * Selecciona un modelo
 * @param {Object} model - Modelo a seleccionar
 */
function selectModel(model) {
    // Actualizar modelo actual
    currentModel = model;

    // Actualizar UI de la tabla
    if ($('#models-table').length) {
        // Quitar selección anterior
        $('#models-table tbody tr').removeClass('table-primary');

        // Seleccionar fila actual
        $(`#models-table tbody tr[data-model-id="${model.id}"]`).addClass('table-primary');
    }

    // Actualizar información del modelo seleccionado
    selectedModelName.textContent = model.name;
    selectedModelProvider.textContent = model.provider;

    // Actualizar información detallada del modelo
    updateModelInfo(model);

    // Cambiar modelo en OpenRouter si está disponible
    if (window.openRouterService && typeof window.openRouterService.setModel === 'function') {
        window.openRouterService.setModel(model.id);
    }

    // Añadir mensaje de sistema
    addSystemMessage(`Modelo seleccionado: ${model.name} de ${model.provider}`);

    // Mostrar notificación
    showToast(`Modelo seleccionado: ${model.name}`, 'success');
}

/**
 * Actualiza la información detallada del modelo
 * @param {Object} model - Modelo seleccionado
 */
function updateModelInfo(model) {
    // Verificar si el modelo es gratuito
    const isFree = model.id.includes(':free') || (model.context_length_free && model.context_length_free > 0);
    const isOpenRouter = model.id.startsWith('openrouter/');

    let infoHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Información General</h5>
                    </div>
                    <div class="card-body">
                        <h5>${model.name}</h5>
                        <div class="badge-container mb-2">
                            ${isFree ? '<span class="badge bg-success me-1">Gratis</span>' : ''}
                            ${isOpenRouter ? '<span class="badge bg-primary me-1">OpenRouter</span>' : ''}
                            ${model.source === 'local' ? '<span class="badge bg-secondary me-1">Local</span>' : ''}
                            ${model.source === 'api' ? '<span class="badge bg-info me-1">API</span>' : ''}
                        </div>
                        <p><strong>Proveedor:</strong> ${model.provider}</p>
                        <p><strong>ID:</strong> <code>${model.id}</code></p>
                        <p><strong>Especialidad:</strong> ${model.specialty || 'General'}</p>
                        ${model.description ? `<p><strong>Descripción:</strong> ${model.description}</p>` : ''}
                        ${model.version ? `<p><strong>Versión:</strong> ${model.version}</p>` : ''}
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">Capacidades</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex flex-wrap gap-1 mb-3">
    `;

    // Añadir capacidades
    if (model.capabilities && model.capabilities.length > 0) {
        model.capabilities.forEach(capability => {
            infoHTML += `<span class="badge bg-info text-dark me-1 mb-1">${formatCapability(capability)}</span>`;
        });
    } else {
        infoHTML += `<span class="text-muted">No hay información de capacidades disponible</span>`;
    }

    infoHTML += `
                        </div>
                    </div>
                </div>
    `;

    // Añadir información de contexto si está disponible
    if (model.context_length) {
        infoHTML += `
                <div class="card mb-3">
                    <div class="card-header bg-warning text-dark">
                        <h5 class="mb-0">Contexto</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Longitud de contexto:</strong> ${model.context_length.toLocaleString()} tokens</li>
                        ${model.context_length_free ? `<li class="list-group-item"><strong>Longitud gratuita:</strong> ${model.context_length_free.toLocaleString()} tokens</li>` : ''}
                    </ul>
                </div>
        `;
    }

    infoHTML += `
            </div>
        </div>
    `;

    // Añadir información de precios si está disponible
    if (model.pricing && (model.pricing.prompt || model.pricing.completion)) {
        infoHTML += `
            <div class="card mb-3">
                <div class="card-header bg-danger text-white">
                    <h5 class="mb-0">Precios</h5>
                </div>
                <ul class="list-group list-group-flush">
                    ${model.pricing.prompt ? `<li class="list-group-item"><strong>Prompt:</strong> $${model.pricing.prompt} por 1M tokens</li>` : ''}
                    ${model.pricing.completion ? `<li class="list-group-item"><strong>Completion:</strong> $${model.pricing.completion} por 1M tokens</li>` : ''}
                    ${isFree ? `<li class="list-group-item"><strong>Uso gratuito:</strong> <span class="badge bg-success">Disponible</span></li>` : ''}
                </ul>
            </div>
        `;
    }

    // Añadir tipos de prompt si están disponibles
    if (model.prompt_types && model.prompt_types.length > 0) {
        infoHTML += `
            <div class="card mb-3">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">Tipos de prompt recomendados</h5>
                </div>
                <div class="card-body">
                    <div class="d-flex flex-wrap gap-1">
        `;

        model.prompt_types.forEach(type => {
            infoHTML += `<span class="badge bg-secondary me-1 mb-1">${formatCapability(type)}</span>`;
        });

        infoHTML += `
                    </div>
                </div>
            </div>
        `;
    }

    // Añadir sugerencias de uso
    infoHTML += `
        <div class="card mb-3">
            <div class="card-header bg-dark text-white">
                <h5 class="mb-0">Sugerencias de uso</h5>
            </div>
            <div class="card-body">
                <ul class="mb-0">
    `;

    // Generar sugerencias basadas en la especialidad y capacidades
    const suggestions = generateSuggestions(model);
    suggestions.forEach(suggestion => {
        infoHTML += `<li>${suggestion}</li>`;
    });

    infoHTML += `
                </ul>
            </div>
        </div>
    `;

    // Añadir información de uso en la API
    infoHTML += `
        <div class="card mb-3">
            <div class="card-header bg-secondary text-white">
                <h5 class="mb-0">Uso en la API</h5>
            </div>
            <div class="card-body">
                <p>Para usar este modelo en tu aplicación, puedes hacer una solicitud a la API de OpenRouter con el siguiente ID:</p>
                <div class="bg-light p-2 rounded">
                    <code>${model.id}</code>
                </div>
                <p class="mt-2 mb-0">Consulta la <a href="https://openrouter.ai/docs" target="_blank">documentación de OpenRouter</a> para más información.</p>
            </div>
        </div>
    `;

    // Actualizar contenido
    modelInfo.innerHTML = infoHTML;
}

/**
 * Determina la especialidad del modelo basado en sus características
 * @param {Object} model - Modelo de la API
 * @returns {string} - Especialidad del modelo
 */
function getModelSpecialty(model) {
    // Verificar si el modelo admite imágenes
    if (model.multimodal) {
        return 'multimodal';
    }

    // Verificar si el modelo es especializado en código
    if (model.id.toLowerCase().includes('code') || model.id.toLowerCase().includes('coder')) {
        return 'coding';
    }

    // Verificar si el modelo es creativo
    if (model.id.toLowerCase().includes('creative') || model.id.toLowerCase().includes('story')) {
        return 'creative';
    }

    // Por defecto, es un modelo general
    return 'general';
}

/**
 * Determina las capacidades del modelo basado en sus características
 * @param {Object} model - Modelo de la API
 * @returns {Array} - Capacidades del modelo
 */
function getModelCapabilities(model) {
    const capabilities = [];

    // Verificar capacidades basadas en características del modelo
    if (model.multimodal) {
        capabilities.push('vision_understanding');
        capabilities.push('image_reasoning');
    }

    if (model.context_length > 16000) {
        capabilities.push('large_context');
    }

    if (model.context_length_free > 0) {
        capabilities.push('free_tier_available');
    }

    // Añadir capacidades basadas en el ID del modelo
    if (model.id.includes('instruct')) {
        capabilities.push('instruction_optimized');
    }

    if (model.id.toLowerCase().includes('code') || model.id.toLowerCase().includes('coder')) {
        capabilities.push('code_generation');
    }

    // Añadir capacidades basadas en el proveedor
    if (model.id.startsWith('anthropic/')) {
        capabilities.push('advanced_reasoning');
        capabilities.push('multilingual_support');
    }

    if (model.id.startsWith('google/')) {
        capabilities.push('multilingual_support');
    }

    if (model.id.startsWith('openai/')) {
        capabilities.push('advanced_reasoning');
    }

    if (model.id.startsWith('meta-llama/')) {
        capabilities.push('multilingual_support');
    }

    if (model.id.startsWith('openrouter/')) {
        capabilities.push('proprietary_architecture');
    }

    return capabilities;
}

/**
 * Genera sugerencias de uso basadas en el modelo
 * @param {Object} model - Modelo seleccionado
 * @returns {Array} - Lista de sugerencias
 */
function generateSuggestions(model) {
    const suggestions = [];

    // Sugerencias basadas en la especialidad
    switch (model.specialty) {
        case 'general':
            suggestions.push('Ideal para consultas generales y conversaciones variadas.');
            suggestions.push('Prueba con preguntas sobre temas jurídicos, históricos o conceptuales.');
            break;
        case 'multimodal':
            suggestions.push('Puede procesar y razonar sobre imágenes (aunque esta demo no incluye esa funcionalidad).');
            suggestions.push('Prueba con descripciones detalladas de escenarios visuales.');
            break;
        case 'coding':
            suggestions.push('Especializado en generación y explicación de código.');
            suggestions.push('Prueba con preguntas sobre algoritmos, depuración o arquitectura de software.');
            break;
        case 'creative':
            suggestions.push('Optimizado para escritura creativa y generación de contenido.');
            suggestions.push('Prueba con solicitudes de historias, poemas o contenido creativo.');
            break;
    }

    // Sugerencias basadas en capacidades
    if (model.capabilities) {
        if (model.capabilities.includes('advanced_reasoning')) {
            suggestions.push('Capaz de razonamiento avanzado para problemas complejos.');
        }

        if (model.capabilities.includes('multilingual_support')) {
            suggestions.push('Soporta múltiples idiomas. Prueba con consultas en diferentes idiomas.');
        }

        if (model.capabilities.includes('code_generation')) {
            suggestions.push('Puede generar código en diferentes lenguajes de programación.');
        }
    }

    // Si no hay sugerencias específicas, añadir genéricas
    if (suggestions.length === 0) {
        suggestions.push('Prueba con preguntas relacionadas con el ámbito jurídico.');
        suggestions.push('Experimenta con diferentes tipos de consultas para evaluar sus capacidades.');
    }

    return suggestions;
}

/**
 * Configura los listeners de eventos
 */
function setupEventListeners() {
    // Enviar mensaje
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const message = userInput.value.trim();
        if (!message) return;

        // Limpiar input
        userInput.value = '';

        // Verificar si hay un modelo seleccionado
        if (!currentModel) {
            showToast('Por favor, selecciona un modelo primero', 'warning');
            return;
        }

        // Añadir mensaje del usuario
        addUserMessage(message);

        // Mostrar indicador de escritura
        showTypingIndicator();

        try {
            let response;

            // Obtener API key
            // Intentar obtener la API key de diferentes fuentes (en orden de prioridad)
            let apiKey = '';

            // Esperar a que se carguen las variables de entorno
            await waitForEnvVariables();

            // 1. Verificar si hay una API key en las variables de entorno
            if (window.ENV && window.ENV.OPENROUTER_API_KEY && window.ENV.OPENROUTER_API_KEY !== 'DEMO_MODE') {
                apiKey = window.ENV.OPENROUTER_API_KEY;
                console.log('Usando API key de variables de entorno para el chat');
            }
            // 2. Verificar si hay una API key en localStorage
            else if (localStorage.getItem('OPENROUTER_API_KEY')) {
                apiKey = localStorage.getItem('OPENROUTER_API_KEY');
                console.log('Usando API key de localStorage para el chat');
            }

            if (apiKey && apiKey !== 'demo' && apiKey !== 'tu-api-key-aquí') {
                // Usar directamente la API de OpenRouter
                const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Marduk Ecosystem',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: currentModel.id || 'openrouter/optimus-alpha', // Usar Optimus Alpha como fallback
                        messages: [
                            {
                                role: 'system',
                                content: 'Eres un asistente útil especializado en temas jurídicos y legales. Responde de manera clara, precisa y profesional.'
                            },
                            ...chatHistory, // Incluir historial de chat para mantener contexto
                            {
                                role: 'user',
                                content: message
                            }
                        ],
                        max_tokens: 1000,
                        temperature: 0.7
                    })
                });

                if (!openRouterResponse.ok) {
                    const errorData = await openRouterResponse.json().catch(() => ({}));
                    console.error('Error de OpenRouter:', errorData);

                    // Manejar error 401 (No autorizado) de forma especial
                    if (openRouterResponse.status === 401) {
                        console.log('Error de autenticación. Usando modo de demostración.');
                        // Usar respuesta simulada
                        response = "Estoy funcionando en modo de demostración debido a un problema con la API key. Por favor, contacta al administrador para obtener una API key válida. Mientras tanto, puedo simular respuestas básicas.\n\nEn respuesta a tu mensaje: " + message + "\n\nComo asistente virtual de Marduk, puedo proporcionarte información general sobre temas jurídicos, pero recuerda que estoy en modo de demostración y mis capacidades son limitadas.";

                        // Guardar mensaje en el historial
                        chatHistory.push({ role: 'user', content: message });
                        chatHistory.push({ role: 'assistant', content: response });

                        return response;
                    } else {
                        throw new Error(`Error en la API de OpenRouter: ${openRouterResponse.status} - ${errorData.error?.message || 'Error desconocido'}`);
                    }
                }

                const data = await openRouterResponse.json();
                response = data.choices[0].message.content;

                // Guardar mensaje en el historial
                chatHistory.push({ role: 'user', content: message });
                chatHistory.push({ role: 'assistant', content: response });
            } else {
                // Simular respuesta si no hay API key válida
                await simulateAIResponse();
                response = generateSimulatedResponse(message, currentModel);

                // Mostrar alerta para configurar API key
                if (!document.querySelector('.api-key-alert')) {
                    const apiKeyAlert = document.createElement('div');
                    apiKeyAlert.className = 'alert alert-warning mt-3 api-key-alert';
                    apiKeyAlert.innerHTML = `
                        <h5><i class="fas fa-exclamation-triangle me-2"></i> Modo simulación</h5>
                        <p>Estás usando el modo de simulación porque no hay una API key válida configurada.</p>
                        <p>Para usar modelos reales de OpenRouter, configura tu API key en la sección de configuración.</p>
                        <button class="btn btn-primary btn-sm" id="configure-api-key-btn">Configurar API Key</button>
                    `;

                    // Insertar alerta antes del contenedor de chat
                    const chatCard = document.querySelector('.card:has(#chat-container)');
                    if (chatCard) {
                        chatCard.parentNode.insertBefore(apiKeyAlert, chatCard);

                        // Agregar evento al botón
                        document.getElementById('configure-api-key-btn').addEventListener('click', function() {
                            // Mostrar modal para configurar API key
                            Swal.fire({
                                title: 'Configurar API Key',
                                html: `
                                    <p>Ingresa tu API key de OpenRouter para usar modelos reales de IA.</p>
                                    <p>Puedes obtener una en <a href="https://openrouter.ai" target="_blank">OpenRouter.ai</a></p>
                                    <div class="mb-3">
                                        <input type="password" id="swal-api-key" class="swal2-input" placeholder="Ingresa tu API key">
                                    </div>
                                `,
                                showCancelButton: true,
                                confirmButtonText: 'Guardar',
                                cancelButtonText: 'Cancelar',
                                preConfirm: () => {
                                    const apiKey = document.getElementById('swal-api-key').value;
                                    if (!apiKey) {
                                        Swal.showValidationMessage('La API key es requerida');
                                        return false;
                                    }
                                    return apiKey;
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    localStorage.setItem('OPENROUTER_API_KEY', result.value);
                                    document.getElementById('api-key-input').value = result.value;
                                    showToast('API key guardada correctamente', 'success');

                                    // Recargar la página para aplicar cambios
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'API key guardada',
                                        text: 'La página se recargará para aplicar los cambios.',
                                        showCancelButton: false,
                                        confirmButtonText: 'Aceptar'
                                    }).then(() => {
                                        window.location.reload();
                                    });
                                }
                            });
                        });
                    }
                }
            }

            // Ocultar indicador de escritura
            hideTypingIndicator();

            // Añadir respuesta de la IA
            addAIMessage(response);
        } catch (error) {
            // Ocultar indicador de escritura
            hideTypingIndicator();

            // Mostrar error
            console.error('Error al generar respuesta:', error);
            addErrorMessage(`Error: ${error.message}`);
            showToast(`Error al procesar tu mensaje: ${error.message}`, 'error');

            // Mostrar notificación de error
            Swal.fire({
                icon: 'error',
                title: 'Error de comunicación',
                text: 'No se pudo obtener respuesta del modelo de IA. Verifica tu conexión o la API key.',
                confirmButtonText: 'Entendido'
            });
        }
    });

    // Limpiar chat
    clearChatBtn.addEventListener('click', function() {
        Swal.fire({
            title: '¿Limpiar chat?',
            text: 'Se eliminarán todos los mensajes del chat actual.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                clearChat();
                showToast('Chat limpiado', 'info');
            }
        });
    });

    // Formulario de API key
    const apiKeyForm = document.getElementById('api-key-form');
    if (apiKeyForm) {
        apiKeyForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const apiKeyInput = document.getElementById('api-key-input');
            const apiKey = apiKeyInput.value.trim();

            if (!apiKey) {
                showToast('Por favor, ingresa una API key válida', 'warning');
                return;
            }

            // Guardar API key en localStorage
            localStorage.setItem('OPENROUTER_API_KEY', apiKey);

            // Actualizar la API key en el servicio si está disponible
            if (window.openRouterService && window.openRouterService.config) {
                window.openRouterService.config.apiKey = apiKey;
            }

            // Mostrar notificación
            Swal.fire({
                icon: 'success',
                title: 'API key guardada',
                text: 'La API key se ha guardado correctamente. Recarga la página para aplicar los cambios.',
                confirmButtonText: 'Recargar ahora',
                showCancelButton: true,
                cancelButtonText: 'Más tarde'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        });
    }

    // Toggle para mostrar/ocultar API key
    const toggleApiKeyBtn = document.getElementById('toggle-api-key');
    if (toggleApiKeyBtn) {
        toggleApiKeyBtn.addEventListener('click', function() {
            const apiKeyInput = document.getElementById('api-key-input');
            const icon = this.querySelector('i');

            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                apiKeyInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }
}

/**
 * Añade un mensaje del usuario al chat
 * @param {string} message - Mensaje del usuario
 */
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <p>${escapeHTML(message)}</p>
        <div class="message-time">${getCurrentTime()}</div>
    `;

    chatContainer.appendChild(messageElement);
    scrollToBottom();

    // Añadir al historial
    chatHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });
}

/**
 * Añade un mensaje de la IA al chat
 * @param {string} message - Mensaje de la IA
 */
function addAIMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-message';

    // Renderizar markdown
    const renderedMessage = renderMarkdown(message);

    messageElement.innerHTML = `
        <div>${renderedMessage}</div>
        <div class="message-time">${getCurrentTime()}</div>
    `;

    chatContainer.appendChild(messageElement);
    scrollToBottom();

    // Resaltar código si hay bloques de código
    messageElement.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    // Añadir al historial
    chatHistory.push({
        role: 'assistant',
        content: message,
        timestamp: new Date().toISOString()
    });
}

/**
 * Añade un mensaje de sistema al chat
 * @param {string} message - Mensaje de sistema
 */
function addSystemMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'alert alert-info small text-center my-2';
    messageElement.textContent = message;

    chatContainer.appendChild(messageElement);
    scrollToBottom();
}

/**
 * Añade un mensaje de error al chat
 * @param {string} message - Mensaje de error
 */
function addErrorMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'alert alert-danger small text-center my-2';
    messageElement.textContent = message;

    chatContainer.appendChild(messageElement);
    scrollToBottom();
}

/**
 * Muestra el indicador de escritura
 */
function showTypingIndicator() {
    // Verificar si ya existe
    if (document.querySelector('.typing-indicator')) return;

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator ai-message';
    indicator.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    chatContainer.appendChild(indicator);
    scrollToBottom();
}

/**
 * Oculta el indicador de escritura
 */
function hideTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Limpia el chat
 */
function clearChat() {
    // Mantener solo el mensaje de bienvenida
    chatContainer.innerHTML = `
        <div class="message ai-message">
            <p>¡Hola! Soy un asistente de IA. Selecciona un modelo y escribe un mensaje para comenzar a conversar.</p>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;

    // Limpiar historial
    chatHistory = [];
}

/**
 * Desplaza el chat hacia abajo
 */
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Obtiene la hora actual formateada
 * @returns {string} - Hora actual formateada
 */
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Escapa caracteres HTML
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Renderiza texto en formato markdown
 * @param {string} text - Texto en formato markdown
 * @returns {string} - HTML renderizado
 */
function renderMarkdown(text) {
    // Configurar opciones de marked
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    });

    // Renderizar markdown
    return marked.parse(text);
}

/**
 * Simula una respuesta de IA con un retraso aleatorio
 * @returns {Promise} - Promesa que se resuelve después de un retraso
 */
async function simulateAIResponse() {
    // Simular tiempo de respuesta entre 1 y 3 segundos
    const delay = Math.floor(Math.random() * 2000) + 1000;
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Genera una respuesta simulada basada en el mensaje y el modelo
 * @param {string} message - Mensaje del usuario
 * @param {Object} model - Modelo seleccionado
 * @returns {string} - Respuesta simulada
 */
function generateSimulatedResponse(message, model) {
    // Respuestas predefinidas basadas en palabras clave
    const keywordResponses = {
        'hola': `Hola, soy una simulación del modelo ${model.name} de ${model.provider}. ¿En qué puedo ayudarte con temas jurídicos hoy?`,
        'ayuda': 'Puedo ayudarte con consultas sobre temas jurídicos, interpretación de leyes, procedimientos legales y más. ¿Qué necesitas saber?',
        'gracias': 'De nada. Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?',
        'código': '```python\ndef ejemplo_funcion():\n    print("Este es un ejemplo de código")\n    return True\n```\n\nEste es un ejemplo de código en Python. Puedo generar código en varios lenguajes de programación.',
        'ley': 'En el ámbito jurídico, las leyes son normas jurídicas que emanan del poder legislativo. Su interpretación y aplicación requiere un análisis detallado del contexto y la jurisprudencia relacionada.',
        'proceso': 'Los procesos judiciales tienen diferentes etapas y requisitos dependiendo de la jurisdicción y el tipo de caso. Es importante contar con asesoría legal adecuada para navegar estos procedimientos.',
        'derecho': 'El derecho es el conjunto de normas que regulan la conducta humana en sociedad. Se divide en diferentes ramas como derecho civil, penal, administrativo, laboral, entre otros.',
        'contrato': 'Los contratos son acuerdos de voluntades que generan derechos y obligaciones. Para su validez, generalmente requieren capacidad legal, consentimiento, objeto lícito y causa lícita.',
        'juez': 'Los jueces son funcionarios públicos encargados de administrar justicia. Su función principal es resolver los conflictos mediante la aplicación de las leyes y el derecho.',
        'abogado': 'Los abogados son profesionales del derecho que asesoran y representan a sus clientes en asuntos legales. Su labor es fundamental para garantizar el acceso a la justicia.'
    };

    // Buscar coincidencias con palabras clave
    for (const keyword in keywordResponses) {
        if (message.toLowerCase().includes(keyword)) {
            return keywordResponses[keyword];
        }
    }

    // Respuesta genérica si no hay coincidencias
    return `Esta es una respuesta simulada del modelo ${model.name} de ${model.provider}. \n\nActualmente estoy funcionando en modo de simulación porque no hay conexión con la API de OpenRouter. \n\nPara obtener respuestas reales, asegúrate de configurar correctamente la API key en el archivo .env y verificar tu conexión a internet.`;
}
