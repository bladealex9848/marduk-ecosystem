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

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', async function() {
    // Esperar a que OpenRouter esté inicializado
    await waitForOpenRouter();
    
    // Cargar modelos disponibles
    loadModels();
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar mensaje de bienvenida
    showToast('Bienvenido a la prueba de modelos de IA', 'info');
});

/**
 * Espera a que OpenRouter esté inicializado
 * @returns {Promise} - Promesa que se resuelve cuando OpenRouter está inicializado
 */
async function waitForOpenRouter() {
    return new Promise(resolve => {
        const checkOpenRouter = () => {
            if (window.openRouterService && window.openRouterService.initialized) {
                resolve();
            } else {
                setTimeout(checkOpenRouter, 100);
            }
        };
        checkOpenRouter();
    });
}

/**
 * Carga los modelos disponibles en el selector
 */
function loadModels() {
    try {
        // Obtener modelos disponibles
        const models = window.openRouterService.config.availableModels;
        
        // Limpiar selector
        modelSelector.innerHTML = '';
        
        // Agrupar modelos por proveedor
        const modelsByProvider = {};
        models.forEach(model => {
            if (!modelsByProvider[model.provider]) {
                modelsByProvider[model.provider] = [];
            }
            modelsByProvider[model.provider].push(model);
        });
        
        // Añadir modelos al selector agrupados por proveedor
        Object.keys(modelsByProvider).sort().forEach(provider => {
            // Añadir encabezado de proveedor
            const providerHeader = document.createElement('div');
            providerHeader.className = 'list-group-item list-group-item-secondary';
            providerHeader.textContent = provider;
            modelSelector.appendChild(providerHeader);
            
            // Añadir modelos del proveedor
            modelsByProvider[provider].forEach(model => {
                const modelItem = createModelCard(model);
                modelSelector.appendChild(modelItem);
            });
        });
        
        // Seleccionar modelo por defecto
        const defaultModel = models.find(model => model.id === window.openRouterService.currentModel);
        if (defaultModel) {
            selectModel(defaultModel);
        }
    } catch (error) {
        console.error('Error al cargar modelos:', error);
        modelSelector.innerHTML = `
            <div class="list-group-item text-center text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Error al cargar modelos
            </div>
        `;
    }
}

/**
 * Crea una tarjeta para un modelo
 * @param {Object} model - Información del modelo
 * @returns {HTMLElement} - Elemento de la tarjeta
 */
function createModelCard(model) {
    const modelItem = document.createElement('div');
    modelItem.className = 'list-group-item model-card';
    modelItem.dataset.modelId = model.id;
    
    // Contenido de la tarjeta
    modelItem.innerHTML = `
        <h6 class="mb-1">${model.name}</h6>
        <span class="model-provider">${model.provider}</span>
        <div class="model-specialty">
            <i class="fas fa-tag me-1"></i> ${model.specialty || 'general'}
        </div>
    `;
    
    // Añadir capacidades si existen
    if (model.capabilities && model.capabilities.length > 0) {
        const capabilitiesContainer = document.createElement('div');
        capabilitiesContainer.className = 'model-capabilities';
        
        // Mostrar solo las primeras 3 capacidades
        const displayCapabilities = model.capabilities.slice(0, 3);
        displayCapabilities.forEach(capability => {
            const badge = document.createElement('span');
            badge.className = 'capability-badge';
            badge.textContent = formatCapability(capability);
            capabilitiesContainer.appendChild(badge);
        });
        
        // Añadir indicador de más capacidades
        if (model.capabilities.length > 3) {
            const moreBadge = document.createElement('span');
            moreBadge.className = 'capability-badge';
            moreBadge.textContent = `+${model.capabilities.length - 3} más`;
            capabilitiesContainer.appendChild(moreBadge);
        }
        
        modelItem.appendChild(capabilitiesContainer);
    }
    
    // Evento de clic
    modelItem.addEventListener('click', () => {
        selectModel(model);
    });
    
    return modelItem;
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
    
    // Actualizar UI
    document.querySelectorAll('.model-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.model-card[data-model-id="${model.id}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Actualizar información del modelo seleccionado
    selectedModelName.textContent = model.name;
    selectedModelProvider.textContent = model.provider;
    
    // Actualizar información detallada del modelo
    updateModelInfo(model);
    
    // Cambiar modelo en OpenRouter
    window.openRouterService.setModel(model.id);
    
    // Añadir mensaje de sistema
    addSystemMessage(`Modelo cambiado a ${model.name} de ${model.provider}`);
}

/**
 * Actualiza la información detallada del modelo
 * @param {Object} model - Modelo seleccionado
 */
function updateModelInfo(model) {
    let infoHTML = `
        <div class="row">
            <div class="col-md-6">
                <h5>${model.name}</h5>
                <p><strong>Proveedor:</strong> ${model.provider}</p>
                <p><strong>ID:</strong> <code>${model.id}</code></p>
                <p><strong>Especialidad:</strong> ${model.specialty || 'General'}</p>
            </div>
            <div class="col-md-6">
                <h5>Capacidades</h5>
                <div class="d-flex flex-wrap gap-1 mb-3">
    `;
    
    // Añadir capacidades
    if (model.capabilities && model.capabilities.length > 0) {
        model.capabilities.forEach(capability => {
            infoHTML += `<span class="badge bg-info text-dark">${formatCapability(capability)}</span>`;
        });
    } else {
        infoHTML += `<span class="text-muted">No hay información de capacidades disponible</span>`;
    }
    
    infoHTML += `
                </div>
            </div>
        </div>
    `;
    
    // Añadir tipos de prompt si están disponibles
    if (model.prompt_types && model.prompt_types.length > 0) {
        infoHTML += `
            <div class="row mt-3">
                <div class="col-12">
                    <h5>Tipos de prompt recomendados</h5>
                    <div class="d-flex flex-wrap gap-1">
        `;
        
        model.prompt_types.forEach(type => {
            infoHTML += `<span class="badge bg-secondary">${formatCapability(type)}</span>`;
        });
        
        infoHTML += `
                    </div>
                </div>
            </div>
        `;
    }
    
    // Añadir sugerencias de uso
    infoHTML += `
        <div class="row mt-3">
            <div class="col-12">
                <h5>Sugerencias de uso</h5>
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
    
    // Actualizar contenido
    modelInfo.innerHTML = infoHTML;
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
            // Enviar mensaje a la IA
            const response = await window.openRouterService.generateCompletion(message, {
                modelId: currentModel.id,
                maxTokens: 1000,
                temperature: 0.7,
                systemPrompt: 'Eres un asistente útil especializado en temas jurídicos y legales. Responde de manera clara, precisa y profesional.'
            });
            
            // Ocultar indicador de escritura
            hideTypingIndicator();
            
            // Añadir respuesta de la IA
            addAIMessage(response);
        } catch (error) {
            // Ocultar indicador de escritura
            hideTypingIndicator();
            
            // Mostrar error
            console.error('Error al generar respuesta:', error);
            addErrorMessage('Error al generar respuesta. Por favor, intenta de nuevo.');
            showToast('Error al comunicarse con la IA', 'error');
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
