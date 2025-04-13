/**
 * Script para probar la carga de variables de entorno
 */

const fs = require('fs');
const path = require('path');

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
                console.log(`Variable cargada: ${key.trim()} = ${cleanValue}`);
            }
        });
        
        return env;
    } catch (error) {
        console.error('Error al cargar el archivo:', error);
        return {};
    }
}

// Cargar variables de entorno desde .env.test
const envPath = path.resolve(__dirname, '.env.test');
console.log('Cargando variables de entorno desde:', envPath);
const env = loadEnvFromFile(envPath);

// Probar la conexión con OpenRouter
async function testOpenRouterConnection() {
    try {
        console.log('\nProbando conexión con OpenRouter...');
        
        // Verificar si tenemos una API key
        if (!env.OPENROUTER_API_KEY) {
            console.error('No se encontró una API key en el archivo .env.test');
            return;
        }
        
        console.log('Usando API key:', env.OPENROUTER_API_KEY);
        
        // Realizar la solicitud a OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://marduk-ecosystem.com',
                'X-Title': 'Marduk Ecosystem'
            },
            body: JSON.stringify({
                model: 'openrouter/optimus-alpha',
                messages: [
                    {
                        role: 'user',
                        content: 'Hola, ¿cómo estás?'
                    }
                ]
            })
        });
        
        // Verificar la respuesta
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en la solicitud a OpenRouter:', errorData);
            return;
        }
        
        // Mostrar la respuesta
        const data = await response.json();
        console.log('\nRespuesta de OpenRouter:');
        console.log('Modelo:', data.model);
        console.log('Mensaje:', data.choices[0].message.content);
        console.log('\nConexión exitosa!');
    } catch (error) {
        console.error('Error al probar la conexión:', error);
    }
}

// Ejecutar la prueba
testOpenRouterConnection();
