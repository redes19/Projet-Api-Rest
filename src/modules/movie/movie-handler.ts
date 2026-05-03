import { Request, Response } from "express";
import { AppDataSource } from "../../database/database.js";
import { Movie } from "../../database/entities/movie.js";
import { Screening } from "../../database/entities/screening.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { MovieUsecase, type ListMovieFilter } from "./movie-usecase.js";
import {
  CreateMovieValidator,
  ListMovieValidator,
  MovieIdValidator,
  UpdateMovieValidator,
  MovieScreeningsValidator,
} from "./movie-validator.js";

export const CreateMovie = async (req: Request, res: Response) => {
  const validation = CreateMovieValidator.validate(req.body);

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const movieUseCase = new MovieUsecase(
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Screening)
  );

  try {
    const movie = await movieUseCase.createMovie(validation.value);

    if (!movie) {
      return res.status(409).send({
        title: "title is already taken",
      });
    }

    return res.status(201).send(movie);
  } catch (error: unknown) {
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const GetMovie = async (req: Request, res: Response) => {
  const validation = MovieIdValidator.validate(req.params);

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const movieIdRequest = validation.value;
  const movieUsecase = new MovieUsecase(
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Screening)
  );
  const movie = await movieUsecase.getMovie(movieIdRequest.id);

  if (movie === null) {
    return res.status(404).send({
      error: "movie not found",
    });
  }

  return res.send(movie);
};

export const UpdateMovie = async (req: Request, res: Response) => {
  const validation = UpdateMovieValidator.validate({
    id: req.params.id,
    ...req.body,
  });

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const updateMovieRequest = validation.value;
  const movieUsecase = new MovieUsecase(
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Screening)
  );
  const existingMovie = await movieUsecase.getMovie(updateMovieRequest.id);

  if (!existingMovie) {
    return res.status(404).send({
      error: "movie not found",
    });
  }

  try {
    const updatedMovie = await movieUsecase.updateMovie(validation.value);
    return res.send(updatedMovie);
  } catch (error: unknown) {
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const DeleteMovie = async (req: Request, res: Response) => {
  const validation = MovieIdValidator.validate(req.params);

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const movieIdRequest = validation.value;
  const movieUsecase = new MovieUsecase(
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Screening)
  );
  const movie = await movieUsecase.getMovie(movieIdRequest.id);

  if (!movie) {
    return res.status(404).send({
      error: "movie not found",
    });
  }

  await movieUsecase.deleteMovie(movieIdRequest.id);
  return res.status(204).send();
};

export const ListMovies = async (req: Request, res: Response) => {
  const validation = ListMovieValidator.validate(req.query);

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const listMovieRequest = validation.value;

  let size = 10;
  if (listMovieRequest.size !== undefined) {
    size = listMovieRequest.size;
  }

  let page = 1;
  if (listMovieRequest.page !== undefined) {
    page = listMovieRequest.page;
  }

  const movieUsecase = new MovieUsecase(
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Screening)
  );
  const listMovieFilter: ListMovieFilter = {
    page,
    size,
    ...(listMovieRequest.durationMax !== undefined
      ? { durationMax: listMovieRequest.durationMax }
      : {}),
    ...(listMovieRequest.genre !== undefined ? { genre: listMovieRequest.genre } : {}),
    ...(listMovieRequest.title !== undefined ? { title: listMovieRequest.title } : {}),
    ...(listMovieRequest.releasedAfter !== undefined
      ? { releasedAfter: listMovieRequest.releasedAfter }
      : {}),
    ...(listMovieRequest.releasedBefore !== undefined
      ? { releasedBefore: listMovieRequest.releasedBefore }
      : {}),
  };

  const movies = await movieUsecase.listMovies(listMovieFilter);

  return res.send(movies.data);
};

export const GetMovieScreenings = async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.id as string, 10);
  if (isNaN(movieId)) {
    return res.status(400).send({ error: "Invalid movie id" });
  }

  const validation = MovieScreeningsValidator.validate(req.query);
  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const movieUsecase = new MovieUsecase(
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Screening)
  );

  const result = await movieUsecase.getScreeningsForMovie(
    movieId,
    validation.value.from,
    validation.value.to
  );

  if (result === "MOVIE_NOT_FOUND") {
    return res.status(404).send({ error: "Movie not found" });
  }

  return res.send(result);
};
