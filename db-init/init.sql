CREATE TABLE actors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    country_origin VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    actor_id INTEGER REFERENCES actors(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE legal_frameworks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    impact_level INTEGER CHECK (impact_level BETWEEN 1 AND 5),
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user'

);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    event_date DATE DEFAULT CURRENT_DATE,
    actor_id INTEGER REFERENCES actors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);