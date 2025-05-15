<?php
// /study-group-finder/add-group.php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if the user is logged in.
// $_SESSION['user_id'] should be set during the login process.
if (!isset($_SESSION['user_id'])) {
    // User is not logged in. Redirect to the login page.
    // Adjust the path to your login page if it's different.
    header('Location: ../auth/login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}

// The user is logged in. We can store user_id if needed by JS, but it's better handled by API via session.
// $logged_in_user_id = $_SESSION['user_id'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add / Edit Study Group | Campus Hub</title>
    <link rel="stylesheet" href="style.css"> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
</head>

<body>
    <h1 style="color: #493628; font-family: Papyrus">Campus Hub</h1>

    <header>
        <ul class="nav-bar">
            <li><a href="../index.html">Home</a></li>
            <li><a href="../contact.html">Contact</a></li>
            <li><a href="../about.html">About</a></li>
            <?php if (isset($_SESSION['user_id'])): ?>
                <li><a href="../auth/logout.php">Logout</a></li> <?php else: ?>
                <li><a href="../auth/signup.php">Sign Up</a></li>
                <li><a href="../auth/login.php">Login</a></li>
            <?php endif; ?>
            
        </ul>
    </header>

    <main>
        <section class="sec">Add New Study Group</section> <form id="groupForm">
            <label for="group-name">Group Name</label>
            <input id="group-name" placeholder="e.g. Data Structures Midterm Prep" required>

            <label for="subject">Subject (Department)</label>
            <select id="subject" required>
                <option value="">Loading subjects...</option>
                </select>

            <label for="meeting-times">Meeting Times</label>
            <input id="meeting-times" placeholder="e.g. Mondays & Wednesdays at 6 PM, Online" required>

            <label for="members-count">Max Members (including you)</label>
            <input id="members-count" type="number" min="2" placeholder="e.g. 5" required value="5"> <label for="description">Group Description</label>
            <textarea id="description" placeholder="e.g. Focusing on practice problems for chapters 1-5. Using Discord for communication." required></textarea>

            <button type="submit" id="submitBtn">Create Group</button>
            <a href="index.php" id="cancelBtn" role="button" class="secondary">Cancel</a> </form>
    </main>

    <footer>
        <div class="footer">
            &copy; <?php echo date("Y"); ?> Campus Hub | Helping university students connect and succeed together.
        </div>
    </footer>

    <script src="add-group.js"></script> 
</body>
</html>
