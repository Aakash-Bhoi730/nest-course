import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AUthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) 
    private userRepository: UserRepository,
    private jwtService:JwtService
  ) {}

  
async signUp(authCredentialDto:AUthCredentialDto) :Promise<void>{
    return this.userRepository.createUser(authCredentialDto);
}

async signin(authCredentialDto:AUthCredentialDto): Promise <{accessToken:string}> {
  const {username,password} = authCredentialDto;
  const user = await this.userRepository.findOne({username});

  if(user && (await bcrypt.compare(password,user.password)))
  {
   const paylaod :JwtPayload = {username};
   const accessToken:string = await this.jwtService.sign(paylaod);
   return { accessToken };
  }
  else{
    throw new UnauthorizedException("please check your credentials")
  }
}

}
