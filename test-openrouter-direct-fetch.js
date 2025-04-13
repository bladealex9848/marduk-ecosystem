/**
 * Script para probar la API de OpenRouter con fetch en Node.js
 * usando una API key directamente
 */

const fetch = require('node-fetch');

// API key para probar
const API_KEY = "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";

// Probar la API de OpenRouter con fetch
async function testOpenRouterWithFetch() {
    try {
        console.log('Probando API de OpenRouter con fetch...');
        console.log('Usando API key:', API_KEY.substring(0, 10) + '...');
        
        // Enviar solicitud a OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
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
