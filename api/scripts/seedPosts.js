import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedPosts() {
  try {
    const user = await prisma.user.findFirst({
      where: { role: 'AGENT' }
    });
    
    if (!user) {
      console.log('No agent found');
      return;
    }

    await prisma.post.create({
      data: {
        title: "Modern Apartment in Downtown",
        price: 1500,
        images: ["https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg"],
        address: "123 Main St",
        city: "Seattle",
        bedroom: 2,
        bathroom: 1,
        latitude: "47.6062",
        longitude: "-122.3321",
        type: "rent",
        property: "apartment",
        userId: user.id,
        postDetail: {
          create: {
            desc: "Beautiful modern apartment in the heart of downtown.",
            utilities: "owner",
            pet: "allowed",
            income: "3x",
            size: 850,
            school: 1,
            bus: 2,
            restaurant: 5
          }
        }
      }
    });

    await prisma.post.create({
      data: {
        title: "Cozy Suburban House",
        price: 2500,
        images: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"],
        address: "456 Oak Ln",
        city: "Seattle",
        bedroom: 3,
        bathroom: 2,
        latitude: "47.6162",
        longitude: "-122.3421",
        type: "rent",
        property: "house",
        userId: user.id,
        postDetail: {
          create: {
            desc: "Spacious house with a large backyard.",
            utilities: "tenant",
            pet: "allowed",
            income: "3x",
            size: 1500,
            school: 2,
            bus: 5,
            restaurant: 10
          }
        }
      }
    });

    console.log("Seeded posts successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

seedPosts();
