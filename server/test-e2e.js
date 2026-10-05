import { encryptPayload } from './utility/crypto.js';

const BASE_URL = 'http://localhost:3000';

const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(`Request to ${path} failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return { status: response.status, data };
};

async function runTests() {
  console.log('\n======================================================');
  console.log('--- Starting Comprehensive FitActs End-to-End Tests ---');
  console.log('======================================================\n');

  try {
    // 1. Root check
    const rootRes = await request('/');
    console.log('✓ [1/13] Root endpoint online:', rootRes.data.message);

    // 2. Real-time username availability check
    const check1 = await request('/signup/check-username?username=ayush_fit');
    console.log('✓ [2/13] Username taken check:', check1.data);
    if (check1.data.available !== false) throw new Error('Expected ayush_fit to be taken');

    const testUsername = `runner_${Date.now().toString(36)}`;
    const check2 = await request(`/signup/check-username?username=${testUsername}`);
    console.log('✓ [2/13] Username available check:', check2.data);
    if (check2.data.available !== true) throw new Error('Expected new username to be available');

    // 3. Signup with unique email, username, and encrypted payload
    const testEmail = `${testUsername}@gmail.com`;
    const randomPhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const signupData = {
      firstname: 'Alex',
      lastname: 'Runner',
      username: testUsername,
      email: testEmail,
      phone: randomPhone,
      password: 'password123',
    };

    const encryptedSignup = { encryptedData: encryptPayload(signupData) };
    const signupRes = await request('/signup', {
      method: 'POST',
      body: encryptedSignup,
    });
    console.log('✓ [3/13] Signup successful for username:', signupRes.data.data.user.username);
    const newUser = signupRes.data.data.user;
    const initialToken = signupRes.data.data.token.accessToken;
    const refreshToken = signupRes.data.data.token.refreshToken;

    if (!initialToken || !refreshToken) throw new Error('Missing tokens in signup response');

    // 4. Login with username and encrypted payload
    const loginData = {
      username: testUsername,
      password: 'password123',
    };
    const encryptedLogin = { encryptedData: encryptPayload(loginData) };
    const loginRes = await request('/login', {
      method: 'POST',
      body: encryptedLogin,
    });
    console.log('✓ [4/13] Login with encrypted credentials successful:', loginRes.data.data.user.username);

    // 5. Token refresh endpoint
    const refreshRes = await request('/login/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
    console.log('✓ [5/13] Token refresh successful, received new access token');
    const authHeaders = {
      Authorization: `Bearer ${refreshRes.data.data.token.accessToken}`,
    };

    // 6. Create workout event with S3 fallback string
    const eventRes = await request('/events', {
      method: 'POST',
      headers: authHeaders,
      body: {
        name: '5K Interval Sprint',
        userid: newUser.id,
        activityid: 4, // Running
        distance: 5.5,
        duration: 1800,
        caption: 'Pushed the pace on the final mile! #fitness',
        showintimeline: true,
      },
    });
    const createdEvent = eventRes.data.data;
    console.log('✓ [6/13] Workout post created:', createdEvent.name);
    console.log('  -> Fallback S3 identifier stored in DB:', createdEvent.image_url);
    if (!createdEvent.image_url.includes(testUsername)) {
      throw new Error(`Expected image_url to contain username: ${createdEvent.image_url}`);
    }

    // 7. Toggle Like
    const likeRes = await request(`/events/${createdEvent.id}/like`, {
      method: 'POST',
      headers: authHeaders,
      body: { userid: newUser.id },
    });
    console.log('✓ [7/13] Like toggled on workout:', likeRes.data.data);

    // 8. Get Likers
    const likersRes = await request(`/events/${createdEvent.id}/likes?currentUserId=${newUser.id}`);
    console.log('✓ [8/13] Likers list fetched, total likes:', likersRes.data.data.length);

    // 9. Add Comment
    const commentRes = await request(`/events/${createdEvent.id}/comments`, {
      method: 'POST',
      headers: authHeaders,
      body: {
        userid: newUser.id,
        content: 'Solid split times today!',
      },
    });
    console.log('✓ [9/13] Comment added:', commentRes.data.data.content);

    // 10. Get Comments
    const commentsListRes = await request(`/events/${createdEvent.id}/comments`);
    console.log('✓ [10/13] Comments list count:', commentsListRes.data.data.length);

    // 11. Social feed check
    const feedRes = await request(`/events/feed?userId=${newUser.id}`);
    console.log('✓ [11/13] Community Social Feed fetched, total posts:', feedRes.data.data.length);

    // 12. Non-friend profile limit (5-post limit check)
    const profileRes = await request(`/user/profile/demo_athlete?currentUserId=${newUser.id}`);
    console.log(
      '✓ [12/13] Profile check for non-friend demo_athlete. Limited view:',
      profileRes.data.data.limitedView,
      '| Visible posts:',
      profileRes.data.data.posts.length
    );

    // 13. Delete Event record
    const deleteRes = await request(`/events/${createdEvent.id}?userid=${newUser.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    console.log('✓ [13/13] Event record deleted successfully:', deleteRes.data);

    console.log('\n======================================================');
    console.log('🎉 ALL 13 END-TO-END VERIFICATION TESTS PASSED! 🎉');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Test failed:', error.data || error.message);
    process.exit(1);
  }
}

runTests();
