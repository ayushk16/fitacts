SELECT  
        followeruser.id as id, 
        followeruser.firstname as firstname,
        followeruser.lastname as lastname , 
        followeruser.email as email , 
        followeruser.phone as phone 
    FROM users followeruser 
    CROSS JOIN users followeduser 
        where followeruser.id =  $1 and followeduser.id = $2


SELECT  
        followeduser.id as id, 
        followeduser.firstname as firstname,
        followeduser.lastname as lastname ,
        followeruser.id AS followeruserid,
        CONCAT(followeruser.firstname ,' ' ,followeruser.lastname) AS followerusername, 
        followeduser.id AS followeduserid, 
        CONCAT(followeduser.firstname,' ',followeduser.lastname) AS followedusername , 
        followeduser.email as email , 
        followeduser.phone as phone 
    FROM users followeruser 
    CROSS JOIN users followeduser 
        where followeruser.id =  $1 and followeduser.id = $2


SELECT 
        followeduser.id as id, 
        followeduser.firstname as firstname,
        followeduser.lastname as lastname,
        followeruser.id AS followeruserid, 
        CONCAT(followeruser.firstname ,' ' ,followeruser.lastname) AS followerusername, 
        followeduser.id AS followeduserid, 
        CONCAT(followeduser.firstname,' ',followeduser.lastname) AS followedusername 
    FROM users followeruser 
    CROSS JOIN users followeduser 
        where followeruser.id =  $1 and followeduser.id = $2


select 
        followerinfo.id as id, 
        followerinfo.firstname as firstname,
        followerinfo.lastname as lastname , 
        followerinfo.email as email , 
        followerinfo.phone as phone 
    from followdata 
    join users  followerinfo 
        on followdata.followerid = followerinfo.id 
    join users followedinfo 
        on followdata.followingid = followedinfo.id 
            where followingid= $1 and state = 'pending'


select 
        followedinfo.id as id, 
        followedinfo.firstname as firstname,
        followedinfo.lastname as lastname, 
        followerinfo.id as followeruserid , 
        followedinfo.id as followeduserid ,
        CONCAT(followerinfo.firstname ,' ' ,followerinfo.lastname) as followerusername , 
        CONCAT(followedinfo.firstname ,' ' ,followedinfo.lastname) as followedusername , 
        followedinfo.email as email , 
        followedinfo.phone as phone 
    from followdata 
    join users  followerinfo 
        on followdata.followerid = followerinfo.id 
    join users followedinfo 
        on followdata.followingid = followedinfo.id 
            where followerid= $1 and state = 'pending'