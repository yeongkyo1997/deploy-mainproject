import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { AuthService } from './auths.service';
import * as bcrypt from 'bcrypt';
import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { GqlAuthRefreshGuard } from '../../commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authsService: AuthService, //
    private readonly usersService: UsersService, //
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    // 1. 로그인(이메일이 일치하는 사용자를 찾는다)
    const user = await this.usersService.findOne({ email });

    // 2. 일치하는 유저가 업으면!? 에러 발생
    if (!user) {
      throw new UnprocessableEntityException('존재하지 않는 이메일입니다.');
    }

    // 3. 일치하는 유저가 있지만, 비밀번호가 일치하지 않으면!? 에러 발생
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    }

    // 4. refreshToken(=JWT)을 만들어서 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    this.authsService.setRefreshToken({ user, res: context.res });

    // 5. 일치하는 유저가 있고, 비밀번호가 일치하면?!
    // => accessToken(= JWT)를 만들어서 브라우저에 전달한다.
    return this.authsService.getAccessToken({ user });
  }

  // RefreshGuard 만들고 등록하기
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authsService.getAccessToken({ user: context.req.user });
  }
}
