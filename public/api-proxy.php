<?php

/**
 * Entra Global Tech — API Proxy (PHP fallback)
 * 
 * Forwards /api/* requests to the Laravel backend.
 * Handles Authorization header forwarding & CORS.
 */

$BACKEND = 'https://admin.entraglobaltech.com';

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

// Parse the URI to separate path from query string
$parsed = parse_url($_SERVER['REQUEST_URI']);
$fullPath = $parsed['path'] ?? '';
$query    = $parsed['query'] ?? '';

// Strip /api/ prefix
$path = preg_replace('#^/api/#', '', $fullPath);
$path = ltrim($path, '/');

$url = $BACKEND . '/api/' . $path;
if (!empty($query)) {
    $url .= '?' . $query;
}

// Build headers
$headers = [
    'Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'application/json'),
    'Accept: application/json',
];

// Forward Authorization header (multiple methods for shared hosting compatibility)
$authHeader = '';

// Method 1: Standard Apache env variable (works if .htaccess RewriteRule is set)
if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
}

// Method 2: getallheaders() fallback (some hosts use this)
if (empty($authHeader)) {
    $allHeaders = getallheaders();
    if (!empty($allHeaders['Authorization'])) {
        $authHeader = $allHeaders['Authorization'];
    } elseif (!empty($allHeaders['authorization'])) {
        $authHeader = $allHeaders['authorization'];
    }
}

if (!empty($authHeader)) {
    $headers[] = 'Authorization: ' . $authHeader;
}

// Use cURL
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => $_SERVER['REQUEST_METHOD'],
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_SSL_VERIFYPEER => false,
]);

// Forward request body for methods that have one
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    $body = file_get_contents('php://input');
    if (!empty($body)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

// Return response with CORS headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: ' . ($contentType ?: 'application/json'));
http_response_code($httpCode);
echo $response;
