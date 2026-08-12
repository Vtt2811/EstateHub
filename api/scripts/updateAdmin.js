import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdmin() {
    try {
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (!admin) {
            console.log("No ADMIN user found.");
            return;
        }

        const updatedAdmin = await prisma.user.update({
            where: { id: admin.id },
            data: { 
                email: 'vtrivedi080@gmail.com',
                isVerified: true
            }
        });

        console.log(`✅ Admin updated successfully.`);
        console.log(`ID: ${updatedAdmin.id}`);
        console.log(`Username: ${updatedAdmin.username}`);
        console.log(`Email: ${updatedAdmin.email}`);
        console.log(`isVerified: ${updatedAdmin.isVerified}`);

    } catch (err) {
        console.error('❌ Update failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdmin();
