-- ADDED
CREATE TABLE users (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    city VARCHAR(30) NOT NULL,
    state char(2) NOT NULL,
    zip INT NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE topics (
  topic_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  topic VARCHAR(30) NOT NULL,
);

CREATE TABLE comments (
  comment_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  comment VARCHAR(255) NOT NULL,
  topic_id INT NOT NULL,
  user_id INT NOT NULL,
  votes INT NOT NULL DEFAULT 0,
  FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
  ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
  ON DELETE CASCADE,
);

INSERT INTO topics
(topic)
VALUES
('politics');
