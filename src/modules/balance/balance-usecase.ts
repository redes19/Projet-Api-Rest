import { Repository } from "typeorm";
import { Transaction, TransactionType } from "../../database/entities/transaction.js";
import { User } from "../../database/entities/user.js";
export class BalanceUsecase {
  constructor(
    private userRepository: Repository<User>,
    private transactionRepository: Repository<Transaction>
  ) {}

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return user.balance;
  }

  async depositBalance(userId: number, amount: number): Promise<number> {
    return this.transactionRepository.manager.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const transactionRepository = manager.getRepository(Transaction);

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found");
      }

      user.balance += amount;
      await userRepository.save(user);

      await transactionRepository.save(
        transactionRepository.create({
          user,
          type: TransactionType.DEPOSIT,
          amount,
          description: "Balance deposit",
        })
      );

      return user.balance;
    });
  }

  async withdrawBalance(userId: number, amount: number): Promise<number> {
    return this.transactionRepository.manager.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const transactionRepository = manager.getRepository(Transaction);

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found");
      }
      if (user.balance < amount) {
        throw new Error("Insufficient balance");
      }

      user.balance -= amount;
      await userRepository.save(user);

      await transactionRepository.save(
        transactionRepository.create({
          user,
          type: TransactionType.WITHDRAW,
          amount: -amount,
          description: "Balance withdraw",
        })
      );

      return user.balance;
    });
  }
}
