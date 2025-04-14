/**
 * Script para manejar la entrada manual de la API key
 * Intenta cargar la API key desde el servidor si estamos en un entorno web
 */

// Inicializar el objeto ENV
window.ENV = window.ENV || {};
window.ENV.DEMO_MODE = false;

// Función para verificar si estamos en un servidor web (http/https)
function isWebServer() {
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}

// Función para obtener un token de autenticación del servidor
async function getAuthToken() {
    try {
        // Determinar la ruta base
        const baseUrl = window.location.origin;
        const tokenUrl = `${baseUrl}/get-auth-token.php`;
        
        // Solicitar el token
        const response = await fetch(tokenUrl);
        if (!response.ok) {
            throw new Error(`Error al obtener token: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.success || !data.data || !data.data.token) {
            throw new Error('Formato de respuesta inválido');
        }
        
        return data.data.token;
    } catch (error) {
        console.error('Error al obtener token de autenticación:', error);
        return null;
    }
}

// Función para intentar cargar la API key desde el servidor
async function tryLoadApiKeyFromServer() {
    if (!isWebServer()) {
        console.log('No estamos en un servidor web, no se puede cargar la API key');
        return null;
    }
    
    try {
        // Obtener token de autenticación
        const token = await getAuthToken();
        if (!token) {
            throw new Error('No se pudo obtener token de autenticación');
        }
        
        // Determinar la ruta base
        const baseUrl = window.location.origin;
        const apiKeyUrl = `${baseUrl}/get-api-key.php`;
        
        // Solicitar la API key
        const response = await fetch(apiKeyUrl, {
            headers: {
                'X-Auth-Token': token
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error al obtener API key: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.success || !data.data || !data.data.keyAvailable) {
            throw new Error('API key no disponible');
        }
        
        console.log('API key cargada desde el servidor');
        return data.data.key;
    } catch (error) {
        console.error('Error al cargar API key desde el servidor:', error);
        return null;
    }
}

// Función para actualizar la interfaz de usuario
async function updateApiKeyUI() {
    const apiKeyStatus = document.getElementById('api-key-status');
    const apiKeyInput = document.getElementById('api-key');
    const useEnvKeyBtn = document.getElementById('use-env-key');
    
    // Si estamos en un servidor web, intentar cargar la API key desde el servidor
    if (isWebServer()) {
        const apiKey = await tryLoadApiKeyFromServer();
        if (apiKey) {
            window.ENV.OPENROUTER_API_KEY = apiKey;
            
            if (apiKeyStatus) {
                apiKeyStatus.innerHTML = '<span class="text-success"><i class="fas fa-check-circle"></i> API key cargada desde el servidor</span>';
            }
            
            if (apiKeyInput) {
                apiKeyInput.value = '********';
            }
            
            if (useEnvKeyBtn) {
                useEnvKeyBtn.disabled = false;
            }
            
            console.log('API key cargada desde el servidor: ********');
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
            <p>No se pudo cargar la API key desde el servidor. Por favor, ingresa tu API key de OpenRouter manualmente.</p>
            <p class="mb-0"><small>Nota: Tu API key nunca se almacena en el código y solo se utiliza para esta sesión.</small></p>
        `;
    } else {
        apiKeyInfo.innerHTML = `
            <h6><i class="fas fa-info-circle"></i> Información importante:</h6>
            <p>Debido a restricciones de seguridad del navegador, no es posible cargar automáticamente la API key cuando se accede a través de file://.</p>
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
