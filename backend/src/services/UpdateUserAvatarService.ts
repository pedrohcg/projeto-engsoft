import path from 'path'
import AppError from '../errors/AppError'
import IUsersRepository from '../repositories/IUserRepository';
import IFilesRepository from 'repositories/IFilesRepository';

interface IRequest{
    user_id: string;
    avatarFilename?: string;
}

export default class UpdateUserAvatarService{
    private usersRepository: IUsersRepository;
    private filesRepository: IFilesRepository;

    constructor(usersRepository: IUsersRepository, filesRepository: IFilesRepository){
        this.usersRepository = usersRepository;
        this.filesRepository = filesRepository;
    }

    public async execute({user_id, avatarFilename}: IRequest) {
        if(avatarFilename){
            const user = await this.usersRepository.findById(user_id);

            if(!user){
                throw new AppError('Usuário não autenticado', 401);
            }
           
            if(user.avatar !== path.resolve(__dirname, '..','tmp', 'default.png')){
                await this.filesRepository.delete(user.avatar);
            }
            
            const fileName = await this.filesRepository.save(avatarFilename);

            user.avatar = fileName;
    
            await this.usersRepository.update(user_id, user);

            return {message: 'Avatar alterado com sucesso'};
        }

        throw new AppError('Arquivo não encontrado', 404);
    }
}

