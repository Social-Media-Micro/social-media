CREATE TABLE IF NOT EXISTS post (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  total_likes BIGINT DEFAULT 0,
  total_comments BIGINT DEFAULT 0,
  total_shares BIGINT DEFAULT 0,
  total_saves BIGINT DEFAULT 0,
  status VARCHAR(255) DEFAULT 'ANALYSIS',
  user_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_post_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.content <> OLD.content THEN
    NEW.updated_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_updated_at_trigger
BEFORE UPDATE ON post
FOR EACH ROW
EXECUTE FUNCTION update_post_updated_at();