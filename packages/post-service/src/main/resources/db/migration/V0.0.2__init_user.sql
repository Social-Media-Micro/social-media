CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  user_name VARCHAR(50),
  version VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_user_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.first_name <> OLD.first_name OR  NEW.last_name <> OLD.last_name OR  NEW.user_name <> OLD.user_name  THEN
    NEW.updated_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_updated_at();