/**
 * Script para manejar la entrada manual de la API key
 * Intenta cargar la API key desde .env si estamos en un servidor web
 */

// Inicializar el objeto ENV
window.ENV = window.ENV || {};
window.ENV.DEMO_MODE = false;

// Función para verificar si estamos en un servidor web (http/https)
function isWebServer() {
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}

// Función para intentar cargar la API key desde .env
async function tryLoadApiKeyFromEnv() {
    if (!isWebServer()) {
        console.log('No estamos en un servidor web, no se puede cargar .env');
        return null;
    }
    
    try {
        // Intentar cargar desde diferentes ubicaciones
        const locations = ['/.env', '../.env', '.env'];
        
        for (const location of locations) {
            try {
                console.log(`Intentando cargar .env desde ${location}`);
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

// Función para actualizar la interfaz de usuario
async function updateApiKeyUI() {
    const apiKeyStatus = document.getElementById('api-key-status');
    const apiKeyInput = document.getElementById('api-key');
    const useEnvKeyBtn = document.getElementById('use-env-key');
    
    // Si estamos en un servidor web, intentar cargar la API key desde .env
    if (isWebServer()) {
        const apiKey = await tryLoadApiKeyFromEnv();
        if (apiKey) {
            window.ENV.OPENROUTER_API_KEY = apiKey;
            
            if (apiKeyStatus) {
                apiKeyStatus.innerHTML = '<span class="text-success"><i class="fas fa-check-circle"></i> API key cargada desde .env</span>';
            }
            
            if (apiKeyInput) {
                apiKeyInput.value = '********';
            }
            
            if (useEnvKeyBtn) {
                useEnvKeyBtn.disabled = false;
            }
            
            console.log('API key cargada desde .env: ********');
            return;
        }
    }
    
    // Si no pudimos cargar la API key, mostrar mensaje para ingreso manual
    if (apiKeyStatus) {
        apiKeyStatus.innerHTML = '<span class="text-warning"><i class="fas fa-exclamation-circle"></i> Por favor, ingresa tu API key manualmente</span>';
    }
    
    if (useEnvKeyBtn) {
        useEnvKeyBtn.disabled = true;
    }
    
    // Mostrar mensaje informativo
    const apiKeyInfo = document.createElement('div');
    apiKeyInfo.className = 'alert alert-info mt-2';
    
    if (isWebServer()) {
        apiKeyInfo.innerHTML = `
            <h6><i class="fas fa-info-circle"></i> Información importante:</h6>
            <p>No se pudo cargar la API key desde el archivo .env. Por favor, ingresa tu API key de OpenRouter manualmente.</p>
            <p class="mb-0"><small>Nota: Tu API key nunca se almacena en el código y solo se utiliza para esta sesión.</small></p>
        `;
    } else {
        apiKeyInfo.innerHTML = `
            <h6><i class="fas fa-info-circle"></i> Información importante:</h6>
            <p>Debido a restricciones de seguridad del navegador, no es posible cargar automáticamente la API key desde el archivo .env cuando se accede a través de file://.</p>
            <p>Por favor, ingresa tu API key de OpenRouter manualmente en el campo de arriba.</p>
            <p class="mb-0"><small>Nota: Tu API key nunca se almacena en el código y solo se utiliza para esta sesión.</small></p>
        `;
    }
    
    // Agregar el mensaje después del campo de API key
    const apiKeyContainer = document.querySelector('.api-key-container') || (apiKeyInput ? apiKeyInput.parentNode : null);
    if (apiKeyContainer && !document.querySelector('.api-key-info')) {
        apiKeyInfo.classList.add('api-key-info');
        apiKeyContainer.appendChild(apiKeyInfo);
    }
}

// Función para obtener la API key
window.loadApiKey = function() {
    return window.ENV.OPENROUTER_API_KEY || null;
};

// Ejecutar cuando se cargue el documento
document.addEventListener('DOMContentLoaded', function() {
    updateApiKeyUI();
});
