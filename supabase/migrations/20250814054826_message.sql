CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    sender_id uuid NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES profiles(id),
    receiver_id uuid NOT NULL,
    FOREIGN KEY (receiver_id) REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_messages
BEFORE UPDATE ON messages
FOR EACH ROW EXECUTE FUNCTION update_timestamp();