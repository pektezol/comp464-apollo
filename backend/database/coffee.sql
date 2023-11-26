TRUNCATE TABLE coffee_size, coffee RESTART IDENTITY;

INSERT INTO coffee_size(size_name) VALUES 
('Small'),
('Tall'),
('Grande');

INSERT INTO coffee(coffee_name,size_id,price) VALUES
('Cappuccino', 1, 425),
('Cappuccino', 2, 495),
('Cappuccino', 3, 525),
('Latte', 1, 425),
('Latte', 2, 495),
('Latte', 3, 525),
('Mocha', 1, 505),
('Mocha', 2, 575),
('Mocha', 3, 605),
('Americano', 1, 345),
('Americano', 2, 395),
('Americano', 3, 425);