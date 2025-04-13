/**
 * Script para probar la API de OpenRouter desde el terminal
 * Lee la API key directamente del archivo .env
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Función para leer el archivo .env y extraer la API key
function getApiKeyFromEnv() {
    try {
        // Leer el archivo .env desde la raíz del proyecto
        const envPath = path.resolve(__dirname, '../.env');
        console.log('Leyendo archivo .env desde:', envPath);

        const envContent = fs.readFileSync(envPath, 'utf8');
        console.log('Contenido del archivo .env:');
        console.log(envContent);

        // Buscar la línea que contiene OPENROUTER_API_KEY
        const lines = envContent.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('OPENROUTER_API_KEY=')) {
                // Extraer el valor
                let apiKey = line.split('=')[1].trim();

                // Eliminar comillas si existen
                if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
                    apiKey = apiKey.substring(1, apiKey.length - 1);
                }

                console.log('API key encontrada:', apiKey.substring(0, 10) + '...');
                return apiKey;
            }
        }

        console.error('No se encontró la API key en el archivo .env');
        return null;
    } catch (error) {
        console.error('Error al leer el archivo .env:', error);
        return null;
    }
}

// Función para probar la API de OpenRouter
function testOpenRouterApi(apiKey) {
    return new Promise((resolve, reject) => {
        // Verificar si tenemos una API key
        if (!apiKey) {
            reject(new Error('No se proporcionó una API key'));
            return;
        }

        console.log('\nProbando API de OpenRouter...');
        console.log('Usando API key:', apiKey.substring(0, 10) + '...');

        // Datos para la solicitud
        const data = JSON.stringify({
            model: 'meta-llama/llama-4-scout:free',
            messages: [
                {
                    role: 'user',
                    content: 'Hola, ¿cómo estás?'
                }
            ]
        });

        // Opciones para la solicitud
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

        // Realizar la solicitud
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);

                    if (res.statusCode === 200) {
                        console.log('\n✅ Solicitud exitosa!');
                        console.log('Código de estado:', res.statusCode);
                        console.log('Modelo usado:', parsedData.model);
                        console.log('Respuesta:', parsedData.choices[0].message.content);
                        resolve(parsedData);
                    } else {
                        console.log('\n❌ Error en la solicitud');
                        console.log('Código de estado:', res.statusCode);
                        console.log('Error:', parsedData);
                        reject(new Error(`Error en la API: ${res.statusCode}`));
                    }
                } catch (error) {
                    console.log('\n❌ Error al parsear la respuesta');
                    console.log('Respuesta cruda:', responseData);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('\n❌ Error en la solicitud:', error);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

// Función para probar la autenticación de la API key
function testApiKeyAuth(apiKey) {
    return new Promise((resolve, reject) => {
        // Verificar si tenemos una API key
        if (!apiKey) {
            reject(new Error('No se proporcionó una API key'));
            return;
        }

        console.log('\nVerificando autenticación de la API key...');

        // Opciones para la solicitud
        const options = {
            hostname: 'openrouter.ai',
            path: '/api/v1/auth/key',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        };

        // Realizar la solicitud
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);

                    if (res.statusCode === 200) {
                        console.log('\n✅ API key válida!');
                        console.log('Código de estado:', res.statusCode);
                        console.log('Detalles:', parsedData);
                        resolve(parsedData);
                    } else {
                        console.log('\n❌ API key inválida');
                        console.log('Código de estado:', res.statusCode);
                        console.log('Error:', parsedData);
                        reject(new Error(`Error en la autenticación: ${res.statusCode}`));
                    }
                } catch (error) {
                    console.log('\n❌ Error al parsear la respuesta');
                    console.log('Respuesta cruda:', responseData);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('\n❌ Error en la solicitud:', error);
            reject(error);
        });

        req.end();
    });
}

// Función principal
async function main() {
    try {
        // Obtener la API key del archivo .env
        const apiKey = getApiKeyFromEnv();

        if (!apiKey) {
            console.error('No se pudo obtener la API key. Abortando prueba.');
            return;
        }

        // Probar la autenticación de la API key
        await testApiKeyAuth(apiKey);

        // Probar la API de OpenRouter
        await testOpenRouterApi(apiKey);

        console.log('\n✅ Prueba completada con éxito!');
    } catch (error) {
        console.error('\n❌ Error en la prueba:', error.message);
    }
}

// Ejecutar la función principal
main();
