CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "firstname" varchar(255) NOT NULL,
    "lastname" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL UNIQUE,
    "phone" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "aadharpresent" boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS "adhaars" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "userid" uuid NOT NULL,
    "storageinfo" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "activities" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "distanceunit" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "events"(
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "userid" uuid NOT NULL,
    "activityid" uuid NOT NULL,
    "distance" float NOT NULL,
    "duration" float NOT NULL
)

INSERT INTO "users" ("firstname", "lastname", "email", "phone", "password", "aadharPresent") VALUES ('ayush', 'k', 'ayush@gmail.com', '1234567890', '123456', false);
