import { Request, Response } from "express";
import { LoginValidator } from "../user/user-validator.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { AuthUsecase } from "./auth-usecase.js";
import { AppDataSource } from "../../database/database.js";
import { User } from "../../database/entities/user.js";
import { Token } from "../../database/entities/token.js";

export const Login = async (req: Request, res: Response) => {
  const validation = LoginValidator.validate(req.body);
  if (validation.error)
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));

  const loginRequest = validation.value;

  const authUsecase = new AuthUsecase(
    AppDataSource.getRepository(User),
    AppDataSource.getRepository(Token)
  );

  console.log("loginRequest ", loginRequest);

  try {
    const token = await authUsecase.login({
      email: loginRequest.email,
      password: loginRequest.password,
    });

    if (token == null) {
      return res.status(401).send({ error: "invalid email or password" });
    }

    return res.send(token);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};
