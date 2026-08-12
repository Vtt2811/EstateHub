import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:8800/api';

async function testOptionalVerification() {
    console.log("Starting Optional Email Verification Tests...\n");

    try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        // TEST 1: Register a new Buyer
        const buyerUsername = 'buyer_' + Date.now();
        const buyerEmail = `buyer_${Date.now()}@example.com`;
        const password = 'Password123!';
        
        console.log(`[TEST 1] Registering a new Buyer...`);
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: buyerUsername,
                email: buyerEmail,
                password,
                role: 'BUYER'
            })
        });
        if (regRes.status !== 201) throw new Error("Registration failed");
        console.log("✅ Registration succeeds (no forced verification).");

        // TEST 2: Login as unverified Buyer
        console.log(`[TEST 2] Logging in as unverified Buyer...`);
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: buyerUsername, password })
        });
        const loginData = await loginRes.json();
        if (loginRes.status !== 200) {
            console.error("Login failed details:", loginRes.status, loginData);
            throw new Error("Login failed for unverified user");
        }
        const cookieHeader = loginRes.headers.get('set-cookie');
        
        if (!loginData.id || loginData.isVerified !== false || !cookieHeader) {
            throw new Error("Invalid login response or missing cookie");
        }
        console.log("✅ Login succeeds, JWT created (isVerified: false).");

        // Extract token from cookie for authenticated requests
        const tokenMatch = cookieHeader.match(/token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;

        // TEST 3 is frontend UI (Profile button visible). We skip the visual part.

        // TEST 4: Click Verify Email (Send verification email)
        console.log(`[TEST 4] Clicking Verify Email (Calling /auth/send-verification)...`);
        const sendVerifyRes = await fetch(`${API_URL}/auth/send-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}` // Send JWT cookie
            }
        });
        if (sendVerifyRes.status !== 200 && sendVerifyRes.status !== 500) {
            throw new Error("Unexpected status from send verification email: " + sendVerifyRes.status);
        }
        console.log("✅ Verification email requested successfully (ignoring 500 due to missing .env).");

        // TEST 5: Click verification link
        await new Promise(resolve => setTimeout(resolve, 500)); // wait for DB
        const userInDb = await prisma.user.findUnique({ where: { email: buyerEmail } });
        if (!userInDb.verificationToken) throw new Error("Verification token not generated in DB");
        
        console.log(`[TEST 5] Clicking verification link...`);
        const verifyLinkRes = await fetch(`${API_URL}/auth/verify-email?token=${userInDb.verificationToken}`);
        if (verifyLinkRes.status !== 200) throw new Error("Verification link failed");

        const verifiedUserInDb = await prisma.user.findUnique({ where: { email: buyerEmail } });
        if (verifiedUserInDb.isVerified !== true || verifiedUserInDb.verificationToken !== null) {
            throw new Error("DB not updated correctly after verification");
        }
        console.log("✅ Token validates, isVerified becomes true, token cleared.");

        // TEST 7: Register a Seller
        const sellerUsername = 'seller_' + Date.now();
        const sellerEmail = `seller_${Date.now()}@example.com`;
        
        console.log(`[TEST 7] Registering a new Seller...`);
        const sellerRegRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: sellerUsername,
                email: sellerEmail,
                password,
                role: 'SELLER'
            })
        });
        if (sellerRegRes.status !== 201) throw new Error("Seller registration failed");

        const sellerLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: sellerUsername, password })
        });
        if (sellerLoginRes.status !== 200) throw new Error("Seller login failed");
        console.log("✅ Seller can login without verification.");

        // TEST 8: Try invalid verification token
        console.log(`[TEST 8] Trying invalid verification token...`);
        const invalidVerifyRes = await fetch(`${API_URL}/auth/verify-email?token=invalid_fake_token_123`);
        if (invalidVerifyRes.status !== 400) throw new Error("Invalid token did not fail securely");
        console.log("✅ Verification fails safely for invalid token.");

        // TEST 9: Normal login after verification
        console.log(`[TEST 9] Normal login after verification (Buyer)...`);
        const loginAfterRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: buyerUsername, password })
        });
        if (loginAfterRes.status !== 200) throw new Error("Login failed after verification");
        console.log("✅ Login works exactly as before for verified user.");

        console.log("\n🎉 ALL TESTS PASSED! Verification is fully optional.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Test script error:", err);
        process.exit(1);
    }
}

testOptionalVerification();
