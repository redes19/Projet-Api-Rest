import Joi from "joi";
import { ListTransactionRequest } from "./transaction-request.js";

export const ListTransactionValidator = Joi.object<ListTransactionRequest>({
  page: Joi.number().integer().positive().min(1).optional(),
  size: Joi.number().integer().positive().min(1).max(100).optional(),
  userId: Joi.number().integer().positive().optional(),
  type: Joi.string().valid("deposit", "withdraw", "ticket_purchase").optional(),
  from: Joi.date().optional(),
  to: Joi.when("from", {
    is: Joi.exist(),
    then: Joi.date().min(Joi.ref("from")),
    otherwise: Joi.date(),
  }).optional(),
})
  .messages({
    "number.base": "must be a number",
    "number.integer": "must be an integer",
    "number.min": "must be greater than or equal to {#limit}",
    "number.max": "must be less than or equal to {#limit}",
    "date.base": "must be a valid date",
    "date.min": "must be greater than or equal to {#limit}",
    "any.required": "is required",
  })
  .options({ abortEarly: false });
