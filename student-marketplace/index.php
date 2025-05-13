<?php
// index.php - Main page of the Campus Hub marketplace
require_once 'db_functions.php';

// Get filter parameters
$category = isset($_GET['category']) ? $_GET['category'] : null;
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';
$search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : null;

// Pagination
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$itemsPerPage = 8;
$offset = ($page - 1) * $itemsPerPage;

// Get items from database
if ($search) {
    $items = searchItems($search);
    $totalItems = count($items);
} else {
    $items = getAllItems($itemsPerPage, $offset, $category, $sort);
    $totalItems = countItems($category);
}

// Calculate total pages
$totalPages = ceil($totalItems / $itemsPerPage);

// Get all categories for filter dropdown
$categories = getAllCategories();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Student Marketplace</title>
  <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css" />
  <link rel="stylesheet" href="stylee.css" />
</head>
<body>
  <h1 style="color: #493628; font-family: Papyrus">Campus Hub</h1> 
  <nav>
    <strong>Student Marketplace</strong>
    <a href="create.php">+ Add New Item</a>
  </nav>
  
  <header>
    <ul class="nav-bar">
      <li><a href="index.php">Home</a></li>
      <li><a href="contact.php">Contact</a></li>
      <li><a href="about.php">About</a></li>
      <form action="index.php" method="GET">
        <input class="search" id="search" name="search" type="text" placeholder="Search.." 
               value="<?php echo isset($_GET['search']) ? htmlspecialchars($_GET['search']) : ''; ?>" />
      </form>
    </ul>
  </header>

  <main class="container">
    <section>
      <div class="filters">
        <form action="index.php" method="GET" id="filterForm">
          <select name="category" onchange="document.getElementById('filterForm').submit();">
            <option value="">All Categories</option>
            <?php foreach ($categories as $cat): ?>
              <option value="<?php echo htmlspecialchars($cat['name']); ?>" 
                      <?php echo ($category == $cat['name']) ? 'selected' : ''; ?>>
                <?php echo htmlspecialchars($cat['name']); ?>
              </option>
            <?php endforeach; ?>
          </select>
          
          <select name="sort" onchange="document.getElementById('filterForm').submit();">
            <option value="newest" <?php echo ($sort == 'newest') ? 'selected' : ''; ?>>Newest First</option>
            <option value="price_low" <?php echo ($sort == 'price_low') ? 'selected' : ''; ?>>Price: Low to High</option>
            <option value="price_high" <?php echo ($sort == 'price_high') ? 'selected' : ''; ?>>Price: High to Low</option>
          </select>
        </form>
      </div>
    </section>

    <section class="grid">
      <?php if (count($items) > 0): ?>
        <?php foreach ($items as $item): ?>
          <article>
            <h2><?php echo htmlspecialchars($item['title']); ?></h2>
            <p>$<?php echo htmlspecialchars(number_format($item['price'], 2)); ?></p>
            <p><?php echo htmlspecialchars(substr($item['description'], 0, 100)) . '...'; ?></p>
            <p><small>Category: <?php echo htmlspecialchars($item['category_name']); ?></small></p>
            <a href="detail.php?id=<?php echo $item['item_id']; ?>">View Details</a>
          </article>
        <?php endforeach; ?>
      <?php else: ?>
        <article>
          <p>No items found. Try a different search or category.</p>
        </article>
      <?php endif; ?>
    </section>

    <?php if ($totalPages > 1): ?>
      <nav class="pagination">
        <?php if ($page > 1): ?>
          <a href="?page=<?php echo ($page - 1); ?><?php echo $category ? '&category=' . urlencode($category) : ''; ?><?php echo $sort ? '&sort=' . urlencode($sort) : ''; ?>">Previous</a>
        <?php endif; ?>
        
        <?php for ($i = 1; $i <= $totalPages; $i++): ?>
          <a href="?page=<?php echo $i; ?><?php echo $category ? '&category=' . urlencode($category) : ''; ?><?php echo $sort ? '&sort=' . urlencode($sort) : ''; ?>" 
             <?php echo ($page == $i) ? 'aria-current="page"' : ''; ?>>
            <?php echo $i; ?>
          </a>
        <?php endfor; ?>
        
        <?php if ($page < $totalPages): ?>
          <a href="?page=<?php echo ($page + 1); ?><?php echo $category ? '&category=' . urlencode($category) : ''; ?><?php echo $sort ? '&sort=' . urlencode($sort) : ''; ?>">Next</a>
        <?php endif; ?>
      </nav>
    <?php endif; ?>
  </main>

  <footer>
    <small>&copy; 2025 Campus Marketplace</small>
  </footer>
</body>
</html>