import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from '../../commons/auth/gql-auth.guard';
import { User } from './entities/user.entity';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // 검증하는 메서드

  // @UseGuards(AuthGuard('access')) // restAPI에서 사용하는 메서드
  @UseGuards(GqlAuthAccessGuard) // graphql에서 사용하는 메서드
  @Query(() => String)
  fetchUser(
    @Context() context: any, //
  ) {
    console.log(context);
    console.log('fetchUser 실행 완료!!');
    return 'fetchUser가 실행되었습니다.';
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string, //
    @Args('password') password: string, //
    @Args('name') name: string, //
    @Args({ name: 'age', type: () => Int }) age: number, //
  ) {
    const hashedPassword = await bcrypt.hash(password, 10.2);
    return this.usersService.create({ email, hashedPassword, name, age });
  }
}
