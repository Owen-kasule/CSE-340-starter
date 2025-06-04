-- 1) INSERT Tony Stark into account (account_id and account_type default)
INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

-- 2) UPDATE Tony Stark's account_type to 'Admin'
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_email = 'tony@starkent.com';

-- 3) DELETE Tony Stark's record
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 4) UPDATE GM Hummer's description via REPLACE
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
  AND inv_model = 'Hummer';

-- 5) SELECT "make", "model", classification_name for all "Sport" vehicles
SELECT
  i.inv_make,
  i.inv_model,
  c.classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6) Prepend '/vehicles' into inv_image and inv_thumbnail for all rows
UPDATE public.inventory
SET
  inv_image     = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');