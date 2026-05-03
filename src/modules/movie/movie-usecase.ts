import { Repository } from "typeorm";
import { Movie } from "../../database/entities/movie.js";
import { Screening } from "../../database/entities/screening.js";

interface CreateMovieData {
  title: string;
  description?: string | null;
  duration: number;
  genre?: string | null;
  poster_url?: string | null;
  release_date?: Date | null;
}

interface UpdateMovieData {
  id: number;
  title?: string;
  description?: string | null;
  duration?: number;
  genre?: string | null;
  poster_url?: string | null;
  release_date?: Date | null;
}

export interface ListResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListMovieFilter {
  page: number;
  size: number;
  durationMax?: number;
  genre?: string;
  title?: string;
  releasedAfter?: Date;
  releasedBefore?: Date;
}
export class MovieUsecase {
  constructor(
    private movieRepository: Repository<Movie>,
    private screeningRepository: Repository<Screening>
  ) {}

  async createMovie(movieData: CreateMovieData) {
    const existing = await this.movieRepository.findOneBy({
      title: movieData.title,
    });
    if (existing) return null;

    const movie = this.movieRepository.create({
      title: movieData.title,
      description: movieData.description || null,
      duration: movieData.duration,
      genre: movieData.genre || null,
      poster_url: movieData.poster_url || null,
      release_date: movieData.release_date || null,
    });

    return this.movieRepository.save(movie);
  }

  async getMovie(id: number) {
    return this.movieRepository.findOneBy({ id });
  }

  async deleteMovie(id: number) {
    const movie = await this.getMovie(id);
    if (!movie) {
      return null;
    }

    await this.movieRepository.remove(movie);
  }

  async updateMovie(movieData: UpdateMovieData): Promise<Movie | null> {
    const movie = await this.getMovie(movieData.id);
    if (!movie) {
      return null;
    }

    this.movieRepository.merge(movie, movieData);
    return await this.movieRepository.save(movie);
  }

  async listMovies({
    page,
    size,
    durationMax,
    genre,
    title,
    releasedAfter,
    releasedBefore,
  }: ListMovieFilter): Promise<ListResponse<Movie>> {
    const query = this.movieRepository.createQueryBuilder("movie");

    if (durationMax !== undefined) {
      query.andWhere("movie.duration <= :durationMax", { durationMax });
    }

    if (genre !== undefined) {
      query.andWhere("movie.genre = :genre", { genre });
    }

    if (title !== undefined) {
      query.andWhere("movie.title ILIKE :title", { title: `%${title}%` });
    }

    if (releasedAfter !== undefined) {
      query.andWhere("movie.release_date >= :releasedAfter", { releasedAfter });
    }

    if (releasedBefore !== undefined) {
      query.andWhere("movie.release_date <= :releasedBefore", {
        releasedBefore,
      });
    }

    query.skip((page - 1) * size);
    query.take(size);

    const [movies, totalCount] = await query.getManyAndCount();

    return {
      data: movies,
      pageSize: size,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }

  async getScreeningsForMovie(
    movieId: number,
    from?: Date,
    to?: Date
  ): Promise<Screening[] | "MOVIE_NOT_FOUND"> {
    const movie = await this.movieRepository.findOneBy({ id: movieId });
    if (!movie) return "MOVIE_NOT_FOUND";

    const query = this.screeningRepository
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.movie", "movie")
      .leftJoinAndSelect("s.room", "room")
      .where("s.movie_id = :movieId", { movieId })
      .andWhere("room.is_maintenance = false");

    if (from) query.andWhere("s.start_time >= :from", { from });
    if (to) query.andWhere("s.end_time <= :to", { to });

    query.orderBy("s.start_time", "ASC");

    return query.getMany();
  }
}
