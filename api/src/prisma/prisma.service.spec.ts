describe('PrismaService', () => {
  it('constructs the generated client with a PostgreSQL adapter without connecting', async () => {
    const previousUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

    try {
      const { PrismaService } = require('./prisma.service') as typeof import('./prisma.service');
      const prisma = new PrismaService();

      try {
        expect(typeof prisma.$connect).toBe('function');
        expect(typeof prisma.book.findMany).toBe('function');
        expect(typeof prisma.genre.findMany).toBe('function');
      } finally {
        await prisma.$disconnect();
      }
    } finally {
      if (previousUrl === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = previousUrl;
      }
    }
  });
});
