import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // refreshToken(=JWT)을 만들기
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );

    // 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);

    // 배포환경 (팀프로젝트)
    // res.setHeader(
    //   'Set-Cookie',
    //   `refreshToken=${refreshToken}; path=/; domain=.mybackendsite.com; SameSite=Node; Secure; HttpOnly;`,
    // );
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
  }

  // JWT토큰을 만들어서 반환한다.
  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myAccessKey', expiresIn: '1h' },
    );
  }
}
