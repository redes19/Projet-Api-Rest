import { Request, Response } from "express";
import {
  LoginValidator,
  RegisterValidator,
  RefreshValidator,
} from "../user/user-validator.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { AuthUsecase } from "./auth-usecase.js";
import { AppDataSource } from "../../database/database.js";
import { User } from "../../database/entities/user.js";
import { Token } from "../../database/entities/token.js";

const buildAuthUsecase = () =>
  new AuthUsecase(
    AppDataSource.getRepository(User),
    AppDataSource.getRepository(Token)
  );

export const Login = async (req: Request, res: Response) => {
  const validation = LoginValidator.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  try {
    const tokens = await buildAuthUsecase().login(validation.value);
    if (!tokens) {
      return res.status(401).send({ error: "invalid email or password" });
    }
    return res.send(tokens);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const Register = async (req: Request, res: Response) => {
  const validation = RegisterValidator.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  try {
    const tokens = await buildAuthUsecase().register(validation.value);
    if (!tokens) {
      return res.status(409).send({ error: "email is already taken" });
    }
    return res.status(201).send(tokens);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const Refresh = async (req: Request, res: Response) => {
  const validation = RefreshValidator.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  try {
    const tokens = await buildAuthUsecase().refresh(
      validation.value.refreshToken
    );
    if (!tokens) {
      return res
        .status(401)
        .send({ error: "invalid or expired refresh token" });
    }
    return res.send(tokens);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
