INSERT INTO users (id, name, email, password, is_admin)
SELECT 0, 'admin', 'root@localhost', 'asdasd', 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 0);
