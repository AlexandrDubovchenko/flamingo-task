import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { GithubProfile } from 'src/common/OAuth.types';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.model';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.getOrThrow('AUTH0_CLIENT_ID'),
      clientSecret: configService.getOrThrow('AUTH0_CLIENT_SECRET'),
      scope: ['user:email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: GithubProfile,
    done: (err: Error | null, payload: User) => void,
  ): void {
    done(null, new User(null, profile.id, profile.username));
  }
}
