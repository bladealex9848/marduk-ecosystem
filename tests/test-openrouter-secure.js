/**
 * Script para probar la API de OpenRouter con fetch en Node.js
 * usando la API key desde el archivo .env
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

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
const envPath = path.resolve(__dirname, '.env');
console.log('Cargando variables de entorno desde:', envPath);
const env = loadEnvFromFile(envPath);

// Probar la API de OpenRouter con fetch
async function testOpenRouterWithFetch() {
    try {
        // Verificar si tenemos una API key
        if (!env.OPENROUTER_API_KEY) {
            console.error('No se encontró una API key en el archivo .env');
            return;
        }

        console.log('\nProbando API de OpenRouter con fetch...');
        console.log('Usando API key desde .env [OCULTA POR SEGURIDAD]');

        // Enviar solicitud a OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://marduk-ecosystem.com',
                'X-Title': 'Marduk Ecosystem'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-scout:free',
                messages: [
                    {
                        role: 'user',
                        content: 'Hola, ¿cómo estás?'
                    }
                ]
            })
        });

        // Obtener respuesta
        const data = await response.json();

        // Verificar si hay error
        if (!response.ok) {
            console.log('\n❌ Error en la solicitud a OpenRouter');
            console.log('Código de estado:', response.status);
            console.log('Error:', data);
            return;
        }

        // Mostrar respuesta
        console.log('\n✅ Solicitud exitosa!');
        console.log('Modelo usado:', data.model);
        console.log('Respuesta:', data.choices[0].message.content);
    } catch (error) {
        console.error('Error al probar la API de OpenRouter con fetch:', error);
    }
}

// Ejecutar la prueba
testOpenRouterWithFetch();
