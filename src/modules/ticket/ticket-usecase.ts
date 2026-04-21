import { Repository } from "typeorm";
import { Screening } from "../../database/entities/screening.js";
import {
  Ticket,
  TicketType,
  TicketUsage,
} from "../../database/entities/ticket.js";
import { User } from "../../database/entities/user.js";

interface CreateTicketData {
  user: User;
  type: TicketType;
  remaining_uses?: number | undefined;
}

interface UpdateTicketData {
  id: number;
  user?: User | undefined;
  type?: TicketType | undefined;
  remaining_uses?: number | undefined;
}

interface UseTicketData {
  ticket: Ticket;
  screening: Screening;
}

export interface ListResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ListTicketFilter {
  page: number;
  size: number;
  userId?: number | undefined;
  type?: TicketType | undefined;
  availableOnly?: boolean | undefined;
}

export interface ListTicketUsageFilter {
  ticketId: number;
  page: number;
  size: number;
}

export type UseTicketResult =
  | { ok: true; usage: TicketUsage }
  | {
      ok: false;
      reason:
        | "NO_REMAINING_USES"
        | "ALREADY_USED_FOR_SCREENING"
        | "SCREENING_IN_MAINTENANCE";
    };

export class TicketUsecase {
  constructor(
    private ticketRepository: Repository<Ticket>,
    private ticketUsageRepository: Repository<TicketUsage>,
    private userRepository: Repository<User>,
    private screeningRepository: Repository<Screening>
  ) {}

  async getUser(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async getScreening(id: number) {
    return this.screeningRepository.findOne({
      where: { id },
      relations: { room: true, movie: true },
    });
  }

  async createTicket(ticketData: CreateTicketData) {
    const defaultRemainingUses = ticketData.type === TicketType.SUPER ? 10 : 1;

    const ticket = this.ticketRepository.create({
      user: ticketData.user,
      type: ticketData.type,
      remaining_uses: ticketData.remaining_uses ?? defaultRemainingUses,
    });

    const savedTicket = await this.ticketRepository.save(ticket);
    return this.getTicket(savedTicket.id);
  }

  async getTicket(id: number) {
    return this.ticketRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async deleteTicket(id: number) {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) {
      return null;
    }

    await this.ticketRepository.remove(ticket);
  }

  async updateTicket(ticketData: UpdateTicketData): Promise<Ticket | null> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketData.id },
      relations: { user: true },
    });

    if (!ticket) {
      return null;
    }

    if (ticketData.user !== undefined) {
      ticket.user = ticketData.user;
    }

    if (ticketData.type !== undefined) {
      ticket.type = ticketData.type;
    }

    if (ticketData.remaining_uses !== undefined) {
      ticket.remaining_uses = ticketData.remaining_uses;
    }

    const updatedTicket = await this.ticketRepository.save(ticket);
    return this.getTicket(updatedTicket.id);
  }

  async listTickets({
    page,
    size,
    userId,
    type,
    availableOnly,
  }: ListTicketFilter): Promise<ListResponse<Ticket>> {
    const query = this.ticketRepository
      .createQueryBuilder("ticket")
      .leftJoinAndSelect("ticket.user", "user")
      .orderBy("ticket.purchased_at", "DESC");

    if (userId !== undefined) {
      query.andWhere("user.id = :userId", { userId });
    }

    if (type !== undefined) {
      query.andWhere("ticket.type = :type", { type });
    }

    if (availableOnly === true) {
      query.andWhere("ticket.remaining_uses > 0");
    }

    query.skip((page - 1) * size);
    query.take(size);

    const [tickets, totalCount] = await query.getManyAndCount();

    return {
      data: tickets,
      pageSize: size,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }

  async listTicketUsages({
    ticketId,
    page,
    size,
  }: ListTicketUsageFilter): Promise<ListResponse<TicketUsage>> {
    const query = this.ticketUsageRepository
      .createQueryBuilder("usage")
      .leftJoinAndSelect("usage.ticket", "ticket")
      .leftJoinAndSelect("usage.screening", "screening")
      .leftJoinAndSelect("screening.movie", "movie")
      .leftJoinAndSelect("screening.room", "room")
      .where("ticket.id = :ticketId", { ticketId })
      .orderBy("usage.used_at", "DESC");

    query.skip((page - 1) * size);
    query.take(size);

    const [usages, totalCount] = await query.getManyAndCount();

    return {
      data: usages,
      pageSize: size,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
    };
  }

  async useTicket({
    ticket,
    screening,
  }: UseTicketData): Promise<UseTicketResult> {
    if (ticket.remaining_uses <= 0) {
      return {
        ok: false,
        reason: "NO_REMAINING_USES",
      };
    }

    if (screening.room.is_maintenance) {
      return {
        ok: false,
        reason: "SCREENING_IN_MAINTENANCE",
      };
    }

    const existingUsage = await this.ticketUsageRepository
      .createQueryBuilder("usage")
      .leftJoin("usage.ticket", "ticket")
      .leftJoin("usage.screening", "screening")
      .where("ticket.id = :ticketId", { ticketId: ticket.id })
      .andWhere("screening.id = :screeningId", { screeningId: screening.id })
      .getOne();

    if (existingUsage) {
      return {
        ok: false,
        reason: "ALREADY_USED_FOR_SCREENING",
      };
    }

    const usage = await this.ticketRepository.manager.transaction(
      async (manager) => {
        ticket.remaining_uses -= 1;
        await manager.getRepository(Ticket).save(ticket);

        const createdUsage = manager.getRepository(TicketUsage).create({
          ticket,
          screening,
        });

        return manager.getRepository(TicketUsage).save(createdUsage);
      }
    );

    return {
      ok: true,
      usage,
    };
  }
}
