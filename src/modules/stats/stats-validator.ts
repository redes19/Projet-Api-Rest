import Joi from "joi";
import { DailyAttendanceRequest, PeriodAttendanceRequest } from "./stats-request.js";

export const DailyAttendanceValidator = Joi.object<DailyAttendanceRequest>({
  date: Joi.date().iso().optional(),
  roomId: Joi.number().integer().positive().optional(),
}).options({ abortEarly: false });

export const PeriodAttendanceValidator = Joi.object<PeriodAttendanceRequest>({
  from: Joi.date().iso().required(),
  to: Joi.date().iso().greater(Joi.ref("from")).required(),
  roomId: Joi.number().integer().positive().optional(),
}).options({ abortEarly: false });
