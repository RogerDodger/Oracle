-- 1 up

CREATE TABLE users (
   id serial primary key,
   steamid bigint unique,
   name text unique,
   profileurl text,
   avatar text,
   avatarmed text,
   avatarfull text,
   visited timestamp default current_timestamp,
   updated timestamp default current_timestamp
);

CREATE TABLE lists (
   user_id serial references users(id),
   role smallint not null,
   updated timestamp default current_timestamp,
   PRIMARY KEY (user_id, role)
);

CREATE TABLE rankings (
   user_id serial references users(id),
   role smallint not null,
   hero text not null,
   rank integer not null,
   note text not null default '',
   PRIMARY KEY (user_id, role, hero)
);

CREATE TABLE friends (
   user1_id serial not null references users(id),
   user2_id serial not null references users(id),
   PRIMARY KEY (user1_id, user2_id),
   check(user1_id < user2_id)
);

CREATE VIEW friendsx AS
   SELECT
   user1_id AS user_id,
   user2_id AS friend_id
   FROM friends
UNION
   SELECT
   user2_id AS user_id,
   user1_id AS friend_id
   FROM friends;

CREATE TABLE friend_reqs (
   sender_id serial not null references users(id),
   receiver_id serial not null references users(id),
   PRIMARY KEY(sender_id, receiver_id),
   check(sender_id != receiver_id)
);

CREATE TABLE teams (
   id serial primary key,
   user_id serial not null references users(id),
   name text not null
);

CREATE TABLE players (
   team_id serial not null references teams(id),
   user_id serial not null references users(id),
   PRIMARY KEY (team_id, user_id)
);

CREATE INDEX user_name ON users(name);
CREATE INDEX user_steamid ON users(steamid);
CREATE INDEX rankings_rank ON rankings(user_id, role, rank);
CREATE INDEX friends_user2_id ON friends(user2_id);
CREATE INDEX friend_reqs_receiver_id ON friend_reqs(receiver_id);
CREATE INDEX teams_user_id ON teams(user_id);
CREATE INDEX players_user_id ON players(user_id);

-- 1 down

DROP TABLE players;
DROP TABLE teams;
DROP TABLE friend_reqs;
DROP VIEW friendsx;
DROP TABLE friends;
DROP TABLE rankings;
DROP TABLE lists;
DROP TABLE users;
