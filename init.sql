-- Initialize the database with the test table
CREATE TABLE IF NOT EXISTS test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO test_table (name, email, description) VALUES
('John Doe', 'john@example.com', 'Sample test record'),
('Jane Smith', 'jane@example.com', 'Another test record'),
('Bob Johnson', 'bob@example.com', 'Third test record');