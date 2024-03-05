import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const pokemonData: Prisma.PokemonCreateInput[] = [
  {
    name: "Bulbizarre",
    hp: 25,
    cp: 5,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
    types: ["Plante", "Poison"],
  },
  {
    name: "Salamèche",
    hp: 30,
    cp: 6,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png",
    types: ["Feu"],
  },
  {
    name: "Carapuce",
    hp: 21,
    cp: 4,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/007.png",
    types: ["Eau"],
  },
  {
    name: "Aspicot",
    hp: 18,
    cp: 3,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/013.png",
    types: ["Insecte", "Poison"],
  },
  {
    name: "Roucool",
    hp: 30,
    cp: 8,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/016.png",
    types: ["Normal", "Vol"],
  },
  {
    name: "Abo",
    hp: 16,
    cp: 4,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/023.png",
    types: ["Poison"],
  },
  {
    name: "Pikachu",
    hp: 21,
    cp: 7,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/025.png",
    types: ["Electrik"],
  },
  {
    name: "Sabelette",
    hp: 19,
    cp: 3,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/027.png",
    types: ["Sol"],
  },
  {
    name: "Mélofée",
    hp: 25,
    cp: 5,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/035.png",
    types: ["Fée"],
  },
  {
    name: "Groupix",
    hp: 17,
    cp: 8,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/037.png",
    types: ["Feu"],
  },
  {
    name: "Mini-draco",
    hp: 17,
    cp: 8,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/147.png",
    types: ["Dragon"],
  },
  {
    name: "Fantominus",
    hp: 17,
    cp: 8,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/092.png",
    types: ["Spectre", "Poison"],
  },
  {
    name: "Machoc",
    hp: 17,
    cp: 8,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/066.png",
    types: ["Combat"],
  },
  {
    name: "Abra",
    hp: 17,
    cp: 8,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/063.png",
    types: ["Psy"],
  },
  {
    name: "Kabuto",
    hp: 17,
    cp: 8,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/140.png",
    types: ["Roche", "Eau"],
  },
  {
    name: "Sabelette d'Alola",
    hp: 17,
    cp: 8,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/027.png",
    types: ["Glace", "Acier"],
  },
];

async function populateDb() {
  console.log(`Start seeding ...`);
  for (const p of pokemonData) {
    const pokemon = await prisma.pokemon.create({
      data: p,
    });
    console.log(
      `Created pokemon with id: ${pokemon.id} and named:${pokemon.name}`
    );
  }
  console.log(`Seeding finished.`);
}

populateDb()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
