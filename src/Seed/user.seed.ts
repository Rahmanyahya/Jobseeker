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
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
