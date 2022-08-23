import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async create({ impUid, amount, user: _user }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect(); // DB 연결

    ///////////////////////transaction 시작//////////////////////////////
    await queryRunner.startTransaction('SERIALIZABLE'); // transaction 시작
    //===============================================================

    try {
      // 1. pointTransaction의 거래기록 1줄 생성
      const pointTransction = this.pointsTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });

      // await this.pointsTransactionsRepository.save(pointTransction);
      await queryRunner.manager.save(pointTransction); // 저장하는 메서드를 사용하여 저장한다.
      // throw new Error('에러');

      // 2. user의 point 찾기
      // const user = await this.usersRepository.findOne({
      //   where: { id: _user.id },
      // });

      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
        lock: { mode: 'pessimistic_write' },
      });

      // 3. user의 point 업데이트
      // this.usersRepository.update(
      //   { id: _user.id },
      //   { point: user.point + amount },
      // );

      const updatedUser = this.usersRepository.create({
        ...user,
        point: user.point + amount,
      });

      await queryRunner.manager.save(updatedUser); // 저장하는 메서드를 사용하여 저장한다.

      ///////////////////////commit 성공 확정//////////////////////////////
      await queryRunner.commitTransaction(); // commit 성공 확정
      //===============================================================

      // 4. 최종결과 프론트엔드에 리턴
      return pointTransction;
    } catch (err) {
      ////////////////////////////rollback 되돌리기//////////////////////////////
      await queryRunner.rollbackTransaction(); // transaction 취소
      //===============================================================
    } finally {
      ////////////////////////////연결 해제//////////////////////////////
      // await queryRunner.release(); // 연결 해제
      //===============================================================
    }
  }
}
