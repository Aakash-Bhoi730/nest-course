import { Body, Controller, Post } from '@nestjs/common';
import { AUthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post('/signup')
    signUp(@Body() authCredentialDto:AUthCredentialDto) : Promise<void>{
        return this.authService.signUp(authCredentialDto)
    }
    @Post('/signIn')
    signIn(@Body() authCredentialDto:AUthCredentialDto) :Promise<{accessToken:string}>{
        return this.authService.signin(authCredentialDto)
    }

}
