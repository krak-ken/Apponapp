-- insert into timeslots(shifts) values(ARRAY['{"start" : "2:15","end" : "3:15","No.": 4,"IDS": [1, 1, 1, 1] }']::json[]);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE addr AS (houseNo varchar(20),streetAddress varchar(100),city varchar(50),state varchar(25),zipcode varchar(10));

--doctors, lawyers, maids, drivers, barber;
CREATE TABLE doctors (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(50),email varchar(50) UNIQUE NOT NULL,phone varchar[],address addr,expertise varchar(60),description text,rating smallint,cost numeric (7,2),password varchar(64) NOT NULL);
CREATE TABLE lawyers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(50),email varchar(50) UNIQUE NOT NULL,phone varchar[],address addr,expertise varchar(60),description text,rating smallint,cost numeric (7,2),password varchar(64) NOT NULL);
CREATE TABLE maids (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(50),email varchar(50) UNIQUE NOT NULL,phone varchar[],address addr,expertise varchar(60),description text,rating smallint,cost numeric (7,2),password varchar(64) NOT NULL);
CREATE TABLE drivers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(50),email varchar(50) UNIQUE NOT NULL,phone varchar[],address addr,expertise varchar(60),description text,rating smallint,cost numeric (7,2),password varchar(64) NOT NULL);
CREATE TABLE barbers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(50),email varchar(50) UNIQUE NOT NULL,phone varchar[],address addr,expertise varchar(60),description text,rating smallint,cost numeric (7,2),password varchar(64) NOT NULL);

CREATE OR REPLACE FUNCTION create_table_timeSlots()
  RETURNS trigger AS
	$BODY$
	DECLARE
    	arg varchar(50) := 'TimeSlot' || CAST(NEW.id AS text);

	BEGIN

	arg := REPLACE (arg, '-', '_');
	EXECUTE 
	'CREATE TABLE ' || arg || ' (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), todayDate DATE NOT NULL DEFAULT CURRENT_DATE UNIQUE, shifts jsonb[]);';

	RETURN NULL;
	END;
	$BODY$ LANGUAGE plpgsql;

--doctors, lawyers, maids, drivers, barber;
CREATE TRIGGER create_table_timeSlots
  AFTER INSERT
  ON doctors
  FOR EACH ROW
  EXECUTE PROCEDURE create_table_timeSlots();

CREATE TRIGGER create_table_timeSlots
  AFTER INSERT
  ON lawyers
  FOR EACH ROW
  EXECUTE PROCEDURE create_table_timeSlots(); 

CREATE TRIGGER create_table_timeSlots
  AFTER INSERT
  ON maids
  FOR EACH ROW
  EXECUTE PROCEDURE create_table_timeSlots();

CREATE TRIGGER create_table_timeSlots
  AFTER INSERT
  ON drivers
  FOR EACH ROW
  EXECUTE PROCEDURE create_table_timeSlots(); 

CREATE TRIGGER create_table_timeSlots
  AFTER INSERT
  ON barbers
  FOR EACH ROW
  EXECUTE PROCEDURE create_table_timeSlots(); 

CREATE OR REPLACE FUNCTION remove_table_timeSlots()
  RETURNS trigger AS
	$BODY$
	DECLARE
    	arg varchar(50) := 'TimeSlot' || CAST(OLD.id AS text);

	BEGIN

	arg := REPLACE (arg, '-', '_');
	EXECUTE 
	'DROP TABLE ' || arg || ';';

	RETURN OLD;
	END;
	$BODY$ LANGUAGE plpgsql;

--doctors, lawyers, maids, drivers, barber;
CREATE TRIGGER remove_table_timeSlots
  BEFORE DELETE
  ON doctors
  FOR EACH ROW
  EXECUTE PROCEDURE remove_table_timeSlots();

CREATE TRIGGER remove_table_timeSlots
  BEFORE DELETE
  ON lawyers
  FOR EACH ROW
  EXECUTE PROCEDURE remove_table_timeSlots();

CREATE TRIGGER remove_table_timeSlots
  BEFORE DELETE
  ON maids
  FOR EACH ROW
  EXECUTE PROCEDURE remove_table_timeSlots();

CREATE TRIGGER remove_table_timeSlots
  BEFORE DELETE
  ON drivers
  FOR EACH ROW
  EXECUTE PROCEDURE remove_table_timeSlots();

CREATE TRIGGER remove_table_timeSlots
  BEFORE DELETE
  ON barbers
  FOR EACH ROW
  EXECUTE PROCEDURE remove_table_timeSlots();
  
-- INDEX
CREATE INDEX doctorsRating 
	ON doctors(rating);
CREATE INDEX lawyersRating 
	ON lawyers(rating);
CREATE INDEX maidsRating 
	ON maids(rating);
CREATE INDEX driversRating 
	ON drivers(rating);
CREATE INDEX barbersRating 
	ON barbers(rating);

-- VIEW
CREATE VIEW doctorsView AS
	SELECT id,
		   name,
		   email,
		   phone,
		   address,
		   expertise,
		   description,
		   rating
	FROM doctors;

CREATE VIEW lawyersView AS
	SELECT id,
		   name,
		   email,
		   phone,
		   address,
		   expertise,
		   description,
		   rating
	FROM lawyers;

CREATE VIEW maidsView AS
	SELECT id,
		   name,
		   email,
		   phone,
		   address,
		   expertise,
		   description,
		   rating
	FROM maids;

CREATE VIEW driversView AS
	SELECT id,
		   name,
		   email,
		   phone,
		   address,
		   expertise,
		   description,
		   rating
	FROM drivers;

CREATE VIEW barbersView AS
	SELECT id,
		   name,
		   email,
		   phone,
		   address,
		   expertise,
		   description,
		   rating
	FROM barbers;

CREATE TABLE users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(50),email varchar(50) UNIQUE NOT NULL,phone varchar[],password varchar(64) NOT NULL);

CREATE TABLE timeslotsusers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),todayDate DATE NOT NULL DEFAULT CURRENT_DATE,profession varchar(50),shift time[],cost numeric(7,2),rating smallint,professionId uuid, userid uuid REFERENCES users(id));

CREATE OR REPLACE FUNCTION remove_users_timeSlots()
  RETURNS trigger AS
	$BODY$
	DECLARE 
		id uuid = OLD.id;

	BEGIN

    EXECUTE 
		'DELETE FROM timeslotsusers WHERE userid=''' || id::uuid || ''';';

	RETURN OLD;
	END;
	$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER remove_users_timeSlots
  BEFORE DELETE
  ON users
  FOR EACH ROW
  EXECUTE PROCEDURE remove_users_timeSlots();


-- CREATE OR REPLACE FUNCTION remove_users_timeSlots()
--   RETURNS trigger AS
-- 	$BODY$
-- 	DECLARE 
-- 		id uuid = OLD.id;

-- 	BEGIN
-- 	IF array_length(OLD.TimeSlotId, 1) > 0 THEN
--     	FOREACH id IN ARRAY OLD.TimeSlotId LOOP
--         EXECUTE 
-- 		'DELETE FROM timeslotsusers WHERE id=''' || id::uuid || ''';';
--     END loop;
-- 	END IF;

-- 	RETURN OLD;
-- 	END;
-- 	$BODY$ LANGUAGE plpgsql;