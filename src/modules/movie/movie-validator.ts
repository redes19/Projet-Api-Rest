import Joi from "joi";
import {
  CreateMovieRequest,
  ListMovieRequest,
  MovieIdRequest,
  UpdateMovieRequest,
} from "./movie-request.js";

export const MovieIdValidator = Joi.object<MovieIdRequest>({
  id: Joi.number().integer().positive().required(),
});

export const CreateMovieValidator = Joi.object<CreateMovieRequest>({
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(null).optional(),
  duration: Joi.number().integer().positive().required(),
  genre: Joi.string().max(100).allow(null).optional(),
  poster_url: Joi.string().uri().allow(null).optional(),
  release_date: Joi.date().allow(null).optional(),
}).messages({
  "string.max": "length must be less than or equal to {#limit} characters long",
  "string.uri": "must be a valid uri",
  "any.required": "is required",
  "number.min": "must be greater than or equal to {#limit}",
});

export const UpdateMovieValidator = Joi.object<UpdateMovieRequest>({
  id: Joi.number().integer().positive().required(),
  title: Joi.string().max(255).optional(),
  description: Joi.string().allow(null).optional(),
  duration: Joi.number().integer().positive().optional(),
  genre: Joi.string().max(100).allow(null).optional(),
  poster_url: Joi.string().uri().allow(null).optional(),
  release_date: Joi.date().allow(null).optional(),
}).messages({
  "string.max": "length must be less than or equal to {#limit} characters long",
  "string.uri": "must be a valid uri",
  "number.min": "must be greater than or equal to {#limit}",
});

export const ListMovieValidator = Joi.object<ListMovieRequest>({
  page: Joi.number().integer().positive().min(1).optional(),
  size: Joi.number().integer().positive().min(1).max(100).optional(),
  durationMax: Joi.number().integer().positive().optional(),
  genre: Joi.string().max(100).optional(),
})
  .messages({
    "number.base": "must be a number",
    "number.integer": "must be an integer",
    "number.min": "must be greater than or equal to {#limit}",
    "number.max": "must be less than or equal to {#limit}",
    "any.required": "is required",
  })
  .options({ abortEarly: false });
