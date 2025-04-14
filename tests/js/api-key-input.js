/**
 * Script para manejar la entrada manual de la API key
 * No intenta cargar la API key desde .env debido a restricciones de CORS
 */

// Inicializar el objeto ENV
window.ENV = window.ENV || {};
window.ENV.DEMO_MODE = false;

// Función para actualizar la interfaz de usuario
function updateApiKeyUI() {
    // Actualizar el estado de la API key
    const apiKeyStatus = document.getElementById('api-key-status');
    if (apiKeyStatus) {
        apiKeyStatus.innerHTML = '<span class="text-warning"><i class="fas fa-exclamation-circle"></i> Por favor, ingresa tu API key manualmente</span>';
    }
    
    // Mostrar mensaje informativo
    const apiKeyInfo = document.createElement('div');
    apiKeyInfo.className = 'alert alert-info mt-2';
    apiKeyInfo.innerHTML = `
        <h6><i class="fas fa-info-circle"></i> Información importante:</h6>
        <p>Debido a restricciones de seguridad del navegador, no es posible cargar automáticamente la API key desde el archivo .env cuando se accede a través de file://.</p>
        <p>Por favor, ingresa tu API key de OpenRouter manualmente en el campo de arriba.</p>
        <p class="mb-0"><small>Nota: Tu API key nunca se almacena en el código y solo se utiliza para esta sesión.</small></p>
    `;
    
    // Agregar el mensaje después del campo de API key
    const apiKeyContainer = document.querySelector('.api-key-container') || document.getElementById('api-key').parentNode;
    if (apiKeyContainer && !document.querySelector('.api-key-info')) {
        apiKeyInfo.classList.add('api-key-info');
        apiKeyContainer.appendChild(apiKeyInfo);
    }
}

// Ejecutar cuando se cargue el documento
document.addEventListener('DOMContentLoaded', function() {
    updateApiKeyUI();
});
