<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

// OPTIONS request ko turant handle karke bypass karo (Player preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_config(200);
    exit;
}

$target_url = isset($_GET['url']) ? $_GET['url'] : '';

if (!$target_url) {
    die("RolexCoderZ Private Proxy is Running! Please provide a ?url= parameter.");
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $target_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Yahi wo magic hai jo Cloudflare me ho raha tha, ab aapke server se hoga
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Origin: https://appx-play.akamai.net.in",
    "Referer: https://appx-play.akamai.net.in/",
    "User-Agent: Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36 PAYLOD"
]);

$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

// Set proper content type (M3U8 ya TS)
header("Content-Type: " . $content_type);
http_response_code($http_status);

// Agar response video playlist (m3u8) hai, toh uske andar ke .ts links ko bhi proxy karna padega
if (strpos($content_type, 'mpegurl') !== false || strpos($target_url, '.m3u8') !== false) {
    
    // Base URL nikalo taaki relative .ts files ko absolute banaya ja sake
    $base_url_parts = explode('?', $target_url);
    $base_path = substr($base_url_parts[0], 0, strrpos($base_url_parts[0], '/') + 1);
    
    // Aapke proxy ka base path
    // Isko dynamically detect kar rahe hain
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $my_proxy_url = $protocol . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'] . "?url=";

    $lines = explode("\n", $response);
    foreach ($lines as &$line) {
        $line = trim($line);
        // Agar line valid video segment hai (comment/hash se shuru nahi hoti)
        if ($line && $line[0] !== '#') {
            // Agar line absolute URL nahi hai, toh base_path lagao aur Proxy ke aage chipka do
            if (strpos($line, 'http') !== 0) {
                $absolute_ts_url = $base_path . $line;
                $line = $my_proxy_url . urlencode($absolute_ts_url);
            } else {
                $line = $my_proxy_url . urlencode($line);
            }
        }
    }
    $response = implode("\n", $lines);
}

echo $response;
?>
