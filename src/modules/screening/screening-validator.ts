import Joi from "joi";
import {
  CreateScreeningRequest,
  ListScreeningRequest,
  ScreeningIdRequest,
  UpdateScreeningRequest,
} from "./screening-request.js";

export const ScreeningIdValidator = Joi.object<ScreeningIdRequest>({
  id: Joi.number().integer().positive().required(),
});

export const CreateScreeningValidator = Joi.object<CreateScreeningRequest>({
  movie_id: Joi.number().integer().positive().required(),
  room_id: Joi.number().integer().positive().required(),
  start_time: Joi.date().required(),
}).messages({
  "any.required": "is required",
  "number.base": "must be a number",
  "number.integer": "must be an integer",
  "number.min": "must be greater than or equal to {#limit}",
  "date.base": "must be a valid date",
});

export const UpdateScreeningValidator = Joi.object<UpdateScreeningRequest>({
  id: Joi.number().integer().positive().required(),
  movie_id: Joi.number().integer().positive().optional(),
  room_id: Joi.number().integer().positive().optional(),
  start_time: Joi.date().optional(),
  end_time: Joi.when("start_time", {
    is: Joi.exist(),
    then: Joi.date().greater(Joi.ref("start_time")),
    otherwise: Joi.date(),
  }).optional(),
}).messages({
  "number.base": "must be a number",
  "number.integer": "must be an integer",
  "number.min": "must be greater than or equal to {#limit}",
  "date.base": "must be a valid date",
  "date.greater": "must be greater than ref:start_time",
});

export const ListScreeningValidator = Joi.object<ListScreeningRequest>({
  page: Joi.number().integer().positive().min(1).optional(),
  size: Joi.number().integer().positive().min(1).max(100).optional(),
  movieId: Joi.number().integer().positive().optional(),
  roomId: Joi.number().integer().positive().optional(),
  from: Joi.date().optional(),
  to: Joi.date().optional(),
})
  .messages({
    "number.base": "must be a number",
    "number.integer": "must be an integer",
    "number.min": "must be greater than or equal to {#limit}",
    "number.max": "must be less than or equal to {#limit}",
    "date.base": "must be a valid date",
    "any.required": "is required",
  })
  .options({ abortEarly: false });
