# Library Management System

Full-stack library management application built with **NestJS**, **Prisma**, **PostgreSQL**, and **React**.

Part of the **Power Learn Project (PLP)** Full-Stack Development module.  
**#1MillionDevs4Africa**

---

## Schema Decisions

### Why Book references Genre via a foreign key instead of embedding the genre name

We chose a **relational** approach:

- A `Book` stores only a `genreId` (foreign key).
- The actual genre data (`name`, `slug`) lives in a separate `Genre` table.
- The relationship is declared with `@relation(fields: [genreId], references: [id])`.

**Reasons:**

1. **Avoid data duplication** – Many books share the same genre. Storing the genre name on every book would repeat the same string hundreds of times.
2. **Single source of truth** – If a genre is renamed (e.g. “Sci-Fi” → “Science Fiction”), we update it in one place. All books automatically reflect the change.
3. **Independent management** – Genres can be created, listed, updated, or soft-deleted without touching the Book table.
4. **Referential integrity** – PostgreSQL (and Prisma) will reject any book that points to a non-existent genreId.
5. **Natural fit for relational databases** – This is the standard way to model one-to-many relationships in PostgreSQL.

Embedding the genre name directly inside the Book model would be more common in a document database (MongoDB-style). In a relational system the foreign-key approach is cleaner, more maintainable, and safer.

### Role Enum

The `User` model uses a Prisma `enum Role { PATRON LIBRARIAN }`.  
This gives us:

- Compile-time safety in TypeScript
- Database-level enforcement (invalid values are rejected)
- Clear distinction between ordinary users and staff for future authorization (Guards in Week 2)

---

## Project Structure (Week 1)

```
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma      # Data models
│   │   └── seed.ts            # Sample data
│   ├── src/
│   │   └── prisma/
│   │       └── prisma.service.ts
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- Node.js 20+
- A free hosted PostgreSQL database (Neon.tech or Supabase recommended)

### 2. Setup

```bash
cd api
cp .env.example .env
# Edit .env and paste your real DATABASE_URL

npm install
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npx prisma studio   # optional – browse the data
```

### 3. Verify
Open Prisma Studio (`npx prisma studio`) and confirm:
- At least 4 genres
- At least 15 books distributed across those genres
- User model exists (even if empty for now)

---

## Stretch (Completed)

### Review Model
Added a `Review` model that links Book and User:

```prisma
model Review {
  id        Int      @id @default(autoincrement())
  rating    Int      // 1–5
  comment   String?
  bookId    Int
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  book Book @relation(fields: [bookId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([bookId, userId]) // one review per user per book
}
```

- A user can leave only one review per book (`@@unique`)
- Deleting a book or user cascades and removes related reviews
- This is a classic many-to-many style relationship expressed with a join table that also carries extra data (rating + comment)

### Reflection: Prisma vs Document Database
Coming from a document-database mindset (MongoDB), the biggest difference was how deliberately you have to declare relationships up front with foreign keys and `@relation`. In a document store you can simply nest a genre object or an array of reviews inside a book document. In Prisma + PostgreSQL you model the relationship explicitly, which feels more rigid at first, but the payoff is strong type safety, referential integrity, and the ability to query/filter/join efficiently later. Once the mental model clicks, the structure actually makes large applications easier to reason about.

---

