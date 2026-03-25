import { Request, Response } from "express";
import { UserUsecase } from "./user-usecase.js";
import { AppDataSource } from "../../database/database.js";
import { User } from "../../database/entities/user.js";
import { ResourceConflictError } from "../../utils/errors.js";
import {
  CreateUserValidator,
  ListUserValidator,
  UpdateUserValidator,
  UserIdValidator,
} from "./user-validator.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";

export const CreateUser = async (req: Request, res: Response) => {
  const validation = CreateUserValidator.validate(req.body);

  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const userUseCase = new UserUsecase(AppDataSource.getRepository(User));

  const existingUser = await userUseCase.getUserByEmail(req.body.email);
  if (existingUser) {
    return res.status(409).send({
      email: "email is already taken",
    });
  }

  try {
    const user = await userUseCase.createUser(req.body);
    const { password, ...sanitizedUser } = user as User;

    return res.status(201).send(sanitizedUser);
  } catch (error: unknown) {
    if (error instanceof ResourceConflictError) {
      return res.status(409).send({
        email: "email is already taken",
      });
    }
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const GetUser = async (req: Request, res: Response) => {
  const validation = UserIdValidator.validate(req.params);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }
  const userIdRequest = validation.value;
  const userUsecase = new UserUsecase(AppDataSource.getRepository(User));

  const user = await userUsecase.getUser(userIdRequest.id);

  if (user === null) {
    return res.status(404).send({
      error: "user not found",
    });
  }

  const { password, ...sanitizedUser } = user as User;
  return res.send(sanitizedUser);
};

export const UpdateUser = async (req: Request, res: Response) => {
  const validation = UpdateUserValidator.validate({
    id: req.params.id,
    ...req.body,
  });
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }
  const updateUserRequest = validation.value;

  const userUsecase = new UserUsecase(AppDataSource.getRepository(User));
  const existingUser = await userUsecase.getUser(updateUserRequest.id);
  if (!existingUser) {
    return res.status(404).send({
      error: "user not found",
    });
  }

  try {
    const updatedUser = await userUsecase.updateUser(validation.value);
    const { password, ...sanitizedUser } = updatedUser as User;
    return res.send(sanitizedUser);
  } catch (error: unknown) {
    if (error instanceof ResourceConflictError) {
      return res.status(409).send({
        email: "email is already taken",
      });
    }
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  const validation = UserIdValidator.validate(req.params);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }
  const userIdRequest = validation.value;
  const userUsecase = new UserUsecase(AppDataSource.getRepository(User));
  const user = await userUsecase.getUser(userIdRequest.id);
  if (!user) {
    return res.status(404).send({
      error: "user not found",
    });
  }
  await userUsecase.deleteUser(userIdRequest.id);
  return res.status(204).send();
};

export const ListUsers = async (req: Request, res: Response) => {
  const validation = ListUserValidator.validate(req.query);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }
  const listUserRequest = validation.value;
  let size = 10;
  if (listUserRequest.size !== undefined) {
    size = listUserRequest.size;
  }

  let page = 1;
  if (listUserRequest.page !== undefined) {
    page = listUserRequest.page;
  }

  const userUsecase = new UserUsecase(AppDataSource.getRepository(User));

  const users = await userUsecase.listUsers({
    page,
    size,
    balanceMax: listUserRequest.balanceMax,
  });

  const sanitizedUsers = users.data.map((user: User) => {
    const { password, ...rest } = user;
    return rest;
  });

  return res.send(sanitizedUsers);
};
