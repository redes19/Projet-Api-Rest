import { Request, Response } from "express";
import { AppDataSource } from "../../database/database.js";
import { User } from "../../database/entities/user.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { BalanceUsecase } from "./balance-usecase.js";
import { BalanceIdValidator, DepositBalanceValidator } from "./balance-validator.js";

const buildBalanceUsecase = () => {
  return new BalanceUsecase(AppDataSource.getRepository(User));
};

export const GetBalance = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user.userId;
  const validation = BalanceIdValidator.validate({ id: userId });

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  try {
    const balance = await buildBalanceUsecase().getBalance(userId);
    return res.send({ balance });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const DepositBalance = async (req: Request, res: Response) => {
  const validation = DepositBalanceValidator.validate(req.body);
  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user.userId;

  try {
    const newBalance = await buildBalanceUsecase().depositBalance(userId, validation.value.amount);
    return res.send({ balance: newBalance });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const WithdrawBalance = async (req: Request, res: Response) => {
  const validation = DepositBalanceValidator.validate(req.body);
  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user.userId;

  try {
    const newBalance = await buildBalanceUsecase().withdrawBalance(userId, validation.value.amount);
    return res.send({ balance: newBalance });
  } catch (error) {
    if (error instanceof Error && error.message === "Insufficient balance") {
      return res.status(400).send({ error: "Insufficient balance" });
    }
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
