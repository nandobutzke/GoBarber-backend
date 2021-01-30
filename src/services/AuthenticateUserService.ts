import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/auth';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        const sessionsRepository = getRepository(User);

        const user = await sessionsRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new Error('Has no user in session');
        }

        const checkPassword = await compare(password, user.password);

        if (!checkPassword) {
            throw new Error('The password is invalid');
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = await sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
