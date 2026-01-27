-- MySQL schema for Legion of Titans (shared hosting, PHP + MySQL)

CREATE TABLE IF NOT EXISTS lot_submissions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  type ENUM('thanks','story') NOT NULL,
  name VARCHAR(80) NULL,
  email VARCHAR(120) NULL,
  message TEXT NOT NULL,
  consent TINYINT(1) NOT NULL DEFAULT 1,
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  published_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_status_type_pub (status, type, published_at),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lot_rate_limits (
  `key` VARCHAR(190) NOT NULL,
  `count` INT UNSIGNED NOT NULL,
  reset_at INT UNSIGNED NOT NULL,
  PRIMARY KEY (`key`),
  KEY idx_reset_at (reset_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

