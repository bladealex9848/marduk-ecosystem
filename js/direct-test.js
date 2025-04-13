/**
 * MARDUK ECOSYSTEM - PRUEBA DIRECTA DE API DE OPENROUTER
 *
 * Este archivo contiene la lógica para probar directamente la API de OpenRouter
 * con diferentes modelos.
 */

// Verificar si OPENROUTER_MODELS_CONFIG está definido globalmente
console.log('Modelos cargados en direct-test.js:', typeof OPENROUTER_MODELS_CONFIG !== 'undefined' ? 'Sí' : 'No');

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const directTestForm = document.getElementById('direct-test-form');
    const directApiKey = document.getElementById('direct-api-key');
    const directApiKeyContainer = document.getElementById('direct-api-key-container');
    const directModelSelect = document.getElementById('direct-model-select');
    const directModel = document.getElementById('direct-model');
    const directMessage = document.getElementById('direct-message');
    const directTestBtn = document.getElementById('direct-test-btn');
    const directTestResult = document.getElementById('direct-test-result');
    const directTestResponse = document.getElementById('direct-test-response');
    const toggleDirectApiKey = document.getElementById('toggle-direct-api-key');

    // Verificar que todos los elementos existen
    if (!directTestForm || !directApiKey || !directModelSelect || !directModel || !directMessage ||
        !directTestBtn || !directTestResult || !directTestResponse || !toggleDirectApiKey) {
        console.error('No se encontraron todos los elementos necesarios para la prueba directa');
        return;
    }

    // Mostrar indicador de carga en el select
    directModelSelect.innerHTML = '<option value="" disabled selected>Cargando modelos...</option>';

    // Verificar si hay una API key en las variables de entorno
    let envApiKey = '';

    // Esperar a que se carguen las variables de entorno (si están disponibles)
    setTimeout(() => {
        // Verificar si window.ENV existe y contiene OPENROUTER_API_KEY
        if (window.ENV && window.ENV.OPENROUTER_API_KEY) {
            envApiKey = window.ENV.OPENROUTER_API_KEY;
            console.log('API key encontrada en variables de entorno');

            // Ocultar el campo de API key si hay una clave válida en .env
            if (directApiKeyContainer) {
                directApiKeyContainer.innerHTML = `
                    <div class="alert alert-success mb-3">
                        <i class="fas fa-check-circle me-2"></i> API key configurada desde variables de entorno
                    </div>
                    <input type="hidden" id="direct-api-key" value="${envApiKey}">
                `;
            } else {
                // Si no se encuentra el contenedor, simplemente establecer el valor
                directApiKey.value = envApiKey;
            }
        } else {
            console.log('No se encontró API key en variables de entorno');
        }
    }, 500); // Esperar 500ms para que se carguen las variables de entorno

    // Verificar si OPENROUTER_MODELS_CONFIG ya está definido
    if (typeof OPENROUTER_MODELS_CONFIG !== 'undefined') {
        console.log('OPENROUTER_MODELS_CONFIG ya está definido');
        // Cargar modelos desde la configuración
        loadModelsFromConfig(OPENROUTER_MODELS_CONFIG);

        // Seleccionar modelo por defecto
        const defaultModel = OPENROUTER_MODELS_CONFIG.default_model || 'openrouter/optimus-alpha';
        directModelSelect.value = defaultModel;
        directModel.value = defaultModel;

        // Mostrar información del modelo por defecto
        showModelInfo(defaultModel);
    } else {
        console.error('OPENROUTER_MODELS_CONFIG no está definido');
        // Agregar opción por defecto en caso de error
        directModelSelect.innerHTML = '<option value="openrouter/optimus-alpha">Optimus Alpha (OpenRouter)</option>';
        directModel.value = 'openrouter/optimus-alpha';
    }

    // Evento para mostrar/ocultar API key
    toggleDirectApiKey.addEventListener('click', function() {
        const type = directApiKey.type;
        directApiKey.type = type === 'password' ? 'text' : 'password';
        toggleDirectApiKey.innerHTML = type === 'password' ?
            '<i class="fas fa-eye-slash"></i>' :
            '<i class="fas fa-eye"></i>';
    });

    // Evento para actualizar el campo oculto cuando cambia el select
    directModelSelect.addEventListener('change', function() {
        directModel.value = this.value;

        // Mostrar información del modelo seleccionado
        const modelId = this.value;
        if (modelId) {
            showModelInfo(modelId);
        }
    });

    // Mostrar información del modelo por defecto
    showModelInfo(directModelSelect.value);

    // Evento para enviar la prueba
    directTestForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Obtener valores
        let apiKey = directApiKey.value.trim();
        const model = directModelSelect.value;
        const message = directMessage.value.trim();

        // Verificar si hay una API key en las variables de entorno
        if (!apiKey && window.ENV && window.ENV.OPENROUTER_API_KEY) {
            apiKey = window.ENV.OPENROUTER_API_KEY;
            console.log('Usando API key de variables de entorno');
        }

        // Validar valores
        if (!apiKey) {
            showToast('La API key de OpenRouter es requerida', 'error');
            directTestResult.style.display = 'block';
            directTestResponse.innerHTML = `
                <div class="alert alert-warning mb-0">
                    <h5><i class="fas fa-exclamation-triangle me-2"></i> API Key Requerida</h5>
                    <p>Debes ingresar una API key válida de OpenRouter para realizar pruebas directas.</p>
                    <p>Puedes obtener una API key gratuita en <a href="https://openrouter.ai/keys" target="_blank">openrouter.ai/keys</a></p>
                </div>
            `;
            return;
        }

        if (!model) {
            showToast('El modelo es requerido', 'error');
            return;
        }

        if (!message) {
            showToast('El mensaje es requerido', 'error');
            return;
        }

        // Cambiar estado del botón
        directTestBtn.disabled = true;
        directTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Enviando...';

        try {
            // Realizar la solicitud a OpenRouter
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Marduk Ecosystem'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                })
            });

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || 'Error desconocido';

                // Manejar error 401 (No autorizado) de forma especial
                if (response.status === 401) {
                    throw new Error(`API key inválida o no autorizada. Verifica tu API key de OpenRouter.`);
                } else {
                    throw new Error(`Error en la API de OpenRouter: ${response.status} - ${errorMessage}`);
                }
            }

            // Obtener datos de la respuesta
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Mostrar respuesta
            directTestResult.style.display = 'block';
            directTestResponse.innerHTML = formatResponse(aiResponse);

            // Mostrar notificación de éxito
            showToast('Prueba enviada correctamente', 'success');
        } catch (error) {
            console.error('Error al enviar prueba:', error);

            // Mostrar respuesta de error
            directTestResult.style.display = 'block';
            directTestResponse.innerHTML = `<div class="alert alert-danger mb-0">Error: ${error.message}</div>`;

            // Mostrar notificación de error
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            // Restaurar estado del botón
            directTestBtn.disabled = false;
            directTestBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Enviar Prueba';
        }
    });



    /**
     * Carga los modelos desde la configuración
     * @param {Object} config - Configuración de modelos
     */
    function loadModelsFromConfig(config) {
        try {
            console.log('Cargando modelos desde configuración...');

            // Limpiar select
            directModelSelect.innerHTML = '<option value="" disabled>Selecciona un modelo</option>';

            // Verificar si hay modelos disponibles
            if (!config || !config.models || config.models.length === 0) {
                console.error('No hay modelos disponibles en la configuración');

                // Agregar opción por defecto
                const option = document.createElement('option');
                option.value = 'openrouter/optimus-alpha';
                option.text = 'Optimus Alpha (OpenRouter)';
                directModelSelect.add(option);
                return;
            }

            // Agregar modelos al select, agrupados por proveedor
            const modelsByProvider = {};

            // Agrupar modelos por proveedor
            config.models.forEach(model => {
                const provider = model.provider || 'Otros';
                if (!modelsByProvider[provider]) {
                    modelsByProvider[provider] = [];
                }
                modelsByProvider[provider].push(model);
            });

            // Crear grupos de opciones por proveedor
            Object.keys(modelsByProvider).sort().forEach(provider => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = provider;

                // Agregar modelos del proveedor
                modelsByProvider[provider].forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.id;
                    option.text = model.name || model.id;
                    optgroup.appendChild(option);
                });

                directModelSelect.appendChild(optgroup);
            });

            console.log('Modelos cargados correctamente. Total:', config.models.length);
        } catch (error) {
            console.error('Error al cargar modelos:', error);

            // Agregar opción por defecto en caso de error
            const option = document.createElement('option');
            option.value = 'openrouter/optimus-alpha';
            option.text = 'Optimus Alpha (OpenRouter)';
            directModelSelect.add(option);
        }
    }

    /**
     * Muestra información del modelo seleccionado
     * @param {string} modelId - ID del modelo
     */
    function showModelInfo(modelId) {
        try {
            if (!OPENROUTER_MODELS_CONFIG || !OPENROUTER_MODELS_CONFIG.models) {
                console.log('Modelo seleccionado (configuración no disponible):', modelId);
                directModelSelect.setAttribute('title', `Modelo: ${modelId}`);
                return;
            }

            // Buscar modelo en la configuración
            const model = OPENROUTER_MODELS_CONFIG.models.find(m => m.id === modelId);

            if (model) {
                console.log('Modelo seleccionado:', model);

                // Actualizar atributos del select para mostrar información en tooltip
                directModelSelect.setAttribute('title', `Proveedor: ${model.provider} | Especialidad: ${model.specialty || 'General'} | Capacidades: ${model.capabilities ? model.capabilities.join(', ') : 'N/A'}`);
            } else {
                console.log('Modelo seleccionado (no encontrado en configuración):', modelId);
                directModelSelect.setAttribute('title', `Modelo: ${modelId}`);
            }
        } catch (error) {
            console.error('Error al mostrar información del modelo:', error);
            directModelSelect.setAttribute('title', `Modelo: ${modelId}`);
        }
    }

    /**
     * Formatea la respuesta para mostrarla en HTML
     * @param {string} response - Respuesta de la API
     * @returns {string} - HTML formateado
     */
    function formatResponse(response) {
        // Escapar HTML para evitar inyección de código
        const escaped = response
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        // Convertir saltos de línea en <br>
        return escaped.replace(/\n/g, '<br>');
    }
});
