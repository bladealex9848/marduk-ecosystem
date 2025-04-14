<?php
/**
 * Script para proporcionar la API key de OpenRouter de forma segura
 * Este script lee el archivo .env y devuelve la API key en formato JSON
 * No expone el contenido completo del archivo .env
 */

// Configuración de seguridad
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

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

// Obtener la API key
$apiKey = getApiKeyFromEnv();

// Preparar la respuesta
$response = [
    'success' => $apiKey !== null,
    'message' => $apiKey !== null ? 'API key encontrada' : 'No se encontró la API key en el archivo .env',
    'data' => [
        'keyAvailable' => $apiKey !== null,
        // No incluimos la API key en la respuesta para mayor seguridad
    ]
];

// Si se proporciona un token de autenticación válido, incluir la API key en la respuesta
if (isset($_SERVER['HTTP_X_AUTH_TOKEN']) && $_SERVER['HTTP_X_AUTH_TOKEN'] === 'marduk-ecosystem-auth-token') {
    $response['data']['key'] = $apiKey;
}

// Devolver la respuesta
echo json_encode($response);
?>
