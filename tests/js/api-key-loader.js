/**
 * Script para cargar la API key de forma segura
 * NUNCA expone la API key directamente en el código
 */

// Inicializar el objeto ENV
window.ENV = window.ENV || {};
window.ENV.DEMO_MODE = false;

// Función para cargar la API key desde .env
async function tryLoadApiKeyFromEnv() {
    try {
        // Intentar cargar desde diferentes ubicaciones
        const locations = ['/.env', '../.env', '.env'];
        
        for (const location of locations) {
            try {
                const response = await fetch(location);
                if (response.ok) {
                    const content = await response.text();
                    const match = content.match(/OPENROUTER_API_KEY=[\"']?([^\"'\n]+)[\"']?/);
                    
                    if (match && match[1]) {
                        console.log('API key cargada desde .env');
                        return match[1];
                    }
                }
            } catch (e) {
                console.log(`No se pudo cargar .env desde ${location}`);
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error al cargar API key desde .env:', error);
        return null;
    }
}

// Función para obtener la API key (solo desde .env o entrada manual)
window.loadApiKey = async function() {
    // Intentar cargar desde .env
    const apiKey = await tryLoadApiKeyFromEnv();
    
    if (apiKey) {
        window.ENV.OPENROUTER_API_KEY = apiKey;
        return apiKey;
    }
    
    return null;
};

// Función para actualizar la interfaz de usuario
async function updateApiKeyUI() {
    // Intentar cargar la API key
    const apiKey = await window.loadApiKey();
    
    // Actualizar el estado de la API key
    const apiKeyStatus = document.getElementById('api-key-status');
    if (apiKeyStatus) {
        if (apiKey) {
            apiKeyStatus.innerHTML = '<span class="text-success"><i class="fas fa-check-circle"></i> API key cargada desde .env</span>';
            
            // Establecer la API key en el campo de entrada (oculta)
            const apiKeyInput = document.getElementById('api-key');
            if (apiKeyInput) {
                apiKeyInput.value = '********';
            }
            
            // Habilitar el botón para usar la API key
            const useEnvKeyBtn = document.getElementById('use-env-key');
            if (useEnvKeyBtn) {
                useEnvKeyBtn.disabled = false;
            }
        } else {
            apiKeyStatus.innerHTML = '<span class="text-warning"><i class="fas fa-exclamation-circle"></i> No hay API key válida en .env</span>';
        }
    }
}

// Ejecutar cuando se cargue el documento
document.addEventListener('DOMContentLoaded', function() {
    updateApiKeyUI();
});
