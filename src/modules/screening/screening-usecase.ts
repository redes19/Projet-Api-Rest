import { Repository } from "typeorm";
import { Movie } from "../../database/entities/movie.js";
import { Room } from "../../database/entities/room.js";
import { Screening } from "../../database/entities/screening.js";

interface CreateScreeningData {
  movie: Movie;
  room: Room;
  start_time: Date;
  end_time: Date;
}

interface UpdateScreeningData {
  id: number;
  movie?: Movie | undefined;
  room?: Room | undefined;
  start_time?: Date | undefined;
  end_time?: Date | undefined;
}

export interface ListResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListScreeningFilter {
  page: number;
  size: number;
  movieId?: number | undefined;
  roomId?: number | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
}

export class ScreeningUsecase {
  constructor(
    private screeningRepository: Repository<Screening>,
    private movieRepository: Repository<Movie>,
    private roomRepository: Repository<Room>
  ) {}

  async getMovie(id: number) {
    return this.movieRepository.findOneBy({ id });
  }

  async getRoom(id: number) {
    return this.roomRepository.findOneBy({ id });
  }

  async createScreening(screeningData: CreateScreeningData) {
    const screening = this.screeningRepository.create({
      movie: screeningData.movie,
      room: screeningData.room,
      start_time: screeningData.start_time,
      end_time: screeningData.end_time,
    });

    const savedScreening = await this.screeningRepository.save(screening);
    return this.getScreening(savedScreening.id);
  }

  async getScreening(id: number) {
    return this.screeningRepository.findOne({
      where: { id },
      relations: { movie: true, room: true },
    });
  }

  async deleteScreening(id: number) {
    const screening = await this.screeningRepository.findOneBy({ id });
    if (!screening) {
      return null;
    }

    await this.screeningRepository.remove(screening);
  }

  async updateScreening(
    screeningData: UpdateScreeningData
  ): Promise<Screening | null> {
    const screening = await this.screeningRepository.findOneBy({
      id: screeningData.id,
    });

    if (!screening) {
      return null;
    }

    if (screeningData.movie !== undefined) {
      screening.movie = screeningData.movie;
    }

    if (screeningData.room !== undefined) {
      screening.room = screeningData.room;
    }

    if (screeningData.start_time !== undefined) {
      screening.start_time = screeningData.start_time;
    }

    if (screeningData.end_time !== undefined) {
      screening.end_time = screeningData.end_time;
    }

    const updatedScreening = await this.screeningRepository.save(screening);
    return this.getScreening(updatedScreening.id);
  }

  async listScreenings({
    page,
    size,
    movieId,
    roomId,
    from,
    to,
  }: ListScreeningFilter): Promise<ListResponse<Screening>> {
    const query = this.screeningRepository
      .createQueryBuilder("screening")
      .leftJoinAndSelect("screening.movie", "movie")
      .leftJoinAndSelect("screening.room", "room");

    if (movieId !== undefined) {
      query.andWhere("movie.id = :movieId", { movieId });
    }

    if (roomId !== undefined) {
      query.andWhere("room.id = :roomId", { roomId });
    }

    if (from !== undefined) {
      query.andWhere("screening.start_time >= :from", { from });
    }

    if (to !== undefined) {
      query.andWhere("screening.end_time <= :to", { to });
    }

    query.orderBy("screening.start_time", "ASC");
    query.skip((page - 1) * size);
    query.take(size);

    const [screenings, totalCount] = await query.getManyAndCount();

    return {
      data: screenings,
      pageSize: size,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }
}
