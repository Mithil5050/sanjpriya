-- Drop the existing constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Add the new constraint with all supported categories
ALTER TABLE products ADD CONSTRAINT products_category_check 
CHECK (category IN ('kurtis', 'blouses', 'dresses', 'handbags', 'paithani-blouses'));
