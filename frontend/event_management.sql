--
-- Database: `event_management`
--

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` VARCHAR(20) NULL DEFAULT NULL,
  `password_hash` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` VARCHAR(255) NULL DEFAULT NULL,
  `role` ENUM('organizer','attendee','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'attendee',
  `is_suspended` TINYINT(1) DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_companies`
--

DROP TABLE IF EXISTS `event_companies`;
CREATE TABLE IF NOT EXISTS `event_companies` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `organizer_id` INT NOT NULL,
  `title` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` TEXT COLLATE utf8mb4_unicode_ci,
  `venue` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` INT NOT NULL,
  `ticket_price` DECIMAL(10,2) NOT NULL,
  `location` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` DATETIME NOT NULL,
  `STATUS` ENUM('pending','started','completed','suspended') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_events_organizer_status` (`organizer_id`, `STATUS`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promo_codes`
--

DROP TABLE IF EXISTS `promo_codes`;
CREATE TABLE IF NOT EXISTS `promo_codes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` ENUM('percentage', 'fixed', 'ticket') COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` DECIMAL(10, 2) NOT NULL,
  `max_uses` INT NULL DEFAULT NULL,
  `used_count` INT NOT NULL DEFAULT '0',
  `valid_from` DATETIME NOT NULL,
  `valid_until` DATETIME NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT '1',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `promo_codes_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10, 2) DEFAULT '0.00',
  `final_amount` DECIMAL(10, 2) NULL DEFAULT NULL,
  `promo_code_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `status` ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes`(`id`)
);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `attendee_id` INT NOT NULL,
  `qr_code` VARCHAR(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchase_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('valid','used','expired') COLLATE utf8mb4_unicode_ci DEFAULT 'valid',
  `check_in_lat` DECIMAL(10, 7) NULL DEFAULT NULL,
  `check_in_lng` DECIMAL(10, 7) NULL DEFAULT NULL,
  `checked_in_at` TIMESTAMP NULL DEFAULT NULL,
  `check_in_ip` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `qr_code` (`qr_code`),
  KEY `event_id` (`event_id`),
  KEY `attendee_id` (`attendee_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `method` ENUM('card','upi','net_banking', 'stripe') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'stripe',
  `status` ENUM('pending','success','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `transaction_id` VARCHAR(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_verified` TINYINT(1) DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount_redemptions`
--

DROP TABLE IF EXISTS `discount_redemptions`;
CREATE TABLE IF NOT EXISTS `discount_redemptions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `promo_code_id` BIGINT UNSIGNED NOT NULL,
  `order_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `discount_amount` DECIMAL(10, 2) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `discount_redemptions_promo_code_id_foreign` (`promo_code_id`),
  KEY `discount_redemptions_order_id_foreign` (`order_id`),
  KEY `discount_redemptions_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `attendee_id` INT NOT NULL,
  `rating` TINYINT DEFAULT NULL,
  `comment` TEXT COLLATE utf8mb4_unicode_ci,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `attendee_id` (`attendee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
CREATE TABLE IF NOT EXISTS `reports` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `organizer_id` INT NOT NULL,
  `type` ENUM('event','participant') COLLATE utf8mb4_unicode_ci NOT NULL,
  `format` ENUM('csv','pdf') COLLATE utf8mb4_unicode_ci NOT NULL,
  `generated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `file_path` VARCHAR(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `organizer_id` (`organizer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `TYPE` ENUM('email','sms') COLLATE utf8mb4_unicode_ci NOT NULL,
  `SUBJECT` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  `sent_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `STATUS` ENUM('sent','failed') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
CREATE TABLE IF NOT EXISTS `logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('authentication','event','payment','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` INT DEFAULT NULL,
  `event_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `api_keys`
--

DROP TABLE IF EXISTS `api_keys`;
CREATE TABLE IF NOT EXISTS `api_keys` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Service name',
  `api_key` VARCHAR(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_used` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;