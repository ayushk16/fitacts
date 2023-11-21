CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "firstname" varchar(255) NOT NULL,
    "lastname" varchar(255) NOT NULL,
    "email" varchar(255) NOT NULL UNIQUE,
    "phone" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "aadharpresent" boolean NOT NULL,
    "favorites" uuid array[]
);

DROP TABLE IF EXISTS "users" 


CREATE TABLE IF NOT EXISTS "adhaars" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "userid" uuid NOT NULL,
    "storageinfo" varchar(255) NOT NULL,
	PRIMARY KEY ("id"),
	FOREIGN KEY ("userid") REFERENCES "users" ("id")
);

CREATE TABLE IF NOT EXISTS "activities" (
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "distanceunit" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "events"(
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "userid" uuid  NOT NULL,
    "activityid" uuid  NOT NULL,
    "distance" float NOT NULL,
    "duration" float NOT NULL,
    "showintimeline" boolean NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY ("userid") REFERENCES "users" ("id"),
    FOREIGN KEY ("activityid") REFERENCES "activities" ("id")
)

CREATE TABLE IF NOT EXISTS "followdata"(
    "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
	"followerid" uuid NOT NULL, 
	"followingid" uuid NOT NULL,
    FOREIGN KEY ("followerid") REFERENCES "users" ("id"),
    FOREIGN KEY ("followingid") REFERENCES "users" ("id")
)

INSERT INTO "users" ("firstname", "lastname", "email", "phone", "password", "aadharPresent") VALUES ('ayush', 'k', 'ayush@gmail.com', '1234567890', '123456', false);

INSERT INTO "followdata" ("followerid", "followingid") VALUES ('fa056a42-3ef7-429a-88a2-9fb48778ebcf', '73d4a749-b479-4865-8aff-da81e5898b54');

select *, CONCAT(followerinfo.firstname ,' ' ,followerinfo.lastname) as followername , CONCAT(followedinfo.firstname ,' ' ,followedinfo.lastname) as followedname from followdata 
join users  followerinfo on followdata.followerid = followerinfo.id 
join users followedinfo on followdata.followingid = followedinfo.id


update users set favorites = '{73ceafa7-3d81-4ad4-9131-2912bc79155e ,b86adae3-530e-4825-8b27-cd1646baf6e5, b3646eee-799c-487e-b484-d186083344c2}' where email = 'jai@gmail.com';

ALTER TABLE events
ADD COLUMN timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE events
ADD COLUMN "showintimeline" boolean NOT NULL;
alter table events add column name varchar not null;

INSERT INTO "events" ("userid", "activityid", "distance", "duration" , "showintimeline") VALUES ('fa056a42-3ef7-429a-88a2-9fb48778ebcf', '73ceafa7-3d81-4ad4-9131-2912bc79155e', 10, 10 ,true);


SELECT * ,followeruser.id AS followeruserid, CONCAT(followeruser.firstname ,' ' ,followeruser.lastname) AS followerusername,
       followeduser.id AS followeduserid, CONCAT(followeduser.firstname,' ',followeduser.lastname) AS followedusername
FROM users followeruser
CROSS JOIN users followeduser

where followeruser.id = 
'5910020d-b608-480f-8ff3-5f2bba8abde8'
and followeduser.id = 'fa056a42-3ef7-429a-88a2-9fb48778ebcf'


alter table followdata 
add column "state" varchar(255) default 'pending';


select followerinfo.id as id, followerinfo.firstname as firstname,followerinfo.lastname as lastname , followerinfo.email as email , followerinfo.phone as phone from followdata join users  followerinfo on followdata.followerid = followerinfo.id join users followedinfo on followdata.followingid = followedinfo.id where followingid= '9cd15f9d-f02e-49c6-a91a-4ce45a7f011f' and state = 'pending'