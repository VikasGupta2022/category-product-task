CREATE TABLE product(
product_id SERIAL PRIMARY KEY NOT NULL,
product_name VARCHAR(255),
category_id SERIAL NOT NULL,
deleted VARCHAR(255) NOT NULL
);

