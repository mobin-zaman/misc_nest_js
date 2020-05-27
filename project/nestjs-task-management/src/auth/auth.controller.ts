import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')

export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authcredentialsDto: AuthCredentialsDto):Promise<void>{
        return this.authService.signUp(authcredentialsDto);
    }

    @Post('/signin')
    singIn(@Body(ValidationPipe) authcredentialsDto: AuthCredentialsDto):Promise<{accessToken:string}> {
        return this.authService.signIn(authcredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@Req() req) {
        console.log(req);
    }
}