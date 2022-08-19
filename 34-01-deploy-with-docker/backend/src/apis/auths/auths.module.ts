import { Module } from '@nestjs/common';
import { AuthResolver as AuthResolver } from './auths.resolver';
import { AuthService as AuthsService } from './auths.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from '../../commons/auth/jwt-social-google.strategy';
import { AuthController as AuthsController } from './auths.controller';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User, //
    ]),
  ],
  // prodiver는 위치가 중요하지 않다.
  providers: [
    JwtAccessStrategy, //
    JwtGoogleStrategy,
    JwtRefreshStrategy,
    AuthResolver,
    AuthsService,
    UsersService,
  ],
  controllers: [AuthsController],
})
export class AuthsModule {}
