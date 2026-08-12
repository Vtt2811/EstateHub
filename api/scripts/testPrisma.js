import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function test() {
  try {
    await prisma.$connect();
    console.log('Connected!');
    await prisma.$disconnect();
  } catch(e) {
    console.error('Connection failed:', e.message);
  }
}
test();
