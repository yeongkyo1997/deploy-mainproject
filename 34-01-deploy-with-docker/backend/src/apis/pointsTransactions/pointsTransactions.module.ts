import { Module } from '@nestjs/common';
import { PointsTransactionsService } from './pointsTransactions.service';
import { PointsTransactionsResolver } from './pointsTranscations.resolver';
import { PointTransaction } from './entities/pointTransaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PointTransaction, //
      User,
    ]), //
  ],
  controllers: [],
  providers: [
    PointsTransactionsService, //
    PointsTransactionsResolver,
  ],
})
export class PointsTransactionsModule {}
