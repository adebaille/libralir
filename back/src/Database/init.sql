-- ============================================
-- LIBRALIR - Script de création des tables
-- PostgreSQL
-- ============================================

-- 1. USERS
CREATE TABLE users (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- 2. BOOKS (catalogue partagé, aucun propriétaire)
CREATE TABLE books (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    author          VARCHAR(255),
    total_pages     INT NOT NULL,
    google_books_id VARCHAR(50),
    isbn_13         VARCHAR(13),
    thumbnail_url   TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_books_total_pages CHECK (total_pages > 0),
    CONSTRAINT uq_books_google_books_id UNIQUE (google_books_id)
);

-- 3. CATEGORIES
CREATE TABLE categories (
    id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_categories_name UNIQUE (name)
);

-- 4. BOOK_CATEGORIES (pivot books <-> categories)
CREATE TABLE book_categories (
    book_id     INT NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT pk_book_categories PRIMARY KEY (book_id, category_id),
    CONSTRAINT fk_book_categories_book_id FOREIGN KEY (book_id)
        REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT fk_book_categories_category_id FOREIGN KEY (category_id)
        REFERENCES categories(id) ON DELETE CASCADE
);

-- 5. USER_BOOKS (relation utilisateur <-> livre : progression, statut)
CREATE TABLE user_books (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      INT NOT NULL,
    book_id      INT NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'to_read',
    current_page INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_books_user_book UNIQUE (user_id, book_id),
    CONSTRAINT chk_user_books_status CHECK (
        status IN ('to_read', 'in_progress', 'completed', 'paused', 'abandoned')
    ),
    CONSTRAINT chk_user_books_current_page CHECK (current_page >= 0),
    CONSTRAINT fk_user_books_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_books_book_id FOREIGN KEY (book_id)
        REFERENCES books(id) ON DELETE CASCADE
);

-- 6. READING_SESSIONS
CREATE TABLE reading_sessions (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id          INT NOT NULL,
    book_id          INT NOT NULL,
    pages_read       INT NOT NULL,
    session_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INT,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_reading_sessions_pages CHECK (pages_read > 0),
    CONSTRAINT chk_reading_sessions_duration CHECK (duration_minutes > 0),
    CONSTRAINT fk_reading_sessions_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reading_sessions_book_id FOREIGN KEY (book_id)
        REFERENCES books(id) ON DELETE CASCADE
);

-- 7. BADGES
CREATE TABLE badges (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    condition_type  VARCHAR(50) NOT NULL,
    condition_value INT NOT NULL,
    CONSTRAINT uq_badges_name UNIQUE (name)
);

-- 8. USER_BADGES
CREATE TABLE user_badges (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INT NOT NULL,
    badge_id    INT NOT NULL,
    obtained_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_badges_user_badge UNIQUE (user_id, badge_id),
    CONSTRAINT fk_user_badges_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_badges_badge_id FOREIGN KEY (badge_id)
        REFERENCES badges(id) ON DELETE CASCADE
);

-- 9. MONTHLY_CHALLENGES
CREATE TABLE monthly_challenges (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    month        INT NOT NULL,
    year         INT NOT NULL,
    target_pages INT NOT NULL,
    CONSTRAINT chk_monthly_challenges_month CHECK (month BETWEEN 1 AND 12),
    CONSTRAINT uq_monthly_challenges_month_year UNIQUE (month, year)
);

-- 10. USER_MONTHLY_CHALLENGES
CREATE TABLE user_monthly_challenges (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      INT NOT NULL,
    challenge_id INT NOT NULL,
    pages_read   INT NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_user_monthly_challenges UNIQUE (user_id, challenge_id),
    CONSTRAINT fk_user_monthly_challenges_user_id FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_monthly_challenges_challenge_id FOREIGN KEY (challenge_id)
        REFERENCES monthly_challenges(id) ON DELETE CASCADE
);