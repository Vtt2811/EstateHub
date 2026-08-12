(async () => {
  try {
    // 1. Log in as buyer1
    console.log('--- TEST 2e: Logged in as BUYER ---');
    const loginRes = await fetch('http://localhost:8800/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'buyer1', password: 'test123' })
    });
    const cookie = loginRes.headers.get('set-cookie');
    
    // 2. Try to access admin endpoint WITH buyer cookie
    const adminRes = await fetch('http://localhost:8800/api/admin/agents/pending', {
      headers: { 'Cookie': cookie }
    });
    console.log(`Status: ${adminRes.status} ${adminRes.statusText}`);
    const adminData = await adminRes.text();
    console.log(`Response: ${adminData}`);
    
    // 3. Try to access admin endpoint WITHOUT cookie
    console.log('\n--- TEST 2f: Not logged in ---');
    const noAuthRes = await fetch('http://localhost:8800/api/admin/agents/pending');
    console.log(`Status: ${noAuthRes.status} ${noAuthRes.statusText}`);
    const noAuthData = await noAuthRes.text();
    console.log(`Response: ${noAuthData}`);

  } catch(e) {
    console.error(e);
  }
})();
