import { QueryFailedError, Repository } from "typeorm";
import { User, UserRole } from "../../database/entities/user.js";
import { ResourceConflictError } from "../../utils/errors.js";

interface CreateUserData {
  email: string;
  password: string;
  role: UserRole;
  balance: number;
  first_name?: string | null;
  last_name?: string | null;
}

interface UpdateUserData {
  id: number;
  email?: string;
  password?: string;
  role?: UserRole;
  balance?: number;
  first_name?: string | null;
  last_name?: string | null;
}

export interface ListResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListUserFilter {
  page: number;
  size: number;
  balanceMax?: number | undefined;
}
export class UserUsecase {
  constructor(private userRepository: Repository<User>) {}

  async createUser(userData: CreateUserData) {
    // TODO: Hash password
    try {
      const user = this.userRepository.create({
        email: userData.email,
        password: userData.password,
        role: userData.role,
        balance: userData.balance,
        first_name: userData.first_name || null,
        last_name: userData.last_name || null,
      });
      return this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const code = (error as any).code;

        if (code === "23505") {
          throw new ResourceConflictError("email is already taken");
        }
      }
      throw error;
    }
  }

  async getUser(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async deleteUser(id: number) {
    const user = await this.getUser(id);
    if (!user) {
      return null;
    }
    await this.userRepository.softRemove(user);
  }

  async updateUser(userData: UpdateUserData): Promise<User | null> {
    const user = await this.getUser(userData.id);
    if (!user) {
      return null;
    }
    try {
      // TODO: Hash password si mis à jour
      this.userRepository.merge(user, userData);

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const code = (error as any).code;

        if (code === "23505") {
          throw new ResourceConflictError("email is already taken");
        }
      }
      throw error;
    }
  }

  async listUsers({
    page,
    size,
    balanceMax,
  }: ListUserFilter): Promise<ListResponse<User>> {
    const query = this.userRepository.createQueryBuilder("user");
    if (balanceMax !== undefined) {
      query.andWhere("user.balance <= :balanceMax", { balanceMax });
    }
    query.skip((page - 1) * size);
    query.take(size);

    const [users, totalCount] = await query.getManyAndCount();
    return {
      data: users,
      pageSize: size,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }
}
