const { PrismaClient } = require('../../dist/generated/prisma/client');
const { PasswordService } = require('../utils/password.service');
const { PrismaPg } = require('@prisma/adapter-pg');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const passwordService = new PasswordService(
  process.env.USER_PASSWORD_SALT_PREFIX,
  process.env.USER_PASSWORD_SALT_SUFFIX,
);

module.exports = {
  async up() {
    const data = [
      {
        email: 'johndoe@gmail.com',
        password: await passwordService.hash('#Password123'),
        refreshToken: null,
        firstName: 'John',
        lastName: 'Doe',
        role: 'Admin',
      },
    ];

    await Promise.all(
      data.map(user =>
        prisma.user.upsert({ where: { email: user.email }, create: user, update: user }),
      ),
    );
  },

  async down() {
    await prisma.user.deleteMany();
  },
};
