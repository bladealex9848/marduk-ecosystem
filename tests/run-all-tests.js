/**
 * Script para ejecutar todas las pruebas de terminal
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función para ejecutar un comando y mostrar su salida
function runCommand(command) {
    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`Ejecutando: ${command}`);
    console.log(`${'='.repeat(80)}\n`);
    
    try {
        const output = execSync(command, { encoding: 'utf8' });
        console.log(output);
        return true;
    } catch (error) {
        console.error(`Error al ejecutar ${command}:`);
        console.error(error.message);
        return false;
    }
}

// Función principal
function main() {
    console.log(`${'*'.repeat(80)}`);
    console.log(`${'*'.repeat(30)} PRUEBAS DE OPENROUTER API ${'*'.repeat(30)}`);
    console.log(`${'*'.repeat(80)}\n`);
    
    // Obtener la lista de pruebas de terminal
    const testFiles = [
        'test-api-terminal.js',
        'test-terminal-final.js'
    ];
    
    // Ejecutar cada prueba
    let successCount = 0;
    let failCount = 0;
    
    for (const testFile of testFiles) {
        const testPath = path.join(__dirname, testFile);
        
        // Verificar si el archivo existe
        if (fs.existsSync(testPath)) {
            const success = runCommand(`node ${testPath}`);
            
            if (success) {
                successCount++;
            } else {
                failCount++;
            }
        } else {
            console.log(`\n\n${'='.repeat(80)}`);
            console.log(`Archivo no encontrado: ${testPath}`);
            console.log(`${'='.repeat(80)}\n`);
            failCount++;
        }
    }
    
    // Mostrar resumen
    console.log(`\n\n${'*'.repeat(80)}`);
    console.log(`${'*'.repeat(30)} RESUMEN DE PRUEBAS ${'*'.repeat(30)}`);
    console.log(`${'*'.repeat(80)}\n`);
    console.log(`Pruebas exitosas: ${successCount}`);
    console.log(`Pruebas fallidas: ${failCount}`);
    console.log(`Total de pruebas: ${successCount + failCount}`);
    
    // Devolver código de salida
    process.exit(failCount > 0 ? 1 : 0);
}

// Ejecutar la función principal
main();
