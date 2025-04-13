/**
 * Script para probar la API key de demostración de OpenRouter
 */

const https = require('https');

// API key de demostración
const DEMO_API_KEY = 'sk-or-v1-free-demo-12345';

// Probar la API key con una solicitud de chat completions
function testChatCompletions(apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'openrouter/optimus-alpha',
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

// Ejecutar la prueba
async function runTest() {
    try {
        console.log('Probando API key de demostración:', DEMO_API_KEY);
        await testChatCompletions(DEMO_API_KEY);
    } catch (error) {
        console.error('Error al probar la API key de demostración:', error);
    }
}

runTest();
