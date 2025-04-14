<?php
/**
 * Script para generar un token de autenticación para obtener la API key
 * Este script genera un token único para la sesión actual
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

// Preparar la respuesta
$response = [
    'success' => true,
    'message' => 'Token de autenticación generado',
    'data' => [
        'token' => $_SESSION['api_key_token']
    ]
];

// Devolver la respuesta
echo json_encode($response);
?>
