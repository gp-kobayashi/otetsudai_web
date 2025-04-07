CREATE type tag_enum AS ENUM('Video', 'Text', 'Audio','programming', 'design',  'other');

CREATE TABLE recruitments (
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    tag tag_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE comments(
    id SERIAL PRIMARY KEY,
    recruitment_id INT NOT NULL,
    FOREIGN KEY (recruitment_id) REFERENCES recruitments(id),
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_groups
BEFORE UPDATE ON recruitments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_chats
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();