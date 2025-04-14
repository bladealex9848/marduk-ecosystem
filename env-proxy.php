<?php
// Este script sirve el contenido del archivo .env
// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

// Ruta al archivo .env
$envFile = __DIR__ . '/.env';

// Verificar si el archivo existe
if (file_exists($envFile)) {
    // Leer el contenido del archivo
    $content = file_get_contents($envFile);
    
    // Mostrar el contenido
    echo $content;
} else {
    // Mostrar un mensaje de error
    http_response_code(404);
    echo "# Error: Archivo .env no encontrado";
}
?>
