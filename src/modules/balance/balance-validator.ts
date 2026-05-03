import Joi from "joi";

export const BalanceIdValidator = Joi.object<{ id: number }>({
  id: Joi.number().integer().positive().required(),
});

export const DepositBalanceValidator = Joi.object<{ amount: number }>({
  amount: Joi.number().positive().required(),
});
