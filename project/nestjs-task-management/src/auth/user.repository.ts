import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto} from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username, password} = authcredentialsDto;

        const salt = await bcrypt.genSalt();



        const user = new User();
        user.username = username;
        user.salt = salt;
        user.password = await this.hashPassword(password, salt);

        try{
        await user.save();
        } catch(error) {
            if(error.code === '23505') { //duplicate usename
                throw new ConflictException("username already exists");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authcredentialsDto: AuthCredentialsDto): Promise<string>{
        const {username, password} = authcredentialsDto;
        const user = await this.findOne({username});
        
        if(user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
        
        
    }

    private async hashPassword(password: string, salt: string) : Promise<string> {
        return bcrypt.hash(password, salt);
    }
}