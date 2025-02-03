CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    title text,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id),
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    text text,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_groups
BEFORE UPDATE ON groups
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_chats
BEFORE UPDATE ON chats
FOR EACH ROW EXECUTE FUNCTION update_timestamp();