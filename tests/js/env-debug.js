/**
 * Script para depurar la carga de variables de entorno
 */

// Función para probar el acceso al archivo .env
async function testEnvAccess() {
    console.log('Probando acceso al archivo .env...');

    // Probar diferentes rutas
    const routes = [
        { path: '/.env', name: 'Raíz absoluta' },
        { path: '../.env', name: 'Directorio padre' },
        { path: '.env', name: 'Directorio actual' },
        { path: '.env.test2', name: 'Archivo .env.test2' }
    ];

    for (const route of routes) {
        try {
            console.log(`Intentando cargar ${route.name}: ${route.path}`);
            const response = await fetch(route.path);

            if (response.ok) {
                const content = await response.text();
                console.log(`✅ Archivo ${route.name} accesible!`);
                console.log(`Longitud del contenido: ${content.length} caracteres`);
                console.log(`Primeros 50 caracteres: ${content.substring(0, 50)}`);

                // Procesar el contenido
                const env = {};
                const lines = content.split('\n');
                console.log(`Número de líneas: ${lines.length}`);

                lines.forEach((line, index) => {
                    // Ignorar líneas vacías o comentarios
                    if (!line || line.startsWith('#')) {
                        console.log(`Línea ${index + 1}: Comentario o vacía`);
                        return;
                    }

                    // Extraer clave y valor
                    const match = line.match(/^([^=]+)=(.*)$/);
                    if (match) {
                        const [, key, value] = match;
                        // Eliminar comillas si existen
                        let cleanValue = value.trim();

                        // Eliminar comillas dobles
                        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
                            cleanValue = cleanValue.substring(1, cleanValue.length - 1);
                            console.log(`Línea ${index + 1}: Comillas dobles eliminadas`);
                        }

                        // Eliminar comillas simples
                        if (cleanValue.startsWith("'") && cleanValue.endsWith("'")) {
                            cleanValue = cleanValue.substring(1, cleanValue.length - 1);
                            console.log(`Línea ${index + 1}: Comillas simples eliminadas`);
                        }

                        env[key.trim()] = cleanValue;
                        console.log(`Línea ${index + 1}: Variable ${key.trim()} = ${cleanValue.substring(0, 3)}...`);
                    } else {
                        console.log(`Línea ${index + 1}: Formato inválido`);
                    }
                });

                console.log('Variables de entorno encontradas:', Object.keys(env));

                // Verificar si existe la API key
                if (env.OPENROUTER_API_KEY) {
                    console.log(`API key encontrada: ${env.OPENROUTER_API_KEY.substring(0, 10)}...`);
                } else {
                    console.log('No se encontró la API key en el archivo');
                }
            } else {
                console.log(`❌ Archivo ${route.name} no accesible. Código: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Error al acceder a ${route.name}: ${error.message}`);
        }
    }
}

// Función para mostrar la información de depuración en la página
function updateDebugInfo() {
    const debugContent = document.getElementById('env-debug-content');
    if (!debugContent) return;

    let content = '<ul class="list-unstyled mb-0">';

    // Mostrar información sobre window.ENV
    content += '<li><strong>window.ENV:</strong> ' + (window.ENV ? 'Disponible' : 'No disponible') + '</li>';

    // Mostrar información sobre la API key
    if (window.ENV && window.ENV.OPENROUTER_API_KEY) {
        const apiKey = window.ENV.OPENROUTER_API_KEY;
        content += '<li><strong>API Key:</strong> ' + apiKey.substring(0, 10) + '...</li>';
        content += '<li><strong>Modo Demo:</strong> ' + (window.ENV.DEMO_MODE ? 'Activado' : 'Desactivado') + '</li>';
    } else {
        content += '<li><strong>API Key:</strong> No disponible</li>';
    }

    // Mostrar información sobre la función loadEnvVariables
    content += '<li><strong>loadEnvVariables:</strong> ' + (typeof window.loadEnvVariables === 'function' ? 'Disponible' : 'No disponible') + '</li>';

    // Mostrar información sobre OPENROUTER_MODELS_CONFIG
    content += '<li><strong>OPENROUTER_MODELS_CONFIG:</strong> ' + (typeof OPENROUTER_MODELS_CONFIG !== 'undefined' ? 'Disponible' : 'No disponible') + '</li>';
    if (typeof OPENROUTER_MODELS_CONFIG !== 'undefined' && OPENROUTER_MODELS_CONFIG.models) {
        content += '<li><strong>Modelos locales:</strong> ' + OPENROUTER_MODELS_CONFIG.models.length + '</li>';
    }

    content += '</ul>';

    // Actualizar el contenido
    debugContent.innerHTML = content;
}

// Ejecutar la prueba cuando se cargue el documento
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando depuración de variables de entorno...');
    testEnvAccess();

    // Actualizar la información de depuración cada segundo
    updateDebugInfo();
    setInterval(updateDebugInfo, 1000);
});
