import { Repository } from "typeorm";
import { Movie } from "../../database/entities/movie.js";

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
  durationMax?: number | undefined;
  genre?: string | undefined;
}

export class MovieUsecase {
  constructor(private movieRepository: Repository<Movie>) {}

  async createMovie(movieData: CreateMovieData) {
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
  }: ListMovieFilter): Promise<ListResponse<Movie>> {
    const query = this.movieRepository.createQueryBuilder("movie");

    if (durationMax !== undefined) {
      query.andWhere("movie.duration <= :durationMax", { durationMax });
    }

    if (genre !== undefined) {
      query.andWhere("movie.genre = :genre", { genre });
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
}
