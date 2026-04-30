import { Request, Response } from "express";
import { AppDataSource } from "../../database/database.js";
import { Room } from "../../database/entities/room.js";
import { ResourceConflictError } from "../../utils/errors.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { RoomUsecase } from "./room-usecase.js";
import {
  CreateRoomValidator,
  ListRoomValidator,
  RoomIdValidator,
  UpdateRoomValidator,
  RoomScreeningsValidator,
} from "./room-validator.js";
import { Screening } from "../../database/entities/screening.js";

export const CreateRoom = async (req: Request, res: Response) => {
  const validation = CreateRoomValidator.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const roomUseCase = new RoomUsecase(
    AppDataSource.getRepository(Room),
    AppDataSource.getRepository(Screening)
  );
  const existingRoom = await roomUseCase.getRoomByName(req.body.name);

  if (existingRoom) {
    return res.status(409).send({
      name: "name is already taken",
    });
  }

  try {
    const room = await roomUseCase.createRoom(validation.value);
    return res.status(201).send(room);
  } catch (error: unknown) {
    if (error instanceof ResourceConflictError) {
      return res.status(409).send({
        name: "name is already taken",
      });
    }

    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const GetRoom = async (req: Request, res: Response) => {
  const validation = RoomIdValidator.validate(req.params);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const roomIdRequest = validation.value;
  const roomUsecase = new RoomUsecase(
    AppDataSource.getRepository(Room),
    AppDataSource.getRepository(Screening)
  );
  const room = await roomUsecase.getRoom(roomIdRequest.id);

  if (room === null) {
    return res.status(404).send({
      error: "room not found",
    });
  }

  return res.send(room);
};

export const UpdateRoom = async (req: Request, res: Response) => {
  const validation = UpdateRoomValidator.validate({
    id: req.params.id,
    ...req.body,
  });

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const updateRoomRequest = validation.value;
  const roomUsecase = new RoomUsecase(
    AppDataSource.getRepository(Room),
    AppDataSource.getRepository(Screening)
  );
  const existingRoom = await roomUsecase.getRoom(updateRoomRequest.id);

  if (!existingRoom) {
    return res.status(404).send({
      error: "room not found",
    });
  }

  try {
    const updatedRoom = await roomUsecase.updateRoom(validation.value);
    return res.send(updatedRoom);
  } catch (error: unknown) {
    if (error instanceof ResourceConflictError) {
      return res.status(409).send({
        name: "name is already taken",
      });
    }

    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const DeleteRoom = async (req: Request, res: Response) => {
  const validation = RoomIdValidator.validate(req.params);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const roomIdRequest = validation.value;
  const roomUsecase = new RoomUsecase(
    AppDataSource.getRepository(Room),
    AppDataSource.getRepository(Screening)
  );
  const room = await roomUsecase.getRoom(roomIdRequest.id);

  if (!room) {
    return res.status(404).send({
      error: "room not found",
    });
  }

  await roomUsecase.deleteRoom(roomIdRequest.id);
  return res.status(204).send();
};

export const ListRooms = async (req: Request, res: Response) => {
  const validation = ListRoomValidator.validate(req.query);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const listRoomRequest = validation.value;

  let size = 10;
  if (listRoomRequest.size !== undefined) {
    size = listRoomRequest.size;
  }

  let page = 1;
  if (listRoomRequest.page !== undefined) {
    page = listRoomRequest.page;
  }

  const roomUsecase = new RoomUsecase(
    AppDataSource.getRepository(Room),
    AppDataSource.getRepository(Screening)
  );
  const rooms = await roomUsecase.listRooms({
    page,
    size,
    capacityMax: listRoomRequest.capacityMax,
    isMaintenance: listRoomRequest.isMaintenance,
  });

  return res.send(rooms.data);
};

export const GetRoomScreenings = async (req: Request, res: Response) => {
  const roomId = parseInt(req.params.id as string, 10);
  if (isNaN(roomId)) {
    return res.status(400).send({ error: "Invalid room id" });
  }

  const validation = RoomScreeningsValidator.validate(req.query);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const usecase = new RoomUsecase(
    AppDataSource.getRepository(Room),
    AppDataSource.getRepository(Screening)
  );

  const result = await usecase.getScreeningsForRoom(
    roomId,
    validation.value.from,
    validation.value.to
  );

  if (result === "ROOM_NOT_FOUND") {
    return res.status(404).send({ error: "Room not found" });
  }
  if (result === "ROOM_IN_MAINTENANCE") {
    return res.status(404).send({ error: "Room not found" }); // ou 409 si tu veux être explicite
  }

  return res.send(result);
};
