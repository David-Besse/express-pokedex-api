-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "hp" INTEGER NOT NULL DEFAULT 100,
    "cp" INTEGER NOT NULL DEFAULT 10,
    "picture" VARCHAR(100) NOT NULL DEFAULT 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png',
    "types" TEXT[] DEFAULT ARRAY['plante']::TEXT[],
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
