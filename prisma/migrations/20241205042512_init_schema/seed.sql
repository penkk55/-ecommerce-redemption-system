CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO products (id, name, price, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'Product 1', 100.00, NOW(), NOW()),
  (uuid_generate_v4(), 'Product 2', 200.00, NOW(), NOW()),
  (uuid_generate_v4(), 'Product 3', 300.00, NOW(), NOW());

INSERT INTO stocks (id, product_id, code, quantity, status, created_at, updated_at)
VALUES
  (uuid_generate_v4(), (SELECT id FROM products WHERE name = 'Product 1' LIMIT 1), 'CODE123', 50, 'IN_STOCK', NOW(), NOW()),
  (uuid_generate_v4(), (SELECT id FROM products WHERE name = 'Product 2' LIMIT 1), 'CODE124', 30, 'IN_STOCK', NOW(), NOW()),
  (uuid_generate_v4(), (SELECT id FROM products WHERE name = 'Product 3' LIMIT 1), 'CODE125', 20, 'RESERVED', NOW(), NOW());
  
INSERT INTO customers (id, name, email, balance, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'Customer 1', 'customer1@example.com', 500.00, NOW(), NOW()),
  (uuid_generate_v4(), 'Customer 2', 'customer2@example.com', 1000.00, NOW(), NOW()),
  (uuid_generate_v4(), 'Customer 3', 'customer3@example.com', 200.00, NOW(), NOW());
