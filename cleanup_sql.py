import re

fpath = 'c:/Users/medja/Downloads/ecommerce_21_03_2026/ecommerce_10_03_2026/ecommerce/ecommerce/insertion.sql'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for INSERT INTO products (id, name, brand, category, gender, description, image_url, attributes)
# We want to replace the description (6th value) with NULL
pattern = r"(INSERT INTO products \(id, name, brand, category, gender, description, image_url, attributes\) VALUES\s*\(\d+,\s*'[^']*',\s*'[^']*',\s*'[^']*',\s*'[^']*',)\s*'[^']*'\s*(,\s*'[^']*',\s*'{[^']*}'\));"

new_content = re.sub(pattern, r"\1 NULL\2;", content)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully cleaned insertion.sql (set description to NULL for all products).")
