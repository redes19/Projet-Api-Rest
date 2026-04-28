import { TicketType } from "../../database/entities/ticket.js";

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

export interface ListTicketUsageRequest {
  page?: number;
  size?: number;
}
