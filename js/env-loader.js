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
        // Cargar una API key simulada (para modo de demostración)
        window.ENV.OPENROUTER_API_KEY = 'DEMO_MODE';
        window.ENV.DEMO_MODE = true;
        console.log('Modo de demostración activado');

        // Intentar cargar el archivo .env (para producción)
        let response;
        try {
            response = await fetch('/.env');
            if (!response.ok) {
                response = await fetch('../.env');
            }

            if (response.ok) {
                const envContent = await response.text();

                // Procesar cada línea del archivo .env
                envContent.split('\n').forEach(line => {
                    // Ignorar líneas vacías o comentarios
                    if (!line || line.startsWith('#')) return;

                    // Extraer clave y valor
                    const match = line.match(/^([^=]+)=(.*)$/);
                    if (match) {
                        const [, key, value] = match;
                        // Eliminar comillas si existen
                        let cleanValue = value.trim();
                        // Eliminar comillas dobles
                        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
                            cleanValue = cleanValue.substring(1, cleanValue.length - 1);
                        }
                        // Eliminar comillas simples
                        if (cleanValue.startsWith("'") && cleanValue.endsWith("'")) {
                            cleanValue = cleanValue.substring(1, cleanValue.length - 1);
                        }
                        window.ENV[key.trim()] = cleanValue;
                        console.log(`Variable de entorno cargada: ${key.trim()} = ${cleanValue.substring(0, 3)}...`);
                    }
                });

                console.log('Variables de entorno cargadas desde .env');
            }
        } catch (error) {
            console.warn('No se pudo cargar el archivo .env:', error);
        }
    } catch (error) {
        console.error('Error al cargar variables de entorno:', error);
    }
}

// Cargar variables de entorno al iniciar
document.addEventListener('DOMContentLoaded', loadEnvVariables);
