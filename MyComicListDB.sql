CREATE TABLE User(
	user_id int NOT NULL AUTO_INCREMENT,
	user_name varchar(20) NOT NULL,
	user_password varchar(128) NOT NULL,
	user_email varchar(100) NOT NULL,
	PRIMARY KEY (user_id)
);

CREATE TABLE Volume(
	volume_id int NOT NULL AUTO_INCREMENT,
	volume_comicVineId int NOT NULL,
	volume_name varchar(255) NOT NULL,
	PRIMARY KEY (volume_id)
);

CREATE TABLE entry(
	entry_user_id int NOT NULL,
	entry_volume_id int NOT NULL,
	entry_status int NOT NULL,
	FOREIGN KEY (entry_user_id) REFERENCES User(user_id),
	FOREIGN KEY (entry_volume_id) REFERENCES Volume(volume_id)
);
