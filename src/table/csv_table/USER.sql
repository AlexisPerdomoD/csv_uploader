CREATE TABLE 
    users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        age INTEGER ,
        role VARCHAR(5) DEFAULT('user')
    );

CREATE INDEX idx_email ON users (email);
