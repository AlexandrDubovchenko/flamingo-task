import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.model';
import { JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User) {
    if (!user.id) {
      throw new Error('User not found');
    }
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name ?? '',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
