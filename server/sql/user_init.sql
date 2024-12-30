-- Enable foreign key feature
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO categories (id, name) VALUES (0, 'default');

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) DEFAULT '',
    description TEXT DEFAULT '',
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    landscape BOOLEAN DEFAULT NULL,
    category_id INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_name CHAR(36),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

COMMIT;
