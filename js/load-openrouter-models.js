/**
 * Carga los modelos desde openrouter-models.js
 * 
 * Este archivo proporciona una función para cargar los modelos
 * definidos en openrouter-models.js sin usar importaciones ES6.
 */

// Función para cargar los modelos
function loadOpenRouterModels(callback) {
    // Crear un elemento script
    const script = document.createElement('script');
    script.src = '../js/config/openrouter-models.js';
    script.onload = function() {
        // Cuando el script se carga, OPENROUTER_MODELS_CONFIG está disponible globalmente
        if (typeof OPENROUTER_MODELS_CONFIG !== 'undefined') {
            callback(OPENROUTER_MODELS_CONFIG);
        } else {
            console.error('No se pudo cargar OPENROUTER_MODELS_CONFIG');
            callback(null);
        }
    };
    script.onerror = function() {
        console.error('Error al cargar el script openrouter-models.js');
        callback(null);
    };
    
    // Agregar el script al documento
    document.head.appendChild(script);
}
