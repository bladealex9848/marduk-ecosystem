/**
 * Script para abrir todas las pruebas de navegador
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Función para verificar si un puerto está en uso
function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = http.createServer();
        
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
        
        server.once('listening', () => {
            server.close();
            resolve(false);
        });
        
        server.listen(port);
    });
}

// Función para abrir una URL en el navegador
function openInBrowser(url) {
    const command = process.platform === 'darwin' ? 'open' : 
                    process.platform === 'win32' ? 'start' : 'xdg-open';
    
    return execAsync(`${command} ${url}`);
}

// Función principal
async function main() {
    console.log(`${'*'.repeat(80)}`);
    console.log(`${'*'.repeat(30)} PRUEBAS DE NAVEGADOR ${'*'.repeat(30)}`);
    console.log(`${'*'.repeat(80)}\n`);
    
    // Verificar si hay un servidor local en el puerto 3000
    const port = 3000;
    const isServerRunning = await isPortInUse(port);
    
    if (!isServerRunning) {
        console.log(`No se detectó un servidor en el puerto ${port}.`);
        console.log('Por favor, inicia un servidor local antes de ejecutar las pruebas de navegador.');
        console.log('Puedes usar el siguiente comando:');
        console.log('  npx http-server -p 3000');
        process.exit(1);
    }
    
    // Obtener la lista de pruebas de navegador
    const testFiles = [
        'test-env-access.html',
        'test-env-direct.html',
        'test-models-improved.html',
        'test-openrouter-improved.html'
    ];
    
    // Abrir cada prueba en el navegador
    for (const testFile of testFiles) {
        const testPath = path.join(__dirname, testFile);
        
        // Verificar si el archivo existe
        if (fs.existsSync(testPath)) {
            const url = `http://localhost:${port}/tests/${testFile}`;
            console.log(`Abriendo: ${url}`);
            
            try {
                await openInBrowser(url);
                console.log(`✅ Abierto correctamente: ${testFile}`);
                
                // Esperar un poco entre cada apertura para no sobrecargar el navegador
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`❌ Error al abrir ${testFile}:`, error.message);
            }
        } else {
            console.log(`❌ Archivo no encontrado: ${testPath}`);
        }
    }
    
    console.log('\nTodas las pruebas de navegador han sido abiertas.');
}

// Ejecutar la función principal
main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
