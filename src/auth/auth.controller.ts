import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async loginWithGoogle(@Query('code') code: string): Promise<string> {
    return await this.authService.loginWithGoogle(code);
  }
}
