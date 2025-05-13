<?php
// config.php - Database connection configuration

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'campus_user');
define('DB_PASS', 'your_secure_password');
define('DB_NAME', 'campus_hub');

// Create connection
function connectDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

// Close database connection
function closeDB($conn) {
    $conn->close();
}

// Function to sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}