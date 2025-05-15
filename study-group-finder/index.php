<?php
// /study-group-finder/index.php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if the user is logged in to customize navigation
$is_logged_in = isset($_SESSION['user_id']);
$user_full_name = $is_logged_in ? htmlspecialchars($_SESSION['full_name'] ?? 'User') : '';

// Define the base path for assets if your PHP file is in a subdirectory
// For example, if index.php is in /study-group-finder/ and style.css is in the same folder:
$base_path_css = ""; // Or "./"
$base_path_js = "";  // Or "./"
$base_path_auth = "../auth/"; // Path to auth folder from study-group-finder
$base_path_root = "../"; // Path to root from study-group-finder

// If your style.css is in the root, and index.php is in study-group-finder:
// $base_path_css = "../";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campus Hub - Study Group Finder</title>
    <link rel="stylesheet" href="<?php echo $base_path_css; ?>style.css" /> <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
    />
    
</head>
<body>
    <h1 style="color: #493628; font-family: Papyrus">Campus Hub</h1>
    <header>
        <ul class="nav-bar">
            <li><a href="<?php echo $base_path_root; ?>index.html">Home</a></li>
            <li><a href="<?php echo $base_path_root; ?>contact.html">Contact</a></li>
            <li><a href="<?php echo $base_path_root; ?>about.html">About</a></li>

            <?php if ($is_logged_in): ?>
                <li class="user-menu">
                    <a href="#"><?php echo $user_full_name; ?> &#9662;</a> <ul class="user-menu-dropdown">
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
        <section class="sec">Study Group Finder</section>
        <section class="option">
            <form id="filters-form">
                <input
                    id="searchInput"
                    type="text"
                    placeholder="Search study groups..."
                />
                <select id="filterSelect">
                    <option value="">Loading Subjects...</option>
                </select>
                <select id="sortSelect">
                    <option value="">Sort by</option>
                    <option value="member">Least Members</option>
                    <option value="members">Most Members</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                </select>
            </form>

            <div class="group-list grid">
                </div>
            <div class="loading" style="display: none;">Loading groups...</div>

            <a href="add-group.php" id="newbtn" role="button">Add New Study Group</a>

            <nav aria-label="Page navigation">
                <ul class="pagination">
                    </ul>
            </nav>
        </section>
    </main>

    <footer>
        <div class="footer">
            &copy; <?php echo date("Y"); ?> Campus Hub | Helping university students connect and succeed together.
        </div>
    </footer>

    <script src="<?php echo $base_path_js; ?>finder.js"></script> </body>
</html>