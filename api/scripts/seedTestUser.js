/**
 * seedTestUser.js — Create a disposable test user with:
 *   - 1 Post (+ PostDetail)
 *   - 1 SavedPost (saves another existing post, or the user's own if none other exists)
 *   - 1 Chat + 1 Message (with the admin)
 *
 * Usage (from the api/ directory):
 *   node scripts/seedTestUser.js
 *
 * Prints the test user's ID at the end so you can confirm deletion.
 */

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    try {
        // 1. Create the test user -----------------------------------------------
        const hashedPw = await bcrypt.hash('TestPass123!', 10);
        const testUser = await prisma.user.upsert({
            where: { email: 'testdelete@estatehub.com' },
            update: {},
            create: {
                email: 'testdelete@estatehub.com',
                username: 'test_delete_user',
                password: hashedPw,
                role: 'SELLER',
            },
        });
        console.log(`✅  Test user: ${testUser.username} (${testUser.id})`);

        // 2. Create a Post + PostDetail owned by the test user ------------------
        const post = await prisma.post.create({
            data: {
                title: 'Test Listing — DELETE ME',
                price: 250000,
                images: [],
                address: '1 Test Street',
                city: 'Testville',
                bedroom: 2,
                bathroom: 1,
                latitude: '0',
                longitude: '0',
                type: 'buy',
                property: 'house',
                userId: testUser.id,
                postDetail: {
                    create: {
                        desc: 'This listing was created by the seed script for delete testing.',
                        utilities: 'Owner',
                        size: 100,
                    },
                },
            },
        });
        console.log(`✅  Post created: ${post.id}`);

        // 3. SavedPost — test user saves their own post (good enough for the test)
        await prisma.savedPost.upsert({
            where: {
                userId_postId: { userId: testUser.id, postId: post.id },
            },
            update: {},
            create: { userId: testUser.id, postId: post.id },
        });
        console.log(`✅  SavedPost created`);

        // 4. Chat + Message between test user and the admin ---------------------
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (!admin) {
            console.warn('⚠️  No ADMIN user found — skipping chat seed. Run seedAdmin.js first.');
        } else {
            const chat = await prisma.chat.create({
                data: { userIDs: [testUser.id, admin.id] },
            });
            const message = await prisma.message.create({
                data: {
                    text: 'Hello from the test user — delete me!',
                    userId: testUser.id,
                    chatId: chat.id,
                },
            });
            // Update lastMessage on the chat
            await prisma.chat.update({
                where: { id: chat.id },
                data: { lastMessage: message.text },
            });
            console.log(`✅  Chat (${chat.id}) + Message (${message.id}) created`);
        }

        console.log('\n🎯  Test user ready. Log in as admin and delete "test_delete_user" from the dashboard.');
        console.log(`    User ID: ${testUser.id}`);
    } catch (err) {
        console.error('❌  Seed failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
