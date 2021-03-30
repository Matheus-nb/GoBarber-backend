import { Router } from 'express';
import multer from 'multer';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import uploadConfig from '@config/upload';
import CreateUsersService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const usersRepository = new UsersRepository();

    const { name, email, password } = request.body;

    const createUser = new CreateUsersService(usersRepository);

    const user = await createUser.execute({
        name,
        email: email.toLowerCase(),
        password,
    });

    delete user.password;

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const usersRepository = new UsersRepository();

        const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        delete user.password;

        return response.json(user);
    },
);

export default usersRouter;
