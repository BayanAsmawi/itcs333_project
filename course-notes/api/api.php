<?php
/** REST API for Course Notes App */

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


$response = [
    'status' => 'error',
    'message' => 'An error occurred',
    'data' => []
];

try {
    $conn = new mysqli($host, $user, $pass, $db);


    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        
        $query = "SELECT * FROM course_notes";
        $whereConditions = [];
        $params = [];
        $types = "";

    
        if (isset($_GET['course_code']) && !empty($_GET['course_code'])) {
            $whereConditions[] = "course_code = ?";
            $params[] = $_GET['course_code'];
            $types .= "s";
        }

        
        if (isset($_GET['college']) && !empty($_GET['college'])) {
            $whereConditions[] = "college = ?";
            $params[] = $_GET['college'];
            $types .= "s";
        }

        
        if (count($whereConditions) > 0) {
            $query .= " WHERE " . implode(" AND ", $whereConditions);
        }

       
        $stmt = $conn->prepare($query);

        if (count($params) > 0) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();

         
        $notes = [];
        while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }

        
        $response = [
            'status' => 'success',
            'count' => count($notes),
            'data' => $notes
        ];

        $stmt->close();
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
         
        $data = json_decode(file_get_contents('php://input'), true);

         
        if (
            !isset($data['course_code']) || empty($data['course_code']) ||
            !isset($data['college']) || empty($data['college']) ||
            !isset($data['notes_title']) || empty($data['notes_title']) ||
            !isset($data['notes_body']) || empty($data['notes_body'])
        ) {
            throw new Exception("Missing required fields");
        }

         
        $query = "INSERT INTO course_notes (course_code, college, date_added, notes_title, notes_body) 
                 VALUES (?, ?, CURDATE(), ?, ?)";

        $stmt = $conn->prepare($query);
        $stmt->bind_param(
            "ssss", 
            $data['course_code'],
            $data['college'],
            $data['notes_title'],
            $data['notes_body']
        );

         
        if ($stmt->execute()) {
            $response = [
                'status' => 'success',
                'message' => 'Note added successfully',
                'id' => $conn->insert_id
            ];
        } else {
            throw new Exception("Failed to add note");
        }

        $stmt->close();
    } 
    else {
         
        http_response_code(405);
        $response['message'] = 'Method not allowed';
    }

    $conn->close();
} catch (Exception $e) {
     
    http_response_code(500);
    $response['message'] = $e->getMessage();
}

 
echo json_encode($response);
?>