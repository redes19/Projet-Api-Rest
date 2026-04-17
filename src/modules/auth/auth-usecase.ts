import { Repository } from "typeorm";
import { User } from "../../database/entities/user.js";
import { Token } from "../../database/entities/token.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken"
import { LoginRequest, RegisterRequest } from "../user/user-request.js"
import { UserRole } from "../../database/entities/user.js"
import bcrypt from "bcrypt";

export class AuthUsecase {
    constructor(
        private userRepository: Repository<User>,
        private tokenRepository: Repository<Token>
    ) {}

    async login({email, password}: LoginRequest): Promise<Token | null> {
        const user = await this.userRepository.findOneBy({
            email
        })

        if(!user) return null;

        const isValid = await compare(password, user.password);
        if(!isValid) return null;

        const secret = process.env.JWT_Secret || "valuerandom"
        const jsonwebtoken = jwt.sign({userId: user.id, email: user.email}, secret, {expiresIn: '24h'})

        const token = this.tokenRepository.create({
            token: jsonwebtoken,
            user
        })

        return await this.tokenRepository.save(token);

    }

    async register({firstName, email, password, role = "client" as UserRole}: RegisterRequest) {
        const emailExisting = await this.userRepository.findOneBy({
            email
        });

        if(emailExisting) throw new Error("Mail already in use");

        const hashPassword = await bcrypt.hash(password, 12);

        const user = this.userRepository.create({first_name: firstName, email, password: hashPassword, role});
        await this.userRepository.save(user);

        //création et affiliation du token a l'user

        return;
    }


}