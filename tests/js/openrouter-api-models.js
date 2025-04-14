/**
 * Carga los modelos disponibles desde la API de OpenRouter
 * @param {string} apiKey - API key para autenticación
 * @returns {Promise<Array>} - Promesa que se resuelve con la lista de modelos
 */
async function loadModelsFromOpenRouterAPI(apiKey) {
    try {
        console.log('Cargando modelos desde la API de OpenRouter...');

        // Verificar si tenemos una API key válida
        if (!apiKey || apiKey === 'demo' || apiKey === 'tu-api-key-aquí') {
            throw new Error('API key no válida');
        }

        // Hacer solicitud a la API
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Marduk Ecosystem'
            }
        });

        if (!response.ok) {
            throw new Error(`Error al cargar modelos: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Formato de respuesta inesperado');
        }

        // Filtrar solo modelos gratuitos y de OpenRouter
        const filteredData = data.data.filter(model => {
            // Verificar si el modelo es gratuito
            const isFree = model.id.includes(':free') || (model.context_length_free && model.context_length_free > 0);

            // Verificar si el modelo es de OpenRouter
            const isOpenRouter = model.id.startsWith('openrouter/');

            // Incluir el modelo si es gratuito o de OpenRouter
            return isFree || isOpenRouter;
        });

        console.log(`Modelos filtrados: ${filteredData.length} de ${data.data.length}`);

        // Procesar los modelos
        const models = filteredData.map(model => ({
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
            source: 'api',
            isFree: model.id.includes(':free') || (model.context_length_free && model.context_length_free > 0),
            isOpenRouter: model.id.startsWith('openrouter/')
        }));

        console.log(`Se cargaron ${models.length} modelos desde la API`);
        return models;
    } catch (error) {
        console.error('Error al cargar modelos desde la API:', error);
        throw error;
    }
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
