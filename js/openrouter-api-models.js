/**
 * Módulo para cargar modelos desde la API de OpenRouter
 */

/**
 * Carga los modelos disponibles desde la API de OpenRouter
 * @param {string} apiKey - API key de OpenRouter
 * @returns {Promise<Array>} - Promesa con los modelos disponibles
 */
async function loadModelsFromOpenRouterAPI(apiKey) {
    try {
        // Verificar si hay una API key
        if (!apiKey) {
            console.warn('No se proporcionó una API key para cargar modelos desde la API');
            return [];
        }
        
        // Realizar solicitud a la API de OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Marduk Ecosystem'
            }
        });
        
        // Verificar si hay error
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error al cargar modelos desde la API:', errorData);
            return [];
        }
        
        // Obtener datos
        const data = await response.json();
        
        // Verificar si hay modelos
        if (!data.data || !Array.isArray(data.data)) {
            console.warn('No se encontraron modelos en la respuesta de la API');
            return [];
        }
        
        // Filtrar modelos gratuitos y de OpenRouter
        const apiModels = data.data.filter(model => {
            // Verificar si el modelo es gratuito (contiene ":free" en el ID o tiene context_length_free > 0)
            const isFree = model.id.includes(':free') || (model.context_length_free && model.context_length_free > 0);
            
            // Verificar si el modelo es de OpenRouter
            const isOpenRouter = model.id.startsWith('openrouter/');
            
            // Incluir el modelo si es gratuito o de OpenRouter
            return isFree || isOpenRouter;
        });
        
        // Transformar modelos al formato de la aplicación
        return apiModels.map(model => ({
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
            source: 'api' // Marcar como proveniente de la API
        }));
    } catch (error) {
        console.error('Error al cargar modelos desde la API de OpenRouter:', error);
        return [];
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

// Exportar funciones
if (typeof window !== 'undefined') {
    window.loadModelsFromOpenRouterAPI = loadModelsFromOpenRouterAPI;
}

// Exportar para uso como módulo ES6
try {
    if (typeof module !== 'undefined') {
        module.exports = {
            loadModelsFromOpenRouterAPI
        };
    }
} catch (e) {
    // Ignorar errores en entornos que no soportan module.exports
    console.log('Modo no-módulo');
}
