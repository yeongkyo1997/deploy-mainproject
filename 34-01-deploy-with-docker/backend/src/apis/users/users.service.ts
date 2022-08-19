import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    // userRepository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ email }) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create({ email, hashedPassword: password, name, age }) {
    // 같은 email이 있는지 확인
    const user = await this.userRepository.findOne({ where: { email } });

    // 이메일이 있다면 예외를 던진다.
    if (user) {
      //   throw new HttpException(
      //     '이미 존재하는 이메일입니다.',
      //     HttpStatus.CONFLICT,
      //   );
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    return this.userRepository.save({
      email,
      password,
      name,
      age,
    });
  }
}
