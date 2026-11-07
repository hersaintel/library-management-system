import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '.prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log('Start seeding...');


  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();

  // Create genres
  const genreData = [
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Science Fiction', slug: 'science-fiction' },
    { name: 'Mystery', slug: 'mystery' },
    { name: 'Biography', slug: 'biography' },
    { name: 'Romance', slug: 'romance' },
  ];

  const genres = await Promise.all(
    genreData.map((g) =>
      prisma.genre.create({
        data: g,
      }),
    ),
  );

  console.log(`Created ${genres.length} genres`);

  // Helper to find genre by name
  const getGenreId = (name: string) => {
    const genre = genres.find((g) => g.name === name);
    if (!genre) throw new Error(`Genre ${name} not found`);
    return genre.id;
  };

  // Sample books (at least 15 across 4+ genres)
  const books = [
    // Fantasy
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780547928227',
      description: 'A hobbit’s unexpected journey to reclaim a dwarven kingdom.',
      totalCopies: 5,
      availableCopies: 5,
      genreId: getGenreId('Fantasy'),
    },
    {
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      isbn: '9780756404741',
      description: 'The tale of Kvothe, a legendary figure recounting his life.',
      totalCopies: 3,
      availableCopies: 3,
      genreId: getGenreId('Fantasy'),
    },
    {
      title: 'A Game of Thrones',
      author: 'George R.R. Martin',
      isbn: '9780553386790',
      description: 'Noble families fight for control of the Iron Throne.',
      totalCopies: 4,
      availableCopies: 4,
      genreId: getGenreId('Fantasy'),
    },
    {
      title: 'The Way of Kings',
      author: 'Brandon Sanderson',
      isbn: '9780765326355',
      description: 'Epic fantasy set on the storm-swept world of Roshar.',
      totalCopies: 3,
      availableCopies: 3,
      genreId: getGenreId('Fantasy'),
    },

    // Science Fiction
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '9780441172719',
      description: 'A young man becomes the leader of a desert planet’s rebellion.',
      totalCopies: 4,
      availableCopies: 4,
      genreId: getGenreId('Science Fiction'),
    },
    {
      title: 'Neuromancer',
      author: 'William Gibson',
      isbn: '9780441569595',
      description: 'A washed-up hacker is hired for one last job in cyberspace.',
      totalCopies: 2,
      availableCopies: 2,
      genreId: getGenreId('Science Fiction'),
    },
    {
      title: 'The Martian',
      author: 'Andy Weir',
      isbn: '9780553418026',
      description: 'An astronaut stranded on Mars fights to survive.',
      totalCopies: 5,
      availableCopies: 5,
      genreId: getGenreId('Science Fiction'),
    },
    {
      title: 'Foundation',
      author: 'Isaac Asimov',
      isbn: '9780553293357',
      description: 'A mathematician predicts the fall of a galactic empire.',
      totalCopies: 3,
      availableCopies: 3,
      genreId: getGenreId('Science Fiction'),
    },

    // Mystery
    {
      title: 'The Big Sleep',
      author: 'Raymond Chandler',
      isbn: '9780394752631',
      description: 'Private detective Philip Marlowe investigates a blackmail case.',
      totalCopies: 3,
      availableCopies: 3,
      genreId: getGenreId('Mystery'),
    },
    {
      title: 'Gone Girl',
      author: 'Gillian Flynn',
      isbn: '9780307588371',
      description: 'A woman disappears on her fifth wedding anniversary.',
      totalCopies: 4,
      availableCopies: 4,
      genreId: getGenreId('Mystery'),
    },
    {
      title: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      isbn: '9780307454546',
      description: 'A journalist and a hacker investigate a decades-old disappearance.',
      totalCopies: 3,
      availableCopies: 3,
      genreId: getGenreId('Mystery'),
    },

    // Biography
    {
      title: 'Educated',
      author: 'Tara Westover',
      isbn: '9780399590504',
      description: 'A woman raised in a survivalist family pursues education.',
      totalCopies: 4,
      availableCopies: 4,
      genreId: getGenreId('Biography'),
    },
    {
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      isbn: '9781451648539',
      description: 'The definitive biography of Apple’s co-founder.',
      totalCopies: 3,
      availableCopies: 3,
      genreId: getGenreId('Biography'),
    },
    {
      title: 'Becoming',
      author: 'Michelle Obama',
      isbn: '9781524763138',
      description: 'The former First Lady reflects on her life and values.',
      totalCopies: 5,
      availableCopies: 5,
      genreId: getGenreId('Biography'),
    },

    // Romance (extra genre)
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      description: 'Elizabeth Bennet navigates love and social expectations.',
      totalCopies: 4,
      availableCopies: 4,
      genreId: getGenreId('Romance'),
    },
    {
      title: 'The Notebook',
      author: 'Nicholas Sparks',
      isbn: '9780446605236',
      description: 'A story of enduring love told through a notebook.',
      totalCopies: 3,
      availableCopies: 3,
      genreId: getGenreId('Romance'),
    },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  console.log(`Created ${books.length} books`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
