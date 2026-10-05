import pool, { db } from '../app/config/dbConfig.js';
import bcrypt from 'bcryptjs';

export const initializeDatabase = async () => {
  try {
    console.log('Initializing database schema with Drizzle & PostgreSQL...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        firstname VARCHAR(100) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        aadharpresent BOOLEAN DEFAULT FALSE NOT NULL,
        favorites TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Activities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        distanceunit VARCHAR(20) DEFAULT 'km' NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Events (workout posts) table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        activityid INTEGER REFERENCES activities(id),
        distance DOUBLE PRECISION DEFAULT 0 NOT NULL,
        duration INTEGER DEFAULT 0 NOT NULL,
        showintimeline BOOLEAN DEFAULT TRUE NOT NULL,
        image_url TEXT,
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Likes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        eventid INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE (eventid, userid)
      );
    `);

    // Comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        eventid INTEGER REFERENCES events(id) ON DELETE CASCADE NOT NULL,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Follow / Friend table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS followdata (
        id SERIAL PRIMARY KEY,
        followerid INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        followingid INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        state VARCHAR(20) DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE (followerid, followingid)
      );
    `);

    // Aadhaar table (fixing typo from 'adhaars' to 'aadhaar')
    await pool.query(`
      CREATE TABLE IF NOT EXISTS aadhaar (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        storageinfo TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Seed default activities if none exist
    const activitiesCount = await pool.query('SELECT COUNT(*) FROM activities');
    if (parseInt(activitiesCount.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO activities (name, distanceunit, description, icon) VALUES
        ('Swimming', 'meters', 'Lap swimming & open water training', 'FaSwimmer'),
        ('Rowing', 'meters', 'Indoor machine & boat rowing', 'GiRowing'),
        ('Dancing', 'steps', 'Rhythmic cardio & dance workouts', 'GiDancingFeet'),
        ('Running', 'km', 'Outdoor running & treadmill', 'FaRunning'),
        ('Cycling', 'km', 'Road cycling & spin workouts', 'FaBiking'),
        ('Walking', 'km', 'Brisk walking & hiking', 'FaWalking');
      `);
      console.log('Seeded initial activities.');
    }

    // Seed demo users if none exist
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(usersCount.rows[0].count, 10) === 0) {
      const passwordHashAyush = await bcrypt.hash('ayush123', 10);
      const passwordHashDemo = await bcrypt.hash('demo123', 10);
      const passwordHashSarah = await bcrypt.hash('sarah123', 10);

      const userRes = await pool.query(`
        INSERT INTO users (username, firstname, lastname, email, phone, password, aadharpresent, favorites) VALUES
        ('ayush_fit', 'Ayush', 'Kumar', 'ayush@gmail.com', '9876543210', '${passwordHashAyush}', false, ARRAY['1', '2']),
        ('demo_athlete', 'Demo', 'User', 'demo@gmail.com', '9123456780', '${passwordHashDemo}', false, ARRAY['3', '4']),
        ('sarah_runner', 'Sarah', 'Miller', 'sarah@gmail.com', '9234567891', '${passwordHashSarah}', false, ARRAY['4', '5'])
        RETURNING id, username;
      `);

      const ayushId = userRes.rows[0].id;
      const demoId = userRes.rows[1].id;
      const sarahId = userRes.rows[2].id;

      // Make Ayush and Demo friends
      await pool.query(`
        INSERT INTO followdata (followerid, followingid, state) VALUES
        (${ayushId}, ${demoId}, 'followed'),
        (${demoId}, ${ayushId}, 'followed'),
        (${sarahId}, ${ayushId}, 'pending')
        ON CONFLICT DO NOTHING;
      `);

      // Seed initial workout events
      const eventRes = await pool.query(`
        INSERT INTO events (name, userid, activityid, distance, duration, showintimeline, image_url, caption) VALUES
        ('Morning 5K Pace Run', ${demoId}, 4, 5.2, 1680, true, 'demo_athlete_Running_mock_seed_1', 'Morning interval workout in the park! Great brisk weather.'),
        ('Evening 1000m Swim', ${demoId}, 1, 1000, 1920, true, 'demo_athlete_Swimming_mock_seed_2', 'Freestyle sets + endurance drills.'),
        ('Cardio Dance Blast', ${sarahId}, 3, 4500, 2400, true, 'sarah_runner_Dancing_mock_seed_3', 'High tempo rhythm cardio session to start the week!')
        RETURNING id;
      `);

      const event1Id = eventRes.rows[0].id;
      const event2Id = eventRes.rows[1].id;

      // Seed likes and comments
      await pool.query(`
        INSERT INTO likes (eventid, userid) VALUES
        (${event1Id}, ${ayushId}),
        (${event2Id}, ${ayushId})
        ON CONFLICT DO NOTHING;
      `);

      await pool.query(`
        INSERT INTO comments (eventid, userid, content) VALUES
        (${event1Id}, ${ayushId}, 'Crushed that 5K! Keep it up!'),
        (${event2Id}, ${ayushId}, 'Awesome lap pace!')
        ON CONFLICT DO NOTHING;
      `);

      console.log('Seeded demo users, friends, workouts, likes, and comments.');
    }

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Run if called directly
if (process.argv[1]?.endsWith('initDb.js')) {
  initializeDatabase().then(() => {
    process.exit(0);
  });
}
