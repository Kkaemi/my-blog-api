import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import axios from '@nestjs/common/node_modules/axios';
import { stringify } from 'qs';

interface IGoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithGoogle(code: string): Promise<string> {
    // accessToken 요청
    const accessToken: string = await axios
      .post(
        'https://www.googleapis.com/oauth2/v4/token',
        stringify({
          code: code,
          redirect_uri: process.env.GOOGLE_OAUTH2_REDIRECT_URI,
          client_id: process.env.GOOGLE_OAUTH2_CLIENT_ID,
          client_secret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
          grant_type: 'authorization_code',
        }),
      )
      .then(({ data }) => <string>data.access_token);

    // 프로필 정보 요청
    const { email, name } = await axios
      .get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(({ data }) => <IGoogleProfile>data);

    // 유저 create or update
    const user = await this.usersService.createOrUpdate({ email, name });

    // jwt create
    const payload = { email, name, sub: user.userId };

    // return jwt
    return await this.jwtService.signAsync(payload);
  }
}
