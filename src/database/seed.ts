/**
 * Script de seed initial.
 * Lance avec : npm run seed
 *
 * Crée :
 *  - 3 utilisateurs (admin, employee, client) avec mot de passe = "password123"
 *  - 7 films
 *  - 12 salles (capacité 15-30, types variés, accès handicapé varié)
 *  - 1 mois de séances (du lundi au vendredi, 3 créneaux par jour) à partir du prochain lundi ouvré
 *
 * Le script est idempotent : si la BDD contient déjà des données dans une table,
 * on ne réseed pas cette table (on ignore).
 */

import "reflect-metadata";
import "dotenv/config";
import { hash } from "bcrypt";
import { AppDataSource } from "./database.js";
import { User, UserRole } from "./entities/user.js";
import { Movie } from "./entities/movie.js";
import { Room, RoomType } from "./entities/room.js";
import { Screening } from "./entities/screening.js";

const SEED_PASSWORD = "password123";

const USERS_TO_SEED: Array<{
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  balance: number;
}> = [
  {
    email: "admin@cinema.com",
    role: UserRole.ADMIN,
    first_name: "Alice",
    last_name: "Admin",
    balance: 0,
  },
  {
    email: "employee@cinema.com",
    role: UserRole.EMPLOYEE,
    first_name: "Eve",
    last_name: "Employee",
    balance: 0,
  },
  {
    email: "client@cinema.com",
    role: UserRole.CLIENT,
    first_name: "Charlie",
    last_name: "Client",
    balance: 100,
  },
];

const MOVIES_TO_SEED: Array<{
  title: string;
  description: string;
  duration: number;
  genre: string;
  release_date: Date;
}> = [
  {
    title: "Inception",
    description: "Un voleur expérimenté dans l'extraction de secrets via les rêves.",
    duration: 148,
    genre: "Science-Fiction",
    release_date: new Date("2010-07-21"),
  },
  {
    title: "La Reine des Neiges",
    description: "Anna part à la recherche de sa soeur Elsa dans un royaume gelé.",
    duration: 102,
    genre: "Animation",
    release_date: new Date("2013-12-04"),
  },
  {
    title: "Dune: Deuxième Partie",
    description: "Paul Atréides s'unit aux Fremen pour venger sa famille.",
    duration: 166,
    genre: "Science-Fiction",
    release_date: new Date("2024-02-28"),
  },
  {
    title: "Le Roi Lion",
    description: "Le jeune Simba apprend à devenir roi de la savane.",
    duration: 88,
    genre: "Animation",
    release_date: new Date("1994-06-15"),
  },
  {
    title: "Interstellar",
    description: "Un voyage à travers l'espace pour sauver l'humanité.",
    duration: 169,
    genre: "Science-Fiction",
    release_date: new Date("2014-11-05"),
  },
  {
    title: "Le Parrain",
    description: "L'histoire d'une famille mafieuse italo-américaine.",
    duration: 175,
    genre: "Drame",
    release_date: new Date("1972-03-24"),
  },
  {
    title: "Toy Story",
    description: "Les jouets de Andy prennent vie quand personne ne les regarde.",
    duration: 81,
    genre: "Animation",
    release_date: new Date("1995-11-22"),
  },
];

const ROOMS_TO_SEED: Array<{
  name: string;
  description: string;
  type: RoomType;
  capacity: number;
  has_disabled_access: boolean;
}> = [
  {
    name: "Salle 1 - Lumière",
    description: "Salle classique 2D",
    type: RoomType.TWO_D,
    capacity: 25,
    has_disabled_access: true,
  },
  {
    name: "Salle 2 - Méliès",
    description: "Salle premium IMAX",
    type: RoomType.IMAX,
    capacity: 30,
    has_disabled_access: true,
  },
  {
    name: "Salle 3 - Gondry",
    description: "Salle VIP premium",
    type: RoomType.VIP,
    capacity: 15,
    has_disabled_access: false,
  },
  {
    name: "Salle 4 - Truffaut",
    description: "Salle 3D",
    type: RoomType.THREE_D,
    capacity: 22,
    has_disabled_access: true,
  },
  {
    name: "Salle 5 - Renoir",
    description: "Salle 4DX immersive",
    type: RoomType.FOUR_DX,
    capacity: 20,
    has_disabled_access: false,
  },
  {
    name: "Salle 6 - Godard",
    description: "Salle 2D",
    type: RoomType.TWO_D,
    capacity: 28,
    has_disabled_access: true,
  },
  {
    name: "Salle 7 - Varda",
    description: "Salle 3D",
    type: RoomType.THREE_D,
    capacity: 18,
    has_disabled_access: true,
  },
  {
    name: "Salle 8 - Resnais",
    description: "Salle IMAX",
    type: RoomType.IMAX,
    capacity: 30,
    has_disabled_access: true,
  },
  {
    name: "Salle 9 - Demy",
    description: "Salle 2D enfants",
    type: RoomType.TWO_D,
    capacity: 16,
    has_disabled_access: true,
  },
  {
    name: "Salle 10 - Kassovitz",
    description: "Salle 4DX",
    type: RoomType.FOUR_DX,
    capacity: 24,
    has_disabled_access: false,
  },
  {
    name: "Salle 11 - Audiard",
    description: "Salle VIP",
    type: RoomType.VIP,
    capacity: 15,
    has_disabled_access: true,
  },
  {
    name: "Salle 12 - Besson",
    description: "Salle 2D",
    type: RoomType.TWO_D,
    capacity: 26,
    has_disabled_access: true,
  },
];

