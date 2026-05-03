import { Repository } from "typeorm";
import { User } from "../../database/entities/user.js";
export class BalanceUsecase {
  constructor(private userRepository: Repository<User>) {}

  async getBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return user.balance;
  }

  async depositBalance(userId: number, amount: number): Promise<number> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    user.balance += amount;
    await this.userRepository.save(user);
    return user.balance;
  }

  async withdrawBalance(userId: number, amount: number): Promise<number> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.balance < amount) {
      throw new Error("Insufficient balance");
    } else {
      user.balance -= amount;
      await this.userRepository.save(user);
      return user.balance;
    }
  }
}
