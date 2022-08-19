import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '25836107539-15gencj0v7q99ocsm7mpbolgts3amq1m.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['email', 'profile'],
    });
  }

  // 실패했을 때 에러를 반환한다.

  // 성공했을 때 실행되는 메서드
  validate(accessToken, refreshToken, profile) {
    // context.req.user에 저장된다.
    console.log(accessToken);
    console.log(refreshToken);
    console.log('//////////////////////////');
    console.log('profile', profile);

    return {
      email: profile.emails[0].value,
      hashedPassword: '1234',
      name: profile.displayName,
      age: 123,
    };
  }
}
