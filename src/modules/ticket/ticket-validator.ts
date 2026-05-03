import Joi from "joi";
import {
  BuyTicketRequest,
  CreateTicketRequest,
  ListTicketRequest,
  ListTicketUsageRequest,
  TicketIdRequest,
  UpdateTicketRequest,
  UseTicketRequest,
} from "./ticket-request.js";

export const TicketIdValidator = Joi.object<TicketIdRequest>({
  id: Joi.number().integer().positive().required(),
});

export const CreateTicketValidator = Joi.object<CreateTicketRequest>({
  user_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid("normal", "super").required(),
  remaining_uses: Joi.number().integer().min(0).optional(),
}).messages({
  "any.required": "is required",
  "number.base": "must be a number",
  "number.integer": "must be an integer",
  "number.min": "must be greater than or equal to {#limit}",
});

export const UpdateTicketValidator = Joi.object<UpdateTicketRequest>({
  id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().optional(),
  type: Joi.string().valid("normal", "super").optional(),
  remaining_uses: Joi.number().integer().min(0).optional(),
}).messages({
  "number.base": "must be a number",
  "number.integer": "must be an integer",
  "number.min": "must be greater than or equal to {#limit}",
});

export const ListTicketValidator = Joi.object<ListTicketRequest>({
  page: Joi.number().integer().positive().min(1).optional(),
  size: Joi.number().integer().positive().min(1).max(100).optional(),
  userId: Joi.number().integer().positive().optional(),
  type: Joi.string().valid("normal", "super").optional(),
  availableOnly: Joi.boolean().optional(),
})
  .messages({
    "number.base": "must be a number",
    "number.integer": "must be an integer",
    "number.min": "must be greater than or equal to {#limit}",
    "number.max": "must be less than or equal to {#limit}",
    "any.required": "is required",
  })
  .options({ abortEarly: false });

export const UseTicketValidator = Joi.object<UseTicketRequest>({
  screening_id: Joi.number().integer().positive().required(),
}).messages({
  "any.required": "is required",
  "number.base": "must be a number",
  "number.integer": "must be an integer",
  "number.min": "must be greater than or equal to {#limit}",
});

export const ListTicketUsageValidator = Joi.object<ListTicketUsageRequest>({
  page: Joi.number().integer().positive().min(1).optional(),
  size: Joi.number().integer().positive().min(1).max(100).optional(),
})
  .messages({
    "number.base": "must be a number",
    "number.integer": "must be an integer",
    "number.min": "must be greater than or equal to {#limit}",
    "number.max": "must be less than or equal to {#limit}",
  })
  .options({ abortEarly: false });

export const BuyTicketValidator = Joi.object<BuyTicketRequest>({
  type: Joi.string().valid("normal", "super").required(),
}).messages({
  "any.required": "is required",
  "string.base": "must be a string",
});
