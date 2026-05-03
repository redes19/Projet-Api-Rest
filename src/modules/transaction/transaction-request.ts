import { TransactionType } from "../../database/entities/transaction.js";

export interface ListTransactionRequest {
  page?: number;
  size?: number;
  userId?: number;
  type?: TransactionType;
  from?: Date;
  to?: Date;
}
