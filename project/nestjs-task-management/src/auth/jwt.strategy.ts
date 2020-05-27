import {PassportStrategy } from '@nestjs/passport';

import {Strategy, ExtractJwt} from 'passport-jwt';

import {JwtPayLoad} from './jtw-paload.interface';

import {UserRepository} from './user.repository';

import { InjectRepository } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
 './usre.repository';

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( 
        @InjectRepository(UserRepository) private userRepository: UserRepository
        )
   {     
       super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topsecret101',
        })
    }

    async validate(payload: JwtPayLoad) {
        const {username} = payload; 

        const user = await this.userRepository.findOne({username});

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}