<?php
/**
 * Script para obtener la API key de OpenRouter de forma segura
 * Este script lee el archivo .env y devuelve la API key en formato JSON
 * Requiere un token de autenticación generado por el servidor
 */

// Configuración de seguridad
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Generar un token de sesión único si no existe
session_start();
if (!isset($_SESSION['api_key_token'])) {
    $_SESSION['api_key_token'] = bin2hex(random_bytes(32));
}

// Función para leer la API key del archivo .env
function getApiKeyFromEnv() {
    $envFile = __DIR__ . '/.env';
    
    // Verificar si el archivo existe y es legible
    if (!file_exists($envFile) || !is_readable($envFile)) {
        return null;
    }
    
    // Leer el contenido del archivo
    $content = file_get_contents($envFile);
    
    // Buscar la API key usando expresiones regulares
    if (preg_match('/OPENROUTER_API_KEY=["\']?([^"\'\n]+)["\']?/', $content, $matches)) {
        return $matches[1];
    }
    
    return null;
}

// Verificar si se proporcionó el token de autenticación correcto
$authToken = isset($_SERVER['HTTP_X_AUTH_TOKEN']) ? $_SERVER['HTTP_X_AUTH_TOKEN'] : '';
$sessionToken = $_SESSION['api_key_token'];

if ($authToken === $sessionToken) {
    // Token válido, obtener la API key
    $apiKey = getApiKeyFromEnv();
    
    // Preparar la respuesta
    $response = [
        'success' => $apiKey !== null,
        'message' => $apiKey !== null ? 'API key encontrada' : 'No se encontró la API key en el archivo .env',
        'data' => [
            'keyAvailable' => $apiKey !== null,
            'key' => $apiKey
        ]
    ];
} else {
    // Token inválido
    http_response_code(401);
    $response = [
        'success' => false,
        'message' => 'Token de autenticación inválido',
        'data' => [
            'keyAvailable' => false
        ]
    ];
}

// Devolver la respuesta
echo json_encode($response);
?>
