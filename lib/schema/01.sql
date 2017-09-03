CREATE TABLE users (
   id bigint primary key,
   name text,
   profileurl text,
   avatar text,
   avatarmed text,
   avatarfull text,
   updated timestamp default current_time
);

CREATE TABLE lists (
   id serial primary key,
   user_id bigint foreign key references users(id),
   updates int not null default 0,
);

CREATE TABLE rankings (
   id serial primary key,
   list_id serial not null foreign key references lists(id),
   hero_id text not null,
   role smallint not null,
   score double precision not null,
   notes text
);

CREATE VIEW rankingsx AS
SELECT *, rank() OVER (PARTITION BY role ORDER BY score ASC);

CREATE TABLE friends (
   user1_id serial not null foreign key references users(id),
   user2_id serial not null foreign key references users(id),
   PRIMARY KEY (user1_id, user2_id),
   check(user1_id < user2_id)
);

CREATE TABLE friend_reqs (
   sender_id serial not null foreign key references users(id),
   reaper_id serial not null foreign key references users(id),
   PRIMARY KEY(sender_id, reaper_id)
   check(sender_id != reaper_id)
);

CREATE TABLE teams (
   id serial primary key,
   user_id serial not null foreign key references users(id),
   name text not null
);

CREATE TABLE players (
   team_id serial not null foreign key references teams(id),
   user_id serial not null foreign key references users(id),
   PRIMARY KEY (team_id, user_id)
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

CREATE INDEX lists_user_id ON lists(user_id);
CREATE INDEX rankings_list_id ON rankings(list_id, role);
CREATE INDEX friends_user2_id ON friends(user2_id);
CREATE INDEX friend_reqs_reaper_id ON friend_reqs(reaper_id);
CREATE INDEX teams_user_id ON teams(user_id);
CREATE INDEX players_user_id ON players(user_id);
