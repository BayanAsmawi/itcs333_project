-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2025 at 11:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `course_reviews`
--

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `course_level` varchar(255) NOT NULL,
  `stars` int(255) NOT NULL,
  `review` varchar(255) NOT NULL,
  `coursename` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_name`, `course_level`, `stars`, `review`, `coursename`, `created_at`) VALUES
(57, 'Zainab', '3', 4, 'It\'s was very good', 'ITCS 333', '2025-05-14 11:31:47'),
(58, 'Ali', '1', 3, 'It\'s was good, But it\'s hard', 'ITCS 114', '2025-05-14 11:32:45'),
(59, 'Noora', '3', 5, 'Woow.', 'ITCS 333', '2025-05-14 11:36:10'),
(60, 'Jaffer', '1', 1, 'It\'s very very hard', 'MATHS 101', '2025-05-14 11:37:33'),
(61, 'Fatima', '2', 4, 'It\'s good.', 'STAT 273', '2025-05-14 11:39:11'),
(62, 'Hadi', '3', 4, 'I like it.', 'ITCS 333', '2025-05-14 11:40:32'),
(63, 'Anwar', '1', 2, 'His timing is not appropriate.', 'STAT 273', '2025-05-14 11:48:19'),
(64, 'Hamed', '4', 5, 'The professor explains the subject excellently.', 'ITC3 333', '2025-05-14 11:50:20'),
(65, 'Yousif', '2', 4, 'I benefited from it a lot.', 'STAT 273', '2025-05-14 11:52:09'),
(66, 'Mohamad', '2', 3, 'The lecture times were not convenient.', 'STAT 273', '2025-05-14 11:53:51'),
(67, 'Sajad', '3', 4, 'It\'s good', 'STAT 273', '2025-05-14 11:55:08'),
(68, 'Ahmed', '4', 5, 'I like it.', 'ITCS 496', '2025-05-14 12:14:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
