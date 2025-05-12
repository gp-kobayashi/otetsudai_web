CREATE type status_enum AS ENUM('募集中','対応中','完了','キャンセル','期限切れ');

ALTER TABLE recruitments
ADD COLUMN status status_enum NOT NULL DEFAULT '募集中'