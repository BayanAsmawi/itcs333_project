<?php
// db_functions.php - Database operations for the marketplace

require_once 'config.php';

// Item operations
function getAllItems($limit = 10, $offset = 0, $category = null, $sort = null) {
    $conn = connectDB();
    
    $sql = "SELECT i.*, c.name AS category_name, u.username 
            FROM items i 
            JOIN categories c ON i.category_id = c.category_id 
            JOIN users u ON i.user_id = u.user_id 
            WHERE i.status = 'available'";
    
    // Add category filter if provided
    if ($category) {
        $category = $conn->real_escape_string($category);
        $sql .= " AND c.name = '$category'";
    }
    
    // Add sorting
    if ($sort) {
        switch ($sort) {
            case 'price_low':
                $sql .= " ORDER BY i.price ASC";
                break;
            case 'price_high':
                $sql .= " ORDER BY i.price DESC";
                break;
            case 'newest':
                $sql .= " ORDER BY i.created_at DESC";
                break;
            default:
                $sql .= " ORDER BY i.created_at DESC";
        }
    } else {
        $sql .= " ORDER BY i.created_at DESC";
    }
    
    // Add pagination
    $sql .= " LIMIT $limit OFFSET $offset";
    
    $result = $conn->query($sql);
    $items = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Get the primary image for the item
            $row['image'] = getItemPrimaryImage($row['item_id']);
            $items[] = $row;
        }
    }
    
    closeDB($conn);
    return $items;
}

function countItems($category = null) {
    $conn = connectDB();
    
    $sql = "SELECT COUNT(*) as total FROM items i 
            JOIN categories c ON i.category_id = c.category_id 
            WHERE i.status = 'available'";
    
    // Add category filter if provided
    if ($category) {
        $category = $conn->real_escape_string($category);
        $sql .= " AND c.name = '$category'";
    }
    
    $result = $conn->query($sql);
    $count = $result->fetch_assoc()['total'];
    
    closeDB($conn);
    return $count;
}

function getItemById($itemId) {
    $conn = connectDB();
    
    $itemId = $conn->real_escape_string($itemId);
    
    $sql = "SELECT i.*, c.name AS category_name, u.username, u.email 
            FROM items i 
            JOIN categories c ON i.category_id = c.category_id 
            JOIN users u ON i.user_id = u.user_id 
            WHERE i.item_id = '$itemId'";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $item = $result->fetch_assoc();
        
        // Get images for the item
        $item['images'] = getItemImages($itemId);
        
        // Get comments for the item
        $item['comments'] = getItemComments($itemId);
        
        closeDB($conn);
        return $item;
    }
    
    closeDB($conn);
    return null;
}

function searchItems($keyword) {
    $conn = connectDB();
    
    $keyword = $conn->real_escape_string($keyword);
    
    $sql = "SELECT i.*, c.name AS category_name, u.username 
            FROM items i 
            JOIN categories c ON i.category_id = c.category_id 
            JOIN users u ON i.user_id = u.user_id 
            WHERE i.status = 'available' 
            AND (i.title LIKE '%$keyword%' OR i.description LIKE '%$keyword%')
            ORDER BY i.created_at DESC";
    
    $result = $conn->query($sql);
    $items = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Get the primary image for the item
            $row['image'] = getItemPrimaryImage($row['item_id']);
            $items[] = $row;
        }
    }
    
    closeDB($conn);
    return $items;
}

function createItem($title, $description, $price, $category_id, $user_id) {
    $conn = connectDB();
    
    $title = $conn->real_escape_string($title);
    $description = $conn->real_escape_string($description);
    $price = $conn->real_escape_string($price);
    $category_id = $conn->real_escape_string($category_id);
    $user_id = $conn->real_escape_string($user_id);
    
    $sql = "INSERT INTO items (title, description, price, category_id, user_id) 
            VALUES ('$title', '$description', '$price', '$category_id', '$user_id')";
    
    if ($conn->query($sql) === TRUE) {
        $item_id = $conn->insert_id;
        closeDB($conn);
        return $item_id;
    } else {
        closeDB($conn);
        return false;
    }
}

function updateItem($item_id, $title, $description, $price, $category_id) {
    $conn = connectDB();
    
    $item_id = $conn->real_escape_string($item_id);
    $title = $conn->real_escape_string($title);
    $description = $conn->real_escape_string($description);
    $price = $conn->real_escape_string($price);
    $category_id = $conn->real_escape_string($category_id);
    
    $sql = "UPDATE items 
            SET title = '$title', description = '$description', price = '$price', category_id = '$category_id' 
            WHERE item_id = '$item_id'";
    
    $result = $conn->query($sql);
    closeDB($conn);
    
    return $result;
}

function deleteItem($item_id) {
    $conn = connectDB();
    
    $item_id = $conn->real_escape_string($item_id);
    
    $sql = "DELETE FROM items WHERE item_id = '$item_id'";
    
    $result = $conn->query($sql);
    closeDB($conn);
    
    return $result;
}

// Category operations
function getAllCategories() {
    $conn = connectDB();
    
    $sql = "SELECT * FROM categories ORDER BY name ASC";
    
    $result = $conn->query($sql);
    $categories = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
    }
    
    closeDB($conn);
    return $categories;
}

