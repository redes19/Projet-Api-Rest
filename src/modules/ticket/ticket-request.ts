import { Ticket, TicketType, TicketUsage } from "../../database/entities/ticket.js";

export interface TicketIdRequest {
  id: number;
}

export interface CreateTicketRequest {
  user_id: number;
  type: TicketType;
  remaining_uses?: number;
}

export interface UpdateTicketRequest {
  id: number;
  user_id?: number;
  type?: TicketType;
  remaining_uses?: number;
}

export interface ListTicketRequest {
  page?: number;
  size?: number;
  userId?: number;
  type?: TicketType;
  availableOnly?: boolean;
}

export interface UseTicketRequest {
  screening_id: number;
}

export interface BuyTicketRequest {
  type: TicketType;
}

export interface ListTicketUsageRequest {
  page?: number;
  size?: number;
}

export type UseTicketResult =
  | { ok: true; usage: TicketUsage }
  | {
      ok: false;
      reason: "NO_REMAINING_USES" | "ALREADY_USED_FOR_SCREENING" | "SCREENING_IN_MAINTENANCE";
    };

export type BuyTicketResult =
  | { ok: true; ticket: Ticket; balance: number }
  | { ok: false; reason: "USER_NOT_FOUND" | "INSUFFICIENT_BALANCE" };
