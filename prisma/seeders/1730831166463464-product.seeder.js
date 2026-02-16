const { PrismaClient } = require('../../dist/generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

module.exports = {
  async up() {
    const data = [
      {
        name: 'Bread',
        skuNumber: 'FS-9571851',
      },
      {
        name: 'Milk',
        skuNumber: 'AV-8570515',
      },
      {
        name: 'Egg',
        skuNumber: 'KN-0982531',
      },
    ];

    await Promise.all(
      data.map(product =>
        prisma.product.upsert({ where: { name: product.name }, create: product, update: product }),
      ),
    );
  },

  async down() {
    await prisma.product.deleteMany();
  },
};