function getCategoryById($categoryId) {
    $conn = connectDB();
    
    $categoryId = $conn->real_escape_string($categoryId);
    
    $sql = "SELECT * FROM categories WHERE category_id = '$categoryId'";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $category = $result->fetch_assoc();
        closeDB($conn);
        return $category;
    }
    
    closeDB($conn);
    return null;
}

// Comment operations
function getItemComments($itemId) {
    $conn = connectDB();
    
    $itemId = $conn->real_escape_string($itemId);
    
    $sql = "SELECT c.*, u.username 
            FROM comments c 
            JOIN users u ON c.user_id = u.user_id 
            WHERE c.item_id = '$itemId' 
            ORDER BY c.created_at DESC";
    
    $result = $conn->query($sql);
    $comments = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $comments[] = $row;
        }
    }
    
    closeDB($conn);
    return $comments;
}

function addComment($itemId, $userId, $comment) {
    $conn = connectDB();
    
    $itemId = $conn->real_escape_string($itemId);
    $userId = $conn->real_escape_string($userId);
    $comment = $conn->real_escape_string($comment);
    
    $sql = "INSERT INTO comments (item_id, user_id, comment) 
            VALUES ('$itemId', '$userId', '$comment')";
    
    $result = $conn->query($sql);
    closeDB($conn);
    
    return $result;
}

// Image operations
function getItemImages($itemId) {
    $conn = connectDB();
    
    $itemId = $conn->real_escape_string($itemId);
    
    $sql = "SELECT * FROM images WHERE item_id = '$itemId' ORDER BY is_primary DESC";
    
    $result = $conn->query($sql);
    $images = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $images[] = $row;
        }
    }
    
    closeDB($conn);
    return $images;
}

function getItemPrimaryImage($itemId) {
    $conn = connectDB();
    
    $itemId = $conn->real_escape_string($itemId);
    
    $sql = "SELECT * FROM images 
            WHERE item_id = '$itemId' AND is_primary = 1 
            LIMIT 1";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $image = $result->fetch_assoc();
        closeDB($conn);
        return $image['image_path'];
    }
    
    closeDB($conn);
    return 'images/default.jpg'; // Default image if no primary image found
}

function addItemImage($itemId, $imagePath, $isPrimary = false) {
    $conn = connectDB();
    
    $itemId = $conn->real_escape_string($itemId);
    $imagePath = $conn->real_escape_string($imagePath);
    $isPrimary = $isPrimary ? 1 : 0;
    
    // If this is a primary image, reset other primary images
    if ($isPrimary) {
        $resetSql = "UPDATE images SET is_primary = 0 WHERE item_id = '$itemId'";
        $conn->query($resetSql);
    }
    
    $sql = "INSERT INTO images (item_id, image_path, is_primary) 
            VALUES ('$itemId', '$imagePath', '$isPrimary')";
    
    $result = $conn->query($sql);
    closeDB($conn);
    
    return $result;
}

// User operations
function getUserById($userId) {
    $conn = connectDB();
    
    $userId = $conn->real_escape_string($userId);
    
    $sql = "SELECT user_id, username, email, first_name, last_name, created_at 
            FROM users 
            WHERE user_id = '$userId'";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        closeDB($conn);
        return $user;
    }
    
    closeDB($conn);
    return null;
}

function getUserByEmail($email) {
    $conn = connectDB();
    
    $email = $conn->real_escape_string($email);
    
    $sql = "SELECT user_id, username, email, password, first_name, last_name 
            FROM users 
            WHERE email = '$email'";
    
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        closeDB($conn);
        return $user;
    }
    
    closeDB($conn);
    return null;
}

function createUser($username, $email, $password, $firstName = '', $lastName = '') {
    $conn = connectDB();
    
    $username = $conn->real_escape_string($username);
    $email = $conn->real_escape_string($email);
    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $firstName = $conn->real_escape_string($firstName);
    $lastName = $conn->real_escape_string($lastName);
    
    $sql = "INSERT INTO users (username, email, password, first_name, last_name) 
            VALUES ('$username', '$email', '$hashedPassword', '$firstName', '$lastName')";
    
    if ($conn->query($sql) === TRUE) {
        $userId = $conn->insert_id;
        closeDB($conn);
        return $userId;
    } else {
        closeDB($conn);
        return false;
    }
}

function getUserItems($userId, $status = null) {
    $conn = connectDB();
    
    $userId = $conn->real_escape_string($userId);
    
    $sql = "SELECT i.*, c.name AS category_name 
            FROM items i 
            JOIN categories c ON i.category_id = c.category_id 
            WHERE i.user_id = '$userId'";
    
    if ($status) {
        $status = $conn->real_escape_string($status);
        $sql .= " AND i.status = '$status'";
    }
    
    $sql .= " ORDER BY i.created_at DESC";
    
    $result = $conn->query($sql);
    $items = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Get the primary image for the item
            $row['image'] = getItemPrimaryImage($row['item_id']);
            $items[] = $row;
        }
    }
    
    closeDB($conn);
    return $items;
}