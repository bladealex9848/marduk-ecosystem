/**
 * Cargador de variables de entorno
 * 
 * Este script carga las variables de entorno desde el archivo .env
 * y las hace disponibles globalmente a través del objeto ENV.
 */

// Objeto global para almacenar las variables de entorno
window.ENV = {};

// Función para cargar las variables de entorno
async function loadEnvVariables() {
    try {
        const response = await fetch('/.env');
        
        if (!response.ok) {
            console.warn('No se pudo cargar el archivo .env');
            return;
        }
        
        const envContent = await response.text();
        
        // Procesar cada línea del archivo .env
        envContent.split('\n').forEach(line => {
            // Ignorar líneas vacías o comentarios
            if (!line || line.startsWith('#')) return;
            
            // Extraer clave y valor
            const match = line.match(/^([^=]+)=["']?([^"']*)["']?$/);
            if (match) {
                const [, key, value] = match;
                window.ENV[key.trim()] = value.trim();
            }
        });
        
        console.log('Variables de entorno cargadas correctamente');
    } catch (error) {
        console.error('Error al cargar variables de entorno:', error);
    }
}

// Cargar variables de entorno al iniciar
document.addEventListener('DOMContentLoaded', loadEnvVariables);
