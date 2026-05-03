import Joi from "joi";
import { LoginRequest, RefreshRequest, RegisterRequest } from "../user/user-request.js";

export const LoginValidator = Joi.object<LoginRequest>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

export const RegisterValidator = Joi.object<RegisterRequest>({
  firstName: Joi.string().max(100).optional(),
  lastName: Joi.string().max(100).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false });

export const RefreshValidator = Joi.object<RefreshRequest>({
  refreshToken: Joi.string().required(),
}).options({ abortEarly: false });
