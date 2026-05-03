import { Repository } from "typeorm";
import { Transaction, TransactionType } from "../../database/entities/transaction.js";
import { User } from "../../database/entities/user.js";

interface CreateTransactionData {
  user: User;
  type: TransactionType;
  amount: number;
  description?: string | null;
}

export interface ListResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListTransactionFilter {
  page: number;
  size: number;
  userId?: number | undefined;
  type?: TransactionType | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
}

export class TransactionUsecase {
  constructor(private transactionRepository: Repository<Transaction>) {}

  async createTransaction(transactionData: CreateTransactionData): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      user: transactionData.user,
      type: transactionData.type,
      amount: transactionData.amount,
      description: transactionData.description ?? null,
    });

    return this.transactionRepository.save(transaction);
  }

  async listTransactions({
    page,
    size,
    userId,
    type,
    from,
    to,
  }: ListTransactionFilter): Promise<ListResponse<Transaction>> {
    const query = this.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.user", "user")
      .orderBy("transaction.created_at", "DESC");

    if (userId !== undefined) {
      query.andWhere("user.id = :userId", { userId });
    }

    if (type !== undefined) {
      query.andWhere("transaction.type = :type", { type });
    }

    if (from !== undefined) {
      query.andWhere("transaction.created_at >= :from", { from });
    }

    if (to !== undefined) {
      query.andWhere("transaction.created_at <= :to", { to });
    }

    query.skip((page - 1) * size);
    query.take(size);

    const [transactions, totalCount] = await query.getManyAndCount();

    return {
      data: transactions,
      pageSize: size,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }
}
