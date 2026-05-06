import { Repository } from "typeorm";
import { Screening } from "../../database/entities/screening.js";
import { TicketUsage } from "../../database/entities/ticket.js";

interface ScreeningAttendance {
  screeningId: number;
  movie: string;
  room: string;
  startTime: Date;
  endTime: Date;
  spectators: number;
  capacity: number;
  occupancyRate: number;
}

export interface DailyAttendance {
  date: string;
  scope: string;
  totalSpectators: number;
  totalScreenings: number;
  screenings: ScreeningAttendance[];
}

export interface PeriodAttendance {
  from: string;
  to: string;
  scope: string;
  totalSpectators: number;
  totalScreenings: number;
  averageSpectatorsPerScreening: number;
  averageOccupancyRate: number;
  topMovies: Array<{ movieId: number; title: string; spectators: number }>;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatYMD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export class StatsUsecase {
  constructor(
    private screeningRepository: Repository<Screening>,
    private ticketUsageRepository: Repository<TicketUsage>
  ) {}

  async getDailyAttendance(date: Date, roomId?: number): Promise<DailyAttendance> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const query = this.screeningRepository
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.movie", "movie")
      .leftJoinAndSelect("s.room", "room")
      .where("s.start_time >= :dayStart", { dayStart })
      .andWhere("s.start_time <= :dayEnd", { dayEnd });

    if (roomId !== undefined) {
      query.andWhere("room.id = :roomId", { roomId });
    }

    query.orderBy("s.start_time", "ASC");
    const screenings = await query.getMany();

    const screeningsAttendance: ScreeningAttendance[] = [];
    let totalSpectators = 0;

    for (const s of screenings) {
      const spectators = await this.ticketUsageRepository
        .createQueryBuilder("u")
        .leftJoin("u.screening", "screening")
        .where("screening.id = :id", { id: s.id })
        .getCount();

      totalSpectators += spectators;
      screeningsAttendance.push({
        screeningId: s.id,
        movie: s.movie.title,
        room: s.room.name,
        startTime: s.start_time,
        endTime: s.end_time,
        spectators,
        capacity: s.room.capacity,
        occupancyRate: s.room.capacity > 0 ? spectators / s.room.capacity : 0,
      });
    }

    return {
      date: formatYMD(date),
      scope: roomId !== undefined ? `room ${roomId}` : "all",
      totalSpectators,
      totalScreenings: screenings.length,
      screenings: screeningsAttendance,
    };
  }

  async getPeriodAttendance(from: Date, to: Date, roomId?: number): Promise<PeriodAttendance> {
    const periodStart = startOfDay(from);
    const periodEnd = endOfDay(to);

    const query = this.screeningRepository
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.movie", "movie")
      .leftJoinAndSelect("s.room", "room")
      .where("s.start_time >= :periodStart", { periodStart })
      .andWhere("s.start_time <= :periodEnd", { periodEnd });

    if (roomId !== undefined) {
      query.andWhere("room.id = :roomId", { roomId });
    }

    const screenings = await query.getMany();

    let totalSpectators = 0;
    let totalCapacity = 0;
    const movieAggregation = new Map<number, { title: string; spectators: number }>();

    for (const s of screenings) {
      const spectators = await this.ticketUsageRepository
        .createQueryBuilder("u")
        .leftJoin("u.screening", "screening")
        .where("screening.id = :id", { id: s.id })
        .getCount();

      totalSpectators += spectators;
      totalCapacity += s.room.capacity;

      const previous = movieAggregation.get(s.movie.id);
      movieAggregation.set(s.movie.id, {
        title: s.movie.title,
        spectators: (previous?.spectators ?? 0) + spectators,
      });
    }

    const topMovies = Array.from(movieAggregation.entries())
      .map(([movieId, value]) => ({
        movieId,
        title: value.title,
        spectators: value.spectators,
      }))
      .sort((a, b) => b.spectators - a.spectators)
      .slice(0, 5);

    const totalScreenings = screenings.length;

    return {
      from: formatYMD(from),
      to: formatYMD(to),
      scope: roomId !== undefined ? `room ${roomId}` : "all",
      totalSpectators,
      totalScreenings,
      averageSpectatorsPerScreening:
        totalScreenings > 0 ? Math.round((totalSpectators / totalScreenings) * 100) / 100 : 0,
      averageOccupancyRate:
        totalCapacity > 0 ? Math.round((totalSpectators / totalCapacity) * 1000) / 1000 : 0,
      topMovies,
    };
  }
}
