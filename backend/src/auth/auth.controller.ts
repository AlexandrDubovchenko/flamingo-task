import { Controller, Get, Header, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.model';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Redirects to GitHub
  }

  @Get('github/callback')
  @Header('Content-Type', 'text/html')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: Request & { user: User }) {
    const user = await this.usersService.findOrCreate(req.user);
    const jwt = this.authService.login(user);
    return `
      <html>
        <body>
          <script>
            window.opener.postMessage({ token: '${jwt.access_token}' }, '*');
          </script>
        </body>
      </html>
    `;
  }
}
