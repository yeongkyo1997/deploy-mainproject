import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      // access 토큰의 비밀번호를 받는다.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
    });
  }

  // 실패했을 때 에러를 반환한다.

  // 성공했을 때 실행되는 메서드
  validate(payload) {
    // console.log(payload); // 암호화를 했던 이메일과 아이디가 나온다.

    // context.req.user에 저장된다.
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
