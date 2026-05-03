import { Request, Response } from "express";
import { AppDataSource } from "../../database/database.js";
import { Screening } from "../../database/entities/screening.js";
import { Ticket, TicketType, TicketUsage } from "../../database/entities/ticket.js";
import { User } from "../../database/entities/user.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { TicketUsecase } from "./ticket-usecase.js";
import {
  CreateTicketValidator,
  ListTicketUsageValidator,
  ListTicketValidator,
  TicketIdValidator,
  UpdateTicketValidator,
  UseTicketValidator,
} from "./ticket-validator.js";

const buildTicketUsecase = () => {
  return new TicketUsecase(
    AppDataSource.getRepository(Ticket),
    AppDataSource.getRepository(TicketUsage),
    AppDataSource.getRepository(User),
    AppDataSource.getRepository(Screening)
  );
};

export const CreateTicket = async (req: Request, res: Response) => {
  const validation = CreateTicketValidator.validate(req.body);

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const ticketUsecase = buildTicketUsecase();
  const user = await ticketUsecase.getUser(validation.value.user_id);

  if (!user) {
    return res.status(404).send({
      error: "user not found",
    });
  }

  try {
    const ticket = await ticketUsecase.createTicket({
      user,
      type: validation.value.type as TicketType,
      remaining_uses: validation.value.remaining_uses,
    });

    return res.status(201).send(ticket);
  } catch {
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const GetTicket = async (req: Request, res: Response) => {
  const validation = TicketIdValidator.validate(req.params);

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const ticketUsecase = buildTicketUsecase();
  const ticket = await ticketUsecase.getTicket(validation.value.id);

  if (ticket === null) {
    return res.status(404).send({
      error: "ticket not found",
    });
  }

  return res.send(ticket);
};

export const UpdateTicket = async (req: Request, res: Response) => {
  const validation = UpdateTicketValidator.validate({
    id: req.params.id,
    ...req.body,
  });

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const ticketUsecase = buildTicketUsecase();
  const existingTicket = await ticketUsecase.getTicket(validation.value.id);

  if (!existingTicket) {
    return res.status(404).send({
      error: "ticket not found",
    });
  }

  let user;
  if (validation.value.user_id !== undefined) {
    user = await ticketUsecase.getUser(validation.value.user_id);
    if (!user) {
      return res.status(404).send({
        error: "user not found",
      });
    }
  }

  try {
    const updatedTicket = await ticketUsecase.updateTicket({
      id: validation.value.id,
      user,
      type: validation.value.type as TicketType | undefined,
      remaining_uses: validation.value.remaining_uses,
    });

    return res.send(updatedTicket);
  } catch {
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

export const DeleteTicket = async (req: Request, res: Response) => {
  const validation = TicketIdValidator.validate(req.params);

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const ticketUsecase = buildTicketUsecase();
  const ticket = await ticketUsecase.getTicket(validation.value.id);

  if (!ticket) {
    return res.status(404).send({
      error: "ticket not found",
    });
  }

  await ticketUsecase.deleteTicket(validation.value.id);
  return res.status(204).send();
};

export const ListTickets = async (req: Request, res: Response) => {
  const validation = ListTicketValidator.validate(req.query);

  if (validation.error) {
    return res.status(400).send(generateValidationErrorMessage(validation.error.details));
  }

  const listTicketRequest = validation.value;

  let size = 10;
  if (listTicketRequest.size !== undefined) {
    size = listTicketRequest.size;
  }

  let page = 1;
  if (listTicketRequest.page !== undefined) {
    page = listTicketRequest.page;
  }

  const ticketUsecase = buildTicketUsecase();
  const tickets = await ticketUsecase.listTickets({
    page,
    size,
    userId: listTicketRequest.userId,
    type: listTicketRequest.type as TicketType | undefined,
    availableOnly: listTicketRequest.availableOnly,
  });

  return res.send(tickets.data);
};

export const UseTicket = async (req: Request, res: Response) => {
  const ticketIdValidation = TicketIdValidator.validate(req.params);

  if (ticketIdValidation.error) {
    return res.status(400).send(generateValidationErrorMessage(ticketIdValidation.error.details));
  }

  const bodyValidation = UseTicketValidator.validate(req.body);

  if (bodyValidation.error) {
    return res.status(400).send(generateValidationErrorMessage(bodyValidation.error.details));
  }

  const ticketUsecase = buildTicketUsecase();
  const ticket = await ticketUsecase.getTicket(ticketIdValidation.value.id);

  if (!ticket) {
    return res.status(404).send({
      error: "ticket not found",
    });
  }

  const screening = await ticketUsecase.getScreening(bodyValidation.value.screening_id);

  if (!screening) {
    return res.status(404).send({
      error: "screening not found",
    });
  }

  const result = await ticketUsecase.useTicket({
    ticket,
    screening,
  });

  if (!result.ok) {
    if (result.reason === "NO_REMAINING_USES") {
      return res.status(400).send({
        error: "ticket has no remaining uses",
      });
    }

    if (result.reason === "SCREENING_IN_MAINTENANCE") {
      return res.status(400).send({
        error: "cannot use ticket for a screening in maintenance room",
      });
    }

    return res.status(409).send({
      error: "ticket already used for this screening",
    });
  }

  return res.status(201).send(result.usage);
};

export const ListTicketUsages = async (req: Request, res: Response) => {
  const ticketIdValidation = TicketIdValidator.validate(req.params);

  if (ticketIdValidation.error) {
    return res.status(400).send(generateValidationErrorMessage(ticketIdValidation.error.details));
  }

  const queryValidation = ListTicketUsageValidator.validate(req.query);

  if (queryValidation.error) {
    return res.status(400).send(generateValidationErrorMessage(queryValidation.error.details));
  }

  const ticketUsecase = buildTicketUsecase();
  const ticket = await ticketUsecase.getTicket(ticketIdValidation.value.id);

  if (!ticket) {
    return res.status(404).send({
      error: "ticket not found",
    });
  }

  let size = 10;
  if (queryValidation.value.size !== undefined) {
    size = queryValidation.value.size;
  }

  let page = 1;
  if (queryValidation.value.page !== undefined) {
    page = queryValidation.value.page;
  }

  const usages = await ticketUsecase.listTicketUsages({
    ticketId: ticketIdValidation.value.id,
    page,
    size,
  });

  return res.send(usages.data);
};
