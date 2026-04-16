import { Request, Response } from "express"
import { LoginValidator } from "../user/user-validator"
import { generateValidationErrorMessage } from "../../utils/validators"
import { AuthUsecase } from "./auth-usecase"
import { AppDataSource } from "../../database/database"
import { User } from "../../database/entities/user"
import { Token } from "../../database/entities/token"

export const Login = async (req: Request, res: Response) => {
    console.log(req.body)
}