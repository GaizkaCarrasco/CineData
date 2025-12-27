CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  external_id INT UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  year INT,
  image_url VARCHAR(500),
  genre VARCHAR(100),
  stars DECIMAL(3, 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
