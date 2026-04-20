import { Request, Response } from "express";
import { AppDataSource } from "../../database/database.js";
import { Movie } from "../../database/entities/movie.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { MovieUsecase } from "./movie-usecase.js";
import {
  CreateMovieValidator,
  ListMovieValidator,
  MovieIdValidator,
  UpdateMovieValidator,
} from "./movie-validator.js";

export const CreateMovie = async (req: Request, res: Response) => {
  const validation = CreateMovieValidator.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const movieUseCase = new MovieUsecase(AppDataSource.getRepository(Movie));

  try {
    const movie = await movieUseCase.createMovie(validation.value);
    return res.status(201).send(movie);
  } catch (_error: unknown) {
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const GetMovie = async (req: Request, res: Response) => {
  const validation = MovieIdValidator.validate(req.params);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const movieIdRequest = validation.value;
  const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));
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
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const updateMovieRequest = validation.value;
  const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));
  const existingMovie = await movieUsecase.getMovie(updateMovieRequest.id);

  if (!existingMovie) {
    return res.status(404).send({
      error: "movie not found",
    });
  }

  try {
    const updatedMovie = await movieUsecase.updateMovie(validation.value);
    return res.send(updatedMovie);
  } catch (_error: unknown) {
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const DeleteMovie = async (req: Request, res: Response) => {
  const validation = MovieIdValidator.validate(req.params);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const movieIdRequest = validation.value;
  const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));
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
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
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

  const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));
  const movies = await movieUsecase.listMovies({
    page,
    size,
    durationMax: listMovieRequest.durationMax,
    genre: listMovieRequest.genre,
  });

  return res.send(movies.data);
};
