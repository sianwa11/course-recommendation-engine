CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL,
    industry TEXT NOT NULL,
    company_size TEXT NOT NULL,
    seniority TEXT NOT NULL,
    stated_goal TEXT NOT NULL
);

CREATE TYPE seniority_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    level seniority_level NOT NULL,
    duration_mins INTEGER NOT NULL
);

CREATE TABLE course_skills (
    course_id INTEGER REFERENCES courses(id),
    skill TEXT NOT NULL
);

CREATE TABLE course_prerequisites (
    course_id INTEGER REFERENCES courses(id),
    prerequisite_course_id INTEGER REFERENCES courses(id)
);

CREATE TYPE event_category AS ENUM ('started', 'completed', 'dropped');
CREATE TABLE usage_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(id),
    event_type event_category NOT NULL,
    progress_pct INTEGER,
    quiz_score INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE survey_responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    skill_gap TEXT,
    goal TEXT,
    preferred_topic TEXT,
    confidence INTEGER
);