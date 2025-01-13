const createUser = "INSERT INTO users (firstname, lastname, email, phone, password , aadharpresent, favorites) VALUES ($1, $2, $3 ,$4, $5, $6 ,$7) RETURNING *";

const getuser = 'SELECT * FROM users WHERE id = $1';

const getUserByEmail = "SELECT * FROM users WHERE email = $1";

const getUserByPhone = "SELECT * FROM users WHERE phone = $1";

const getAllUsers = "SELECT id,firstname,lastname,favorites FROM users";

const updateUserAadharPresent = 'UPDATE users SET aadharpresent = $1 WHERE id = $2 RETURNING *';

const updateAadharInfo = "UPDATE adhaars SET storageinfo = $1 WHERE userid = $2 RETURNING *"

const getAadhar = 'SELECT * FROM adhaars WHERE userid = $1';

const addAadhar = 'INSERT INTO adhaars (userid,storageinfo) values ($1,$2) RETURNING *';

const getFollowing = `select followedinfo.id as id, followedinfo.firstname as firstname,followedinfo.lastname as lastname, followerinfo.id as followeruserid , followedinfo.id as followeduserid ,CONCAT(followerinfo.firstname ,' ' ,followerinfo.lastname) as followerusername , CONCAT(followedinfo.firstname ,' ' ,followedinfo.lastname) as followedusername, followedinfo.email as email , followedinfo.phone as phone from followdata join users  followerinfo on followdata.followerid = followerinfo.id join users followedinfo on followdata.followingid = followedinfo.id where followerid= $1 and state = 'followed'`;

const getPending = `select followedinfo.id as id, followedinfo.firstname as firstname,followedinfo.lastname as lastname, followerinfo.id as followeruserid , followedinfo.id as followeduserid ,CONCAT(followerinfo.firstname ,' ' ,followerinfo.lastname) as followerusername , CONCAT(followedinfo.firstname ,' ' ,followedinfo.lastname) as followedusername , followedinfo.email as email , followedinfo.phone as phone from followdata join users  followerinfo on followdata.followerid = followerinfo.id join users followedinfo on followdata.followingid = followedinfo.id where followerid= $1 and state = 'pending'`;

const getFollowData = 'SELECT * FROM followdata WHERE followerid = $1 AND followingid = $2';

const getFollowerAndFollowingData = "SELECT  followeduser.id as id, followeduser.firstname as firstname,followeduser.lastname as lastname ,followeruser.id AS followeruserid, CONCAT(followeruser.firstname ,' ' ,followeruser.lastname) AS followerusername, followeduser.id AS followeduserid, CONCAT(followeduser.firstname,' ',followeduser.lastname) AS followedusername , followeduser.email as email , followeduser.phone as phone FROM users followeruser CROSS JOIN users followeduser where followeruser.id =  $1 and followeduser.id = $2";

const getFollowerData = "SELECT  followeruser.id as id, followeruser.firstname as firstname,followeruser.lastname as lastname , followeruser.email as email , followeruser.phone as phone FROM users followeruser CROSS JOIN users followeduser where followeruser.id =  $1 and followeduser.id = $2";

const addFollowData = "INSERT INTO followdata (followerid,followingid,state) VALUES ($1,$2,$3) RETURNING *";

const updateFollowData = "UPDATE followdata SET state = $1 WHERE followerid = $2 AND followingid = $3 RETURNING *";

const deleteFollowData = "DELETE FROM followdata WHERE followerid = $1 AND followingid = $2 RETURNING *"

const getRequests = `select followerinfo.id as id, followerinfo.firstname as firstname,followerinfo.lastname as lastname , followerinfo.email as email , followerinfo.phone as phone from followdata join users  followerinfo on followdata.followerid = followerinfo.id join users followedinfo on followdata.followingid = followedinfo.id where followingid= $1 and state = 'pending'`

const getUsersEvents = "SELECT *, events.id as eventid, events.name as eventname, activities.name as activityname FROM events JOIN activities ON activities.id = events.activityid WHERE userid = $1";

const createEvent = "INSERT INTO events (name,userid,activityid,distance,duration,showintimeline) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *";

const getEventById = "SELECT *, events.id as eventid, events.name as eventname, activities.name as activityname FROM events JOIN activities ON activities.id = events.activityid WHERE events.id = $1";

const updateEvent = "UPDATE events SET showintimeline = $1  WHERE id = $2 AND userid = $3 RETURNING *";

const getTopEvents = "SELECT *, events.id AS eventid , events.name AS eventname, activities.name AS activityname FROM events JOIN activities ON activities.id = events.activityid WHERE userid = $1 AND activityid = $2 ORDER BY distance DESC LIMIT 5;";

const getEventsInParts = "SELECT *, events.id AS eventid , events.name AS eventname, activities.name AS activityname FROM events JOIN activities ON activities.id = events.activityid WHERE userid = $1 AND showintimeline = true ORDER BY distance DESC LIMIT $2 offset  $3 ;";

const getAllTimelineEvents = "SELECT *, events.id AS eventid , events.name AS eventname, activities.name AS activityname FROM events JOIN activities ON activities.id = events.activityid WHERE userid = $1 AND showintimeline = true ORDER BY distance DESC;";

const getAllActivities = "select * from activities";

const getActivity = "select * from activities where id = $1";

const updateUserFavorites = "update users set favorites = $1 where id = $2";

export default { createUser, getuser, getUserByEmail, getUserByPhone, getAllUsers, updateUserAadharPresent, updateAadharInfo, getAadhar, addAadhar, getFollowing, getPending, getFollowData, getFollowerAndFollowingData, getFollowerData, addFollowData, updateFollowData, deleteFollowData, getRequests, getUsersEvents, createEvent, getEventById, updateEvent, getTopEvents, getEventsInParts, getAllTimelineEvents, getAllActivities, getActivity, updateUserFavorites };