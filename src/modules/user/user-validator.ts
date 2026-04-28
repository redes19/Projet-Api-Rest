import Joi from "joi";
import {
  CreateUserRequest,
  UserIdRequest,
  UpdateUserRequest,
  ListUserRequest,
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
} from "./user-request.js";

export const UserIdValidator = Joi.object<UserIdRequest>({
  id: Joi.number().integer().positive().required(),
});

export const CreateUserValidator = Joi.object<CreateUserRequest>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("client", "employee", "admin").required(),
  balance: Joi.number().precision(2).min(0).required(),
  first_name: Joi.string().max(100).allow(null),
  last_name: Joi.string().max(100).allow(null),
}).messages({
  "string.email": "must be a valid email",
  "string.min": "length must be at least {#limit} characters long",
  "string.max": "length must be less than or equal to {#limit} characters long",
  "any.required": "is required",
  "number.min": "must be greater than or equal to {#limit}",
});

export const UpdateUserValidator = Joi.object<UpdateUserRequest>({
  id: Joi.number().integer().positive().min(1).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid("client", "employee", "admin").optional(),
  balance: Joi.number().precision(2).min(0).optional(),
  first_name: Joi.string().max(100).allow(null),
  last_name: Joi.string().max(100).allow(null),
}).messages({
  "string.email": "must be a valid email",
  "string.min": "length must be at least {#limit} characters long",
  "string.max": "length must be less than or equal to {#limit} characters long",
  "number.min": "must be greater than or equal to {#limit}",
});

export const ListUserValidator = Joi.object<ListUserRequest>({
  page: Joi.number().integer().positive().min(1).optional(),
  size: Joi.number().integer().positive().min(1).max(100).optional(),
  balanceMax: Joi.number().precision(2).min(0).optional(),
})
  .messages({
    "number.base": "must be a number",
    "number.integer": "must be an integer",
    "number.min": "must be greater than or equal to {#limit}",
    "number.max": "must be less than or equal to {#limit}",
    "any.required": "is required",
  })
  .options({ abortEarly: false });

export const LoginValidator = Joi.object<LoginRequest>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).options({ abortEarly: false });

export const RegisterValidator = Joi.object<RegisterRequest>({
  firstName: Joi.string().max(100).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).options({ abortEarly: false });

export const RefreshValidator = Joi.object<RefreshRequest>({
  refreshToken: Joi.string().required(),
}).options({ abortEarly: false });
