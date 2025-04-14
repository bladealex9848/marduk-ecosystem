/**
 * Script para cargar la API key directamente
 */

// Establecer la API key directamente
window.ENV = window.ENV || {};
window.ENV.OPENROUTER_API_KEY = "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";
window.ENV.DEMO_MODE = false;

console.log('API key cargada directamente:', window.ENV.OPENROUTER_API_KEY.substring(0, 10) + '...');

// Función para actualizar la interfaz de usuario
function updateApiKeyUI() {
    // Actualizar el estado de la API key
    const apiKeyStatus = document.getElementById('api-key-status');
    if (apiKeyStatus) {
        apiKeyStatus.innerHTML = '<span class="text-success"><i class="fas fa-check-circle"></i> API key cargada directamente</span>';
    }
    
    // Habilitar el botón para usar la API key
    const useEnvKeyBtn = document.getElementById('use-env-key');
    if (useEnvKeyBtn) {
        useEnvKeyBtn.disabled = false;
    }
}

// Ejecutar cuando se cargue el documento
document.addEventListener('DOMContentLoaded', function() {
    updateApiKeyUI();
});
