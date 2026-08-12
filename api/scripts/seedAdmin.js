/**
 * seedAdmin.js — Create the first ADMIN user
 *
 * This script is the ONLY way to create an ADMIN-role user.
 * No public registration endpoint ever accepts role=ADMIN.
 *
 * Usage (run from the api/ directory):
 *   node scripts/seedAdmin.js
 *
 * Required environment variables (in api/.env):
 *   ADMIN_EMAIL      — email address for the admin account
 *   ADMIN_USERNAME   — username for the admin account
 *   ADMIN_PASSWORD   — plaintext password (will be hashed before storage)
 */

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdmin() {
    const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
        console.error(
            '❌  Missing required env vars: ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD'
        );
        process.exit(1);
    }

    try {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Upsert: create if not exists, update role to ADMIN if already exists
        const admin = await prisma.user.upsert({
            where: { email: ADMIN_EMAIL },
            update: {
                role: 'ADMIN',
                agentStatus: null,
            },
            create: {
                email: ADMIN_EMAIL,
                username: ADMIN_USERNAME,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        console.log(`✅  Admin user ready:`);
        console.log(`    ID:       ${admin.id}`);
        console.log(`    Username: ${admin.username}`);
        console.log(`    Email:    ${admin.email}`);
        console.log(`    Role:     ${admin.role}`);
    } catch (err) {
        console.error('❌  Failed to seed admin user:', err.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
