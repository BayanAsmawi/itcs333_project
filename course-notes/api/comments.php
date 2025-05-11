<?php
/** REST API for Comments Application */

// headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB config
$host = "localhost";
$user = getenv("DB_USER");
$pass = getenv("DB_PASS");
$db = getenv("DB_NAME");


function getConnection() {
    global $host, $user, $pass, $db;

    $conn = new mysqli($host, $user, $pass, $db);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}


function getComments() {
    $conn = getConnection();


    $sql = "SELECT id, username, comment_text, comment_date FROM comments ORDER BY comment_date DESC";

    $result = $conn->query($sql);
    $comments = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $comments[] = $row;
        }
    }

    $conn->close();
    return $comments;
}


function addComment($username, $comment_text) {
    $conn = getConnection();


    $stmt = $conn->prepare("INSERT INTO comments (username, comment_text) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $comment_text);

    $success = $stmt->execute();

    $stmt->close();
    $conn->close();

    return $success;
}


try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $comments = getComments();

        echo json_encode([
            'status' => 'success',
            'count' => count($comments),
            'data' => $comments
        ]);
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $json = file_get_contents('php://input');
        $data = json_decode($json, true);


        if (!isset($data['username']) || !isset($data['comment_text'])) {
            throw new Exception('Username and comment text are required');
        }

        $username = trim($data['username']);
        $comment_text = trim($data['comment_text']);

        if (empty($username) || empty($comment_text)) {
            throw new Exception('Username and comment text cannot be empty');
        }


        if (addComment($username, $comment_text)) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Comment added successfully'
            ]);
        } else {
            throw new Exception('Failed to add comment');
        }
    } 
    else {

        http_response_code(405);
        echo json_encode([
            'status' => 'error',
            'message' => 'Method not allowed'
        ]);
    }
} catch (Exception $e) {

    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>