import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './jtw-paload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService) {}

        async signUp(authcredentialsDto :AuthCredentialsDto ): Promise<void>{
            return await this.userRepository.signUp(authcredentialsDto);
       }

       async signIn(authcredentialsDto: AuthCredentialsDto): Promise<{accessToken:string}> {
           const username  =await  this.userRepository.validateUserPassword(authcredentialsDto);

           if(!username) {
               throw new UnauthorizedException('Invalid Credentials');
           }

           const payload:JwtPayLoad = {username};
           const accessToken = await this.jwtService.sign(payload);

           return {accessToken};
       }
}
