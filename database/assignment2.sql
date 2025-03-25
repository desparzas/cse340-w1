-- Query 1
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
Actualizar el tipo de cuenta de Tony Stark a "Admin":


-- Query 2
UPDATE account 
SET account_type = 'Admin' 
WHERE email = 'tony@starkent.com';

-- Query 3
DELETE FROM account 
WHERE email = 'tony@starkent.com';
Actualizar la descripción de "GM Hummer" usando REPLACE():

-- Query 4
UPDATE inventory 
SET description = REPLACE(description, 'small interiors', 'a huge interior') 
WHERE model = 'GM Hummer';

-- Query 5
SELECT i.make, i.model, c.classification_name 
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Query 6
UPDATE inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');