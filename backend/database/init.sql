CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT now()
);


CREATE TABLE coffee_size (
    id SERIAL PRIMARY KEY,
    size_name TEXT NOT NULL UNIQUE
);

CREATE TABLE coffee (
    id SERIAL PRIMARY KEY,
    coffee_name TEXT NOT NULL,
    size_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (size_id) REFERENCES coffee_size(id)
);

CREATE TABLE coffee_order (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    coffee_order INTEGER[] NOT NULL,
    creation_date TIMESTAMP NOT NULL DEFAULT now(),
    order_date TIMESTAMP NOT NULL DEFAULT now(),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);