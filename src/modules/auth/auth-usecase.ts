import { Repository } from "typeorm";
import { User } from "../../database/entities/user.js";
import { Token } from "../../database/entities/token.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken"

export class AuthUsecase {
    constructor(
        private userRepository: Repository<User>,
        private tokenRepository: Repository<Token>
    ) {}

    async login({email, password}: {email : string, password : string}): Promise<Token | null> {
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


}