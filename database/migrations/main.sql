/* --------------------------------------------------------------------
*
* WORKS ON POSTGRES ONLY !
*
--------------------------------------------------------------------*/


/* --------------------------------------------------------------------
*
* TABLE users
*
--------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS users(
	id INT NOT NULL PRIMARY KEY
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);




/* --------------------------------------------------------------------
*
* TABLE boards
*
--------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS boards(
	id INT NOT NULL PRIMARY KEY
);

ALTER TABLE boards ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE boards ADD COLUMN IF NOT EXISTS slug VARCHAR(150);
ALTER TABLE boards ADD COLUMN IF NOT EXISTS description VARCHAR(150);
ALTER TABLE boards ADD COLUMN IF NOT EXISTS folder VARCHAR(150);
ALTER TABLE boards ADD COLUMN IF NOT EXISTS image_path VARCHAR(255);
ALTER TABLE boards ADD COLUMN IF NOT EXISTS ip VARCHAR(50);

ALTER TABLE boards ADD COLUMN IF NOT EXISTS created_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE boards ADD COLUMN IF NOT EXISTS updated_at DATE DEFAULT CURRENT_DATE;




/* --------------------------------------------------------------------
*
* TABLE threads
*
--------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS threads(
	id INT NOT NULL PRIMARY KEY
);

ALTER TABLE threads ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE threads ADD COLUMN IF NOT EXISTS slug VARCHAR(150);
ALTER TABLE threads ADD COLUMN IF NOT EXISTS content VARCHAR(255);
ALTER TABLE threads ADD COLUMN IF NOT EXISTS folder VARCHAR(150);
ALTER TABLE threads ADD COLUMN IF NOT EXISTS avatar VARCHAR(150);
ALTER TABLE threads ADD COLUMN IF NOT EXISTS image_path VARCHAR(150);
ALTER TABLE threads ADD COLUMN IF NOT EXISTS ip VARCHAR(150);

/*ALTER TABLE threads ADD COLUMN IF NOT EXISTS board_id INT NOT NULL REFERENCES boards (id);*/
ALTER  TABLE threads ADD COLUMN IF NOT EXISTS board_id INT NOT NULL;
ALTER TABLE threads DROP CONSTRAINT IF EXISTS board_id;
ALTER TABLE threads ADD CONSTRAINT board_id FOREIGN KEY (board_id) REFERENCES boards (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE threads ADD COLUMN IF NOT EXISTS created_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE threads ADD COLUMN IF NOT EXISTS updated_at DATE DEFAULT CURRENT_DATE;




/* --------------------------------------------------------------------
*
* TABLE posts
*
--------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS posts(
	id INT NOT NULL PRIMARY KEY
);

ALTER TABLE posts ADD COLUMN IF NOT EXISTS title VARCHAR(150);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug VARCHAR(150);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content VARCHAR(255);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS folder VARCHAR(150);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS avatar VARCHAR(150);

ALTER  TABLE posts ADD COLUMN IF NOT EXISTS board_id INT NOT NULL;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS board_id;
ALTER TABLE posts ADD CONSTRAINT board_id FOREIGN KEY (board_id) REFERENCES boards (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE posts ADD COLUMN IF NOT EXISTS thread_id INT NOT NULL;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS thread_id;
ALTER TABLE posts ADD CONSTRAINT thread_id FOREIGN KEY (thread_id) REFERENCES threads (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at DATE DEFAULT CURRENT_DATE;


/* --------------------------------------------------------------------
*
* TABLE ip_ban
*
--------------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS ip_ban(
	id INT NOT NULL PRIMARY KEY
);
ALTER TABLE ip_ban ADD COLUMN IF NOT EXISTS ip VARCHAR(25);
ALTER TABLE ip_ban ADD COLUMN IF NOT EXISTS reason VARCHAR(25);

ALTER TABLE ip_ban ADD COLUMN IF NOT EXISTS created_at DATE DEFAULT CURRENT_DATE;
ALTER TABLE ip_ban ADD COLUMN IF NOT EXISTS updated_at DATE DEFAULT CURRENT_DATE;
