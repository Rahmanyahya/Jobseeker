import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10);

  await prisma.user.create({
    data: {
      email: 'rahmanyahya647@gmail.com',
      password: hashedPassword,
      role: 'SOCIETY',
      name: 'Rahman Yahya',
      avatar:
        'https://res.cloudinary.com/dx8zjyq5w/image/upload/v1685000009/avatars/rahmanyahya647.jpg',
      avatar_public_id: 'avatars/rahmanyahya647.jpg',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    await prisma.$disconnect();
    process.exit(1);
  });
