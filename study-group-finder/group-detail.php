<?php
// /study-group-finder/group-detail.php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$group_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$group_details = null;
$creator_user_id = null;
$is_creator = false;
$error_message = null;
$is_logged_in_for_page = isset($_SESSION['user_id']); // For conditional display

if ($group_id > 0) {
    // --- Database Configuration (same as my API) ---
    $db_host = 'localhost';
    $db_port = '3306';
    $db_name = 'coursenotes';
    $db_user = 'user1';
    $db_pass = 'pass1234';

    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, $db_user, $db_pass, $options);
        $stmt = $pdo->prepare("
            SELECT sg.id, sg.group_name, sg.meeting_times, sg.members_count, sg.description, sg.course_code, sg.user_id AS creator_user_id, c.department 
            FROM study_groups sg
            LEFT JOIN courses c ON sg.course_code = c.course_code
            WHERE sg.id = :group_id
        ");
        $stmt->bindParam(':group_id', $group_id, PDO::PARAM_INT);
        $stmt->execute();
        $group_details = $stmt->fetch();

        if ($group_details) {
            $creator_user_id = $group_details['creator_user_id'];
            if ($is_logged_in_for_page && $_SESSION['user_id'] == $creator_user_id) {
                $is_creator = true;
            }
        } else {
            $error_message = "Study group not found.";
        }
    } catch (PDOException $e) {
        error_log("Error fetching group details directly in group-detail.php: " . $e->getMessage());
        $error_message = "Could not load group details due to a server error.";
    }
} else {
    $error_message = "No group ID specified.";
}

// For navigation paths
$base_path_auth = "../auth/"; 
$base_path_root = "../"; 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo $group_details ? htmlspecialchars($group_details['group_name']) : 'Group Details'; ?> | Campus Hub</title>
    <link rel="stylesheet" href="style.css" /> 
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
  <link rel="stylesheet" href="group-detail.css"> 
</head>
<body>
    <h1 style="color: #493628; font-family: Papyrus; text-align:center;">Campus Hub</h1> <header>
        <ul class="nav-bar">
            <li><a href="<?php echo $base_path_root; ?>index.html">Home</a></li>
            <li><a href="<?php echo $base_path_root; ?>contact.html">Contact</a></li>
            <li><a href="<?php echo $base_path_root; ?>about.html">About</a></li>
            <?php if ($is_logged_in_for_page): ?>
                <li class="user-menu">
                    <a href="#"><?php echo htmlspecialchars($_SESSION['full_name'] ?? 'User'); ?> &#9662;</a>
                    <ul class="user-menu-dropdown">
                        <li><a href="<?php echo $base_path_auth; ?>logout.php">Logout</a></li>
                    </ul>
                </li>
            <?php else: ?>
                <li><a href="<?php echo $base_path_auth; ?>signup.php">Sign Up</a></li>
                <li><a href="<?php echo $base_path_auth; ?>login.php">Login</a></li>
            <?php endif; ?>
            
        </ul>
    </header>

    <main>
        <section class="sec">Study Group Details</section> <?php if ($error_message): ?>
            <section id="group-detail-error" style="text-align: center; background-color: #f5e7b2; padding: 30px; border-radius: 8px; margin-top:20px;">
                <p style="color: red; font-size: 1.1em;"><?php echo htmlspecialchars($error_message); ?></p>
                <a href="index.php" role="button" class="secondary">Back to Listings</a>
            </section>
        <?php elseif ($group_details): ?>
            <section id="group-detail"> 
                <h2 id="group-name"><?php echo htmlspecialchars($group_details['group_name']); ?></h2>
                <p><strong>Subject (Department):</strong> <span id="subject"><?php echo htmlspecialchars($group_details['department'] ?? 'N/A'); ?></span></p>
                <p><strong>Course Code:</strong> <span id="course-code"><?php echo htmlspecialchars($group_details['course_code'] ?? 'N/A'); ?></span></p>
                <p><strong>Meeting Times:</strong> <span id="meeting-times"><?php echo htmlspecialchars($group_details['meeting_times']); ?></span></p>
                <p><strong>Max Members:</strong> <span id="members-count"><?php echo htmlspecialchars($group_details['members_count']); ?></span></p>
                <p><strong>Description:</strong> <br><span id="description"><?php echo nl2br(htmlspecialchars($group_details['description'])); ?></span></p>

                <?php if ($is_creator): ?>
                <div class="actions">
                    <a id="edit-link" href="add-group.php?id=<?php echo $group_details['id']; ?>" class="contrast" role="button">Edit Group</a>
                    <button id="delete-button" class="secondary" data-groupid="<?php echo $group_details['id']; ?>">Delete Group</button>
                </div>
                <?php endif; ?>

                <section class="comments">
                    <h3>Comments (<span id="comment-count">0</span>)</h3>
                    <?php if ($is_logged_in_for_page): ?>
                        <form id="commentForm">
                             <input type="hidden" id="comment_group_id" value="<?php echo $group_details['id']; ?>">
                            <textarea id="comment_text" name="comment_text" placeholder="Share your thoughts or questions..." required rows="3"></textarea>
                            <button id="commentBtn" type="submit">Post Comment</button>
                            <small id="commentError" style="color:red; display:none; margin-top:5px;"></small>
                        </form>
                    <?php else: ?>
                        <p>Please <a href="<?php echo $base_path_auth; ?>login.php?redirect=<?php echo urlencode($_SERVER['REQUEST_URI']); ?>">log in</a> or <a href="<?php echo $base_path_auth; ?>signup.php?redirect=<?php echo urlencode($_SERVER['REQUEST_URI']); ?>">sign up</a> to leave a comment.</p>
                    <?php endif; ?>
                    
                    <div id="comments-list" style="margin-top: 20px;"> <p class="loading-comments">Loading comments...</p>
                    </div>
                </section>
                <a href="index.php" id="listingbtn" role="button" class="secondary">Back to Listings</a>
            </section>
        <?php else: ?>
             <section id="group-detail-loading" style="text-align: center; background-color: #f5e7b2; padding: 30px; border-radius: 8px; margin-top:20px;">
                <p>Loading group details...</p> 
             </section>
        <?php endif; ?>
    </main>

    <footer>
        <div class="footer-content"> &copy; <?php echo date("Y"); ?> Campus Hub | Helping university students connect and succeed together.
        </div>
    </footer>
    <script>
        const currentGroupId = <?php echo $group_id > 0 && $group_details ? $group_id : 'null'; ?>;
        const isLoggedIn = <?php echo $is_logged_in_for_page ? 'true' : 'false'; ?>;
    </script>
    <script src="group-detail.js"></script>
</body>
</html>