/** Renvoie le prochain lundi à minuit (>= aujourd'hui). */
function nextMonday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

/** Crée une Date au jour donné à l'heure/minute spécifiée. */
function atTime(day: Date, hour: number, minute: number): Date {
  const d = new Date(day);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function seedUsers() {
  const userRepo = AppDataSource.getRepository(User);
  const existing = await userRepo.count();
  if (existing > 0) {
    console.log(`[users] ${existing} déjà présents — skip`);
    return;
  }

  const hashed = await hash(SEED_PASSWORD, 10);

  for (const u of USERS_TO_SEED) {
    const user = userRepo.create({
      email: u.email,
      password: hashed,
      role: u.role,
      first_name: u.first_name,
      last_name: u.last_name,
      balance: u.balance,
    });
    await userRepo.save(user);
  }
  console.log(`[users] ${USERS_TO_SEED.length} créés (mot de passe: ${SEED_PASSWORD})`);
}

async function seedMovies(): Promise<Movie[]> {
  const movieRepo = AppDataSource.getRepository(Movie);
  const existing = await movieRepo.find();
  if (existing.length > 0) {
    console.log(`[movies] ${existing.length} déjà présents — skip`);
    return existing;
  }

  const movies: Movie[] = [];
  for (const m of MOVIES_TO_SEED) {
    const movie = movieRepo.create({
      title: m.title,
      description: m.description,
      duration: m.duration,
      genre: m.genre,
      release_date: m.release_date,
    });
    movies.push(await movieRepo.save(movie));
  }
  console.log(`[movies] ${movies.length} créés`);
  return movies;
}

async function seedRooms(): Promise<Room[]> {
  const roomRepo = AppDataSource.getRepository(Room);
  const existing = await roomRepo.find();
  if (existing.length > 0) {
    console.log(`[rooms] ${existing.length} déjà présentes — skip`);
    return existing;
  }

  const rooms: Room[] = [];
  for (const r of ROOMS_TO_SEED) {
    const room = roomRepo.create({
      name: r.name,
      description: r.description,
      type: r.type,
      capacity: r.capacity,
      has_disabled_access: r.has_disabled_access,
      is_maintenance: false,
    });
    rooms.push(await roomRepo.save(room));
  }
  console.log(`[rooms] ${rooms.length} créées`);
  return rooms;
}

/**
 * Pour chaque jour ouvré sur 30 jours, on programme 3 créneaux
 * (matinée 10h, après-midi 14h, soirée 17h30). À chaque créneau, on remplit
 * autant de salles qu'on a de films, en s'assurant qu'un film n'est pas
 * programmé en simultané dans 2 salles.
 */
async function seedScreenings(movies: Movie[], rooms: Room[]) {
  const screeningRepo = AppDataSource.getRepository(Screening);
  const existing = await screeningRepo.count();
  if (existing > 0) {
    console.log(`[screenings] ${existing} déjà présentes — skip`);
    return;
  }

  if (movies.length === 0 || rooms.length === 0) {
    console.log("[screenings] pas de films ou de salles disponibles — skip");
    return;
  }

  // Créneaux fixes : début du film (l'end est calculé dynamiquement = film + 30 min)
  const slots: Array<{ hour: number; minute: number }> = [
    { hour: 10, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 17, minute: 30 },
  ];

  let day = nextMonday();
  let movieRotationIndex = 0;
  let totalCreated = 0;

  for (let dayCount = 0; dayCount < 30; dayCount++) {
    // Skip weekend
    const weekday = day.getDay();
    if (weekday === 0 || weekday === 6) {
      day = new Date(day);
      day.setDate(day.getDate() + 1);
      continue;
    }

    for (const slot of slots) {
      // À ce créneau, on programme jusqu'à `min(movies, rooms)` séances
      const screeningsThisSlot = Math.min(movies.length, rooms.length);

      for (let i = 0; i < screeningsThisSlot; i++) {
        const movie = movies[(movieRotationIndex + i) % movies.length];
        const room = rooms[i];

        if (!movie || !room) continue;

        const startTime = atTime(day, slot.hour, slot.minute);
        const endTime = new Date(startTime.getTime() + (movie.duration + 30) * 60000);

        // Sécurité : si la fin dépasse 20h, on saute (cas des films très longs sur le créneau du soir)
        if (endTime.getHours() > 20 || (endTime.getHours() === 20 && endTime.getMinutes() > 0)) {
          continue;
        }

        const screening = screeningRepo.create({
          movie,
          room,
          start_time: startTime,
          end_time: endTime,
        });
        await screeningRepo.save(screening);
        totalCreated++;
      }

      // Décale la rotation pour que les films varient entre les créneaux
      movieRotationIndex = (movieRotationIndex + 1) % movies.length;
    }

    // Jour suivant
    day = new Date(day);
    day.setDate(day.getDate() + 1);
  }

  console.log(`[screenings] ${totalCreated} créées sur 30 jours`);
}

export async function seedAllData() {
  console.log("Initialisation de la BDD...");
  await AppDataSource.initialize();

  try {
    await seedUsers();
    const movies = await seedMovies();
    const rooms = await seedRooms();
    await seedScreenings(movies, rooms);
    console.log("\n✅ Seed terminé avec succès");
  } catch (err) {
    console.error("❌ Seed échoué :", err);
    process.exitCode = 1;
  } finally {
    await AppDataSource.destroy();
  }
}

seedAllData();
