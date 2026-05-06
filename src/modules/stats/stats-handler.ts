import { Request, Response } from "express";
import { AppDataSource } from "../../database/database.js";
import { Screening } from "../../database/entities/screening.js";
import { TicketUsage } from "../../database/entities/ticket.js";
import { generateValidationErrorMessage } from "../../utils/validators.js";
import { StatsUsecase } from "./stats-usecase.js";
import {
  DailyAttendanceValidator,
  PeriodAttendanceValidator,
} from "./stats-validator.js";

const buildStatsUsecase = () =>
  new StatsUsecase(
    AppDataSource.getRepository(Screening),
    AppDataSource.getRepository(TicketUsage)
  );

export const GetDailyAttendance = async (req: Request, res: Response) => {
  const validation = DailyAttendanceValidator.validate(req.query);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const date = validation.value.date ?? new Date();
  const roomId = validation.value.roomId;

  try {
    const result = await buildStatsUsecase().getDailyAttendance(date, roomId);
    return res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export const GetPeriodAttendance = async (req: Request, res: Response) => {
  const validation = PeriodAttendanceValidator.validate(req.query);
  if (validation.error) {
    return res
      .status(400)
      .send(generateValidationErrorMessage(validation.error.details));
  }

  const { from, to, roomId } = validation.value;

  try {
    const result = await buildStatsUsecase().getPeriodAttendance(from, to, roomId);
    return res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
