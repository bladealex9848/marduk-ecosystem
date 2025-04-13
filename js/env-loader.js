/**
 * Cargador de variables de entorno
 *
 * Este script carga las variables de entorno desde el archivo .env
 * y las hace disponibles globalmente a través del objeto ENV.
 */

// Objeto global para almacenar las variables de entorno
window.ENV = {};

// Función para cargar las variables de entorno
window.loadEnvVariables = async function() {
    try {
        // Inicializar con valores por defecto
        window.ENV.OPENROUTER_API_KEY = 'DEMO_MODE';
        window.ENV.DEMO_MODE = true;
        console.log('Modo de demostración activado inicialmente');

        // Intentar cargar el archivo .env (para producción)
        let response;
        try {
            // Intentar diferentes rutas para encontrar el archivo .env
            // Intentar cargar desde la raíz absoluta
            console.log('Intentando cargar .env desde /.env');
            response = await fetch('/.env');

            if (!response.ok) {
                // Intentar cargar desde el directorio padre
                console.log('Intentando cargar .env desde ../.env');
                response = await fetch('../.env');

                if (!response.ok) {
                    // Intentar cargar desde el directorio actual
                    console.log('Intentando cargar .env desde .env');
                    response = await fetch('.env');

                    if (!response.ok) {
                        // Intentar cargar desde .env.test2
                        console.log('Intentando cargar .env desde .env.test2');
                        response = await fetch('.env.test2');

                        if (!response.ok) {
                            console.log('No se pudo encontrar el archivo .env en ninguna ubicación');

                            // Como último recurso, usar una API key hardcoded para desarrollo
                            console.log('Usando API key hardcoded como último recurso');
                            window.ENV.OPENROUTER_API_KEY = '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';
                            window.ENV.DEMO_MODE = false;
                        } else {
                            console.log('.env encontrado en .env.test2');
                        }
                    } else {
                        console.log('.env encontrado en el directorio actual');
                    }
                } else {
                    console.log('.env encontrado en el directorio padre');
                }
            } else {
                console.log('.env encontrado en la raíz absoluta');
            }

            if (response.ok) {
                const envContent = await response.text();
                console.log('Contenido del archivo .env cargado. Longitud:', envContent.length);
                console.log('Primeros 20 caracteres:', envContent.substring(0, 20));

                // Procesar cada línea del archivo .env
                const lines = envContent.split('\n');
                console.log('Número de líneas en .env:', lines.length);
                lines.forEach((line, index) => {
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

                // Verificar si se cargó la API key
                if (window.ENV.OPENROUTER_API_KEY && window.ENV.OPENROUTER_API_KEY !== 'DEMO_MODE') {
                    console.log('API key de OpenRouter cargada correctamente');
                    window.ENV.DEMO_MODE = false;
                } else {
                    console.log('No se encontró una API key válida en el archivo .env');
                }

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
