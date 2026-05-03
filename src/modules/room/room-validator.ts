import Joi from "joi";
import {
  CreateRoomRequest,
  ListRoomRequest,
  RoomIdRequest,
  UpdateRoomRequest,
  RoomScreeningsRequest,
} from "./room-request.js";

export const RoomIdValidator = Joi.object<RoomIdRequest>({
  id: Joi.number().integer().positive().required(),
});

export const CreateRoomValidator = Joi.object<CreateRoomRequest>({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow(null).optional(),
  image_url: Joi.string().uri().allow(null).optional(),
  type: Joi.string().valid("2D", "3D", "IMAX", "4DX", "VIP").required(),
  capacity: Joi.number().integer().min(15).max(30).required(),
  has_disabled_access: Joi.boolean().optional(),
  is_maintenance: Joi.boolean().optional(),
}).messages({
  "string.max": "length must be less than or equal to {#limit} characters long",
  "string.uri": "must be a valid uri",
  "any.required": "is required",
  "number.min": "must be greater than or equal to {#limit}",
  "number.max": "must be less than or equal to {#limit}",
});

export const UpdateRoomValidator = Joi.object<UpdateRoomRequest>({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().max(100).optional(),
  description: Joi.string().allow(null).optional(),
  image_url: Joi.string().uri().allow(null).optional(),
  type: Joi.string().valid("2D", "3D", "IMAX", "4DX", "VIP").optional(),
  capacity: Joi.number().integer().min(15).max(30).optional(),
  has_disabled_access: Joi.boolean().optional(),
  is_maintenance: Joi.boolean().optional(),
}).messages({
  "string.max": "length must be less than or equal to {#limit} characters long",
  "string.uri": "must be a valid uri",
  "number.min": "must be greater than or equal to {#limit}",
  "number.max": "must be less than or equal to {#limit}",
});

export const ListRoomValidator = Joi.object<ListRoomRequest>({
  page: Joi.number().integer().positive().min(1).optional(),
  size: Joi.number().integer().positive().min(1).max(100).optional(),
  capacityMax: Joi.number().integer().min(15).max(30).optional(),
  isMaintenance: Joi.boolean().optional(),
})
  .messages({
    "number.base": "must be a number",
    "number.integer": "must be an integer",
    "number.min": "must be greater than or equal to {#limit}",
    "number.max": "must be less than or equal to {#limit}",
    "any.required": "is required",
  })
  .options({ abortEarly: false });

export const RoomScreeningsValidator = Joi.object<RoomScreeningsRequest>({
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().greater(Joi.ref("from")).optional(),
}).options({ abortEarly: false });
