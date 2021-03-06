import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
    user_id: string;
    avatarFileName: string;
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFileName }: Request): Promise<User> {
        const updateUserAvatarRepository = getRepository(User);

        const user = await updateUserAvatarRepository.findOne(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar!',
                401,
            );
        } else if (user.avatar) {
            // Delete previous avatar
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            // stat funtion return a file status (if it exists)
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                // Delete avatar
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFileName;

        await updateUserAvatarRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
