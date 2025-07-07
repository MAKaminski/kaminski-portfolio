CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image_url TEXT,
  tech_stack TEXT[]
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE project_skills (
  project_id INTEGER REFERENCES projects(id),
  skill_id INTEGER REFERENCES skills(id),
  PRIMARY KEY(project_id, skill_id)
);

CREATE TABLE chatbot_sessions (
  id SERIAL PRIMARY KEY,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  user_identifier TEXT
);

CREATE TABLE chatbot_messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES chatbot_sessions(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE vectors (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES chatbot_messages(id),
  embedding vector(1536),
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
