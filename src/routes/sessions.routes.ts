import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    try {
        const { email, password } = request.body;

        const authenticateService = new AuthenticateUserService();

        const { user, token } = await authenticateService.execute({
            email,
            password,
        });

        delete user.password;

        return response.status(200).json({ user, token });
    } catch (error) {
        return response.status(400).json(error.message);
    }
});

export default sessionsRouter;
