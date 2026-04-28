import { Request, Response } from "express";
import { AppDataSource } from "../../database/database.js";
import { Movie } from "../../database/entities/movie.js";
import { Room } from "../../database/entities/room.js";
import { Screening } from "../../database/entities/screening.js";
import {
  hasMinimumScreeningDuration,
  isWithinCinemaOpeningHours,
} from "../../utils/dates.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { ScreeningUsecase } from "./screening-usecase.js";
import {
  CreateScreeningValidator,
  ListScreeningValidator,
  ScreeningIdValidator,
  UpdateScreeningValidator,
} from "./screening-validator.js";

export const CreateScreening = async (req: Request, res: Response) => {
  const validation = CreateScreeningValidator.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const screeningUsecase = new ScreeningUsecase(
    AppDataSource.getRepository(Screening),
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Room)
  );

  const movie = await screeningUsecase.getMovie(validation.value.movie_id);
  if (!movie) {
    return res.status(404).send({
      error: "movie not found",
    });
  }

  const room = await screeningUsecase.getRoom(validation.value.room_id);
  if (!room) {
    return res.status(404).send({
      error: "room not found",
    });
  }

  if (room.is_maintenance) {
    return res.status(400).send({
      error: "room is in maintenance",
    });
  }

  const startTime = validation.value.start_time;
  const endTime = validation.value.end_time;

  if (!isWithinCinemaOpeningHours(startTime)) {
    return res.status(400).send({
      error: "screening must start between 09:00 and 20:00",
    });
  }

  if (!hasMinimumScreeningDuration(startTime, endTime, movie.duration)) {
    return res.status(400).send({
      error: "screening duration must be at least movie duration + 30 minutes",
    });
  }

  const movieOverlap = await screeningUsecase.hasMovieOverlap({
    movieId: movie.id,
    startTime,
    endTime,
  });

  if (movieOverlap) {
    return res.status(409).send({
      error: "overlapping screening detected for this movie",
    });
  }

  try {
    const screening = await screeningUsecase.createScreening({
      movie,
      room,
      start_time: startTime,
      end_time: endTime,
    });

    return res.status(201).send(screening);
  } catch (_error: unknown) {
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const GetScreening = async (req: Request, res: Response) => {
  const validation = ScreeningIdValidator.validate(req.params);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const screeningIdRequest = validation.value;
  const screeningUsecase = new ScreeningUsecase(
    AppDataSource.getRepository(Screening),
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Room)
  );

  const screening = await screeningUsecase.getScreening(screeningIdRequest.id);

  if (screening === null) {
    return res.status(404).send({
      error: "screening not found",
    });
  }

  if (screening.room.is_maintenance) {
    return res.status(404).send({
      error: "screening not found",
    });
  }

  return res.send(screening);
};

export const UpdateScreening = async (req: Request, res: Response) => {
  const validation = UpdateScreeningValidator.validate({
    id: req.params.id,
    ...req.body,
  });

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const updateScreeningRequest = validation.value;
  const screeningUsecase = new ScreeningUsecase(
    AppDataSource.getRepository(Screening),
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Room)
  );

  const existingScreening = await screeningUsecase.getScreening(
    updateScreeningRequest.id
  );

  if (!existingScreening) {
    return res.status(404).send({
      error: "screening not found",
    });
  }

  let movie;
  if (updateScreeningRequest.movie_id !== undefined) {
    movie = await screeningUsecase.getMovie(updateScreeningRequest.movie_id);
    if (!movie) {
      return res.status(404).send({
        error: "movie not found",
      });
    }
  }

  let room;
  if (updateScreeningRequest.room_id !== undefined) {
    room = await screeningUsecase.getRoom(updateScreeningRequest.room_id);
    if (!room) {
      return res.status(404).send({
        error: "room not found",
      });
    }
  }

  const finalMovie = movie ?? existingScreening.movie;
  const finalRoom = room ?? existingScreening.room;
  const finalStartTime =
    updateScreeningRequest.start_time ?? existingScreening.start_time;
  const finalEndTime =
    updateScreeningRequest.end_time ?? existingScreening.end_time;

  if (finalRoom.is_maintenance) {
    return res.status(400).send({
      error: "room is in maintenance",
    });
  }

  if (!isWithinCinemaOpeningHours(finalStartTime)) {
    return res.status(400).send({
      error: "screening must start between 09:00 and 20:00",
    });
  }

  if (
    !hasMinimumScreeningDuration(
      finalStartTime,
      finalEndTime,
      finalMovie.duration
    )
  ) {
    return res.status(400).send({
      error: "screening duration must be at least movie duration + 30 minutes",
    });
  }

  const movieOverlap = await screeningUsecase.hasMovieOverlap({
    movieId: finalMovie.id,
    startTime: finalStartTime,
    endTime: finalEndTime,
    excludeScreeningId: existingScreening.id,
  });

  if (movieOverlap) {
    return res.status(409).send({
      error: "overlapping screening detected for this movie",
    });
  }

  try {
    const updatedScreening = await screeningUsecase.updateScreening({
      id: updateScreeningRequest.id,
      movie: finalMovie,
      room: finalRoom,
      start_time: finalStartTime,
      end_time: finalEndTime,
    });

    return res.send(updatedScreening);
  } catch (_error: unknown) {
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const DeleteScreening = async (req: Request, res: Response) => {
  const validation = ScreeningIdValidator.validate(req.params);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const screeningIdRequest = validation.value;
  const screeningUsecase = new ScreeningUsecase(
    AppDataSource.getRepository(Screening),
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Room)
  );

  const screening = await screeningUsecase.getScreening(screeningIdRequest.id);

  if (!screening) {
    return res.status(404).send({
      error: "screening not found",
    });
  }

  await screeningUsecase.deleteScreening(screeningIdRequest.id);
  return res.status(204).send();
};

export const ListScreenings = async (req: Request, res: Response) => {
  const validation = ListScreeningValidator.validate(req.query);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const listScreeningRequest = validation.value;

  let size = 10;
  if (listScreeningRequest.size !== undefined) {
    size = listScreeningRequest.size;
  }

  let page = 1;
  if (listScreeningRequest.page !== undefined) {
    page = listScreeningRequest.page;
  }

  const screeningUsecase = new ScreeningUsecase(
    AppDataSource.getRepository(Screening),
    AppDataSource.getRepository(Movie),
    AppDataSource.getRepository(Room)
  );

  const screenings = await screeningUsecase.listScreenings({
    page,
    size,
    movieId: listScreeningRequest.movieId,
    roomId: listScreeningRequest.roomId,
    from: listScreeningRequest.from,
    to: listScreeningRequest.to,
  });

  return res.send(screenings.data);
};
