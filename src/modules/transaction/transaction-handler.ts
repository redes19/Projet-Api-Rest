import { Request, Response } from "express";
import { AppDataSource } from "../../database/database.js";
import { Transaction } from "../../database/entities/transaction.js";
import { User, UserRole } from "../../database/entities/user.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { TransactionUsecase } from "./transaction-usecase.js";
import { ListTransactionValidator } from "./transaction-validator.js";

const buildTransactionUsecase = () => {
  return new TransactionUsecase(AppDataSource.getRepository(Transaction));
};

export const ListTransactions = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const validation = ListTransactionValidator.validate(req.query);
  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const listTransactionRequest = validation.value;

  let size = 10;
  if (listTransactionRequest.size !== undefined) {
    size = listTransactionRequest.size;
  }

  let page = 1;
  if (listTransactionRequest.page !== undefined) {
    page = listTransactionRequest.page;
  }

  const isAdmin = req.user.role === UserRole.ADMIN;

  if (
    !isAdmin &&
    listTransactionRequest.userId !== undefined &&
    listTransactionRequest.userId !== req.user.userId
  ) {
    return res.status(403).send({ error: "Forbidden" });
  }

  const userId = isAdmin ? listTransactionRequest.userId : req.user.userId;

  const transactionUsecase = buildTransactionUsecase();
  const transactions = await transactionUsecase.listTransactions({
    page,
    size,
    userId,
    type: listTransactionRequest.type,
    from: listTransactionRequest.from,
    to: listTransactionRequest.to,
  });

  const sanitizedTransactions = transactions.data.map((transaction) => {
    if (!transaction.user) {
      return transaction;
    }

    const { password, ...sanitizedUser } = transaction.user as User;
    return { ...transaction, user: sanitizedUser };
  });

  const responseData = isAdmin
    ? sanitizedTransactions
    : sanitizedTransactions.map(({ user, ...rest }) => rest);

  return res.send(responseData);
};
