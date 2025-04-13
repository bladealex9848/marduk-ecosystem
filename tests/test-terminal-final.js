/**
 * Script seguro para probar la API de OpenRouter desde el terminal
 * Obtiene la API key desde el archivo .env sin exponerla
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Función para cargar variables de entorno desde un archivo
function loadEnvFromFile(filePath) {
    try {
        // Leer el archivo
        const envContent = fs.readFileSync(filePath, 'utf8');
        const env = {};

        // Procesar cada línea
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

                env[key.trim()] = cleanValue;

                // No mostrar la API key completa por seguridad
                if (key.trim().includes('API_KEY')) {
                    console.log(`Variable cargada: ${key.trim()} = [OCULTA POR SEGURIDAD]`);
                } else {
                    console.log(`Variable cargada: ${key.trim()} = ${cleanValue}`);
                }
            }
        });

        return env;
    } catch (error) {
        console.error('Error al cargar el archivo:', error);
        return {};
    }
}

// Cargar variables de entorno desde .env
const envPath = path.resolve(__dirname, '../.env');
console.log('Cargando variables de entorno desde:', envPath);
const env = loadEnvFromFile(envPath);

// Probar la API key con OpenRouter
function testApiKey(apiKey) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'openrouter.ai',
            path: '/api/v1/auth/key',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const responseData = JSON.parse(data);
                    if (res.statusCode === 200) {
                        resolve({ success: true, data: responseData });
                    } else {
                        resolve({ success: false, error: responseData, statusCode: res.statusCode });
                    }
                } catch (error) {
                    resolve({ success: false, error: { message: 'Error al parsear la respuesta' } });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

// Probar la API key con una solicitud de chat completions
function testChatCompletions(apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'meta-llama/llama-4-scout:free',
            messages: [
                {
                    role: 'user',
                    content: 'Hola, ¿cómo estás?'
                }
            ]
        });

        const options = {
            hostname: 'openrouter.ai',
            path: '/api/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://marduk-ecosystem.com',
                'X-Title': 'Marduk Ecosystem',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    if (res.statusCode === 200) {
                        console.log('\n✅ Solicitud de chat completions exitosa!');
                        console.log('Modelo usado:', parsedData.model);
                        console.log('Respuesta:', parsedData.choices[0].message.content);
                        resolve({ success: true, data: parsedData });
                    } else {
                        console.log('\n❌ Error en la solicitud de chat completions');
                        console.log('Código de estado:', res.statusCode);
                        console.log('Error:', parsedData);
                        resolve({ success: false, error: parsedData, statusCode: res.statusCode });
                    }
                } catch (error) {
                    console.log('\n❌ Error al parsear la respuesta');
                    console.log('Respuesta cruda:', responseData);
                    resolve({ success: false, error: { message: 'Error al parsear la respuesta' } });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

// Probar la API key
async function runTest() {
    try {
        // Verificar si tenemos una API key
        if (!env.OPENROUTER_API_KEY) {
            console.error('No se encontró una API key en el archivo .env');
            return;
        }

        console.log('\nProbando API key con OpenRouter...');
        console.log('Usando API key desde .env [OCULTA POR SEGURIDAD]');

        // Probar autenticación
        console.log('\n1. Probando autenticación...');
        const authResult = await testApiKey(env.OPENROUTER_API_KEY);

        if (authResult.success) {
            console.log('✅ API key válida!');
            console.log('Detalles:', authResult.data);
        } else {
            console.log('❌ API key inválida o no autorizada');
            console.log('Código de estado:', authResult.statusCode);
            console.log('Error:', authResult.error);

            // Continuar con las pruebas aunque la autenticación falle
            console.log('\nContinuando con las pruebas...');
        }

        // Probar chat completions
        console.log('\n2. Probando chat completions...');
        const chatResult = await testChatCompletions(env.OPENROUTER_API_KEY);

        // Mostrar resumen de las pruebas
        console.log('\n=== RESUMEN DE PRUEBAS ===');
        console.log('1. Autenticación:', authResult.success ? '✅ EXITOSA' : '❌ FALLIDA');
        console.log('2. Chat Completions:', chatResult.success ? '✅ EXITOSA' : '❌ FALLIDA');

        if (authResult.success && chatResult.success) {
            console.log('\n✅ TODAS LAS PRUEBAS EXITOSAS');
            console.log('La API key es válida y funciona correctamente.');
        } else {
            console.log('\n❌ ALGUNAS PRUEBAS FALLARON');
            console.log('Revisa los detalles anteriores para más información.');
        }

    } catch (error) {
        console.error('Error al probar la API key:', error);
    }
}

// Ejecutar la prueba
runTest();
