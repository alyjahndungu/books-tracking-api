# To optimize the SQL query and make it faster, I would take the following approaches:

### 1. Indexing: Ensure that the customer_id and order_date columns are indexed appropriately. Indexing allows the database to quickly locate the relevant rows, reducing the search time. Create an index on the customer_id column and another index on the order_date column.

### 2. Limit the selected columns: Instead of selecting all columns, I would specify only the required columns in the SELECT statement. This reduces the amount of data that needs to be retrieved from the disk and can significantly improve performance.

### 3. Use descending index: If the order of the order_date column is sorted in descending order (newest first), I would create a descending index on the order_date column. This can be done by specifying the DESC keyword when creating the index.

### Result

## SELECT order_id, order_date FROM orders WHERE customer_id = 123 ORDER BY order_date DESC;
